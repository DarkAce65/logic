import { SankeyGraph, SankeyLinkMinimal, SankeyNodeMinimal, sankey } from 'd3-sankey';

import { WithGateCounts } from './main';

const SANKEY_PADDING = 20;

interface GateGraphData {
  gate: string;
  totalNANDGates: number;
  childGateGraphs?: GateGraphData[];
}

const buildAllGateGraphData = (gatesWithCounts: {
  [gate: string]: WithGateCounts;
}): { [gate: string]: GateGraphData } => {
  const allGateGraphData: { [gate: string]: GateGraphData } = {};

  const buildGateGraphData = (gate: string, gateCount = 1): GateGraphData => {
    if (!Object.prototype.hasOwnProperty.call(gatesWithCounts, gate)) {
      return { gate, totalNANDGates: 0 };
    } else if (gate === 'nand') {
      return { gate, totalNANDGates: gateCount };
    }

    let totalNANDGates = 0;
    const childGateGraphs: GateGraphData[] = [];
    for (const childGate of Object.keys(gatesWithCounts[gate].gateCounts)) {
      const childGateCount = gateCount * gatesWithCounts[gate].gateCounts[childGate];
      const childGateGraphData = buildGateGraphData(childGate, childGateCount);
      totalNANDGates += childGateGraphData.totalNANDGates;
      childGateGraphs.push(childGateGraphData);
    }

    return { gate, totalNANDGates, childGateGraphs };
  };

  for (const gate of Object.keys(gatesWithCounts)) {
    allGateGraphData[gate] = buildGateGraphData(gate);
  }

  return allGateGraphData;
};

interface Node {
  gate: string;
  displayText?: string;
  totalNANDGates: number;
}
interface Link {}
interface SankeyLayoutGenerators {
  [gate: string]: (width: number, height: number) => SankeyGraph<Node, Link>;
}

export const buildSankeyLayoutGenerators = (gatesWithCounts: {
  [gate: string]: WithGateCounts;
}): SankeyLayoutGenerators => {
  const allGateGraphData = buildAllGateGraphData(gatesWithCounts);
  const sankeyLayouts: SankeyLayoutGenerators = {};

  for (const gate of Object.keys(allGateGraphData)) {
    const nodes: (SankeyNodeMinimal<Node, Link> & Node)[] = [];
    const links: (SankeyLinkMinimal<Node, Link> & Link)[] = [];

    if (gate === 'nand') {
      nodes.push({ gate: 'nand', displayText: 'nand', totalNANDGates: 1 });
      nodes.push({ gate: 'nand-out', displayText: 'nand', totalNANDGates: 1 });
      links.push({ source: 'nand', target: 'nand-out', value: 1 });
    } else {
      const nodesById: { [gate: string]: SankeyNodeMinimal<Node, Link> & Node } = {};
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
    }

    sankeyLayouts[gate] = (width, height) =>
      sankey<Node, Link>()
        .nodeId((node) => node.gate)
        .extent([
          [SANKEY_PADDING, SANKEY_PADDING],
          [width - SANKEY_PADDING, height - SANKEY_PADDING],
        ])({ nodes, links });
  }

  return sankeyLayouts;
};
