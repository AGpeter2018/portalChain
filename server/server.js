import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
// app.use(cors());

const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://portalchain.onrender.com", // your backend
  "https://your-frontend-domain.vercel.app", // (replace if deployed on Vercel)
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// 🧠 Simple in-memory cache (works while the server runs)
const cache = new Map();

// Helper to fetch with caching and retry
// Helper to fetch with caching and retry
async function fetchWithCacheAndRetry(
  cacheKey,
  urlPath, // Take the path instead of full URL to handle Pro/Demo base URLs
  maxAge = 10 * 60 * 1000
) {
  // ✅ Return cached if still fresh
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < maxAge) {
      console.log("⚡ Serving from cache:", cacheKey);
      return data;
    }
  }

  const apiKey = process.env.COINGECKO_API_KEY;
  let baseUrl = "https://api.coingecko.com/api/v3";
  let headers = {};

  if (apiKey) {
    // Pro keys typically start with 'CG-' and use a different base URL
    if (apiKey.startsWith("CG-")) {
      baseUrl = "https://pro-api.coingecko.com/api/v3";
      headers["x-cg-pro-api-key"] = apiKey;
    } else {
      headers["x-cg-demo-api-key"] = apiKey;
    }
  }

  const fullUrl = `${baseUrl}${urlPath}`;
  let retries = 2;

  while (retries >= 0) {
    try {
      console.log(`📡 Fetching: ${fullUrl}`);
      const response = await fetch(fullUrl, { headers });

      if (response.status === 429) {
        console.warn(`⚠️ Rate limit hit for ${cacheKey}. Retries left: ${retries}`);
        if (cache.has(cacheKey)) {
          console.log("📦 Serving expired fallback from cache:", cacheKey);
          return cache.get(cacheKey).data;
        }
        if (retries === 0) {
          throw new Error("CoinGecko rate limit exceeded. Try again in a few minutes.");
        }
      } else if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { statusText: response.statusText };
        }
        console.error(`❌ CoinGecko Error (${response.status}):`, errorData);
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      } else {
        const data = await response.json();
        cache.set(cacheKey, { data, timestamp: Date.now() });
        console.log("✅ Fresh fetch:", cacheKey);
        return data;
      }
    } catch (error) {
      console.error(`🚨 Fetch attempt failed (${retries} retries left):`, error.message);
      if (retries === 0) throw error;
    }

    retries--;
    if (retries >= 0) {
      const waitTime = 2000 * (2 - retries);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

// ---------------- ROUTES ----------------

// 🪙 Get list of coins
app.get("/api/coins", async (req, res) => {
  const currency = req.query.currency || "usd";
  const cacheKey = `coins-${currency}`;
  const urlPath = `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h`;

  try {
    const data = await fetchWithCacheAndRetry(cacheKey, urlPath);
    res.json(data);
  } catch (error) {
    console.error("❌ Backend error in /api/coins:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 🧩 Get single coin details
app.get("/api/coin/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `coin-${id}`;
  const urlPath = `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`;

  try {
    const data = await fetchWithCacheAndRetry(cacheKey, urlPath);
    res.json(data);
  } catch (error) {
    console.error(`❌ Backend error in /api/coin/${id}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// 📊 Get coin history (chart)
app.get("/api/coin/:id/history", async (req, res) => {
  const { id } = req.params;
  const currency = req.query.currency || "usd";
  const days = req.query.days || 10;
  const cacheKey = `history-${id}-${currency}-${days}`;
  const urlPath = `/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

  try {
    const data = await fetchWithCacheAndRetry(cacheKey, urlPath, 5 * 60 * 1000); // 5 min cache
    res.json(data);
  } catch (error) {
    console.error(`❌ Backend error in /api/coin/${id}/history:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

