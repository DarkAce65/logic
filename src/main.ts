import { sankeyLinkHorizontal } from 'd3-sankey';
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

const sankeyLayouts = buildSankeyLayoutGenerators(ALL_GATES);

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

window.addEventListener(
  'resize',
  debounce(() => {
    render('xor');
  }, 250)
);
