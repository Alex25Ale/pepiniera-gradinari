import { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import '../styles/About.css';

function About() {
  const [aboutContent, setAboutContent] = useState({
    title: "About Our Family Business",
    paragraphs: [],
    expertise: []
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
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    }
  };

  return (
    <div className="about">
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
