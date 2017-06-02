/* eslint-disable no-magic-numbers */
import React from "react";
import PropTypes from "prop-types";
import { partialRight } from "lodash";
import {
  addEvents, Data, Helpers, PropTypes as CustomPropTypes, VictoryContainer, VictoryTheme
} from "victory-core";

import Arc from "./arc";
import SunburstHelpers from "./helper-methods";

const fallbackProps = {
  height: 700,
  padding: 30,
  width: 700,
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
  ]
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
      before: () => ({ _y: 0 })
    },
    onEnter: {
      duration: 500,
      before: () => ({ _y: 0 }),
      after: (datum) => ({ y_: datum._y })
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
    onArcHover: PropTypes.func,
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
    sort: PropTypes.bool,
    standalone: PropTypes.bool,
    style: PropTypes.shape({
      parent: PropTypes.object, data: PropTypes.object, labels: PropTypes.object
    }),
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
    colorScale: "green",
    containerComponent: <VictoryContainer/>,
    data: {
      name: "A",
      children: [{
        name: "B1",
        children: [
          { name: "C1", size: 2 },
          { name: "C2", size: 3 }
        ]
      }, {
        name: "B2",
        children: [
          { name: "C3", size: 2 },
          { name: "C4", size: 3 }
        ]
      }]
    },
    dataComponent: <Arc/>,
    displayCore: false,
    groupComponent: <g/>,
    minRadians: 0,
    sort: true,
    standalone: true,
    style: {
      data: {
        cursor: "pointer",
        stroke: "white"
      }
    },
    theme: VictoryTheme.grayscale
  };

  static getBaseProps = partialRight(
    SunburstHelpers.getBaseProps.bind(SunburstHelpers),
    fallbackProps
  );
  static getData = Data.getData.bind(Data);
  static expectedComponents = ["containerComponent", "groupComponent"];

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
    const { width, height } = props;
    const calculatedProps = SunburstHelpers.getCalculatedValues(props);
    const { padding, radius } = calculatedProps;
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
