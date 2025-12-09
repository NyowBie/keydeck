import React from 'react';
import { cn } from '../lib/utils';

const InfoPanel = ({ lastKey, historyCount, activeKeyCount, startTime, totalKeys, rgbMode }) => {
    // Calculate CPS (Keys Per Second)
    const durationSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
    const cps = durationSeconds > 0 ? (totalKeys / durationSeconds).toFixed(1) : "0.0";

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto mb-8">
            <InfoCard
                label="Last Key"
                value={lastKey ? lastKey.code : "-"}
                highlight
                subValue={lastKey ? `Code: ${lastKey.keyCode}` : ""}
                rgbMode={rgbMode}
            />
            <InfoCard
                label="Active Keys"
                value={activeKeyCount}
                highlight={activeKeyCount > 0}
                subValue="NKRO Count"
                rgbMode={rgbMode}
            />
            <InfoCard
                label="Speed"
                value={cps}
                subValue="Keys / Sec"
                rgbMode={rgbMode}
            />
            <InfoCard
                label="Total Tested"
                value={historyCount}
                subValue="Unique Keys"
                rgbMode={rgbMode}
            />
        </div>
    );
};

const InfoCard = ({ label, value, highlight, subValue, rgbMode }) => (
    <div className={cn(
        "flex flex-col items-center justify-center p-4 rounded-lg border shadow-sm transition-all duration-200",
        rgbMode ? "bg-black/40 border-white/10 text-white backdrop-blur-md" : "bg-card text-card-foreground",
        highlight && !rgbMode && "border-primary/50 bg-primary/5 ring-1 ring-primary/20 scale-105",
        highlight && rgbMode && "border-white/30 bg-white/5 ring-1 ring-white/20 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
    )}>
        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</span>
        <span className={cn(
            "text-2xl font-mono font-bold truncate max-w-full px-2",
            rgbMode ? "text-white" : "text-primary"
        )}>{value}</span>
        {subValue && <span className="text-[10px] text-muted-foreground mt-1 opacity-70">{subValue}</span>}
    </div>
);

export default InfoPanel;
