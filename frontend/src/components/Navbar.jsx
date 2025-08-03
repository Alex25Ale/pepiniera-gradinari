import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🌳 Pepiniera Grădinari
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Acasă</Link></li>
          <li><Link to="/about">Despre</Link></li>
          <li><Link to="/products">Produse</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
