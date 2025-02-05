import { auth } from "@/app/auth"
import { prisma } from "@/lib/prisma"
import { GenerateWebsiteButton } from "./components/generate-website-button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default async function RestaurantDashboard() {
  const session = await auth()
  console.log("Session:", session)
  
  if (!session) {
    return null
  }

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        userId: session.user.id
      }
    })
    console.log("Restaurant:", restaurant)

    if (!restaurant) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">No Restaurant Found</h1>
            <p className="text-muted-foreground">
              Please create a restaurant first or contact support if you think this is an error.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
          <p className="text-muted-foreground">Manage your restaurant details and menu</p>
        </div>

        {/* Menu Management Section */}
        <div className="grid gap-6 mb-6">
          {/* Your existing menu management content */}
        </div>

        {/* Website Generation Section */}
        <Card className="mt-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Website Generation</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a public website for your restaurant
                </p>
              </div>
              <GenerateWebsiteButton 
                isGenerated={restaurant.websiteGenerated}
                slug={restaurant.slug}
              />
            </div>
            
            <Separator className="my-4" />
            
            <div className="text-sm text-muted-foreground">
              <p>Before generating your website, ensure you have:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Added your restaurant details</li>
                <li>Created menu categories</li>
                <li>Added menu items</li>
                <li>Uploaded necessary images</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground">
            An error occurred while fetching restaurant data. Please try again later.
          </p>
        </div>
      </div>
    )
  }
} 