# Zippit Admin Platform - Setup & Configuration Guide

## Overview

You now have a fully functional Zippit ecommerce platform with:
- Complete rebrand from Velour to Zippit
- Google OAuth + Email/Password authentication
- Admin dashboard with 6 management sections
- WhatsApp integration ready for order/inquiry notifications
- localStorage-based data persistence (ready to migrate to backend)

## Final Setup Steps

### 1. Google OAuth Configuration

To enable Google OAuth login:

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API

2. **Create OAuth 2.0 Credentials**:
   - Go to "Credentials" in the sidebar
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized origins:
     - `http://localhost:5173` (development)
     - `http://localhost:3000` (alternative)
     - Your Vercel domain (production)
   - Add authorized redirect URIs:
     - Same as above

3. **Update .env.local**:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
   ```

### 2. WhatsApp Integration (Production)

The app currently logs WhatsApp messages to console. For production:

1. **Set up WhatsApp Business Account** at Meta Business Platform
2. **Get your Phone Number ID and Access Token**
3. **Add to .env.local**:
   ```
   VITE_WHATSAPP_PHONE_ID=YOUR_PHONE_ID
   VITE_WHATSAPP_BUSINESS_TOKEN=YOUR_TOKEN
   ```
4. **Update `/src/services/whatsapp.js`** with actual API calls

### 3. Deploy to Vercel

1. **Connect GitHub Repository**:
   ```bash
   git add .
   git commit -m "Initial Zippit admin platform"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Add environment variables in Settings → Environment Variables
   - Deploy

### 4. Admin Account Setup

The system supports two login methods:

#### Email/Password Signup:
1. Navigate to `/admin/signup`
2. Enter name, email, and password (min 6 chars)
3. Account created with bcrypt hashed password

#### Google OAuth:
1. Navigate to `/admin/login`
2. Click "Sign in with Google"
3. Admin account auto-created on first login

## Admin Dashboard Features

### Dashboard Overview
- Real-time statistics (Products, Orders, Revenue, Inquiries)
- Sales and order charts
- Order status distribution
- Recent activity feed

### Products Management
- Add/Edit/Delete products
- Set price, category, description
- Mark as in-stock or featured
- Image URL support

### Categories
- Create/manage product categories
- Categorize products
- Add category descriptions

### Coupons
- Create discount codes with % off
- Set max uses and expiry dates
- Toggle coupon active status
- Track coupon usage

### Inquiries
- View customer contact form submissions
- Reply to inquiries (with WhatsApp integration)
- Track inquiry status (New/Contacted/Closed)
- WhatsApp notification on reply

### Orders
- View all customer orders with status
- 7-step order progression: Order Placed → Delivered
- Click timeline to update status
- WhatsApp notification on status change
- Search by order ID, email, or customer name

## Data Storage

### Current Setup (MVP)
- All data stored in browser's localStorage
- Data persists across sessions
- Data lost on browser cache clear

### Storage Keys
```javascript
// Available in localStorage:
zippit_products      // Array of product objects
zippit_categories    // Array of category objects
zippit_coupons       // Array of coupon objects
zippit_orders        // Array of order objects
zippit_inquiries     // Array of inquiry objects
admin_user           // Current logged-in admin
admin_users          // All admin accounts
```

### Migration to Backend

To migrate to a backend database (Neon, Supabase, etc):

1. Create API routes for CRUD operations
2. Update service files to call API instead of localStorage
3. UI code remains unchanged

Example migration in `/src/services/products.js`:
```javascript
// Before: localStorage
// const products = JSON.parse(localStorage.getItem('zippit_products'));

// After: API call
const products = await fetch('/api/products').then(r => r.json());
```

## Testing the Application

### Local Development
```bash
npm run dev
# Access at http://localhost:5173
```

### Admin Panel Access
- Login: `/admin/login`
- Signup: `/admin/signup`
- Dashboard: `/admin/dashboard`
- Products: `/admin/products`
- Categories: `/admin/categories`
- Coupons: `/admin/coupons`
- Inquiries: `/admin/inquiries`
- Orders: `/admin/orders`

### Demo Data

Add test data through the admin panel:

**Test Product**:
- Name: "Traditional Block Print Pouch"
- Price: 1299
- Category: "Ethnic Collection"
- In Stock: Yes
- Featured: Yes

**Test Order** (in localStorage):
```javascript
{
  id: 'order_1234',
  email: 'customer@example.com',
  name: 'John Doe',
  phone: '+91 9876543210',
  status: 'Order Placed',
  total: 2999,
  items: [{name: 'Pouch', quantity: 1, total: 1299}],
  createdAt: new Date().toISOString()
}
```

## Project Structure

```
src/
├── context/
│   └── AuthContext.jsx          # Global auth state
├── pages/
│   ├── AdminLoginPage.jsx       # Google OAuth + Email login
│   ├── AdminSignupPage.jsx      # Email/Password signup
│   ├── AdminDashboardPage.jsx   # Dashboard overview
│   ├── AdminProductsPage.jsx    # Product management
│   ├── AdminCategoriesPage.jsx  # Category management
│   ├── AdminCouponsPage.jsx     # Coupon management
│   ├── AdminInquiriesPage.jsx   # Inquiry management
│   └── AdminOrdersPage.jsx      # Order management
├── components/
│   ├── AdminLayout.jsx          # Admin sidebar & layout
│   └── ProtectedRoute.jsx       # Route protection
├── services/
│   └── whatsapp.js              # WhatsApp integration
└── App.jsx                      # Route configuration
```

## Troubleshooting

### Google OAuth Not Working
- Verify Client ID in `.env.local`
- Check authorized origins in Google Cloud Console
- Clear browser cookies and cache
- Ensure you're on the correct domain

### Admin Login Page Shows Error
- Check browser console for error messages
- Verify all dependencies installed: `npm install`
- Rebuild: `npm run build`

### Data Not Persisting
- Check browser localStorage is enabled
- Clear cache if old data showing
- Verify localStorage keys in browser DevTools

### WhatsApp Messages Not Sending
- Check if phone number format is correct (+91 XXXXXXXXXX)
- In MVP, messages logged to console - check browser console
- For production, verify WhatsApp Business API credentials

## Next Steps

1. Set up Google OAuth credentials
2. Deploy to Vercel
3. Add sample data through admin panel
4. Test end-to-end workflow
5. (Optional) Integrate with WhatsApp Business API
6. (Optional) Migrate to backend database

## Support

For issues or questions:
- Check browser console for errors
- Review localhost logs during development
- Verify all environment variables are set
- Test with demo data before production use

---

**Platform Version**: 1.0 (MVP)
**Built with**: React, Vite, Tailwind CSS, Radix UI, Google OAuth
**Last Updated**: June 2024
