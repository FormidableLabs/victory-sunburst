/* eslint-disable no-magic-numbers */
import * as d3Hierarchy from "d3-hierarchy";
import * as d3Shape from "d3-shape";
import * as d3Scale from "d3-scale";
import { Helpers, Style } from "victory-core";

export default {
  getBaseProps(props, fallbackProps) {
    props = Helpers.modifyProps(props, fallbackProps, "sunburst");
    const calculatedValues = this.getCalculatedValues(props);
    const { arcs, style, pathFunction } = calculatedValues;
    const childProps = {
      parent: {
        standalone: props.standalone, arcs, pathFunction,
        width: props.width, height: props.height, style: style.parent
      }
    };

    return childProps;
  },

  getCalculatedValues(props) {
    const { colorScale, data, theme } = props;
    const styleObject = theme && theme.sunburst && theme.sunburst.style ? theme.sunburst.style : {};
    const style = Helpers.getStyles(props.style, styleObject, "auto", "100%");
    const padding = Helpers.getPadding(props);
    const radius = this.getRadius(props, padding);
    const arcs = this.getArcs(props, data);

    const colors = d3Scale.scaleOrdinal(
      Array.isArray(colorScale) ?
      colorScale :
      Style.getColorScale(colorScale)
    );

    const xScale = d3Scale.scaleLinear()
      .range([0, Math.PI * 2]);

    const yScale = d3Scale.scaleSqrt()
      .range([0, radius]);

    const pathFunction = d3Shape.arc()
      .startAngle((d) => xScale(d.x0))
      .endAngle((d) => xScale(d.x1))
      .innerRadius((d) => yScale(d.y0))
      .outerRadius((d) => yScale(d.y1));

    return { arcs, colors, padding, pathFunction, style };
  },

  getRadius(props, padding) {
    return Math.min(
      props.width - padding.left - padding.right,
      props.height - padding.top - padding.bottom
    ) / 2;
  },

  getArcs(props, data) {
    const root = d3Hierarchy.hierarchy(data, (d) => d.children)
      .sum((d) => {
        return d.children ? 0 : 1;
      })
      .sort(props.sort ? (a, b) => {
        return b.value - a.value;
      } : null);

    const partition = d3Hierarchy.partition();

    const nodes = partition(root).descendants()
      .filter((d) => { return (d.x1 - d.x0) > props.minRadians; });

    return nodes;
  }
};
