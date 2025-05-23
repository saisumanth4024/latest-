import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColorClass: string;
  iconColorClass: string;
  linkText: string;
  linkHref: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  bgColorClass,
  iconColorClass,
  linkText,
  linkHref,
}: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={cn("p-3 rounded-md", bgColorClass)}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-slate-900 dark:text-white">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-700/50 px-5 py-3">
        <div className="text-sm">
          <a href={linkHref} className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
            {linkText}
          </a>
        </div>
      </div>
    </div>
  );
}
