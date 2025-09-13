# WhoCrawledMe - AI Platform Intelligence System

<div align="center">
  <h3>🤖 Comprehensive AI-era intelligence platform that monitors, analyzes, and optimizes your brand's visibility across AI platforms and traditional crawlers</h3>
  <p>Real-time tracking of ChatGPT, Claude, Gemini, Perplexity & 20+ AI platforms</p>

  [![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
</div>

## 🚀 Overview

**WhoCrawledMe** is the first comprehensive AI platform intelligence system that provides real-time monitoring and analytics for your brand's visibility across 25+ AI platforms including ChatGPT, Claude, Gemini, Perplexity, and traditional web crawlers.

### The Problem We Solve
- **60% of web traffic** is now AI-driven from platforms like ChatGPT, Claude, and Gemini
- Website owners have **zero visibility** into how their content performs in AI-generated responses
- No competitive benchmarking exists for AI platform positioning
- Traditional SEO tools don't track AI platform optimization (GEO - Generative Engine Optimization)

### Our Solution
- **Real-time AI bot detection** and classification
- **Competitive intelligence** with share-of-voice analysis
- **Query discovery** for trending topics and content gaps
- **AI-driven content optimization** recommendations
- **Brand visibility analytics** across 25+ platforms

## ✨ Key Features

### 🎯 Core Intelligence Platform
- **Real-time Dashboard** - Live activity feed with AI bot detection
- **AI Platform Monitoring** - Track visibility across ChatGPT, Claude, Gemini, Perplexity & more
- **Competitive Intelligence** - Benchmark against competitors with share-of-voice metrics
- **Query Discovery** - Identify trending topics and content optimization opportunities
- **Brand Analytics** - Monitor mention rates, rank positions, and coverage gaps
- **Content Optimization** - AI-powered recommendations for better platform visibility

### 📊 Advanced Analytics
- **Real-time bot detection** with confidence scoring
- **Geographic and network intelligence** for AI bot traffic
- **Time-series analysis** of brand mentions and visibility
- **Competitive positioning** with market share insights
- **Performance metrics** for bandwidth and server impact
- **Custom dashboards** with exportable reports

### 🔧 Technical Features
- **Modern Glass Morphism UI** with responsive design
- **Real-time WebSocket updates** for live monitoring
- **Advanced charting** with Chart.js and Recharts
- **Supabase integration** for real-time data sync
- **TypeScript** for type-safe development
- **Tailwind CSS** for modern, responsive styling

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x with custom glass morphism design
- **UI Components**: Radix UI primitives with custom components
- **Charts**: Chart.js 4.5.0 + React-ChartJS-2 5.3.0 + Recharts 3.2.0
- **Icons**: Lucide React 0.544.0

### Backend & Database
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Real-time**: Supabase real-time channels for live updates
- **API**: Next.js API routes for analytics endpoints

### Utilities
- **Date Handling**: date-fns 4.1.0
- **User Agent Parsing**: ua-parser-js 2.0.5
- **Styling**: clsx + tailwind-merge for conditional classes
- **Variants**: class-variance-authority for component variants

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/whocrawledme.git
   cd whocrawledme
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```

   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**

   Run the SQL schema from `.trae/documents/WhoCrawledMe_Technical_Architecture.md` in your Supabase SQL editor to create the required tables:
   - `users` - User accounts and subscription tiers
   - `websites` - Monitored websites and tracking codes
   - `agent_visits` - AI bot visit records (TimescaleDB hypertable)
   - `agent_types` - AI platform definitions and detection patterns
   - `session_data` - Session analytics and crawl patterns

5. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🔧 Available Scripts

```bash
# Development with Turbopack
pnpm dev

# Production build with Turbopack
pnpm build

# Start production server
pnpm start

# Lint codebase
pnpm lint
```

## 📋 Usage

### 1. **Live Dashboard**
Monitor real-time AI bot activity with:
- Total visits and unique bot counts
- Most active AI platforms
- Recent bot detections with confidence scores
- Geographic and network intelligence

### 2. **AI Intelligence Analytics**
Access comprehensive analytics across multiple tabs:
- **Overview**: Brand visibility metrics and share-of-voice charts
- **Brand**: Detailed brand analytics and mention tracking
- **Competitive**: Competitor benchmarking and market positioning
- **AI Platforms**: Platform-specific monitoring and coverage analysis
- **Queries**: Topic discovery and content gap identification
- **Content**: AI-driven optimization recommendations
- **Real-time**: Live monitoring with instant alerts
- **Analytics**: Advanced metrics and performance insights

### 3. **Website Tracking**
Implement tracking on your websites using:

**JavaScript Method:**
```html
<script>
  fetch('https://your-domain.com/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: window.location.href })
  });
</script>
```

**Simple Pixel Method:**
```html
<img src="https://your-domain.com/api/track" width="1" height="1" style="display:none;" />
```

## 🎨 UI Components

The application features 16+ custom React components:

### Core Components
- **Dashboard** - Real-time bot activity monitoring
- **AnalyticsDashboard** - Main intelligence platform with tabbed interface
- **TimeRangeFilter** - Date range selection for analytics

### Analytics Components
- **MetricsCards** - Key performance indicators
- **BrandVisibilityChart** - Brand mention trends over time
- **ShareOfVoiceChart** - Competitive share analysis
- **VisitsChart** - AI bot visit patterns
- **TopBotsChart** - Most active AI platforms
- **HourlyTrendsChart** - Traffic patterns by hour

### Intelligence Components
- **CompetitiveIntelligence** - Competitor analysis and benchmarking
- **AIPlatformMonitoring** - Platform-specific tracking
- **QueryDiscovery** - Trending topics and content gaps
- **BrandAnalytics** - Detailed brand performance metrics
- **ContentOptimization** - AI-powered recommendations
- **RealTimeMonitoring** - Live activity feed with alerts

## 📁 Project Structure

```
src/
├── app/
│   ├── components/           # React components
│   │   ├── ui/              # Base UI components
│   │   ├── Dashboard.tsx    # Real-time bot monitoring
│   │   ├── AnalyticsDashboard.tsx  # Main analytics platform
│   │   └── [other components...]
│   ├── globals.css          # Global styles with CSS variables
│   └── page.tsx            # Main application page
├── lib/                    # Utility functions
└── types/                  # TypeScript type definitions

public/                     # Static assets
├── track.js               # Tracking script for websites
└── [icons and images...]

.trae/documents/           # Project documentation
├── WhoCrawledMe_Product_Requirements.md
└── WhoCrawledMe_Technical_Architecture.md
```

## 🎯 Target Market & Use Cases

### Primary Users
- **Brand Managers** - Monitor brand visibility across AI platforms
- **SEO Professionals** - Optimize for Generative Engine Optimization (GEO)
- **Digital Marketers** - Track AI platform performance and ROI
- **Content Teams** - Discover trending topics and content gaps

### Subscription Tiers
- **Starter** ($49/month) - 25K visits, 15-day retention, basic analytics
- **Pro** ($149/month) - 100K visits, 90-day retention, advanced analytics
- **Business** ($399/month) - 500K visits, API access, custom features
- **Enterprise** (Custom) - Unlimited visits, white-label, SLA support

## 🚀 Deployment

The application is optimized for Vercel deployment with:

- **Frontend**: Vercel (Next.js) with automatic deployments
- **Database**: Supabase for PostgreSQL + real-time subscriptions
- **Environment**: Production-ready configuration in `vercel.json`

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/whocrawledme)

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Real-time AI bot detection and classification
- ✅ Interactive dashboard with analytics
- ✅ Supabase integration with real-time updates
- ✅ Modern glass morphism UI design

### Phase 2 (In Progress)
- 🔄 API endpoints for Business+ tiers
- 🔄 Advanced competitive intelligence features
- 🔄 Content optimization recommendations
- 🔄 White-label solutions for Enterprise

### Phase 3 (Planned)
- 📋 Machine learning models for better AI bot detection
- 📋 Predictive analytics and forecasting
- 📋 Integration with major CMS platforms
- 📋 Mobile app for real-time monitoring

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- 📧 Email: support@whocrawledme.com
- 💬 Discord: [Join our community](https://discord.gg/whocrawledme)
- 📚 Documentation: [docs.whocrawledme.com](https://docs.whocrawledme.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/whocrawledme/issues)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Supabase](https://supabase.com/)
- UI components powered by [Radix UI](https://www.radix-ui.com/)
- Charts by [Chart.js](https://www.chartjs.org/) and [Recharts](https://recharts.org/)
- Icons by [Lucide](https://lucide.dev/)

---

<div align="center">
  <p>Made with ❤️ for the AI-first web</p>
  <p>© 2024 WhoCrawledMe. AI Platform Intelligence System.</p>
</div>