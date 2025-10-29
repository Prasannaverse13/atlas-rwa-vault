import { lazy, Suspense, useState } from 'react'

const WalletApp = lazy(() => import('@/components/WalletApp'))

const Fallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/5">
    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-label="Loading" />
  </div>
)

const InstantLanding = ({ onEnter }: { onEnter: () => void }) => (
  <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-primary/5 to-accent/5">
    <section className="w-full max-w-3xl text-center space-y-6 animate-slide-up">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Atlas Treasury
      </h1>
      <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
        Ultra-fast AI-powered RWA treasury dashboard. Connect your wallet to begin.
      </p>
      <div>
        <button
          onClick={onEnter}
          className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold bg-primary text-primary-foreground shadow-elevated transition-smooth hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </section>
  </main>
)

const Index = () => {
  const [showApp, setShowApp] = useState(false)

  return (
    <Suspense fallback={<Fallback />}>
      {!showApp ? <InstantLanding onEnter={() => setShowApp(true)} /> : <WalletApp />}
    </Suspense>
  )
}

export default Index
