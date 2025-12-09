import { useState, useEffect, useCallback, useRef } from 'react';
import { generateFluentText } from '../utils/wordLists';

export const useTypingEngine = (difficulty = 'medium', timeLimit = 30) => {
    const [status, setStatus] = useState('idle'); // idle, running, finished
    const [words, setWords] = useState([]);

    const [currInput, setCurrInput] = useState("");
    const [currWordIndex, setCurrWordIndex] = useState(0);
    const [typedWords, setTypedWords] = useState({}); // History of finalized words

    // Stats
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [stats, setStats] = useState({
        wpm: 0,
        accuracy: 100,
        correctChars: 0,
        incorrectChars: 0,
        totalChars: 0
    });

    const timerRef = useRef(null);

    // Initialize Game
    const setupGame = useCallback(() => {
        // Initial load: ~50 words to start
        const newWords = generateFluentText(difficulty, 50);
        setWords(newWords);

        setCurrInput("");
        setCurrWordIndex(0);
        setTypedWords({});
        setStatus('idle');
        setTimeLeft(timeLimit);
        setStats({ wpm: 0, accuracy: 100, correctChars: 0, incorrectChars: 0, totalChars: 0 });
        if (timerRef.current) clearInterval(timerRef.current);
    }, [difficulty, timeLimit]);

    useEffect(() => {
        setupGame();
    }, [setupGame]);

    useEffect(() => {
        if (status === 'running') {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [status]);

    const startGame = () => {
        if (status === 'idle') {
            setStatus('running');
        }
    };

    const endGame = () => {
        setStatus('finished');
        if (timerRef.current) clearInterval(timerRef.current);
    };

    // Calculate Stats
    useEffect(() => {
        if (status === 'running' || status === 'finished') {
            const timeElapsedMin = (timeLimit - timeLeft) / 60;
            const effectiveTime = timeElapsedMin > 0 ? timeElapsedMin : (timeLimit / 60);

            // WPM calculation
            const wpm = effectiveTime > 0
                ? Math.round((stats.correctChars / 5) / effectiveTime)
                : 0;

            const total = stats.correctChars + stats.incorrectChars;
            const accuracy = total > 0 ? Math.round((stats.correctChars / total) * 100) : 100;

            setStats(prev => ({ ...prev, wpm, accuracy }));
        }
    }, [timeLeft, timeLimit, status, stats.correctChars, stats.incorrectChars]);

    // INFINITE SCROLL LOGIC
    // Check if we need to append more words
    const checkAndAppendWords = useCallback((currentIndex) => {
        // If we are within 20 words of the end, append more.
        if (words.length - currentIndex < 20) {
            const nextBatch = generateFluentText(difficulty, 30);
            setWords(prev => [...prev, ...nextBatch]);
        }
    }, [words.length, difficulty]);


    const finalizeWord = () => {
        if (status === 'finished') return;
        if (status === 'idle') startGame();

        // Lock current word
        setTypedWords(prev => ({ ...prev, [currWordIndex]: currInput }));

        // Calculate stats for this word
        const targetWord = words[currWordIndex] || "";
        let correct = 0;
        let incorrect = 0;

        // We compare up to the length of what was typed vs target
        const len = Math.max(currInput.length, targetWord.length);

        for (let i = 0; i < len; i++) {
            if (currInput[i] === targetWord[i]) correct++;
            else incorrect++;
        }

        // Space counts as a correct keystroke character (standard convention)
        correct++;

        setStats(prev => ({
            ...prev,
            correctChars: prev.correctChars + correct,
            incorrectChars: prev.incorrectChars + incorrect,
            totalChars: prev.totalChars + correct + incorrect
        }));

        // Move to next
        const nextIndex = currWordIndex + 1;
        setCurrInput("");
        setCurrWordIndex(nextIndex);

        // TRIGGER INFINITE APPEND
        checkAndAppendWords(nextIndex);
    };

    const handleKeyDown = (e) => {
        if (status === 'finished') return;

        // Start on any key press
        if (status === 'idle' && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            startGame();
        }

        // Ignore Arrows
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            return;
        }

        // Handle Space -> Finalize
        if (e.key === ' ') {
            e.preventDefault();
            finalizeWord();
            return;
        }
    };

    const handleInput = (val) => {
        if (status === 'finished') return;
        setCurrInput(val);
    };

    return {
        words,
        status,
        currInput,
        currWordIndex,
        timeLeft,
        stats,
        typedWords,
        handleInput,
        handleKeyDown,
        reset: setupGame
    };
};
