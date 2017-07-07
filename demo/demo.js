/* global window */
/* eslint-disable no-magic-numbers */
import React from "react";
import { VictoryTooltip } from "victory-core";
import { VictorySunburst } from "../src/index";
// import flare from "./flare.js";

const size = 400;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleDataMouseMove = this.handleDataMouseMove.bind(this);
    this.handleDataMouseOut = this.handleDataMouseOut.bind(this);
  }

  componentDidMount() {
    const { top, left } = this.sunburst.getBoundingClientRect();
    this.x = left;
    this.y = top;
  }

  handleDataMouseMove(ev, props) {
    const { datum: { data } } = props;
    this.setState({
      activeText: `${data.name}: ${data.size}`,
      clientX: ev.clientX,
      clientY: ev.clientY + window.scrollY
    });
  }

  handleDataMouseOut() {
    this.setState({ clientX: null, clientY: null });
  }

  render() {
    const { activeText, clientX, clientY } = this.state;

    return (
      <div>
        <VictorySunburst/>
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
          labelComponent={
            <VictoryTooltip
              active={(d) => !!d.parent}
              height={30}
              style={{ fill: "black" }}
              width={40}
            />
          }
          labels={(d) => d.data.size}
        />
        <VictorySunburst
          name="fixedHoverTooltip"
          colorScale="green"
          labelComponent={
            <VictoryTooltip
              active={(d) => !d.parent}
              height={40}
              orientation="bottom"
              pointerLength={0}
              style={{ fill: "black" }}
              width={60}
              x={0}
              y={-20}
            />
          }
          labels={(datum, totalSize) => {
            const { data } = datum;
            return `${data.name}: ${data.size}\n(${Math.round(data.size / totalSize * 100)}%)`;
          }}
        />
        <svg
          height={size}
          ref={(el) => { this.sunburst = el; }}
          style={{ overflow: "visible" }}
          viewBox={`0 0 ${size} ${size}`}
          width={size}
        >
          <VictorySunburst
            name="movingHoverTooltip"
            colorScale="qualitative"
            events={[{
              target: "data",
              eventHandlers: {
                onMouseMove: this.handleDataMouseMove,
                onMouseOut: this.handleDataMouseOut
              }
            }]}
            standalone={false}
            style={{ labels: { display: "none" } }}
          />
          <VictoryTooltip
            active={!!clientX && !!clientY}
            pointerLength={0}
            renderInPortal={false}
            style={{ fill: "black" }}
            text={activeText}
            x={clientX - this.x}
            y={clientY - this.y}
          />
        </svg>
      </div>
    );
  }
}
