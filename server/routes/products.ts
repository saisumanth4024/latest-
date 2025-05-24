import { Request, Response } from 'express';

// Define product categories
const categories = [
  'electronics',
  'clothing',
  'home',
  'beauty',
  'books',
  'sports',
  'toys',
  'automotive',
  'health',
  'jewelry'
];

// Define brands
const brands = [
  'Apple',
  'Samsung',
  'Sony',
  'Nike',
  'Adidas',
  'LG',
  'Dell',
  'Logitech',
  'Bose',
  'Canon',
  'Microsoft',
  'Amazon',
  'HP',
  'Lenovo',
  'Asus'
];

// Generate a random product
const generateProduct = (id: number) => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const price = Math.floor(Math.random() * 1000) + 10;
  const hasDiscount = Math.random() > 0.7;
  const discountPrice = hasDiscount ? Math.floor(price * 0.8) : undefined;
  const rating = (Math.random() * 4 + 1).toFixed(1);
  const reviews = Math.floor(Math.random() * 500);
  const inStock = Math.random() > 0.2;
  const isNew = Math.random() > 0.8;
  const isFeatured = Math.random() > 0.7;
  
  // Product names by category
  const productNames: { [key: string]: string[] } = {
    electronics: [
      'Wireless Headphones',
      'Smart Watch',
      'Bluetooth Speaker',
      'Wireless Earbuds',
      'HD Webcam',
      '4K Monitor',
      'Gaming Keyboard',
      'Wireless Mouse',
      'USB-C Hub',
      'External SSD'
    ],
    clothing: [
      'Slim Fit Jeans',
      'Cotton T-Shirt',
      'Wool Sweater',
      'Leather Jacket',
      'Athletic Shorts',
      'Running Shoes',
      'Formal Dress Shirt',
      'Winter Coat',
      'Designer Sunglasses',
      'Fashion Watch'
    ],
    home: [
      'Coffee Maker',
      'Air Purifier',
      'Robot Vacuum',
      'Luxury Bedding Set',
      'Smart Thermostat',
      'Kitchen Knife Set',
      'Stainless Steel Cookware',
      'Standing Desk',
      'Memory Foam Mattress',
      'Smart Light Bulbs'
    ],
    beauty: [
      'Facial Cleanser',
      'Anti-Aging Serum',
      'Luxury Perfume',
      'Hair Styling Kit',
      'Electric Toothbrush',
      'Makeup Palette',
      'Moisturizing Cream',
      'Beard Trimmer',
      'Nail Polish Set',
      'Hair Dryer'
    ],
    books: [
      'Bestselling Novel',
      'Business Strategy Guide',
      'Self-Help Book',
      'Cookbook Collection',
      'Science Fiction Series',
      'Biography Collection',
      'Children\'s Picture Book',
      'Travel Guide',
      'Historical Fiction',
      'Psychology Textbook'
    ],
    sports: [
      'Yoga Mat',
      'Dumbbells Set',
      'Tennis Racket',
      'Basketball',
      'Golf Clubs',
      'Fitness Tracker',
      'Camping Tent',
      'Hiking Backpack',
      'Soccer Ball',
      'Fishing Rod'
    ],
    toys: [
      'Building Blocks',
      'Remote Control Car',
      'Educational Puzzle',
      'Action Figure',
      'Board Game',
      'Stuffed Animal',
      'Art Set',
      'Science Kit',
      'Drone',
      'Video Game Console'
    ],
    automotive: [
      'Car Wax',
      'Dashboard Camera',
      'Floor Mats',
      'Car Cover',
      'Bluetooth Car Adapter',
      'Jump Starter',
      'Tire Pressure Gauge',
      'Car Vacuum',
      'Phone Mount',
      'GPS Navigator'
    ],
    health: [
      'Digital Scale',
      'Blood Pressure Monitor',
      'Massage Gun',
      'Vitamin Supplements',
      'Air Purifier',
      'Sleep Tracker',
      'Foam Roller',
      'Resistance Bands',
      'Meditation Cushion',
      'Essential Oil Diffuser'
    ],
    jewelry: [
      'Diamond Earrings',
      'Gold Necklace',
      'Silver Bracelet',
      'Men\'s Watch',
      'Pearl Pendant',
      'Engagement Ring',
      'Wedding Band',
      'Charm Bracelet',
      'Birthstone Jewelry',
      'Statement Ring'
    ]
  };
  
  // Get names for this category or use a default list
  const namesForCategory = productNames[category] || productNames.electronics;
  const productName = `${brand} ${namesForCategory[id % namesForCategory.length]}`;
  
  return {
    id,
    name: productName,
    description: `Experience the premium quality and performance of this ${brand} ${category} product. Designed for durability and style, this item features the latest technology and premium materials.`,
    price,
    discountPrice,
    image: `https://picsum.photos/seed/product${id}/400/400`,
    category,
    brand,
    rating: parseFloat(rating),
    reviews,
    inStock,
    isNew,
    isFeatured,
    tags: [category, brand.toLowerCase(), inStock ? 'in-stock' : 'out-of-stock'],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
  };
};

// Generate 100 products
const generateProducts = () => {
  return Array(100).fill(0).map((_, idx) => generateProduct(idx + 1));
};

// Cache products to avoid regenerating on every request
const productsCache = generateProducts();

// Get all products
export const getProducts = (req: Request, res: Response) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const search = (req.query.search as string) || '';
    const category = req.query.category as string;
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;
    const brand = req.query.brand as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';
    const inStock = req.query.inStock === 'true';
    const featured = req.query.featured === 'true';
    
    // Apply filters
    let filteredProducts = [...productsCache];
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Category filter
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    // Price filter
    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
    }
    
    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }
    
    // Brand filter
    if (brand) {
      filteredProducts = filteredProducts.filter(product => product.brand.toLowerCase() === brand.toLowerCase());
    }
    
    // Stock filter
    if (inStock) {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    }
    
    // Featured filter
    if (featured) {
      filteredProducts = filteredProducts.filter(product => product.isFeatured);
    }
    
    // Sort products
    filteredProducts.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];
      
      // Handle special sort cases
      if (sortBy === 'price' && a.discountPrice) {
        aValue = a.discountPrice;
      }
      
      if (sortBy === 'price' && b.discountPrice) {
        bValue = b.discountPrice;
      }
      
      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Number or date comparison
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Return response
    res.json({
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Get product by ID
export const getProductById = (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const product = productsCache.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// Get products by category
export const getProductsByCategory = (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    
    const categoryProducts = productsCache.filter(p => p.category === category);
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = categoryProducts.slice(startIndex, endIndex);
    
    res.json({
      products: paginatedProducts,
      total: categoryProducts.length,
      page,
      limit,
      totalPages: Math.ceil(categoryProducts.length / limit)
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Search products
export const searchProducts = (req: Request, res: Response) => {
  try {
    const searchQuery = (req.query.search as string) || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    
    // Search products
    const searchLower = searchQuery.toLowerCase();
    const searchResults = productsCache.filter(product => 
      product.name.toLowerCase().includes(searchLower) || 
      product.description.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = searchResults.slice(startIndex, endIndex);
    
    res.json({
      products: paginatedResults,
      total: searchResults.length,
      page,
      limit,
      totalPages: Math.ceil(searchResults.length / limit)
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Failed to search products' });
  }
};

// Get featured products
export const getFeaturedProducts = (_req: Request, res: Response) => {
  try {
    const featuredProducts = productsCache
      .filter(p => p.isFeatured)
      .slice(0, 8);
    
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Failed to fetch featured products' });
  }
};

// Get new arrivals
export const getNewArrivals = (_req: Request, res: Response) => {
  try {
    const newArrivals = productsCache
      .filter(p => p.isNew)
      .slice(0, 8);
    
    res.json(newArrivals);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({ message: 'Failed to fetch new arrivals' });
  }
};

// Get best sellers
export const getBestSellers = (_req: Request, res: Response) => {
  try {
    // Sort by highest reviews and rating
    const bestSellers = [...productsCache]
      .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
      .slice(0, 8);
    
    res.json(bestSellers);
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    res.status(500).json({ message: 'Failed to fetch best sellers' });
  }
};

// Get product recommendations
export const getProductRecommendations = (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const product = productsCache.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get recommendations based on same category and brand
    const recommendations = productsCache
      .filter(p => p.id !== productId && (p.category === product.category || p.brand === product.brand))
      .slice(0, 4);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching product recommendations:', error);
    res.status(500).json({ message: 'Failed to fetch recommendations' });
  }
};