import { sankeyLinkHorizontal } from 'd3-sankey';
import 'd3-transition';
import { interpolateSpectral } from 'd3-scale-chromatic';
import { create as d3Create, select } from 'd3-selection';

import {
  SankeyGateLink,
  SankeyGateNode,
  buildSankeyLayoutGenerators,
  getGateName,
} from './buildSankeyLayoutGenerators';
import { ALL_GATES, FLATTENED_GATES } from './gates';
import { debounce } from './utils/debounce';

import './main.scss';

const TEXT_PADDING = 10;
const ANIMATION_DURATION = 750;
const EXIT_ANIMATION_DURATION = 300;

const [sankeyLayouts, gateGraphData] = buildSankeyLayoutGenerators(FLATTENED_GATES);

let updateGraph: (gate: string, fromSelect?: boolean) => void;
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

  let readyTimeout: ReturnType<typeof setTimeout>;
  return (gate: string) => {
    tooltip.classed('active', false);

    clearTimeout(readyTimeout);
    svg.classed('ready', false);
    readyTimeout = setTimeout(() => {
      svg.classed('ready', true);
    }, ANIMATION_DURATION);

    width = element.clientWidth;
    height = element.clientHeight;

    const sankeyLayout = sankeyLayouts[gate](width, height);
    const maxDepth = sankeyLayout.nodes[0].height || 1;

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
            .style('fill', (d) => interpolateSpectral(d.depth! / maxDepth))
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
      .style('fill', (d) => interpolateSpectral(d.depth! / maxDepth))
      .style('opacity', 1);

    links
      .call((l) =>
        l
          .selectAll<SVGLinearGradientElement, SankeyGateLink>('linearGradient')
          .data(
            sankeyLayout.links,
            (d) => `${(d.source as SankeyGateNode).gate}-${(d.target as SankeyGateNode).gate}`
          )
          .join(
            (enter) =>
              enter
                .append('linearGradient')
                .attr(
                  'id',
                  (d) =>
                    `link-${(d.source as SankeyGateNode).gate}-${(d.target as SankeyGateNode).gate}`
                )
                .attr('gradientUnits', 'userSpaceOnUse')
                .attr('x1', (d) => (d.source as SankeyGateNode).x1!)
                .attr('x2', (d) => (d.target as SankeyGateNode).x0!),
            (update) => update,
            (exit) =>
              exit
                .transition()
                .delay(EXIT_ANIMATION_DURATION)
                .on('end', function () {
                  this.remove();
                })
          )
          .transition()
          .duration(ANIMATION_DURATION)
          .attr('x1', (d) => (d.source as SankeyGateNode).x1!)
          .attr('x2', (d) => (d.target as SankeyGateNode).x0!)
          .selection()
          .each(function (d) {
            select(this)
              .selectAll<SVGStopElement, { offset: string; value: number }>('stop')
              .data(
                [
                  { offset: '0%', value: (d.source as SankeyGateNode).depth! / maxDepth },
                  { offset: '100%', value: (d.target as SankeyGateNode).depth! / maxDepth },
                ],
                ({ offset }) => offset
              )
              .join('stop')
              .attr('offset', ({ offset }) => offset)
              .transition()
              .duration(ANIMATION_DURATION)
              .attr('stop-color', ({ value }) => interpolateSpectral(value));
          })
      )
      .selectAll<SVGPathElement, SankeyGateLink>('path')
      .data(
        sankeyLayout.links,
        (d) => `${(d.source as SankeyGateNode).gate}-${(d.target as SankeyGateNode).gate}`
      )
      .join(
        (enter) =>
          enter
            .append('path')
            .classed('link', true)
            .style('stroke', (d) =>
              interpolateSpectral((d.source as SankeyGateNode).depth! / maxDepth)
            )
            .attr('stroke-width', (d) => Math.max(1, d.width!))
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
      .style(
        'stroke',
        (d) =>
          `url(#link-${(d.source as SankeyGateNode).gate}-${(d.target as SankeyGateNode).gate})`
      )
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke-width', (d) => Math.max(1, d.width!))
      .style('stroke-opacity', 0.3)
      .selection()
      .on('mouseenter', function (evt: MouseEvent, d) {
        tooltip
          .classed('active', true)
          .html(() => {
            const gateName = getGateName(d.target as SankeyGateNode);
            const nandGateCountText =
              d.value === 1 ? `${d.value} NAND gate` : `${d.value} NAND gates`;

            if ((d.target as SankeyGateNode).gate === 'nand') {
              return nandGateCountText;
            }

            const gateCountText =
              d.totalNumGates === 1
                ? `${d.totalNumGates} ${gateName} gate`
                : `${d.totalNumGates} ${gateName} gates`;

            return `${gateCountText}<br/><small>(${nandGateCountText})</small>`;
          })
          .style('top', `${evt.clientY}px`)
          .style('left', `${evt.clientX + 15}px`);
      })
      .on('mousemove', (evt: MouseEvent) => {
        tooltip.style('top', `${evt.clientY}px`).style('left', `${evt.clientX + 15}px`);
      })
      .on('mouseleave', function () {
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
            .attr('dy', '0.35em')
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
      .attr('text-anchor', (d) => (d.x0! < width / 2 ? 'start' : 'end'))
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', (d) => (d.x0! < width / 2 ? d.x1! + TEXT_PADDING : d.x0! - TEXT_PADDING))
      .attr('y', (d) => (d.y1! + d.y0!) / 2)
      .style('opacity', 1)
      .text((d) => `${getGateName(d)} (${d.totalNANDGates})`);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  const render = renderGateVisualizations(document.querySelector('#sankeyContainer')!);

  const gateSelector = document.createElement('select');
  for (const categoryOrGate of Object.keys(ALL_GATES)) {
    if (typeof ALL_GATES[categoryOrGate] === 'function') {
      const option = document.createElement('option');
      option.value = categoryOrGate;
      option.text = categoryOrGate.toUpperCase();
      gateSelector.appendChild(option);
    } else {
      const optionGroup = document.createElement('optgroup');
      optionGroup.label = categoryOrGate;
      for (const gate of Object.keys(ALL_GATES[categoryOrGate]).sort(
        (a, b) => gateGraphData[a].totalNANDGates - gateGraphData[b].totalNANDGates
      )) {
        const option = document.createElement('option');
        option.value = gate;
        option.text = gate.toUpperCase();
        optionGroup.appendChild(option);
      }
      gateSelector.appendChild(optionGroup);
    }
  }
  document.querySelector('#gateSelector')!.appendChild(gateSelector);

  updateGraph = (gate: string, fromSelect = false): void => {
    if (!Object.prototype.hasOwnProperty.call(sankeyLayouts, gate)) {
      return;
    }

    if (!fromSelect && gateSelector.value === gate) {
      return;
    } else {
      gateSelector.value = gate;
    }

    const totalNANDGates = gateGraphData[gate].totalNANDGates;
    document.querySelector('#gateStats')!.textContent =
      totalNANDGates === 1
        ? `${totalNANDGates} total NAND gate`
        : `${totalNANDGates} total NAND gates`;
    render(gate);
  };

  gateSelector.value = '';
  updateGraph('nand');
  gateSelector.addEventListener('change', (evt) => {
    updateGraph((evt.target as HTMLInputElement).value, true);
  });

  window.addEventListener(
    'resize',
    debounce(() => {
      render(gateSelector.value);
    }, 250)
  );
});
