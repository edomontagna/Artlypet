import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSingle = vi.fn();
const mockRange = vi.fn().mockReturnValue({ data: [], error: null });
const mockOrder = vi.fn().mockReturnValue({ range: mockRange });
const mockEq = vi.fn().mockReturnValue({ single: mockSingle, order: mockOrder });
const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

import { getCreditBalance, getCreditTransactions } from "./credits";

describe("getCreditBalance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns credit balance on success", async () => {
    mockSingle.mockResolvedValue({ data: { credit_balance: 500 }, error: null });
    const result = await getCreditBalance("user-123");
    expect(result).toBe(500);
    expect(mockFrom).toHaveBeenCalledWith("profiles");
  });

  it("throws when data is null (no profile found)", async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: "Not found" } });
    await expect(getCreditBalance("user-123")).rejects.toEqual({ message: "Not found" });
  });
});

describe("getCreditTransactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches transactions with pagination", async () => {
    const mockData = [{ id: "tx-1", amount: 100 }];
    mockRange.mockReturnValue({ data: mockData, error: null });
    const result = await getCreditTransactions("user-123", 0);
    expect(result.data).toEqual(mockData);
  });
});
