export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval: "one-time" | "week" | "month"
  features: string[]
  popular?: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: "single-post",
    name: "Single Post",
    description: "Post one listing, active for 30 days",
    priceInCents: 599,
    interval: "one-time",
    features: [
      "1 listing",
      "30-day visibility",
      "Basic support",
    ],
  },
  {
    id: "weekly-pass",
    name: "Weekly Pass",
    description: "Unlimited posts for 7 days",
    priceInCents: 1099,
    interval: "week",
    features: [
      "Unlimited listings",
      "7-day access",
      "Priority placement",
      "Featured badge",
    ],
  },
  {
    id: "monthly-pass",
    name: "Monthly Pass",
    description: "Best value — unlimited posts for 30 days",
    priceInCents: 2999,
    interval: "month",
    features: [
      "Unlimited listings",
      "30-day access",
      "Priority placement",
      "Featured badge",
      "Profile verification",
    ],
    popular: true,
  },
]

export function getProduct(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId)
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100)
}

export function formatInterval(interval: Product["interval"]): string {
  switch (interval) {
    case "one-time":
      return "one-time"
    case "week":
      return "per week"
    case "month":
      return "per month"
  }
}
