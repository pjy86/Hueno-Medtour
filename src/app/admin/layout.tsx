export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="pt-24 lg:pt-28">
      {children}
    </div>
  )
}
