/* eslint-disable no-magic-numbers */
import React from "react";
import PropTypes from "prop-types";
import { partialRight } from "lodash";
import {
  addEvents, Helpers, PropTypes as CustomPropTypes, Slice, VictoryContainer, VictoryTheme
} from "victory-core";

import SunburstHelpers from "./helper-methods";

const fallbackProps = {
  colorScale: [
    "#ffffff",
    "#f0f0f0",
    "#d9d9d9",
    "#bdbdbd",
    "#969696",
    "#737373",
    "#525252",
    "#252525",
    "#000000"
  ],
  height: 400,
  padding: 30,
  width: 400
};

const animationWhitelist = [
  "data", "height", "padding", "colorScale", "style", "width"
];

class VictorySunburst extends React.Component {
  static displayName = "VictorySunburst";

  static role = "sunburst";

  static defaultTransitions = {
    onExit: {
      duration: 500,
      before: () => {}
    },
    onEnter: {
      duration: 500,
      before: () => {},
      after: () => {}
    }
  };

  static propTypes = {
    animate: PropTypes.object,
    colorScale: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.oneOf([
        "grayscale", "qualitative", "heatmap", "warm", "cool", "red", "green", "blue"
      ])
    ]),
    containerComponent: PropTypes.element,
    data: PropTypes.object,
    dataComponent: PropTypes.element,
    displayCore: PropTypes.bool,
    eventKey: PropTypes.oneOfType([
      PropTypes.func,
      CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]),
      PropTypes.string
    ]),
    events: PropTypes.arrayOf(PropTypes.shape({
      target: PropTypes.oneOf(["data", "parent"]),
      eventKey: PropTypes.oneOfType([
        PropTypes.func,
        CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]),
        PropTypes.string
      ]),
      eventHandlers: PropTypes.object
    })),
    groupComponent: PropTypes.element,
    height: CustomPropTypes.nonNegative,
    minRadians: CustomPropTypes.nonNegative,
    padding: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        top: PropTypes.number, bottom: PropTypes.number,
        left: PropTypes.number, right: PropTypes.number
      })
    ]),
    sharedEvents: PropTypes.shape({
      events: PropTypes.array,
      getEventState: PropTypes.func
    }),
    sortData: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    standalone: PropTypes.bool,
    style: PropTypes.shape({
      parent: PropTypes.object, data: PropTypes.object, labels: PropTypes.object
    }),
    sumBy: PropTypes.oneOf(["count", "size"]),
    theme: PropTypes.object,
    width: CustomPropTypes.nonNegative,
    x: PropTypes.oneOfType([
      PropTypes.func,
      CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]),
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    y: PropTypes.oneOfType([
      PropTypes.func,
      CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]),
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ])
  };

  static defaultProps = {
    colorScale: "blue",
    containerComponent: <VictoryContainer/>,
    data: {
      name: "A",
      children: [
        { name: "B1", size: 5 },
        { name: "B2", size: 10 },
        { name: "B3", size: 5 }
      ]
    },
    dataComponent: <Slice/>,
    displayCore: false,
    groupComponent: <g/>,
    minRadians: 0.001,
    standalone: true,
    style: {
      data: {
        cursor: "pointer",
        stroke: "white"
      }
    },
    sumBy: "size",
    theme: VictoryTheme.grayscale
  };

  static getBaseProps = partialRight(
    SunburstHelpers.getBaseProps.bind(SunburstHelpers),
    fallbackProps
  );
  static expectedComponents = [
    "containerComponent", "dataComponent", "groupComponent"
  ];

  renderSunburstData(props) {
    const { dataComponent } = props;
    const dataComponents = [];

    for (let index = 0, len = this.dataKeys.length; index < len; index++) {
      const dataProps = this.getComponentProps(dataComponent, "data", index);
      dataComponents[index] = React.cloneElement(dataComponent, dataProps);
    }

    return this.renderGroup(props, dataComponents);
  }

  renderGroup(props, children) {
    const offset = this.getOffset(props);
    const transform = `translate(${offset.x}, ${offset.y})`;
    const groupComponent = React.cloneElement(props.groupComponent, { transform });
    return this.renderContainer(groupComponent, children);
  }

  getOffset(props) {
    const { height, width } = props;
    const { padding, radius } = this.baseProps.parent;
    const offsetWidth = width / 2 + padding.left - padding.right;
    const offsetHeight = height / 2 + padding.top - padding.bottom;
    return {
      x: offsetWidth + radius > width ? radius + padding.left - padding.right : offsetWidth,
      y: offsetHeight + radius > height ? radius + padding.top - padding.bottom : offsetHeight
    };
  }

  shouldAnimate() {
    return Boolean(this.props.animate);
  }

  render() {
    const { role } = this.constructor;
    const props = Helpers.modifyProps(this.props, fallbackProps, role);

    if (this.shouldAnimate()) {
      return this.animateComponent(props, animationWhitelist);
    }

    const children = this.renderSunburstData(props);
    return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
  }
}

export default addEvents(VictorySunburst);
