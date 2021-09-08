import { clamp, FunctionDispatcher, partial } from '../ts/core/tool/general';

describe(partial, () => {
  let sideEffect = false;

  function testFunction(
    first: number,
    second: string,
    third: boolean
  ): [number, string, boolean] {
    sideEffect = true;
    return [first, second, third];
  }

  beforeEach(() => {
    sideEffect = false;
  });

  it("does not run without calling the function", () => {
    partial(testFunction, 0);
    expect(sideEffect).toBe(false);
  });

  it("can be applied multiple times", () => {
    const first = partial(testFunction);
    const second = partial(first, 2);
    const third = partial(second, "foo");
    const fourth = partial(third, true);
    expect(fourth()).toEqual([2, "foo", true]);
    expect(sideEffect).toBe(true);
  });
});

describe(clamp, () => {
  it("clamps numbers to a range", () => {
    const fooClamp = partial(clamp, 0, 20);
    expect(fooClamp(-1)).toEqual(0);
    expect(fooClamp(4)).toEqual(4);
    expect(fooClamp(26)).toEqual(20);
  });
});

describe(FunctionDispatcher, () => {
  let output = 0;

  function handleOnState1() {
    output += 1;
  }
  function handleOnState2() {
    output -= 1;
  }
  function handleOnState3() {
    output *= 2;
  }

  beforeEach(() => (output = 0));

  describe("#runOne and #runAny", () => {
    it("runs any by default", () => {
      new FunctionDispatcher()
        .if(true, handleOnState1)
        .if(true, handleOnState2)
        .if(false, handleOnState3)
        .try();
      expect(output).toEqual(0);
      new FunctionDispatcher()
        .runAny()
        .if(true, handleOnState1)
        .if(true, handleOnState2)
        .if(false, handleOnState3)
        .try();
      expect(output).toEqual(0);
    });

    it("can run the first valid function", () => {
      new FunctionDispatcher()
        .runOne()
        .if(true, handleOnState1)
        .if(true, handleOnState2)
        .if(false, handleOnState3)
        .try();
      expect(output).toEqual(1);
    });
  });

  describe("#if", () => {
    it("only runs the function if the condition is true", () => {
      new FunctionDispatcher()
        .if(false, handleOnState1)
        .if(false, handleOnState2)
        .if(false, handleOnState3)
        .try();
      expect(output).toEqual(0);
      new FunctionDispatcher()
        .if(true, handleOnState1)
        .if(false, handleOnState2)
        .if(false, handleOnState3)
        .try();
      expect(output).toEqual(1);
    });
  });

  describe("#require", () => {
    it("requires that the condition is true for any functions to run", () => {
      new FunctionDispatcher()
        .require(false)
        .if(false, handleOnState1)
        .if(true, handleOnState2)
        .if(false, handleOnState3)
        .try();
      expect(output).toEqual(0);
      new FunctionDispatcher()
        .require(true)
        .if(false, handleOnState1)
        .if(true, handleOnState2)
        .if(false, handleOnState3)
        .try();
      expect(output).toEqual(-1);
    });

    it("runs a function on that specific failure", () => {
      new FunctionDispatcher()
        .require(true, () => (output = 20))
        .require(false, () => (output = 10))
        .if(false, handleOnState1)
        .if(true, handleOnState2)
        .if(false, handleOnState3)
        .try();
      expect(output).toEqual(10);
    });
  });

  describe("#try", () => {
    it("does not run anything until called", () => {
      let state = new FunctionDispatcher()
        .if(true, handleOnState1)
        .if(false, handleOnState2)
        .if(true, handleOnState3);
      expect(output).toEqual(0);
      state.try();
      expect(output).toEqual(2);
    });

    it("executes based on the order of the #if calls", () => {
      let state = new FunctionDispatcher()
        .if(true, handleOnState3)
        .if(true, handleOnState1)
        .if(false, handleOnState2);
      expect(output).toEqual(0);
      state.try();
      expect(output).toEqual(1);
    });

    it("accepts parameters", () => {
      let state = new FunctionDispatcher<[number]>()
        .if(true, (amount) => {
          for (let i = 0; i < amount; i++) {
            handleOnState1();
          }
        })
        .if(false, (amount) => {
          for (let i = 0; i < amount; i++) {
            handleOnState2();
          }
        })
        .if(true, (amount) => {
          for (let i = 0; i < amount; i++) {
            handleOnState3();
          }
        });
      expect(output).toEqual(0);
      state.try(3);
      expect(output).toEqual(24);
    });
  });
});
