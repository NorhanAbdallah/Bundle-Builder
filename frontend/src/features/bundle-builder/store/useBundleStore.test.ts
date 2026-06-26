import { beforeEach, describe, expect, it } from "vitest";
import { useBundleStore } from "./useBundleStore";
import type { ProductOption } from "../../../entities/bundle/types";

const requiredSensor: ProductOption = {
  id: "sense-hub",
  name: "Sense Hub",
  category: "sensors",
  price: 0,
  required: true,
  defaultQuantity: 1,
  minQuantity: 1,
  maxQuantity: 1,
  imageUrl: ""
};

describe("useBundleStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useBundleStore.setState({ quantities: {}, initialized: false });
  });

  it("initializes from defaults", () => {
    useBundleStore.getState().initialize([requiredSensor]);
    expect(useBundleStore.getState().quantities[requiredSensor.id]).toBe(1);
  });

  it("does not decrement required item below minimum", () => {
    useBundleStore.getState().initialize([requiredSensor]);
    useBundleStore.getState().decrement(requiredSensor);
    expect(useBundleStore.getState().quantities[requiredSensor.id]).toBe(1);
  });
});
