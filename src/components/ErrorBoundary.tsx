import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import i18n from "@/i18n";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
    console.error("ErrorBoundary caught:", errorReport);
    try {
      sessionStorage.setItem("last-error-report", JSON.stringify(errorReport));
    } catch { /* storage full */ }
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message ?? "Unknown error";
      const mailtoBody = encodeURIComponent(
        `Error: ${errorMessage}\nURL: ${window.location.href}\nTime: ${new Date().toISOString()}`
      );
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center max-w-md">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
              {i18n.t("error.title", "Something went wrong")}
            </h1>
            <p className="text-muted-foreground mb-6">
              {i18n.t("error.desc", "An unexpected error occurred. Please try refreshing the page.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = "/";
                }}
                className="rounded-full"
              >
                {i18n.t("error.backHome", "Back to Home")}
              </Button>
              <Button variant="outline" className="rounded-full" asChild>
                <a href={`mailto:support@artlypet.com?subject=Bug Report&body=${mailtoBody}`}>
                  {i18n.t("error.report", "Report this error")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
