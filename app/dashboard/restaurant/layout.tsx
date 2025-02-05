export default function RestaurantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <div className="flex-1 space-y-4">
        {children}
      </div>
    </div>
  )
} 