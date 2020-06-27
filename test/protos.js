/**
 * Copyright 2020 The LytOwl Team.
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file.
 */

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
