/* eslint-disable no-magic-numbers */
import React from "react";
import PropTypes from "prop-types";
import { PropTypes as CustomPropTypes } from "victory-core";
import * as d3Hierarchy from "d3-hierarchy";
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import flare from "../../flare.js";

class VictorySunburst extends React.Component {
  static displayName = "VictorySunburst";

  static propTypes = {
    colorScale: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.oneOf([
        "grayscale", "qualitative", "heatmap", "warm", "cool", "red", "green", "blue"
      ])
    ]),
    data: PropTypes.object,
    displayCore: PropTypes.bool,
    height: CustomPropTypes.nonNegative,
    minRadians: CustomPropTypes.nonNegative,
    onArcHover: PropTypes.func,
    radius: PropTypes.func,
    sort: PropTypes.bool,
    width: CustomPropTypes.nonNegative
  };

  static defaultProps = {
    colorScale: d3Scale.schemeCategory20,
    data: flare,
    displayCore: false,
    height: 700,
    minRadians: 0,
    radius: (width, height) => Math.min(width, height) / 2,
    sort: true,
    width: 700
  };

  drawSunburst() {
    const {
      colorScale,
      data,
      displayCore,
      height,
      minRadians,
      onArcHover,
      radius: getRadius,
      sort,
      width
    } = this.props;

    const radius = getRadius(width, height);
    const color = d3Scale.scaleOrdinal(colorScale);
    const partition = d3Hierarchy.partition();

    const xScale = d3Scale.scaleLinear()
      .range([0, Math.PI * 2]);

    const yScale = d3Scale.scaleSqrt()
      .range([0, radius]);

    const arc = d3Shape.arc()
      .startAngle((d) => xScale(d.x0))
      .endAngle((d) => xScale(d.x1))
      .innerRadius((d) => yScale(d.y0))
      .outerRadius((d) => yScale(d.y1));

    const root = d3Hierarchy.hierarchy(data, (d) => d.children)
      .sum((d) => {
        return d.children ? 0 : 1;
      })
      .sort(sort ? (a, b) => {
        return b.value - a.value;
      } : null);

    const nodes = partition(root).descendants()
      .filter((d) => {
        return (d.x1 - d.x0) > minRadians;
      });

    const sunburstArcs = nodes.map((node, i) => (
      <path
        key={`arc-${i}`}
        d={arc(node)}
        display={node.depth || displayCore ? null : "none"}
        fill={color((node.children ? node : node.parent).data.name)}
        onMouseOver={(ev) => onArcHover(node, ev)}
        onMouseOut={() => onArcHover()}
        style={{ cursor: "pointer" }}
        stroke="white"
      />
    ));

    return sunburstArcs;
  }

  render() {
    const { height, width } = this.props;

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {this.drawSunburst()}
        </g>
      </svg>
    );
  }
}

export default VictorySunburst;
