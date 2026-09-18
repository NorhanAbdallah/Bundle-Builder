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

const cam: ProductOption = {
  id: "cam-v4",
  name: "Cam V4",
  category: "cameras",
  price: 20,
  defaultQuantity: 1,
  minQuantity: 0,
  maxQuantity: 10,
  imageUrl: "",
  colorOptions: ["White", "Black"]
};

const plans: ProductOption[] = [
  {
    id: "plan-a",
    name: "Plan A",
    category: "plan",
    price: 9.99,
    defaultQuantity: 1,
    minQuantity: 0,
    maxQuantity: 1,
    imageUrl: ""
  },
  {
    id: "plan-b",
    name: "Plan B",
    category: "plan",
    price: 4.99,
    defaultQuantity: 0,
    minQuantity: 0,
    maxQuantity: 1,
    imageUrl: ""
  }
];

describe("useBundleStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useBundleStore.setState({ quantities: {}, colors: {}, initialized: false });
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

  it("persists selected color and hydrates it", () => {
    useBundleStore.getState().initialize([cam]);
    useBundleStore.getState().setColor(cam.id, "Black");
    expect(useBundleStore.getState().colors[cam.id]).toBe("Black");

    useBundleStore.setState({ quantities: {}, colors: {}, initialized: false });
    useBundleStore.getState().initialize([cam]);
    expect(useBundleStore.getState().colors[cam.id]).toBe("Black");
  });

  it("selects one plan exclusively", () => {
    useBundleStore.getState().initialize(plans);
    useBundleStore.getState().selectPlan(plans[1], plans);
    expect(useBundleStore.getState().quantities["plan-a"]).toBe(0);
    expect(useBundleStore.getState().quantities["plan-b"]).toBe(1);
  });
});
