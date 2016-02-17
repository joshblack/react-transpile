import React, { PropTypes } from 'react';
import { transform } from 'babel-standalone';

// Custom `eval` function that servers as the default program executor
const evalify = (code, scope) => {
  'use strict';

  // Re-map `require` to point to our given scope
  const require = (path) => {
    if (!scope[path]) {
      throw new Error(
        `No import found at \`${path}\`, did you specify it in scope?`
      );
    }

    return scope[path];
  };

  return eval(code);
};

/**
 * Component for applications that handle transpilation of ES2015 and want to
 * render something depending on the result.
 *
 * You can provide a scope to `Transpile` and then you can access it in your
 * environment by importing/require'ing it.
 *
 * You can also specify specific babel plugins/presets that you want to
 * transform your source.
 *
 * Usage:
 *
 * <Transpile
 *   scope={{ ScopedModule: Module }}
 *   source={sourceString}
 *   onError={(error) => {}}
 *   onTranspile={(result) => {})
 *   baseElement={() => <p>Transpiling...</p>}
 * />
 */
export default class Transpile extends React.Component {
  static propTypes = {
    // The source text that you want to transpile
    source: PropTypes.string.isRequired,

    // Callback called with the error that occurs during transpilation
    onError: PropTypes.func,

    // Calback called with the result of transpiling the source
    onTranspile: PropTypes.func,

    // Component that is displayed while transpiling
    baseComponent:  PropTypes.func,

    // Object specifying a map of identifiers that will be included in the
    // custom `eval` hook
    scope: PropTypes.object,

    // Babel presets to apply to the transpilation
    presets: PropTypes.array,

    // Babel plugins to apply to the transpilation
    plugins: PropTypes.array,

    // Custom `eval` hook that takes in the transpiled code and source and
    // returns the result
    customEval: PropTypes.func
  }

  static defaultProps = {
    customEval: evalify,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: [],
    scope: {},
  }

  state = {
    error: null,
    result: null
  }

  componentDidMount() {
    this._transpileCode();
  }

  componentDidUpdate({ source }) {
    if (source !== this.props.source) {
      this._transpileCode();
    }
  }

  render() {
    const { error, result } = this.state;

    if (error) {
      return this.props.onError(error);
    }

    if (result) {
      return this.props.onTranspile(result);
    }

    return this.props.baseComponent && this.props.baseComponent();
  }

  _transpileCode = () => {
    const {
      customEval,
      scope,
      source,
      presets,
      plugins
    } = this.props;

    try {
      const { code } = transform(source, {
        plugins,
        presets,
        code: true,
        ast: false,
        retainLines: true,
        sourceMaps: 'inline'
      });

      this.setState({
        error: null,
        result: customEval(code, source)
      });
    } catch (error) {
      this.setState({ error });
    }
  }
}

