import React, { FC, Component } from "react";
import { create, act } from "react-test-renderer";
import connect, { Provider } from "..";
import { Derived, Action, State, Connect, Store, Actions } from "../../types";
import { CONTEXT } from "../symbols";

interface MyStore extends Store {
  state: {
    prop1: number;
    prop2: Derived<MyStore, number>;
    prop3: Derived<MyStore, number, number>;
  };
  actions: {
    action1: Action<MyStore>;
    action2: Action<MyStore, number>;
  };
  libraries: {
    Component: React.ReactType;
  };
}

const LibComponent: FC = () => <div>component from library</div>;

const rawStore: MyStore = {
  state: {
    prop1: 1,
    prop2: ({ state }) => state.prop1 + 1,
    prop3: ({ state }) => num => state.prop1 + num
  },
  actions: {
    action1: ({ state }) => {
      state.prop1 = 2;
    },
    action2: ({ state }) => num => {
      state.prop1 = num;
    }
  },
  libraries: {
    Component: LibComponent
  }
};

describe("connect", () => {
  it("should pass state to functional components", () => {
    const Comp: FC<Connect<MyStore>> = ({ state }) => <div>{state.prop1}</div>;
    const Connected = connect(Comp);
    const app = create(
      <Provider value={rawStore}>
        <Connected />
      </Provider>
    );
    expect(app).toMatchSnapshot();
  });

  it("should pass state to class components", () => {
    class Comp extends Component<Connect<MyStore>> {
      render() {
        return <div>{this.props.state.prop1}</div>;
      }
    }
    const Connected = connect(Comp);
    const app = create(
      <Provider value={rawStore}>
        <Connected />
      </Provider>
    );
    expect(app).toMatchSnapshot();
  });

  it("should pass derived state to functional components", () => {
    const Comp: FC<Connect<MyStore>> = ({ state }) => <div>{state.prop2}</div>;
    const Connected = connect(Comp);
    const app = create(
      <Provider value={rawStore}>
        <Connected />
      </Provider>
    );
    expect(app).toMatchSnapshot();
  });

  it("should pass derived state to class components", () => {
    class Comp extends Component<Connect<MyStore>> {
      render() {
        return <div>{this.props.state.prop2}</div>;
      }
    }
    const Connected = connect(Comp);
    const app = create(
      <Provider value={rawStore}>
        <Connected />
      </Provider>
    );
    expect(app).toMatchSnapshot();
  });

  it("should pass derived state functions to functional components", () => {
    const Comp: FC<Connect<MyStore>> = ({ state }) => (
      <div>{state.prop3(2)}</div>
    );
    const Connected = connect(Comp);
    const app = create(
      <Provider value={rawStore}>
        <Connected />
      </Provider>
    );
    expect(app).toMatchSnapshot();
  });

  it("should pass derived state functions to class components", () => {
    class Comp extends Component<Connect<MyStore>> {
      render() {
        return <div>{this.props.state.prop3(2)}</div>;
      }
    }
    const Connected = connect(Comp);
    const app = create(
      <Provider value={rawStore}>
        <Connected />
      </Provider>
    );
    expect(app).toMatchSnapshot();
  });

  it("should pass actions and react to changes in functional components", () => {
    const Comp1: FC<Connect<MyStore>> = ({ actions }) => (
      <button onClick={actions.action1}>change prop1</button>
    );
    const Comp2: FC<Connect<MyStore>> = ({ state }) => <div>{state.prop1}</div>;
    const Connected1 = connect(Comp1);
    const Connected2 = connect(Comp2);
    const app = create(
      <Provider value={rawStore}>
        <Connected1 />
        <Connected2 />
      </Provider>
    );
    expect(app).toMatchSnapshot();
    const rootInstance = app.root;
    const button = rootInstance.findByType("button");
    act(() => button.props.onClick());
    expect(app).toMatchSnapshot();
  });

  it("should pass actions and react to changes in class components", () => {
    class Comp1 extends Component<Connect<MyStore>> {
      render() {
        return (
          <button onClick={this.props.actions.action1}>change prop1</button>
        );
      }
    }
    class Comp2 extends Component<Connect<MyStore>> {
      render() {
        return <div>{this.props.state.prop1}</div>;
      }
    }
    const Connected1 = connect(Comp1);
    const Connected2 = connect(Comp2);
    const app = create(
      <Provider value={rawStore}>
        <Connected1 />
        <Connected2 />
      </Provider>
    );
    expect(app).toMatchSnapshot();
    const rootInstance = app.root;
    const button = rootInstance.findByType("button");
    act(() => button.props.onClick());
    expect(app).toMatchSnapshot();
  });

  it("should pass actions and react to derived changes in functional components", () => {
    const Comp1: FC<Connect<MyStore>> = ({ actions }) => (
      <button onClick={actions.action1}>change prop1</button>
    );
    const Comp2: FC<Connect<MyStore>> = ({ state }) => <div>{state.prop2}</div>;
    const Connected1 = connect(Comp1);
    const Connected2 = connect(Comp2);
    const app = create(
      <Provider value={rawStore}>
        <Connected1 />
        <Connected2 />
      </Provider>
    );
    expect(app).toMatchSnapshot();
    const rootInstance = app.root;
    const button = rootInstance.findByType("button");
    act(() => button.props.onClick());
    expect(app).toMatchSnapshot();
  });

  it("should pass actions and react to derived changes in class components", () => {
    class Comp1 extends Component<Connect<MyStore>> {
      render() {
        return (
          <button onClick={this.props.actions.action1}>change prop1</button>
        );
      }
    }
    class Comp2 extends Component<Connect<MyStore>> {
      render() {
        return <div>{this.props.state.prop2}</div>;
      }
    }
    const Connected1 = connect(Comp1);
    const Connected2 = connect(Comp2);
    const app = create(
      <Provider value={rawStore}>
        <Connected1 />
        <Connected2 />
      </Provider>
    );
    expect(app).toMatchSnapshot();
    const rootInstance = app.root;
    const button = rootInstance.findByType("button");
    act(() => button.props.onClick());
    expect(app).toMatchSnapshot();
  });

  it("should pass actions with params and react to changes in functional components", () => {
    const Comp1: FC<Connect<MyStore>> = ({ actions }) => (
      <button onClick={() => actions.action2(4)}>change prop1</button>
    );
    const Comp2: FC<Connect<MyStore>> = ({ state }) => <div>{state.prop1}</div>;
    const Connected1 = connect(Comp1);
    const Connected2 = connect(Comp2);
    const app = create(
      <Provider value={rawStore}>
        <Connected1 />
        <Connected2 />
      </Provider>
    );
    expect(app).toMatchSnapshot();
    const rootInstance = app.root;
    const button = rootInstance.findByType("button");
    act(() => button.props.onClick());
    expect(app).toMatchSnapshot();
  });

  it("should pass actions with params and react to changes in class components", () => {
    class Comp1 extends Component<Connect<MyStore>> {
      render() {
        return (
          <button onClick={() => this.props.actions.action2(4)}>
            change prop1
          </button>
        );
      }
    }
    class Comp2 extends Component<Connect<MyStore>> {
      render() {
        return <div>{this.props.state.prop1}</div>;
      }
    }
    const Connected1 = connect(Comp1);
    const Connected2 = connect(Comp2);
    const app = create(
      <Provider value={rawStore}>
        <Connected1 />
        <Connected2 />
      </Provider>
    );
    expect(app).toMatchSnapshot();
    const rootInstance = app.root;
    const button = rootInstance.findByType("button");
    act(() => button.props.onClick());
    expect(app).toMatchSnapshot();
  });

  it("should pass libraries to functional components", () => {
    const Comp: FC<Connect<MyStore>> = ({ libraries }) => {
      const Component = libraries.Component;
      return (
        <div>
          <Component />
        </div>
      );
    };
    const Connected = connect(Comp);
    const app = create(
      <Provider value={rawStore}>
        <Connected />
      </Provider>
    );
    expect(app).toMatchSnapshot();
  });

  it("should pass libraries to class components", () => {
    class Comp extends Component<Connect<MyStore>> {
      render() {
        const Component = this.props.libraries.Component;
        return (
          <div>
            <Component />
          </div>
        );
      }
    }
    const Connected = connect(Comp);
    const app = create(
      <Provider value={rawStore}>
        <Connected />
      </Provider>
    );
    expect(app).toMatchSnapshot();
  });
});

describe("connect contexts", () => {
  it("should create contexts for the state and actions in development", () => {
    let funcState: State<MyStore>;
    let classState: State<MyStore>;
    let funcActions: Actions<MyStore>;
    let classActions: Actions<MyStore>;

    const context = { type: "component", name: "Comp" };

    const FuncComp: FC<Connect<MyStore>> = ({ state, actions }) => {
      funcState = state;
      funcActions = actions;
      return null;
    };

    class ClassComp extends Component<Connect<MyStore>> {
      render() {
        classState = this.props.state;
        classActions = this.props.actions;
        return null;
      }
    }

    const FuncConnected = connect(
      FuncComp,
      { mode: "development" }
    );
    const ClassConnected = connect(
      ClassComp,
      { mode: "development" }
    );

    create(
      <Provider value={rawStore}>
        <FuncConnected />
        <ClassConnected />
      </Provider>
    );

    expect(funcState).toEqual(rawStore.state);
    expect(classState).toEqual(rawStore.state);
    expect(funcActions).toEqual(rawStore.actions);
    expect(classActions).toEqual(rawStore.actions);
    expect(funcState[CONTEXT]).toEqual(context);
    expect(classState[CONTEXT]).toEqual(context);
    expect(funcActions[CONTEXT]).toEqual(context);
    expect(classActions[CONTEXT]).toEqual(context);
  });

  it("should not create contexts for the state and actions in production", () => {
    let funcState: State<MyStore>;
    let classState: State<MyStore>;
    let funcActions: Actions<MyStore>;
    let classActions: Actions<MyStore>;

    const FuncComp: FC<Connect<MyStore>> = ({ state, actions }) => {
      funcState = state;
      funcActions = actions;
      return null;
    };

    class ClassComp extends Component<Connect<MyStore>> {
      render() {
        classState = this.props.state;
        classActions = this.props.actions;
        return null;
      }
    }

    const FuncConnected = connect(
      FuncComp,
      { mode: "production" }
    );
    const ClassConnected = connect(
      ClassComp,
      { mode: "production" }
    );

    create(
      <Provider value={rawStore}>
        <FuncConnected />
        <ClassConnected />
      </Provider>
    );

    expect(funcState).toEqual(rawStore.state);
    expect(classState).toEqual(rawStore.state);
    expect(funcActions).toEqual(rawStore.actions);
    expect(classActions).toEqual(rawStore.actions);
    expect(funcState[CONTEXT]).toEqual(null);
    expect(classState[CONTEXT]).toEqual(null);
    expect(funcActions[CONTEXT]).toEqual(null);
    expect(classActions[CONTEXT]).toEqual(null);
  });

  it("should create contexts inside the actions in development", () => {
    interface MyStore extends Store {
      actions: {
        exportActions: Action<MyStore>;
      };
    }

    let funcActions: Actions<MyStore>;
    let funcState: State<MyStore>;
    let internalActions: Actions<MyStore>;
    let internalState: State<MyStore>;

    const context = {
      type: "action",
      name: "exportActions",
      parent: { type: "component", name: "Comp" }
    };

    const rawStore: MyStore = {
      state: {},
      actions: {
        exportActions: ({ state, actions }) => {
          internalState = state;
          internalActions = actions;
        }
      }
    };

    const FuncComp: FC<Connect<MyStore>> = ({ state, actions }) => {
      funcActions = actions;
      funcState = state;
      actions.exportActions();
      return null;
    };

    const FuncConnected = connect(
      FuncComp,
      { mode: "development" }
    );

    create(
      <Provider value={rawStore}>
        <FuncConnected />
      </Provider>
    );

    expect(internalState).toEqual(rawStore.state);
    expect(internalState).not.toBe(funcState);
    expect(internalState[CONTEXT]).toEqual(context);
    expect(internalActions).toEqual(rawStore.actions);
    expect(internalActions).not.toBe(funcActions);
    expect(internalActions[CONTEXT]).toEqual(context);
  });

  it("should not create contexts inside the actions in production", () => {
    interface MyStore extends Store {
      actions: {
        exportActions: Action<MyStore>;
      };
    }

    let funcActions: Actions<MyStore>;
    let funcState: State<MyStore>;
    let internalActions: Actions<MyStore>;
    let internalState: State<MyStore>;

    const rawStore: MyStore = {
      state: {},
      actions: {
        exportActions: ({ state, actions }) => {
          internalState = state;
          internalActions = actions;
        }
      }
    };

    const FuncComp: FC<Connect<MyStore>> = ({ state, actions }) => {
      funcActions = actions;
      funcState = state;
      actions.exportActions();
      return null;
    };

    const FuncConnected = connect(
      FuncComp,
      { mode: "production" }
    );

    create(
      <Provider value={rawStore}>
        <FuncConnected />
      </Provider>
    );

    expect(internalState).toEqual(rawStore.state);
    expect(internalState).toBe(funcState);
    expect(internalState[CONTEXT]).toEqual(null);
    expect(internalActions).toEqual(rawStore.actions);
    expect(internalActions).toBe(funcActions);
    expect(internalActions[CONTEXT]).toEqual(null);
  });
});