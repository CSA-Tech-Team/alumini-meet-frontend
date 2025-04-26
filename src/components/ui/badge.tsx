import type * as React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
}

export function Badge({ children, className = "", ...props }: BadgeProps) {
    return (
        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`} {...props}>
            {children}
        </div>
    )
}
