import React, { useRef, useEffect, useState } from 'react';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { cn } from '../lib/utils';
import { RotateCcw, Trophy } from 'lucide-react';

const SpeedTest = ({ rgbMode, onPlaySound }) => {
    // Settings
    const [difficulty, setDifficulty] = useState('medium');
    const [timeLimit, setTimeLimit] = useState(30);

    const {
        words,
        status,
        currInput,
        currWordIndex,
        timeLeft,
        stats,
        typedWords,
        handleInput,
        handleKeyDown,
        reset
    } = useTypingEngine(difficulty, timeLimit);

    const inputRef = useRef(null);
    const activeWordRef = useRef(null);
    const containerRef = useRef(null);

    // Focus on click or start
    useEffect(() => {
        if (status !== 'finished') {
            inputRef.current?.focus();
        }
    }, [status, difficulty, timeLimit]);

    // Keep active word in view
    useEffect(() => {
        if (activeWordRef.current) {
            activeWordRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [currWordIndex]);

    // Sound effect on type
    const prevInputLen = useRef(0);
    useEffect(() => {
        if (currInput.length > prevInputLen.current) {
            if (onPlaySound) onPlaySound();
        }
        prevInputLen.current = currInput.length;
    }, [currInput, onPlaySound]);


    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500 font-mono">

            {/* Control Header */}
            <div className={cn(
                "flex flex-col md:flex-row justify-between items-center p-4 rounded-xl border transition-all duration-300 shadow-sm",
                rgbMode ? "bg-black/80 border-white/10 text-white" : "bg-white border-slate-200"
            )}>
                {/* Difficulty */}
                <div className="flex gap-2">
                    {['easy', 'medium', 'hard'].map(d => (
                        <button
                            key={d}
                            onClick={() => { setDifficulty(d); reset(); }}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                difficulty === d
                                    ? (rgbMode ? "bg-white text-black" : "bg-slate-900 text-white shadow-md")
                                    : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {d}
                        </button>
                    ))}
                </div>

                {/* Stats Display */}
                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold leading-none">{timeLeft}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Time</div>
                    </div>
                    <div className="w-px h-10 bg-border"></div>
                    <div className="flex flex-col items-center">
                        <div className={cn("text-3xl font-bold leading-none", rgbMode ? "text-primary" : "text-emerald-500")}>
                            {stats.wpm}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">WPM</div>
                    </div>
                </div>

                {/* Time Control */}
                <div className="flex gap-2">
                    {[15, 30, 60].map(t => (
                        <button
                            key={t}
                            onClick={() => { setTimeLimit(t); reset(); }}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all w-12 text-center",
                                timeLimit === t
                                    ? (rgbMode ? "bg-white text-black" : "bg-slate-900 text-white shadow-md")
                                    : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Typing Container */}
            <div
                className={cn(
                    "relative w-full h-[360px] rounded-2xl p-8 overflow-hidden transition-all duration-300 group cursor-text text-2xl leading-relaxed outline-none select-none",
                    rgbMode ? "bg-zinc-950 border border-white/10" : "bg-white border border-slate-200 shadow-xl",
                    status === 'finished' && "opacity-50 blur-[2px] pointer-events-none"
                )}
                onClick={() => inputRef.current?.focus()}
            >
                {/* Words Layout */}
                <div
                    ref={containerRef}
                    className="w-full h-full overflow-y-auto no-scrollbar flex flex-wrap content-start gap-x-3 gap-y-4"
                >
                    {words.map((word, wIndex) => {
                        const isCurrent = wIndex === currWordIndex;
                        const isPast = wIndex < currWordIndex;
                        const userInput = isPast ? (typedWords[wIndex] || "") : (isCurrent ? currInput : "");

                        // Active Word Styling
                        const wordClasses = cn(
                            "relative px-1.5 py-1 rounded-lg transition-all duration-200 flex items-center",
                            isCurrent && (rgbMode ? "bg-white/10 font-bold" : "bg-slate-100 font-bold shadow-sm scale-105"),
                            !isCurrent && "opacity-60 grayscale-[0.5]"
                        );

                        return (
                            <div
                                key={wIndex}
                                ref={isCurrent ? activeWordRef : null}
                                className={wordClasses}
                            >
                                {word.split('').map((char, cIndex) => {
                                    const typedChar = userInput[cIndex];

                                    // Visual Rules:
                                    // 1. Untyped: Gray-500 (#6b7280)
                                    // 2. Correct: Green (#4ade80 / emerald-400/500)
                                    // 3. Incorrect: Red (#ef4444 / red-500)

                                    let textColor;
                                    let decoration = "";

                                    if (typedChar === undefined) {
                                        // Untyped
                                        textColor = rgbMode ? "text-gray-500" : "text-gray-500";
                                    } else if (typedChar === char) {
                                        // Correct
                                        textColor = rgbMode ? "text-green-400" : "text-emerald-500";
                                    } else {
                                        // Incorrect
                                        textColor = rgbMode ? "text-red-400" : "text-red-500";
                                    }

                                    return (
                                        <span key={cIndex} className={cn(textColor, decoration, "transition-colors duration-75")}>
                                            {char}
                                        </span>
                                    );
                                })}

                                {/* Extra Incorrect Characters */}
                                {userInput.length > word.length && (
                                    userInput.slice(word.length).split('').map((char, eIndex) => (
                                        <span key={`extra-${eIndex}`} className="text-red-500 opacity-80">
                                            {char}
                                        </span>
                                    ))
                                )}

                                {/* Caret: 2px wide, flashing */}
                                {isCurrent && (
                                    <div
                                        className={cn(
                                            "absolute top-1.5 bottom-1.5 w-[2px] animate-pulse rounded-full transition-transform duration-75",
                                            rgbMode ? "bg-primary shadow-glow" : "bg-slate-900"
                                        )}
                                        style={{
                                            // Calculate generic offset + char width
                                            // 8px is approx left padding
                                            left: `calc(6px + ${currInput.length} * 1ch)`
                                        }}
                                    ></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Hidden Input for Logic */}
                <input
                    ref={inputRef}
                    type="text"
                    className="absolute inset-0 opacity-0 cursor-default"
                    value={currInput}
                    onChange={(e) => handleInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />

                {/* Start Overlay */}
                {status === 'idle' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px] rounded-2xl pointer-events-none">
                        <div className={cn("px-6 py-3 rounded-full font-mono text-sm font-bold uppercase tracking-widest animate-pulse shadow-lg", rgbMode ? "bg-white text-black" : "bg-slate-900 text-white")}>
                            Start Typing
                        </div>
                    </div>
                )}
            </div>

            {/* Results Modal */}
            {status === 'finished' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className={cn(
                        "w-full max-w-lg p-8 rounded-3xl shadow-2xl transform animate-in zoom-in-95 duration-300 relative overflow-hidden border",
                        rgbMode ? "bg-zinc-900 text-white border-white/10" : "bg-white text-slate-900 border-white/50"
                    )}>
                        <div className="text-center mb-8">
                            <Trophy className={cn("w-20 h-20 mx-auto mb-4 drop-shadow-lg", rgbMode ? "text-yellow-400" : "text-emerald-500")} />
                            <h2 className="text-4xl font-black mb-2 tracking-tight">Test Complete</h2>
                            <div className="flex justify-center gap-3 text-sm font-bold uppercase tracking-widest opacity-60">
                                <span>{difficulty}</span> • <span>{timeLimit}s</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className={cn("p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden", rgbMode ? "bg-white/5" : "bg-slate-50")}>
                                <div className="text-6xl font-black z-10">{stats.wpm}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground z-10 mt-1">WPM</div>
                                {/* Subtle bg decoration */}
                                <div className={cn("absolute inset-0 opacity-5", rgbMode ? "bg-white" : "bg-emerald-500")} />
                            </div>
                            <div className={cn("p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden", rgbMode ? "bg-white/5" : "bg-slate-50")}>
                                <div className="text-6xl font-black z-10">{stats.accuracy}<span className="text-3xl align-top">%</span></div>
                                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground z-10 mt-1">Accuracy</div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8 text-sm font-medium px-4">
                            <div className="flex justify-between items-center border-b border-border/50 pb-3">
                                <span className="text-muted-foreground">Correct Characters</span>
                                <span className="text-emerald-500 font-bold text-lg">{stats.correctChars}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-border/50 pb-3">
                                <span className="text-muted-foreground">Incorrect Characters</span>
                                <span className="text-red-500 font-bold text-lg">{stats.incorrectChars}</span>
                            </div>
                        </div>

                        <button
                            onClick={reset}
                            className={cn(
                                "w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] shadow-lg hover:shadow-xl",
                                rgbMode ? "bg-white text-black hover:bg-gray-200" : "bg-slate-900 text-white hover:bg-slate-800"
                            )}
                        >
                            <RotateCcw className="w-5 h-5" />
                            Start New Test
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpeedTest;
