[![Travis Status][trav_img]][trav_site]

Victory Sunburst
=============

`VictorySunburst` draws an SVG sunburst chart with [React] and [D3](https://github.com/mbostock/d3). Styles and data can be customized by passing in your own values as properties to the component.

## Requirements
Projects using Victory should also depend on [React] and [prop-types].

##Examples

The plain component has baked-in sample data and defaults, so rendering the sunburst with no custom properties, like so:

``` javascript
<VictorySunburst />
```

Will look like this:

![Sunburst image]

## The API

### Props

All props are *optional*. They can be omitted and the component will still render with sample data.

The following props are supported:

#### animate

The `animate` prop specifies props for VictoryAnimation and VictoryTransition to use. The animate prop may be used to specify the duration, delay and easing of an animation as well as the behavior of `onEnter` and `onExit` and `onLoad` transitions. Each Victory component defines its own default transitions, but these may be modified, or overwritten with the `animate` prop.

*example:*
```jsx
  animate={{
    duration: 2000,
    onLoad: { duration: 1000 },
    onEnter: {
      duration: 500,
      before: () => ({ y: 0 })
    }
  }}
```

#### colorScale

The colorScale prop defines a color scale to be applied to each slice of VictorySunburst. This prop should be given as an array of CSS colors, or as a string corresponding to one of the built in color scales: "grayscale", "qualitative", "heatmap", "warm", "cool", "red", "green", "blue". VictorySunburst will assign to each slice by index, unless they are explicitly specified in the data object. Colors will repeat when there are more slices than colors in the provided colorScale.

*default:* `colorScale="blue"`

#### containerComponent

The `containerComponent` prop takes a component instance which will be used to create a container element for standalone legends. The new element created from the passed `containerComponent` will be provided with the following props: `height`, `width`, `children` (the legend itself) and `style`. If a `containerComponent` is not provided, the default `VictoryContainer` component will be used. `VictoryContainer` supports `title` and `desc` props, which are intended to add accessibility to Victory components. The more descriptive these props are, the more accessible your data will be for people using screen readers. These props may be set by passing them directly to the supplied component. By default, `VictoryContainer` renders a responsive `svg` using the `viewBox` attribute. To render a static container, set `responsive={false}` directly on the instance of `VictoryContainer` supplied via the `containerComponent` prop. `VictoryContainer` also renders a `Portal` element that may be used in conjunction with [VictoryPortal] to force components to render above other children.

*example:* `containerComponent={<VictoryContainer responsive={false} title="Sunburst Chart"/>}`

*default:* `containerComponent={<VictoryContainer/>}`

#### data

*An object* with nested `name`, `children`, and `size`, properties as shown in the default data structure below. Note that only leaf nodes have `size`.

*default:*
```jsx
  data={{
    name: "A",
    children: [
      { name: "B1", size: 5 },
      {
        name: "B2",
        children: [
          { name: "B2A", size: 4 },
          {
            name: "B2B",
            children: [
              { name: "B2B1", size: 4 },
              { name: "B2B2", size: 4 }
            ]
          }
        ]
      },
      {
        name: "B3",
        children: [
          { name: "B3A", size: 3 },
          { name: "B3B", size: 5 }
        ]
      }
    ]
  }}
```

#### dataComponent

The `dataComponent` prop takes a component instance which will be responsible for rendering a data element used to associate a symbol or color with each data series. If a `dataComponent` is not provided, `VictorySunburst` will use its default [Slice component].

*examples:* `dataComponent={<Slice events={{ onClick: () => console.log("wow") }}/> }`, `dataComponent={<MyCustomSlice/>}`

*default:* `<Slice/>`

#### displayRoot

*A boolean* for toggling the display of the sunburst root node.

*default:* `false`

### events

The `events` prop takes an array of event objects. Event objects are composed of a `target`, an `eventKey`, and `eventHandlers`. Targets may be any valid style namespace for a given component, so "data" and "labels" are valid targets for this component. `eventKey` may be given as a single value, or as an array of values to specify individual targets. If `eventKey` is not specified, the given `eventHandlers` will be attached to all elements of the specified `target` type. The `eventHandlers` object should be given as an object whose keys are standard event names (i.e. `onClick`) and whose values are event callbacks. The return value of an event handler is used to modify elements. The return value should be given as an object or an array of objects with optional `target` and `eventKey` keys for specifying the element(s) to be modified, and a `mutation` key whose value is a function. The `target` and `eventKey` keys will default to those corresponding to the element the event handler was attached to. The `mutation` function will be called with the calculated props for each element that should be modified (i.e. a slice label), and the object returned from the mutation function will override the props of that element via object assignment.

*example:*
```jsx
  events={[{
    target: "data",
    eventKey: [0, 2, 4],
    eventHandlers: {
      onClick: () => {
        return [
           {
            target: "labels",
            mutation: () => {
              return { active: true };
            },
            callback: () => {
              console.log("I happen after setState");
            }
          }
        ];
      }
    }
  }]}
```

#### eventKey

The `eventKey` prop is used to assign eventKeys to data. By default, the eventKey of each datum will be equal to its index in the data array. `eventKey` may also be defined directly on each data object.

#### groupComponent

The `groupComponent` prop takes a component instance which will be used to create group elements for use within container elements. This prop defaults to a `<g>` tag.

*default:* `groupComponent={<g/>}`

#### name

The `name` prop is used to reference a component instance when defining shared events.

#### minRadians

*A number* in radians used to filter out nodes too small to see. Nodes smaller than `minRadians` aren't displayed.

*default:* `0.001`

#### padding

The `padding` prop specifies the amount of padding in pixels between the edge of the legend and any rendered child components. This prop can be given as a number or as an object with padding specified for `top`, `bottom`, `left` and `right`. As with `width` and `height`, the absolute padding will depend on whether the component is rendered in a responsive container. When a component is nested within `VictorySunburst`, setting `padding` on the child component will have no effect.

*examples:* `padding={{ top: 20, bottom: 60 }}`, `padding={40}`

#### sharedEvents

The `sharedEvents` prop is used to coordinate events between Victory components using `VictorySharedEvents`. This prop should not be set manually.

#### sortData

*A boolean or function* to indicate how data should be sorted. For basic sorting, `sortData={true}` defaults to use a compare function of `(a, b) => { return b.value - a.value; }`. A custom compare function can be supplied as well.

*examples:* `sortData={true}`, `sortData={(a, b) => { return b.value - a.value; }}`

*default:* `sortData={false}`

#### standalone

The `standalone` props specifies whether the component should be rendered in an independent `<svg>` element or in a `<g>` tag. This prop defaults to true, and renders an `<svg>`.

*default:* `standalone={true}`

#### style

The `style` prop defines the style of the component. The style prop should be given as an object with styles defined for `data`, `labels` and `parent`. Any valid `<svg>` styles are supported, but `width`, `height`, and `padding` should be specified via props as they determine relative layout for components in `VictorySunburst`.

*example:*
```jsx
  style={{
    data: { fill: "tomato", opacity: 0.7 },
    labels: { fontSize: 12 },
    parent: { border: "1px solid #ccc" }
  }}
```

**note:** When a component is rendered as a child of another Victory component, or within a custom `<svg>` element with `standalone={false}` parent styles will be applied to the enclosing `<g>` tag. Many styles that can be applied to a parent `<svg>` will not be expressed when applied to a `<g>`.

**note:** custom `angle` and `verticalAnchor` properties maybe included in labels styles.

*default (provided by default theme):* See [grayscale theme] for more detail

#### sumBy

The `sumBy` prop takes a string that defines whether sunburst slices are drawn based on node size or count. When `sumBy` is "size", sunburst slices will be drawn based on subtree nodes' `size`. When `sumBy` is "count", sunburst slices will be drawn based on subtree node count.

*default:* `sumBy="size"`

#### theme

The `theme` prop specifies a theme to use for determining styles and layout properties for a component. Any styles or props defined in `theme` may be overridden by props specified on the component instance. By default, components use a [grayscale theme]. [Read more about themes here](https://formidable.com/open-source/victory/guides/themes).

*default:* `theme={VictoryTheme.grayscale}`

#### width and height

The `width` and `height` props define the width and height of the sunburst in pixels. These props may be given as positive numbers or functions of data.

*default:* `width={400}`, `height={400}`

#### x and y

The `x` and `y` props define the coordinates to use as a basis for positioning the sunburst element.

*default:* `x={0}`, `y={0}`

## Issues
To make it easier to manage issues across all of Victory, we have disabled issues for this repo. [Please open issues in the main victory repo instead](https://github.com/FormidableLabs/victory/issues). You can track our progress on issues [here](https://github.com/FormidableLabs/victory/projects/1)

## Development

```sh
# Run the demo app server
$ npm start

# Open the demo app
$ open http://localhost:3000

# Run tests
$ npm test
```

For more on the development environment, see [DEVELOPMENT](https://github.com/FormidableLabs/builder-victory-component-dev/blob/master/DEVELOPMENT.md) in the project builder archetype.

## Contributing

Please review our [Code of Conduct](https://github.com/FormidableLabs/builder-victory-component/blob/master/CONTRIBUTING.md#contributor-covenant-code-of-conduct) before contributing.

For a detailed contribution guide, please see [CONTRIBUTING](https://github.com/FormidableLabs/builder-victory-component-dev/blob/master/CONTRIBUTING.md) in the project builder archetype.

## _IMPORTANT_

This project is in a pre-release state. We're hard at work fixing bugs and improving the API. Be prepared for breaking changes!

**Caveats** git installs using npm 2 may fail in postinstall. If you are consuming Victory via git installs please use npm >=3.0.0

[React]: https://facebook.github.io/react/
[prop-types]: https://github.com/reactjs/prop-types
[Slice component]: https://formidable.com/open-source/victory/docs/victory-primitives#slice
[Sunburst image]: https://user-images.githubusercontent.com/2624467/27193597-42ff5dbc-51b4-11e7-8fba-647b067fc9d7.png
[grayscale theme]: https://github.com/FormidableLabs/victory-core/blob/master/src/victory-theme/grayscale.js
[trav_img]: https://api.travis-ci.org/FormidableLabs/victory-sunburst.svg
[trav_site]: https://travis-ci.org/FormidableLabs/victory-sunburst
