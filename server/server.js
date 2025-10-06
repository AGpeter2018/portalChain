import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/coins", async (req, res) => {
  const currency = req.query.currency || "usd";

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&price_change_percentage=1h`;

  let retries = 3; // retry 3 times if it fails

  while (retries > 0) {
    try {
      // add a 7-second timeout controller
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(url, {
        headers: { "x-cg-api-key": "CG-PiqcP3PrrVXeWdGcEnud4UBs" },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(
          `CoinGecko API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return res.json(data); // ✅ success — send back data
    } catch (error) {
      retries--;

      // Common temporary network issue
      if (error.name === "AbortError") {
        console.error(
          ` Timeout: CoinGecko took too long. Retries left: ${retries}`
        );
      } else {
        console.error(
          ` Fetch failed: ${error.message}. Retries left: ${retries}`
        );
      }

      if (retries === 0) {
        // give up after 3 attempts
        return res.status(500).json({
          error: "Failed to fetch data from CoinGecko after multiple attempts",
          message: error.message,
        });
      }

      // wait 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
});

const cache = new Map(); // simple in-memory cache
const CACHE_TTL = 60 * 1000; // 1 minute cache time

app.get("/api/coin/:id", async (req, res) => {
  const { id } = req.params;
  const currency = req.query.currency || "usd";
  const cacheKey = `${id}_${currency}`;
  const now = Date.now();

  // ✅ Serve from cache if not expired
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (now - timestamp < CACHE_TTL) {
      console.log("Serving from cache:", cacheKey);
      return res.json(data);
    }
  }

  const url = `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`;

  try {
    const response = await fetch(url, {
      headers: { "x-cg-api-key": "CG-PiqcP3PrrVXeWdGcEnud4UBs" },
    });

    if (response.status === 429) {
      console.warn("Rate limit hit, serving old cache if available");
      if (cache.has(cacheKey)) {
        const { data } = cache.get(cacheKey);
        return res.json(data); // fallback to previous cached data
      }
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const data = await response.json();

    // ✅ Save to cache
    cache.set(cacheKey, { data, timestamp: now });
    res.json(data);
  } catch (error) {
    console.error("Error fetching CoinGecko data:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
