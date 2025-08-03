import { useState } from 'react';
import ImageModal from './ImageModal';
import '../styles/ImageCarousel.css';

function ImageCarousel({ 
  images, 
  productName, 
  onImageClick = null, 
  size = 'medium',
  showThumbnails = false 
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!images || images.length === 0) {
    return <img src="/images/placeholder.jpg" alt={productName} className={`carousel-image ${size}`} />;
  }

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageClick = (e) => {
    if (onImageClick) {
      onImageClick(e);
    } else if (size === 'large') {
      // Open image modal for fullsize view
      setIsModalOpen(true);
    }
  };

  const handleModalNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleModalPrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <div className={`image-carousel ${size}`}>
        <div className="carousel-main" onClick={handleImageClick}>
          <img 
            src={images[currentImageIndex]} 
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            className="carousel-image"
          />
          
          {images.length > 1 && (
            <>
              <button className="carousel-btn prev-btn" onClick={prevImage}>
                &#8249;
              </button>
              <button className="carousel-btn next-btn" onClick={nextImage}>
                &#8250;
              </button>
            </>
          )}
        </div>
        
        {showThumbnails && images.length > 1 && (
          <div className="carousel-thumbnails">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => goToImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={images[currentImageIndex]}
        imageAlt={`${productName} - Image ${currentImageIndex + 1}`}
        images={images}
        currentIndex={currentImageIndex}
        onNext={handleModalNext}
        onPrev={handleModalPrev}
      />
    </>
  );
}

export default ImageCarousel;
