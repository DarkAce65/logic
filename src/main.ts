import { sankeyLinkHorizontal } from 'd3-sankey';
import 'd3-transition';
import { create as d3Create } from 'd3-selection';

import { and } from './basic/and';
import { nand } from './basic/nand';
import { not } from './basic/not';
import { or } from './basic/or';
import { xor } from './basic/xor';
import { buildSankeyLayoutGenerators } from './buildSankeyLayoutGenerators';
import { debounce } from './utils/debounce';

import './main.scss';

export type Bool = 0 | 1;
export interface WithGateCounts {
  gateCounts: { [gate: string]: number };
}

const ALL_GATES: { [gate: string]: WithGateCounts } = { and, nand, not, or, xor };

const TEXT_PADDING = 10;
const ANIMATION_DURATION = 500;
const EXIT_ANIMATION_DURATION = 200;

const sankeyLayouts = buildSankeyLayoutGenerators(ALL_GATES);

let updateGraph: (gate: string) => void;
const renderGateVisualizations = (element: HTMLElement): ((gate: string) => void) => {
  let width = element.clientWidth;
  let height = element.clientHeight;

  const svg = d3Create('svg').style('font', '10px sans-serif');

  const nodes = svg.append('g');
  const links = svg.append('g');
  const text = svg.append('g').attr('font-size', 16);

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
      .selectAll<SVGRectElement, typeof sankeyLayout.nodes[number]>('rect')
      .data(sankeyLayout.nodes, (d) => d.gate)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('x', (d) => d.x0!)
            .attr('y', (d) => d.y0!)
            .attr('height', (d) => d.y1! - d.y0!)
            .attr('width', (d) => d.x1! - d.x0!)
            .style('opacity', 0),
        (update) => update,
        (exit) => exit.transition().duration(EXIT_ANIMATION_DURATION).style('opacity', 0).remove()
      )
      .on('click', (_, d) => {
        updateGraph(d.gate);
      })
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', (d) => d.x0!)
      .attr('y', (d) => d.y0!)
      .attr('height', (d) => d.y1! - d.y0!)
      .attr('width', (d) => d.x1! - d.x0!)
      .style('opacity', 1);

    const paths = links
      .selectAll<SVGPathElement, typeof sankeyLayout.links[number]>('path')
      .data(
        sankeyLayout.links,
        ({ source, target }) =>
          `${typeof source === 'string' || typeof source === 'number' ? source : source.gate}-${
            typeof target === 'string' || typeof target === 'number' ? target : target.gate
          }`
      )
      .join(
        (enter) => {
          const p = enter.append('path');
          p.append('title').text((d) => d.value);
          return p
            .attr('stroke-opacity', 0)
            .attr('stroke-width', ({ width: w }) => Math.max(1, w!));
        },
        (update) => update,
        (exit) =>
          exit.transition().duration(EXIT_ANIMATION_DURATION).attr('stroke-opacity', 0).remove()
      )
      .style('fill', 'none')
      .style('stroke', '#000');
    paths
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke-width', ({ width: w }) => Math.max(1, w!))
      .attr('stroke-opacity', 0.2);

    text
      .selectAll<SVGTextElement, typeof sankeyLayout.nodes[number]>('text')
      .data(sankeyLayout.nodes, (d) => d.gate)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('x', (d) => (d.x0! < width / 2 ? d.x1! + TEXT_PADDING : d.x0! - TEXT_PADDING))
            .attr('y', (d) => (d.y1! + d.y0!) / 2)
            .style('opacity', 0),
        (update) => update,
        (exit) => exit.transition().duration(EXIT_ANIMATION_DURATION).style('opacity', 0).remove()
      )
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', (d) => (d.x0! < width / 2 ? d.x1! + TEXT_PADDING : d.x0! - TEXT_PADDING))
      .attr('y', (d) => (d.y1! + d.y0!) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => (d.x0! < width / 2 ? 'start' : 'end'))
      .style('opacity', 1)
      .text((d) => `${d.displayText || d.gate} ${d.totalNANDGates}`);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  const render = renderGateVisualizations(document.querySelector('#sankeyContainer')!);

  const gateSelector = document.createElement('select');
  for (const gate of Object.keys(sankeyLayouts)) {
    const option = document.createElement('option');
    option.value = gate;
    option.text = gate;
    gateSelector.appendChild(option);
  }
  document.querySelector('#controls')!.appendChild(gateSelector);

  updateGraph = (gate: string): void => {
    if (!Object.prototype.hasOwnProperty.call(sankeyLayouts, gate) || gateSelector.value === gate) {
      return;
    }

    gateSelector.value = gate;
    render(gate);
  };

  updateGraph('nand');

  gateSelector.addEventListener('change', (evt) => {
    render((evt.target as HTMLInputElement).value);
  });

  window.addEventListener(
    'resize',
    debounce(() => {
      render(gateSelector.value);
    }, 250)
  );
});
