import UnderDevelopment from "@/assets/storytell/under-development.svg"
import Image from "next/image"

export default function UnderConstruction() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 h-full">
            <Image
                src={UnderDevelopment}
                alt="Under Construction"
                className="aspect-square w-full max-w-72"
            />
            <h1 className="text-2xl font-bold">Under Development</h1>
            <p className="text-sm text-muted-foreground">
                This is currently under development. Please check back later.
            </p>
        </div>
    );
}