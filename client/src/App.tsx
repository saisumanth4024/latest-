import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/layout/Layout";

// Define placeholder components for routes that don't have implementations yet
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold mb-4">{title} Page</h1>
    <p className="text-gray-600 dark:text-gray-400">This page is under construction.</p>
  </div>
);

// Create components for each route
const ProductsPage = () => <PlaceholderPage title="Products" />;
const OrdersPage = () => <PlaceholderPage title="Orders" />;
const SearchPage = () => <PlaceholderPage title="Search" />;
const AnalyticsPage = () => <PlaceholderPage title="Analytics" />;
const ProfilePage = () => <PlaceholderPage title="Profile" />;
const SettingsPage = () => <PlaceholderPage title="Settings" />;
const AdminPage = () => <PlaceholderPage title="Admin" />;

// Create a central routes configuration
export const routes = [
  {
    path: "/",
    component: Dashboard,
    exact: true
  },
  { path: "/products", component: ProductsPage },
  { path: "/orders", component: OrdersPage },
  { path: "/search", component: SearchPage },
  { path: "/analytics", component: AnalyticsPage },
  { path: "/profile", component: ProfilePage },
  { path: "/settings", component: SettingsPage },
  { path: "/admin", component: AdminPage },
  { path: "*", component: NotFound }
];

function App() {
  return (
    <Layout>
      <Switch>
        {routes.map((route, index) => (
          route.path === "*" ? (
            <Route key={index} component={route.component} />
          ) : (
            <Route key={index} path={route.path} component={route.component} />
          )
        ))}
      </Switch>
    </Layout>
  );
}

export default App;
