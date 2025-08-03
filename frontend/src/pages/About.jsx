import { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import API_BASE_URL from '../config';
import '../styles/About.css';

function About() {
  const [aboutContent, setAboutContent] = useState({
    title: "",
    paragraphs: [],
    expertise: []
  });
  const [seoSettings, setSeoSettings] = useState({
    title: '',
    description: '',
    keywords: ''
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`);
      if (response.ok) {
        const settings = await response.json();
        if (settings.aboutContent) {
          setAboutContent(settings.aboutContent);
        }
        if (settings.seoSettings?.aboutPage) {
          setSeoSettings(settings.seoSettings.aboutPage);
        }
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    }
  };

  return (
    <div className="about">
      <SEOHead 
        title={seoSettings.title || "Despre Noi - Pepiniera de Familie cu Tradiție | Pepiniera Grădinari"}
        description={seoSettings.description || "Afacere de familie cu peste trei generații de experiență în cultivarea arborilor decorativi. Specializați în palmieri, brazi de Crăciun și amenajare grădini în România."}
        keywords={seoSettings.keywords ? seoSettings.keywords.split(', ') : ['pepiniera de familie', 'experienta in gradinarii', 'traditie', 'cultivatori arbori']}
      />
      <div className="about-container">
        <h1>{aboutContent.title}</h1>
        
        <div className="about-content">
          <div className="about-text">
            {aboutContent.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            
            {aboutContent.expertise.length > 0 && (
              <>
                <h2>{aboutContent.expertiseTitle || 'De ce noi?'}</h2>
                <ul>
                  {aboutContent.expertise.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          
          {aboutContent.image && (
            <div className="about-image">
              <img src={aboutContent.image} alt="Our tree nursery" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default About;
