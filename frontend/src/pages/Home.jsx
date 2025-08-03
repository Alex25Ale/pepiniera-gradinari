import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import SEOHead from '../components/SEOHead';
import API_BASE_URL from '../config';
import '../styles/Home.css';

function Home() {
  const [featuredTrees, setFeaturedTrees] = useState([]);
  const [homeContent, setHomeContent] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroButton: '',
    featuredTitle: '',
    contactButton: '',
    exploreButton: ''
  });
  const [featuredCount, setFeaturedCount] = useState(3);
  const [seoSettings, setSeoSettings] = useState({
    title: '',
    description: '',
    keywords: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedTrees();
    fetchHomeContent();
  }, []);

  const fetchFeaturedTrees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/featured`);
      if (response.ok) {
        const data = await response.json();
        setFeaturedTrees(data);
      }
    } catch (error) {
      // Use sample data if backend not available
      setFeaturedTrees([
        {
          id: 1,
          name: "Royal Palm",
          description: "Elegant palm tree perfect for gardens",
          image: "/images/royal-palm.jpg",
          price: "€150"
        },
        {
          id: 2,
          name: "Christmas Pine",
          description: "Traditional Christmas tree, fresh and aromatic",
          image: "/images/christmas-pine.jpg",
          price: "€35"
        },
        {
          id: 3,
          name: "Decorative Olive",
          description: "Mediterranean olive tree for elegant decoration",
          image: "/images/olive-tree.jpg",
          price: "€120"
        }
      ]);
    }
  };

  const fetchHomeContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`);
      if (response.ok) {
        const settings = await response.json();
        if (settings.homeContent) {
          setHomeContent(settings.homeContent);
        }
        if (settings.featuredCount !== undefined) {
          setFeaturedCount(settings.featuredCount);
        }
        if (settings.seoSettings?.homePage) {
          setSeoSettings(settings.seoSettings.homePage);
        }
      }
    } catch (error) {
      console.error('Error fetching home content:', error);
    }
  };

  return (
    <div className="home">
      <SEOHead 
        title={seoSettings.title || "Pepiniera Grădinari - Arbori Decorativi, Palmieri și Brazi de Crăciun | România"}
        description={seoSettings.description || "Transformă-ți grădina cu arbori decorativi de calitate de la Pepiniera Grădinari. Specializați în palmieri, brazi de Crăciun, pomi fructiferi și amenajare grădini în România."}
        keywords={seoSettings.keywords ? seoSettings.keywords.split(', ') : ['arbori decorativi românia', 'palmieri pentru gradina', 'brazi craciunn', 'pomi fructiferi', 'amenajare peisagistica']}
      />
      <section className="hero">
        <div className="hero-content">
          <h1>{homeContent.heroTitle || 'Transformă-ți Grădina'}</h1>
          <p>{homeContent.heroSubtitle || 'Arbori decorativi de calitate, palmieri și brazi de Crăciun pentru orice ocazie'}</p>
          <button className="cta-button" onClick={() => navigate('/products')}>
            {homeContent.heroButton || 'Explorează Colecția Noastră'}
          </button>
        </div>
      </section>

      {featuredCount > 0 && featuredTrees.length > 0 && (
        <section className="featured">
          <h2>{homeContent.featuredTitle || 'Favoriții Grădinii'}</h2>
          <div className="trees-grid">
            {featuredTrees.map(tree => (
            <div key={tree.id} className="tree-card" onClick={() => navigate(`/products/${tree.slug || tree.id}`)}>
              <div className="tree-image-container">
                <ImageCarousel 
                  images={tree.images || [tree.image]} 
                  productName={tree.name}
                  size="medium"
                />
                <button className="view-details-btn" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/products/${tree.slug || tree.id}`);
                }}>
                  <span>👁</span>
                </button>
              </div>
              <div className="tree-info">
                <h3 onClick={() => navigate(`/products/${tree.slug || tree.id}`)}>{tree.name}</h3>
                <p>
                  {tree.description.length > 80 
                    ? `${tree.description.substring(0, 80)}...` 
                    : tree.description
                  }
                </p>
                <div className="tree-footer">
                  <div className="price-container">
                    {tree.discountedPrice ? (
                      <>
                        <span className="original-price">{tree.price}</span>
                        <span className="discounted-price">{tree.discountedPrice}</span>
                      </>
                    ) : (
                      <span className="price">{tree.price}</span>
                    )}
                  </div>
                  <button 
                    className="contact-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/contact');
                    }}
                  >
                    {homeContent.contactButton || 'Vezi Detalii de Contact'}
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
