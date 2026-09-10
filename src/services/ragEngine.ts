/**
 * BIS Sahayak AI - RAG Retrieval & Verification Engine
 *
 * Implements:
 * - Hybrid keyword + intent/product search
 * - Product-specific relevance ranking
 * - Source-grounded answers
 * - Follow-up detection
 * - Reliability levels
 * - Clause-backed citations
 *
 * Important:
 * This engine only retrieves from the local BIS knowledge base.
 * It does not claim live BIS database access.
 */

import { BIS_STANDARDS, BIS_LABORATORIES } from '../data/bisKnowledgeBase';
import {
  BISStandard,
  StructuredAIResponse,
  ReliabilityLevel,
  ProductUnderstanding
} from '../types';

export interface SearchMatch {
  standard: BISStandard;
  score: number;
  matchedKeywords: string[];
  matchedClauses: string[];
  relevanceExplanation: string;
}

/* ============================================================
   HELPERS
   ============================================================ */

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsPhrase(text: string, phrase: string): boolean {
  return normalizeText(text).includes(normalizeText(phrase));
}

function standardSearchText(std: BISStandard): string {
  return normalizeText(
    [
      std.standardNumber,
      std.title,
      std.category,
      std.scopeSummary,
      ...std.productsCovered,
      ...std.keywords
    ].join(' ')
  );
}

/* ============================================================
   PRODUCT INTENT
   ============================================================ */

type ProductIntent =
  | 'electric-kettle'
  | 'water-bottle'
  | 'pressure-cooker'
  | 'helmet'
  | 'led-lamp'
  | 'packaged-water'
  | 'toy'
  | 'gold-jewellery'
  | 'plug-socket'
  | 'cement'
  | 'cable'
  | null;

function detectProductIntent(query: string): ProductIntent {
  const lower = normalizeText(query);

  // IMPORTANT:
  // Electric kettle must be checked before generic electrical
  // appliance detection.
  if (
    lower.includes('electric kettle') ||
    lower.includes('electric water kettle') ||
    lower.includes('kettle jug') ||
    lower.includes('electric jug')
  ) {
    return 'electric-kettle';
  }

  if (
    lower.includes('water bottle') ||
    lower.includes('vacuum flask') ||
    lower.includes('thermos') ||
    lower.includes('flask')
  ) {
    return 'water-bottle';
  }

  if (
    lower.includes('pressure cooker') ||
    lower.includes('pressure-cooker')
  ) {
    return 'pressure-cooker';
  }

  if (
    lower.includes('helmet') ||
    lower.includes('two wheeler helmet') ||
    lower.includes('two-wheeler helmet') ||
    lower.includes('headgear')
  ) {
    return 'helmet';
  }

  if (
    lower.includes('led lamp') ||
    lower.includes('led bulb') ||
    lower.includes('led')
  ) {
    return 'led-lamp';
  }

  if (
    lower.includes('packaged drinking water') ||
    lower.includes('packaged water') ||
    lower.includes('mineral water')
  ) {
    return 'packaged-water';
  }

  if (
    lower.includes('toy') ||
    lower.includes('toys') ||
    lower.includes('doll') ||
    lower.includes('board game')
  ) {
    return 'toy';
  }

  if (
    lower.includes('gold jewellery') ||
    lower.includes('gold jewelry') ||
    lower.includes('jewellery') ||
    lower.includes('jewelry') ||
    lower.includes('hallmark')
  ) {
    return 'gold-jewellery';
  }

  if (
    lower.includes('plug') ||
    lower.includes('socket') ||
    lower.includes('socket outlet') ||
    lower.includes('socket-outlet') ||
    lower.includes('pin plug')
  ) {
    return 'plug-socket';
  }

  if (
    lower.includes('cement') ||
    lower.includes('concrete') ||
    lower.includes('opc')
  ) {
    return 'cement';
  }

  if (
    lower.includes('electric cable') ||
    lower.includes('electrical cable') ||
    lower.includes('wire') ||
    lower.includes('pvc cable')
  ) {
    return 'cable';
  }

  return null;
}

/* ============================================================
   PRODUCT-SPECIFIC SCORE BOOST
   ============================================================ */

function getProductSpecificBoost(
  std: BISStandard,
  productIntent: ProductIntent
): number {
  if (!productIntent) {
    return 0;
  }

  const text = standardSearchText(std);

  switch (productIntent) {
    case 'electric-kettle':
      if (std.standardNumber === 'IS 367:1993') {
        return 120;
      }

      if (
        text.includes('electric kettle') ||
        text.includes('electric kettles') ||
        text.includes('electric jug')
      ) {
        return 70;
      }

      // General electrical-appliance safety can be related,
      // but should not outrank the product-specific standard.
      if (
        text.includes('household and similar electrical appliances') ||
        text.includes('electrical appliances')
      ) {
        return 10;
      }

      return 0;

    case 'water-bottle':
      if (
        text.includes('vacuum flask') ||
        text.includes('water bottle') ||
        text.includes('thermos')
      ) {
        return 80;
      }
      return 0;

    case 'pressure-cooker':
      if (text.includes('pressure cooker')) {
        return 80;
      }
      return 0;

    case 'helmet':
      if (text.includes('helmet') || text.includes('headgear')) {
        return 80;
      }
      return 0;

    case 'led-lamp':
      if (text.includes('led lamp') || text.includes('led')) {
        return 80;
      }
      return 0;

    case 'packaged-water':
      if (
        text.includes('packaged drinking water') ||
        text.includes('packaged water')
      ) {
        return 80;
      }
      return 0;

    case 'toy':
      if (text.includes('toy') || text.includes('toys')) {
        return 80;
      }
      return 0;

    case 'gold-jewellery':
      if (
        text.includes('gold jewellery') ||
        text.includes('gold jewelry') ||
        text.includes('jewellery') ||
        text.includes('jewelry')
      ) {
        return 80;
      }
      return 0;

    case 'plug-socket':
      if (
        text.includes('plug') ||
        text.includes('socket') ||
        text.includes('socket-outlet')
      ) {
        return 80;
      }
      return 0;

    case 'cement':
      if (text.includes('cement')) {
        return 80;
      }
      return 0;

    case 'cable':
      if (
        text.includes('cable') ||
        text.includes('wire') ||
        text.includes('pvc')
      ) {
        return 80;
      }
      return 0;

    default:
      return 0;
  }
}

/* ============================================================
   UNRELATED PRODUCT PENALTY
   ============================================================ */

function getUnrelatedPenalty(
  std: BISStandard,
  productIntent: ProductIntent
): number {
  if (!productIntent) {
    return 0;
  }

  const text = standardSearchText(std);

  switch (productIntent) {
    case 'electric-kettle': {
      const unrelatedTerms = [
        'vacuum flask',
        'water bottle',
        'thermos',
        'led lamp',
        'helmet',
        'packaged drinking water',
        'cement',
        'gold jewellery',
        'gold jewelry',
        'toy',
        'toys',
        'plug',
        'socket',
        'pressure cooker'
      ];

      return unrelatedTerms.some(term => text.includes(term))
        ? -100
        : 0;
    }

    case 'water-bottle':
      return text.includes('electric kettle') ||
        text.includes('helmet') ||
        text.includes('cement')
        ? -80
        : 0;

    case 'pressure-cooker':
      return text.includes('electric kettle') ||
        text.includes('helmet') ||
        text.includes('cement')
        ? -80
        : 0;

    case 'helmet':
      return text.includes('electric kettle') ||
        text.includes('water bottle') ||
        text.includes('cement')
        ? -80
        : 0;

    case 'led-lamp':
      return text.includes('electric kettle') ||
        text.includes('helmet') ||
        text.includes('pressure cooker')
        ? -80
        : 0;

    case 'packaged-water':
      return text.includes('electric kettle') ||
        text.includes('helmet') ||
        text.includes('cement')
        ? -80
        : 0;

    case 'toy':
      return text.includes('electric kettle') ||
        text.includes('cement') ||
        text.includes('helmet')
        ? -80
        : 0;

    case 'gold-jewellery':
      return text.includes('electric kettle') ||
        text.includes('cement') ||
        text.includes('helmet')
        ? -80
        : 0;

    case 'plug-socket':
      return text.includes('electric kettle') ||
        text.includes('helmet') ||
        text.includes('cement')
        ? -80
        : 0;

    case 'cement':
      return text.includes('electric kettle') ||
        text.includes('helmet') ||
        text.includes('water bottle')
        ? -80
        : 0;

    case 'cable':
      return text.includes('electric kettle') ||
        text.includes('helmet') ||
        text.includes('gold jewellery')
        ? -80
        : 0;

    default:
      return 0;
  }
}

/* ============================================================
   HYBRID BIS SEARCH
   ============================================================ */

/**
 * Hybrid Search combining:
 * - Exact standard number matching
 * - Title matching
 * - Product coverage
 * - Keywords
 * - Token overlap
 * - Product intent
 * - Unrelated-product penalties
 */
export function searchBISKnowledge(query: string): SearchMatch[] {
  const normalized = normalizeText(query);

  const tokens = normalized
    .split(/[\s,./\-+]+/)
    .filter(token => token.length > 2);

  const productIntent = detectProductIntent(query);

  const matches: SearchMatch[] = [];

  for (const std of BIS_STANDARDS) {
    let score = 0;

    const matchedKeywords: string[] = [];
    const matchedClauses: string[] = [];

    const stdText = standardSearchText(std);

    /* --------------------------------------------------------
       1. Exact standard number
       -------------------------------------------------------- */

    const numOnly = std.standardNumber.replace(/[^\d]/g, '');

    if (
      normalized.includes(normalizeText(std.standardNumber)) ||
      (numOnly && normalized.includes(numOnly))
    ) {
      score += 100;
      matchedKeywords.push(std.standardNumber);
    }

    /* --------------------------------------------------------
       2. Exact title
       -------------------------------------------------------- */

    if (containsPhrase(normalized, std.title)) {
      score += 60;
      matchedKeywords.push(std.title);
    }

    /* --------------------------------------------------------
       3. Product coverage
       -------------------------------------------------------- */

    for (const prod of std.productsCovered) {
      if (containsPhrase(normalized, prod)) {
        score += 45;
        matchedKeywords.push(prod);
      }
    }

    /* --------------------------------------------------------
       4. Keyword matching
       -------------------------------------------------------- */

    for (const kw of std.keywords) {
      if (containsPhrase(normalized, kw)) {
        score += 15;
        matchedKeywords.push(kw);
      }
    }

    /* --------------------------------------------------------
       5. Individual token overlap
       -------------------------------------------------------- */

    for (const token of tokens) {
      if (normalizeText(std.title).includes(token)) {
        score += 3;
      }

      if (normalizeText(std.scopeSummary).includes(token)) {
        score += 2;
      }

      if (normalizeText(std.category).includes(token)) {
        score += 4;
      }

      for (const clause of std.clauses) {
        if (
          normalizeText(clause.clauseTitle).includes(token) ||
          normalizeText(clause.requirement).includes(token)
        ) {
          score += 2;

          if (!matchedClauses.includes(clause.clauseNumber)) {
            matchedClauses.push(
              `${clause.clauseNumber}: ${clause.clauseTitle}`
            );
          }
        }
      }
    }

    /* --------------------------------------------------------
       6. Product-specific boost
       -------------------------------------------------------- */

    score += getProductSpecificBoost(std, productIntent);

    /* --------------------------------------------------------
       7. Unrelated-product penalty
       -------------------------------------------------------- */

    score += getUnrelatedPenalty(std, productIntent);

    /* --------------------------------------------------------
       8. Superseded standards receive lower priority
       -------------------------------------------------------- */

    if (std.status === 'Superseded') {
      score -= 20;
    }

    /* --------------------------------------------------------
       Add result
       -------------------------------------------------------- */

    if (score > 5) {
      let explanation = `Covers ${
        std.productsCovered[0] || std.title
      }.`;

      if (matchedKeywords.length > 0) {
        explanation += ` Matches query keywords: ${Array.from(
          new Set(matchedKeywords)
        )
          .slice(0, 4)
          .join(', ')}.`;
      }

      if (productIntent) {
        if (
          productIntent === 'electric-kettle' &&
          std.standardNumber === 'IS 367:1993'
        ) {
          explanation +=
            ' Strong product-specific match for electric kettles.';
        } else if (getProductSpecificBoost(std, productIntent) > 0) {
          explanation += ' Product-specific relevance boost applied.';
        }
      }

      matches.push({
        standard: std,
        score,
        matchedKeywords: Array.from(new Set(matchedKeywords)),
        matchedClauses: matchedClauses.slice(0, 3),
        relevanceExplanation: explanation
      });
    }
  }

  /* ----------------------------------------------------------
     Final ranking
     ---------------------------------------------------------- */

  return matches.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    // Prefer non-superseded standards when scores are equal.
    if (
      a.standard.status === 'Superseded' &&
      b.standard.status !== 'Superseded'
    ) {
      return 1;
    }

    if (
      a.standard.status !== 'Superseded' &&
      b.standard.status === 'Superseded'
    ) {
      return -1;
    }

    return a.standard.standardNumber.localeCompare(
      b.standard.standardNumber
    );
  });
}

/* ============================================================
   PRODUCT UNDERSTANDING
   ============================================================ */

/**
 * Identify product and user intent from natural language.
 */
export function extractProductUnderstanding(
  query: string
): ProductUnderstanding {
  const lower = normalizeText(query);

  let identifiedProduct = 'General product query';

  let intent: ProductUnderstanding['intent'] = 'Find Standard';

  /* ----------------------------------------------------------
     User intent
     ---------------------------------------------------------- */

  if (
    lower.includes('certif') ||
    lower.includes('license') ||
    lower.includes('isi mark') ||
    lower.includes('scheme') ||
    lower.includes('apply')
  ) {
    intent = 'Certification Process';
  } else if (
    lower.includes('test') ||
    lower.includes('lab') ||
    lower.includes('sample') ||
    lower.includes('pressure test') ||
    lower.includes('drop test')
  ) {
    intent = 'Testing Requirement';
  } else if (
    lower.includes('hallmark') ||
    lower.includes('gold') ||
    lower.includes('silver') ||
    lower.includes('huid') ||
    lower.includes('jewel')
  ) {
    intent = 'Hallmarking';
  } else if (
    lower.includes('consumer') ||
    lower.includes('fake') ||
    lower.includes('verify isi') ||
    lower.includes('complaint') ||
    lower.includes('bis care')
  ) {
    intent = 'Consumer Query';
  }

  /* ----------------------------------------------------------
     Product detection
     ---------------------------------------------------------- */

  // IMPORTANT:
  // Electric kettle comes before generic appliance detection.
  if (
    lower.includes('electric kettle') ||
    lower.includes('electric water kettle') ||
    lower.includes('kettle jug') ||
    lower.includes('electric jug')
  ) {
    identifiedProduct = 'Electric Kettle';
  } else if (
    lower.includes('water bottle') ||
    lower.includes('bottle') ||
    lower.includes('flask') ||
    lower.includes('thermos')
  ) {
    identifiedProduct =
      'Stainless Steel Water Bottle / Vacuum Flask';
  } else if (
    lower.includes('pressure cooker') ||
    lower.includes('cooker')
  ) {
    identifiedProduct = 'Domestic Pressure Cooker';
  } else if (
    lower.includes('helmet') ||
    lower.includes('two wheeler') ||
    lower.includes('headgear')
  ) {
    identifiedProduct =
      'Protective Helmet for Two-Wheeler Riders';
  } else if (
    lower.includes('led') ||
    lower.includes('bulb') ||
    lower.includes('lamp') ||
    lower.includes('lighting')
  ) {
    identifiedProduct = 'Self-Ballasted LED Lamp';
  } else if (
    lower.includes('water') &&
    (
      lower.includes('drinking') ||
      lower.includes('packaged') ||
      lower.includes('mineral') ||
      lower.includes('ro')
    )
  ) {
    identifiedProduct = 'Packaged Drinking Water';
  } else if (
    lower.includes('toy') ||
    lower.includes('toys') ||
    lower.includes('board game') ||
    lower.includes('doll')
  ) {
    identifiedProduct = 'Children Toys & Playthings';
  } else if (
    lower.includes('gold') ||
    lower.includes('hallmark') ||
    lower.includes('jewellery') ||
    lower.includes('jewelry') ||
    lower.includes('necklace')
  ) {
    identifiedProduct = 'Gold Jewellery & Artefacts';
  } else if (
    lower.includes('plug') ||
    lower.includes('socket') ||
    lower.includes('switchboard') ||
    lower.includes('pin plug')
  ) {
    identifiedProduct =
      'Plugs and Socket-Outlets (up to 250V)';
  } else if (
    lower.includes('cement') ||
    lower.includes('concrete') ||
    lower.includes('opc')
  ) {
    identifiedProduct =
      'Ordinary Portland Cement (53 Grade)';
  } else if (
    lower.includes('cable') ||
    lower.includes('wire') ||
    lower.includes('pvc')
  ) {
    identifiedProduct = 'PVC Insulated Electric Cable';
  } else if (
    lower.includes('electrical product') ||
    lower.includes('appliance')
  ) {
    identifiedProduct =
      'Household Electrical Appliance (Specification Unspecified)';
  } else {
    /* --------------------------------------------------------
       Fallback noun phrase
       -------------------------------------------------------- */

    const clean = query
      .replace(
        /(which|what|is|are|the|standard|for|how|to|certify|i|make|manufacture|sell)/gi,
        ''
      )
      .trim();

    if (clean.length > 2) {
      identifiedProduct = clean.slice(0, 60);
    }
  }

  return {
    identifiedProduct,
    intent,

    identifiedMaterial: lower.includes('stainless steel')
      ? 'Stainless Steel'
      : lower.includes('aluminium')
      ? 'Aluminium'
      : lower.includes('plastic')
      ? 'Plastic / Polymer'
      : undefined
  };
}

/* ============================================================
   FOLLOW-UP DETECTION
   ============================================================ */

/**
 * Check if query is too broad or incomplete.
 */
export function checkFollowUpNeeded(
  query: string,
  matches: SearchMatch[]
): string[] | null {
  const lower = normalizeText(query);

  const productIntent = detectProductIntent(query);

  /* ----------------------------------------------------------
     Electric kettle is specific enough.
     Do not ask generic electrical questions.
     ---------------------------------------------------------- */

  if (productIntent === 'electric-kettle') {
    return null;
  }

  /* ----------------------------------------------------------
     Very broad electrical queries
     ---------------------------------------------------------- */

  if (
    lower === 'electrical' ||
    lower === 'electrical product' ||
    lower === 'electrical products' ||
    lower.includes('make electrical') ||
    lower.includes('which electrical')
  ) {
    return [
      'What specific type of electrical product do you manufacture? (e.g., Plugs & sockets, LED bulbs, electric kettle, electric iron, cables, or circuit breakers)',
      'What is its rated voltage and power capacity (e.g., 230V single phase or 415V three phase)?',
      'Is it intended for domestic household use or industrial installation?'
    ];
  }

  /* ----------------------------------------------------------
     Broad metal queries
     ---------------------------------------------------------- */

  if (
    lower.includes('metal') &&
    !lower.includes('bottle') &&
    !lower.includes('cooker') &&
    !lower.includes('gold')
  ) {
    return [
      'What kind of metal item are you fabricating? (e.g., Stainless steel utensils, structural steel bars, or aluminium cookware)',
      'Is the item intended to come into contact with drinking water, food products, or structural loads?'
    ];
  }

  /* ----------------------------------------------------------
     Broad food queries
     ---------------------------------------------------------- */

  if (
    lower.includes('food') &&
    !lower.includes('water')
  ) {
    return [
      'What specific food or beverage product are you packaging? (e.g., Packaged drinking water, edible oils, milk powder)',
      'Are you seeking BIS certification (ISI Mark) or FSSAI regulatory compliance, or both?'
    ];
  }

  /* ----------------------------------------------------------
     No useful matches
     ---------------------------------------------------------- */

  if (matches.length === 0) {
    return [
      'What is the exact product name or product category?',
      'What material is the product made from?',
      'What is the intended use or application?'
    ];
  }

  return null;
}

/* ============================================================
   POTENTIALLY APPLICABLE STANDARDS
   ============================================================ */

function buildPotentialStandards(
  matches: SearchMatch[],
  productIntent: ProductIntent
): StructuredAIResponse['potentiallyApplicableStandards'] {
  let filtered = matches.filter(match => match.score >= 15);

  /*
   * For product-specific searches, keep standards that are
   * reasonably relevant. This prevents obviously unrelated
   * standards from filling the top results.
   */
  if (productIntent) {
    const productRelevant = filtered.filter(match => {
      const boost = getProductSpecificBoost(
        match.standard,
        productIntent
      );

      const penalty = getUnrelatedPenalty(
        match.standard,
        productIntent
      );

      return boost > 0 || penalty === 0;
    });

    if (productRelevant.length > 0) {
      filtered = productRelevant;
    }
  }

  return filtered.slice(0, 3).map(match => ({
    standardNumber: match.standard.standardNumber,
    title: match.standard.title,
    whyItMayApply: match.relevanceExplanation,
    relevantScope: match.standard.scopeSummary,
    status: match.standard.status,
    supersededWarning: match.standard.supersededWarning,
    sourceDoc: match.standard.sourceDocument,
    clauseRef: match.standard.clauses[0]?.clauseNumber,
    edition: match.standard.edition,
    pageRef: match.standard.clauses[0]?.page
  }));
}

/* ============================================================
   MAIN RESPONSE GENERATOR
   ============================================================ */

/**
 * Generate Structured AI Response following the
 * "Source or Refuse" principle.
 */
export function generateSourceGroundedResponse(
  query: string,
  isDemoMode = false
): StructuredAIResponse {
  const matches = searchBISKnowledge(query);

  const understanding =
    extractProductUnderstanding(query);

  const followUps =
    checkFollowUpNeeded(query, matches);

  const currentDate =
    new Date().toISOString().split('T')[0];

  const productIntent =
    detectProductIntent(query);

  /* ----------------------------------------------------------
     Complex multi-part query detection
     ---------------------------------------------------------- */

  const lower = normalizeText(query);

  const hasMultipleTasks =
    (
      (
        lower.includes('which standard') ||
        lower.includes('what standard') ||
        lower.includes('standard for')
      ) &&
      (
        lower.includes('mandatory') ||
        lower.includes('qco') ||
        lower.includes('compulsory') ||
        lower.includes('test') ||
        lower.includes('lab') ||
        lower.includes('how to certify')
      )
    ) ||
    (
      lower.includes('and') &&
      (
        lower.includes('test') ||
        lower.includes('lab')
      ) &&
      lower.includes('certif')
    );

  /* ========================================================
     CASE 1: NEEDS CLARIFICATION
     ======================================================== */

  if (
    followUps &&
    (
      matches.length === 0 ||
      matches[0].score < 15
    )
  ) {
    return {
      understandingText:
        `You are inquiring about standards or compliance for "${understanding.identifiedProduct}", but more product-specific information is required.`,

      answer:
        `To identify the most relevant Indian Standard, more technical details are required. BIS standards are product-specific and can depend on the product type, material, intended use and technical characteristics.`,

      productUnderstanding: understanding,

      potentiallyApplicableStandards: [],

      sources: [],

      reliabilityLevel: 'NEEDS_VERIFICATION',

      reliabilityReason:
        'Query lacks sufficient product specificity for a confident standard recommendation.',

      evidenceReasoning:
        'The retrieval engine found insufficient high-confidence matches and therefore requested clarification rather than guessing.',

      followUpQuestions: followUps,

      disclaimer:
        'This assistant provides guidance based on its indexed sources and is not a replacement for official BIS decisions. Recommendations should be verified against current authoritative BIS information.',

      isDemoData: isDemoMode,

      importantNotes: [
        'Different products may have different applicable Indian Standards.',
        'Certification and regulatory requirements should be verified against current BIS information.'
      ],

      nextSteps: [
        'Specify the exact product category.',
        'Provide the material or composition where relevant.',
        'Describe the intended use or application.'
      ]
    };
  }

  /* ========================================================
     CASE 2: NO SUFFICIENT MATCH
     ======================================================== */

  if (
    matches.length === 0 ||
    matches[0].score < 10
  ) {
    return {
      understandingText:
        `You inquired regarding specifications or standards for "${understanding.identifiedProduct}".`,

      answer:
        `I could not find sufficient evidence in the indexed BIS knowledge base to answer this question confidently.

Under the "Source or Refuse" architecture, BIS Sahayak AI does not invent Indian Standard numbers, clauses, test requirements, fees, or licensing rules when sufficient source evidence is unavailable.`,

      productUnderstanding: understanding,

      potentiallyApplicableStandards: [],

      sources: [],

      reliabilityLevel: 'NOT_VERIFIED',

      reliabilityReason:
        'No sufficiently strong match was found in the current indexed BIS knowledge repository.',

      evidenceReasoning:
        'Hybrid retrieval returned no sufficiently confident result. The system therefore avoids fabricating a standard recommendation.',

      followUpQuestions: [
        'Could you provide the exact product name?',
        'What is the material or composition of the product?',
        'What is the intended use of the product?',
        'Would you like to verify the result directly on the official BIS portal?'
      ],

      disclaimer:
        'This assistant provides guidance based on retrieved sources and is not a replacement for official BIS decisions.',

      isDemoData: isDemoMode,

      importantNotes: [
        'Official Indian Standards should be verified through the BIS Standards Portal.',
        'Regulatory and certification requirements can change and should be checked against current official information.'
      ],

      nextSteps: [
        'Search the official BIS Standards Portal.',
        'Verify the exact scope and current status of the standard.',
        'Contact BIS for product-specific regulatory clarification when required.'
      ]
    };
  }

  /* ========================================================
     CASE 3: MATCH FOUND
     ======================================================== */

  const bestMatch = matches[0];

  const std = bestMatch.standard;

  const isSuperseded =
    std.status === 'Superseded';

  /*
   * High confidence requires:
   * - strong score
   * - current standard
   * - direct product relevance where product intent exists
   */

  const directProductBoost =
    productIntent
      ? getProductSpecificBoost(
          std,
          productIntent
        )
      : 0;

  const isHighConfidence =
    bestMatch.score >= 40 &&
    !isSuperseded &&
    (
      !productIntent ||
      directProductBoost > 0
    );

  const reliability: ReliabilityLevel =
    isSuperseded
      ? 'NEEDS_VERIFICATION'
      : isHighConfidence
      ? 'VERIFIED'
      : 'NEEDS_VERIFICATION';

  /* ========================================================
     ANSWER TEXT
     ======================================================== */

  let answerText = '';

  if (isSuperseded) {
    answerText =
      `⚠️ **Important:** The standard identified in the indexed BIS knowledge base (**${std.standardNumber}**) is marked as **SUPERSEDED**.`;

    if (std.supersededBy) {
      answerText +=
        ` The indexed record indicates replacement by **${std.supersededBy}**. Please verify the current applicable standard on the official BIS portal before using this information.`;
    }
  } else if (isHighConfidence) {
    answerText =
      `Based on the indexed BIS knowledge base, the strongest product-specific match for "${understanding.identifiedProduct}" is **${std.standardNumber}** (*${std.title}*).`;

    if (std.qcoMandatory) {
      answerText +=
        ` The indexed record indicates that this standard is associated with a mandatory Quality Control Order (${std.qcoNotificationNumber || 'QCO reference not specified'}). Please verify the current QCO and effective date on the official BIS/Government source.`;
    } else {
      answerText +=
        ` The current indexed record does not indicate a mandatory QCO. Verify the latest regulatory position before making compliance decisions.`;
    }
  } else {
    answerText =
      `A potentially relevant Indian Standard identified in the indexed BIS knowledge base is **${std.standardNumber}** (*${std.title}*). Please verify that your exact product variant falls within its defined scope before proceeding.`;
  }

  /* ========================================================
     MATCHING LABORATORIES
     ======================================================== */

  const stdPrefix =
    std.standardNumber.split(':')[0];

  const matchingLabs =
    BIS_LABORATORIES.filter(lab =>
      lab.recognizedStandards.some(
        standard => standard.includes(stdPrefix)
      )
    );

  /* ========================================================
     DECOMPOSED TASKS
     ======================================================== */

  let decomposedTasks:
    StructuredAIResponse['decomposedTasks'] =
    undefined;

  if (hasMultipleTasks) {
    decomposedTasks = [
      {
        taskTitle: '1. Applicable Indian Standard',

        finding: isSuperseded
          ? `Superseded: ${std.standardNumber}. Current valid standard: ${std.supersededBy || 'Verify on the official BIS portal'}`
          : `${std.standardNumber} (${std.title}) [Edition: ${std.edition || 'Latest'}]`,

        confidence:
          isSuperseded
            ? 'NEEDS_VERIFICATION'
            : isHighConfidence
            ? 'VERIFIED'
            : 'NEEDS_VERIFICATION',

        sourceRef:
          std.sourceDocument
      },

      {
        taskTitle: '2. Mandatory / QCO Legal Status',

        finding: std.qcoMandatory
          ? `The indexed record indicates a mandatory QCO: ${std.qcoNotificationNumber || 'QCO reference not specified'}. Verify current applicability and effective date from the official government/BIS source.`
          : `No mandatory QCO is indicated in the current indexed record.`,

        confidence:
          'NEEDS_VERIFICATION',

        sourceRef:
          std.qcoNotificationNumber
            ? `Gazette Notification: ${std.qcoNotificationNumber}`
            : 'Indexed BIS standard record'
      },

      {
        taskTitle: '3. Testing Requirements',

        finding:
          std.testRequirements.length > 0
            ? `${std.testRequirements.length} indexed test requirements: ${std.testRequirements
                .map(test => test.testName)
                .slice(0, 3)
                .join(', ')}.`
            : 'Detailed test requirements were not populated in the current indexed record. Refer to the official standard document for complete test methods and requirements.',

        confidence:
          std.testRequirements.length > 0
            ? 'VERIFIED'
            : 'NEEDS_VERIFICATION',

        sourceRef:
          `${std.standardNumber} — Methods of Test / Requirements`
      },

      {
        taskTitle:
          '4. Authorized BIS & Recognized Laboratories',

        finding:
          matchingLabs.length > 0
            ? `${matchingLabs.length} matching indexed laboratory record(s): ${matchingLabs
                .map(lab => `${lab.name} (${lab.city})`)
                .slice(0, 2)
                .join(', ')}.`
            : 'No matching laboratory was found in the current indexed laboratory data. Verify the official BIS laboratory recognition directory.',

        confidence:
          matchingLabs.length > 0
            ? 'NEEDS_VERIFICATION'
            : 'NEEDS_VERIFICATION',

        sourceRef:
          'Indexed BIS Laboratory Recognition data'
      },

      {
        taskTitle: '5. Certification Route',

        finding:
          `${std.certificationScheme}. Verify the current certification route, application requirements, fees, audit procedure and applicable regulations through the official BIS portal.`,

        confidence:
          'NEEDS_VERIFICATION',

        sourceRef:
          'Indexed BIS certification information'
      }
    ];
  }

  /* ========================================================
     KEY CLAUSES
     ======================================================== */

  const keyClauses =
    std.clauses.map(clause =>
      `${clause.clauseNumber} - ${clause.clauseTitle}: ${clause.requirement} (Mandatory: ${
        clause.mandatory ? 'Yes' : 'No'
      }${
        clause.page
          ? `, Page ${clause.page}`
          : ''
      })`
    );

  /* ========================================================
     TESTING PARAMETERS
     ======================================================== */

  const testingParameters =
    std.testRequirements.map(test =>
      `${test.testName} (${test.clauseRef}): ${test.purpose} [Parameters: ${test.parameters}]`
    );

  /* ========================================================
     SOURCES
     ======================================================== */

  const sources:
    StructuredAIResponse['sources'] = [
      {
        documentName:
          std.sourceDocument,

        standardNumber:
          std.standardNumber,

        section:
          std.category,

        clause:
          std.clauses
            .map(clause => clause.clauseNumber)
            .join(', '),

        page:
          std.clauses[0]?.page || 1,

        version:
          std.version,

        documentType:
          std.documentType,

        lastUpdated:
          std.lastUpdated,

        retrievalDate:
          currentDate,

        officialPortalUrl:
          std.sourceUrl,

        isAuthoritative:
          true,

        isDemoData:
          isDemoMode,

        excerpt:
          `Standard Scope: "${std.scopeSummary}"${
            std.clauses[0]
              ? ` | Key Clause (${std.clauses[0].clauseNumber}): "${std.clauses[0].requirement}"`
              : ''
          }`
      }
    ];

  /* --------------------------------------------------------
     QCO source
     -------------------------------------------------------- */

  if (std.qcoNotificationNumber) {
    sources.push({
      documentName:
        `Quality Control Order: ${std.qcoNotificationNumber}`,

      standardNumber:
        std.standardNumber,

      section:
        'Quality Control Order',

      clause:
        'Applicable QCO provision',

      version:
        `Gazette Effective Date: ${std.qcoEffectiveDate || 'Verify current date'}`,

      documentType:
        'Gazette Quality Control Order',

      lastUpdated:
        std.qcoEffectiveDate || std.lastUpdated,

      retrievalDate:
        currentDate,

      officialPortalUrl:
        'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/qco_orders',

      isAuthoritative:
        true,

      isDemoData:
        isDemoMode,

      excerpt:
        `Indexed QCO reference associated with ${std.standardNumber}. Verify current applicability and effective date from the official government/BIS source.`
    });
  }

  /* ========================================================
     POTENTIALLY APPLICABLE STANDARDS
     ======================================================== */

  const potentiallyApplicableStandards =
    buildPotentialStandards(
      matches,
      productIntent
    );

  /* ========================================================
     IMPORTANT NOTES
     ======================================================== */

  const importantNotes = [
    std.qcoMandatory
      ? `The indexed record indicates a Quality Control Order (${std.qcoNotificationNumber || 'reference not specified'}). Verify its current applicability and effective date from the official BIS/Government source.`
      : `The current indexed record does not indicate a mandatory QCO. A tender, contract, regulator or later notification may impose additional requirements.`,

    isSuperseded
      ? `Do not rely on ${std.standardNumber} until its replacement/current status is verified from the official BIS portal.`
      : `Verify the complete scope, amendments and current status of ${std.standardNumber} using the official BIS standard record.`,

    `The indexed knowledge base may not contain every clause, amendment, test method or laboratory update.`
  ];

  /* ========================================================
     NEXT STEPS
     ======================================================== */

  const nextSteps = [
    `1. Verify the official BIS record for ${std.standardNumber}.`,

    `2. Confirm that your exact product, material and intended use fall within the standard's scope.`,

    `3. Review the complete official standard, including amendments and test requirements.`,

    `4. Verify the current certification/QCO position before manufacturing, selling, importing or applying for certification.`
  ];

  /* ========================================================
     CERTIFICATION GUIDANCE
     ======================================================== */

  const certificationSteps = [
    `1. Standard Verification: Confirm the current official BIS record for ${std.standardNumber}.`,

    `2. Product Scope: Confirm that your exact product variant falls within the standard scope.`,

    `3. Testing Setup: Review the official standard for applicable testing equipment and methods.`,

    `4. Application: Follow the current BIS certification/application procedure applicable to your product.`,

    `5. Inspection & Testing: Complete any applicable BIS inspection and sample testing requirements.`,

    `6. Licence / Certification: Use the applicable BIS certification route only after verifying current requirements.`
  ];

  /* ========================================================
     TESTING GUIDANCE
     ======================================================== */

  const requiredTests =
    std.testRequirements.map(test =>
      `${test.testName} (${test.clauseRef}): ${test.purpose}`
    );

  const samplePreparation =
    std.testRequirements.length > 0
      ? 'Prepare samples according to the sampling and test requirements specified in the official standard.'
      : 'Detailed sample preparation requirements are not populated in the current indexed record. Refer to the official standard document.';

  /* ========================================================
     FINAL STRUCTURED RESPONSE
     ======================================================== */

  return {
    understandingText:
      `You are requesting standards and compliance guidance for "${understanding.identifiedProduct}".`,

    answer:
      answerText,

    applicableStandardDetails: {
      standardNumber:
        std.standardNumber,

      title:
        std.title,

      status:
        std.status,

      supersededWarning:
        std.supersededWarning,

      amendment:
        std.amendmentNumber,

      edition:
        std.edition
    },

    requirementsSummary: {
      keyClauses,

      testingParameters
    },

    importantNotes,

    nextSteps,

    productUnderstanding:
      understanding,

    potentiallyApplicableStandards,

    certificationGuidance: {
      schemeName:
        std.certificationScheme,

      isMandatoryByQCO:
        std.qcoMandatory,

      qcoReference:
        std.qcoNotificationNumber,

      legalMandateText:
        std.qcoMandatory
          ? `The indexed record indicates a mandatory QCO reference: ${std.qcoNotificationNumber || 'not specified'}. Verify the current legal position from the official source.`
          : 'No mandatory QCO is indicated in the current indexed record.',

      keySteps:
        certificationSteps
    },

    testingGuidance: {
      requiredTests,

      samplePreparation,

      relevantLabs:
        matchingLabs.map(lab =>
          `${lab.name} (${lab.city}, ${lab.state}) - Status: ${lab.recognitionStatus}`
        )
    },

    sources,

    reliabilityLevel:
      reliability,

    reliabilityReason:
      isSuperseded
        ? `The indexed record marks ${std.standardNumber} as superseded and therefore requires current-status verification.`
        : isHighConfidence
        ? `Strong product-specific match for ${understanding.identifiedProduct}: ${std.standardNumber}.`
        : `A related standard was retrieved, but additional official verification is recommended for the exact product variant.`,

    evidenceReasoning:
      isSuperseded
        ? `Retrieved indexed record ${std.standardNumber} with a superseded status.`
        : isHighConfidence
        ? `Hybrid retrieval matched product intent, indexed keywords, product coverage and standard metadata for ${std.standardNumber}.`
        : `Hybrid retrieval found a related indexed BIS standard, but product-specific confidence is not high enough for an unrestricted recommendation.`,

    decomposedTasks,

    followUpQuestions:
      followUps || undefined,

    disclaimer:
      'This assistant provides guidance based on its indexed sources and is not a replacement for official BIS decisions. Always verify current standards, amendments, QCOs, certification requirements and laboratory recognition through authoritative BIS sources.',

    isDemoData:
      isDemoMode
  };
}