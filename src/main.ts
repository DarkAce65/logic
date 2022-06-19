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
  childGateGraph?: GateGraphData[];
}
const buildAllGateGraphData = (): { [gate: string]: GateGraphData } => {
  const allGateGraphData: { [gate: string]: GateGraphData } = {};

  const buildGateGraphData = (gate: string): GateGraphData => {
    if (Object.prototype.hasOwnProperty.call(allGateGraphData, gate)) {
      return JSON.parse(JSON.stringify(allGateGraphData[gate]));
    } else if (!Object.prototype.hasOwnProperty.call(ALL_GATES, gate)) {
      return { gate, totalNANDGates: 0 };
    } else if (gate === 'nand') {
      return { gate, totalNANDGates: 1 };
    }

    let totalNANDGates = 0;
    const childGateGraph: GateGraphData[] = [];
    for (const childGate of Object.keys(ALL_GATES[gate].gateCounts)) {
      const gateGraphData = buildGateGraphData(childGate);
      totalNANDGates += gateGraphData.totalNANDGates;
      childGateGraph.push(gateGraphData);
    }

    return { gate, totalNANDGates, childGateGraph };
  };

  for (const gate of Object.keys(ALL_GATES)) {
    allGateGraphData[gate] = buildGateGraphData(gate);
  }

  return allGateGraphData;
};

interface Node {}
interface Link {}
interface SankeyLayouts {
  [gate: string]: (width: number, height: number) => SankeyGraph<Node, Link>;
}
const buildSankeyLayouts = (allGateGraphData: { [gate: string]: GateGraphData }): SankeyLayouts => {
  const sankeyLayouts: SankeyLayouts = {};

  for (const gate of Object.keys(allGateGraphData)) {
    const nodes: (SankeyNodeMinimal<Node, Link> & Node)[] = [];
    const links: (SankeyLinkMinimal<Node, Link> & Link)[] = [];
    nodes.push({});
    nodes.push({});
    nodes.push({});
    links.push({ source: 1, target: 0, value: 1 });
    links.push({ source: 1, target: 2, value: 2 });
    links.push({ source: 0, target: 2, value: 4 });
    sankeyLayouts[gate] = (width, height) =>
      sankey<Node, Link>().extent([
        [50, 50],
        [width - 50, height - 50],
      ])({ nodes, links });
  }

  return sankeyLayouts;
};

const sankeyLayouts = buildSankeyLayouts(buildAllGateGraphData());
console.log(sankeyLayouts);

const renderGateVisualizations = (element: HTMLElement) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const sankeyLayout = sankeyLayouts['xor'](width, height);

  const svg = d3Create('svg')
    .attr('viewBox', [0, 0, width, height])
    .style('font', '10px sans-serif')
    .style('width', `${width}px`)
    .style('height', `${height}px`);

  svg
    .append('g')
    .selectAll('rect')
    .data(sankeyLayout.nodes)
    .join('rect')
    .attr('x', (d) => d.x0!)
    .attr('y', (d) => d.y0!)
    .attr('height', (d) => d.y1! - d.y0!)
    .attr('width', (d) => d.x1! - d.x0!);

  const link = svg
    .append('g')
    // .attr("fill", "none")
    // .attr("stroke-opacity", linkStrokeOpacity)
    .selectAll('g')
    .data(sankeyLayout.links)
    .join('g')
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-opacity', 0.2);
  // .style("mix-blend-mode", linkMixBlendMode);

  link
    .append('path')
    .attr('d', sankeyLinkHorizontal())
    .attr('stroke-width', ({ width: w }) => Math.max(1, w!));
  // .attr("stroke", linkColor === "source-target" ? ({index: i}) => `url(#${uid}-link-${i})`
  //     : linkColor === "source" ? ({source: {index: i}}) => color(G[i])
  //     : linkColor === "target" ? ({target: {index: i}}) => color(G[i])
  //     : linkColor)
  // .attr("stroke-width", ({width}) => Math.max(1, width))
  // .call(Lt ? path => path.append("title").text(({index: i}) => Lt[i]) : () => {});

  svg
    .append('g')
    // .attr("font-family", "sans-serif")
    .attr('font-size', 16)
    .selectAll('text')
    .data(sankeyLayout.nodes)
    .join('text')
    .attr('x', (d) => (d.x0! < width / 2 ? d.x1! + 10 : d.x0! - 10))
    .attr('y', (d) => (d.y1! + d.y0!) / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', (d) => (d.x0! < width / 2 ? 'start' : 'end'))
    .text(() => 'test');

  element.appendChild(svg.node()!);
};

renderGateVisualizations(document.body);
