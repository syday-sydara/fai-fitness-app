export default function DashboardCard({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}