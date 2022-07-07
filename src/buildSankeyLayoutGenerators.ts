import { SankeyGraph, SankeyLink, SankeyNode, sankey } from 'd3-sankey';

import type { WithGateCountsIgnoringArgs } from './gates';

const SANKEY_PADDING = 20;

interface GateGraphData {
  gate: string;
  count: number;
  totalNANDGates: number;
  childGateGraphs?: GateGraphData[];
}

const buildAllGateGraphData = (gatesWithCounts: {
  [gate: string]: WithGateCountsIgnoringArgs;
}): { [gate: string]: GateGraphData } => {
  const allGateGraphData: { [gate: string]: GateGraphData } = {};

  const buildGateGraphData = (gate: string, gateCount = 1): GateGraphData => {
    if (!Object.prototype.hasOwnProperty.call(gatesWithCounts, gate)) {
      return { gate, count: gateCount, totalNANDGates: 0 };
    } else if (gate === 'nand') {
      return { gate, count: gateCount, totalNANDGates: gateCount };
    }

    let totalNANDGates = 0;
    const childGateGraphs: GateGraphData[] = [];
    for (const childGate of Object.keys(gatesWithCounts[gate].gateCounts)) {
      const childGateCount = gateCount * gatesWithCounts[gate].gateCounts[childGate];
      const childGateGraphData = buildGateGraphData(childGate, childGateCount);
      totalNANDGates += childGateGraphData.totalNANDGates;
      childGateGraphs.push(childGateGraphData);
    }

    return { gate, count: gateCount, totalNANDGates, childGateGraphs };
  };

  for (const gate of Object.keys(gatesWithCounts)) {
    allGateGraphData[gate] = buildGateGraphData(gate);
  }

  return allGateGraphData;
};

interface GateNode {
  gate: string;
  displayText?: string;
  count: number;
  totalNANDGates: number;
}
interface GateLink {
  totalNumGates: number;
}
interface SankeyLayoutGenerators {
  [gate: string]: (width: number, height: number) => SankeyGraph<GateNode, GateLink>;
}

export type SankeyGateNode = SankeyNode<GateNode, GateLink>;
export type SankeyGateLink = SankeyLink<GateNode, GateLink>;
export const buildSankeyLayoutGenerators = (gatesWithCounts: {
  [gate: string]: WithGateCountsIgnoringArgs;
}): [SankeyLayoutGenerators, { [gate: string]: GateGraphData }] => {
  const allGateGraphData = buildAllGateGraphData(gatesWithCounts);
  const sankeyLayouts: SankeyLayoutGenerators = {};

  for (const gate of Object.keys(allGateGraphData)) {
    const nodes: SankeyGateNode[] = [];
    const links: SankeyGateLink[] = [];

    if (gate === 'nand') {
      nodes.push({ gate: 'in', displayText: 'NAND', count: 1, totalNANDGates: 1 });
      nodes.push({ gate: 'nand', displayText: 'NAND', count: 1, totalNANDGates: 1 });
      links.push({ source: 'in', target: 'nand', value: 1, totalNumGates: 1 });
    } else {
      const nodesById: { [gate: string]: SankeyGateNode } = {};
      const linksById: { [sourceTarget: string]: SankeyGateLink } = {};
      const traverseGraph = (graph: GateGraphData) => {
        if (!Object.prototype.hasOwnProperty.call(nodesById, graph.gate)) {
          nodesById[graph.gate] = { gate: graph.gate, count: 0, totalNANDGates: 0 };
          nodes.push(nodesById[graph.gate]);
        }
        nodesById[graph.gate].totalNANDGates += graph.totalNANDGates;
        nodesById[graph.gate].count += graph.count;

        if (graph.childGateGraphs) {
          for (const childGraph of graph.childGateGraphs) {
            const linkId = `${graph.gate}-${childGraph.gate}`;
            if (!Object.prototype.hasOwnProperty.call(linksById, linkId)) {
              linksById[linkId] = {
                source: graph.gate,
                target: childGraph.gate,
                value: 0,
                totalNumGates: 0,
              };
              links.push(linksById[linkId]);
            }
            linksById[linkId].value += childGraph.totalNANDGates;
            linksById[linkId].totalNumGates += childGraph.count;

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

  return [sankeyLayouts, allGateGraphData];
};

export const getGateName = (gate: SankeyGateNode): string =>
  gate.displayText || gate.gate.toUpperCase();
