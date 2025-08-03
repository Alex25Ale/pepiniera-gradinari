const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Simple file-based database
const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const ADMIN_FILE = path.join(__dirname, 'data', 'admin.json');
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');

// Ensure data and uploads directories exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Initialize data files if they don't exist
if (!fs.existsSync(DATA_FILE)) {
  const initialProducts = [
    {
      id: 1,
      name: "Royal Palm",
      category: "Palm Trees",
      description: "Majestic royal palm tree, perfect for creating tropical ambiance in your garden",
      price: "€150",
      discountedPrice: null,
      images: ["http://localhost:5000/images/royal-palm.jpg"],
      image: "http://localhost:5000/images/royal-palm.jpg",
      featured: true
    },
    {
      id: 2,
      name: "Christmas Pine",
      category: "Christmas Trees", 
      description: "Fresh Norwegian pine, ideal for Christmas decorations with wonderful aroma",
      price: "€45",
      discountedPrice: "€35",
      images: ["http://localhost:5000/images/christmas-pine.jpg"],
      image: "http://localhost:5000/images/christmas-pine.jpg",
      featured: true
    },
    {
      id: 3,
      name: "Decorative Olive",
      category: "Ornamental Trees",
      description: "Authentic Mediterranean olive tree for elegant garden decoration",
      price: "€120",
      discountedPrice: null,
      images: ["http://localhost:5000/images/olive-tree.jpg"],
      image: "http://localhost:5000/images/olive-tree.jpg",
      featured: true
    },
    {
      id: 4,
      name: "Japanese Maple",
      category: "Ornamental Trees",
      description: "Beautiful red Japanese maple providing stunning autumn colors",
      price: "€100",
      discountedPrice: "€85",
      images: ["http://localhost:5000/images/japanese-maple.jpg"],
      image: "http://localhost:5000/images/japanese-maple.jpg",
      featured: false
    },
    {
      id: 5,
      name: "Phoenix Palm",
      category: "Palm Trees",
      description: "Hardy Phoenix palm perfect for outdoor landscaping",
      price: "€95",
      discountedPrice: null,
      images: ["http://localhost:5000/images/phoenix-palm.jpg"],
      image: "http://localhost:5000/images/phoenix-palm.jpg",
      featured: false
    }
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialProducts, null, 2));
}

if (!fs.existsSync(ADMIN_FILE)) {
  const adminData = {
    username: "admin",
    password: "pepiniera2024" // In production, this should be hashed
  };
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2));
}

if (!fs.existsSync(SETTINGS_FILE)) {
  const defaultSettings = {
    featuredCount: 3,
    aboutContent: {
      title: "Despre Afacerea Noastră de Familie",
      paragraphs: [
        "Bine ați venit la pepiniera noastră de familie, unde cultivăm și oferim arbori decorativi de calitate de peste trei generații. Pasiunea noastră pentru horticultură și dedicarea pentru calitate ne-au făcut un nume de încredere în decorarea grădinilor.",
        "Ne specializăm într-o gamă variată de arbori, incluzând palmieri eleganți, brazi tradiționali de Crăciun, pomi fructiferi ornamentali și specii decorative exotice. Fiecare arbore este selectat cu grijă și îngrijit pentru a aduce frumusețe și bucurie în spațiul dumneavoastră.",
        "Ne mândrim cu serviciul personalizat și sfaturile de expert. Indiferent dacă amenajați o grădină nouă sau căutați bradul perfect de Crăciun, suntem aici să vă ajutăm să găsiți exact ceea ce aveți nevoie."
      ],
      expertiseTitle: "De ce noi?",
      expertise: [
        "🌴 Palmieri - Eleganță tropicală pentru orice grădină",
        "🎄 Brazi de Crăciun - Brazi proaspeți și aromați",
        "🌳 Arbori Ornamentali - Frumusețe pentru grădină tot anul",
        "🌿 Specii Exotice - Arbori unici pentru proiecte speciale"
      ],
      image: ""
    },
    contactInfo: {
      phone: "+40 123 456 789",
      email: "info@pepiniera.ro",
      address: "Str. Gradinarilor nr. 15\nCluj-Napoca, Romania",
      hours: "Monday - Friday: 8:00 - 18:00\nSaturday: 9:00 - 16:00\nSunday: Closed",
      whatsapp: "+40123456789"
    },
    socialLinks: {
      facebook: "",
      instagram: "",
      tiktok: ""
    }
  };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
}

// Helper functions
const readProducts = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeProducts = (products) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
};

const readSettings = () => {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

const writeSettings = (settings) => {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
};

// Routes

// Get all products
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Get featured products
app.get('/api/products/featured', (req, res) => {
  const products = readProducts();
  const settings = readSettings();
  const featuredCount = settings.featuredCount || 3;
  
  // Get products marked as featured first, then fill with recent products if needed
  let featured = products.filter(p => p.featured);
  
  if (featured.length < featuredCount) {
    const remaining = products.filter(p => !p.featured).slice(0, featuredCount - featured.length);
    featured = [...featured, ...remaining];
  }
  
  res.json(featured.slice(0, featuredCount));
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  try {
    const adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
    
    if (username === adminData.username && password === adminData.password) {
      res.json({ 
        success: true, 
        token: 'demo-token-' + Date.now(),
        message: 'Login successful' 
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload image endpoint with optimization
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    const originalPath = req.file.path;
    const optimizedFilename = req.file.filename.replace(/\.[^/.]+$/, '.webp');
    const optimizedPath = path.join('uploads', optimizedFilename);
    
    // Optimize image: convert to WebP, resize if too large, compress
    await sharp(originalPath)
      .resize(800, 800, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .webp({ 
        quality: 85 
      })
      .toFile(optimizedPath);
    
    // Delete original file to save space
    fs.unlinkSync(originalPath);
    
    const imageUrl = `http://localhost:5000/uploads/${optimizedFilename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Image optimization error:', error);
    // Fallback to original file if optimization fails
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  }
});

// Add new product (admin only)
app.post('/api/products', (req, res) => {
  const { name, category, description, price, discountedPrice, images, featured = false } = req.body;
  
  if (!name || !category || !description || !price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const products = readProducts();
  const newProduct = {
    id: Math.max(...products.map(p => p.id), 0) + 1,
    name,
    category,
    description,
    price,
    discountedPrice: discountedPrice || null,
    images: images && images.length > 0 ? images : ['/images/placeholder.jpg'],
    image: images && images.length > 0 ? images[0] : '/images/placeholder.jpg', // Keep for backwards compatibility
    featured
  };
  
  products.push(newProduct);
  writeProducts(products);
  
  res.status(201).json(newProduct);
});

// Update product (admin only)
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const products = readProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  products[index] = { ...products[index], ...req.body, id };
  writeProducts(products);
  
  res.json(products[index]);
});

// Delete product (admin only)
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const products = readProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  
  if (products.length === filteredProducts.length) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  writeProducts(filteredProducts);
  res.json({ message: 'Product deleted successfully' });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  
  // Get notification email from settings
  const settings = readSettings();
  const notificationEmail = settings.contactInfo?.notificationEmail || 'admin@pepiniera.ro';
  
  // Log the submission (in production, you'd use a proper email service like SendGrid, Nodemailer, etc.)
  console.log('=== NEW CONTACT FORM SUBMISSION ===');
  console.log(`To: ${notificationEmail}`);
  console.log(`From: ${name} <${email}>`);
  console.log(`Phone: ${phone}`);
  console.log(`Message: ${message}`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log('===================================');
  
  // In production, you would integrate with an email service here:
  // - Nodemailer with SMTP
  // - SendGrid API
  // - AWS SES
  // - Mailgun
  // etc.
  
  res.json({ 
    message: 'Thank you for your message! We will contact you soon.',
    submitted: true
  });
});

// Get settings
app.get('/api/settings', (req, res) => {
  const settings = readSettings();
  res.json(settings);
});

// Update settings (admin only)
app.put('/api/settings', (req, res) => {
  try {
    const currentSettings = readSettings();
    const updatedSettings = { ...currentSettings, ...req.body };
    writeSettings(updatedSettings);
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings: ' + error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin credentials: admin / pepiniera2024`);
});
