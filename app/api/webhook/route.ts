import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    console.error(`Webhook signature verification failed: ${errorMessage}`)
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      console.log("Checkout completed:", {
        sessionId: session.id,
        customerId: session.customer,
        customerEmail: session.customer_details?.email,
        subscriptionId: session.subscription,
        productId: session.metadata?.productId,
      })
      // TODO: Provision access for the customer
      // - Create user record in database
      // - Send welcome email
      // - Grant VIP access
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription
      console.log("Subscription updated:", {
        subscriptionId: subscription.id,
        status: subscription.status,
        customerId: subscription.customer,
      })
      // TODO: Update user subscription status in database
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      console.log("Subscription cancelled:", {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
      })
      // TODO: Revoke user access in database
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      console.log("Payment failed:", {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        amountDue: invoice.amount_due,
      })
      // TODO: Notify user of failed payment
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
