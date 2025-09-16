// FIX: Create the useCountdown hook.
import { useState, useEffect } from 'react';

const calculateTimeLeft = (targetTimestamp: number) => {
    const difference = targetTimestamp - Date.now();
    let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
    };

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            isExpired: false,
        };
    }

    return timeLeft;
};

export const useCountdown = (targetTimestamp: number) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetTimestamp));

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(targetTimestamp));
        }, 1000);

        return () => clearTimeout(timer);
    });

    return timeLeft;
};
