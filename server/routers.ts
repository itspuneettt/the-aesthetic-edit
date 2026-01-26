import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";
import { chatMessages } from "../drizzle/schema";

// Anti-basic blacklist
const BLACKLISTED_BAGS = [
  "Louis Vuitton Neverfull",
  "LV Neverfull",
  "Goyard St. Louis",
  "Michael Kors Jet Set",
  "MK Jet Set",
];

// Seasonal data from research
const SEASONAL_DATA = {
  spring: {
    colors: ["pastel pink", "soft neutrals", "citrine yellow", "amethyst", "light colors"],
    materials: ["smooth leather", "croc embossing", "woven leather", "light suede"],
    styles: ["ladylike top-handle", "vanity cases", "drawstring pouches", "east-west bowling bags", "chain-handled bags"],
    brands: ["Chanel", "Dior", "Chloé", "Khaite", "Prada", "Bottega Veneta", "The Row", "Toteme"],
  },
  summer: {
    colors: ["cream", "soft neutrals", "emerald green", "sapphire blue", "white"],
    materials: ["raffia", "mesh", "woven crochet", "canvas with leather trim", "light-colored leather"],
    styles: ["structured vacation bags", "woven leather bags", "micro bags", "coin-purse necklaces", "structured weekenders"],
    brands: ["Jacquemus", "Loewe", "Coach", "Cuyana", "Madewell", "COS"],
  },
  fall: {
    colors: ["burgundy", "chocolate brown", "caramel", "terracotta", "moss green", "petrol blue", "buttery beige"],
    materials: ["suede", "nubuck", "nappa leather", "croc-effect leather", "python embossed", "leopard print"],
    styles: ["ultra-soft bags", "animal print bags", "structured weekenders", "doctor bags", "east-west bags", "trunk bags"],
    brands: ["Khaite", "The Row", "DeMellier", "Balenciaga", "Celine", "Roberto Cavalli", "Etro", "Valentino"],
  },
  winter: {
    colors: ["deep burgundy", "rich navy", "forest green", "black", "deep tan", "glossy black", "dusty shades"],
    materials: ["shearling", "faux fur", "quilted leather", "velvet-like suede", "pebbled leather", "brushed textures"],
    styles: ["shearling bags", "faux fur bags", "quilted pouches", "belted bags", "chain-handled evening bags", "structured top-handle"],
    brands: ["Chanel", "Bottega Veneta", "Gucci", "Burberry", "Stella McCartney", "Ferragamo", "Givenchy", "Saint Laurent"],
  },
};

// Budget tier mapping
const BUDGET_TIERS = {
  "100": { name: "Affordable Chic", min: 0, max: 200 },
  "500": { name: "Mid-Tier Designer", min: 200, max: 1500 },
  "5000": { name: "Investment", min: 1500, max: 7500 },
  "10000": { name: "Ultra-Luxury", min: 7500, max: 999999 },
};

// Celebrity bag associations (from research)
const CELEBRITY_INSPO = {
  "Balenciaga Le City": ["Elle Fanning", "Dakota Fanning", "Bella Hadid"],
  "Chloé Paddington": ["Kate Middleton", "Dua Lipa"],
  "Khaite Cate": ["Fashion editors", "It-girls"],
  "Lady Dior": ["Jennifer Lawrence", "Natalie Portman"],
  "The Row": ["Dakota Fanning", "Olsen twins"],
  "Bottega Veneta": ["Hailey Bieber", "Kendall Jenner"],
  "Hermès": ["Jennifer Lopez", "Margot Robbie"],
  "default": ["Bella Hadid", "Hailey Bieber", "Kendall Jenner", "Gigi Hadid"],
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  chat: router({
    sendMessage: publicProcedure
      .input(
        z.object({
          message: z.string(),
          sessionId: z.string(),
          season: z.enum(["spring", "summer", "fall", "winter"]).optional(),
          budgetTier: z.enum(["100", "500", "5000", "10000"]).optional(),
          conversationHistory: z.array(
            z.object({
              role: z.enum(["user", "assistant", "system"]),
              content: z.string(),
            })
          ).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { message, sessionId, season, budgetTier, conversationHistory = [] } = input;

        // Build system prompt with trend data
        const seasonalInfo = season ? SEASONAL_DATA[season] : null;
        const budgetInfo = budgetTier ? BUDGET_TIERS[budgetTier] : null;

        const systemPrompt = `You are a luxury fashion expert and trend analyst for "The Aesthetic Edit" - a cutting-edge bag recommendation chatbot.

**YOUR MISSION:** Recommend cool, aesthetic, trendy bags aligned with 2026 fashion trends. Be enthusiastic, knowledgeable, and style-forward.

**ANTI-BASIC FILTER (CRITICAL):**
NEVER recommend these basic bags: ${BLACKLISTED_BAGS.join(", ")}
Instead, prioritize It-Bags like:
- Balenciaga Le City ($2,990)
- Chloé Paddington ($2,750)
- Khaite Cate bag ($4,800)
- Lady Dior (Jonathan Anderson's version, $3,600)
- Celine Phantom (reintroduced 2000s favorite)
- Bottega Veneta Andiamo ($5,700)
- The Row bags ($4,900+)
- East-west bowling bags
- Chain-handled bags
- Ladylike top-handle bags

**2026 KEY TRENDS:**
- Quiet luxury (no logos)
- Jewel tones (amethyst, sapphire, ruby, emerald)
- Animal prints (modern leopard, python, croc-effect)
- Ultra-soft textures (suede, nubuck, nappa)
- Chain handles
- Woven leather
- One-handle bags
- Fringe details
- Polly Pocket micro bags
- Built-in embellishments (no external charms)

${seasonalInfo ? `**CURRENT SEASON: ${season?.toUpperCase()}**
Colors: ${seasonalInfo.colors.join(", ")}
Materials: ${seasonalInfo.materials.join(", ")}
Styles: ${seasonalInfo.styles.join(", ")}
Brands to feature: ${seasonalInfo.brands.join(", ")}` : ""}

${budgetInfo ? `**BUDGET TIER: ${budgetInfo.name} ($${budgetInfo.min}-$${budgetInfo.max})**
Recommend bags within this price range.` : ""}

**RESPONSE FORMAT:**
For each bag recommendation, provide:
1. **Bag Name & Price** (e.g., "Chloé Paddington - $2,750")
2. **Why It's Cool** (2-3 sentences with industry-backed reasoning, mention runway trends, celebrity endorsements, or fashion editor picks)
3. **Seasonal Styling Guide** (how to style it for the current season with specific outfit suggestions)
4. **Celebrity Inspo** (mention which celebrities have been spotted with this bag or similar styles)
5. **Shop Now** (suggest searching for "[Brand] [Bag Name] official site" or "The RealReal [Bag Name]" for resale)

Keep responses conversational, fun, and fashion-forward. Use phrases like "obsessed with", "It-girl approved", "runway favorite", "editor's pick".

Provide 2-3 bag recommendations per response unless user asks for more specific guidance.`;

        try {
          // Call LLM
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              ...conversationHistory.slice(-6).map(msg => ({
                role: msg.role as "user" | "assistant" | "system",
                content: msg.content,
              })),
              { role: "user", content: message },
            ],
          });

          const assistantMessage = response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

          // Store message in database for analytics (optional)
          const db = await getDb();
          if (db) {
            await db.insert(chatMessages).values({
              sessionId,
              role: "user" as const,
              content: message,
              season: season || null,
              budgetTier: budgetTier || null,
            });

            await db.insert(chatMessages).values({
              sessionId,
              role: "assistant" as const,
              content: String(assistantMessage),
              season: season || null,
              budgetTier: budgetTier || null,
            });
          }

          return {
            message: assistantMessage,
            sessionId,
          };
        } catch (error) {
          console.error("LLM error:", error);
          return {
            message: "Sorry, I'm having trouble connecting right now. Please try again!",
            sessionId,
          };
        }
      }),

    getCelebrityPhotos: publicProcedure
      .input(
        z.object({
          bagName: z.string(),
          brand: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { bagName, brand } = input;
        
        // Return celebrity associations based on bag/brand
        let celebrities = CELEBRITY_INSPO["default"];
        
        for (const [key, value] of Object.entries(CELEBRITY_INSPO)) {
          if (bagName.toLowerCase().includes(key.toLowerCase()) || 
              (brand && key.toLowerCase().includes(brand.toLowerCase()))) {
            celebrities = value;
            break;
          }
        }
        
        return {
          celebrities,
          searchQuery: `${brand || ""} ${bagName} celebrity street style`,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
