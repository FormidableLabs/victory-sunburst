[![Travis Status][trav_img]][trav_site]

Victory Sunburst
=============

`victory-sunburst` draws an SVG sunburst chart with [React](https://github.com/facebook/react) and [D3](https://github.com/mbostock/d3). Styles and data can be customized by passing in your own values as properties to the component. Data changes are (not yet) animated with [victory-animation](https://github.com/FormidableLabs/victory-animation).

##Examples

The plain component has baked-in sample data and defaults, so rendering the sunburst with no custom properties, like so:

``` javascript
<VictorySunburst/>
```

Will look like this:

![Sunburst Image](https://raw.githubusercontent.com/FormidableLabs/victory-sunburst/master/sunburst.jpg)


## The API

### Props

All props are *optional*. They can be omitted and the component will
still render with random datat.

The following props are supported:

####**data**

*An object, with nested properties to make up the tree datastructure as shown below.* If the `data` prop is omitted, the sunburst will render sample data. The data has the format:

```
{
  "name": "foo",
  "children": [
    {
      "name": "qux",
      "children": [
        {"name": "asdfgdfs", "size": 98765},
        {"name": "qwertyui", "size": 54321}
      ]
    },
    {"name": "bar", "size": 12345},
    {"name": "baz", "size": 5678}
  ]
}
```

Note that only leaves have `size`.

*Default value:* [flare.json](https://gist.githubusercontent.com/mbostock/1093025/raw/05621a578a66fba4d2cbf5a77e2d1bb3a27ac3d4/flare.json)

####**width**

*A number*  

*Default value:* `700`

####**height**

*A number*

*Default value:* `700`

####**radius**

*A function* Responsible for making sure the visualization is smaller than the SVG.

*Default value:* 

```
  radius: (width, height) => {
    return Math.min(width, height) / 2;
  }
```

## Development

Please see [DEVELOPMENT](DEVELOPMENT.md)

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md)

[trav_img]: https://api.travis-ci.org/FormidableLabs/victory-sunburst.svg
[trav_site]: https://travis-ci.org/FormidableLabs/victory-sunburst
