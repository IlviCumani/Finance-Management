import { Card, } from "@/components/ui/card"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-svh p-6">
            <Card className="w-full max-w-fit">
                {children}
            </Card>
        </div>
    )
}
