import React from "react";
import PropTypes from "prop-types";
import { Helpers, PropTypes as CustomPropTypes } from "victory-core";
import { isEqual } from "lodash";

export default class Arc extends React.Component {
  static role = "arc";

  static propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    datum: PropTypes.object,
    events: PropTypes.object,
    index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    pathFunction: PropTypes.func,
    role: PropTypes.string,
    scale: PropTypes.oneOfType([
      CustomPropTypes.scale,
      PropTypes.shape({ x: CustomPropTypes.scale, y: CustomPropTypes.scale })
    ]),
    shapeRendering: PropTypes.string,
    style: PropTypes.object
  };

  componentWillMount() {
    const { style, path } = this.calculateAttributes(this.props);
    this.style = style;
    this.path = path;
  }

  shouldComponentUpdate(nextProps) {
    const { style, path } = this.calculateAttributes(nextProps);
    if (path !== this.path || !isEqual(style, this.style)) {
      this.style = style;
      this.path = path;
      return true;
    }
    return false;
  }

  calculateAttributes(props) {
    const { active, datum, pathFunction, style } = props;
    return {
      style: Helpers.evaluateStyle(style, datum, active),
      path: pathFunction(datum)
    };
  }

  render() {
    const { className, events, role, shapeRendering } = this.props;
    return (
      <path
        d={this.path}
        className={className}
        role={role || "presentation"}
        style={this.style}
        shapeRendering={shapeRendering || "auto"}
        {...events}
      />
    );
  }
}
