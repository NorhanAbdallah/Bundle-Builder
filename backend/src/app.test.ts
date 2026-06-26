import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "./app.js";

describe("bundle api", () => {
  it("returns options payload", async () => {
    const response = await request(app).get("/api/bundle/options");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.options)).toBe(true);
    expect(response.body.options.length).toBeGreaterThan(0);
  });

  it("returns config payload", async () => {
    const response = await request(app).get("/api/bundle/config");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.steps)).toBe(true);
    expect(typeof response.body.checkoutLabel).toBe("string");
  });
});
