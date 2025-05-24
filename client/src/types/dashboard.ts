// Dashboard Types
export interface DashboardStats {
  totalRevenue: number;
  ordersCount: number;
  averageOrderValue: number;
  conversionRate: number;
  userCount: number;
  newUsers: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface OrdersData {
  date: string;
  count: number;
  value: number;
}

export interface UserGrowthData {
  date: string;
  newUsers: number;
  activeUsers: number;
  totalUsers: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
  conversionRate: number;
}

export interface DeviceData {
  device: string;
  sessions: number;
  percentage: number;
}

export interface TopProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  revenue: number;
  image?: string;
}

export interface SearchTerm {
  term: string;
  count: number;
  conversionRate: number;
  results: number;
}

export interface GeographicData {
  country: string;
  orders: number;
  revenue: number;
  percentage: number;
}

export enum TimeRange {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  CUSTOM = 'custom'
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardFilters {
  timeRange: TimeRange;
  dateRange?: DateRange;
  compareWith?: TimeRange;
  compareDateRange?: DateRange;
}

// Dashboard widgets for different roles
export enum WidgetType {
  REVENUE_CHART = 'revenue_chart',
  ORDERS_CHART = 'orders_chart',
  USER_GROWTH = 'user_growth',
  TRAFFIC_SOURCES = 'traffic_sources',
  TOP_PRODUCTS = 'top_products',
  DEVICE_BREAKDOWN = 'device_breakdown',
  TOP_SEARCH_TERMS = 'top_search_terms',
  GEOGRAPHIC_DISTRIBUTION = 'geographic_distribution',
  QUICK_STATS = 'quick_stats',
  RECENT_ORDERS = 'recent_orders',
  RECENT_REVIEWS = 'recent_reviews',
  INVENTORY_ALERTS = 'inventory_alerts',
  SALES_BY_CATEGORY = 'sales_by_category'
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  width: 'full' | 'half' | 'third' | 'two-thirds';
  height: 'small' | 'medium' | 'large';
  position: number;
  roles: string[];
  visible: boolean;
  settings?: Record<string, any>;
}

// Dashboard Layout
export interface DashboardLayout {
  userId: string;
  widgets: DashboardWidget[];
}

// Dashboard API Response Types
export interface DashboardStatsResponse {
  stats: DashboardStats;
  timestamp: string;
}

export interface RevenueDataResponse {
  data: RevenueData[];
  timeRange: TimeRange;
  total: number;
  previousTotal?: number;
  percentChange?: number;
}

export interface OrdersDataResponse {
  data: OrdersData[];
  timeRange: TimeRange;
  total: number;
  previousTotal?: number;
  percentChange?: number;
}

export interface UserGrowthResponse {
  data: UserGrowthData[];
  timeRange: TimeRange;
  newUsersTotal: number;
  previousNewUsersTotal?: number;
  percentChange?: number;
}

export interface TrafficSourcesResponse {
  sources: TrafficSource[];
  timeRange: TimeRange;
  totalVisits: number;
}

export interface DeviceDataResponse {
  devices: DeviceData[];
  timeRange: TimeRange;
  totalSessions: number;
}

export interface TopProductsResponse {
  products: TopProduct[];
  timeRange: TimeRange;
  totalRevenue: number;
}

export interface SearchTermsResponse {
  terms: SearchTerm[];
  timeRange: TimeRange;
  totalSearches: number;
}

export interface GeographicDataResponse {
  regions: GeographicData[];
  timeRange: TimeRange;
  totalOrders: number;
  totalRevenue: number;
}