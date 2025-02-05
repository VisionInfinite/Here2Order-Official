'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CustomerDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground">
            +0% from last month
          </p>
        </CardContent>
      </Card>
      {/* Add more cards for customer dashboard */}
    </div>
  )
} 