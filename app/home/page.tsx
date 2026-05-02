import { Flame } from "lucide-react"
import { ListingCard } from "@/components/listing-card"
import { BottomNav } from "@/components/bottom-nav"
import { mockListings } from "@/lib/mock-data"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Flame className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Allure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {mockListings.length} active
            </span>
          </div>
        </div>
      </header>

      {/* Listings Grid */}
      <main className="mx-auto max-w-lg px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {mockListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
