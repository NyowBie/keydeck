import { useState, useEffect, useCallback, useRef } from 'react';

export function useKeyboardTester(enabled = true) {
    const [activeKeys, setActiveKeys] = useState(new Set());
    const [historyKeys, setHistoryKeys] = useState(new Set());
    const [historyLog, setHistoryLog] = useState([]);
    const [lastKey, setLastKey] = useState(null);

    // Stats
    const startTimeRef = useRef(null);
    const [startTime, setStartTime] = useState(null);
    const keyPressCountRef = useRef(0);
    const [keyPressCount, setKeyPressCount] = useState(0);

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e) => {
            e.preventDefault();

            if (!startTimeRef.current) {
                startTimeRef.current = Date.now();
                setStartTime(Date.now());
            }

            keyPressCountRef.current += 1;
            setKeyPressCount(keyPressCountRef.current);

            const code = e.code;
            setActiveKeys((prev) => {
                const newSet = new Set(prev);
                newSet.add(code);
                return newSet;
            });

            setHistoryKeys((prev) => {
                const newSet = new Set(prev);
                newSet.add(code);
                return newSet;
            });

            const eventData = {
                key: e.key,
                code: e.code,
                keyCode: e.keyCode,
                location: e.location,
                timestamp: Date.now(),
                type: 'keydown'
            };

            setLastKey(eventData);

            setHistoryLog((prev) => {
                const newLog = [eventData, ...prev];
                return newLog.slice(0, 50); // Keep last 50
            });
        };

        const handleKeyUp = (e) => {
            e.preventDefault();
            const code = e.code;
            setActiveKeys((prev) => {
                const newSet = new Set(prev);
                newSet.delete(code);
                return newSet;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [enabled]);

    const resetHistory = useCallback(() => {
        setHistoryKeys(new Set());
        setHistoryLog([]);
        setLastKey(null);
        keyPressCountRef.current = 0;
        setKeyPressCount(0);
        startTimeRef.current = null;
        setStartTime(null);
        // We intentionally don't clear activeKeys
    }, []);

    return {
        activeKeys,
        historyKeys,
        historyLog,
        lastKey,
        resetHistory,
        keyPressCount,
        startTime
    };
}
