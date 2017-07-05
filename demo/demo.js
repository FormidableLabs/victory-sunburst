/* eslint-disable no-magic-numbers */
import React from "react";
import { VictorySunburst } from "../src/index";
// import flare from "./flare.js";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { clientX: 0, clientY: 0 };
    this.handleDataMouseOver = this.handleDataMouseOver.bind(this);
    this.handleDataMouseOut = this.handleDataMouseOut.bind(this);
  }

  // eslint-disable-next-line max-params
  handleDataMouseOver({ clientX, clientY }, props, index, parent) {
    let newState = { clientX, clientY };
    if (!this.state.activeNodeIndex) {
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
          labels={(d, totalSize) => {
            return `${d.data.name}: ${d.data.size} (${Math.round(d.data.size / totalSize * 100)}%)`;
          }}
          events={[{
            target: "data",
            eventHandlers: {
              onMouseOver: this.handleDataMouseOver,
              onMouseOut: this.handleDataMouseOut
            }
          }]}
        />
        <VictorySunburst
          displayRoot
          name="movingTooltip"
          colorScale="red"
          activeNodeIndex={activeName === "movingTooltip" ? activeNodeIndex : 0}
          events={[{
            target: "data",
            eventHandlers: {
              onMouseOver: this.handleDataMouseOver,
              onMouseOut: this.handleDataMouseOut
            }
          }]}
        />
      </div>
    );
  }
}
