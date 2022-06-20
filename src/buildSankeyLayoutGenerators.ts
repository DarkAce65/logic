import { SankeyGraph, SankeyLink, SankeyNode, sankey } from 'd3-sankey';

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

interface GateNode {
  gate: string;
  displayText?: string;
  totalNANDGates: number;
}
interface GateLink {}
interface SankeyLayoutGenerators {
  [gate: string]: (width: number, height: number) => SankeyGraph<GateNode, GateLink>;
}

export type SankeyGateNode = SankeyNode<GateNode, GateLink>;
export type SankeyGateLink = SankeyLink<GateNode, GateLink>;
export const buildSankeyLayoutGenerators = (gatesWithCounts: {
  [gate: string]: WithGateCounts;
}): SankeyLayoutGenerators => {
  const allGateGraphData = buildAllGateGraphData(gatesWithCounts);
  const sankeyLayouts: SankeyLayoutGenerators = {};

  for (const gate of Object.keys(allGateGraphData)) {
    const nodes: SankeyGateNode[] = [];
    const links: SankeyGateLink[] = [];

    if (gate === 'nand') {
      nodes.push({ gate: 'in', displayText: 'NAND', totalNANDGates: 1 });
      nodes.push({ gate: 'nand', displayText: 'NAND', totalNANDGates: 1 });
      links.push({ source: 'in', target: 'nand', value: 1 });
    } else {
      const nodesById: { [gate: string]: SankeyGateNode } = {};
      const traverseGraph = (graph: GateGraphData) => {
        if (Object.prototype.hasOwnProperty.call(nodesById, graph.gate)) {
          nodesById[graph.gate].totalNANDGates += graph.totalNANDGates;
        } else {
          nodesById[graph.gate] = { gate: graph.gate, totalNANDGates: graph.totalNANDGates };
          nodes.push(nodesById[graph.gate]);
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
      sankey<GateNode, GateLink>()
        .nodeId((node) => node.gate)
        .nodeSort((a, b) => b.totalNANDGates - a.totalNANDGates)
        .extent([
          [SANKEY_PADDING, SANKEY_PADDING],
          [width - SANKEY_PADDING, height - SANKEY_PADDING],
        ])({ nodes, links });
  }

  return sankeyLayouts;
};
