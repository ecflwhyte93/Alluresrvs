"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { type Product, formatPrice, formatInterval } from "@/lib/products"
import { createCheckoutSession } from "@/app/actions/stripe"

interface PricingCardProps {
  product: Product
  isSelected?: boolean
  onSelect?: () => void
}

export function PricingCard({ product, isSelected, onSelect }: PricingCardProps) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const { url } = await createCheckoutSession(product.id)
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={onSelect || handleSubscribe}
      disabled={loading}
      className={`relative w-full text-left rounded-xl p-5 transition-all ${
        product.popular
          ? "border-2 border-primary bg-card"
          : "border border-border bg-card hover:border-primary/50"
      }`}
    >
      {product.popular && (
        <span className="absolute -top-3 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-primary text-primary-foreground rounded-md">
          Best Value
        </span>
      )}
      
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{product.description}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.priceInCents)}
          </span>
          <p className="text-xs text-muted-foreground">{formatInterval(product.interval)}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-xl">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      )}
    </button>
  )
}
