// This file contains sample product data for demonstration purposes

// Create an array of sample product images
const sampleImages = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400', // Headphones
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400', // Red shoes
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400', // Watch
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400', // Sunglasses
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=400', // Smart watch
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=400', // Laptop
  'https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?q=80&w=400', // Keyboard
  'https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=400', // Earbuds
  'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=400', // Shoes
  'https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=400', // Chair
  'https://images.unsplash.com/photo-1507764923504-cd90bf7da772?q=80&w=400', // Lamp
  'https://images.unsplash.com/photo-1542728928-1413d1894ed1?q=80&w=400', // Sofa
];

// Create an array of product names
const productNames = [
  'Premium Wireless Headphones',
  'Ultra-Light Running Shoes',
  'Smart Watch with Heart Rate Monitor',
  'Designer Polarized Sunglasses',
  'Bluetooth Sport Earbuds',
  'Ultra-Thin Laptop Pro',
  'Mechanical Gaming Keyboard',
  'HD Noise-Cancelling Earbuds',
  'Athletic Performance Shoes',
  'Ergonomic Office Chair',
  'Modern LED Desk Lamp',
  'Comfortable Sectional Sofa',
  'Portable Bluetooth Speaker',
  'Digital Camera with 4K Video',
  'Smart Home Hub Controller',
  'Professional Chef Knife Set',
  'Wireless Charging Pad',
  'Fitness Tracker Band',
  'Electric Coffee Grinder',
  'Insulated Water Bottle',
  'Ultra HD Smart TV',
  'Indoor Plant Collection',
  'Lightweight Camping Tent',
  'Wireless Gaming Mouse',
];

// Create an array of categories
const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Sports', 'Beauty'];

// Create an array of brands
const brands = ['SoundMaster', 'TechVision', 'FitTech', 'HomeConnect', 'StylePro'];

// Helper function to get a random item from an array
const getRandomItem = (array: any[]) => array[Math.floor(Math.random() * array.length)];

// Helper function to get a random price
const getRandomPrice = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min) * 0.99;
};

// Helper function to generate a description
const generateDescription = (name: string, category: string) => {
  const descriptors = ['Premium', 'High-quality', 'Durable', 'Professional', 'Stylish'];
  const benefits = ['designed for comfort', 'built to last', 'perfect for everyday use', 'with advanced features', 'that exceeds expectations'];
  
  return `${getRandomItem(descriptors)} ${category.toLowerCase()} product ${getRandomItem(benefits)}. The ${name.toLowerCase()} is the perfect choice for those who value quality and performance.`;
};

// Function to generate a batch of sample products
export const generateSampleProducts = (count: number, page = 1) => {
  return Array(count).fill(0).map((_, i) => {
    const id = (page - 1) * count + i + 1;
    const name = productNames[id % productNames.length];
    const category = getRandomItem(categories);
    const brand = getRandomItem(brands);
    const price = getRandomPrice(50, 300);
    const hasDiscount = Math.random() > 0.7;
    const discountPrice = hasDiscount ? price * 0.8 : undefined;
    
    return {
      id,
      name,
      description: generateDescription(name, category),
      price,
      discountPrice,
      image: sampleImages[id % sampleImages.length],
      category,
      brand,
      rating: (3 + Math.random() * 2).toFixed(1),
      reviews: Math.floor(Math.random() * 200) + 5,
      inStock: Math.random() > 0.1,
      isNew: Math.random() > 0.8,
      tags: [category.toLowerCase(), brand.toLowerCase(), 'featured'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};

// Generate a response that mimics the API's pagination structure
export const generateProductsResponse = (params: any) => {
  const { page = 1, limit = 12 } = params;
  const totalProducts = 96; // Total number of products in our "database"
  const totalPages = Math.ceil(totalProducts / limit);
  
  return {
    products: generateSampleProducts(limit, page),
    total: totalProducts,
    page,
    limit,
    totalPages,
  };
};

export default generateSampleProducts;