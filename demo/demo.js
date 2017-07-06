/* eslint-disable no-magic-numbers */
import React from "react";
import { VictoryTooltip } from "victory-core";
import { VictorySunburst } from "../src/index";
// import flare from "./flare.js";

export default class App extends React.Component {
  render() {
    return (
      <div>
        <VictorySunburst />
        <VictorySunburst
          name="fixedLabel"
          colorScale="blue"
          style={{
            labels: {
              fill: (d) => { return !d.parent ? "#004B8F" : "#ADDFFF"; },
              textAnchor: "middle",
              verticalAnchor: "middle"
            }
          }}
        />
        <VictorySunburst
          name="fixedTooltip"
          colorScale="red"
          labelComponent={<VictoryTooltip active={(d) => !!d.parent} height={30} width={40} />}
          labels={(d) => d.data.size}
          style={{
            labels: { fill: "black" }
          }}
        />
        <VictorySunburst
          name="hoverTooltip"
          colorScale="green"
          labelComponent={
            <VictoryTooltip
              active={(d) => !d.parent} orientation="bottom"
              pointerLength={0} height={40} width={60} x={0} y={-20}
            />
          }
          labels={({ data: { name, size } }, totalSize) => {
            return `${name}: ${size}\n(${Math.round(size / totalSize * 100)}%)`;
          }}
          style={{
            labels: { fill: "black" }
          }}
        />
      </div>
    );
  }
}
