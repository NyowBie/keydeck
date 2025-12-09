import React from 'react';
import Key from './Key';

const Keyboard = ({ layout, activeKeys, historyKeys, rgbMode }) => {
    if (!layout) return null;

    // Calculate container size
    let maxX = 0;
    let maxY = 0;

    layout.keys.forEach(k => {
        const w = k.w || 1;
        const h = k.h || 1;
        const right = k.x + w;
        const bottom = k.y + h;
        if (right > maxX) maxX = right;
        if (bottom > maxY) maxY = bottom;
    });

    const containerStyle = {
        width: `${maxX * 3.5}rem`,
        height: `${maxY * 3.5}rem`,
    };

    return (
        <div className="relative mx-auto my-8 overflow-x-auto p-4 rounded-xl bg-muted/20 border border-border/50 shadow-inner no-scrollbar transition-colors duration-300">
            <div
                className="relative transition-all duration-300 ease-in-out origin-top-left"
                style={containerStyle}
            >
                {layout.keys.map((k) => (
                    <Key
                        key={k.code}
                        code={k.code}
                        label={k.label}
                        x={k.x}
                        y={k.y}
                        width={k.w || 1}
                        height={k.h || 1}
                        isActive={activeKeys.has(k.code)}
                        isHistory={historyKeys.has(k.code)}
                        rgbMode={rgbMode}
                    />
                ))}
            </div>
        </div>
    );
};

export default Keyboard;
