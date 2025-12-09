import React, { memo } from 'react';
import { cn } from '../lib/utils';

const Key = memo(({ label, code, width = 1, height = 1, x, y, isActive, isHistory, rgbMode }) => {
    const style = {
        // 1 unit = 3.5rem (approx 56px) - aligned with Keyboard.jsx
        // using absolute positioning
        left: `${x * 3.5}rem`,
        top: `${y * 3.5}rem`,
        width: `${width * 3.5 - 0.25}rem`, // Subtract gap (0.25rem = 4px)
        height: `${height * 3.5 - 0.25}rem`, // Subtract gap
    };

    return (
        <div
            className={cn(
                // Base styles
                "absolute flex items-center justify-center rounded-md border text-sm font-medium transition-all duration-75 select-none shadow-sm",

                // Default State (Inactive, Untested)
                "bg-card text-card-foreground border-border",

                // Active State (Pressed)
                isActive && !rgbMode && [
                    // Light Mode: Blue-200 background, Blue-900 border/text
                    "bg-blue-200 border-blue-400 text-blue-900",
                    // Dark Mode: Blue-600 background, White text
                    "dark:bg-blue-600 dark:border-blue-500 dark:text-white",
                    // Transforms
                    "translate-y-0.5 shadow-none scale-95 ring-2 ring-blue-500/50"
                ],

                // RGB Mode (Active)
                isActive && rgbMode && [
                    "animate-rgb-glow border-transparent text-white",
                    "translate-y-0.5 scale-95 z-10"
                ],

                // History State (Tested, Not Active)
                !isActive && isHistory && [
                    // Light Mode: Gray-600 bg, Gray-700 border, White text (High Contrast Request)
                    "bg-gray-600 border-gray-700 text-white shadow-sm",
                    // Dark Mode: Keep original
                    "dark:bg-secondary dark:text-secondary-foreground dark:border-accent"
                ],

                // Hover State (Untested, Inactive)
                !isActive && !isHistory && !rgbMode && "hover:border-primary/50 hover:bg-accent/50",

                // RGB Mode (Idle/Hover) - subtle glow
                !isActive && !isHistory && rgbMode && "hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] border-white/20"
            )}
            style={style}
            data-code={code}
        >
            <span className="truncate px-1">{label}</span>
            {/* Optional: Show code in small text if needed, maybe on hover */}
        </div>
    );
});

Key.displayName = "Key";

export default Key;
