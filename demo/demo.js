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

  handleDataMouseOver({ clientX, clientY }, { index }) {
    const { activeNodeIndex } = this.state;
    const newState = { clientX, clientY };
    if (!activeNodeIndex) {
      newState.activeNodeIndex = index;
    }
    this.setState(newState);
  }

  handleDataMouseOut() {
    this.setState({ activeNodeIndex: null });
  }

  render() {
    return (
      <VictorySunburst
        activeNodeIndex={this.state.activeNodeIndex}
        events={[{
          target: "data",
          eventHandlers: {
            onMouseOver: this.handleDataMouseOver,
            onMouseOut: this.handleDataMouseOut
          }
        }]}
      />
    );
  }
}
