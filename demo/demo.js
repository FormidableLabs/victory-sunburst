/* eslint-disable no-magic-numbers */
import React from "react";
import filesize from "filesize";
import { VictorySunburst } from "../src/index";
import { buildHierarchy } from "./utils";
import stats from "json!./stats.json"; // eslint-disable-line import/no-unresolved

const data = buildHierarchy(stats.modules);
const fontSize = 16;
const lineHeight = fontSize * 1.5;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleArcHover = this.handleArcHover.bind(this);
  }

  handleArcHover(activeNode) {
    this.setState({ activeNode });
  }

  render() {
    const { activeNode } = this.state;

    return (
      <svg height={700} width={700}>
        <VictorySunburst
          data={data}
          onArcHover={this.handleArcHover}
        />
        <g transform={`translate(${350},${350})`}>
          {activeNode ? (
            <text fill="black" fontSize={fontSize} textAnchor="middle" fontFamily="Helvetica">
              <tspan x="0" dy={-lineHeight}>
                {activeNode.data.name}
              </tspan>
              <tspan x="0" dy={lineHeight}>
                {`${(activeNode.data.size / data.size * 100).toFixed(2)}%`}
              </tspan>
              <tspan x="0" dy={lineHeight}>
                {filesize(activeNode.data.size)}
              </tspan>
            </text>
          ) : null}
        </g>
      </svg>
    );
  }
}
