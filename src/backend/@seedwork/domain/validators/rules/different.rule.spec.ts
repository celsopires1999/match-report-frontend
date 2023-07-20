import { validateSync } from "class-validator";
import { Different } from "./different.rule";

describe("Different Rule Tests", () => {
  type Property = {
    id: string;
    attribute: number;
  };

  class StubTest {
    prop1!: Property;
    @Different("prop1", "id")
    prop2!: Property;
  }

  it("should be invalid when two properties have the same id are equal", () => {
    const stubTest = new StubTest();
    stubTest.prop1 = {
      id: "id1",
      attribute: 1,
    };
    stubTest.prop2 = {
      id: "id1",
      attribute: 1,
    };

    const errors = validateSync(stubTest);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.Different).toBe(
      "prop1 and prop2 must be different"
    );
  });

  it("should be valid when two properties have different ids", () => {
    const stubTest = new StubTest();
    stubTest.prop1 = {
      id: "id1",
      attribute: 1,
    };
    stubTest.prop2 = {
      id: "id2",
      attribute: 1,
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
      id: "id2",
      attribute: 1,
    };

    const errors = validateSync(stubTest);
    expect(errors.length).toBe(0);
  });

  it("should be valid when empty when the second prop is empty", () => {
    const stubTest = new StubTest();
    stubTest.prop1 = {
      id: "id1",
      attribute: 1,
    };

    const errors = validateSync(stubTest);
    expect(errors.length).toBe(0);
  });
});
