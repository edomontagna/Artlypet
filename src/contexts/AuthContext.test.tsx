import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

// Track auth state change callback
let authStateCallback: ((event: string, session: unknown) => void) | null = null;

const mockGetSession = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChange = vi.fn().mockImplementation((callback) => {
  authStateCallback = callback;
  return { data: { subscription: { unsubscribe: vi.fn() } } };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: () => mockGetSession(),
      onAuthStateChange: (cb: (event: string, session: unknown) => void) => mockOnAuthStateChange(cb),
      signOut: () => mockSignOut(),
    },
  },
}));

vi.mock("@/services/auth", () => ({
  signInWithPassword: vi.fn(),
  signUpWithEmail: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn().mockResolvedValue({}),
  resetPassword: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const TestConsumer = () => {
  const { user, loading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading ? "loading" : "ready"}</span>
      <span data-testid="user">{user ? user.email : "null"}</span>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authStateCallback = null;
  });

  it("starts in loading state and resolves", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading").textContent).toBe("loading");

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("ready");
    });
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("sets user when session exists", async () => {
    const mockSession = {
      user: { id: "user-1", email: "test@example.com" },
      access_token: "token",
    };
    mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("test@example.com");
    });
  });

  it("clears user on SIGNED_OUT event", async () => {
    const mockSession = {
      user: { id: "user-1", email: "test@example.com" },
      access_token: "token",
    };
    mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("test@example.com");
    });

    // Simulate sign out
    act(() => {
      authStateCallback?.("SIGNED_OUT", null);
    });

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("null");
    });
  });

  it("throws when useAuth is used outside provider", () => {
    const ErrorComponent = () => {
      try {
        useAuth();
        return <div>no error</div>;
      } catch (e) {
        return <div data-testid="error">{(e as Error).message}</div>;
      }
    };

    render(<ErrorComponent />);
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });
});
