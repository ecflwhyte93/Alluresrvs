import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, BadgeCheck, Heart, MessageCircle, Share2, Eye, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockListings } from "@/lib/mock-data"

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listing = mockListings.find((l) => l.id === id)

  if (!listing) {
    notFound()
  }

  const profile = listing.profiles
  const imageUrl = listing.images?.[0] || profile?.avatar_url || "/placeholder.jpg"

  return (
    <div className="min-h-screen bg-background">
      {/* Image Header */}
      <div className="relative aspect-[3/4] max-h-[70vh]">
        <Image
          src={imageUrl}
          alt={listing.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Back Button */}
        <Link
          href="/home"
          className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-primary hover:text-white">
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {listing.is_featured && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative -mt-8 rounded-t-3xl bg-background px-4 pb-32 pt-6">
        <div className="mx-auto max-w-lg">
          {/* Name & Verification */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              {listing.title}
              {profile?.age && <span className="font-normal text-muted-foreground">, {profile.age}</span>}
            </h1>
            {profile?.is_verified && (
              <BadgeCheck className="h-6 w-6 text-primary fill-primary/20" />
            )}
          </div>

          {/* Location */}
          {listing.location && (
            <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{listing.location}</span>
            </div>
          )}

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{listing.views} views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Active now</span>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}

          {/* Subscription Badge */}
          {profile?.subscription_tier && profile.subscription_tier !== 'free' && (
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium capitalize">{profile.subscription_tier} Member</p>
                  <p className="text-sm text-muted-foreground">Verified and trusted user</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-lg gap-3">
          <Button variant="outline" size="lg" className="flex-1">
            <Heart className="mr-2 h-5 w-5" />
            Save
          </Button>
          <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90">
            <MessageCircle className="mr-2 h-5 w-5" />
            Contact
          </Button>
        </div>
      </div>
    </div>
  )
}
