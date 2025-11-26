import Dashboard from "@/app/dashboard/page";

export default function Page() {
  return <Dashboard />;
}import AITrainer from "@/components/AITrainer";
import TodaysPlan from "@/components/TodaysPlan";

export default function Page() {
  // Replace with your auth user id if needed
  const userId = "demo-user";

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">AI Trainer</h1>
        <AITrainer userId={userId} />
        <TodaysPlan />
      </div>
    </main>
  );
}