# react-transpile

[`react-transpile`](https://www.npmjs.com/package/react-transpile) provides a declarative transpilation component for [React](https://facebook.github.io/react).

## Usage

Given some kind of source text that you want to transpile from ES2015+ to ES5, you can leverage `react-transpile` by doing the following:

```js
import React from 'react';
import Transpile from 'react-transpile';

class Demo extends React.Component {
  render() {
    const Header = ({ title }) => <h1>{title}</h1>;

    return (
      <Transpile
        scope={{ Header }}
        source={this.props.source}
        onError={(error) => /* handle error */}
        onResult={(result) => /* handle result */}
        baseComponent={() => <p>Rendered while transpiling</p>}
      />
    );
  }
}
```

Whatever is returned by the `onError` and `onResult` handlers will be rendered by the `Transpile` component.

### `scope`

You can leverage the `scope` prop to pass in values that you want to include in the scope of your source text that is being evaluated. By default, you access values in scope by using ES2015's `import` syntax, or by just using `require`.

You can change this behavior by hooking into the `customEval` prop, which determines how your source is evaluated. This function takes in the transpiled source and the scope and lets you handle how it is evaluated for  added flexibility.

### `plugins` and `presets`

You can additionally pass in an array of plugins and presets that you want babel to apply to your source. By default, `Transpile` supports the `es2015`, `stage-1`, and `react` babel presets.

