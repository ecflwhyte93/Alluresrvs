import Link from "next/link"
import { Flame, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"

export default function CreateListingPage() {
  // In a real app, check auth and subscription status
  const isLoggedIn = false
  const hasActiveSubscription = false

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-lg items-center px-4">
          <h1 className="text-xl font-bold">Create Listing</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Flame className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Sign in to post</h2>
            <p className="mt-2 max-w-xs text-muted-foreground">
              Create an account or sign in to create your listing
            </p>
            <div className="mt-6 flex w-full flex-col gap-3">
              <Link href="/auth/login">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        ) : !hasActiveSubscription ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Lock className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Subscription Required</h2>
            <p className="mt-2 max-w-xs text-muted-foreground">
              Choose a plan to start posting your listings
            </p>
            <Link href="/pricing" className="mt-6 w-full">
              <Button className="w-full bg-primary hover:bg-primary/90">
                View Plans
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            {/* Create listing form would go here */}
            <p className="text-muted-foreground">Create listing form...</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
