# Pepiniera - Decorative Trees Website

A modern website for a family tree business featuring decorative trees, palms, and Christmas trees.

## Features

- **Public Website**:
  - Home page with featured trees
  - About page with business information
  - Products catalog with filtering
  - Contact page with contact form

- **Admin Panel**:
  - Secure login system
  - Add/edit/delete products
  - Manage product images and descriptions
  - Simple content management

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Database**: JSON files (simple file-based storage)
- **Styling**: CSS3 with modern design

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Node.js dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start the development servers**:
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Admin Access

- **URL**: http://localhost:3000/admin
- **Username**: admin
- **Password**: pepiniera2024

## Project Structure

```
Pepiniera/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── styles/        # CSS files
│   └── public/        # Static assets
├── backend/           # Node.js backend
│   ├── data/             # JSON data files
│   └── server.js         # Express server
└── package.json       # Root package.json
```

## Development

### Adding Products
1. Go to http://localhost:3000/admin
2. Login with admin credentials
3. Use the "Add New Product" form to add trees
4. Products are automatically saved to JSON files

### Customization
- Update colors in CSS files (green theme: #2d5016, #4a7c25)
- Add/modify pages in the `frontend/src/pages/` directory
- Update business information in the About page
- Modify contact details in the Contact page

## Deployment

For production deployment:

1. **Build the frontend**:
   ```bash
   cd frontend && npm run build
   ```

2. **Deploy backend** to a service like Heroku, Vercel, or VPS
3. **Deploy frontend** to Netlify, Vercel, or any static hosting
4. **Update API URLs** in the frontend to point to your backend

## Security Notes

- Change admin password in production
- Use environment variables for sensitive data
- Consider using a proper database for production
- Add proper authentication with JWT tokens
- Enable HTTPS in production

## Support

This website is designed to be simple and maintainable. The business owners can:
- Add/remove products through the admin panel
- Update prices and descriptions
- Upload new product images
- No technical knowledge required for daily management
