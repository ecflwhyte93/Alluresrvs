"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/listing-card"
import { BottomNav } from "@/components/bottom-nav"
import { mockListings } from "@/lib/mock-data"

const categories = ["All", "Featured", "Verified", "New", "Popular"]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredListings = mockListings.filter((listing) => {
    const matchesQuery = 
      listing.title.toLowerCase().includes(query.toLowerCase()) ||
      listing.location?.toLowerCase().includes(query.toLowerCase())
    
    if (activeCategory === "All") return matchesQuery
    if (activeCategory === "Featured") return matchesQuery && listing.is_featured
    if (activeCategory === "Verified") return matchesQuery && listing.profiles?.is_verified
    if (activeCategory === "New") return matchesQuery
    if (activeCategory === "Popular") return matchesQuery && listing.views > 200
    
    return matchesQuery
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background px-4 py-3">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 pr-9 bg-muted/50 border-0"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Categories */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="mx-auto max-w-lg px-4 py-4">
        <p className="mb-4 text-sm text-muted-foreground">
          {filteredListings.length} {filteredListings.length === 1 ? "result" : "results"}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg font-medium">No results found</p>
            <p className="mt-1 text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
