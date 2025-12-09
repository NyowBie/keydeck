import React from 'react';
import { cn } from '../lib/utils';

const HistoryPanel = ({ historyLog, rgbMode }) => {
    return (
        <div className={cn(
            "w-full max-w-lg border rounded-lg shadow-sm flex flex-col h-64 overflow-hidden transition-colors duration-300",
            rgbMode ? "bg-black/40 border-white/10 text-white backdrop-blur-md" : "bg-card"
        )}>
            <div className={cn(
                "p-3 border-b flex items-center justify-between",
                rgbMode ? "bg-white/5 border-white/10" : "bg-muted/30"
            )}>
                <h3 className="text-sm font-semibold">Key History</h3>
                <span className="text-xs text-muted-foreground">{historyLog.length} events</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-border">
                {historyLog.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm opacity-50">
                        No keys pressed yet
                    </div>
                ) : (
                    historyLog.map((item, index) => (
                        <div key={`${item.code}-${item.timestamp}-${index}`} className="flex items-center justify-between text-xs p-2 rounded hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "font-mono px-1.5 py-0.5 rounded border min-w-[2rem] text-center",
                                    rgbMode ? "bg-white/10 text-white border-white/20" : "bg-primary/10 text-primary border-primary/20"
                                )}>
                                    {item.key === " " ? "Space" : item.key}
                                </span>
                                <span className="text-muted-foreground">{item.code}</span>
                            </div>
                            <span className="font-mono text-muted-foreground opacity-70">
                                {new Date(item.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalthousandsDigits: 3 })}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;
