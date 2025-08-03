import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import SEOHead from '../components/SEOHead';
import API_BASE_URL from '../config';
import '../styles/Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Toate produsele']);
  const [selectedCategory, setSelectedCategory] = useState('Toate produsele');
  const [loading, setLoading] = useState(true);
  const [contactButtonText, setContactButtonText] = useState('Vezi Detalii de Contact');
  const [seoSettings, setSeoSettings] = useState({
    title: '',
    description: '',
    keywords: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchContactButtonText();
    fetchSeoSettings();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        
        // Extract unique categories
        const cats = ['Toate produsele', ...new Set(data.map(p => p.category))];
        setCategories(cats);
      }
    } catch (error) {
      // Sample data for development
      const sampleProducts = [
        {
          id: 1,
          name: "Royal Palm",
          category: "Palm Trees",
          description: "Majestic royal palm tree, perfect for creating tropical ambiance",
          price: "€150",
          image: "/images/royal-palm.jpg"
        },
        {
          id: 2,
          name: "Christmas Pine",
          category: "Christmas Trees", 
          description: "Fresh Norwegian pine, ideal for Christmas decorations",
          price: "€35",
          image: "/images/christmas-pine.jpg"
        },
        {
          id: 3,
          name: "Decorative Olive",
          category: "Ornamental Trees",
          description: "Authentic Mediterranean olive tree for elegant gardens",
          price: "€120",
          image: "/images/olive-tree.jpg"
        },
        {
          id: 4,
          name: "Japanese Maple",
          category: "Ornamental Trees",
          description: "Beautiful red Japanese maple for autumn color",
          price: "€85",
          image: "/images/japanese-maple.jpg"
        }
      ];
      
      setProducts(sampleProducts);
      setCategories(['All', 'Palm Trees', 'Christmas Trees', 'Ornamental Trees']);
    }
    setLoading(false);
  };

  const fetchContactButtonText = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`);
      if (response.ok) {
        const settings = await response.json();
        if (settings.homeContent?.contactButton) {
          setContactButtonText(settings.homeContent.contactButton);
        }
      }
    } catch (error) {
      console.error('Error fetching contact button text:', error);
    }
  };

  const fetchSeoSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`);
      if (response.ok) {
        const settings = await response.json();
        if (settings.seoSettings?.productsPage) {
          setSeoSettings(settings.seoSettings.productsPage);
        }
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
    }
  };

  const filteredProducts = selectedCategory === 'Toate produsele' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return <div className="loading">Se încarcă produsele...</div>;
  }

  return (
    <div className="products">
      <SEOHead 
        title={seoSettings.title || "Produse - Arbori Decorativi și Plante Ornamentale | Pepiniera Grădinari"}
        description={seoSettings.description || "Descoperă gama completă de arbori decorativi, palmieri, brazi de Crăciun și plante ornamentale de la Pepiniera Grădinari. Calitate garantată și preturi avantajoase în România."}
        keywords={seoSettings.keywords ? seoSettings.keywords.split(', ') : ['catalog produse', 'arbori decorativi preturi', 'palmieri de vanzare', 'brazi craciumnn preturi']}
      />
      <div className="products-container">
        <h1>Produsele Noastre</h1>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card" onClick={() => navigate(`/products/${product.slug || product.id}`)}>
              <div className="product-image-container">
                <ImageCarousel 
                  images={product.images || [product.image]} 
                  productName={product.name}
                  size="medium"
                />
                <button className="view-details-btn" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/products/${product.slug || product.id}`);
                }}>
                  <span>👁</span>
                </button>
              </div>
              <div className="product-info">
                <h3 onClick={() => navigate(`/products/${product.slug || product.id}`)}>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="description">
                  {product.description.length > 100 
                    ? `${product.description.substring(0, 100)}...` 
                    : product.description
                  }
                </p>
                <div className="product-footer">
                  <div className="price-container">
                    {product.discountedPrice ? (
                      <>
                        <span className="original-price">{product.price}</span>
                        <span className="discounted-price">{product.discountedPrice}</span>
                      </>
                    ) : (
                      <span className="price">{product.price}</span>
                    )}
                  </div>
                  <button 
                    className="contact-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/contact');
                    }}
                  >
                    {contactButtonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="no-products">Nu s-au găsit produse în această categorie.</p>
        )}
      </div>
    </div>
  );
}

export default Products;
