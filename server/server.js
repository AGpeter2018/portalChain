import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// 🧠 Simple in-memory cache (works while the server runs)
const cache = new Map();

// Helper to fetch with caching and retry
async function fetchWithCacheAndRetry(
  cacheKey,
  url,
  headers = {},
  maxAge = 60 * 1000
) {
  // ✅ Return cached if still fresh
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < maxAge) {
      console.log("⚡ Serving from cache:", cacheKey);
      return data;
    }
  }

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(
          `CoinGecko API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      cache.set(cacheKey, { data, timestamp: Date.now() });
      console.log("✅ Fresh fetch:", cacheKey);
      return data;
    } catch (error) {
      retries--;
      console.error(
        `⚠️ Fetch failed (${retries} retries left):`,
        error.message
      );
      if (retries === 0) throw error;
      await new Promise((resolve) => setTimeout(resolve, 3000)); // wait before retrying
    }
  }
}

// ---------------- ROUTES ----------------

// 🪙 Get list of coins
app.get("/api/coins", async (req, res) => {
  const currency = req.query.currency || "usd";
  const cacheKey = `coins-${currency}`;
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h`;

  try {
    const data = await fetchWithCacheAndRetry(cacheKey, url, {
      "x-cg-api-key": "CG-PiqcP3PrrVXeWdGcEnud4UBs",
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🧩 Get single coin details
app.get("/api/coin/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `coin-${id}`;
  const url = `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`;

  try {
    const data = await fetchWithCacheAndRetry(cacheKey, url, {
      "x-cg-api-key": "CG-PiqcP3PrrVXeWdGcEnud4UBs",
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📊 Get coin history (chart)
app.get("/api/coin/:id/history", async (req, res) => {
  const { id } = req.params;
  const currency = req.query.currency || "usd";
  const days = req.query.days || 10;
  const cacheKey = `history-${id}-${currency}-${days}`;
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

  try {
    const data = await fetchWithCacheAndRetry(
      cacheKey,
      url,
      {
        "x-cg-api-key": "CG-PiqcP3PrrVXeWdGcEnud4UBs",
      },
      2 * 60 * 1000
    ); // cache 2 minutes
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
