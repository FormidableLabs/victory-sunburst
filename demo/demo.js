/* eslint-disable no-magic-numbers */
import React from "react";
import filesize from "filesize";
import { VictorySunburst } from "../src/index";
import { buildHierarchy } from "./utils";
import flare from "./flare.js";

// const data = buildHierarchy(stats.modules);
const data = flare;
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
const rectStyles = {
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
    this.handleDataMouseOver = this.handleDataMouseOver.bind(this);
    this.handleDataMouseOut = this.handleDataMouseOut.bind(this);
  }

  handleDataMouseOver(ev, { datum, index }) {
    ev.preventDefault();
    ev.stopPropagation();

    const { activeNode } = this.state;
    const newState = { tooltipX: ev.clientX, tooltipY: ev.clientY };

    if (!activeNode || activeNode.index !== index) {
      newState.activeNode = datum;
    }

    this.setState(newState);
  }

  handleDataMouseOut(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.setState({ activeNode: null });
  }

  render() {
    const { activeNode, tooltipX, tooltipY } = this.state;
    const translate = `translate(${tooltipX + tooltipOffset},${tooltipY + tooltipOffset})`;

    return (
      <svg {...svgStyles}>
        <VictorySunburst
          data={data}
          height={size}
          width={size}
          events={[{
            target: "data",
            eventHandlers: {
              onMouseOver: this.handleDataMouseOver,
              onMouseOut: this.handleDataMouseOut
            }
          }]}
        />
        {activeNode ? (
          <g transform={translate}>
            <rect {...rectStyles} />
            <text {...textStyles}>
              <tspan dy={-lineHeight} fontWeight="bold" {...tspanStyles}>
                {activeNode.data.name}
              </tspan>
              <tspan dy={0} {...tspanStyles}>
                {`${(activeNode.data.size / activeNode.parent.data.size * 100).toFixed(2)}%`}
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
