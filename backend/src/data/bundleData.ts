import type { BundleConfigResponse, BundleOptionsResponse } from "../types/bundle.js";

const baseImage = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80";

export const bundleOptions: BundleOptionsResponse = {
  options: [
    {
      id: "cam-v4",
      name: "Wyze Cam v4",
      description: "The clearest Wyze Cam ever made.",
      category: "cameras",
      price: 27.98,
      compareAtPrice: 35.98,
      defaultQuantity: 1,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: baseImage,
      badge: "Save 22%",
      colorOptions: ["White", "Grey", "Black"]
    },
    {
      id: "cam-pan-v3",
      name: "Wyze Cam Pan v3",
      description: "360° pan and 180° tilt security camera.",
      category: "cameras",
      price: 34.98,
      compareAtPrice: 39.98,
      defaultQuantity: 2,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: baseImage,
      badge: "Save 12%",
      colorOptions: ["White", "Black"]
    },
    {
      id: "cam-floodlight-v2",
      name: "Wyze Cam Floodlight v2",
      description: "2K floodlight camera with wide-angle view.",
      category: "cameras",
      price: 69.98,
      compareAtPrice: 89.98,
      defaultQuantity: 0,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: baseImage,
      badge: "Save 22%",
      colorOptions: ["White", "Black"]
    },
    {
      id: "cam-duo-doorbell",
      name: "Wyze Duo Cam Doorbell",
      description: "Two cameras. Two views. Double protection.",
      category: "cameras",
      price: 69.98,
      defaultQuantity: 0,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: baseImage
    },
    {
      id: "battery-cam-pro",
      name: "Wyze Battery Cam Pro",
      description: "Protect anywhere with 2.5K HDR.",
      category: "cameras",
      price: 89.98,
      defaultQuantity: 0,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: baseImage
    },
    {
      id: "motion-sensor",
      name: "Wyze Sense Motion Sensor",
      category: "sensors",
      price: 29.99,
      defaultQuantity: 2,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: baseImage
    },
    {
      id: "sense-hub",
      name: "Wyze Sense Hub (Required)",
      category: "sensors",
      price: 0,
      compareAtPrice: 29.92,
      required: true,
      defaultQuantity: 1,
      minQuantity: 1,
      maxQuantity: 1,
      imageUrl: baseImage
    },
    {
      id: "micro-sd-256",
      name: "Wyze MicroSD Card (256GB)",
      category: "accessories",
      price: 20.98,
      defaultQuantity: 2,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: baseImage
    },
    {
      id: "cam-unlimited-plan",
      name: "Cam Unlimited",
      category: "plan",
      price: 9.99,
      compareAtPrice: 12.99,
      defaultQuantity: 1,
      minQuantity: 0,
      maxQuantity: 1,
      imageUrl: baseImage
    },
    {
      id: "fast-shipping",
      name: "Fast Shipping",
      category: "extras",
      price: 0,
      compareAtPrice: 5.99,
      defaultQuantity: 1,
      minQuantity: 0,
      maxQuantity: 1,
      imageUrl: baseImage
    }
  ]
};

export const bundleConfig: BundleConfigResponse = {
  steps: [
    { id: "step-1", title: "Choose your cameras", category: "cameras", defaultExpanded: true },
    { id: "step-2", title: "Choose your plan", category: "plan" },
    { id: "step-3", title: "Choose your sensors", category: "sensors" },
    { id: "step-4", title: "Add extra protection", category: "extras" }
  ],
  checkoutLabel: "Checkout"
};
