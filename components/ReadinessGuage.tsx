"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ReadinessGauge({ score }: { score: number }) {
  return (
    <div className="w-24 h-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={score} // re-animate when score changes
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgressbar
            value={score}
            maxValue={10}
            text={`${score}/10`}
            styles={buildStyles({
              textColor: "#1e293b",
              pathColor:
                score >= 7 ? "#22c55e" : score >= 4 ? "#facc15" : "#ef4444",
              trailColor: "#e5e7eb",
            })}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}