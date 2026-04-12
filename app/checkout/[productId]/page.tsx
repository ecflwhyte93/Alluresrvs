import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getProduct, formatPrice } from "@/lib/products"
import Checkout from "@/components/checkout"

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const product = getProduct(productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to pricing
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Subscribe to {product.name}
              </h1>
              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>
              <div className="bg-muted rounded-lg p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-lg font-medium">Allure {product.name}</span>
                  <span className="text-2xl font-bold">
                    {formatPrice(product.priceInCents)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{product.interval}
                    </span>
                  </span>
                </div>
                <ul className="space-y-2 text-sm">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <Checkout productId={productId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
