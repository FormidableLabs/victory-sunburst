/* eslint-disable no-magic-numbers */
import React from "react";
import { VictorySunburst } from "../src/index";
// import flare from "./flare.js";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleDataMouseOver = this.handleDataMouseOver.bind(this);
    this.handleDataMouseOut = this.handleDataMouseOut.bind(this);
  }

  handleDataMouseOver(ev, props, index, parent) { // eslint-disable-line max-params
    const { activeNodeIndex } = this.state;
    let newState = { clientX: ev.clientX, clientY: ev.clientY };
    if (!activeNodeIndex) {
      newState = {
        ...newState,
        activeName: parent.props.name,
        activeNodeIndex: parseInt(index)
      };
    }
    this.setState(newState);
  }

  handleDataMouseOut() {
    this.setState({ activeName: null, activeNodeIndex: null });
  }

  render() {
    const { activeName, activeNodeIndex, clientX, clientY } = this.state;
    return (
      <div>
        <VictorySunburst
          name="fixedTooltip"
          alwaysDisplayLabel
          activeNodeIndex={activeName === "fixedTooltip" ? activeNodeIndex : 0}
          events={[{
            target: "data",
            eventHandlers: {
              onMouseOver: this.handleDataMouseOver,
              onMouseOut: this.handleDataMouseOut
            }
          }]}
        />
        <VictorySunburst
          name="movingTooltip"
          activeNodeIndex={activeName === "movingTooltip" ? activeNodeIndex : 0}
          colorScale="red"
          events={[{
            target: "data",
            eventHandlers: {
              onMouseOver: this.handleDataMouseOver,
              onMouseOut: this.handleDataMouseOut
            }
          }]}
          labelProps={{
            x: clientX - 400,
            y: clientY,
            dx: 10,
            dy: 10
          }}
        />
      </div>
    );
  }
}
