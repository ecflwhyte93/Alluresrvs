import Link from "next/link"
import { Flame, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
          <Flame className="h-10 w-10 text-muted-foreground" />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-foreground">Checkout Cancelled</h1>
          <p className="text-muted-foreground mt-2">
            No charges were made. You can try again anytime.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Button asChild className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Plans
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
