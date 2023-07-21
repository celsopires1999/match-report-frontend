import { validateSync } from "class-validator";
import { DiffValue } from "./diff-value.rule";

describe("DiffValue Rule Tests", () => {
  type Property = {
    value: {
      id: string;
      attribute: number;
    };
  };

  class StubTest {
    prop1!: Property;
    @DiffValue("prop1", "id")
    prop2!: Property;
  }

  it("should be invalid when two properties have the same id are equal", () => {
    const stubTest = new StubTest();
    stubTest.prop1 = {
      value: {
        id: "id1",
        attribute: 1,
      },
    };
    stubTest.prop2 = {
      value: {
        id: "id1",
        attribute: 1,
      },
    };

    const errors = validateSync(stubTest);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.DiffValue).toBe(
      "prop1 and prop2 must be different"
    );
  });

  it("should be valid when two properties have different ids", () => {
    const stubTest = new StubTest();
    stubTest.prop1 = {
      value: {
        id: "id1",
        attribute: 1,
      },
    };
    stubTest.prop2 = {
      value: {
        id: "id2",
        attribute: 1,
      },
    };

    const errors = validateSync(stubTest);
    expect(errors.length).toBe(0);
  });

  it("should be valid when empty", () => {
    const stubTest = new StubTest();
    const errors = validateSync(stubTest);
    expect(errors.length).toBe(0);
  });

  it("should be valid when empty when the first prop is empty", () => {
    const stubTest = new StubTest();
    stubTest.prop2 = {
      value: {
        id: "id2",
        attribute: 1,
      },
    };

    const errors = validateSync(stubTest);
    expect(errors.length).toBe(0);
  });

  it("should be valid when empty when the second prop is empty", () => {
    const stubTest = new StubTest();
    stubTest.prop1 = {
      value: {
        id: "id1",
        attribute: 1,
      },
    };

    const errors = validateSync(stubTest);
    expect(errors.length).toBe(0);
  });
});
