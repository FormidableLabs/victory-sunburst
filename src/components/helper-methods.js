/* eslint-disable no-magic-numbers */
import { defaults } from "lodash";
import * as d3Hierarchy from "d3-hierarchy";
import * as d3Shape from "d3-shape";
import * as d3Scale from "d3-scale";
import { Helpers, Style } from "victory-core";

export default {
  getSliceStyle(datum, { colors, style }) {
    const fill = this.getColor(datum, colors, style);
    return defaults({}, datum.style, { fill }, style.data);
  },

  getBaseProps(props, fallbackProps) {
    props = Helpers.modifyProps(props, fallbackProps, "sunburst");
    const calculatedValues = this.getCalculatedValues(props);
    const { displayRoot, height, standalone, width } = props;
    const { data, padding, pathFunction, radius, slices, style } = calculatedValues;
    const childProps = {
      parent: {
        data, height, padding, pathFunction, radius, slices, standalone, style: style.parent, width
      }
    };

    if (!displayRoot) {
      slices[0].style = { ...slices[0].style, display: "none" };
    }

    for (let index = 0, len = slices.length; index < len; index++) {
      const datum = slices[index];
      const eventKey = datum.eventKey || index;
      const dataProps = {
        index, pathFunction, datum, slice: datum,
        style: this.getSliceStyle(datum, calculatedValues)
      };

      childProps[eventKey] = { data: dataProps };
    }

    return childProps;
  },

  getCalculatedValues(props) {
    const { colorScale, data, height, theme, width } = props;
    const defaultStyles =
      theme && theme.sunburst && theme.sunburst.style ? theme.sunburst.style : {};
    const componentStyles = defaults({}, props.style, { parent: { height, width } });
    const style = Helpers.getStyles(componentStyles, defaultStyles);
    const padding = Helpers.getPadding(props);
    const radius = this.getRadius(props, padding);
    const slices = this.getSlices(props);
    const colors = d3Scale.scaleOrdinal(
      Array.isArray(colorScale) ? colorScale : Style.getColorScale(colorScale)
    );

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

    return { colors, data, padding, pathFunction, radius, slices, style };
  },

  getColor(datum, colors, style) {
    if (style && style.data && style.data.fill) {
      return style.data.fill;
    }
    return colors && colors((datum.children ? datum.data : datum.parent.data).name);
  },

  getRadius({ width, height }, padding) {
    return Math.min(
      width - padding.left - padding.right,
      height - padding.top - padding.bottom
    ) / 2;
  },

  getSlices({ data, minRadians, sortData, sumBy }) {
    const compareFunction = this.getSort(sortData);
    const root = d3Hierarchy.hierarchy(data, (d) => d.children)
      .sum((d) => {
        if (d.children) { return 0; }
        return sumBy === "size" ? d.size : 1;
      })
      .sort(compareFunction);

    const partition = d3Hierarchy.partition();
    const nodes = partition(root).descendants()
      .filter((d) => {
        return (d.x1 - d.x0) > minRadians;
      });

    return nodes;
  },

  getSort(sortData) {
    let compareFunction = null;
    if (sortData) {
      compareFunction = sortData === true ? (a, b) => {
        return b.value - a.value;
      } : sortData;
    }
    return compareFunction;
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
