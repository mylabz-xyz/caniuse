import { expect } from "chai";
import { CanIUseService } from "./Caniuse.service";
import "mocha";

describe("First test", () => {
  it("should return true", () => {
    const caniuseService = new CanIUseService();
    const result = 3;
    expect(result).to.equal(true);
  });
});
