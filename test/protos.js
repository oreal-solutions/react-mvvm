import { ViewModelConsumer, BaseViewModel } from "../index";

export class EmptyViewModel extends BaseViewModel {
  constructor() {
    super();
  }
}

export class EmptyView extends ViewModelConsumer {
  /**
   * @param {BaseViewModel} ViewModelConsumer
   */
  constructor(props, viewmodel) {
    super(props, viewmodel);
  }
}
