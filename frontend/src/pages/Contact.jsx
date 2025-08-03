import { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import API_BASE_URL from '../config';
import '../styles/Contact.css';

function Contact() {
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
    hours: ''
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    tiktok: ''
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`);
      if (response.ok) {
        const settings = await response.json();
        if (settings.contactInfo) {
          setContactInfo(settings.contactInfo);
        }
        if (settings.socialLinks) {
          setSocialLinks(settings.socialLinks);
        }
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  return (
    <div className="contact">
      <SEOHead 
        title="Contact - Pepiniera Grădinari | Comandă Arbori Decorativi Online"
        description="Contactează Pepiniera Grădinari pentru oferte personalizate la arbori decorativi, palmieri și brazi de Crăciun. Telefon, email și locația noastră în România."
        keywords={['contact pepiniera', 'comanda arbori', 'telefon pepiniera', 'adresa pepiniera']}
      />
      <div className="contact-container">
        <h1>Contactează-ne</h1>
        
        <div className="contact-content">
          <div className="contact-info">
            <h2>Ia Legătura cu Noi</h2>
            <p>
              Gata să îți transformi grădina? Contactează-ne pentru sfaturi personalizate 
              și oferte pentru frumoasa noastră selecție de arbori.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <h3>📞 Telefon</h3>
                <p>{contactInfo.phone}</p>
              </div>
              
              <div className="contact-item">
                <h3>📧 Email</h3>
                <p>{contactInfo.email}</p>
              </div>
              
              <div className="contact-item">
                <h3>📍 Locație</h3>
                <p style={{whiteSpace: 'pre-line'}}>{contactInfo.address}</p>
              </div>
              
              <div className="contact-item">
                <h3>🕒 Program</h3>
                <p style={{whiteSpace: 'pre-line'}}>{contactInfo.hours}</p>
              </div>
            </div>
          </div>
          
          <div className="social-media">
            <h2>Urmărește-ne</h2>
            <p>Rămâi conectat cu noi pe rețelele sociale pentru actualizări, sfaturi și inspirație pentru grădină!</p>
            
            <div className="social-links">
              {socialLinks.facebook && (
                <a 
                  href={socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link facebook"
                >
                  <span className="social-icon">📘</span>
                  <span>Facebook</span>
                </a>
              )}
              
              {socialLinks.instagram && (
                <a 
                  href={socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link instagram"
                >
                  <span className="social-icon">📷</span>
                  <span>Instagram</span>
                </a>
              )}
              
              {socialLinks.tiktok && (
                <a 
                  href={socialLinks.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link tiktok"
                >
                  <span className="social-icon">🎵</span>
                  <span>TikTok</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
