import React from 'react'

type Props = { children: React.ReactNode }

type State = { hasError: boolean; message?: string }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { hasError: true, message }
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('UI crashed:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-primary/5 to-accent/5">
          <section className="w-full max-w-xl text-center space-y-4 rounded-xl border bg-card text-card-foreground p-8 shadow-elevated">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground break-words">{this.state.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, message: undefined })}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition-smooth"
            >
              Try again
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
