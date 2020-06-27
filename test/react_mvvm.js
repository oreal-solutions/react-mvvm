import { EmptyView, EmptyViewModel } from "./protos";
import { expect } from "chai";

describe("BaseViewModel", function () {
  var emptyViewModel = new EmptyViewModel();

  it("should initially have zero listeners", function () {
    expect(emptyViewModel._listeners.length).to.equal(0);
  });

  it("should initially not be busy", function () {
    expect(emptyViewModel.isBusy()).to.be.false;
  });

  describe("subscribe() and clearSubscriptions()", function () {
    before(function () {
      emptyViewModel.subscribe(function (model) {});
    });
    it("should increment _listeners after a adding a new listener", function () {
      expect(emptyViewModel._listeners.length).to.equal(1);
    });

    it("should reset _listeners to empty after a call to clearSubscriptions", function () {
      emptyViewModel.clearSubscriptions();
      expect(emptyViewModel._listeners.length).to.equal(0);
    });
  });

  describe("notifyListeners() and subscribers", function () {
    var obj = {
      returnedModel: null,
    };

    before(function () {
      emptyViewModel.foo = 56; // The returned model should also have this field
      emptyViewModel.subscribe(function (model) {
        obj.returnedModel = model;
      });

      emptyViewModel.notifyListeners();
    });

    it("should notify subscribers on a call to notifyListeners", function () {
      expect(obj.returnedModel).to.not.equal(null);
    });

    it("should pass the most recent model to subscribers on a call to notifyListeners", function () {
      expect(obj.returnedModel).to.deep.equal(emptyViewModel);
    });
  });

  describe("setBusy()", function () {
    it("should be busy after passing true to setBusy()", function () {
      emptyViewModel.setBusy(true);
      expect(emptyViewModel.isBusy()).to.be.true;
    });

    it("should NOT be busy after passing false to setBusy()", function () {
      emptyViewModel.setBusy(false);
      expect(emptyViewModel.isBusy()).to.be.false;
    });
  });
});

describe("ViewModelConsumer", function () {
  const emptyViewModel = new EmptyViewModel();
  const emptyView = new EmptyView(null, emptyViewModel);

  it("should subscribe to the given view model on construction", function () {
    expect(emptyViewModel._listeners.length).to.equal(1);
  });

  it("should call onModelReady() on a call to componentDidMount()", function () {
    var obj = {
      returnedModel: null,
    };

    emptyViewModel.foo = 32;
    emptyView.onModelReady = (model) => {
      obj.returnedModel = model;
    };

    emptyView.componentDidMount();
    expect(obj.returnedModel).to.deep.equal(emptyViewModel);
  });

  it("should call onRender() on a call to render()", function () {
    var obj = {
      returnedModel: null,
    };

    emptyViewModel.baz = 42;
    emptyView.onRender = (props, model) => {
      obj.returnedModel = model;
    };

    emptyView.render();
    expect(obj.returnedModel).to.deep.equal(emptyViewModel);
  });

  it("should unsubscribe from the view model on a call to componentWillUnmount()", function () {
    emptyView.componentWillUnmount();
    expect(emptyViewModel._listeners.length).to.equal(0);
  });
});
