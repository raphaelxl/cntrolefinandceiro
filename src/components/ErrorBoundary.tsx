import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro inesperado na aplicação", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-lg text-center space-y-4">
            <h1 className="text-2xl font-semibold text-foreground">
              Algo deu errado ao carregar o app
            </h1>
            <p className="text-muted-foreground">
              Verifique se o build do Vite foi publicado corretamente (pasta
              <span className="font-semibold text-foreground"> dist</span>) e se as variáveis
              <span className="font-semibold text-foreground"> VITE_SUPABASE_URL</span> e
              <span className="font-semibold text-foreground"> VITE_SUPABASE_PUBLISHABLE_KEY</span>{" "}
              foram definidas no processo de deploy.
            </p>
            {this.state.error?.message ? (
              <p className="text-sm text-muted-foreground">
                Detalhe: {this.state.error.message}
              </p>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
