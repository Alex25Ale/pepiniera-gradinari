const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || 'https://pepiniera-gradinari-production.up.railway.app';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Simple file-based database
const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const ADMIN_FILE = path.join(__dirname, 'data', 'admin.json');
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');

// Function to generate URL-friendly slugs from Romanian text
function generateSlug(text) {
  return text
    .toLowerCase()
    // Replace Romanian special characters
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    // Remove any non-alphanumeric characters except hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace spaces and multiple hyphens with single hyphen
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
}

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
  // Initialize with empty products array
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Migration: Add slugs to existing products that don't have them
function migrateProductSlugs() {
  try {
    const products = readProducts();
    let needsUpdate = false;
    
    products.forEach(product => {
      if (!product.slug && product.name) {
        product.slug = generateSlug(product.name);
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      writeProducts(products);
      console.log('✅ Product slugs migration completed');
    }
  } catch (error) {
    console.error('Error during product slugs migration:', error);
  }
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
    homeContent: {
      heroTitle: "Transformă-ți Grădina",
      heroSubtitle: "Arbori decorativi de calitate, palmieri și brazi de Crăciun pentru orice ocazie",
      heroButton: "Explorează Colecția Noastră",
      featuredTitle: "Favoriții Grădinii",
      contactButton: "Vezi Detalii de Contact"
    },
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
    },
    seoSettings: {
      homePage: {
        title: "Pepiniera Grădinari - Arbori Decorativi, Palmieri și Brazi de Crăciun | România",
        description: "Transformă-ți grădina cu arbori decorativi de calitate de la Pepiniera Grădinari. Specializați în palmieri, brazi de Crăciun, pomi fructiferi și amenajare grădini în România.",
        keywords: "arbori decorativi românia, palmieri pentru gradina, brazi craciunn, pomi fructiferi, amenajare peisagistica"
      },
      aboutPage: {
        title: "Despre Noi - Pepiniera de Familie cu Tradiție | Pepiniera Grădinari",
        description: "Afacere de familie cu peste trei generații de experiență în cultivarea arborilor decorativi. Specializați în palmieri, brazi de Crăciun și amenajare grădini în România.",
        keywords: "pepiniera de familie, experienta in gradinarii, traditie, cultivatori arbori"
      },
      productsPage: {
        title: "Produse - Arbori Decorativi și Plante Ornamentale | Pepiniera Grădinari", 
        description: "Descoperă gama completă de arbori decorativi, palmieri, brazi de Crăciun și plante ornamentale de la Pepiniera Grădinari. Calitate garantată și preturi avantajoase în România.",
        keywords: "catalog produse, arbori decorativi preturi, palmieri de vanzare, brazi craciunnn preturi"
      },
      contactPage: {
        title: "Contact - Pepiniera Grădinari | Comandă Arbori Decorativi Online",
        description: "Contactează Pepiniera Grădinari pentru oferte personalizate la arbori decorativi, palmieri și brazi de Crăciun. Telefon, email și locația noastră în România.",
        keywords: "contact pepiniera, comanda arbori, telefon pepiniera, adresa pepiniera"
      }
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

// Run migrations
migrateProductSlugs();

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

// Get single product by slug
app.get('/api/products/:slug', (req, res) => {
  const products = readProducts();
  const slug = req.params.slug;
  
  // Try to find by slug first, fallback to ID for backwards compatibility
  let product = products.find(p => p.slug === slug);
  
  // If not found by slug, try by ID (for backwards compatibility)
  if (!product && !isNaN(slug)) {
    product = products.find(p => p.id === parseInt(slug));
  }
  
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
    
    const imageUrl = `${BASE_URL}/uploads/${optimizedFilename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Image optimization error:', error);
    // Fallback to original file if optimization fails
    const imageUrl = `${BASE_URL}/uploads/${req.file.filename}`;
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
    slug: generateSlug(name),
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
  
  const updatedProduct = { ...products[index], ...req.body, id };
  
  // Regenerate slug if name has changed
  if (req.body.name && req.body.name !== products[index].name) {
    updatedProduct.slug = generateSlug(req.body.name);
  }
  
  products[index] = updatedProduct;
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

// Generate dynamic sitemap
app.get('/sitemap.xml', (req, res) => {
  try {
    const products = readProducts();
    const baseUrl = BASE_URL;
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <priority>0.9</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>`;

    // Add product pages
    products.forEach(product => {
      const slug = product.slug || product.id;
      sitemap += `
  <url>
    <loc>${baseUrl}/products/${slug}</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
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
