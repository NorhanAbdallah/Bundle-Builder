import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BundleBuilderPage } from "./BundleBuilderPage";

const mockOptionsRes = {
  options: [
    {
      id: "cam-v4",
      name: "Cam V4",
      category: "cameras",
      price: 20,
      defaultQuantity: 1,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: "https://example.com/img.png"
    }
  ]
};

const mockConfigRes = {
  steps: [
    { id: "s1", title: "Choose your cameras", category: "cameras", defaultExpanded: true },
    { id: "s2", title: "Choose your plan", category: "plan", defaultExpanded: false }
  ],
  checkoutLabel: "Checkout"
};

describe("BundleBuilderPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/options")) {
        return Promise.resolve(new Response(JSON.stringify(mockOptionsRes)));
      }
      return Promise.resolve(new Response(JSON.stringify(mockConfigRes)));
    });
  });

  it("renders and updates quantity from controls", async () => {
    render(<BundleBuilderPage />);
    await screen.findByText("Choose your cameras");
    const plusButton = screen.getByRole("button", { name: /increment cam v4/i });
    await userEvent.click(plusButton);
    await waitFor(() => {
      expect(screen.getByText("2 items selected")).toBeInTheDocument();
    });
  });

  it("collapses and expands a step section", async () => {
    render(<BundleBuilderPage />);
    const planToggle = await screen.findByRole("button", { name: /choose your plan/i });
    expect(planToggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(planToggle);
    await waitFor(() => expect(planToggle).toHaveAttribute("aria-expanded", "true"));
  });
});
