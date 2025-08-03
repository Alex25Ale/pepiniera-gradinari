import { useEffect, useState } from 'react';
import '../styles/ImageModal.css';

function ImageModal({ 
  isOpen, 
  onClose, 
  imageSrc, 
  imageAlt, 
  images = [], 
  currentIndex = 0, 
  onNext, 
  onPrev 
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleArrowKeys = (e) => {
      if (!isOpen || images.length <= 1) return;
      
      if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      }
    };

    const handleWheel = (e) => {
      if (!isOpen) return;
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prev => {
        const newZoom = Math.max(0.5, Math.min(3, prev + delta));
        return newZoom;
      });
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleArrowKeys);
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.body.style.overflow = 'hidden';
      setZoomLevel(1); // Reset zoom when opening modal
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleArrowKeys);
      document.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev, images.length]);

  const handleImageClick = () => {
    setZoomLevel(prev => prev === 1 ? 1.5 : 1);
  };

  const handleModalClose = () => {
    setZoomLevel(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="image-modal-overlay" onClick={handleModalClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={handleModalClose}>
          ×
        </button>
        
        <div className={`image-modal-zoom-indicator ${zoomLevel !== 1 ? 'visible' : ''}`}>
          {Math.round(zoomLevel * 100)}%
        </div>
        
        <div className="image-modal-container">
          <img 
            src={imageSrc} 
            alt={imageAlt}
            className="image-modal-img"
            style={{ 
              transform: `scale(${zoomLevel})`,
              cursor: zoomLevel === 1 ? 'zoom-in' : 'zoom-out'
            }}
            onClick={handleImageClick}
          />
          
          {images.length > 1 && (
            <>
              <button 
                className="image-modal-nav prev" 
                onClick={onPrev}
                disabled={currentIndex === 0}
              >
                &#8249;
              </button>
              <button 
                className="image-modal-nav next" 
                onClick={onNext}
                disabled={currentIndex === images.length - 1}
              >
                &#8250;
              </button>
              
              <div className="image-modal-counter">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageModal;
