import React from "react";
import Radium from "radium";
import d3 from "d3";
import _ from "lodash";

@Radium
class VictorySunburst extends React.Component {


  drawSunburst () {
    const x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    const y = d3.scale.sqrt()
        .range([0, this.props.radius(this.props.width, this.props.height)]);

    const color = d3.scale.category20c();

    const partition = d3.layout.partition()
        .sort(null)
        .value((d) => { return 1; });

    const arc = d3.svg.arc()
      .startAngle((d) => { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
      .endAngle((d) => { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
      .innerRadius((d) => { return Math.max(0, y(d.y)); })
      .outerRadius((d) => { return Math.max(0, y(d.y + d.dy)); });

    const sunburstArcs = partition.nodes(this.props.data).map((node) => {
      return (
        <g>
        <path
          d={ arc(node) }
          fill={color( (node.children ? node : node.parent).name) }
          stroke={"white"}/>
        </g>
      )
    })

    return sunburstArcs;
  }



  render() {
    return (
      <svg width={this.props.width} height={this.props.height}>
        <g transform={
          "translate(" +
            this.props.width / 2 +
            "," +
            (this.props.height / 2 + 10) +
          ")"
          }>
          {this.drawSunburst()}
        </g>
      </svg>
    );
  }
}

VictorySunburst.propTypes = {
  color: React.PropTypes.string
};

VictorySunburst.defaultProps = {
  width: 960,
  height: 700,
  radius: (width, height) => { return Math.min(width, height) / 2 },
}

export default VictorySunburst;
