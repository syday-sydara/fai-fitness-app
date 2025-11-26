"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ReadinessGauge({ score }: { score: number }) {
  const clampedScore = Math.max(0, Math.min(score, 10));

  return (
    <div className="w-24 h-24 sm:w-32 sm:h-32">
      <AnimatePresence mode="wait">
        <motion.div
          key={clampedScore}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgressbar
            value={clampedScore}
            maxValue={10}
            text={`${clampedScore}/10`}
            styles={buildStyles({
              textColor: "#1e293b",
              pathColor:
                clampedScore >= 7 ? "#22c55e" : clampedScore >= 4 ? "#facc15" : "#ef4444",
              trailColor: "#e5e7eb",
              pathTransitionDuration: 0.5,
            })}
          />
        </motion.div>
      </AnimatePresence>
      <p className="text-sm text-center mt-2 text-gray-700 dark:text-gray-300">
        Readiness
      </p>
    </div>
  );
}