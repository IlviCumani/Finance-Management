export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <h1>App</h1>
            {children}
        </div>
    )
}