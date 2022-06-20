import { sankeyLinkHorizontal } from 'd3-sankey';
import 'd3-transition';
import { create as d3Create, select } from 'd3-selection';

import { and } from './basic/and';
import { nand } from './basic/nand';
import { not } from './basic/not';
import { or } from './basic/or';
import { xor } from './basic/xor';
import {
  SankeyGateLink,
  SankeyGateNode,
  buildSankeyLayoutGenerators,
} from './buildSankeyLayoutGenerators';
import { debounce } from './utils/debounce';

import './main.scss';

export type Bool = 0 | 1;
interface GateFunction<T extends Bool[]> {
  (...args: T): Bool;
}
export interface WithGateCounts<T extends Bool[] = Bool[]> extends GateFunction<T> {
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

  const svg = d3Create('svg')
    .style('font-size', '16px')
    .style(
      'font-family',
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"'
    );

  const text = svg.append('g').attr('font-size', 16);
  const links = svg.append('g').style('mix-blend-mode', 'multiply');
  const nodes = svg.append('g');
  const tooltip = select(element).append('div').attr('id', 'tooltip');

  element.appendChild(svg.node()!);

  return (gate: string) => {
    tooltip.classed('active', false);

    width = element.clientWidth;
    height = element.clientHeight;

    const sankeyLayout = sankeyLayouts[gate](width, height);

    svg
      .attr('viewBox', [0, 0, width, height])
      .style('width', `${width}px`)
      .style('height', `${height}px`);

    nodes
      .selectAll<SVGRectElement, SankeyGateNode>('rect')
      .data(sankeyLayout.nodes, (d) => d.gate)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('x', (d) => d.x0!)
            .attr('y', (d) => d.y0!)
            .attr('width', (d) => d.x1! - d.x0!)
            .attr('height', (d) => d.y1! - d.y0!)
            .style('opacity', 0),
        (update) => update,
        (exit) =>
          exit
            .transition()
            .duration(EXIT_ANIMATION_DURATION)
            .style('opacity', 0)
            .on('end', function () {
              this.remove();
            })
      )
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        updateGraph(d.gate);
      })
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', (d) => d.x0!)
      .attr('y', (d) => d.y0!)
      .attr('width', (d) => d.x1! - d.x0!)
      .attr('height', (d) => d.y1! - d.y0!)
      .style('opacity', 1);

    links
      .selectAll<SVGPathElement, SankeyGateLink>('path')
      .data(
        sankeyLayout.links,
        ({ source, target }) =>
          `${(source as SankeyGateNode).gate}-${(target as SankeyGateNode).gate}`
      )
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('stroke-width', ({ width: w }) => Math.max(1, w!))
            .style('stroke-opacity', 0),
        (update) => update,
        (exit) =>
          exit
            .transition()
            .duration(EXIT_ANIMATION_DURATION)
            .style('stroke-opacity', 0)
            .on('end', function () {
              this.remove();
            })
      )
      .style('fill', 'none')
      .style('stroke', '#000')
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke-width', ({ width: w }) => Math.max(1, w!))
      .style('stroke-opacity', 0.2)
      .selection()
      .on('mouseenter', function (evt: MouseEvent, d) {
        select(this).interrupt('hover').style('stroke-opacity', 0.4);
        tooltip
          .classed('active', true)
          .text(d.value === 1 ? `${d.value} NAND gate` : `${d.value} NAND gates`)
          .style('top', `${evt.clientY}px`)
          .style('left', `${evt.clientX + 15}px`);
      })
      .on('mousemove', (evt: MouseEvent) => {
        tooltip.style('top', `${evt.clientY}px`).style('left', `${evt.clientX + 15}px`);
      })
      .on('mouseleave', function () {
        select(this)
          .transition('hover')
          .duration(EXIT_ANIMATION_DURATION)
          .style('stroke-opacity', 0.2);
        tooltip.classed('active', false);
      });

    text
      .selectAll<SVGTextElement, SankeyGateNode>('text')
      .data(sankeyLayout.nodes, (d) => d.gate)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('x', (d) => (d.x0! < width / 2 ? d.x1! + TEXT_PADDING : d.x0! - TEXT_PADDING))
            .attr('y', (d) => (d.y1! + d.y0!) / 2)
            .style('opacity', 0),
        (update) => update,
        (exit) =>
          exit
            .transition()
            .duration(EXIT_ANIMATION_DURATION)
            .style('opacity', 0)
            .on('end', function () {
              this.remove();
            })
      )
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', (d) => (d.x0! < width / 2 ? d.x1! + TEXT_PADDING : d.x0! - TEXT_PADDING))
      .attr('y', (d) => (d.y1! + d.y0!) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => (d.x0! < width / 2 ? 'start' : 'end'))
      .style('opacity', 1)
      .text((d) => `${d.displayText || d.gate.toUpperCase()} ${d.totalNANDGates}`);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  const render = renderGateVisualizations(document.querySelector('#sankeyContainer')!);

  const gateSelector = document.createElement('select');
  for (const gate of Object.keys(sankeyLayouts)) {
    const option = document.createElement('option');
    option.value = gate;
    option.text = gate.toUpperCase();
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
