import type { BundleConfigResponse, BundleOptionsResponse } from "../types/bundle.js";

export const bundleOptions: BundleOptionsResponse = {
  options: [
    {
      id: "cam-v4",
      name: "Wyze Cam v4",
      description: "The clearest Wyze Cam ever made — 2.5K with Color Night Vision.",
      category: "cameras",
      price: 27.98,
      compareAtPrice: 35.98,
      defaultQuantity: 1,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=400&q=80",
      badge: "Save 22%",
      colorOptions: ["White", "Grey", "Black"]
    },
    {
      id: "cam-pan-v3",
      name: "Wyze Cam Pan v3",
      description: "360° pan and 180° tilt so one camera covers the whole room.",
      category: "cameras",
      price: 34.98,
      compareAtPrice: 39.98,
      defaultQuantity: 2,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: "https://images.unsplash.com/photo-1585771724682-643adb0428c4?w=400&q=80",
      badge: "Save 12%",
      colorOptions: ["White", "Black"]
    },
    {
      id: "cam-floodlight-v2",
      name: "Wyze Cam Floodlight v2",
      description: "2K floodlight camera with wide-angle outdoor coverage.",
      category: "cameras",
      price: 69.98,
      compareAtPrice: 89.98,
      defaultQuantity: 0,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80",
      badge: "Save 22%",
      colorOptions: ["White", "Black"]
    },
    {
      id: "cam-duo-doorbell",
      name: "Wyze Duo Cam Doorbell",
      description: "Two cameras. Two views. Double protection at the front door.",
      category: "cameras",
      price: 69.98,
      defaultQuantity: 0,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: "https://images.unsplash.com/photo-1558002038-10926172aa9c?w=400&q=80",
      colorOptions: ["White", "Black"]
    },
    {
      id: "battery-cam-pro",
      name: "Wyze Battery Cam Pro",
      description: "Wire-free outdoor protection with 2.5K HDR.",
      category: "cameras",
      price: 89.98,
      defaultQuantity: 0,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&q=80",
      colorOptions: ["White", "Black"]
    },
    {
      id: "cam-unlimited-plan",
      name: "Cam Unlimited",
      description: "14-day cloud history, person/package alerts, and smart detections.",
      category: "plan",
      price: 9.99,
      compareAtPrice: 12.99,
      defaultQuantity: 1,
      minQuantity: 0,
      maxQuantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80",
      badge: "Most popular"
    },
    {
      id: "cam-plus-plan",
      name: "Cam Plus",
      description: "7-day cloud history and person detection for everyday coverage.",
      category: "plan",
      price: 4.99,
      compareAtPrice: 6.99,
      defaultQuantity: 0,
      minQuantity: 0,
      maxQuantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80"
    },
    {
      id: "no-plan",
      name: "Local storage only",
      description: "Skip cloud video. Use an SD card for on-device recording.",
      category: "plan",
      price: 0,
      defaultQuantity: 0,
      minQuantity: 0,
      maxQuantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80"
    },
    {
      id: "motion-sensor",
      name: "Wyze Sense Motion Sensor",
      description: "Catch movement in hallways, rooms, and entry points.",
      category: "sensors",
      price: 29.99,
      defaultQuantity: 2,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80"
    },
    {
      id: "entry-sensor",
      name: "Wyze Sense Entry Sensor",
      description: "Know when doors and windows open — day or night.",
      category: "sensors",
      price: 19.99,
      compareAtPrice: 24.99,
      defaultQuantity: 1,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=400&q=80",
      badge: "Save 20%"
    },
    {
      id: "sense-hub",
      name: "Wyze Sense Hub (Required)",
      description: "Connects your sensors to the Wyze app. Included free with sensors.",
      category: "sensors",
      price: 0,
      compareAtPrice: 29.92,
      required: true,
      defaultQuantity: 1,
      minQuantity: 1,
      maxQuantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80"
    },
    {
      id: "micro-sd-256",
      name: "Wyze MicroSD Card (256GB)",
      description: "Local backup recording when cloud history is off or offline.",
      category: "accessories",
      price: 20.98,
      defaultQuantity: 2,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80"
    },
    {
      id: "cam-mount",
      name: "Magnetic Mount Kit",
      description: "Quick install indoor/outdoor mounts for Cam v4 and Pan.",
      category: "accessories",
      price: 14.98,
      compareAtPrice: 19.98,
      defaultQuantity: 0,
      minQuantity: 0,
      maxQuantity: 10,
      imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&q=80",
      badge: "Save 25%"
    },
    {
      id: "fast-shipping",
      name: "Fast Shipping",
      description: "Priority handling so your system arrives in 2–3 business days.",
      category: "extras",
      price: 0,
      compareAtPrice: 5.99,
      defaultQuantity: 1,
      minQuantity: 0,
      maxQuantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
      badge: "Free today"
    },
    {
      id: "extended-warranty",
      name: "2-year Protection Plan",
      description: "Accidental damage coverage and priority replacement support.",
      category: "extras",
      price: 19.99,
      defaultQuantity: 0,
      minQuantity: 0,
      maxQuantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80"
    }
  ]
};

export const bundleConfig: BundleConfigResponse = {
  steps: [
    {
      id: "step-1",
      title: "Choose your cameras",
      category: "cameras",
      categories: ["cameras"],
      defaultExpanded: true
    },
    {
      id: "step-2",
      title: "Choose your plan",
      category: "plan",
      categories: ["plan"]
    },
    {
      id: "step-3",
      title: "Choose your sensors",
      category: "sensors",
      categories: ["sensors"]
    },
    {
      id: "step-4",
      title: "Add extra protection",
      category: "extras",
      categories: ["accessories", "extras"]
    }
  ],
  checkoutLabel: "Checkout"
};
