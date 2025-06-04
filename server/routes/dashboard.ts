import { Router, Request, Response } from 'express';

export const getDashboardLayout = (req: Request, res: Response) => {
  res.json({
    layouts: {
      default: {
        widgets: ['revenue', 'orders', 'customers', 'traffic'],
      },
    },
    activeLayout: 'default',
  });
};

export const updateDashboardLayout = (req: Request, res: Response) => {
  res.json(req.body);
};

export const getDashboardData = (req: Request, res: Response) => {
  res.json({
    revenue: {
      total: 12500,
      previousTotal: 10000,
      percentChange: 25,
      data: [
        { date: '2024-01-01', revenue: 2000, expenses: 500, profit: 1500 },
        { date: '2024-01-02', revenue: 3000, expenses: 1000, profit: 2000 },
      ],
    },
    orderStats: {
      total: 200,
      pending: 10,
      processing: 20,
      shipped: 40,
      delivered: 120,
      cancelled: 10,
      returned: 5,
      percentChange: 10,
    },
    topProducts: [
      { id: 1, name: 'Product A', category: 'Category A', revenue: 4000, units: 50, percentChange: 5 },
      { id: 2, name: 'Product B', category: 'Category B', revenue: 3000, units: 40, percentChange: -2 },
    ],
    customerStats: {
      total: 500,
      newCustomers: 50,
      returningCustomers: 450,
      percentChange: 8,
      sources: {
        direct: 200,
        search: 150,
        social: 50,
        referral: 50,
        email: 25,
        mobile: 15,
        desktop: 10,
      },
    },
    trafficData: {
      total: 10000,
      percentChange: 12,
      sources: [
        { source: 'direct', visits: 4000, percentage: 40 },
        { source: 'search', visits: 3000, percentage: 30 },
        { source: 'social', visits: 2000, percentage: 20 },
        { source: 'referral', visits: 1000, percentage: 10 },
      ],
    },
    searchTerms: [
      { term: 'laptop', count: 120, percentChange: 5 },
      { term: 'headphones', count: 80, percentChange: 3 },
    ],
  });
};

export const getRevenueData = (req: Request, res: Response) => {
  res.json({
    total: 12500,
    previousTotal: 10000,
    percentChange: 25,
    data: [
      { date: '2024-01-01', revenue: 2000, expenses: 500, profit: 1500 },
      { date: '2024-01-02', revenue: 3000, expenses: 1000, profit: 2000 },
    ],
  });
};

export const getOrderStats = (req: Request, res: Response) => {
  res.json({
    total: 200,
    pending: 10,
    processing: 20,
    shipped: 40,
    delivered: 120,
    cancelled: 10,
    returned: 5,
    percentChange: 10,
  });
};

export const getTopProducts = (req: Request, res: Response) => {
  res.json([
    { id: 1, name: 'Product A', category: 'Category A', revenue: 4000, units: 50, percentChange: 5 },
    { id: 2, name: 'Product B', category: 'Category B', revenue: 3000, units: 40, percentChange: -2 },
  ]);
};

export const getCustomerStats = (req: Request, res: Response) => {
  res.json({
    total: 500,
    newCustomers: 50,
    returningCustomers: 450,
    percentChange: 8,
    sources: {
      direct: 200,
      search: 150,
      social: 50,
      referral: 50,
      email: 25,
      mobile: 15,
      desktop: 10,
    },
  });
};

export const getSearchTerms = (req: Request, res: Response) => {
  res.json([
    { term: 'laptop', count: 120, percentChange: 5 },
    { term: 'headphones', count: 80, percentChange: 3 },
  ]);
};

// Express router that wires the handlers above
const router = Router();
router.get('/layouts', getDashboardLayout);
router.post('/layouts', updateDashboardLayout);
router.get('/data', getDashboardData);
router.get('/revenue', getRevenueData);
router.get('/orders/stats', getOrderStats);
router.get('/products/top', getTopProducts);
router.get('/customers/stats', getCustomerStats);
router.get('/search/terms', getSearchTerms);

export default router;
