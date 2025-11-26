import DashboardCard from "@/components/DashboardCard";
import AITrainer from "@/components/AITrainer";
import BodyweightExercises from "@/components/BodyweightExercises";
import ProgressCharts from "@/components/ProgressCharts";
import ReadinessGauge from "@/components/ReadinessGauge";

export default function Dashboard({ userId }: { userId: string }) {
  return (
    <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
      {/* AI Trainer Advice */}
      <DashboardCard title="AI Trainer">
        <AITrainer userId={userId} />
      </DashboardCard>

      {/* Bodyweight Exercises */}
      <DashboardCard title="Bodyweight Exercises">
        <BodyweightExercises />
      </DashboardCard>

      {/* Progress Charts */}
      <DashboardCard title="Progress Charts">
        <ProgressCharts />
      </DashboardCard>

      {/* Readiness Gauge */}
      <DashboardCard title="Readiness">
        <div className="flex justify-center">
          <ReadinessGauge score={7} />
        </div>
      </DashboardCard>

      {/* Recent Workouts */}
      <DashboardCard title="Recent Workouts">
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>🏃 Jogging - 30 min</li>
          <li>💪 Push-ups - 3 sets of 15</li>
          <li>🧘 Plank - 2 min</li>
        </ul>
      </DashboardCard>

      {/* Weight Tracking */}
      <DashboardCard title="Weight Tracking">
        <p className="text-gray-700 dark:text-gray-300">
          Last recorded: <strong>72 kg</strong> on Nov 25, 2025
        </p>
      </DashboardCard>
    </main>
  );
}