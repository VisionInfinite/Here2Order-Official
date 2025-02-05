'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SuperAdminDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Restaurants</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground">
            +0% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground">
            +0% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground">
            +0% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$0</p>
          <p className="text-xs text-muted-foreground">
            +0% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 