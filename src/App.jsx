import React, { useState, useEffect } from 'react';
import { useKeyboardTester } from './hooks/useKeyboardTester';
import { useAudioFeedback } from './hooks/useAudioFeedback';
import { layouts } from './layouts';
import Keyboard from './components/Keyboard';
import InfoPanel from './components/InfoPanel';
import HistoryPanel from './components/HistoryPanel';
import ControlBar from './components/ControlBar';
import SpeedTest from './components/SpeedTest';
import { Keyboard as KeyboardIcon, AlertTriangle, Moon, Sun } from 'lucide-react';
import { cn } from './lib/utils';

function App() {
    const [mode, setMode] = useState('tester'); // 'tester' | 'typing'
    const [layoutId, setLayoutId] = useState("68"); // Default to 68 (PH standard)

    // Theme State Initializer
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark'; // Fallback
    });

    const [soundProfile, setSoundProfile] = useState('clicky');
    const [rgbMode, setRgbMode] = useState(false);

    // Hooks
    const {
        activeKeys,
        historyKeys,
        historyLog,
        lastKey,
        resetHistory,
        keyPressCount,
        startTime
    } = useKeyboardTester(mode === 'tester'); // Disable in typing mode

    const { playKeySound } = useAudioFeedback(true, soundProfile);

    const [isMobile, setIsMobile] = useState(false);

    // Play sound effect when active keys change (specifically when a key is added)
    useEffect(() => {
        if (lastKey && lastKey.type === 'keydown' && soundProfile !== 'mute') {
            playKeySound(lastKey.code);
        }
    }, [lastKey, soundProfile, playKeySound]);

    // Theme Sync Effect
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const currentLayout = layouts[layoutId];

    return (
        <div className={cn(
            "min-h-screen flex flex-col font-sans selection:bg-primary/20 transition-colors duration-500",
            rgbMode ? "bg-black text-white" : "bg-background"
        )}>
            {/* Mobile Warning */}
            {isMobile && (
                <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 animate-accordion-down">
                    <AlertTriangle className="w-4 h-4" />
                    <span>For the best experience, please use a desktop device with a physical keyboard.</span>
                </div>
            )}

            {/* Header */}
            <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 transition-colors duration-300">
                <div className="container mx-auto px-4 py-4 flex items-center gap-2">
                    <div className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        rgbMode ? "bg-transparent ring-1 ring-white/20 animate-pulse" : "bg-primary/10 text-primary ring-1 ring-primary/20"
                    )}>
                        <KeyboardIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className={cn("text-xl font-bold tracking-tight", rgbMode && "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-gradient-x")}>
                            KeyDeck
                        </h1>
                        <p className={cn("text-xs", rgbMode ? "text-white/60" : "text-muted-foreground")}>Premium Keyboard Tester</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center w-full">

                {/* Tab Navigation */}
                <div className={cn(
                    "flex items-center justify-center mb-8 p-1 rounded-full border transition-all duration-300",
                    rgbMode ? "bg-white/5 border-white/10" : "bg-muted/20 border-border/50"
                )}>
                    <button
                        onClick={() => setMode('tester')}
                        className={cn(
                            "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                            mode === 'tester'
                                ? (rgbMode ? "bg-white/20 text-white shadow-sm" : "bg-background text-foreground shadow-sm")
                                : (rgbMode ? "text-white/50 hover:text-white" : "text-muted-foreground hover:text-foreground")
                        )}
                    >
                        Keyboard Tester
                    </button>
                    <button
                        onClick={() => setMode('typing')}
                        className={cn(
                            "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                            mode === 'typing'
                                ? (rgbMode ? "bg-white/20 text-white shadow-sm" : "bg-background text-foreground shadow-sm")
                                : (rgbMode ? "text-white/50 hover:text-white" : "text-muted-foreground hover:text-foreground")
                        )}
                    >
                        Speed Test
                    </button>
                </div>

                {/* Mode Content */}
                {mode === 'tester' ? (
                    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ControlBar
                            currentLayout={layoutId}
                            onLayoutChange={setLayoutId}
                            onReset={resetHistory}
                            theme={theme}
                            onToggleTheme={toggleTheme}
                            soundProfile={soundProfile}
                            onSoundProfileChange={setSoundProfile}
                            rgbMode={rgbMode}
                            onToggleRgb={() => setRgbMode(!rgbMode)}
                        />

                        <div className={cn("transition-all duration-500 mt-4", rgbMode && "drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]")}>
                            <Keyboard
                                layout={currentLayout}
                                activeKeys={activeKeys}
                                historyKeys={historyKeys}
                                rgbMode={rgbMode}
                            />
                        </div>

                        <InfoPanel
                            lastKey={lastKey}
                            historyCount={historyKeys.size}
                            activeKeyCount={activeKeys.size}
                            startTime={startTime}
                            totalKeys={keyPressCount}
                            rgbMode={rgbMode}
                        />

                        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                            <HistoryPanel historyLog={historyLog} rgbMode={rgbMode} />

                            <div className={cn(
                                "flex flex-col justify-center items-center text-center text-sm text-muted-foreground p-8 border rounded-lg transition-colors duration-300",
                                rgbMode ? "bg-black/40 border-white/10 backdrop-blur-md text-white/70" : "bg-card/50"
                            )}>
                                <p className="mb-2">Pro Tip: Enable <strong className={cn("text-foreground", rgbMode && "text-white")}>RGB Mode</strong> for a gamer aesthetic.</p>
                                <p>Try typing fast to see your keys light up!</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Control Bar (Simplified for Typing Mode - mainly for Theme/RGB/Sound) */}
                        <div className={cn(
                            "flex items-center justify-end gap-2 w-full max-w-4xl mb-4 p-2 rounded-lg transition-all duration-300",
                        )}>
                            <button
                                onClick={() => setRgbMode(!rgbMode)}
                                className={cn(
                                    "p-2 rounded-md transition-all duration-300",
                                    rgbMode ? "text-white hover:bg-white/10" : "text-muted-foreground hover:bg-accent"
                                )}
                                title="Toggle RGB"
                            >
                                <KeyboardIcon className={cn("w-5 h-5", rgbMode && "text-purple-400")} />
                            </button>
                            <button
                                onClick={toggleTheme}
                                className={cn(
                                    "p-2 rounded-md transition-all duration-300",
                                    rgbMode ? "text-white hover:bg-white/10" : "text-muted-foreground hover:bg-accent"
                                )}
                                title="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>

                        <SpeedTest
                            rgbMode={rgbMode}
                            onPlaySound={() => playKeySound(null)}
                        />
                    </div>
                )}

                <div className="text-center text-sm text-muted-foreground mt-12 mb-8">
                    <p className="opacity-50">KeyDeck Pro • Developed by Cedric Moaje</p>
                </div>
            </main>
        </div>
    );
}

export default App;
