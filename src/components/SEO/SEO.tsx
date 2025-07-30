'use client';

import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  twitterHandle?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  price?: number;
  currency?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'preorder';
}

export default function SEO({
  title = 'Handcrafted Haven - Authentic Handmade Treasures',
  description = 'Discover unique handcrafted items from talented artisans worldwide. Quality handmade products including pottery, textiles, woodwork, jewelry and more.',
  image = '/images/og-image.jpg',
  url = 'https://handcraftedhaven.com',
  type = 'website',
  siteName = 'Handcrafted Haven',
  twitterHandle = '@handcraftedhaven',
  keywords = ['handmade', 'artisan', 'crafts', 'handcrafted', 'unique gifts', 'pottery', 'textiles', 'woodwork', 'jewelry'],
  author = 'Handcrafted Haven Team',
  publishedTime,
  modifiedTime,
  price,
  currency = 'USD',
  availability = 'in_stock'
}: SEOProps) {
  const fullTitle = title.includes('Handcrafted Haven') ? title : `${title} | Handcrafted Haven`;
  const fullUrl = url.startsWith('http') ? url : `https://handcraftedhaven.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://handcraftedhaven.com${image}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />

      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Product specific meta tags */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content={availability} />
        </>
      )}

      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#f59e0b" />
      <meta name="msapplication-TileColor" content="#f59e0b" />

      {/* Schema.org JSON-LD for Website */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Handcrafted Haven",
            "url": "https://handcraftedhaven.com",
            "logo": "https://handcraftedhaven.com/images/logo.png",
            "description": description,
            "sameAs": [
              "https://facebook.com/handcraftedhaven",
              "https://instagram.com/handcraftedhaven",
              "https://twitter.com/handcraftedhaven",
              "https://pinterest.com/handcraftedhaven"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-123-4567",
              "contactType": "customer service",
              "email": "hello@handcraftedhaven.com"
            }
          })
        }}
      />

      {/* Schema.org for E-commerce if it's a product */}
      {type === 'product' && price && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": title,
              "image": fullImage,
              "description": description,
              "offers": {
                "@type": "Offer",
                "url": fullUrl,
                "priceCurrency": currency,
                "price": price,
                "availability": `https://schema.org/${availability === 'in_stock' ? 'InStock' : 'OutOfStock'}`,
                "seller": {
                  "@type": "Organization",
                  "name": "Handcrafted Haven"
                }
              }
            })
          }}
        />
      )}
    </Head>
  );
}

// Helper function to generate SEO props for products
export function generateProductSEO(product: any) {
  return {
    title: `${product.name} - ${product.artisan}`,
    description: `${product.description?.slice(0, 160)}...` || `Handcrafted ${product.name} by ${product.artisan}. Authentic artisan-made product with premium materials.`,
    image: product.image,
    url: `/products/${product.id}`,
    type: 'product' as const,
    price: product.price,
    availability: product.inStock ? 'in_stock' as const : 'out_of_stock' as const,
    keywords: [
      'handmade',
      product.name.toLowerCase(),
      product.artisan.toLowerCase(),
      product.category?.toLowerCase(),
      ...product.materials?.map((m: string) => m.toLowerCase()) || []
    ]
  };
}

// Helper function for page SEO
export function generatePageSEO(page: string, customProps?: Partial<SEOProps>) {
  const pageConfigs = {
    home: {
      title: 'Handcrafted Haven - Authentic Handmade Treasures',
      description: 'Discover unique handcrafted items from talented artisans worldwide. Quality handmade products including pottery, textiles, woodwork, jewelry and more.',
      keywords: ['handmade marketplace', 'artisan products', 'unique gifts', 'handcrafted items']
    },
    about: {
      title: 'About Us - Our Story of Craftsmanship & Community',
      description: 'Learn about Handcrafted Haven\'s mission to connect passionate artisans with people who appreciate authentic handmade treasures.',
      keywords: ['artisan community', 'handmade story', 'craft heritage', 'supporting artisans']
    },
    contact: {
      title: 'Contact Us - Get in Touch',
      description: 'Contact Handcrafted Haven for questions about our artisan products, partnership opportunities, or customer support.',
      keywords: ['contact artisan marketplace', 'customer support', 'artisan inquiries']
    },
    artisans: {
      title: 'Meet Our Artisans - Talented Craftspeople',
      description: 'Discover the talented artisans behind every handmade treasure. Learn their stories and explore their unique craftsmanship.',
      keywords: ['meet artisans', 'craftspeople stories', 'artisan profiles', 'handcraft masters']
    },
    shop: {
      title: 'Shop Handmade Products - Artisan Marketplace',
      description: 'Browse our curated collection of handmade products from artisans worldwide. Find unique pottery, textiles, jewelry, and more.',
      keywords: ['shop handmade', 'artisan marketplace', 'handcrafted products', 'unique items']
    }
  };

  const config = pageConfigs[page as keyof typeof pageConfigs] || pageConfigs.home;
  
  return {
    ...config,
    ...customProps
  };
}
