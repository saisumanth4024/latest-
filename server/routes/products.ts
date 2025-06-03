import { Request, Response } from 'express';
import MOCK_PRODUCTS from '../products/mockProducts';

// Enhance products with additional server-side properties
const enhancedProducts = MOCK_PRODUCTS.map((product: any, index: number) => {
  // Add server-side properties needed for the API
  return {
    ...product,
    id: parseInt(product.id), // Convert string ID to number for server-side consistency
    isNew: Math.random() > 0.8,
    isFeatured: Math.random() > 0.7,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
    // Ensure discountPrice is properly set
    discountPrice: product.discount > 0 ? product.price * (1 - product.discount / 100) : undefined
  };
});

// Cache products to avoid regenerating on every request
const productsCache = enhancedProducts;

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
      console.warn(
        `Product not found with ID: ${productId}. Available IDs: ${productsCache
          .map((p) => p.id)
          .join(', ')}`
      );
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