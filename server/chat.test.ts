import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("chat.sendMessage", () => {
  it("should return a message response with sessionId", { timeout: 30000 }, async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.sendMessage({
      message: "Show me trendy bags for fall",
      sessionId: "test-session-123",
      season: "fall",
      budgetTier: "500",
    });

    expect(result).toHaveProperty("message");
    expect(result).toHaveProperty("sessionId");
    expect(result.sessionId).toBe("test-session-123");
    expect(typeof result.message).toBe("string");
    expect(result.message.length).toBeGreaterThan(0);
  });

  it("should handle requests without season and budget", { timeout: 30000 }, async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.sendMessage({
      message: "What bags are trending?",
      sessionId: "test-session-456",
    });

    expect(result).toHaveProperty("message");
    expect(result).toHaveProperty("sessionId");
    expect(typeof result.message).toBe("string");
  });

  it("should handle conversation history", { timeout: 30000 }, async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.sendMessage({
      message: "Tell me more about the first bag",
      sessionId: "test-session-789",
      season: "spring",
      budgetTier: "5000",
      conversationHistory: [
        { role: "user", content: "Show me spring bags" },
        { role: "assistant", content: "Here are some spring bags..." },
      ],
    });

    expect(result).toHaveProperty("message");
    expect(typeof result.message).toBe("string");
  });
});

describe("chat.getCelebrityPhotos", () => {
  it("should return celebrity associations for known bags", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.getCelebrityPhotos({
      bagName: "Le City",
      brand: "Balenciaga",
    });

    expect(result).toHaveProperty("celebrities");
    expect(result).toHaveProperty("searchQuery");
    expect(Array.isArray(result.celebrities)).toBe(true);
    expect(result.celebrities.length).toBeGreaterThan(0);
    expect(result.searchQuery).toContain("Balenciaga");
    expect(result.searchQuery).toContain("Le City");
  });

  it("should return default celebrities for unknown bags", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.getCelebrityPhotos({
      bagName: "Unknown Bag",
      brand: "Unknown Brand",
    });

    expect(result).toHaveProperty("celebrities");
    expect(Array.isArray(result.celebrities)).toBe(true);
    expect(result.celebrities.length).toBeGreaterThan(0);
  });
});

describe("anti-basic filter", () => {
  it("should not recommend blacklisted bags", { timeout: 30000 }, async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.sendMessage({
      message: "Show me Louis Vuitton bags",
      sessionId: "test-session-blacklist",
      season: "fall",
      budgetTier: "5000",
    });

    const message = result.message.toLowerCase();
    // Should not contain blacklisted items
    expect(message).not.toContain("neverfull");
    expect(message).not.toContain("goyard st. louis");
    expect(message).not.toContain("michael kors jet set");
  });
});
