import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import API_BASE_URL from './config';
import './styles/App.css';

// Component to track page visits
function PageTracker() {
  const location = useLocation();
  
  useEffect(() => {
    const logVisit = async () => {
      try {
        await fetch(`${API_BASE_URL}/api/log-visit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            page: location.pathname,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        // Silently fail
      }
    };
    
    logVisit();
  }, [location.pathname]);
  
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <PageTracker />
          <ScrollToTop />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <WhatsAppButton />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
