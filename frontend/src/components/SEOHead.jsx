import { Helmet } from 'react-helmet-async';

function SEOHead({ 
  title, 
  description, 
  keywords = [], 
  productName = '', 
  productCategory = '',
  productPrice = '',
  image = '',
  url = window.location.href 
}) {
  // Romanian gardening keywords to include
  const baseKeywords = [
    'pepiniera', 'gradinari', 'gradina', 'decoratiuni', 'decoratiuni de gradina',
    'arbori decorativi', 'plante ornamentale', 'amenajare gradina', 
    'palmieri', 'brazi', 'pomi fructiferi', 'plante exotice',
    'gradinarit', 'peisagistica', 'plante de gradina', 'arbori', 'arbusti'
  ];

  // Combine provided keywords with base Romanian gardening keywords
  const allKeywords = [...baseKeywords, ...keywords].join(', ');

  // Generate structured data for products
  const structuredData = productName ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": productName,
    "category": productCategory,
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": productPrice,
      "priceCurrency": "RON",
      "availability": "https://schema.org/InStock"
    },
    "image": image,
    "seller": {
      "@type": "Organization",
      "name": "Pepiniera Grădinari",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "RO"
      }
    }
  } : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      
      {/* Open Graph tags for social media */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={productName ? "product" : "website"} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="Pepiniera Grădinari" />
      <meta property="og:locale" content="ro_RO" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Language and location */}
      <meta name="language" content="Romanian" />
      <meta name="geo.region" content="RO" />
      <meta name="geo.country" content="Romania" />

      {/* Structured data for products */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

export default SEOHead;
