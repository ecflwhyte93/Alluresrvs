"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, BadgeCheck, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Listing } from "@/lib/types"

interface ListingCardProps {
  listing: Listing
  className?: string
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const profile = listing.profiles
  const imageUrl = listing.images?.[0] || profile?.avatar_url || "/placeholder.jpg"

  return (
    <Link href={`/listing/${listing.id}`} className={cn("block", className)}>
      <div className="group relative overflow-hidden rounded-2xl bg-card">
        <div className="aspect-[3/4] relative">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {listing.is_featured && (
            <div className="absolute top-3 left-3 rounded-full bg-primary/90 px-2.5 py-1 text-xs font-semibold text-primary-foreground">
              Featured
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-semibold text-white">
                {listing.title}
                {profile?.age && <span className="font-normal">, {profile.age}</span>}
              </h3>
              {profile?.is_verified && (
                <BadgeCheck className="h-5 w-5 text-primary fill-primary/20" />
              )}
            </div>

            {listing.location && (
              <div className="mt-1 flex items-center gap-1 text-sm text-white/80">
                <MapPin className="h-3.5 w-3.5" />
                <span>{listing.location}</span>
              </div>
            )}

            <div className="mt-2 flex items-center gap-1 text-xs text-white/60">
              <Eye className="h-3.5 w-3.5" />
              <span>{listing.views} views</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
