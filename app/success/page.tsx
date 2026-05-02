import { Suspense } from "react"
import Link from "next/link"
import { Flame, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCheckoutSession } from "@/app/actions/stripe"
import { getProduct } from "@/lib/products"

async function SuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id

  if (!sessionId) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Flame className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Session Not Found</h1>
          <p className="text-muted-foreground mt-2">
            We couldn&apos;t find your checkout session.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8">
          <Link href="/">Return to Pricing</Link>
        </Button>
      </div>
    )
  }

  const session = await getCheckoutSession(sessionId)
  const product = session.productId ? getProduct(session.productId) : null

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </div>
      
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome to Allure!</h1>
        <p className="text-muted-foreground mt-2">
          Your purchase has been confirmed.
        </p>
      </div>

      {session.customerEmail && (
        <p className="text-sm text-muted-foreground">
          A confirmation email has been sent to{" "}
          <span className="font-medium text-foreground">
            {session.customerEmail}
          </span>
        </p>
      )}

      {product && (
        <div className="bg-card border border-border rounded-xl p-4 max-w-xs mx-auto">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Your plan</p>
          <p className="text-lg font-semibold text-foreground mt-1">{product.name}</p>
        </div>
      )}

      <div className="space-y-3 pt-4">
        <Button asChild className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12">
          <Link href="/">Get Started</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full max-w-xs text-muted-foreground hover:text-foreground">
          <Link href="/">View Plans</Link>
        </Button>
      </div>
    </div>
  )
}

function LoadingContent() {
  return (
    <div className="text-center space-y-6">
      <div className="mx-auto h-20 w-20 rounded-2xl bg-card animate-pulse" />
      <div className="space-y-2">
        <div className="h-7 bg-card rounded animate-pulse mx-auto w-48" />
        <div className="h-5 bg-card rounded animate-pulse mx-auto w-64" />
      </div>
      <div className="h-16 bg-card rounded-xl animate-pulse max-w-xs mx-auto" />
      <div className="space-y-3 pt-4">
        <div className="h-12 bg-card rounded-xl animate-pulse max-w-xs mx-auto" />
        <div className="h-10 bg-card/50 rounded animate-pulse max-w-xs mx-auto" />
      </div>
    </div>
  )
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Suspense fallback={<LoadingContent />}>
        <SuccessContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
