# 🔒 Security Guidelines for Handcrafted Haven

## Overview
This document outlines security best practices for the Handcrafted Haven project to prevent credential exposure and maintain secure development practices.

## 🚨 Critical Security Rules

### Never Commit These Items
- ❌ Real database connection strings with credentials
- ❌ API keys or secret tokens
- ❌ Production passwords or authentication secrets
- ❌ Private keys or certificates
- ❌ Configuration files with real credentials

### Always Use Placeholders in Documentation
- ✅ `<username>` instead of real usernames
- ✅ `<password>` instead of real passwords  
- ✅ `<your-api-key>` instead of real API keys
- ✅ `<cluster>` instead of real cluster names

## 🛡️ Environment Variable Security

### Local Development
1. **Use `.env.local`** (already in `.gitignore`)
2. **Copy from `.env.example`**:
   ```bash
   cp .env.example .env.local
   ```
3. **Replace all placeholders** with real values
4. **Never commit `.env.local`**

### Production Deployment
1. **Use platform environment variables** (Vercel, Netlify, etc.)
2. **Generate strong secrets**:
   ```bash
   openssl rand -base64 32
   ```
3. **Use different credentials** for each environment
4. **Rotate credentials regularly**

## 🔐 Secret Generation

### MongoDB URI
```bash
# Format (never commit real values)
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/database
```

### Authentication Secrets
```bash
# Generate strong secrets
openssl rand -base64 32
```

### JWT Secrets
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚫 Pre-commit Checklist

Before every commit, verify:
- [ ] No real credentials in any files
- [ ] All examples use placeholder format `<value>`
- [ ] `.env.local` is not staged for commit
- [ ] Documentation uses safe examples only

## 🔍 Secret Detection Tools

### GitHub Secret Scanning
- Automatically scans for exposed secrets
- Sends alerts when credentials are detected
- Review and fix alerts immediately

### Local Tools
```bash
# Check for potential secrets before commit
git diff --cached | grep -E "(password|secret|key|token)" --color=always
```

## 📋 Environment Variables Checklist

### Required for Production
- [ ] `MONGODB_URI` - Database connection
- [ ] `NEXTAUTH_SECRET` - Authentication secret
- [ ] `JWT_SECRET` - JWT signing secret
- [ ] `NODE_ENV=production`

### Optional Services
- [ ] `REDIS_URL` - Session storage
- [ ] `EMAIL_SERVICE_API_KEY` - Email notifications
- [ ] `STRIPE_SECRET_KEY` - Payment processing
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Maps integration

## 🚨 Emergency Response

### If Credentials Are Exposed
1. **Immediately rotate** all exposed credentials
2. **Update environment variables** in all environments
3. **Revoke old credentials** at the service provider
4. **Force push corrected history** if recent:
   ```bash
   git reset --hard HEAD~1
   git push --force-with-lease
   ```
5. **Create new credentials** for all environments

### GitHub Alert Response
1. **Review the alert** and identify exposed credentials
2. **Rotate credentials immediately** at the service provider
3. **Update all environments** with new credentials
4. **Fix the code** to use placeholders
5. **Commit the fix** and push immediately

## 📚 Additional Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [MongoDB Connection Security](https://docs.mongodb.com/manual/security/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🎯 Key Principles

1. **Security by Default** - Assume everything will be public
2. **Least Privilege** - Only grant minimum necessary access
3. **Defense in Depth** - Multiple layers of security
4. **Regular Auditing** - Review and rotate credentials regularly
5. **Education** - Keep team informed about security practices

---

**Remember**: A secure application starts with secure development practices. When in doubt, err on the side of caution and use placeholders in all documentation and examples.
