/*global document:false*/
import React from "react";
import {VictorySunburst} from "../src/index";
import flare from "../flare.js";


class App extends React.Component {
  render() {
    return (
      <VictorySunburst data={flare}/>
    );
  }
}

const content = document.getElementById("content");

React.render(<App/>, content);
