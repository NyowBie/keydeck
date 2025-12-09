import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../lib/utils';
import { RefreshCcw, Trophy, Target, Zap, Clock, Pause, Play, RotateCcw } from 'lucide-react';

const PARAGRAPHS = {
    easy: [
        "The quick brown fox jumps over the lazy dog. It is a classic sentence used to test keyboards.",
        "Sunlight streams through the window, warming the wooden floor. A cat sleeps soundly in the beam.",
        "Coding is fun and rewarding. You can build amazing things with just a computer and your imagination.",
        "Music brings people together. It transcends language and culture, connecting hearts everywhere.",
        "A warm cup of coffee in the morning is the best way to start the day. It gives you energy."
    ],
    medium: [
        "Technological advancement has changed the way we live and work. From smartphones to artificial intelligence, innovation is accelerating at an unprecedented pace. We must adapt to these changes to thrive in the modern world.",
        "The ocean is a vast and mysterious place, covering more than seventy percent of our planet. It is home to diverse marine life, from microscopic plankton to the massive blue whale. Exploring its depths reveals wonders beyond belief.",
        "Nature offers a sanctuary from the hustle and bustle of city life. Hiking through a forest or sitting by a calm lake can restore your inner peace. We should cherish and protect our natural environment for future generations.",
        "Creativity is the spark that drives human progress. Whether in art, science, or business, it allows us to see problems from new angles and find unique solutions. Nurturing creativity is essential for personal growth.",
        "Success is often the result of persistence and hard work. Talent alone is rarely enough; one must be willing to put in the effort and learn from failures. Every setback is an opportunity to grow stronger."
    ],
    hard: [
        "Quantum mechanics describes the behavior of matter and light on the atomic and subatomic scale. It attempts to describe and account for the properties of molecules and atoms and their constituents—electrons, protons, neutrons, and other more esoteric particles such as quarks and gluons.",
        "The intricacies of the global economy are influenced by a myriad of factors, including geopolitical events, trade policies, and technological disruptions. Understanding these complex interdependencies is crucial for policymakers and investors alike to navigate the volatile markets effectively.",
        "Neurological studies suggest that neuroplasticity, the brain's ability to reorganize itself by forming new neural connections throughout life, is a fundamental property of the nervous system. This allows the neurons in the brain to compensate for injury and disease and to adjust their activities in response to new situations.",
        "In the realm of epistemology, the distinction between justified true belief and mere opinion is a central topic of debate. Philosophers have long sought to define the necessary and sufficient conditions for knowledge, exploring concepts such as skepticism, empiricism, and rationalism.",
        "Cryptographic protocols are designed to secure communication in the presence of adversarial third parties. These protocols utilize mathematical primitives to achieve goals such as confidentiality, data integrity, authentication, and non-repudiation, forming the backbone of modern digital security."
    ]
};

const TIME_MODES = [15, 30, 60];
const CHARS_PER_LINE = 55;

const TypingTest = ({ rgbMode, onPlaySound }) => {
    // Settings
    const [difficulty, setDifficulty] = useState('medium');
    const [timeLimit, setTimeLimit] = useState(30);

    // Data State
    const [lines, setLines] = useState([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);

    // Input State
    const [userInput, setUserInput] = useState('');

    // Stats & Timer
    const [startTime, setStartTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [status, setStatus] = useState('idle'); // idle, running, finished, paused

    const [correctCharCount, setCorrectCharCount] = useState(0);
    const [totalCharCount, setTotalCharCount] = useState(0);
    const [errors, setErrors] = useState(0);

    const inputRef = useRef(null);
    const timerRef = useRef(null);

    // Prepare Text
    const prepareText = useCallback(() => {
        const bank = PARAGRAPHS[difficulty] || PARAGRAPHS.medium;
        const text = bank[Math.floor(Math.random() * bank.length)];

        const words = text.split(' ');
        const newLines = [];
        let currentLine = "";

        // Improved Chunking logic could go here, for now simple wrapping
        words.forEach(word => {
            if ((currentLine + word).length > CHARS_PER_LINE) {
                newLines.push(currentLine.trim());
                currentLine = word + " ";
            } else {
                currentLine += word + " ";
            }
        });
        if (currentLine.trim()) newLines.push(currentLine.trim());

        setLines(newLines);
    }, [difficulty]);

    // Initial setup & Reset
    const resetTest = useCallback(() => {
        prepareText();
        setUserInput('');
        setCurrentLineIndex(0);
        setStartTime(null);
        setTimeLeft(timeLimit);
        setWpm(0);
        setAccuracy(100);
        setStatus('idle');
        setCorrectCharCount(0);
        setTotalCharCount(0);
        setErrors(0);

        if (timerRef.current) clearInterval(timerRef.current);
        if (inputRef.current) inputRef.current.focus();
    }, [prepareText, timeLimit]);

    useEffect(() => {
        resetTest();
    }, [resetTest]);

    // Pause functionality
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && status === 'running') {
                setStatus('paused');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [status]);

    const resumeTest = () => {
        if (status === 'paused') {
            setStatus('running');
            if (inputRef.current) inputRef.current.focus();
        }
    };

    // Timer Logic
    useEffect(() => {
        if (status === 'running' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        finishTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [status, timeLeft]);

    const finishTest = useCallback(() => {
        setStatus('finished');
        if (timerRef.current) clearInterval(timerRef.current);

        const durationMin = (timeLimit - timeLeft) / 60000;
        const effectiveDuration = durationMin > 0 ? durationMin : (timeLimit / 60000);
        const calculatedWpm = Math.round((correctCharCount / 5) / effectiveDuration);
        setWpm(Math.max(0, calculatedWpm));

    }, [timeLimit, timeLeft, correctCharCount]);

    const handleInput = (e) => {
        if (status === 'finished' || status === 'paused') return;

        const value = e.target.value;
        const currentTargetLine = lines[currentLineIndex];

        if (onPlaySound && value.length > userInput.length) {
            if (value.trim().length > 0 || value === ' ') {
                onPlaySound();
            }
        }

        if (status === 'idle') {
            setStatus('running');
            setStartTime(Date.now());
        }

        // Stats
        if (value.length > userInput.length) {
            const charIndex = value.length - 1;
            if (charIndex < currentTargetLine.length) {
                if (value[charIndex] === currentTargetLine[charIndex]) {
                    setCorrectCharCount(prev => prev + 1);
                } else {
                    setErrors(prev => prev + 1);
                }
                setTotalCharCount(prev => prev + 1);
            }
        }

        if (value.length >= currentTargetLine.length) {
            setUserInput('');
            setCurrentLineIndex(prev => {
                const next = prev + 1;
                if (next >= lines.length) {
                    finishTest();
                    return prev;
                }
                return next;
            });
        } else {
            setUserInput(value);
        }
    };

    // Live Stats
    useEffect(() => {
        if (status === 'running' && startTime) {
            const elapsedSec = (Date.now() - startTime) / 1000;
            if (elapsedSec > 1) {
                const currentWpm = Math.round((correctCharCount / 5) / (elapsedSec / 60));
                setWpm(currentWpm);
            }
        }
    }, [correctCharCount, status, startTime, timeLeft]);

    useEffect(() => {
        const total = correctCharCount + errors;
        if (total > 0) {
            setAccuracy(Math.round((correctCharCount / total) * 100));
        }
    }, [correctCharCount, errors]);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            {/* Control Bar */}
            <div className={cn(
                "flex flex-col md:flex-row justify-between items-center p-3 rounded-lg border transition-all duration-300 gap-4",
                rgbMode ? "bg-black/40 border-white/10 backdrop-blur-md" : "bg-card border-border shadow-sm"
            )}>
                <div className="flex bg-muted/20 p-1 rounded-md">
                    {['easy', 'medium', 'hard'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setDifficulty(level)}
                            disabled={status === 'running' || status === 'paused'}
                            className={cn(
                                "px-4 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-all",
                                difficulty === level
                                    ? (rgbMode ? "bg-white/20 text-white shadow-sm" : "bg-primary text-primary-foreground shadow-sm")
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div className="flex bg-muted/20 p-1 rounded-md">
                        {TIME_MODES.map((time) => (
                            <button
                                key={time}
                                onClick={() => setTimeLimit(time)}
                                disabled={status === 'running' || status === 'paused'}
                                className={cn(
                                    "px-3 py-1 rounded text-xs font-bold transition-all w-10 text-center",
                                    timeLimit === time
                                        ? (rgbMode ? "bg-white/20 text-white" : "bg-primary text-primary-foreground")
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {time}s
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard
                    label="Time Left"
                    value={`${timeLeft}s`}
                    icon={<Clock className="w-4 h-4" />}
                    rgbMode={rgbMode}
                    className={timeLeft <= 5 ? "text-red-500 animate-pulse" : ""}
                />
                <StatCard
                    label="WPM"
                    value={wpm}
                    icon={<Trophy className="w-4 h-4" />}
                    rgbMode={rgbMode}
                />
                <StatCard
                    label="Accuracy"
                    value={`${accuracy}%`}
                    icon={<Target className="w-4 h-4" />}
                    rgbMode={rgbMode}
                />
                <StatCard
                    label="Status"
                    value={status === 'idle' ? 'Ready' : status === 'running' ? 'Typing...' : status === 'paused' ? 'Paused' : 'Complete'}
                    icon={<Zap className="w-4 h-4" />}
                    rgbMode={rgbMode}
                />
            </div>

            {/* Typing Area */}
            <div
                className={cn(
                    "relative p-8 rounded-xl border min-h-[350px] font-mono leading-loose transition-all duration-300 cursor-text overflow-hidden flex flex-col items-center justify-center gap-4",
                    rgbMode ? "bg-black/60 border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]" : "bg-card shadow-lg",
                )}
                onClick={() => status !== 'paused' && inputRef.current?.focus()}
            >
                {/* Previous Line */}
                {currentLineIndex > 0 && (
                    <div className={cn(
                        "text-xl transition-all duration-500 select-none blur-[1px]",
                        rgbMode ? "text-white/20" : "text-muted-foreground/30"
                    )}>
                        {lines[currentLineIndex - 1]}
                    </div>
                )}

                {/* Target & Input Group */}
                <div className="flex flex-col items-center gap-1 w-full max-w-2xl">
                    {/* Target Line */}
                    <div className={cn(
                        "text-2xl font-medium tracking-wide text-center select-none w-full break-normal",
                        rgbMode ? "text-white/80" : "text-foreground/80" // Darker text for visibility in Light Mode
                    )}>
                        {lines[currentLineIndex] || "loading..."}
                    </div>

                    {/* Input Line (User Typing) */}
                    <div className="relative w-full text-center h-12 flex items-center justify-center">
                        <span className={cn(
                            "text-2xl font-medium tracking-wide border-b-2 transition-all pb-1 inline-block min-w-[20px] whitespace-pre",
                            rgbMode ? "text-white border-white/50" : "text-green-600 border-green-600/50", // Green text in light mode
                        )}>
                            {userInput.split('').map((char, index) => {
                                const targetChar = lines[currentLineIndex]?.[index];
                                let colorClass = "";
                                if (targetChar === char) {
                                    colorClass = rgbMode ? "text-green-400" : "text-green-600";
                                } else {
                                    colorClass = "text-red-500 bg-red-500/10";
                                }
                                return <span key={index} className={colorClass}>{char}</span>
                            })}
                            {/* Cursor */}
                            <span className={cn(
                                "animate-pulse border-r-2 ml-0.5 h-6 align-middle inline-block",
                                rgbMode ? "border-white" : "border-green-600"
                            )}>&nbsp;</span>
                        </span>
                    </div>
                </div>

                {/* Next Line Preview */}
                {currentLineIndex < lines.length - 1 && (
                    <div className={cn(
                        "text-xl transition-all duration-500 select-none w-full text-center truncate px-12",
                        rgbMode ? "text-white/30" : "text-muted-foreground/40"
                    )}>
                        {lines[currentLineIndex + 1]}
                    </div>
                )}


                {/* Hidden Input */}
                <input
                    ref={inputRef}
                    type="text"
                    className="absolute opacity-0 top-0 left-0 h-full w-full cursor-default"
                    value={userInput}
                    onChange={handleInput}
                    disabled={status === 'paused' || status === 'finished'}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    autoFocus
                />

                {/* Result Overlay */}
                {status === 'finished' && (
                    <Overlay>
                        <Trophy className={cn("w-16 h-16 mx-auto mb-4", rgbMode ? "text-yellow-400" : "text-primary")} />
                        <h2 className="text-3xl font-bold mb-2">Test Complete!</h2>
                        <div className="grid grid-cols-2 gap-8 mb-8 mt-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold">{wpm}</div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground">WPM</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold">{accuracy}%</div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground">Accuracy</div>
                            </div>
                        </div>
                        <button
                            onClick={resetTest}
                            className={cn(
                                "flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg",
                                rgbMode ? "bg-white text-black hover:bg-gray-200" : "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Play Again
                        </button>
                    </Overlay>
                )}

                {/* Pause Overlay */}
                {status === 'paused' && (
                    <Overlay>
                        <Pause className={cn("w-16 h-16 mx-auto mb-4", rgbMode ? "text-white" : "text-primary")} />
                        <h2 className="text-3xl font-bold mb-6">Paused</h2>
                        <div className="flex flex-col gap-3 w-full max-w-xs">
                            <button
                                onClick={resumeTest}
                                className={cn(
                                    "flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-md",
                                    rgbMode ? "bg-white text-black hover:bg-gray-200" : "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                            >
                                <Play className="w-4 h-4" />
                                Resume
                            </button>
                            <button
                                onClick={resetTest}
                                className={cn(
                                    "flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-sm border",
                                    rgbMode ? "border-white/20 text-white hover:bg-white/10" : "border-border bg-background hover:bg-accent"
                                )}
                            >
                                <RotateCcw className="w-4 h-4" />
                                Restart
                            </button>
                        </div>
                    </Overlay>
                )}

            </div>

            <div className="text-center text-xs text-muted-foreground opacity-50">
                Press <span className="font-bold border px-1 rounded mx-1">ESC</span> to pause
            </div>
        </div>
    );
};

// Helper for Overlays
const Overlay = ({ children, rgbMode }) => (
    <div className={cn(
        "absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md animate-in fade-in duration-300 rounded-xl",
        "bg-background/80" // Adapts to theme automatically essentially
    )}>
        <div className="bg-card p-10 rounded-2xl shadow-2xl border border-border text-center transform scale-100 animate-in zoom-in-95 duration-200 min-w-[320px]">
            {children}
        </div>
    </div>
);

const StatCard = ({ label, value, icon, rgbMode, className }) => (
    <div className={cn(
        "flex flex-col items-center justify-center p-4 rounded-lg border shadow-sm transition-all duration-200",
        rgbMode ? "bg-black/40 border-white/10 text-white backdrop-blur-md" : "bg-card text-card-foreground",
        className
    )}>
        <div className={cn("mb-2 p-2 rounded-full", rgbMode ? "bg-white/10" : "bg-primary/5")}>
            {icon}
        </div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</span>
        <span className={cn(
            "text-2xl font-mono font-bold truncate max-w-full px-2",
            rgbMode ? "text-white" : "text-primary",
            className
        )}>{value}</span>
    </div>
);

export default TypingTest;
