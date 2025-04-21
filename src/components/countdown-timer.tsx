import  { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// A client component with a light brown background theme
export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [prevTimeLeft, setPrevTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setIsComplete(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    // initialize
    setTimeLeft(calculateTimeLeft());
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        setPrevTimeLeft(prev);
        return calculateTimeLeft();
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [targetDate]);

  // Container uses a soft light-brown background and padding
  return (
    <div className="  flex flex-col items-center justify-center p-6">
      {isComplete ? (
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold "
        >
          The Event Has Started!
        </motion.h2>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <FlipCard value={timeLeft.days} prevValue={prevTimeLeft.days} label="Days" />
            <FlipCard value={timeLeft.hours} prevValue={prevTimeLeft.hours} label="Hours" />
            <FlipCard value={timeLeft.minutes} prevValue={prevTimeLeft.minutes} label="Minutes" />
            <FlipCard value={timeLeft.seconds} prevValue={prevTimeLeft.seconds} label="Seconds" />
          </div>
        </div>
      )}
    </div>
  );
}

function FlipCard({ value, prevValue, label }: { value: number; prevValue?: number; label: string }) {
  const formatted = String(value).padStart(2, "0");
  const changed = prevValue !== undefined && prevValue !== value;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-28 md:h-36">
        <div className="absolute inset-0  rounded-xl shadow-inner"></div>
        <div className="absolute inset-1 flex items-center justify-center overflow-hidden rounded-lg bg-white">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={formatted}
              initial={changed ? { y: -60, opacity: 0 } : { y: 0, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="text-4xl md:text-6xl font-semibold text-amber-800"
            >
              {formatted}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-2 text-sm md:text-base font-medium text-amber-700"
      >
        {label}
      </motion.span>
    </div>
  );
}
