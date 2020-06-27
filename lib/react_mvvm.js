/**
 * Copyright 2020 The LytOwl Team.
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file.
 */

const React = require("react");

/**
 * A view model is an object that notifies the view it is attached to when its state changes.
 *
 * Views register callbacks to the view model and will be be notified when notifyListeners is called.
 * Generally, only one view should use a viewmodel.
 */
export class BaseViewModel {
  /**
   * Constructs a view model instance.
   */
  constructor() {
    this._listeners = [];
    this._busy = false;

    this.setBusy = this.setBusy.bind(this);
    this.isBusy = this.isBusy.bind(this);
    this.notifyListeners = this.notifyListeners.bind(this);

    this.subscribe = this.subscribe.bind(this);
    this.clearSubscriptions = this.clearSubscriptions.bind(this);
  }

  /**
   * Sets the busy status of this viewmodel.
   *
   * This method should be called be called with `true` when the view model is about to
   * go into a rather time consuming computation. After the compution, call this method
   * with `false`.
   *
   * @example
   * async function signUpWithEmailPassword(email, password){
   *    this.setBusy(true);
   *
   *    var user = null;
   *    // ... do the time consuming sign up
   *
   *    this.setBusy(false);
   *    return user;
   * }
   *
   * @param {boolean} isBusy is the status to set.
   */
  setBusy(isBusy) {
    this._busy = isBusy;
    this.notifyListeners();
  }

  /**
   * Returns the busy status of this view model.
   *
   * Normally, the `ViewModelConsumer` this view model is attached to will show a loading UI
   * if this method evaluates `true`.
   */
  isBusy() {
    return this._busy;
  }

  /**
   * Add the given function as callback when notifyListeners is called.
   *
   * @param {function(BaseViewModel)} [callback] Is the function to be add as callback.
   */
  subscribe(callback) {
    this._listeners.push(callback);
  }

  /**
   * Removes all the registered callbacks.
   */
  clearSubscriptions() {
    this._listeners.length = 0;
  }

  /**
   * Calls all the registered callback functions.
   */
  notifyListeners() {
    for (var iii in this._listeners) this._listeners[iii](this);
  }
}

/**
 * A React component that subscribes to the given view model.
 *
 * Subclasses should implement the `onRender` method.
 *
 * @example
 * import { ViewModelConsumer, BaseViewModel } from 'react-mvvm';
 *
 * class CounterView extends ViewModelConsumer {
 *   constructor(props){
 *      super(props, new CounterViewModel());
 *   }
 *
 *   onRender(props, model){
 *      return <div>
 *         <h3>You have tapped the button {model.counter} times</h3>
 *         <button onClick={(e) => model.incrementCounter()}>Tap me</button>
 *      </div>
 *   }
 * }
 *
 * class CounterViewModel extends BaseViewModel {
 *   constructor() {
 *      super();
 *      this.counter = 0;
 *
 *      this.incrementCounter = this.incrementCounter.bind(this);
 *   }
 *
 *   incrementCounter() {
 *      this.counter++;
 *      this.notifyListeners();
 *   }
 * }
 *
 */
export class ViewModelConsumer extends React.Component {
  /**
   * @param {BaseViewModel} viewModel is the view model to subscribe to.
   */
  constructor(props, viewModel) {
    super(props);
    if (viewModel) {
      this.state = viewModel;

      this.state.subscribe((model) => {
        this.setState(model);
      });
    } else {
      throw Error("No viewmodel given");
    }
  }

  componentDidMount() {
    this.onModelReady(this.state);
  }

  componentWillUnmount() {
    this.state.clearSubscriptions();
  }

  render() {
    return this.onRender(this.props, this.state);
  }

  /**
   * Called to notify the component that it can now initialise the view model.
   *
   * @param {BaseViewModel} viewModel is the viewmodel to be intialised.
   */
  onModelReady(viewModel) {}

  /**
   * Called when the component is to be rendered on the DOM.
   *
   * This method should return an element to render.
   *
   * @param {BaseViewModel} viewModel is the viewModel for this component.
   */
  onRender(props, viewModel) {
    throw Error("onRender is not implemnted");
  }
}
