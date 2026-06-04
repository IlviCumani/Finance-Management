import { Card } from "@/components/ui/card"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <Card className="w-full max-w-fit">{children}</Card>
    </div>
  )
}
