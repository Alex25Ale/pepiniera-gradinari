import { useState, useEffect } from 'react';
import '../styles/WhatsAppButton.css';

function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchWhatsAppNumber();
    
    // Show button after a small delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const fetchWhatsAppNumber = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings');
      if (response.ok) {
        const settings = await response.json();
        if (settings.contactInfo?.whatsapp) {
          setWhatsappNumber(settings.contactInfo.whatsapp);
        }
      }
    } catch (error) {
      console.error('Error fetching WhatsApp number:', error);
    }
  };

  const handleWhatsAppClick = () => {
    if (!whatsappNumber) return;
    
    // Clean the phone number (remove spaces, dashes, etc.)
    const cleanNumber = whatsappNumber.replace(/[\s\-\(\)]/g, '');
    
    // Pre-filled message
    const message = encodeURIComponent(
      "Bună! Sunt interesat/ă de arborii dumneavoastră decorativi. Puteți să îmi oferiți mai multe informații?"
    );
    
    // WhatsApp URL (works on both mobile and desktop)
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  };

  // Don't render if no WhatsApp number is configured
  if (!whatsappNumber) return null;

  return (
    <div className={`whatsapp-float ${isVisible ? 'visible' : ''}`}>
      <button 
        className="whatsapp-button"
        onClick={handleWhatsAppClick}
        title="Discută cu noi pe WhatsApp"
        aria-label="Contactează-ne pe WhatsApp"
      >
        <div className="whatsapp-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.52 7.09c.07-.23.07-.48 0-.71-.06-.24-.19-.45-.37-.61L15.27 6.8c-.27-.24-.62-.39-1-.39-.53 0-1.04.21-1.41.59L8.59 11.25c-.18.18-.29.43-.29.7 0 .26.11.51.29.69l4.27 4.27c.37.37.88.58 1.41.58.38 0 .73-.15 1-.39l.92-.97c.18-.16.31-.37.37-.61.07-.23.07-.48 0-.71l-.92-.97c-.18-.16-.42-.25-.67-.25s-.49.09-.67.25l-.71.71-2.83-2.83.71-.71c.16-.18.25-.42.25-.67s-.09-.49-.25-.67l-.97-.92z"/>
          </svg>
        </div>
        <span className="whatsapp-text">WhatsApp</span>
      </button>
      
      <div className="whatsapp-pulse"></div>
    </div>
  );
}

export default WhatsAppButton;
