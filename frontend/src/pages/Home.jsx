import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import API_BASE_URL from '../config';
import '../styles/Home.css';

function Home() {
  const [featuredTrees, setFeaturedTrees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch featured trees from backend
    fetchFeaturedTrees();
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

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Transformă-ți Grădina</h1>
          <p>Arbori decorativi de calitate, palmieri și brazi de Crăciun pentru orice ocazie</p>
          <button className="cta-button" onClick={() => navigate('/products')}>
            Explorează Colecția Noastră
          </button>
        </div>
      </section>

      <section className="featured">
        <h2>Favoriții Grădinii</h2>
        <div className="trees-grid">
          {featuredTrees.map(tree => (
            <div key={tree.id} className="tree-card" onClick={() => navigate(`/products/${tree.id}`)}>
              <div className="tree-image-container">
                <ImageCarousel 
                  images={tree.images || [tree.image]} 
                  productName={tree.name}
                  size="medium"
                />
                <button className="view-details-btn" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/products/${tree.id}`);
                }}>
                  <span>👁</span>
                </button>
              </div>
              <div className="tree-info">
                <h3 onClick={() => navigate(`/products/${tree.id}`)}>{tree.name}</h3>
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
                    onClick={() => navigate('/contact')}
                  >
                    Vezi Detalii de Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
