/* eslint-disable no-magic-numbers */
import { defaults } from "lodash";
import * as d3Hierarchy from "d3-hierarchy";
import * as d3Shape from "d3-shape";
import * as d3Scale from "d3-scale";
import { Helpers, Style } from "victory-core";

export default {
  getArcStyle(datum, { colors, style }) {
    const fill = this.getColor(datum, colors, style);
    return defaults({}, datum.style, { fill }, style.data);
  },

  getBaseProps(props, fallbackProps) {
    props = Helpers.modifyProps(props, fallbackProps, "sunburst");
    const calculatedValues = this.getCalculatedValues(props);
    const { height, standalone, width } = props;
    const { arcs, data, padding, pathFunction, radius, style } = calculatedValues;
    const childProps = {
      parent: {
        arcs, data, height, padding, pathFunction, radius, standalone, style: style.parent, width
      }
    };

    if (!props.displayCore) {
      arcs[0].style = { ...arcs[0].style, display: "none" };
    }

    for (let index = 0, len = arcs.length; index < len; index++) {
      const datum = arcs[index];
      const eventKey = datum.eventKey || index;
      const dataProps = {
        index, pathFunction, datum,
        style: this.getArcStyle(datum, calculatedValues)
      };

      childProps[eventKey] = { data: dataProps };
    }

    return childProps;
  },

  getCalculatedValues(props) {
    const { colorScale, data, theme } = props;
    const styleObject = theme && theme.sunburst && theme.sunburst.style ? theme.sunburst.style : {};
    const colors = d3Scale.scaleOrdinal(
      Array.isArray(colorScale) ? colorScale : Style.getColorScale(colorScale)
    );
    const style = Helpers.getStyles(props.style, styleObject, "auto", "100%");
    const padding = Helpers.getPadding(props);
    const radius = this.getRadius(props, padding);
    const arcs = this.getArcs(props);
    this.sumNodes(data);

    const xScale = d3Scale.scaleLinear()
      .range([0, Math.PI * 2]);

    const yScale = d3Scale.scaleSqrt()
      .range([0, radius]);

    const pathFunction = d3Shape.arc()
      .startAngle((d) => xScale(d.x0))
      .endAngle((d) => xScale(d.x1))
      .innerRadius((d) => yScale(d.y0))
      .outerRadius((d) => yScale(d.y1));

    return { arcs, colors, data, padding, pathFunction, radius, style };
  },

  getColor(datum, colors, style) {
    if (style && style.data && style.data.fill) {
      return style.data.fill;
    }
    return colors && colors((datum.children ? datum.data : datum.parent.data).name);
  },

  getRadius(props, padding) {
    return Math.min(
      props.width - padding.left - padding.right,
      props.height - padding.top - padding.bottom
    ) / 2;
  },

  getArcs({ data, minRadians, sort, sumBy }) {
    const root = d3Hierarchy.hierarchy(data, (d) => d.children)
      .sum((d) => {
        if (d.children) { return 0; }
        return sumBy === "size" ? d.size : 1;
      })
      .sort(sort ? (a, b) => {
        return b.value - a.value;
      } : null);

    const partition = d3Hierarchy.partition();

    const nodes = partition(root).descendants()
      .filter((d) => {
        return (d.x1 - d.x0) > minRadians;
      });

    return nodes;
  },

  sumNodes(node) {
    if (node.children && node.children.length > 0) {
      node.size = 0;
      for (let i = 0; i < node.children.length; i++) {
        node.size += this.sumNodes(node.children[i]);
      }
    }
    return node.size;
  }
};
