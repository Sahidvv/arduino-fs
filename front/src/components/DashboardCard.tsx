// src/components/DashboardCard.tsx
interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export function DashboardCard({ title, value, icon, trend, trendValue }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-start justify-between hover:shadow-xl transition-shadow duration-300">
      <div className="space-y-2">
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        {trend && trendValue && (
          <p className={`text-sm flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? '▲' : '▼'} {trendValue}
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        {icon}
      </div>
    </div>
  );
}