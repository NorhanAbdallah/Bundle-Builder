import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BundleBuilderPage } from "./BundleBuilderPage";
import { useBundleStore } from "../store/useBundleStore";

const mockOptionsRes = {
  options: [
    {
      id: "cam-v4",
      name: "Cam V4",
      category: "cameras",
      price: 20,
      compareAtPrice: 30,
      defaultQuantity: 1,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: "https://example.com/img.png",
      colorOptions: ["White", "Black"]
    },
    {
      id: "cam-unlimited-plan",
      name: "Cam Unlimited",
      category: "plan",
      price: 9.99,
      compareAtPrice: 12.99,
      defaultQuantity: 0,
      minQuantity: 0,
      maxQuantity: 1,
      imageUrl: "https://example.com/plan.png",
      badge: "Most popular"
    },
    {
      id: "cam-plus-plan",
      name: "Cam Plus",
      category: "plan",
      price: 4.99,
      defaultQuantity: 0,
      minQuantity: 0,
      maxQuantity: 1,
      imageUrl: "https://example.com/plan2.png"
    }
  ]
};

const mockConfigRes = {
  steps: [
    {
      id: "s1",
      title: "Choose your cameras",
      category: "cameras",
      categories: ["cameras"],
      defaultExpanded: true
    },
    {
      id: "s2",
      title: "Choose your plan",
      category: "plan",
      categories: ["plan"],
      defaultExpanded: false
    }
  ],
  checkoutLabel: "Checkout"
};

async function renderReadyPage() {
  render(<BundleBuilderPage />);
  await screen.findByRole("heading", { name: /choose your cameras/i });
}

describe("BundleBuilderPage", () => {
  beforeEach(() => {
    localStorage.clear();
    useBundleStore.setState({ quantities: {}, colors: {}, initialized: false });
    vi.restoreAllMocks();
    vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/options")) {
        return Promise.resolve(new Response(JSON.stringify(mockOptionsRes)));
      }
      return Promise.resolve(new Response(JSON.stringify(mockConfigRes)));
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders and updates quantity from controls", async () => {
    await renderReadyPage();
    const plusButton = screen.getByRole("button", { name: /increase cam v4/i });
    await userEvent.click(plusButton);
    await waitFor(() => {
      expect(screen.getByText("2 items selected")).toBeInTheDocument();
    });
  });

  it("collapses and expands a step section", async () => {
    await renderReadyPage();
    const planToggle = screen.getByRole("button", { name: /step 2 of 2/i });
    expect(planToggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(planToggle);
    await waitFor(() => expect(planToggle).toHaveAttribute("aria-expanded", "true"));
  });

  it("disables checkout until at least one item is selected", async () => {
    await renderReadyPage();
    const decrease = screen.getByRole("button", { name: /decrease cam v4/i });
    await userEvent.click(decrease);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /^checkout$/i })).toBeDisabled();
      expect(screen.getByText(/select at least one item/i)).toBeInTheDocument();
    });
  });

  it("updates savings copy when discounted items are selected", async () => {
    await renderReadyPage();
    await waitFor(() => {
      expect(screen.getByText(/you're saving \$10\.00/i)).toBeInTheDocument();
    });
  });

  it("shows feedback after saving for later", async () => {
    await renderReadyPage();
    await userEvent.click(screen.getByRole("button", { name: /save my system for later/i }));
    expect(screen.getByText(/bundle saved on this device/i)).toBeInTheDocument();
  });

  it("navigates to the next step with the step CTA", async () => {
    await renderReadyPage();
    await userEvent.click(screen.getByRole("button", { name: /next: choose your plan/i }));
    const planToggle = screen.getByRole("button", { name: /step 2 of 2/i });
    await waitFor(() => expect(planToggle).toHaveAttribute("aria-expanded", "true"));
  });

  it("selects a plan exclusively", async () => {
    await renderReadyPage();
    await userEvent.click(screen.getByRole("button", { name: /next: choose your plan/i }));
    const plusPlan = await screen.findByRole("button", { name: /cam plus/i });
    await userEvent.click(plusPlan);
    expect(plusPlan).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /cam unlimited/i })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("groups selected items by category in the review panel", async () => {
    await renderReadyPage();
    expect(screen.getByRole("heading", { name: /^cameras$/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /next: choose your plan/i }));
    await userEvent.click(await screen.findByRole("button", { name: /cam unlimited/i }));
    expect(screen.getByRole("heading", { name: /^plan$/i })).toBeInTheDocument();
  });
});
