import { Product } from '../types';

// Categories
const CATEGORIES = [
  'electronics',
  'clothing',
  'home',
  'beauty',
  'sports',
  'books',
  'toys',
  'jewelry',
  'automotive',
  'grocery',
  'office',
  'health',
  'garden',
  'pets',
  'baby',
];

// Price ranges
const PRICE_RANGES = [
  'under-50',
  '50-100',
  '100-200',
  '200-500',
  '500-1000',
  'over-1000'
];

// Brands by category
const BRANDS: Record<string, string[]> = {
  electronics: ['Apple', 'Samsung', 'Sony', 'Bose', 'LG', 'Microsoft', 'Dell', 'HP', 'Logitech', 'Razer', 'Asus', 'Acer', 'Lenovo'],
  clothing: ['Nike', 'Adidas', 'Levi\'s', 'H&M', 'Zara', 'Under Armour', 'Gap', 'Calvin Klein', 'Ralph Lauren', 'Tommy Hilfiger'],
  home: ['IKEA', 'Crate & Barrel', 'West Elm', 'Wayfair', 'Ashley Furniture', 'KitchenAid', 'Dyson', 'Pottery Barn', 'Casper'],
  beauty: ['L\'Oréal', 'Estée Lauder', 'Maybelline', 'MAC', 'Dove', 'Neutrogena', 'Olay', 'Clinique', 'CeraVe', 'La Roche-Posay'],
  sports: ['Nike', 'Adidas', 'Under Armour', 'Puma', 'New Balance', 'Wilson', 'Callaway', 'The North Face', 'Columbia', 'Yeti'],
  books: ['Penguin Random House', 'HarperCollins', 'Simon & Schuster', 'Macmillan', 'Scholastic', 'Hachette', 'Wiley', 'O\'Reilly'],
  toys: ['LEGO', 'Hasbro', 'Mattel', 'Fisher-Price', 'Disney', 'Nintendo', 'Playmobil', 'Melissa & Doug', 'Hot Wheels'],
  jewelry: ['Tiffany & Co', 'Pandora', 'Swarovski', 'Cartier', 'Rolex', 'Kay Jewelers', 'David Yurman', 'Zales', 'Blue Nile'],
  automotive: ['Michelin', 'Bosch', 'Meguiar\'s', 'Mobil', 'Castrol', 'Armor All', 'Stanley', 'Thule', 'WeatherTech'],
  grocery: ['Whole Foods', 'Trader Joe\'s', 'Kellogg\'s', 'Nestlé', 'General Mills', 'Kraft', 'Heinz', 'Pepsi', 'Coca-Cola'],
  office: ['Staples', 'HP', 'Canon', 'Epson', 'Brother', 'Moleskine', 'Sharpie', 'Post-it', '3M', 'Avery'],
  health: ['Johnson & Johnson', 'CVS Health', 'Walgreens', 'Centrum', 'One A Day', 'Nature Made', 'Advil', 'Tylenol'],
  garden: ['Scotts', 'Miracle-Gro', 'Fiskars', 'Weber', 'DeWalt', 'Black+Decker', 'Craftsman', 'Husqvarna', 'Troy-Bilt'],
  pets: ['Purina', 'Pedigree', 'Royal Canin', 'Blue Buffalo', 'Hill\'s', 'Kong', 'PetSafe', 'Greenies', 'Friskies'],
  baby: ['Pampers', 'Huggies', 'Johnson\'s', 'Gerber', 'Graco', 'Fisher-Price', 'Carter\'s', 'Enfamil', 'Similac']
};

// Product names by category
const PRODUCT_NAMES: Record<string, string[]> = {
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
    'External SSD',
    'Smart TV',
    'Tablet Pro',
    'Noise-Cancelling Earphones',
    'Gaming Console',
    'VR Headset',
    'Digital Camera',
    'Portable Charger',
    'Smart Home Hub',
    'Streaming Stick',
    'Wi-Fi Router'
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
    'Fashion Watch',
    'Silk Tie',
    'Casual Pants',
    'Hoodie',
    'Leather Belt',
    'Wool Socks',
    'Rain Jacket',
    'Summer Dress',
    'Beanie Hat',
    'Swim Trunks',
    'Polo Shirt'
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
    'Smart Light Bulbs',
    'Cast Iron Skillet',
    'Blender',
    'Toaster Oven',
    'Food Processor',
    'Espresso Machine',
    'Dutch Oven',
    'Area Rug',
    'Throw Pillows',
    'Blackout Curtains',
    'Floor Lamp'
  ],
  beauty: [
    'Facial Cleanser',
    'Anti-Aging Serum',
    'Moisturizer',
    'Foundation',
    'Lipstick',
    'Mascara',
    'Eyeshadow Palette',
    'Hair Dryer',
    'Curling Iron',
    'Shampoo',
    'Conditioner',
    'Hair Serum',
    'Body Lotion',
    'Perfume',
    'Cologne',
    'Face Mask',
    'Exfoliator',
    'Makeup Remover',
    'Eyeliner',
    'Concealer'
  ],
  sports: [
    'Yoga Mat',
    'Dumbbells',
    'Resistance Bands',
    'Treadmill',
    'Exercise Bike',
    'Kettlebell',
    'Tennis Racket',
    'Basketball',
    'Soccer Ball',
    'Golf Clubs Set',
    'Hiking Backpack',
    'Camping Tent',
    'Sleeping Bag',
    'Fishing Rod',
    'Mountain Bike',
    'Sports Water Bottle',
    'Running Jacket',
    'Compression Shorts',
    'Fitness Gloves',
    'Jump Rope'
  ],
  books: [
    'Bestselling Novel',
    'Cookbook',
    'Biography',
    'Self-Help Book',
    'Science Fiction',
    'Fantasy Series',
    'History Book',
    'Business Guide',
    'Travel Guidebook',
    'Children\'s Picture Book',
    'Young Adult Novel',
    'Graphic Novel',
    'Poetry Collection',
    'Reference Book',
    'Mystery Thriller',
    'Classic Literature',
    'Memoir',
    'Art Book',
    'Psychology Book',
    'Philosophy Text'
  ],
  toys: [
    'Building Blocks Set',
    'Remote Control Car',
    'Dollhouse',
    'Board Game',
    'Action Figure',
    'Stuffed Animal',
    'Educational Toy',
    'Puzzle',
    'Art Kit',
    'Science Kit',
    'Video Game',
    'Card Game',
    'Outdoor Play Equipment',
    'Model Kit',
    'Drone',
    'Magic Kit',
    'Musical Instrument',
    'Robot Toy',
    'Play Dough Set',
    'Train Set'
  ],
  jewelry: [
    'Diamond Earrings',
    'Gold Necklace',
    'Silver Bracelet',
    'Engagement Ring',
    'Wedding Band',
    'Pearl Necklace',
    'Stud Earrings',
    'Charm Bracelet',
    'Pendant Necklace',
    'Gemstone Ring',
    'Luxury Watch',
    'Cufflinks',
    'Anklet',
    'Brooch',
    'Hoop Earrings',
    'Tennis Bracelet',
    'Birthstone Jewelry',
    'Statement Necklace',
    'Eternity Band',
    'Cocktail Ring'
  ],
  automotive: [
    'Car Wax',
    'Tire Pressure Gauge',
    'Car Cover',
    'Floor Mats',
    'Dash Cam',
    'Jump Starter',
    'Car Vacuum',
    'Air Freshener',
    'Car Phone Mount',
    'Car Wiper Blades',
    'Engine Oil',
    'Tire Inflator',
    'Car Battery',
    'Car Seat Covers',
    'Steering Wheel Cover',
    'Car GPS',
    'Headlight Bulbs',
    'Car Tool Kit',
    'Car First Aid Kit',
    'Car Wash Kit'
  ],
  grocery: [
    'Organic Coffee',
    'Extra Virgin Olive Oil',
    'Artisan Bread',
    'Premium Chocolate',
    'Specialty Tea',
    'Gourmet Pasta',
    'Organic Honey',
    'Aged Balsamic Vinegar',
    'Artisanal Cheese',
    'Grass-Fed Beef',
    'Organic Granola',
    'Cold-Pressed Juice',
    'Gluten-Free Flour',
    'Plant-Based Protein',
    'Organic Wine',
    'Craft Beer',
    'Spice Set',
    'Dried Fruits Mix',
    'Nut Butter',
    'Gourmet Sauce'
  ],
  office: [
    'Ergonomic Office Chair',
    'Multi-Function Printer',
    'Desk Organizer',
    'Document Scanner',
    'Portable Projector',
    'Paper Shredder',
    'Standing Desk Converter',
    'Wireless Presenter',
    'Business Card Holder',
    'Whiteboard',
    'Desktop Monitor Stand',
    'Premium Notebook',
    'Fountain Pen',
    'Desk Lamp',
    'Filing Cabinet',
    'Desk Calendar',
    'USB Flash Drive',
    'Ergonomic Mouse',
    'Keyboard Wrist Rest',
    'Stapler Set'
  ],
  health: [
    'Digital Thermometer',
    'Blood Pressure Monitor',
    'Vitamin D Supplement',
    'Probiotics',
    'Essential Oil Diffuser',
    'Resistance Bands',
    'Meditation Cushion',
    'Yoga Block',
    'First Aid Kit',
    'Sleep Aid',
    'Foot Massager',
    'Heating Pad',
    'Massage Gun',
    'Fitness Tracker',
    'Smart Scale',
    'Humidifier',
    'Air Quality Monitor',
    'Pill Organizer',
    'Compression Socks',
    'Foam Roller'
  ],
  garden: [
    'Garden Tool Set',
    'Plant Pots',
    'Compost Bin',
    'Raised Garden Bed',
    'Garden Hose',
    'Pruning Shears',
    'Gardening Gloves',
    'Bird Feeder',
    'Watering Can',
    'Lawn Mower',
    'Outdoor Solar Lights',
    'Hedge Trimmer',
    'Garden Kneeler',
    'Plant Seeds',
    'Potting Soil',
    'Plant Food',
    'Garden Bench',
    'Greenhouse',
    'Garden Statue',
    'Wind Chimes'
  ],
  pets: [
    'Pet Bed',
    'Dog Collar',
    'Cat Tree',
    'Pet Carrier',
    'Dog Leash',
    'Pet Food Bowl',
    'Interactive Pet Toy',
    'Pet Grooming Kit',
    'Cat Litter Box',
    'Pet Shampoo',
    'Dog Treats',
    'Cat Treats',
    'Pet Water Fountain',
    'Pet GPS Tracker',
    'Pet Camera',
    'Pet Stairs',
    'Aquarium Kit',
    'Pet Clothing',
    'Pet First Aid Kit',
    'Automatic Pet Feeder'
  ],
  baby: [
    'Baby Monitor',
    'Diaper Bag',
    'Baby Carrier',
    'Stroller',
    'Car Seat',
    'Crib',
    'Baby Bottle Set',
    'High Chair',
    'Baby Swing',
    'Changing Table',
    'Baby Bathtub',
    'Baby Thermometer',
    'Nursing Pillow',
    'Breast Pump',
    'Baby Food Maker',
    'Pacifiers',
    'Baby Toys',
    'Baby Clothes Set',
    'Baby Mobile',
    'Baby Books'
  ]
};

// Unsplash image collections by category
const UNSPLASH_COLLECTIONS: Record<string, string[]> = {
  electronics: [
    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&auto=format',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format',
    'https://images.unsplash.com/photo-1546027658-7aa750153465?w=500&auto=format',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format',
    'https://images.unsplash.com/photo-1595941069915-4ebc5197c14a?w=500&auto=format',
    'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=500&auto=format',
    'https://images.unsplash.com/photo-1546435770-a3e5a7e13f42?w=500&auto=format',
    'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format'
  ],
  clothing: [
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&auto=format',
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=500&auto=format',
    'https://images.unsplash.com/photo-1560060141-7b9018741ced?w=500&auto=format',
    'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500&auto=format',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&auto=format',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format',
    'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=500&auto=format'
  ],
  home: [
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500&auto=format',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&auto=format',
    'https://images.unsplash.com/photo-1595514535215-95c3be89b30f?w=500&auto=format',
    'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=500&auto=format',
    'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=500&auto=format',
    'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=500&auto=format',
    'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=500&auto=format',
    'https://images.unsplash.com/photo-1584346133934-2a9cd1d4af99?w=500&auto=format',
    'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=500&auto=format',
    'https://images.unsplash.com/photo-1559599238-308793637427?w=500&auto=format'
  ],
  beauty: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format',
    'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=500&auto=format',
    'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500&auto=format',
    'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500&auto=format',
    'https://images.unsplash.com/photo-1620916566256-4aabf1a4e407?w=500&auto=format',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format',
    'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&auto=format',
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format'
  ],
  sports: [
    'https://images.unsplash.com/photo-1517343985841-f8b2d66e010b?w=500&auto=format',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format',
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&auto=format',
    'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=500&auto=format',
    'https://images.unsplash.com/photo-1576861232052-66f467a5d157?w=500&auto=format',
    'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=500&auto=format',
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500&auto=format',
    'https://images.unsplash.com/photo-1574791321466-a7dca8ec4c13?w=500&auto=format',
    'https://images.unsplash.com/photo-1595435742656-5070ad781f53?w=500&auto=format',
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500&auto=format'
  ],
  books: [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format',
    'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=500&auto=format',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format',
    'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=500&auto=format',
    'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=500&auto=format',
    'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&auto=format',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&auto=format',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format'
  ],
  toys: [
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&auto=format',
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500&auto=format',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format',
    'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=500&auto=format',
    'https://images.unsplash.com/photo-1595348020949-87cdfbb44174?w=500&auto=format',
    'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=500&auto=format',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format',
    'https://images.unsplash.com/photo-1517242810446-cc8951b2be40?w=500&auto=format',
    'https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=500&auto=format',
    'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?w=500&auto=format'
  ],
  jewelry: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format',
    'https://images.unsplash.com/photo-1586104195538-050b9f74a10b?w=500&auto=format',
    'https://images.unsplash.com/photo-1582620621917-72ca7080de09?w=500&auto=format',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format',
    'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=500&auto=format',
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&auto=format',
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&auto=format',
    'https://images.unsplash.com/photo-1627293509201-b4400abed73e?w=500&auto=format',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&auto=format',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format'
  ],
  automotive: [
    'https://images.unsplash.com/photo-1596637510451-78a5e76953da?w=500&auto=format',
    'https://images.unsplash.com/photo-1622185135505-2d795003994a?w=500&auto=format',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500&auto=format',
    'https://images.unsplash.com/photo-1571819377727-3500cf5fc350?w=500&auto=format',
    'https://images.unsplash.com/photo-1616454880440-a11f0b357c33?w=500&auto=format',
    'https://images.unsplash.com/photo-1546545331-85a7c934cca0?w=500&auto=format',
    'https://images.unsplash.com/photo-1555626906-fcf10d6851b4?w=500&auto=format',
    'https://images.unsplash.com/photo-1562714529-89f8946abe9e?w=500&auto=format',
    'https://images.unsplash.com/photo-1558449289-408a87f9a088?w=500&auto=format',
    'https://images.unsplash.com/photo-1560574188-6a6774965120?w=500&auto=format'
  ],
  grocery: [
    'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=500&auto=format',
    'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&auto=format',
    'https://images.unsplash.com/photo-1583095117956-3cd98734b7c4?w=500&auto=format',
    'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&auto=format',
    'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=500&auto=format',
    'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=500&auto=format',
    'https://images.unsplash.com/photo-1598286555304-136f0b3c2df4?w=500&auto=format',
    'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500&auto=format',
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&auto=format',
    'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500&auto=format'
  ],
  office: [
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&auto=format',
    'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=500&auto=format',
    'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format',
    'https://images.unsplash.com/photo-1596079890744-c1a0462d0975?w=500&auto=format',
    'https://images.unsplash.com/photo-1517148892120-4d2da39c8dc1?w=500&auto=format',
    'https://images.unsplash.com/photo-1618558108401-84e6f84852e5?w=500&auto=format',
    'https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?w=500&auto=format',
    'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=500&auto=format',
    'https://images.unsplash.com/photo-1576705899280-a7f7d3b406f1?w=500&auto=format',
    'https://images.unsplash.com/photo-1616070320399-2174fb492dd8?w=500&auto=format'
  ],
  health: [
    'https://images.unsplash.com/photo-1616117513880-f07935949dce?w=500&auto=format',
    'https://images.unsplash.com/photo-1624969862644-791f3dc98927?w=500&auto=format',
    'https://images.unsplash.com/photo-1538935732373-f7a495fea3f6?w=500&auto=format',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format',
    'https://images.unsplash.com/photo-1546552768-f0a81a0f6b37?w=500&auto=format',
    'https://images.unsplash.com/photo-1577301656525-dced3dbdbd8c?w=500&auto=format',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&auto=format',
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format',
    'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=500&auto=format'
  ],
  garden: [
    'https://images.unsplash.com/photo-1599755043181-5c138998a002?w=500&auto=format',
    'https://images.unsplash.com/photo-1566938064504-a379175163de?w=500&auto=format',
    'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=500&auto=format',
    'https://images.unsplash.com/photo-1617957689233-207e3cd3c610?w=500&auto=format',
    'https://images.unsplash.com/photo-1621930599436-f204d074cce2?w=500&auto=format',
    'https://images.unsplash.com/photo-1562864758-143c64c939c6?w=500&auto=format',
    'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=500&auto=format',
    'https://images.unsplash.com/photo-1571192776145-9f563c1df686?w=500&auto=format',
    'https://images.unsplash.com/photo-1621814374283-56b84bba5559?w=500&auto=format',
    'https://images.unsplash.com/photo-1598902105045-28eb98e495a1?w=500&auto=format'
  ],
  pets: [
    'https://images.unsplash.com/photo-1601758124331-9433d47aae55?w=500&auto=format',
    'https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?w=500&auto=format',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format',
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format',
    'https://images.unsplash.com/photo-1599839238978-3c1068369a87?w=500&auto=format',
    'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=500&auto=format',
    'https://images.unsplash.com/photo-1567008252145-4b50456fd00c?w=500&auto=format',
    'https://images.unsplash.com/photo-1617895153857-82fe79adfcd4?w=500&auto=format',
    'https://images.unsplash.com/photo-1607923432780-7a9c30adcb72?w=500&auto=format',
    'https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=500&auto=format'
  ],
  baby: [
    'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&auto=format',
    'https://images.unsplash.com/photo-1548679736-b5a44a9e2d2c?w=500&auto=format',
    'https://images.unsplash.com/photo-1590511642775-865889a621a3?w=500&auto=format',
    'https://images.unsplash.com/photo-1611249020068-18b157c13dca?w=500&auto=format',
    'https://images.unsplash.com/photo-1606142634332-90cf65178537?w=500&auto=format',
    'https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?w=500&auto=format',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&auto=format',
    'https://images.unsplash.com/photo-1586684075772-050af0180077?w=500&auto=format',
    'https://images.unsplash.com/photo-1580377968131-bac541d20b91?w=500&auto=format',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format'
  ]
};

// Helper function to generate random prices within ranges
const getPriceInRange = (range: string): number => {
  switch (range) {
    case 'under-50':
      return Math.floor(Math.random() * 49) + 1;
    case '50-100':
      return Math.floor(Math.random() * 50) + 50;
    case '100-200':
      return Math.floor(Math.random() * 100) + 100;
    case '200-500':
      return Math.floor(Math.random() * 300) + 200;
    case '500-1000':
      return Math.floor(Math.random() * 500) + 500;
    case 'over-1000':
      return Math.floor(Math.random() * 4000) + 1000;
    default:
      return Math.floor(Math.random() * 999) + 1;
  }
};

// Function to generate a rating between 3.0 and 5.0 with one decimal place
const generateRating = (): number => {
  return parseFloat((Math.random() * 2 + 3).toFixed(1));
};

// Function to get a random price range label based on a price
const getPriceRangeLabel = (price: number): string => {
  if (price < 50) return 'under-50';
  if (price < 100) return '50-100';
  if (price < 200) return '100-200';
  if (price < 500) return '200-500';
  if (price < 1000) return '500-1000';
  return 'over-1000';
};

// Generate 300+ unique products
const generateProducts = (): any[] => {
  const products = [];
  let idCounter = 1;

  // Create products for each category
  for (const category of CATEGORIES) {
    const productNames = PRODUCT_NAMES[category] || [];
    const brands = BRANDS[category] || [];
    const images = UNSPLASH_COLLECTIONS[category] || [];

    // Generate multiple products for each product name in the category
    for (const baseName of productNames) {
      // Generate 1-3 products per base name with different brands/variations
      const variations = Math.floor(Math.random() * 2) + 1;
      
      for (let v = 0; v < variations; v++) {
        // Get a random brand for this product
        const brand = brands[Math.floor(Math.random() * brands.length)];
        
        // Generate a product name with brand and optional model/version
        const nameSuffix = v > 0 ? ` ${['Pro', 'Plus', 'Ultra', 'Max', 'Premium', 'Elite'][Math.floor(Math.random() * 6)]}` : '';
        const name = `${brand} ${baseName}${nameSuffix}`;
        
        // Get random price range and generate price within that range
        const priceRange = PRICE_RANGES[Math.floor(Math.random() * PRICE_RANGES.length)];
        const price = getPriceInRange(priceRange);
        
        // Random discount (0-30%)
        const hasDiscount = Math.random() > 0.6;
        const discount = hasDiscount ? Math.floor(Math.random() * 30) + 1 : 0;
        
        // Random inventory status
        const inStock = Math.random() > 0.1;
        
        // Random image from the category collection
        const image = images[Math.floor(Math.random() * images.length)];
        
        // Generate description based on category and product
        const descriptionParts = [
          `Premium ${category} product from ${brand}.`,
          `Features high-quality materials and craftsmanship.`,
          `Perfect for everyday use or special occasions.`,
          `Designed with the modern consumer in mind.`,
          `Backed by ${brand}'s quality guarantee.`
        ];
        const description = descriptionParts[Math.floor(Math.random() * descriptionParts.length)];
        
        // Generate tags
        const allTags = [
          'premium', 'bestseller', 'new-arrival', 'limited-edition', 'eco-friendly',
          'handmade', 'organic', 'sustainable', 'vegan', 'cruelty-free',
          'exclusive', 'trending', 'sale', 'gift-idea', 'customizable',
          brand.toLowerCase(), category, priceRange
        ];
        
        const numTags = Math.floor(Math.random() * 4) + 2;
        const tags: string[] = [];
        for (let i = 0; i < numTags; i++) {
          const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
          if (!tags.includes(randomTag)) {
            tags.push(randomTag);
          }
        }
        
        // Random number of reviews
        const reviews = Math.floor(Math.random() * 500);
        
        // Create product object
        products.push({
          id: String(idCounter++),
          name,
          description,
          price,
          image,
          rating: generateRating(),
          category,
          brand,
          inStock,
          discount,
          tags,
          reviews,
          priceRange: getPriceRangeLabel(price)
        });
      }
    }
  }

  return products;
};

export const EXTENDED_PRODUCTS = generateProducts();