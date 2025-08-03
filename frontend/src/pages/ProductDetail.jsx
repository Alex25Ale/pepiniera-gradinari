import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import API_BASE_URL from '../config';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonTexts, setButtonTexts] = useState({
    backToProducts: 'Înapoi la Produse',
    contactButton: 'Vezi Detalii de Contact',
    exploreMoreProducts: 'Explorează Mai Multe Produse'
  });

  useEffect(() => {
    fetchProduct();
    fetchButtonTexts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      setError('Error loading product');
    }
    setLoading(false);
  };

  const fetchButtonTexts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`);
      if (response.ok) {
        const settings = await response.json();
        setButtonTexts({
          backToProducts: settings.buttonTexts?.backToProducts || 'Înapoi la Produse',
          contactButton: settings.homeContent?.contactButton || 'Vezi Detalii de Contact',
          exploreMoreProducts: settings.buttonTexts?.exploreMoreProducts || 'Explorează Mai Multe Produse'
        });
      }
    } catch (error) {
      console.error('Error fetching button texts:', error);
    }
  };

  if (loading) {
    return <div className="loading">Se încarcă produsul...</div>;
  }

  if (error || !product) {
    return (
      <div className="error-page">
        <h1>Produsul Nu A Fost Găsit</h1>
        <p>Produsul pe care îl căutați nu există.</p>
        <button onClick={() => navigate('/products')} className="back-btn">
          ← {buttonTexts.backToProducts}
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <button onClick={() => navigate('/products')} className="back-btn">
          ← {buttonTexts.backToProducts}
        </button>

        <div className="product-detail-content">
          <div className="product-image-section">
            <ImageCarousel 
              images={product.images || [product.image]} 
              productName={product.name}
              size="large"
              showThumbnails={true}
            />
            {product.discountedPrice && (
              <span className="discount-badge-corner">
                Reducere!
              </span>
            )}
          </div>

          <div className="product-info-section">
            <div className="product-category">{product.category}</div>
            <h1 className="product-title">{product.name}</h1>
            
            <div className="price-section">
              {product.discountedPrice ? (
                <div className="price-container">
                  <span className="discounted-price">{product.discountedPrice}</span>
                  <span className="original-price">{product.price}</span>
                </div>
              ) : (
                <span className="price">{product.price}</span>
              )}
            </div>

            <div className="product-actions">
              <button 
                className="contact-btn primary"
                onClick={() => navigate('/contact')}
              >
{buttonTexts.contactButton}
              </button>
              <button 
                className="back-to-products-btn"
                onClick={() => navigate('/products')}
              >
{buttonTexts.exploreMoreProducts}
              </button>
            </div>
          </div>
        </div>

        <div className="product-description-full">
          <h3>Descriere</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
