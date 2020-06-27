# React MVVM

![Package CI](https://github.com/oreal-solutions/react-mvvm/workflows/Package%20CI/badge.svg)

MVVM with React done the right way.

This project is inspired by the [Provider Architecture](lib/react_mvvm.js) by [FilledStacks](https://www.filledstacks.com).

## Getting started

Install the package

```bash
~$ yarn add https://github.com/oreal-solutions/react-mvvm.git
```

or if you're using npm

```bash
~$ my-project> npm install https://github.com/oreal-solutions/react-mvvm.git
```

Define your view model.

```javascript
// counter_viewmodel.js
import { BaseViewModel } from "react-mvvm";

export default class CounterViewModel extends BaseViewModel {
  constructor() {
    super(); // Required to use this

    this.counter = 0;
    this.incrementCounter = this.incrementCounter.bind(this);
  }

  incrementCounter() {
    this.counter++;
    super.notifyListeners(); // Tell the view to render, the state has changed.
  }
}
```

And finally implement your view.

```javascript
// counter_view.js
import React from "react";
import { ViewModelConsumer } from "react-mvvm";
import CounterViewModel from "./counter_viewmodel";

export default class CounterView extends ViewModelConsumer {
  constructor(props) {
    super(props, new CounterViewModel());
  }

  /**
   * Called after the model has called notifyListeners().
   *
   * @param {CounterViewModel} model
   */
  onRender(props, model) {
    return (
      <div>
        <h3>You have tapped the button {model.counter.toString()} times</h3>

        <button onClick={(e) => model.incrementCounter()}>Tap Me</button>
      </div>
    );
  }
}
```

You can now use your view like any React Component.

```javascript
// index.js
import CounterView from "./counter_view";

ReactDOM.render(
  <React.StrictMode>
    <CounterView />
  </React.StrictMode>,
  document.getElementById("root")
);
```

It's that simple to write clean, reactive and well structured React Components.

### BaseViewModel

A [view model](<(lib/react_mvvm.js)>) is the state of a view. It can also have methods to manipulate that state or do other operations that affect the state of the state.

### ViewModelConsumer

The [ViewModelConsumer](<(lib/react_mvvm.js)>) class subclasses `React.Component` and displays the state of its view model. It listens for state changes from the given view model and call `React.Component.setState()` when the state has changed. Subclasses should implement `ViewModelConsumer.onRender` and not `React.Component.render` directly.
