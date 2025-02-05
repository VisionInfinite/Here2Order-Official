import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Users } from "lucide-react"
import Loading from "@/components/loading"
import { Suspense } from "react"

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-8 pt-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border/40 bg-background-50/80 backdrop-blur-sm dark:bg-background-950/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-text-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-900 dark:text-text-50">$45,231.89</div>
              <p className="text-xs text-text-500">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-background-50/80 backdrop-blur-sm dark:bg-background-950/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-text-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-900 dark:text-text-50">+2350</div>
              <p className="text-xs text-text-500">+180.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-background-50/80 backdrop-blur-sm dark:bg-background-950/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-text-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-900 dark:text-text-50">+12,234</div>
              <p className="text-xs text-text-500">+19% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-border/40 bg-background-50/80 backdrop-blur-sm dark:bg-background-950/80">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add your orders table or list here */}
            </CardContent>
          </Card>
          <Card className="col-span-3 border-border/40 bg-background-50/80 backdrop-blur-sm dark:bg-background-950/80">
            <CardHeader>
              <CardTitle>Popular Items</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add your popular items list here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  )
} 