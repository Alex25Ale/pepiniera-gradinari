import { useState, useEffect } from 'react';
import '../styles/Admin.css';

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    discountedPrice: '',
    images: []
  });
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    discountedPrice: '',
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState({
    featuredCount: 3,
    aboutContent: {
      title: '',
      paragraphs: [],
      expertiseTitle: '',
      expertise: [],
      image: ''
    },
    contactInfo: {
      phone: '',
      email: '',
      address: '',
      hours: '',
      whatsapp: ''
    },
    socialLinks: {
      facebook: '',
      instagram: '',
      tiktok: ''
    }
  });
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchProducts();
      fetchSettings();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
        fetchProducts();
        fetchSettings();
      } else {
        alert('Date de autentificare invalide');
      }
    } catch (error) {
      // For development - simple hardcoded login
      if (credentials.username === 'admin' && credentials.password === 'pepiniera2024') {
        localStorage.setItem('adminToken', 'demo-token');
        setIsLoggedIn(true);
        fetchProducts();
        fetchSettings();
      } else {
        alert('Date de autentificare invalide');
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      // Sample data for development
      setProducts([
        {
          id: 1,
          name: "Royal Palm",
          category: "Palm Trees",
          description: "Majestic royal palm tree",
          price: "€150",
          image: "/images/royal-palm.jpg"
        }
      ]);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
      });
      
      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
        alert('Setările au fost actualizate cu succes!');
      } else {
        alert('Eșuarea actualizării setărilor');
      }
    } catch (error) {
      alert('Eroare la actualizarea setărilor: ' + error.message);
    }
  };

  const handleImageChange = (e, isEdit = false) => {
    const files = Array.from(e.target.files);
    
    if (isEdit) {
      setEditImageFiles(prev => [...prev, ...files]);
      
      // Create previews for new files
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setEditImagePreviews(prev => [...prev, { file, preview: e.target.result, isNew: true }]);
        };
        reader.readAsDataURL(file);
      });
    } else {
      setImageFiles(prev => [...prev, ...files]);
      
      // Create previews for new files
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, { file, preview: e.target.result }]);
        };
        reader.readAsDataURL(file);
      });
    }
    
    // Reset the input
    e.target.value = '';
  };

  const removeImage = (index, isEdit = false) => {
    if (isEdit) {
      const preview = editImagePreviews[index];
      if (preview.isNew) {
        // Find the corresponding file index for new files only
        const newFileIndex = editImagePreviews.slice(0, index).filter(p => p.isNew).length;
        setEditImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
      }
      setEditImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadImages = async (files) => {
    if (!files || files.length === 0) return [];
    
    setUploading(true);
    const uploadedUrls = [];
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.imageUrl);
        } else {
          throw new Error('Upload failed');
        }
      }
      
      return uploadedUrls;
    } catch (error) {
      alert('Error uploading images: ' + error.message);
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      // Upload all selected images
      const uploadedUrls = await uploadImages(imageFiles);
      
      const productData = {
        ...newProduct,
        images: uploadedUrls.length > 0 ? uploadedUrls : []
      };
      
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        const savedProduct = await response.json();
        setProducts([...products, savedProduct]);
        setNewProduct({ name: '', category: '', description: '', price: '', discountedPrice: '', images: [] });
        setImageFiles([]);
        setImagePreviews([]);
        alert('Produsul a fost adăugat cu succes!');
      } else {
        alert('Eșuarea adăugării produsului');
      }
    } catch (error) {
      alert('Eroare la adăugarea produsului: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Sunteți sigur că doriți să ștergeți acest produs?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setProducts(products.filter(p => p.id !== id));
          alert('Produsul a fost șters cu succes!');
        } else {
          alert('Eșuarea ștergerii produsului');
        }
      } catch (error) {
        alert('Eroare la ștergerea produsului: ' + error.message);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      discountedPrice: product.discountedPrice || '',
      images: product.images || [product.image]
    });
    
    // Set up existing images for preview
    const existingImages = (product.images || [product.image]).map(url => ({
      url,
      preview: url,
      isNew: false
    }));
    setEditImagePreviews(existingImages);
    setEditImageFiles([]);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    try {
      // Upload new images
      const newUploadedUrls = await uploadImages(editImageFiles);
      
      // Combine existing images with new uploads
      const existingImages = editImagePreviews
        .filter(preview => !preview.isNew)
        .map(preview => preview.url || preview.preview);
      
      const allImages = [...existingImages, ...newUploadedUrls];
      
      const productData = {
        ...editForm,
        images: allImages
      };
      
      const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
        setEditingProduct(null);
        setEditForm({ name: '', category: '', description: '', price: '', discountedPrice: '', images: [] });
        setEditImageFiles([]);
        setEditImagePreviews([]);
        alert('Produsul a fost actualizat cu succes!');
      } else {
        alert('Eșuarea actualizării produsului');
      }
    } catch (error) {
      alert('Eroare la actualizarea produsului: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setCredentials({ username: '', password: '' });
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h1>Autentificare Administrator</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nume utilizator"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Parolă"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
            <button type="submit">Autentifică-te</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Panou de Administrare</h1>
        <button onClick={handleLogout} className="logout-btn">Deconectează-te</button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Produse
        </button>
        <button 
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Administrează Conținut
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Setări
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'products' && (
          <>
            <section className="add-product">
          <h2>Adaugă Produs Nou</h2>
          <form onSubmit={handleAddProduct}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Numele Produsului"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Categorie"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Preț (exemplu: 150 Lei)"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Link către imagine (opțional)"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
              />
            </div>
            <div className="form-row discount-row">
              <label className="discount-label">Reducere (opțional):</label>
              <input
                type="text"
                placeholder="Preț redus (opțional, prețul final, exemplu: 100 Lei)"
                value={newProduct.discountedPrice}
                onChange={(e) => setNewProduct({...newProduct, discountedPrice: e.target.value})}
              />
            </div>
            
            <div className="image-upload-section">
              <label>Încarcă Imagini:</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(e, false)}
                className="file-input"
              />
              <div className="images-grid">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview.preview} alt={`Preview ${index + 1}`} />
                    <button 
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index, false)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Descriere"
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              required
            ></textarea>
            <button type="submit" disabled={uploading}>
              {uploading ? 'Se încarcă...' : 'Adaugă Produs'}
            </button>
          </form>
        </section>

        <section className="products-list">
          <h2>Administrează Produse</h2>
          <div className="products-table">
            {products.map(product => (
              <div key={product.id}>
                <div className="product-row">
                  <img src={product.image} alt={product.name} className="product-thumb" />
                  <div className="product-details">
                  <h3>{product.name}</h3>
                  <p><strong>Categorie:</strong> {product.category}</p>
                  <p><strong>Preț:</strong> {product.price}</p>
                  {product.discountedPrice && (
                  <p><strong>Reducere:</strong> {product.price} → {product.discountedPrice}</p>
                  )}
                  <p>{product.description}</p>
                  </div>
                  <div className="product-actions">
                  <button onClick={() => handleEditProduct(product)}>Editează</button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="delete-btn">
                  Șterge
                  </button>
                  </div>
                </div>
                
                {editingProduct && editingProduct.id === product.id && (
                  <div className="edit-product-inline">
                    <h3>Editează Produs</h3>
                    <form onSubmit={handleUpdateProduct}>
                      <div className="form-row">
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Category"
                          value={editForm.category}
                          onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-row">
                        <input
                          type="text"
                          placeholder="Price (e.g., €150)"
                          value={editForm.price}
                          onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={editForm.image}
                          onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                        />
                      </div>
                      <div className="form-row discount-row">
                        <label className="discount-label">Set Discount (optional):</label>
                        <input
                          type="text"
                          placeholder="Discounted Price (optional, e.g., €120)"
                          value={editForm.discountedPrice}
                          onChange={(e) => setEditForm({...editForm, discountedPrice: e.target.value})}
                        />
                      </div>
                      
                      <div className="image-upload-section">
                        <label>Product Images:</label>
                        <div className="images-grid">
                          {editImagePreviews.map((preview, index) => (
                            <div key={index} className="image-preview-item">
                              <img src={preview.preview} alt={`Image ${index + 1}`} />
                              <button 
                                type="button"
                                className="remove-image-btn"
                                onClick={() => removeImage(index, true)}
                              >
                                ×
                              </button>
                              {preview.isNew && <span className="new-badge">New</span>}
                            </div>
                          ))}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageChange(e, true)}
                          className="file-input"
                        />
                        <p className="upload-help">Select multiple images to add them to the product</p>
                      </div>
                      
                      <textarea
                        placeholder="Description"
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        required
                      ></textarea>
                      <div className="edit-actions">
                        <button type="submit" disabled={uploading}>
                          {uploading ? 'Se actualizează...' : 'Actualizează Produs'}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setEditingProduct(null);
                            setEditImageFiles([]);
                            setEditImagePreviews([]);
                          }}
                          className="cancel-btn"
                        >
                          Anulează
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
          </section>


            </>
        )}

        {activeTab === 'settings' && (
          <section className="settings-panel">
            <h2>Setări Website</h2>
            
            <div className="setting-group">
              <label>Numărul de arbori favoriți pe pagina principală:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.featuredCount || 3}
                onChange={(e) => setSettings({...settings, featuredCount: parseInt(e.target.value)})}
              />
              <button 
                onClick={() => updateSettings({ featuredCount: settings.featuredCount })}
                className="save-btn"
              >
                Salvează
              </button>
            </div>

            <div className="setting-group">
              <h3>Administrează Produsele Favorite</h3>
              <div className="featured-products-grid">
                {products.map(product => (
                  <div key={product.id} className="featured-product-item">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <h4>{product.name}</h4>
                      <label>
                        <input
                          type="checkbox"
                          checked={product.featured || false}
                          onChange={async (e) => {
                            const updatedProduct = { ...product, featured: e.target.checked };
                            try {
                              const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updatedProduct)
                              });
                              if (response.ok) {
                                fetchProducts();
                              }
                            } catch (error) {
                              alert('Eroare la actualizarea produsului: ' + error.message);
                            }
                          }}
                        />
                        Favorit pe Pagina Principală
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'content' && (
          <section className="content-management">
            <h2>Administrează Conținut</h2>
            
            <div className="content-section">
              <h3>Conținutul Paginii Despre</h3>
              
              <div className="form-group">
                <label>Titlul Paginii:</label>
                <input
                  type="text"
                  value={settings.aboutContent?.title || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    aboutContent: { ...settings.aboutContent, title: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>Paragrafe:</label>
                <textarea
                  rows="8"
                  value={settings.aboutContent?.paragraphs?.join('\n') || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    aboutContent: { 
                      ...settings.aboutContent, 
                      paragraphs: e.target.value.split('\n').filter(p => p.trim()) 
                    }
                  })}
                  placeholder="Introduceți fiecare paragraf pe o linie nouă..."
                />
              </div>

              <div className="form-group">
                <label>Titlu secundar:</label>
                <input
                  type="text"
                  value={settings.aboutContent?.expertiseTitle || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    aboutContent: { ...settings.aboutContent, expertiseTitle: e.target.value }
                  })}
                  placeholder="De ce noi?"
                />
              </div>

              <div className="form-group">
                <label>Paragrafe sub titlul secundar:</label>
                <textarea
                  rows="6"
                  value={settings.aboutContent?.expertise?.join('\n') || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    aboutContent: { 
                      ...settings.aboutContent, 
                      expertise: e.target.value.split('\n').filter(e => e.trim()) 
                    }
                  })}
                  placeholder="🌴 Palmieri - Descriere&#10;🎄 Brazi de Crăciun - Descriere"
                />
              </div>

              <div className="form-group">
                <label>Imagine pentru Pagina Despre (opțional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('image', file);
                      
                      try {
                        const response = await fetch('http://localhost:5000/api/upload', {
                          method: 'POST',
                          body: formData
                        });
                        
                        if (response.ok) {
                          const data = await response.json();
                          setSettings({
                            ...settings,
                            aboutContent: { ...settings.aboutContent, image: data.imageUrl }
                          });
                          alert('Imaginea a fost încărcată cu succes!');
                        }
                      } catch (error) {
                        alert('Eroare la încărcarea imaginii: ' + error.message);
                      }
                    }
                  }}
                />
                {settings.aboutContent?.image && (
                  <div className="image-preview">
                    <img src={settings.aboutContent.image} alt="Previzualizare pagină despre" />
                    <button 
                      type="button"
                      onClick={() => setSettings({
                        ...settings,
                        aboutContent: { ...settings.aboutContent, image: '' }
                      })}
                      className="remove-image-btn"
                    >
                      Elimină Imaginea
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => updateSettings({ aboutContent: settings.aboutContent })}
                className="save-btn"
              >
                Salvează Conținutul Despre
              </button>
            </div>

            <div className="content-section">
              <h3>Informații de Contact</h3>
              
              <div className="contact-form-grid">
                <div className="form-group">
                  <label>Telefon:</label>
                  <input
                    type="text"
                    value={settings.contactInfo?.phone || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      contactInfo: { ...settings.contactInfo, phone: e.target.value }
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={settings.contactInfo?.email || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      contactInfo: { ...settings.contactInfo, email: e.target.value }
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>Adresă:</label>
                  <textarea
                    rows="3"
                    value={settings.contactInfo?.address || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      contactInfo: { ...settings.contactInfo, address: e.target.value }
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>Program de Lucru:</label>
                  <textarea
                    rows="4"
                    value={settings.contactInfo?.hours || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      contactInfo: { ...settings.contactInfo, hours: e.target.value }
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>Număr WhatsApp (cu codul de țară, ex. +40123456789):</label>
                  <input
                    type="text"
                    value={settings.contactInfo?.whatsapp || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      contactInfo: { ...settings.contactInfo, whatsapp: e.target.value }
                    })}
                    placeholder="+40123456789"
                  />
                  <small style={{color: '#666', fontSize: '0.9rem', display: 'block', marginTop: '5px'}}>
                    Acest număr va fi folosit pentru butonul de contact WhatsApp. Includeți codul de țară.
                  </small>
                </div>

              </div>

              <button 
                onClick={() => updateSettings({ contactInfo: settings.contactInfo })}
                className="save-btn"
              >
                Salvează Informațiile de Contact
              </button>
            </div>

            <div className="content-section">
              <h3>Linkuri Rețele Sociale</h3>
              <p>Adăugați URL-urile rețelelor sociale. Lăsați gol pentru a ascunde linkul de pe pagina de contact.</p>
              
              <div className="social-form-grid">
                <div className="form-group">
                  <label>URL Facebook:</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.facebook || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                    })}
                    placeholder="https://www.facebook.com/paginavoastra"
                  />
                </div>

                <div className="form-group">
                  <label>URL Instagram:</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.instagram || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                    })}
                    placeholder="https://www.instagram.com/paginavoastra"
                  />
                </div>

                <div className="form-group">
                  <label>URL TikTok:</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.tiktok || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, tiktok: e.target.value }
                    })}
                    placeholder="https://www.tiktok.com/@paginavoastra"
                  />
                </div>
              </div>

              <button 
                onClick={() => updateSettings({ socialLinks: settings.socialLinks })}
                className="save-btn"
              >
                Salvează Linkurile Sociale
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Admin;
