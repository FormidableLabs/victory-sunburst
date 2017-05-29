/* eslint-disable no-magic-numbers */
import React from "react";
import filesize from "filesize";
import { VictorySunburst } from "../src/index";
import { buildHierarchy } from "./utils";
import stats from "json!./stats.json"; // eslint-disable-line import/no-unresolved

const data = buildHierarchy(stats.modules);
const fontSize = 14;
const lineHeight = fontSize * 1.4;
const size = 800;
const tooltipHeight = fontSize * 6;
const tooltipOffset = 20;

const svgStyles = {
  height: size,
  overflow: "visible",
  viewBox: `0 0 ${size} ${size}`,
  width: size
};
const tooltipStyles = {
  fill: "white",
  height: tooltipHeight,
  opacity: 0.7,
  rx: 4,
  ry: 4,
  stroke: "gray",
  strokeOpacity: 0.5,
  strokeWidth: 0.5,
  width: 210
};
const textStyles = {
  fill: "black",
  fontFamily: "Helvetica",
  fontSize
};
const tspanStyles = {
  alignmentBaseline: "middle",
  x: 18,
  y: tooltipHeight / 2
};

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleArcHover = this.handleArcHover.bind(this);
  }

  handleArcHover(activeNode, ev) {
    const newState = { activeNode };
    if (ev) {
      newState.tooltipX = ev.clientX;
      newState.tooltipY = ev.clientY;
    }
    this.setState(newState);
  }

  render() {
    const { activeNode, tooltipX, tooltipY } = this.state;
    const translate = `translate(${tooltipX + tooltipOffset},${tooltipY + tooltipOffset})`;

    return (
      <svg {...svgStyles}>
        <VictorySunburst
          data={data}
          onArcHover={this.handleArcHover}
          height={size}
          width={size}
        />
        {activeNode ? (
          <g transform={translate}>
            <rect {...tooltipStyles} />
            <text {...textStyles}>
              <tspan dy={-lineHeight} fontWeight="bold" {...tspanStyles}>
                {activeNode.data.name}
              </tspan>
              <tspan dy={0} {...tspanStyles}>
                {`${(activeNode.data.size / data.size * 100).toFixed(2)}%`}
              </tspan>
              <tspan dy={lineHeight} {...tspanStyles}>
                {filesize(activeNode.data.size)}
              </tspan>
            </text>
          </g>
        ) : null}
      </svg>
    );
  }
}
