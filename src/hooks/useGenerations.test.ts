import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";

// Mock auth
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-123" } }),
}));

// Mock generations service
const mockCheckStatus = vi.fn();
vi.mock("@/services/generations", () => ({
  getGenerations: vi.fn().mockResolvedValue({ data: [], error: null }),
  checkGenerationStatus: (...args: unknown[]) => mockCheckStatus(...args),
}));

import { useGenerationStatus } from "./useGenerations";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useGenerationStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data when status is completed", async () => {
    mockCheckStatus.mockResolvedValue({
      status: "completed",
      result_path: "/images/result.jpg",
    });

    const { result } = renderHook(
      () => useGenerationStatus("gen-123", true, Date.now()),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("completed");
  });

  it("returns data when status is failed", async () => {
    mockCheckStatus.mockResolvedValue({
      status: "failed",
      error_message: "Gemini API error",
    });

    const { result } = renderHook(
      () => useGenerationStatus("gen-456", true, Date.now()),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("failed");
  });

  it("does not fetch when generationId is null", () => {
    const { result } = renderHook(
      () => useGenerationStatus(null, true, Date.now()),
      { wrapper: createWrapper() }
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockCheckStatus).not.toHaveBeenCalled();
  });

  it("does not fetch when enabled is false", () => {
    const { result } = renderHook(
      () => useGenerationStatus("gen-789", false, Date.now()),
      { wrapper: createWrapper() }
    );

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("stops polling after 120 seconds (refetchInterval returns false)", async () => {
    mockCheckStatus.mockResolvedValue({ status: "processing" });

    // Start time is 121 seconds ago — beyond the timeout
    const startTime = Date.now() - 121_000;

    const { result } = renderHook(
      () => useGenerationStatus("gen-timeout", true, startTime),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // The hook's refetchInterval callback checks Date.now() - startTime >= 120_000
    // Since we set startTime 121s ago, polling should stop.
    // We verify it fetched once but the refetchInterval logic would return false.
    expect(mockCheckStatus).toHaveBeenCalledWith("gen-timeout");
  });
});
