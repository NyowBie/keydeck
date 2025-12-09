import React from 'react';
import { layoutOptions } from '../layouts';
import { Monitor, RefreshCcw, Moon, Sun, Volume2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const ControlBar = ({
    currentLayout,
    onLayoutChange,
    onReset,
    theme,
    onToggleTheme,
    soundProfile,
    onSoundProfileChange,
    rgbMode,
    onToggleRgb
}) => {
    return (
        <div className={cn(
            "flex flex-col md:flex-row items-center justify-between gap-4 w-full max-w-4xl mx-auto p-4 border rounded-lg shadow-sm transition-all duration-300",
            rgbMode ? "bg-black/40 border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]" : "bg-card"
        )}>

            {/* Left Group: Layout & Sound */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                {/* Layout Selector */}
                <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-muted-foreground" />
                    <select
                        className="bg-background border border-input rounded-md px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-primary"
                        value={currentLayout}
                        onChange={(e) => onLayoutChange(e.target.value)}
                    >
                        {layoutOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                    </select>
                </div>

                <div className="h-4 w-px bg-border hidden md:block" />

                {/* Sound Selector */}
                <div className="flex items-center gap-2">
                    <Volume2 className={cn("w-4 h-4 text-muted-foreground", soundProfile === 'mute' && "opacity-50")} />
                    <select
                        className="bg-background border border-input rounded-md px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-primary w-32 md:w-auto"
                        value={soundProfile}
                        onChange={(e) => onSoundProfileChange(e.target.value)}
                    >
                        <option value="mute">Mute</option>
                        <option value="clicky">Clicky (Blue)</option>
                        <option value="thocky">Thocky (Red)</option>
                        <option value="linear">Linear (Brown)</option>
                    </select>
                </div>
            </div>

            {/* Right Group: Actions */}
            <div className="flex items-center gap-2 ml-auto">
                <button
                    onClick={onToggleRgb}
                    className={cn(
                        "p-2 rounded-md transition-all duration-300 relative",
                        rgbMode ? "bg-primary/10 text-primary ring-1 ring-primary/50 shadow-[0_0_10px_rgba(var(--primary),0.3)]" : "text-muted-foreground hover:bg-accent"
                    )}
                    title="Toggle RGB Mode"
                >
                    <Sparkles className="w-5 h-5" />
                </button>

                <div className="h-6 w-px bg-border mx-2" />

                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title="Reset History"
                >
                    <RefreshCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Reset</span>
                </button>

                <button
                    onClick={onToggleTheme}
                    className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors relative text-muted-foreground"
                    title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default ControlBar;
