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

  useEffect(() => {
    fetchProduct();
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

  if (loading) {
    return <div className="loading">Se încarcă produsul...</div>;
  }

  if (error || !product) {
    return (
      <div className="error-page">
        <h1>Produsul Nu A Fost Găsit</h1>
        <p>Produsul pe care îl căutați nu există.</p>
        <button onClick={() => navigate('/products')} className="back-btn">
          ← Înapoi la Produse
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <button onClick={() => navigate('/products')} className="back-btn">
          ← Înapoi la Produse
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
                Vezi Detalii de Contact
              </button>
              <button 
                className="back-to-products-btn"
                onClick={() => navigate('/products')}
              >
                Explorează Mai Multe Produse
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
