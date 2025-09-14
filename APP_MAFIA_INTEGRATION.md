# App Mafia v2 Integration Guide

## 🚀 Overview

This guide shows how to integrate **WhoCrawledMe** AI bot tracking with your **App Mafia v2** content generation platform deployed at `https://app-mafia-v2.vercel.app/`.

## 🎯 What You'll Get

- **Real-time AI bot detection** on your content generation platform
- **Content generation analytics** - track which AI platforms are accessing your generated content
- **User behavior insights** - understand how users interact with your AI content generator
- **Competitive intelligence** - monitor how AI platforms crawl content generation tools

## 📦 Files Created

### 1. Enhanced Tracking Script
**File**: `/public/app-mafia-tracker.js`
- Advanced AI bot detection
- Content generation event tracking
- Cross-origin compatible
- Session management
- Real-time analytics

### 2. Enhanced API Endpoint
**File**: `/src/app/api/track/route.ts`
- CORS headers for App Mafia domain
- Enhanced data collection
- App Mafia specific event tracking
- Cross-origin request handling

## 🛠 Integration Steps

### Step 1: Deploy WhoCrawledMe

First, deploy WhoCrawledMe to get your tracking endpoint:

```bash
# In WhoCrawledMe directory
pnpm build
# Deploy to Vercel or your preferred platform
```

**Your tracking endpoint will be**: `https://your-whocrawledme-domain.vercel.app/api/track`

### Step 2: Add Tracking to App Mafia

Add this script to your App Mafia v2 application:

#### Option A: Direct Script Include

Add to your `pages/_app.tsx` or main layout:

```tsx
import Script from 'next/script';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Script
        src="https://your-whocrawledme-domain.vercel.app/app-mafia-tracker.js"
        strategy="afterInteractive"
      />
    </>
  );
}
```

#### Option B: Self-Hosted Script

1. Copy `app-mafia-tracker.js` to your App Mafia `/public` folder
2. Update the endpoint URL in the script:
   ```javascript
   const TRACKING_CONFIG = {
     endpoint: 'https://your-whocrawledme-domain.vercel.app/api/track',
     // ... rest of config
   };
   ```
3. Include in your app:
   ```tsx
   <Script src="/app-mafia-tracker.js" strategy="afterInteractive" />
   ```

### Step 3: Configure Tracking Endpoint

Update the tracking script endpoint URL:

```javascript
// In app-mafia-tracker.js, line 6:
endpoint: 'https://your-actual-whocrawledme-domain.vercel.app/api/track',
```

### Step 4: Update CORS Settings (Important!)

Update the CORS origin in your WhoCrawledMe API to match your actual App Mafia domain:

```typescript
// In /src/app/api/track/route.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://app-mafia-v2.vercel.app', // Your actual domain
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};
```

## 📊 Tracking Events

The integration automatically tracks these events:

### Core Events
- `page_view` - When users visit any page
- `content_generation_start` - When AI content generation begins
- `content_generation_success` - When content is successfully generated
- `form_submit` - When forms are submitted
- `content_action` - When users copy or download content

### AI Bot Detection
- `potential_ai_bot` - When AI bot characteristics are detected
- Enhanced bot scoring and confidence levels
- Platform-specific bot identification

### User Interactions
- Click tracking on copy/download buttons
- Form submission tracking
- Session duration tracking
- Page unload events

## 🎨 Custom Event Tracking

You can track custom events in your App Mafia code:

```javascript
// Track custom content generation events
window.trackWhoCrawledMe('custom_content_type', {
  content_type: 'marketing_copy',
  template_used: 'email_template_1',
  user_tier: 'premium',
  generation_time: '2.3s'
});

// Track user engagement
window.trackWhoCrawledMe('user_engagement', {
  action: 'template_selected',
  template_id: 'social_media_post',
  user_id: 'user_123'
});
```

## 📈 Analytics Dashboard

Once integrated, you'll see App Mafia data in your WhoCrawledMe dashboard:

### Enhanced Metrics
- **Content Generation Bots**: AI platforms crawling your generated content
- **User Session Analytics**: How users interact with your content generator
- **Geographic Intelligence**: Where your AI-generated content is being accessed
- **Platform Performance**: Which AI platforms prefer your generated content

### Filtering
- Filter by `source: app-mafia-v2` to see only App Mafia traffic
- Segment by event types (page_view, content_generation, etc.)
- Analyze bot confidence scores for content generation pages

## 🔧 Advanced Configuration

### Debug Mode
Enable debug mode during development:

```javascript
// In app-mafia-tracker.js
const TRACKING_CONFIG = {
  // ...
  debug: true // Set to false in production
};
```

### Custom Bot Detection
Add custom bot detection rules for your specific use case:

```javascript
// In your custom tracking code
window.trackWhoCrawledMe('custom_bot_detection', {
  suspected_bot: true,
  detection_reason: 'unusual_generation_pattern',
  requests_per_minute: 50,
  user_agent_analysis: 'automated_tool'
});
```

### Environment-Specific Endpoints

```javascript
const TRACKING_CONFIG = {
  endpoint: process.env.NODE_ENV === 'production'
    ? 'https://your-whocrawledme-domain.vercel.app/api/track'
    : 'http://localhost:3001/api/track',
  // ...
};
```

## 🚨 Testing Integration

### Step 1: Local Testing
1. Run WhoCrawledMe locally: `pnpm dev`
2. Update tracking endpoint to `http://localhost:3001/api/track`
3. Test from your App Mafia development environment

### Step 2: Production Testing
```javascript
// Test tracking in browser console
fetch('https://your-whocrawledme-domain.vercel.app/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event_type: 'test_event',
    source: 'app-mafia-v2',
    url: window.location.href
  })
}).then(r => r.json()).then(console.log);
```

### Step 3: Verify Data
Check your WhoCrawledMe dashboard for:
- Events with `source: app-mafia-v2`
- Proper event types and data
- Bot detection working correctly

## 🔐 Security Considerations

### CORS Security
- Only allow your App Mafia domain in CORS settings
- Use HTTPS for all tracking requests
- Validate all incoming data

### Data Privacy
- Track only necessary data
- Consider GDPR compliance for EU users
- Implement data retention policies

### Rate Limiting
Consider adding rate limiting to your tracking endpoint:

```typescript
// Example rate limiting logic
const rateLimitByIP = new Map();
const RATE_LIMIT = 100; // requests per minute

if (rateLimitByIP.get(ip) > RATE_LIMIT) {
  return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
}
```

## 📝 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify CORS headers match your App Mafia domain exactly
   - Check for trailing slashes in domains
   - Ensure OPTIONS method is handled

2. **Tracking Not Working**
   - Check browser console for JavaScript errors
   - Verify endpoint URL is correct
   - Test with debug mode enabled

3. **No Data in Dashboard**
   - Check Supabase database connection
   - Verify table schema matches expected format
   - Look for API errors in logs

### Debug Checklist
- [ ] Tracking script loads without errors
- [ ] API endpoint returns 200 status
- [ ] CORS headers are correct
- [ ] Events appear in browser network tab
- [ ] Data appears in Supabase database

## 🎯 Next Steps

1. **Deploy WhoCrawledMe** to your preferred hosting platform
2. **Add tracking script** to App Mafia v2
3. **Configure CORS** with your actual domains
4. **Test thoroughly** in development and production
5. **Monitor dashboard** for AI bot activity on your content generation platform

## 📞 Support

If you need help with integration:
- Check browser console for errors
- Verify CORS configuration
- Test API endpoints manually
- Review network requests in browser dev tools

---

**🎉 Once integrated, you'll have comprehensive AI bot intelligence for your content generation platform!**