/**
 * MOCK PRODUCT DATA
 * 
 * This file contains mock product data for development and demonstration purposes only.
 * In a production environment, this would be replaced with real data from an API.
 */

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  brand: string;
  inStock: boolean;
  discount: number;
  tags: string[];
  reviews: number;
  priceRange: string;
  colors?: string[];
  specs?: Record<string, any>;
}

// Helper function to get price range category
const getPriceRange = (price: number): string => {
  if (price < 50) return "0-50";
  if (price < 100) return "50-100";
  if (price < 200) return "100-200";
  if (price < 500) return "200-500";
  return "500+";
};

// Define product categories with subcategories for better organization
const categories: Record<string, string[]> = {
  electronics: [
    "smartphones",
    "laptops",
    "tablets",
    "headphones",
    "speakers",
    "cameras",
    "wearables",
    "accessories"
  ],
  clothing: [
    "shirts",
    "pants",
    "dresses",
    "jackets",
    "activewear",
    "footwear",
    "accessories",
    "underwear"
  ],
  home: [
    "furniture",
    "kitchen",
    "bath",
    "bedding",
    "decor",
    "appliances",
    "lighting",
    "storage"
  ],
  beauty: [
    "skincare",
    "makeup",
    "haircare",
    "fragrance",
    "tools",
    "bath",
    "sets",
    "wellness"
  ],
  books: [
    "fiction",
    "non-fiction",
    "science",
    "biography",
    "self-help",
    "cooking",
    "travel",
    "children"
  ],
  sports: [
    "fitness",
    "outdoor",
    "team-sports",
    "water-sports",
    "winter-sports",
    "equipment",
    "accessories",
    "apparel"
  ],
  toys: [
    "games",
    "puzzles",
    "educational",
    "dolls",
    "action-figures",
    "vehicles",
    "outdoor",
    "arts-crafts"
  ],
  grocery: [
    "snacks",
    "beverages",
    "pantry",
    "organic",
    "frozen",
    "dairy",
    "bakery",
    "specialty"
  ],
  accessories: [
    "watches",
    "jewelry",
    "bags",
    "sunglasses",
    "hats",
    "scarves",
    "belts",
    "wallets"
  ]
};

// Define brands for each category
const brands: Record<string, string[]> = {
  electronics: [
    "Apple", "Samsung", "Sony", "Bose", "LG", "Dell", "HP", "Logitech", 
    "JBL", "Beats", "Anker", "Canon", "Nikon", "Fitbit", "Garmin", "Microsoft"
  ],
  clothing: [
    "Nike", "Adidas", "Under Armour", "Levi's", "H&M", "Zara", "Ralph Lauren", 
    "Calvin Klein", "Tommy Hilfiger", "North Face", "Patagonia", "Columbia", 
    "Uniqlo", "Gap", "J.Crew", "Banana Republic"
  ],
  home: [
    "IKEA", "Wayfair", "Crate & Barrel", "West Elm", "Williams-Sonoma", "Ashley", 
    "Pottery Barn", "Bed Bath & Beyond", "KitchenAid", "Dyson", "Cuisinart", 
    "OXO", "Ninja", "SimpliSafe", "Philips", "iRobot"
  ],
  beauty: [
    "Sephora", "MAC", "L'Oréal", "Maybelline", "Estée Lauder", "Clinique", 
    "Neutrogena", "CeraVe", "Olay", "Dove", "NYX", "Fenty Beauty", "Glossier", 
    "Kiehl's", "The Ordinary", "Drunk Elephant"
  ],
  books: [
    "Penguin Random House", "HarperCollins", "Simon & Schuster", "Macmillan", 
    "Hachette", "Scholastic", "Oxford University Press", "Dover", "Chronicle Books", 
    "Workman", "Wiley", "McGraw Hill", "O'Reilly", "DK", "Taschen", "Phaidon"
  ],
  sports: [
    "Nike", "Adidas", "Under Armour", "Wilson", "Spalding", "Callaway", "Yeti",
    "Coleman", "The North Face", "Patagonia", "Columbia", "REI Co-op", "Osprey",
    "CamelBak", "Speedo", "TaylorMade"
  ],
  toys: [
    "LEGO", "Mattel", "Hasbro", "Fisher-Price", "Melissa & Doug", "Nintendo", 
    "Ravensburger", "PlayDoh", "Nerf", "Barbie", "Hot Wheels", "Funko", 
    "American Girl", "VTech", "Little Tikes", "Crayola"
  ],
  grocery: [
    "Whole Foods", "Trader Joe's", "Kellogg's", "Nestlé", "General Mills", 
    "Pepsi", "Coca-Cola", "Kraft", "Hershey's", "Kind", "Annie's", "Ben & Jerry's", 
    "Chobani", "Nature Valley", "Quaker", "Organic Valley"
  ],
  // Add fallback for any other categories
  accessories: [
    "Ray-Ban", "Fossil", "Casio", "Oakley", "Michael Kors", "Coach", "Swatch",
    "Gucci", "Prada", "Burberry", "Herschel", "Fjallraven", "Tumi", "Samsonite"
  ]
};

// Product name templates by category
const productNameTemplates: Record<string, Record<string, string[]>> = {
  electronics: {
    smartphones: [
      "%BRAND% %SERIES% Pro Smartphone",
      "%BRAND% %SERIES% Ultra Phone",
      "%BRAND% %SERIES% Lite",
      "%BRAND% %SERIES% Mini",
      "%BRAND% %SERIES% Max Phone"
    ],
    laptops: [
      "%BRAND% %SERIES% Pro Laptop",
      "%BRAND% %SERIES% Ultra Thin Notebook",
      "%BRAND% %SERIES% Gaming Laptop",
      "%BRAND% %SERIES% Book",
      "%BRAND% %SERIES% Business Laptop"
    ],
    tablets: [
      "%BRAND% %SERIES% Tablet",
      "%BRAND% %SERIES% Pad",
      "%BRAND% %SERIES% Tab Pro",
      "%BRAND% %SERIES% Tablet Mini",
      "%BRAND% %SERIES% Slate"
    ],
    headphones: [
      "%BRAND% %SERIES% Noise Cancelling Headphones",
      "%BRAND% %SERIES% Wireless Earbuds",
      "%BRAND% %SERIES% Studio Headphones",
      "%BRAND% %SERIES% Gaming Headset",
      "%BRAND% %SERIES% True Wireless Earphones"
    ],
    speakers: [
      "%BRAND% %SERIES% Bluetooth Speaker",
      "%BRAND% %SERIES% Smart Speaker",
      "%BRAND% %SERIES% Waterproof Speaker",
      "%BRAND% %SERIES% Portable Sound System",
      "%BRAND% %SERIES% Home Theater System"
    ],
    cameras: [
      "%BRAND% %SERIES% DSLR Camera",
      "%BRAND% %SERIES% Mirrorless Camera",
      "%BRAND% %SERIES% Action Camera",
      "%BRAND% %SERIES% Vlogging Camera",
      "%BRAND% %SERIES% Point & Shoot Camera"
    ],
    wearables: [
      "%BRAND% %SERIES% Smartwatch",
      "%BRAND% %SERIES% Fitness Tracker",
      "%BRAND% %SERIES% Smart Ring",
      "%BRAND% %SERIES% Health Monitor",
      "%BRAND% %SERIES% GPS Watch"
    ],
    accessories: [
      "%BRAND% %SERIES% Wireless Charger",
      "%BRAND% %SERIES% Power Bank",
      "%BRAND% %SERIES% USB-C Hub",
      "%BRAND% %SERIES% Phone Case",
      "%BRAND% %SERIES% Screen Protector"
    ]
  },
  clothing: {
    shirts: [
      "%BRAND% Classic Cotton T-Shirt",
      "%BRAND% Premium Dress Shirt",
      "%BRAND% Oxford Button-Down",
      "%BRAND% Casual Polo Shirt",
      "%BRAND% Performance Long-Sleeve"
    ],
    pants: [
      "%BRAND% Slim Fit Jeans",
      "%BRAND% Stretch Chino Pants",
      "%BRAND% Comfort Fit Trousers",
      "%BRAND% Cargo Pants",
      "%BRAND% Performance Joggers"
    ],
    dresses: [
      "%BRAND% Summer Maxi Dress",
      "%BRAND% Cocktail Party Dress",
      "%BRAND% Casual Wrap Dress",
      "%BRAND% A-Line Midi Dress",
      "%BRAND% Formal Evening Gown"
    ],
    jackets: [
      "%BRAND% Water-Resistant Windbreaker",
      "%BRAND% Leather Bomber Jacket",
      "%BRAND% Classic Denim Jacket",
      "%BRAND% Down Puffer Coat",
      "%BRAND% All-Weather Rain Jacket"
    ],
    activewear: [
      "%BRAND% Performance Training Tee",
      "%BRAND% Compression Leggings",
      "%BRAND% Moisture-Wicking Shorts",
      "%BRAND% Athletic Tank Top",
      "%BRAND% Seamless Workout Set"
    ],
    footwear: [
      "%BRAND% Running Performance Shoes",
      "%BRAND% Casual Slip-On Sneakers",
      "%BRAND% Leather Dress Shoes",
      "%BRAND% Hiking Boots",
      "%BRAND% Comfort Walking Shoes"
    ],
    accessories: [
      "%BRAND% Leather Belt",
      "%BRAND% Winter Knit Beanie",
      "%BRAND% Classic Silk Tie",
      "%BRAND% Polarized Sunglasses",
      "%BRAND% Premium Leather Wallet"
    ],
    underwear: [
      "%BRAND% Cotton Boxer Briefs Set",
      "%BRAND% Seamless Thong Set",
      "%BRAND% Comfort Bralette",
      "%BRAND% Moisture-Wicking Sports Bra",
      "%BRAND% No-Show Socks Pack"
    ]
  },
  home: {
    furniture: [
      "%BRAND% Ergonomic Office Chair",
      "%BRAND% Mid-Century Sofa",
      "%BRAND% Storage Coffee Table",
      "%BRAND% Adjustable Standing Desk",
      "%BRAND% Platform Bed Frame"
    ],
    kitchen: [
      "%BRAND% Professional Chef's Knife Set",
      "%BRAND% Non-Stick Cookware Set",
      "%BRAND% Smart Countertop Oven",
      "%BRAND% Digital Air Fryer",
      "%BRAND% Programmable Coffee Maker"
    ],
    bath: [
      "%BRAND% Luxury Bath Towel Set",
      "%BRAND% High-Pressure Shower Head",
      "%BRAND% Memory Foam Bath Mat",
      "%BRAND% Smart Bathroom Scale",
      "%BRAND% Shower Caddy Organizer"
    ],
    bedding: [
      "%BRAND% All-Season Down Comforter",
      "%BRAND% Egyptian Cotton Sheet Set",
      "%BRAND% Memory Foam Pillow",
      "%BRAND% Weighted Blanket",
      "%BRAND% Cooling Mattress Topper"
    ],
    decor: [
      "%BRAND% Handwoven Area Rug",
      "%BRAND% Framed Wall Art Set",
      "%BRAND% Decorative Throw Pillows",
      "%BRAND% LED String Lights",
      "%BRAND% Scented Candle Collection"
    ],
    appliances: [
      "%BRAND% Robot Vacuum Cleaner",
      "%BRAND% Smart Refrigerator",
      "%BRAND% Compact Dishwasher",
      "%BRAND% Quiet Air Purifier",
      "%BRAND% Energy-Efficient Washer/Dryer"
    ],
    lighting: [
      "%BRAND% Smart LED Floor Lamp",
      "%BRAND% Adjustable Desk Lamp",
      "%BRAND% Ceiling Fan with Lights",
      "%BRAND% Modern Pendant Light",
      "%BRAND% Motion Sensor Night Lights"
    ],
    storage: [
      "%BRAND% Modular Closet System",
      "%BRAND% Under-Bed Storage Containers",
      "%BRAND% Pantry Organization Set",
      "%BRAND% Stackable Storage Bins",
      "%BRAND% Wall-Mounted Shelving Unit"
    ]
  },
  beauty: {
    skincare: [
      "%BRAND% Hyaluronic Acid Serum",
      "%BRAND% Vitamin C Brightening Moisturizer",
      "%BRAND% Gentle Foaming Cleanser",
      "%BRAND% Retinol Night Cream",
      "%BRAND% SPF 50 Daily Sunscreen"
    ],
    makeup: [
      "%BRAND% Long-Wear Foundation",
      "%BRAND% Volumizing Mascara",
      "%BRAND% Matte Liquid Lipstick",
      "%BRAND% Eyeshadow Palette",
      "%BRAND% Brow Shaping Pencil"
    ],
    haircare: [
      "%BRAND% Repairing Shampoo & Conditioner",
      "%BRAND% Argan Oil Hair Mask",
      "%BRAND% Heat Protection Spray",
      "%BRAND% Volumizing Dry Shampoo",
      "%BRAND% Curl Defining Cream"
    ],
    fragrance: [
      "%BRAND% Signature Eau de Parfum",
      "%BRAND% Unisex Cologne",
      "%BRAND% Fresh Citrus Body Spray",
      "%BRAND% Warm Vanilla Rollerball",
      "%BRAND% Luxury Fragrance Gift Set"
    ],
    tools: [
      "%BRAND% Ceramic Hair Straightener",
      "%BRAND% Professional Hair Dryer",
      "%BRAND% Facial Cleansing Brush",
      "%BRAND% Jade Facial Roller",
      "%BRAND% Electric Makeup Brush Set"
    ]
  },
  books: {
    fiction: [
      "The Last Summer at %LOCATION%",
      "Secrets of the %LOCATION% Garden",
      "Midnight in %LOCATION%",
      "The %PROFESSION%'s Daughter",
      "When We Were in %LOCATION%"
    ],
    "non-fiction": [
      "The Art of %ACTIVITY%",
      "How to Master %ACTIVITY% in 30 Days",
      "%ACTIVITY%: A Complete Guide",
      "The Science of %TOPIC%",
      "%PROFESSION% Mindset: Keys to Success"
    ],
    science: [
      "Understanding %TOPIC% for Beginners",
      "The Hidden World of %TOPIC%",
      "%TOPIC%: The Next Frontier",
      "Exploring %LOCATION%: A Scientific Journey",
      "The Future of %TOPIC%"
    ]
  },
  sports: {
    fitness: [
      "%BRAND% Adjustable Dumbbell Set",
      "%BRAND% Yoga Mat",
      "%BRAND% Resistance Bands Kit",
      "%BRAND% Jump Rope",
      "%BRAND% Weight Bench"
    ],
    outdoor: [
      "%BRAND% Hiking Backpack",
      "%BRAND% 2-Person Tent",
      "%BRAND% Insulated Water Bottle",
      "%BRAND% GPS Hiking Watch",
      "%BRAND% Trekking Poles"
    ],
    "team-sports": [
      "%BRAND% Official Basketball",
      "%BRAND% Soccer Ball",
      "%BRAND% Football",
      "%BRAND% Volleyball Set",
      "%BRAND% Baseball Glove"
    ]
  },
  toys: {
    games: [
      "%BRAND% Strategy Board Game",
      "%BRAND% Family Card Game",
      "%BRAND% Mystery Puzzle Game",
      "%BRAND% Trivia Challenge",
      "%BRAND% Word Adventure Game"
    ],
    puzzles: [
      "%BRAND% 1000-Piece Landscape Puzzle",
      "%BRAND% 3D Building Puzzle",
      "%BRAND% Wooden Brain Teaser Set",
      "%BRAND% Floor Puzzle for Kids",
      "%BRAND% Mystery Jigsaw Puzzle"
    ],
    educational: [
      "%BRAND% STEM Building Kit",
      "%BRAND% Coding Robot for Kids",
      "%BRAND% Interactive Globe",
      "%BRAND% Science Experiment Kit",
      "%BRAND% Learning Tablet for Children"
    ]
  }
};

// Description templates by category for more realistic product descriptions
const descriptionTemplates: Record<string, string[]> = {
  electronics: [
    "Experience cutting-edge technology with the %PRODUCT_NAME%. Featuring %FEATURE1%, %FEATURE2%, and %FEATURE3%, this device delivers exceptional performance for all your needs. Perfect for %USER_TYPE% looking for reliability and innovation.",
    "Upgrade your tech collection with the premium %PRODUCT_NAME%. Built with %FEATURE1% and equipped with %FEATURE2%, it offers unparalleled %BENEFIT1%. Ideal for %USER_TYPE% who demand the best in class performance.",
    "Meet the revolutionary %PRODUCT_NAME%, designed for the modern %USER_TYPE%. With %FEATURE1%, %FEATURE2%, and up to %SPEC1%, it combines style and functionality in one sleek package. Experience %BENEFIT1% and %BENEFIT2% like never before."
  ],
  clothing: [
    "Elevate your wardrobe with the stylish %PRODUCT_NAME%. Made from %MATERIAL% fabric for ultimate comfort, featuring %FEATURE1% and %FEATURE2%. Perfect for %OCCASION% or casual everyday wear. Available in multiple colors to match your personal style.",
    "Discover exceptional comfort with our bestselling %PRODUCT_NAME%. Crafted from premium %MATERIAL% with %FEATURE1%, providing %BENEFIT1% all day long. Versatile enough for %OCCASION% while maintaining a fashionable edge.",
    "Introducing the must-have %PRODUCT_NAME% for your collection. This %MATERIAL% piece features %FEATURE1% and %FEATURE2%, ensuring both style and functionality. Designed for %USER_TYPE% who appreciate quality craftsmanship and timeless design."
  ],
  home: [
    "Transform your space with the elegant %PRODUCT_NAME%. Featuring %FEATURE1% and %FEATURE2%, it combines style and functionality to enhance any room. The %MATERIAL% construction ensures durability while adding a touch of sophistication to your home.",
    "Create the perfect environment with our premium %PRODUCT_NAME%. Designed with %FEATURE1% and %FEATURE2%, it provides %BENEFIT1% and %BENEFIT2% for your home. The versatile design complements any decor style from modern to traditional.",
    "Upgrade your home with the innovative %PRODUCT_NAME%. Built with %FEATURE1% and smart %FEATURE2%, it offers unparalleled convenience and style. Perfect for %USER_TYPE% looking to combine aesthetics with practical functionality."
  ],
  beauty: [
    "Reveal your natural radiance with %PRODUCT_NAME%. Formulated with %INGREDIENT1% and %INGREDIENT2%, this %PRODUCT_TYPE% delivers %BENEFIT1% and %BENEFIT2% for all skin types. Dermatologist tested and free from harsh chemicals.",
    "Achieve professional results at home with our premium %PRODUCT_NAME%. Infused with %INGREDIENT1% and %INGREDIENT2%, it provides %BENEFIT1% while preventing %PROBLEM1%. Perfect for daily use in your beauty routine.",
    "Discover the secret to %BENEFIT1% with our bestselling %PRODUCT_NAME%. This innovative formula combines %INGREDIENT1% with %INGREDIENT2% for maximum effectiveness. Clinically proven to improve %SKIN_CONCERN% in just a few weeks of regular use."
  ],
  books: [
    "Dive into an unforgettable journey with '%PRODUCT_NAME%'. This compelling %GENRE% explores themes of %THEME1% and %THEME2% through the eyes of unforgettable characters. A must-read for fans of %SIMILAR_AUTHOR% and %SIMILAR_WORK%.",
    "Expand your horizons with '%PRODUCT_NAME%', the definitive guide to %TOPIC%. Written by renowned expert %AUTHOR%, this comprehensive resource covers everything from %SUBTOPIC1% to %SUBTOPIC2% in accessible, engaging language.",
    "Discover new perspectives in '%PRODUCT_NAME%', a groundbreaking %GENRE% that challenges conventional thinking about %TOPIC%. Meticulously researched and beautifully written, it offers fresh insights into %SUBTOPIC1% and %SUBTOPIC2%."
  ],
  sports: [
    "Elevate your performance with the professional-grade %PRODUCT_NAME%. Engineered with %FEATURE1% and %FEATURE2%, it delivers superior %BENEFIT1% for serious athletes. Trusted by professionals for its exceptional quality and durability.",
    "Take your training to the next level with our premium %PRODUCT_NAME%. Featuring innovative %FEATURE1% and ergonomic %FEATURE2%, it provides optimal %BENEFIT1% and %BENEFIT2% during intense workouts. Designed for athletes of all levels.",
    "Experience the perfect balance of comfort and performance with the %PRODUCT_NAME%. Built with %FEATURE1% and reinforced with %FEATURE2%, it offers unparalleled %BENEFIT1% for your active lifestyle. Ideal for both beginners and seasoned enthusiasts."
  ],
  toys: [
    "Spark imagination and learning with the engaging %PRODUCT_NAME%. Designed to develop %SKILL1% and %SKILL2%, this interactive toy provides hours of educational entertainment. Perfect for children ages %AGE_RANGE%, encouraging both independent and collaborative play.",
    "Watch your child's creativity soar with our bestselling %PRODUCT_NAME%. Featuring %FEATURE1% and %FEATURE2%, it stimulates %SKILL1% while introducing concepts of %SKILL2%. Durably constructed to withstand years of adventurous play.",
    "Introduce your child to the joy of %ACTIVITY% with the innovative %PRODUCT_NAME%. This award-winning toy encourages %SKILL1% and %SKILL2% through engaging, screen-free play. Thoughtfully designed for children ages %AGE_RANGE%, promoting developmental milestones."
  ]
};

// Helper arrays for template variables
const series = ["Elite", "Pro", "Ultra", "Max", "Lite", "Plus", "Nova", "Prime", "Flex", "Core", "Neo", "Fusion", "Alpha", "Omega"];
const locations = ["Paris", "New York", "Tokyo", "Venice", "London", "San Francisco", "Barcelona", "Sydney", "Amsterdam", "Copenhagen", "Berlin"];
const professions = ["Doctor", "Artist", "Lawyer", "Teacher", "Chef", "Writer", "Architect", "Detective", "Scientist", "Gardener", "Photographer"];
const activities = ["Mindfulness", "Productivity", "Cooking", "Investing", "Public Speaking", "Photography", "Gardening", "Negotiation", "Time Management"];
const topics = ["Quantum Physics", "Climate Change", "Artificial Intelligence", "Human Psychology", "Evolutionary Biology", "Astronomy", "Neuroscience"];
const materials = ["Premium Cotton", "Organic Linen", "Genuine Leather", "Recycled Polyester", "Sustainable Bamboo", "Japanese Denim", "Merino Wool"];
const features: Record<string, string[]> = {
  electronics: [
    "High-Resolution Display", "Fast Charging Technology", "Water Resistant Design", "Advanced AI Capabilities", 
    "Ultra-Fast Processor", "Extended Battery Life", "Precision Controls", "Noise Cancellation", 
    "Wireless Connectivity", "Crystal Clear Audio", "4K Video Recording", "Smart Voice Assistant", 
    "Compact Design", "Ergonomic Build", "Energy Efficient Performance", "Premium Sound Quality"
  ],
  clothing: [
    "Moisture-Wicking Fabric", "4-Way Stretch Material", "Reinforced Stitching", "Breathable Design", 
    "Water-Resistant Finish", "Reflective Details", "Adjustable Fit", "Stain-Resistant Treatment", 
    "UV Protection", "Quick-Dry Technology", "Antimicrobial Properties", "Wrinkle-Free Material", 
    "Temperature Regulating", "Hidden Storage Pockets", "Tagless Comfort", "Eco-Friendly Materials"
  ],
  home: [
    "Space-Saving Design", "Easy Assembly", "Adjustable Settings", "Energy Efficient", 
    "Smart Home Compatible", "Quiet Operation", "Programmable Timer", "Durable Construction", 
    "Stain-Resistant Finish", "Non-Slip Base", "Customizable Features", "Portable Design", 
    "Child-Safe Materials", "Heat Resistant Surface", "Multi-Functional Use", "Eco-Friendly Materials"
  ],
  beauty: [
    "Paraben-Free Formula", "Clinically Tested", "Long-Lasting Results", "Quick-Absorbing Texture", 
    "Fragrance-Free Option", "Non-Comedogenic", "Dermatologist Recommended", "Cruelty-Free Production", 
    "Anti-Aging Properties", "Hydrating Formula", "Skin-Brightening Effect", "Oil-Free Composition", 
    "Suitable for Sensitive Skin", "Vegan Ingredients", "Natural Extracts", "SPF Protection"
  ],
  // Add fallback for other categories
  default: [
    "Premium Quality", "Durable Construction", "Sleek Design", "Innovative Features",
    "Eco-Friendly Materials", "User-Friendly Interface", "Compact Size", "Versatile Use",
    "Advanced Technology", "Exclusive Design", "Reliable Performance", "Lightweight Construction"
  ]
};
const benefits: Record<string, string[]> = {
  electronics: [
    "Exceptional Performance", "Crystal Clear Display", "All-Day Battery Life", "Professional Quality Results", 
    "Seamless Connectivity", "Lightning Fast Response", "Immersive Experience", "Superior Sound Quality", 
    "Enhanced Productivity", "Ultimate Portability", "Unmatched Reliability", "Premium Audio Experience"
  ],
  clothing: [
    "All-Day Comfort", "Unrestricted Movement", "Professional Appearance", "Versatile Styling Options", 
    "Weather Protection", "Temperature Regulation", "Lasting Durability", "Effortless Care", 
    "Confidence-Boosting Fit", "Athletic Performance", "Day-to-Night Versatility", "Sustainable Fashion"
  ],
  home: [
    "Streamlined Organization", "Enhanced Comfort", "Elegant Aesthetic", "Efficient Performance", 
    "Simplified Maintenance", "Improved Air Quality", "Noise Reduction", "Energy Savings", 
    "Space Optimization", "Consistent Results", "Stress-Free Operation", "Eco-Friendly Living"
  ],
  beauty: [
    "Visible Results", "Long-Lasting Hydration", "Even Skin Tone", "Reduced Fine Lines", 
    "Gentle Cleansing", "Natural Radiance", "All-Day Protection", "Deep Nourishment", 
    "Improved Skin Texture", "Youthful Appearance", "Balanced Complexion", "Professional Results"
  ],
  // Default benefits for any category
  default: [
    "Superior Quality", "Excellent Value", "Enhanced Experience", "Practical Solution",
    "Reliable Performance", "Thoughtful Design", "Everyday Convenience", "Trusted Quality"
  ]
};
const ingredients = [
  "Hyaluronic Acid", "Vitamin C", "Retinol", "Niacinamide", "Salicylic Acid", 
  "Peptides", "Green Tea Extract", "Aloe Vera", "Shea Butter", "Collagen", 
  "Squalane", "Jojoba Oil", "Glycolic Acid", "Ceramides", "Coconut Oil", "Almond Oil"
];
const skinConcerns = [
  "Dryness", "Fine Lines", "Uneven Texture", "Dullness", "Acne", 
  "Redness", "Dark Spots", "Enlarged Pores", "Loss of Firmness", "Sensitivity"
];
const skills = [
  "Problem Solving", "Fine Motor Skills", "Spatial Awareness", "Hand-Eye Coordination", 
  "Creative Thinking", "Logical Reasoning", "Social Interaction", "Language Development", 
  "Mathematical Concepts", "Scientific Exploration", "Emotional Intelligence", "Critical Thinking"
];
const ageRanges = ["3-5", "4-8", "6-10", "8-12", "10+", "12+", "Teen", "Family"];
const userTypes = [
  "Professionals", "Students", "Creators", "Travelers", "Fitness Enthusiasts", 
  "Remote Workers", "Gamers", "Music Lovers", "Photographers", "Home Chefs", 
  "Outdoor Enthusiasts", "Busy Parents", "Tech Enthusiasts", "Fashion-Forward Individuals"
];
const occasions = [
  "Office Wear", "Casual Outings", "Weekend Adventures", "Formal Events", 
  "Workout Sessions", "Travel", "Everyday Use", "Special Occasions", 
  "Outdoor Activities", "Business Meetings", "Date Night", "Home Lounging"
];

// Function to generate a random product name using templates
const generateProductName = (category: string, subcategory: string, brand: string): string => {
  if (!productNameTemplates[category]?.[subcategory]) {
    return `${brand} ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Product`;
  }
  
  const templates = productNameTemplates[category][subcategory];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  return template
    .replace('%BRAND%', brand)
    .replace('%SERIES%', series[Math.floor(Math.random() * series.length)])
    .replace('%LOCATION%', locations[Math.floor(Math.random() * locations.length)])
    .replace('%PROFESSION%', professions[Math.floor(Math.random() * professions.length)])
    .replace('%ACTIVITY%', activities[Math.floor(Math.random() * activities.length)])
    .replace('%TOPIC%', topics[Math.floor(Math.random() * topics.length)]);
};

// Function to generate a detailed product description
const generateDescription = (productName: string, category: string, subcategory: string): string => {
  const templates = descriptionTemplates[category] || descriptionTemplates.electronics;
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Get category-specific feature lists
  const categoryFeatures = features[category] || features.default;
  const categoryBenefits = benefits[category] || benefits.default;
  
  // Select random features and benefits without repetition
  const shuffledFeatures = [...categoryFeatures].sort(() => 0.5 - Math.random());
  const shuffledBenefits = [...categoryBenefits].sort(() => 0.5 - Math.random());
  
  return template
    .replace('%PRODUCT_NAME%', productName)
    .replace('%FEATURE1%', shuffledFeatures[0])
    .replace('%FEATURE2%', shuffledFeatures[1])
    .replace('%FEATURE3%', shuffledFeatures[2] || shuffledFeatures[0])
    .replace('%BENEFIT1%', shuffledBenefits[0])
    .replace('%BENEFIT2%', shuffledBenefits[1] || shuffledBenefits[0])
    .replace('%MATERIAL%', materials[Math.floor(Math.random() * materials.length)])
    .replace('%USER_TYPE%', userTypes[Math.floor(Math.random() * userTypes.length)])
    .replace('%OCCASION%', occasions[Math.floor(Math.random() * occasions.length)])
    .replace('%INGREDIENT1%', ingredients[Math.floor(Math.random() * ingredients.length)])
    .replace('%INGREDIENT2%', ingredients[Math.floor(Math.random() * ingredients.length)])
    .replace('%PRODUCT_TYPE%', subcategory)
    .replace('%SKIN_CONCERN%', skinConcerns[Math.floor(Math.random() * skinConcerns.length)])
    .replace('%GENRE%', subcategory)
    .replace('%THEME1%', topics[Math.floor(Math.random() * topics.length)])
    .replace('%THEME2%', topics[Math.floor(Math.random() * topics.length)])
    .replace('%SIMILAR_AUTHOR%', professions[Math.floor(Math.random() * professions.length)])
    .replace('%SIMILAR_WORK%', locations[Math.floor(Math.random() * locations.length)])
    .replace('%TOPIC%', topics[Math.floor(Math.random() * topics.length)])
    .replace('%AUTHOR%', professions[Math.floor(Math.random() * professions.length)])
    .replace('%SUBTOPIC1%', activities[Math.floor(Math.random() * activities.length)])
    .replace('%SUBTOPIC2%', activities[Math.floor(Math.random() * activities.length)])
    .replace('%SKILL1%', skills[Math.floor(Math.random() * skills.length)])
    .replace('%SKILL2%', skills[Math.floor(Math.random() * skills.length)])
    .replace('%AGE_RANGE%', ageRanges[Math.floor(Math.random() * ageRanges.length)])
    .replace('%ACTIVITY%', activities[Math.floor(Math.random() * activities.length)])
    .replace('%SPEC1%', `${Math.floor(Math.random() * 20) + 10} hours of battery life`); // Example spec
};

// Function to generate tags based on category and product name
const generateTags = (category: string, subcategory: string, productName: string): string[] => {
  const baseTags = [category, subcategory];
  
  // Add brand tag if it appears in the product name
  for (const brand of brands[category]) {
    if (productName.includes(brand)) {
      baseTags.push(brand.toLowerCase());
      break;
    }
  }
  
  // Add more specific tags based on product name and description
  if (productName.toLowerCase().includes('wireless')) baseTags.push('wireless');
  if (productName.toLowerCase().includes('premium') || productName.toLowerCase().includes('pro')) baseTags.push('premium');
  if (productName.toLowerCase().includes('smart')) baseTags.push('smart-device');
  if (productName.toLowerCase().includes('portable')) baseTags.push('portable');
  
  // Add some random category-specific tags
  if (category === 'electronics') {
    const techTags = ['gadget', 'tech', 'digital', 'high-tech', 'bluetooth', 'rechargeable'];
    baseTags.push(techTags[Math.floor(Math.random() * techTags.length)]);
  } else if (category === 'clothing') {
    const clothingTags = ['fashion', 'comfortable', 'stylish', 'trendy', 'casual', 'seasonal'];
    baseTags.push(clothingTags[Math.floor(Math.random() * clothingTags.length)]);
  }
  
  // Add trending tag for some products
  if (Math.random() > 0.8) baseTags.push('trending');
  
  // Add bestseller tag for some products
  if (Math.random() > 0.85) baseTags.push('bestseller');
  
  // Filter out any duplicates and return
  return Array.from(new Set(baseTags));
};

// Generate an array of mock products
const generateMockProducts = (): MockProduct[] => {
  const products: MockProduct[] = [];
  let idCounter = 1;
  
  // For each category and subcategory, generate multiple products
  Object.entries(categories).forEach(([category, subcategories]) => {
    const categoryBrands = brands[category] || brands.electronics;
    
    subcategories.forEach(subcategory => {
      // Generate 1-3 products per subcategory
      const productsPerSubcategory = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < productsPerSubcategory; i++) {
        const brand = categoryBrands[Math.floor(Math.random() * categoryBrands.length)];
        const name = generateProductName(category, subcategory, brand);
        
        // Generate a price appropriate for the category
        let basePrice = 0;
        if (category === 'electronics') basePrice = Math.floor(Math.random() * 900) + 100;
        else if (category === 'clothing') basePrice = Math.floor(Math.random() * 150) + 20;
        else if (category === 'home') basePrice = Math.floor(Math.random() * 300) + 30;
        else if (category === 'beauty') basePrice = Math.floor(Math.random() * 60) + 15;
        else if (category === 'books') basePrice = Math.floor(Math.random() * 30) + 10;
        else if (category === 'sports') basePrice = Math.floor(Math.random() * 200) + 20;
        else if (category === 'toys') basePrice = Math.floor(Math.random() * 100) + 15;
        else basePrice = Math.floor(Math.random() * 50) + 10;
        
        // Add some cents to make the price look more realistic
        const price = basePrice + (Math.floor(Math.random() * 100) / 100);
        
        // Generate a unique product id
        const id = idCounter.toString();
        idCounter++;
        
        // Generate a discount (only some products have discounts)
        const hasDiscount = Math.random() > 0.7;
        const discount = hasDiscount ? Math.floor(Math.random() * 30) + 5 : 0;
        
        // Generate a rating between 3.5 and 5.0
        const rating = parseFloat((Math.random() * 1.5 + 3.5).toFixed(1));
        
        // Generate a number of reviews
        const reviews = Math.floor(Math.random() * 200) + 5;
        
        // Determine if the product is in stock (most are)
        const inStock = Math.random() > 0.1;
        
        // Generate a description
        const description = generateDescription(name, category, subcategory);
        
        // Generate tags
        const tags = generateTags(category, subcategory, name);
        
        // Generate a unique image URL using a placeholder service
        const seed = id + name.substring(0, 5).replace(/\s/g, '');
        const image = `https://source.unsplash.com/random/600x400?${encodeURIComponent(subcategory)}&sig=${seed}`;
        
        // Create the product object
        products.push({
          id,
          name,
          description,
          price,
          image,
          rating,
          category,
          brand,
          inStock,
          discount,
          tags,
          reviews,
          priceRange: getPriceRange(price),
          // Add colors for clothing and some home products
          colors: (category === 'clothing' || (category === 'home' && Math.random() > 0.5)) 
            ? ['Black', 'White', 'Blue', 'Red', 'Gray'].slice(0, Math.floor(Math.random() * 4) + 1) 
            : undefined,
          // Add specs for electronics and some other categories
          specs: category === 'electronics' ? {
            weight: `${(Math.random() * 500 + 100).toFixed(0)}g`,
            dimensions: `${(Math.random() * 20 + 5).toFixed(1)} x ${(Math.random() * 15 + 5).toFixed(1)} x ${(Math.random() * 2 + 0.5).toFixed(1)} cm`,
            battery: Math.random() > 0.5 ? `${Math.floor(Math.random() * 20) + 5} hours` : undefined,
            connectivity: Math.random() > 0.5 ? 'Bluetooth 5.0' : undefined,
            resolution: Math.random() > 0.5 ? '1080p Full HD' : undefined
          } : undefined
        });
      }
    });
  });
  
  return products;
};

// Generate a diverse set of 100 mock products
const MOCK_PRODUCTS: MockProduct[] = generateMockProducts();

export default MOCK_PRODUCTS;