"use client"

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = React.ComponentProps<"div"> & {
    minWidth?: string;
    mobileBreakpoint?: number;
};

export function GridRepeat({
    children,
    minWidth = "20rem",
    className,
    style,
    mobileBreakpoint = 450,
    ...props
}: Props) {
    const isMobile = useIsMobile(mobileBreakpoint);
    return (
        <div
            className={cn("grid gap-4 max-sm:grid-cols-1", className)}
            style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? "100%" : minWidth
                    }, 1fr))`,
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    );
}
GridRepeat.displayName = "GridRepeat";