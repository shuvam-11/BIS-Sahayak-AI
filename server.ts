import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { BIS_STANDARDS, BIS_LABORATORIES, ADMIN_DOCUMENTS } from './src/data/bisKnowledgeBase';
import { searchBISKnowledge, generateSourceGroundedResponse, extractProductUnderstanding } from './src/services/ragEngine';
import { AdminDocument } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory admin documents store for re-indexing and version management
let currentAdminDocuments: AdminDocument[] = [...ADMIN_DOCUMENTS];

// Initialize Gemini client lazily if key is available
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ================= API ROUTES =================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    totalStandardsIndexed: BIS_STANDARDS.length,
    totalLaboratoriesIndexed: BIS_LABORATORIES.length,
  });
});

// Primary Chat Assistant with Source or Refuse RAG
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { query, language = 'en', isDemoMode = false } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query parameter is required' });
      return;
    }

    // Step 1 & 2: Search & Ground using RAG Engine
    const deterministicResponse = generateSourceGroundedResponse(query, isDemoMode);

    // If Gemini API is available and we have verified or near-match context,
    // we can use Gemini 3.8-flash for language translation or nuanced synthesis,
    // but STRICTLY bounded by the retrieved BIS evidence (Source or Refuse principle).
    const ai = getGeminiClient();
    if (ai && deterministicResponse.reliabilityLevel !== 'NOT_VERIFIED' && deterministicResponse.sources.length > 0) {
      try {
        const topStd = deterministicResponse.potentiallyApplicableStandards[0];
        const prompt = `You are "BIS Sahayak AI", the official intelligent assistant for Indian Standards and BIS services under the Ministry of Consumer Affairs, Food & Public Distribution (Smart India Hackathon Problem 26107).

STRICT RULE: SOURCE OR REFUSE.
- NEVER invent Indian Standard numbers, clauses, test parameters, fees, or laboratory names.
- Only reference the provided BIS standard context:
  Standard: ${topStd?.standardNumber}
  Title: ${topStd?.title}
  Scope: ${topStd?.relevantScope}
  Clauses: ${JSON.stringify(deterministicResponse.sources[0]?.clause)}
  QCO Mandatory: ${deterministicResponse.certificationGuidance?.isMandatoryByQCO ? 'Yes, mandatory by Law' : 'Voluntary'}
  Key Tests: ${JSON.stringify(deterministicResponse.testingGuidance?.requiredTests)}
  Target Language: ${language}

User Question: "${query}"

Provide a concise, polite, source-grounded response explaining which standard applies, its mandatory status under Quality Control Orders, key test requirements, and remind the user to verify with official BIS portal (manakonline.in). If responding in another Indian language (like Hindi, Odia, Bengali), preserve technical terms: BIS, IS numbers, Clauses, ISI mark.`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        if (geminiRes.text) {
          deterministicResponse.answer = geminiRes.text.trim();
        }
      } catch (err) {
        console.warn('Gemini enrichment skipped, using deterministic RAG response:', err);
      }
    }

    res.json(deterministicResponse);
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'Failed to process BIS knowledge query. Please try again.',
      reliabilityLevel: 'NOT_VERIFIED',
    });
  }
});

// Search BIS Standards (Keyword + Semantic)
app.get('/api/search', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  if (!query) {
    res.json({ matches: [], total: 0 });
    return;
  }
  const matches = searchBISKnowledge(query);
  res.json({
    query,
    total: matches.length,
    matches: matches.slice(0, 10),
  });
});

// Standards Catalog
app.get('/api/standards', (req: Request, res: Response) => {
  const category = req.query.category as string;
  const qcoOnly = req.query.qco === 'true';

  let filtered = [...BIS_STANDARDS];
  if (category) {
    filtered = filtered.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (qcoOnly) {
    filtered = filtered.filter(s => s.qcoMandatory);
  }

  res.json({
    total: filtered.length,
    standards: filtered,
  });
});

// Testing Laboratories Directory
app.get('/api/laboratories', (req: Request, res: Response) => {
  const standard = req.query.standard as string;
  let labs = [...BIS_LABORATORIES];

  if (standard) {
    labs = labs.filter(l => l.recognizedStandards.some(s => s.toLowerCase().includes(standard.toLowerCase())));
  }

  res.json({
    total: labs.length,
    laboratories: labs,
  });
});

// Admin Document Management
app.get('/api/admin/documents', (req: Request, res: Response) => {
  res.json({
    total: currentAdminDocuments.length,
    documents: currentAdminDocuments,
  });
});

// Update / Re-index admin document
app.post('/api/admin/reindex', (req: Request, res: Response) => {
  const { docId } = req.body;
  currentAdminDocuments = currentAdminDocuments.map(d => {
    if (d.id === docId) {
      return {
        ...d,
        indexStatus: 'Indexed',
        lastUpdated: new Date().toISOString().split('T')[0],
      };
    }
    return d;
  });
  res.json({ success: true, message: 'Document re-indexed successfully' });
});

// ================= VITE / SPA MIDDLEWARE =================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🇮🇳 BIS Sahayak AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
