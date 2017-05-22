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
    radius: PropTypes.func,
    width: CustomPropTypes.nonNegative
  };

  static defaultProps = {
    colorScale: d3Scale.schemeCategory20,
    data: flare,
    displayCore: false,
    height: 700,
    minRadians: 0,
    radius: (width, height) => Math.min(width, height) / 2,
    width: 700
  };

  constructor() {
    super();
    this.state = {};
  }

  drawSunburst() {
    const {
      colorScale,
      data,
      displayCore,
      height,
      minRadians,
      radius: getRadius,
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
      .sort(null);

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
        onMouseEnter={() => this.onArcHover(node)}
        onMouseLeave={() => this.onArcHover()}
        style={{ cursor: "pointer" }}
        stroke="white"
      />
    ));

    return sunburstArcs;
  }

  onArcHover(activeNode) {
    this.setState({ activeNode });
  }

  render() {
    const { height, width } = this.props;
    const { activeNode } = this.state;

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {activeNode ? (
            <text fill="black" fontSize={20} textAnchor="middle" fontFamily="Helvetica">
              <tspan x="0">
                {activeNode.data.name}
              </tspan>
              <tspan x="0" dy={20}>
                {`${(Math.abs(activeNode.x1 - activeNode.x0) * 100).toFixed(2)}%`}
              </tspan>
              <tspan x="0" dy={20}>{"of bundle size"}</tspan>
            </text>
          ) : null}
          {this.drawSunburst()}
        </g>
      </svg>
    );
  }
}

export default VictorySunburst;
