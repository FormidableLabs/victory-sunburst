/* eslint-disable no-magic-numbers */
import React from "react";
import filesize from "filesize";
import { VictorySunburst } from "../src/index";
import flare from "./flare.js";

// import { buildHierarchy } from "./utils";
// const data = buildHierarchy(stats.modules);

const fontSize = 14;
const lineHeight = fontSize * 1.4;
const size = 700;
const tooltipHeight = fontSize * 6;
const tooltipOffset = 10;

const svgStyles = {
  height: size,
  overflow: "visible",
  viewBox: `0 0 ${size} ${size}`,
  width: size
};
const rectStyles = {
  fill: "white",
  height: tooltipHeight,
  opacity: 0.8,
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

  handleDataMouseOver({ clientX, clientY }, { datum }) {
    const { activeNode } = this.state;
    const newState = { clientX, clientY };
    if (!activeNode) {
      newState.activeNode = datum;
    }
    this.setState(newState);
  }

  handleDataMouseOut() {
    this.setState({ activeNode: null });
  }

  render() {
    const { activeNode, clientX, clientY } = this.state;
    const translate = `translate(${clientX + tooltipOffset},${clientY + tooltipOffset})`;

    return (
      <svg {...svgStyles}>
        <VictorySunburst
          data={flare}
          events={[{
            target: "data",
            eventHandlers: {
              onMouseOver: this.handleDataMouseOver,
              onMouseOut: this.handleDataMouseOut
            }
          }]}
          height={size}
          width={size}
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
