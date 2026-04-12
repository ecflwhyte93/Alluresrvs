import { Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"

export default function FavoritesPage() {
  // In a real app, this would fetch from the database
  const favorites: never[] = []

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-lg items-center px-4">
          <h1 className="text-xl font-bold">Favorites</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">No favorites yet</h2>
            <p className="mt-2 max-w-xs text-muted-foreground">
              Start exploring and save the listings you like to see them here
            </p>
            <Link href="/home" className="mt-6">
              <Button className="bg-primary hover:bg-primary/90">
                Explore Listings
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {/* Favorites would render here */}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
