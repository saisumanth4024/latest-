import { useLocation } from '@/router/wouterCompat';
import { Link } from '@/router/wouterCompat';
import { routes } from '@/App';
import { cn } from '@/lib/utils';

export default function Breadcrumb() {
  const [location] = useLocation();
  
  // Create breadcrumb items based on route paths
  const getBreadcrumbItems = () => {
    const parts = location.split('/').filter(Boolean);
    if (parts.length === 0) {
      // Root path
      return [{ label: 'Dashboard', path: '/' }];
    }

    // Build breadcrumb array
    const breadcrumbs = [{ label: 'Dashboard', path: '/' }];
    let currentPath = '';

    parts.forEach((part) => {
      currentPath += `/${part}`;
      
      // Find the route component to get its name
      const route = routes.find(r => r.path === currentPath);
      const label = route ? part.charAt(0).toUpperCase() + part.slice(1) : part;
      
      breadcrumbs.push({
        label,
        path: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className="flex mb-4 px-4 py-2 bg-white dark:bg-slate-800 rounded-md shadow-sm" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 flex-wrap">
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-3 h-3 mx-1 text-slate-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            )}
            
            {index < breadcrumbItems.length - 1 ? (
              <Link href={item.path}>
                <div className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 cursor-pointer">
                  {index === 0 && (
                    <svg 
                      className="w-3 h-3 mr-2" 
                      aria-hidden="true" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                  )}
                  {item.label}
                </div>
              </Link>
            ) : (
              <span className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}