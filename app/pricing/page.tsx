"use client"

import { useState } from "react"
import Link from "next/link"
import { X, Sparkles } from "lucide-react"
import { PRODUCTS, formatPrice } from "@/lib/products"
import { PricingCard } from "@/components/pricing-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { createCheckoutSession } from "@/app/actions/stripe"

export default function PricingPage() {
  const [selectedProduct, setSelectedProduct] = useState(
    PRODUCTS.find((p) => p.popular) || PRODUCTS[PRODUCTS.length - 1]
  )
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const { url } = await createCheckoutSession(selectedProduct.id)
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-4">
        <Link href="/home" className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
          <X className="h-5 w-5 text-foreground" />
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Choose Your Plan</h1>
        </div>
      </header>
      
      <p className="px-4 text-muted-foreground text-sm -mt-1 mb-6">
        Unlock the full Allure experience
      </p>

      {/* Pricing Cards */}
      <main className="flex-1 px-4 pb-32 space-y-4">
        {PRODUCTS.map((product) => (
          <PricingCard
            key={product.id}
            product={product}
            isSelected={selectedProduct.id === product.id}
            onSelect={() => setSelectedProduct(product)}
          />
        ))}
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
        >
          {loading ? (
            <>
              <Spinner className="mr-2 h-5 w-5" />
              Processing...
            </>
          ) : (
            <>Get {selectedProduct.name} — {formatPrice(selectedProduct.priceInCents)}</>
          )}
        </Button>
      </div>
    </div>
  )
}
