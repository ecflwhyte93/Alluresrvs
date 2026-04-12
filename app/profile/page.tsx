import Link from "next/link"
import { User, Settings, CreditCard, HelpCircle, LogOut, ChevronRight, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"

const menuItems = [
  { icon: User, label: "Edit Profile", href: "/profile/edit" },
  { icon: CreditCard, label: "Subscription", href: "/pricing" },
  { icon: Settings, label: "Settings", href: "/profile/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/support" },
]

export default function ProfilePage() {
  // In a real app, check auth state
  const isLoggedIn = false

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-lg items-center px-4">
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Flame className="h-12 w-12 text-primary" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Welcome to Allure</h2>
            <p className="mt-2 max-w-xs text-muted-foreground">
              Sign in or create an account to unlock all features
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
        ) : (
          <>
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-muted" />
              <div>
                <h2 className="text-xl font-semibold">User Name</h2>
                <p className="text-muted-foreground">user@example.com</p>
              </div>
            </div>

            {/* Subscription Banner */}
            <Link href="/pricing" className="mt-6 block">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Free Plan</p>
                    <p className="text-sm text-muted-foreground">Upgrade for more features</p>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Upgrade
                  </Button>
                </div>
              </div>
            </Link>

            {/* Menu Items */}
            <div className="mt-6 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              ))}
            </div>

            {/* Sign Out */}
            <button className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-destructive transition-colors hover:bg-destructive/10">
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
