/* eslint-disable no-magic-numbers */
import React from "react";
import { VictoryTooltip } from "victory-core";
import { VictorySunburst } from "../src/index";
// import flare from "./flare.js";

export default class App extends React.Component {
  render() {
    return (
      <div>
        <VictorySunburst
          name="fixedLabel"
          style={{
            data: { cursor: "pointer", stroke: "white" },
            labels: {
              fill: (datum, active) => { return active === false ? "none" : "#ADDFFF"; },
              textAnchor: "middle",
              verticalAnchor: "middle"
            }
          }}
        />
        <VictorySunburst
          name="fixedTooltip"
          colorScale="red"
          labelComponent={<VictoryTooltip active height={30} width={40} />}
        />
        <VictorySunburst
          name="hoverTooltip"
          colorScale="green"
          labelComponent={
            <VictoryTooltip
              orientation="bottom" pointerLength={0} height={40} width={60}
              x={0} y={0} dx={0} dy={-20}
            />
          }
          labels={({ data: { name, size } }, totalSize) => {
            return `${name}: ${size}\n(${Math.round(size / totalSize * 100)}%)`;
          }}
        />
      </div>
    );
  }
}
