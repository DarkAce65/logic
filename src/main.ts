import {
  SankeyGraph,
  SankeyLinkMinimal,
  SankeyNodeMinimal,
  sankey,
  sankeyLinkHorizontal,
} from 'd3-sankey';
import { create as d3Create } from 'd3-selection';

import { and } from './basic/and';
import { nand } from './basic/nand';
import { not } from './basic/not';
import { or } from './basic/or';
import { xor } from './basic/xor';

import './main.scss';

export type Bool = 0 | 1;
export interface WithGateCounts {
  gateCounts: { [gate: string]: number };
}

const ALL_GATES: { [gate: string]: WithGateCounts } = { and, nand, not, or, xor };

interface GateGraphData {
  gate: string;
  totalNANDGates: number;
  childGateGraphs?: GateGraphData[];
}
const buildAllGateGraphData = (): { [gate: string]: GateGraphData } => {
  const allGateGraphData: { [gate: string]: GateGraphData } = {};

  const buildGateGraphData = (gate: string, gateCount = 1): GateGraphData => {
    if (!Object.prototype.hasOwnProperty.call(ALL_GATES, gate)) {
      return { gate, totalNANDGates: 0 };
    } else if (gate === 'nand') {
      return { gate, totalNANDGates: gateCount };
    }

    let totalNANDGates = 0;
    const childGateGraphs: GateGraphData[] = [];
    for (const childGate of Object.keys(ALL_GATES[gate].gateCounts)) {
      const childGateCount = gateCount * ALL_GATES[gate].gateCounts[childGate];
      const childGateGraphData = buildGateGraphData(childGate, childGateCount);
      totalNANDGates += childGateGraphData.totalNANDGates;
      childGateGraphs.push(childGateGraphData);
    }

    return { gate, totalNANDGates, childGateGraphs };
  };

  for (const gate of Object.keys(ALL_GATES)) {
    allGateGraphData[gate] = buildGateGraphData(gate);
  }

  return allGateGraphData;
};

interface Node {
  gate: string;
  totalNANDGates: number;
}
interface Link {}
interface SankeyLayouts {
  [gate: string]: (width: number, height: number) => SankeyGraph<Node, Link>;
}
const buildSankeyLayouts = (allGateGraphData: { [gate: string]: GateGraphData }): SankeyLayouts => {
  const sankeyLayouts: SankeyLayouts = {};

  for (const gate of Object.keys(allGateGraphData)) {
    const nodesById: { [gate: string]: SankeyNodeMinimal<Node, Link> & Node } = {};
    const nodes: (SankeyNodeMinimal<Node, Link> & Node)[] = [];
    const links: (SankeyLinkMinimal<Node, Link> & Link)[] = [];

    const traverseGraph = (graph: GateGraphData) => {
      if (Object.prototype.hasOwnProperty.call(nodesById, graph.gate)) {
        nodesById[graph.gate].totalNANDGates += graph.totalNANDGates;
      } else {
        const node = { gate: graph.gate, totalNANDGates: graph.totalNANDGates };
        nodes.push(node);
        nodesById[graph.gate] = node;
      }
      if (graph.childGateGraphs) {
        for (const childGraph of graph.childGateGraphs) {
          links.push({
            source: graph.gate,
            target: childGraph.gate,
            value: childGraph.totalNANDGates,
          });
          traverseGraph(childGraph);
        }
      }
    };
    traverseGraph(allGateGraphData[gate]);

    sankeyLayouts[gate] = (width, height) =>
      sankey<Node, Link>()
        .nodeId((node) => node.gate)
        .extent([
          [50, 50],
          [width - 50, height - 50],
        ])({ nodes, links });
  }

  return sankeyLayouts;
};

const sankeyLayouts = buildSankeyLayouts(buildAllGateGraphData());

const renderGateVisualizations = (element: HTMLElement): ((gate: string) => void) => {
  let width = element.clientWidth;
  let height = element.clientHeight;

  const svg = d3Create('svg').style('font', '10px sans-serif');

  const nodes = svg.append('g');
  const links = svg.append('g');
  const text = svg.append('g');

  element.appendChild(svg.node()!);

  return (gate: string) => {
    width = element.clientWidth;
    height = element.clientHeight;

    const sankeyLayout = sankeyLayouts[gate](width, height);

    svg
      .attr('viewBox', [0, 0, width, height])
      .style('width', `${width}px`)
      .style('height', `${height}px`);

    nodes
      .selectAll('rect')
      .data(sankeyLayout.nodes)
      .join('rect')
      .attr('x', (d) => d.x0!)
      .attr('y', (d) => d.y0!)
      .attr('height', (d) => d.y1! - d.y0!)
      .attr('width', (d) => d.x1! - d.x0!);

    links
      .selectAll('path')
      .data(sankeyLayout.links)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.2)
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke-width', ({ width: w }) => Math.max(1, w!))
      .append('title')
      .text((d) => d.value);

    text
      .attr('font-size', 16)
      .selectAll('text')
      .data(sankeyLayout.nodes)
      .join('text')
      .attr('x', (d) => (d.x0! < width / 2 ? d.x1! + 10 : d.x0! - 10))
      .attr('y', (d) => (d.y1! + d.y0!) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => (d.x0! < width / 2 ? 'start' : 'end'))
      .text((d) => `${d.gate} ${d.totalNANDGates}`);
  };
};

const render = renderGateVisualizations(document.querySelector('#container')!);
render('xor');
