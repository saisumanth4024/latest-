import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            Enterprise Application
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive platform for managing products, orders, analytics, and more.
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <a 
            href="/login" 
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Log in
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Product Management</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Easily manage your product inventory, categories, and pricing with our intuitive interface.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Order Management</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track orders from placement to delivery, with full history and status updates.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Analytics & Insights</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Gain valuable insights into your business performance with detailed analytics and reporting.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Key Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4">
              <div className="font-semibold text-primary-600 dark:text-primary-400 mb-1">Global Search</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Find anything with our powerful search tools</p>
            </div>
            <div className="p-4">
              <div className="font-semibold text-primary-600 dark:text-primary-400 mb-1">Real-time Updates</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stay informed with instant notifications</p>
            </div>
            <div className="p-4">
              <div className="font-semibold text-primary-600 dark:text-primary-400 mb-1">Responsive Design</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Access from any device, anywhere</p>
            </div>
            <div className="p-4">
              <div className="font-semibold text-primary-600 dark:text-primary-400 mb-1">Dark Mode</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customize your visual experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}