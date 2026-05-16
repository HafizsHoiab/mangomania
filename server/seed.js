require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const Coupon = require('./models/Coupon');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  // Clear existing data
  await Promise.all([User.deleteMany(), Product.deleteMany(), Category.deleteMany(), Order.deleteMany(), Coupon.deleteMany()]);
  console.log('Cleared existing data');

  // Create categories
  const categories = await Category.insertMany([
    { name: 'Mangoes', slug: 'mangoes', icon: '🥭', description: 'Fresh premium mangoes from Multan — Chaunsa, Langra, Sindhri & more' },
    { name: 'Dairy Products', slug: 'dairy-products', icon: '🥛', description: 'Pure desi dairy — lassi, dahi, makkhan, paneer from local farms' },
    { name: 'Multani Halwa', slug: 'multani-halwa', icon: '🍯', description: 'Authentic Multani sohan halwa, rewri, and traditional sweets' },
    { name: 'Desi Items', slug: 'desi-items', icon: '🫙', description: 'Achaar, murabbas, desi spices, and traditional Pakistani pantry items' },
  ]);
  console.log('Categories created');

  const [mangoCat, dairyCat, halwaCat, desiCat] = categories;

  // Create products
  const products = await Product.insertMany([
    // Mangoes
    { name: 'Chaunsa Mango Premium', slug: 'chaunsa-mango-premium', description: 'The king of mangoes — golden, honey-sweet Chaunsa from Multan\'s finest orchards. Handpicked at peak ripeness.', price: 1200, salePrice: 999, category: mangoCat._id, stock: 50, weight: '1 kg', images: [{ url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800', public_id: 'mango1' }], isFeatured: true, tags: ['mango', 'chaunsa', 'fresh', 'premium'], sku: 'MNG-001', variants: [{ label: '1 kg', weight: '1 kg', price: 999, stock: 30 }, { label: '3 kg', weight: '3 kg', price: 2700, stock: 20 }] },
    { name: 'Sindhri Mango', slug: 'sindhri-mango', description: 'Sindhri mango — the sweetest variety with a fiberless, creamy texture. Perfect for eating fresh or making aam ras.', price: 1100, salePrice: 900, category: mangoCat._id, stock: 40, weight: '1 kg', images: [{ url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800', public_id: 'mango2' }], isFeatured: true, tags: ['mango', 'sindhri', 'fresh'], sku: 'MNG-002', variants: [{ label: '1 kg', weight: '1 kg', price: 900, stock: 40 }] },
    { name: 'Langra Mango Box', slug: 'langra-mango-box', description: 'Classic Langra mangoes — slightly tart with a rich aroma. Excellent for aam papad, juice, and pickles.', price: 1500, salePrice: 1299, category: mangoCat._id, stock: 30, weight: '5 kg box', images: [{ url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800', public_id: 'mango3' }], isFeatured: true, tags: ['mango', 'langra', 'box'], sku: 'MNG-003', variants: [{ label: '5 kg box', weight: '5 kg', price: 1299, stock: 30 }] },
    { name: 'Anwar Ratol Mango', slug: 'anwar-ratol-mango', description: 'The miniature gem of mangoes — small, intensely sweet, and incredibly fragrant. A true desi delicacy.', price: 800, salePrice: 699, category: mangoCat._id, stock: 60, weight: '500 g', images: [{ url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800', public_id: 'mango4' }], isFeatured: false, tags: ['mango', 'anwar-ratol', 'premium'], sku: 'MNG-004' },
    { name: 'Dusehri Mango', slug: 'dusehri-mango', description: 'Aromatic Dusehri mangoes from Malihabad — elongated shape with a distinctly sweet taste and thin skin.', price: 950, category: mangoCat._id, stock: 35, weight: '1 kg', images: [{ url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800', public_id: 'mango5' }], isFeatured: false, tags: ['mango', 'dusehri'], sku: 'MNG-005' },

    // Dairy
    { name: 'Desi Lassi (Sweet)', slug: 'desi-lassi-sweet', description: 'Thick, creamy desi lassi made with pure buffalo milk. Sweetened with natural cane sugar. Classic Multani summer drink.', price: 250, salePrice: 199, category: dairyCat._id, stock: 100, weight: '500 ml', images: [{ url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800', public_id: 'dairy1' }], isFeatured: true, tags: ['lassi', 'dairy', 'drink', 'desi'], sku: 'DRY-001', variants: [{ label: '500 ml', weight: '500 ml', price: 199, stock: 60 }, { label: '1 litre', weight: '1 L', price: 350, stock: 40 }] },
    { name: 'Fresh Dahi (Buffalo Curd)', slug: 'fresh-dahi-buffalo-curd', description: 'Rich, creamy dahi set in clay pots. Made from pure desi buffalo milk. Perfect for raita and biryani.', price: 350, category: dairyCat._id, stock: 80, weight: '1 kg', images: [{ url: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=800', public_id: 'dairy2' }], isFeatured: true, tags: ['dahi', 'curd', 'dairy', 'desi'], sku: 'DRY-002' },
    { name: 'Desi Makkhan (Butter)', slug: 'desi-makkhan-butter', description: 'Hand-churned pure desi makkhan from fresh cream. No preservatives, no additives — just pure golden butter.', price: 800, salePrice: 699, category: dairyCat._id, stock: 50, weight: '500 g', images: [{ url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800', public_id: 'dairy3' }], isFeatured: false, tags: ['makkhan', 'butter', 'desi', 'dairy'], sku: 'DRY-003' },
    { name: 'Fresh Paneer', slug: 'fresh-paneer', description: 'Soft, crumbly fresh paneer made daily from whole milk. Perfect for karahi, palak paneer, and desserts.', price: 600, category: dairyCat._id, stock: 40, weight: '500 g', images: [{ url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800', public_id: 'dairy4' }], isFeatured: false, tags: ['paneer', 'dairy', 'fresh'], sku: 'DRY-004' },

    // Halwa
    { name: 'Multani Sohan Halwa (Classic)', slug: 'multani-sohan-halwa-classic', description: 'The iconic Multani sohan halwa — crispy, caramelized, loaded with dried fruits. A Multan gift box classic since generations.', price: 1800, salePrice: 1599, category: halwaCat._id, stock: 60, weight: '500 g', images: [{ url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', public_id: 'halwa1' }], isFeatured: true, tags: ['sohan halwa', 'multani', 'sweet', 'gift'], sku: 'HLW-001', variants: [{ label: '500 g tin', weight: '500 g', price: 1599, stock: 40 }, { label: '1 kg box', weight: '1 kg', price: 2999, stock: 20 }] },
    { name: 'Sohan Halwa Gift Box (Premium)', slug: 'sohan-halwa-gift-box-premium', description: 'Premium Multani sohan halwa in an elegant wooden gift box — perfect for Eid gifts, weddings, and corporate gifting.', price: 3500, salePrice: 2999, category: halwaCat._id, stock: 25, weight: '1 kg', images: [{ url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800', public_id: 'halwa2' }], isFeatured: true, tags: ['sohan halwa', 'gift box', 'premium', 'eid'], sku: 'HLW-002' },
    { name: 'Multani Rewri', slug: 'multani-rewri', description: 'Traditional sesame seed rewri — sweet, crunchy and irresistible. A winter favorite from the streets of Multan.', price: 450, category: halwaCat._id, stock: 90, weight: '250 g', images: [{ url: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800', public_id: 'halwa3' }], isFeatured: false, tags: ['rewri', 'sesame', 'traditional', 'winter'], sku: 'HLW-003' },

    // Desi Items
    { name: 'Aam Ka Achaar (Mango Pickle)', slug: 'aam-ka-achaar-mango-pickle', description: 'Homemade Multani aam ka achaar — sun-dried raw mangoes pickled with mustard seeds, red chili, and pure mustard oil.', price: 500, salePrice: 429, category: desiCat._id, stock: 120, weight: '500 g', images: [{ url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800', public_id: 'desi1' }], isFeatured: true, tags: ['achaar', 'pickle', 'mango', 'homemade'], sku: 'DSI-001', variants: [{ label: '500 g', weight: '500 g', price: 429, stock: 70 }, { label: '1 kg', weight: '1 kg', price: 799, stock: 50 }] },
    { name: 'Mixed Vegetable Achaar', slug: 'mixed-vegetable-achaar', description: 'Classic desi mixed achaar with carrots, turnip, cauliflower in spiced mustard oil. Grandma\'s secret recipe.', price: 450, category: desiCat._id, stock: 80, weight: '500 g', images: [{ url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', public_id: 'desi2' }], isFeatured: false, tags: ['achaar', 'pickle', 'mixed', 'vegetables'], sku: 'DSI-002' },
    { name: 'Aam Ka Murabba', slug: 'aam-ka-murabba', description: 'Tender raw mango pieces preserved in thick sugar syrup — a traditional Pakistani breakfast condiment.', price: 650, salePrice: 549, category: desiCat._id, stock: 70, weight: '500 g', images: [{ url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800', public_id: 'desi3' }], isFeatured: true, tags: ['murabba', 'mango', 'sweet', 'traditional'], sku: 'DSI-003' },
    { name: 'Desi Masala Blend (Biryani)', slug: 'desi-masala-blend-biryani', description: 'Authentic Multani biryani masala — a secret blend of 22 whole spices, freshly ground for maximum aroma and flavor.', price: 350, category: desiCat._id, stock: 150, weight: '200 g', images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', public_id: 'desi4' }], isFeatured: false, tags: ['masala', 'spices', 'biryani', 'desi'], sku: 'DSI-005' },
    { name: 'Karela Ka Achaar', slug: 'karela-ka-achaar', description: 'Bitter gourd pickle — an acquired taste that\'s absolutely addictive. Made with traditional Multani spices.', price: 399, category: desiCat._id, stock: 60, weight: '500 g', images: [{ url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', public_id: 'desi5' }], isFeatured: false, tags: ['achaar', 'karela', 'bitter gourd', 'pickle'], sku: 'DSI-006' },
    { name: 'Desi Ghee (Pure)', slug: 'desi-ghee-pure', description: 'Clarified butter made from pure desi cow milk. Slow-cooked to golden perfection. No additives, no blending.', price: 2200, salePrice: 1999, category: desiCat._id, stock: 45, weight: '1 kg', images: [{ url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800', public_id: 'desi6' }], isFeatured: true, tags: ['ghee', 'desi', 'pure', 'cooking'], sku: 'DSI-007', variants: [{ label: '500 g', weight: '500 g', price: 1099, stock: 25 }, { label: '1 kg', weight: '1 kg', price: 1999, stock: 20 }] },
    { name: 'Imli Ki Chutney', slug: 'imli-ki-chutney', description: 'Sweet and tangy tamarind chutney — the perfect dip for samosas, dahi bhallay, and chaat. Thick, flavorful and addictive.', price: 280, category: desiCat._id, stock: 100, weight: '300 g', images: [{ url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800', public_id: 'desi8' }], isFeatured: false, tags: ['chutney', 'imli', 'tamarind', 'desi'], sku: 'DSI-008' },
    { name: 'Lemon Pickle (Nimbu Achaar)', slug: 'lemon-pickle-nimbu-achaar', description: 'Tangy, spicy lemon pickle preserved in brine and spices. A traditional staple for every Pakistani lunch table.', price: 320, category: desiCat._id, stock: 85, weight: '500 g', images: [{ url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800', public_id: 'desi9' }], isFeatured: false, tags: ['achaar', 'lemon', 'nimbu', 'pickle'], sku: 'DSI-009' },
  ]);
  console.log(`Created ${products.length} products`);

  // Create coupons
  await Coupon.insertMany([
    { code: 'MANGO20', discountType: 'percent', discount: 20, minOrder: 1000, maxUses: 100, expiry: new Date('2026-12-31'), description: '20% off on orders above Rs. 1,000' },
    { code: 'FREESHIP', discountType: 'flat', discount: 200, minOrder: 500, maxUses: 50, expiry: new Date('2026-12-31'), description: 'Free delivery on orders above Rs. 500' },
    { code: 'WELCOME10', discountType: 'percent', discount: 10, minOrder: 0, maxUses: 200, expiry: new Date('2026-12-31'), description: '10% off for new customers' },
  ]);
  console.log('Coupons created');

  // Create admin user
  const adminUser = await User.create({
    name: 'Mango Mania Admin',
    email: 'admin@mangomania.pk',
    phone: '+92-61-1234567',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
  });

  // Create sample customers
  const customerData = [
    { name: 'Ahmed Hassan', email: 'ahmed@example.com', phone: '+92-300-1234567' },
    { name: 'Fatima Malik', email: 'fatima@example.com', phone: '+92-321-2345678' },
    { name: 'Usman Ali', email: 'usman@example.com', phone: '+92-333-3456789' },
    { name: 'Sara Khan', email: 'sara@example.com', phone: '+92-345-4567890' },
    { name: 'Bilal Asghar', email: 'bilal@example.com', phone: '+92-311-5678901' },
  ];
  const customers = await User.insertMany(customerData.map(c => ({ ...c, password: 'customer123', isVerified: true })));
  console.log('Users created');

  // Create sample orders
  const sampleOrders = [
    {
      user: customers[0]._id,
      items: [{ product: products[0]._id, name: products[0].name, image: products[0].images[0]?.url, qty: 2, price: 999 }],
      shippingAddress: { name: 'Ahmed Hassan', phone: '+92-300-1234567', street: 'House 12, Hussain Agahi', city: 'Multan', province: 'Punjab', postalCode: '60000' },
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'delivered',
      totalAmount: 2198,
      deliveryCharge: 200,
      statusHistory: [{ status: 'pending' }, { status: 'confirmed' }, { status: 'packed' }, { status: 'dispatched' }, { status: 'delivered' }],
    },
    {
      user: customers[1]._id,
      items: [{ product: products[9]._id, name: products[9].name, image: products[9].images[0]?.url, qty: 1, price: 1599 }, { product: products[12]._id, name: products[12].name, qty: 2, price: 429 }],
      shippingAddress: { name: 'Fatima Malik', phone: '+92-321-2345678', street: 'Street 5, Shah Rukn-e-Alam Colony', city: 'Multan', province: 'Punjab' },
      paymentMethod: 'jazzcash',
      paymentStatus: 'paid',
      orderStatus: 'dispatched',
      totalAmount: 2657,
      deliveryCharge: 200,
      discount: 0,
      rider: { name: 'Rashid Ahmed', phone: '+92-300-9999888' },
      statusHistory: [{ status: 'pending' }, { status: 'confirmed' }, { status: 'packed' }, { status: 'dispatched' }],
    },
    {
      user: customers[2]._id,
      items: [{ product: products[5]._id, name: products[5].name, qty: 3, price: 199 }],
      shippingAddress: { name: 'Usman Ali', phone: '+92-333-3456789', street: 'Flat 3, Model Town A', city: 'Multan', province: 'Punjab' },
      paymentMethod: 'easypaisa',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      totalAmount: 797,
      deliveryCharge: 200,
      statusHistory: [{ status: 'pending' }, { status: 'confirmed' }],
    },
    {
      user: customers[3]._id,
      items: [{ product: products[16]._id, name: products[16].name, qty: 1, price: 1999 }],
      shippingAddress: { name: 'Sara Khan', phone: '+92-345-4567890', street: 'House 7, Bosan Road', city: 'Multan', province: 'Punjab' },
      paymentMethod: 'card',
      paymentStatus: 'paid',
      orderStatus: 'packed',
      totalAmount: 1999,
      deliveryCharge: 0,
      statusHistory: [{ status: 'pending' }, { status: 'confirmed' }, { status: 'packed' }],
    },
    {
      user: customers[4]._id,
      items: [{ product: products[1]._id, name: products[1].name, qty: 2, price: 900 }, { product: products[11]._id, name: products[11].name, qty: 1, price: 549 }],
      shippingAddress: { name: 'Bilal Asghar', phone: '+92-311-5678901', street: 'House 22, Cantt Area', city: 'Multan', province: 'Punjab' },
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      totalAmount: 2349,
      deliveryCharge: 0,
      statusHistory: [{ status: 'pending', message: 'Order placed' }],
    },
  ];

  await Order.insertMany(sampleOrders);
  console.log('Sample orders created');

  console.log('\n🥭 Seed completed successfully!');
  console.log('Admin: admin@mangomania.pk / admin123');
  console.log('Coupons: MANGO20, FREESHIP, WELCOME10');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
