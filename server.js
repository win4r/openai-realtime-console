import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// 正确的CORS配置
app.use(cors({
  origin: 'http://localhost:3000', // 替换为你的React应用的URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/api/news', async (req, res) => {
  try {
    const { q } = req.query;
    const apiKey = process.env.SERPAPI_API_KEY;

    if (!apiKey) {
      throw new Error('SERPAPI API key is not set');
    }

    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_news',
        q,
        gl: 'us',
        hl: 'en',
        api_key: apiKey
      }
    });

    const newsResults = response.data.news_results;
    res.json(newsResults);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: 'Failed to fetch news', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});