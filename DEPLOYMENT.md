# 🚀 Deployment Guide - Handcrafted Haven

## 📋 **Prerequisites**

### **System Requirements**
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn/pnpm equivalent)
- Git for version control

### **Production Environment**
- **Hosting**: Vercel, Netlify, or similar Next.js-compatible platform
- **Domain**: Custom domain with SSL certificate
- **CDN**: Integrated content delivery network
- **Analytics**: Google Analytics, Facebook Pixel (optional)

---

## 🔧 **Environment Setup**

### **1. Environment Variables**

Copy the appropriate environment template:

```bash
# For production
cp .env.production.example .env.production

# For local development  
cp .env.local.example .env.local
```

### **2. Required Environment Variables**

**Essential for Production:**
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Handcrafted Haven
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

**Optional but Recommended:**
```env
GOOGLE_ANALYTICS_ID=GA-XXXX-X
STRIPE_PUBLIC_KEY=pk_live_xxxxx (for payments)
AWS_S3_BUCKET=your-bucket (for file uploads)
```

---

## 🏗️ **Build Process**

### **1. Install Dependencies**
```bash
npm install --production
```

### **2. Build Application**
```bash
npm run build
```

### **3. Test Production Build Locally**
```bash
npm run start
```

### **4. Verify Build**
- Check that all pages load correctly
- Verify all static assets are optimized
- Test core functionality (navigation, cart, etc.)

---

## ☁️ **Deployment Options**

### **Option 1: Vercel (Recommended)**

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Node.js Version: 18.x

3. **Environment Variables**
   - Add all production environment variables in Vercel dashboard
   - Ensure `NEXT_PUBLIC_*` variables are set correctly

4. **Custom Domain**
   - Add custom domain in Vercel dashboard
   - Configure DNS records as instructed

### **Option 2: Netlify**

1. **Deploy from Git**
   - Connect GitHub/GitLab repository
   - Build command: `npm run build && npm run export`
   - Publish directory: `out`

2. **Build Settings**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

### **Option 3: Self-Hosted**

1. **Server Requirements**
   - Ubuntu 20.04+ or similar
   - Node.js 18+, nginx, PM2
   - SSL certificate (Let's Encrypt recommended)

2. **Deployment Script**
   ```bash
   #!/bin/bash
   git pull origin main
   npm install --production
   npm run build
   pm2 restart handcrafted-haven
   ```

---

## 🔍 **Pre-Deployment Checklist**

### **Performance ✅**
- [ ] Run `npm run build` successfully
- [ ] Bundle size < 1MB (check with `npm run analyze`)
- [ ] Images optimized (WebP/AVIF formats)
- [ ] Critical CSS inlined
- [ ] Lighthouse score > 90

### **SEO ✅**
- [ ] All pages have unique titles and meta descriptions
- [ ] Open Graph tags implemented
- [ ] Twitter Cards configured
- [ ] Sitemap.xml accessible at `/sitemap.xml`
- [ ] Robots.txt configured at `/robots.txt`

### **Security ✅**
- [ ] Security headers configured in next.config.js
- [ ] Environment variables secured (no secrets in public)
- [ ] HTTPS enforced
- [ ] Content Security Policy implemented

### **Functionality ✅**
- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Forms submit successfully
- [ ] Search functionality operational
- [ ] Cart and checkout flow complete
- [ ] Mobile responsiveness verified

### **Analytics & Monitoring ✅**
- [ ] Google Analytics configured
- [ ] Error monitoring setup (Sentry recommended)
- [ ] Performance monitoring enabled
- [ ] User feedback collection ready

---

## 📊 **Post-Deployment Verification**

### **1. Automated Testing**
```bash
# Run production build test
npm run build && npm run start

# Performance testing
npm run lighthouse

# Accessibility testing  
npm run a11y-check
```

### **2. Manual Testing Checklist**
- [ ] Homepage loads in < 3 seconds
- [ ] All navigation links work
- [ ] Product pages display correctly
- [ ] Search returns relevant results
- [ ] Shopping cart functionality
- [ ] Contact form submission
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility (Chrome, Safari, Firefox)

### **3. SEO Verification**
- [ ] Google Search Console setup
- [ ] Sitemap submitted to search engines
- [ ] Rich snippets validation
- [ ] Page speed insights > 90
- [ ] Mobile-friendly test passed

---

## 🚨 **Troubleshooting**

### **Common Issues**

**Build Fails:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Environment Variables Not Working:**
- Ensure `NEXT_PUBLIC_` prefix for client-side variables
- Restart development server after adding variables
- Check case sensitivity

**Images Not Loading:**
- Verify image paths are correct
- Ensure images are in `public/` directory
- Check Next.js Image optimization settings

**Performance Issues:**
- Run bundle analyzer: `npm run analyze`
- Check for large dependencies
- Implement code splitting for large pages

---

## 📈 **Performance Optimization**

### **Before Deployment**
1. **Bundle Analysis**
   ```bash
   npm run build -- --analyze
   ```

2. **Image Optimization**
   - Use WebP/AVIF formats
   - Implement responsive images
   - Add loading="lazy" for non-critical images

3. **Code Splitting**
   - Lazy load non-critical components
   - Split vendor chunks
   - Implement route-based code splitting

---

## 🔄 **Deployment Workflow**

### **Recommended Git Flow**
```bash
# Development
git checkout -b feature/your-feature
git commit -m "Add new feature"
git push origin feature/your-feature

# Testing on staging
git checkout staging
git merge feature/your-feature
# Auto-deploy to staging environment

# Production release
git checkout main
git merge staging
git tag v1.0.0
git push origin main --tags
# Auto-deploy to production
```

### **Automated Deployment**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: vercel/action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 **Support & Maintenance**

### **Monitoring**
- **Uptime**: Set up monitoring with services like UptimeRobot
- **Performance**: Monitor Core Web Vitals with Google PageSpeed Insights
- **Errors**: Use Sentry or similar for error tracking
- **Analytics**: Regular review of Google Analytics data

### **Updates**
- **Dependencies**: Monthly security updates
- **Content**: Regular content updates and new product additions
- **Performance**: Quarterly performance audits
- **SEO**: Monthly SEO analysis and improvements

---

**🎉 Ready for Production!**

Your Handcrafted Haven e-commerce platform is now ready for professional deployment. Follow this guide step-by-step to ensure a smooth launch and optimal performance.

For support, refer to the project documentation or contact the development team.
