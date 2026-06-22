# 💖 Bag GPT

**Your AI-powered fashion expert for discovering the coolest, most aesthetic bags of 2026.**

A Y2K-inspired chatbot that recommends trendy designer bags with a fun, girly aesthetic featuring pastel pinks, greens, and yellows (Depop/coquette vibes).

![The Aesthetic Edit](https://img.shields.io/badge/Style-Y2K%20Coquette-FF69B4?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)

## ✨ Features

- 🤖 **AI Chatbot** - Powered by LLM for personalized bag recommendations
- 🚫 **Anti-Basic Filter** - Automatically excludes generic bags (LV Neverfull, Goyard St. Louis, Michael Kors Jet Set)
- 🌸 **Seasonal Selector** - Spring, Summer, Fall, Winter with season-specific trends
- 💰 **Budget Tiers** - $100 (Affordable Chic), $500 (Mid-Tier Designer), $5,000 (Investment), $10,000+ (Ultra-Luxury)
- 🔗 **Shopping Links** - Direct links to official brand sites and resellers (The RealReal, Net-a-Porter, etc.)
- ⭐ **Celebrity Inspiration** - References to bags spotted on Bella Hadid, Hailey Bieber, Dakota Fanning, and more
- 💾 **LocalStorage** - Conversation history saved in your browser
- 📱 **Responsive Design** - Works beautifully on mobile and desktop

## 🎨 Design

Fun, girly Y2K aesthetic with:
- Pastel color palette (pinks, greens, yellows)
- Metallic gradients and glossy effects
- Butterfly motifs and early 2000s design elements
- Chrome text effects and smooth animations

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **Backend:** Express 4, tRPC 11
- **Database:** MySQL (Drizzle ORM)
- **AI:** LLM integration for chatbot responses
- **UI Components:** shadcn/ui
- **Package Manager:** pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- MySQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/itspuneettt/the-aesthetic-edit.git
cd the-aesthetic-edit
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables

Create a `.env` file with:
```env
DATABASE_URL=your_mysql_connection_string
BUILT_IN_FORGE_API_KEY=your_llm_api_key
BUILT_IN_FORGE_API_URL=your_llm_api_url
JWT_SECRET=your_jwt_secret
# ... other environment variables
```

4. Set up the database
```bash
pnpm db:push
```

5. Start the development server
```bash
pnpm dev
```

The app will be running at `http://localhost:3000`

## 📦 Project Structure

```
the-aesthetic-edit/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities
│   │   └── index.css    # Global styles
├── server/              # Express backend
│   ├── _core/           # Core server functionality
│   ├── routers.ts       # tRPC API routes
│   └── db.ts            # Database helpers
├── drizzle/             # Database schema & migrations
└── shared/              # Shared types & constants
```

## 🎯 2026 Fashion Trends

The chatbot is trained on real 2026 fashion trends including:

- **Colors:** Burgundy, chocolate brown, jewel tones (amethyst, sapphire, emerald)
- **Materials:** Suede, nubuck, nappa leather, woven leather, croc-effect
- **Styles:** Chain handles, ladylike top-handle bags, east-west bowling bags, micro bags
- **Brands:** Chanel, Dior, Bottega Veneta, The Row, Khaite, Balenciaga, Celine

## 🛍️ Featured Brands

Direct shopping links to:
- Chanel
- Dior
- Gucci
- Prada
- Bottega Veneta
- Balenciaga
- Celine
- Saint Laurent
- The Row
- Loewe
- The RealReal (pre-owned luxury)

## 🚀 Deployment

Want to deploy this app so your friends can use it? Check out the **[DEPLOYMENT.md](./DEPLOYMENT.md)** guide!

**Quick Deploy Options:**
- **Railway** (Recommended) - Free tier available, supports full-stack apps
- **Render** - Alternative free option
- **Manus** - One-click publish if you built it in Manus

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes!

## 💕 Credits

Built with love for fashion enthusiasts who appreciate aesthetic, trendy bags over basic designer pieces.

---

**No basic bags allowed!** 💅✨
