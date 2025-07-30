# Modern Templating System Documentation

## Overview

This document provides comprehensive documentation for the Modern Templating System implemented in Handcrafted Haven, featuring modern EJS-inspired architecture.

**Created**: July 27, 2025  
**Architecture**: Next.js 15.4.1 + React 19 + TypeScript  
**File Location**: `/src/utils/templating.tsx`

## What is Modern EJS?

Our Modern EJS implementation is a JavaScript templating engine adapted for React/Next.js that provides:

1. **Server-side rendering capabilities** with client-side hydration
2. **Template string processing** with variable interpolation
3. **Conditional rendering** helpers
4. **Loop processing** for dynamic content
5. **Type safety** with TypeScript interfaces
6. **React integration** through HOCs and components

## Core Features

### 1. Template Processing Engine

```typescript
import { TemplateProcessor } from '@/utils/templating';

const processor = new TemplateProcessor({
  user: { name: 'John Doe', isVip: true },
  products: [{ name: 'Handmade Vase', price: 49.99 }]
});

// Basic variable interpolation
const greeting = processor.processTemplate('Hello {{user.name}}!');
// Output: "Hello John Doe!"

// With filters
const price = processor.processTemplate('Price: {{product.price | currency}}');
// Output: "Price: $49.99"
```

### 2. React Integration

#### Higher-Order Component (withTemplate)
```tsx
import { withTemplate, PageTemplateData } from '@/utils/templating';

const pageData: PageTemplateData = {
  title: 'Handcrafted Products - Handcrafted Haven',
  description: 'Beautiful handmade items by skilled artisans',
  keywords: ['handmade', 'artisan', 'crafts'],
  author: 'Handcrafted Haven',
  canonicalUrl: 'https://handcrafted-haven.com/products'
};

const ProductPage = withTemplate(MyProductComponent, pageData);
```

#### Template Renderer Component
```tsx
import { TemplateRenderer } from '@/utils/templating';

function ProductCard({ product }) {
  return (
    <TemplateRenderer
      template="<h3>{{name}}</h3><p>{{description}}</p><span>{{price | currency}}</span>"
      context={product}
      className="product-card"
    />
  );
}
```

### 3. Modern Component Helpers

#### Product Card Data Generation
```typescript
import { createProductCardData, ProductTemplateData } from '@/utils/templating';

const product: ProductTemplateData = {
  id: '1',
  name: 'Handmade Ceramic Vase',
  description: 'Beautiful ceramic vase crafted by local artisans',
  price: 49.99,
  originalPrice: 69.99,
  images: ['/images/vase.jpg'],
  category: 'home-decor',
  tags: ['ceramic', 'handmade', 'decor'],
  rating: 4.8,
  reviewCount: 24,
  inStock: true
};

const cardData = createProductCardData(product);
// Returns formatted data ready for display
```

#### Breadcrumb Navigation
```typescript
import { createBreadcrumbData } from '@/utils/templating';

const breadcrumbs = [
  { label: 'Products', href: '/products' },
  { label: 'Home Decor', href: '/products/home-decor' },
  { label: 'Ceramic Vase', isCurrentPage: true }
];

const breadcrumbData = createBreadcrumbData(breadcrumbs);
```

## Template Syntax Reference

### Variable Interpolation
```
{{variable}}           - Simple variable
{{object.property}}    - Nested property access
{{array.0.name}}       - Array element access
{{value | filter}}     - Apply filter to value
```

### Available Filters
- `currency` - Format as currency ($49.99)
- `date` - Format date (short format)
- `uppercase` - Convert to uppercase
- `lowercase` - Convert to lowercase
- `capitalize` - Capitalize first letter

### Conditional Logic (JavaScript)
```typescript
// In JavaScript code
processor.if(condition, 'true content', 'false content')

// Example
const content = processor.if(
  product.inStock, 
  'Add to Cart', 
  'Out of Stock'
);
```

### Loop Processing (JavaScript)
```typescript
// In JavaScript code
processor.each(array, (item, index) => `<div>${item.name}</div>`)

// Example
const productList = processor.each(products, (product, i) => 
  `<div class="product">${product.name} - ${processor.currency(product.price)}</div>`
);
```

## Modern Design Patterns

Our templating system follows modern React patterns in these key areas:

### 1. Page Structure
- Consistent metadata handling
- SEO-optimized title and description templates
- Canonical URL management
- Open Graph meta tags

### 2. Component Architecture
- Reusable template helpers
- Type-safe interfaces
- Consistent styling patterns
- Responsive design considerations

### 3. Product Display
- Standardized product card templates
- Price formatting with discount indicators
- Rating and review display
- Stock status handling

### 4. Navigation Patterns
- Breadcrumb generation from URL paths
- Consistent link styling
- Accessibility attributes
- Mobile-responsive navigation

## Best Practices

### 1. Type Safety
Always use TypeScript interfaces for template data:

```typescript
interface ProductData {
  name: string;
  price: number;
  inStock: boolean;
}

const processor = new TemplateProcessor();
const template = processor.processTemplate('{{name}} - {{price | currency}}', productData);
```

### 2. Performance Optimization
- Use React.useMemo for expensive template processing
- Cache template processors when possible
- Minimize template complexity for better performance

### 3. SEO Considerations
- Always provide meaningful page titles and descriptions
- Use canonical URLs for duplicate content
- Include relevant keywords in meta tags

### 4. Accessibility
- Include proper ARIA labels in templates
- Ensure keyboard navigation works with generated content
- Provide alternative text for images

## Usage Examples

### Basic Product Page
```tsx
import { withTemplate, TemplateRenderer } from '@/utils/templating';

const ProductPage = withTemplate(({ product }) => (
  <div>
    <TemplateRenderer
      template="<h1>{{name}}</h1><p>{{description}}</p>"
      context={product}
    />
    <div className="price">
      <TemplateRenderer
        template="{{#if originalPrice}}<span class='original'>{{originalPrice | currency}}</span>{{/if}}<span class='current'>{{price | currency}}</span>"
        context={product}
      />
    </div>
  </div>
), {
  title: 'Product - Handcrafted Haven',
  description: 'View our handcrafted products'
});
```

### Dynamic Product Grid
```tsx
function ProductGrid({ products }) {
  const processor = new TemplateProcessor();
  
  return (
    <div className="grid">
      {products.map(product => {
        const cardData = createProductCardData(product);
        return (
          <div key={product.id} className="product-card">
            <TemplateRenderer
              template="<img src='{{imageUrl}}' alt='{{name}}' /><h3>{{name}}</h3><p>{{price}}</p>"
              context={cardData}
            />
          </div>
        );
      })}
    </div>
  );
}
```

## Integration with Next.js App Router

Our templating system is designed to work seamlessly with Next.js 15.4.1 App Router:

### Page Templates
```tsx
// app/products/[category]/page.tsx
import { withTemplate } from '@/utils/templating';

async function CategoryPage({ params }) {
  const products = await getProductsByCategory(params.category);
  
  return (
    <div>
      {/* Template-driven content */}
    </div>
  );
}

export default withTemplate(CategoryPage, {
  title: 'Category Products - Handcrafted Haven',
  description: 'Browse our handcrafted products by category'
});
```

### Layout Templates
```tsx
// components/layout/PageLayout.tsx
import { TemplateRenderer } from '@/utils/templating';

export default function PageLayout({ children, templateData }) {
  return (
    <div>
      <header>
        <TemplateRenderer
          template="<h1>{{title}}</h1>"
          context={templateData}
        />
      </header>
      <main>{children}</main>
    </div>
  );
}
```

## Future Enhancements

1. **Server Components Integration**: Full Next.js Server Components support
2. **Advanced Conditionals**: More sophisticated if/else template syntax
3. **Template Caching**: Redis-based template caching for performance
4. **Custom Filters**: Plugin system for custom template filters
5. **Template Validation**: Runtime template validation and error reporting

## Migration Guide

For projects moving from traditional EJS to our modern system:

1. Replace `<%` and `%>` with `{{` and `}}`
2. Convert server-side logic to client-side React components
3. Use TypeScript interfaces instead of dynamic properties
4. Migrate includes to React component composition
5. Update filters to use our modern filter system

## Troubleshooting

### Common Issues

1. **Template not rendering**: Check JSX syntax and ensure .tsx extension
2. **Variable not found**: Verify property exists in context object
3. **Filter not working**: Ensure filter name is correct and supported
4. **React hydration errors**: Check server/client template consistency

### Debug Mode
Enable debug logging:
```typescript
const processor = new TemplateProcessor(context);
// Templates will log processing steps in development mode
```

This modern templating system provides a robust, type-safe, and performant solution for dynamic content generation while maintaining compatibility with React and Next.js modern development patterns.
