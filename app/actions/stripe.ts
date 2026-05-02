"use server"

import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { getProduct, type Product } from "@/lib/products"

function getStripeMode(interval: Product["interval"]): "payment" | "subscription" {
  return interval === "one-time" ? "payment" : "subscription"
}

function getStripeInterval(interval: Product["interval"]): "week" | "month" | undefined {
  if (interval === "one-time") return undefined
  return interval
}

export async function createCheckoutSession(productId: string) {
  const product = getProduct(productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const headersList = await headers()
  const origin = headersList.get("origin") || "http://localhost:3000"
  const mode = getStripeMode(product.interval)
  const stripeInterval = getStripeInterval(product.interval)

  const priceData: {
    currency: string
    product_data: { name: string; description: string }
    unit_amount: number
    recurring?: { interval: "week" | "month" }
  } = {
    currency: "usd",
    product_data: {
      name: `Allure ${product.name}`,
      description: product.description,
    },
    unit_amount: product.priceInCents,
  }

  if (stripeInterval) {
    priceData.recurring = { interval: stripeInterval }
  }

  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: [
      {
        price_data: priceData,
        quantity: 1,
      },
    ],
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
    metadata: {
      productId: product.id,
    },
  })

  return { url: session.url }
}

export async function startEmbeddedCheckout(productId: string) {
  const product = getProduct(productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const headersList = await headers()
  const origin = headersList.get("origin") || "http://localhost:3000"
  const mode = getStripeMode(product.interval)
  const stripeInterval = getStripeInterval(product.interval)

  const priceData: {
    currency: string
    product_data: { name: string; description: string }
    unit_amount: number
    recurring?: { interval: "week" | "month" }
  } = {
    currency: "usd",
    product_data: {
      name: `Allure ${product.name}`,
      description: product.description,
    },
    unit_amount: product.priceInCents,
  }

  if (stripeInterval) {
    priceData.recurring = { interval: stripeInterval }
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode,
    line_items: [
      {
        price_data: priceData,
        quantity: 1,
      },
    ],
    return_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      productId: product.id,
    },
  })

  return session.client_secret
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription", "customer"],
  })

  return {
    status: session.status,
    customerEmail: session.customer_details?.email,
    productId: session.metadata?.productId,
  }
}
