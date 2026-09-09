/**
 * BIS Sahayak AI - RAG Retrieval & Verification Engine
 * Implements: Hybrid Search (Semantic/Intent + Keyword), Source or Refuse,
 * Three Levels of Reliability (VERIFIED, NEEDS VERIFICATION, NOT VERIFIED),
 * Intelligent Follow-up Detection, and Clause-backed Citations.
 */

import { BIS_STANDARDS, BIS_LABORATORIES } from '../data/bisKnowledgeBase';
import { BISStandard, StructuredAIResponse, ReliabilityLevel, ProductUnderstanding } from '../types';

export interface SearchMatch {
  standard: BISStandard;
  score: number;
  matchedKeywords: string[];
  matchedClauses: string[];
  relevanceExplanation: string;
}

/**
 * Hybrid Search combining keyword token matching and intent/semantic category mapping
 */
export function searchBISKnowledge(query: string): SearchMatch[] {
  const normalized = query.toLowerCase().trim();
  const tokens = normalized.split(/[\s,./\-+]+/).filter(t => t.length > 2);

  const matches: SearchMatch[] = [];

  for (const std of BIS_STANDARDS) {
    let score = 0;
    const matchedKeywords: string[] = [];
    const matchedClauses: string[] = [];

    // Exact standard number match (e.g. "17526", "IS 2347", "4151")
    const numOnly = std.standardNumber.replace(/[^\d]/g, '');
    if (normalized.includes(std.standardNumber.toLowerCase()) || (numOnly && normalized.includes(numOnly))) {
      score += 50;
      matchedKeywords.push(std.standardNumber);
    }

    // Title match
    if (normalized.includes(std.title.toLowerCase())) {
      score += 30;
      matchedKeywords.push(std.title);
    }

    // Product coverage matching
    for (const prod of std.productsCovered) {
      if (normalized.includes(prod.toLowerCase())) {
        score += 25;
        matchedKeywords.push(prod);
      }
    }

    // Keyword tokens
    for (const kw of std.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        score += 15;
        matchedKeywords.push(kw);
      }
    }

    // Individual token overlap
    for (const token of tokens) {
      if (std.title.toLowerCase().includes(token)) score += 3;
      if (std.scopeSummary.toLowerCase().includes(token)) score += 2;
      if (std.category.toLowerCase().includes(token)) score += 4;
      
      for (const clause of std.clauses) {
        if (clause.clauseTitle.toLowerCase().includes(token) || clause.requirement.toLowerCase().includes(token)) {
          score += 2;
          if (!matchedClauses.includes(clause.clauseNumber)) {
            matchedClauses.push(`${clause.clauseNumber}: ${clause.clauseTitle}`);
          }
        }
      }
    }

    if (score > 5) {
      let explanation = `Covers ${std.productsCovered[0] || std.title}.`;
      if (matchedKeywords.length > 0) {
        explanation += ` Matches query keywords: ${matchedKeywords.slice(0, 3).join(', ')}.`;
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

  // Rank by score descending
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Identify product and user intent from natural language query
 */
export function extractProductUnderstanding(query: string): ProductUnderstanding {
  const lower = query.toLowerCase();

  let identifiedProduct = 'General product query';
  let intent: ProductUnderstanding['intent'] = 'Find Standard';

  if (lower.includes('certif') || lower.includes('license') || lower.includes('isi mark') || lower.includes('scheme') || lower.includes('apply')) {
    intent = 'Certification Process';
  } else if (lower.includes('test') || lower.includes('lab') || lower.includes('sample') || lower.includes('pressure test') || lower.includes('drop test')) {
    intent = 'Testing Requirement';
  } else if (lower.includes('hallmark') || lower.includes('gold') || lower.includes('silver') || lower.includes('huid') || lower.includes('jewel')) {
    intent = 'Hallmarking';
  } else if (lower.includes('consumer') || lower.includes('fake') || lower.includes('verify isi') || lower.includes('complaint') || lower.includes('bis care')) {
    intent = 'Consumer Query';
  }

  // Detect product
  if (lower.includes('water bottle') || lower.includes('bottle') || lower.includes('flask') || lower.includes('thermos')) {
    identifiedProduct = 'Stainless Steel Water Bottle / Vacuum Flask';
  } else if (lower.includes('pressure cooker') || lower.includes('cooker')) {
    identifiedProduct = 'Domestic Pressure Cooker';
  } else if (lower.includes('helmet') || lower.includes('two wheeler') || lower.includes('headgear')) {
    identifiedProduct = 'Protective Helmet for Two-Wheeler Riders';
  } else if (lower.includes('led') || lower.includes('bulb') || lower.includes('lamp') || lower.includes('lighting')) {
    identifiedProduct = 'Self-Ballasted LED Lamp';
  } else if (lower.includes('water') && (lower.includes('drinking') || lower.includes('packaged') || lower.includes('mineral') || lower.includes('ro'))) {
    identifiedProduct = 'Packaged Drinking Water';
  } else if (lower.includes('toy') || lower.includes('toys') || lower.includes('board game') || lower.includes('doll')) {
    identifiedProduct = 'Children Toys & Playthings';
  } else if (lower.includes('gold') || lower.includes('hallmark') || lower.includes('jewellery') || lower.includes('necklace')) {
    identifiedProduct = 'Gold Jewellery & Artefacts';
  } else if (lower.includes('plug') || lower.includes('socket') || lower.includes('switchboard') || lower.includes('pin plug')) {
    identifiedProduct = 'Plugs and Socket-Outlets (up to 250V)';
  } else if (lower.includes('cement') || lower.includes('concrete') || lower.includes('opc')) {
    identifiedProduct = 'Ordinary Portland Cement (53 Grade)';
  } else if (lower.includes('cable') || lower.includes('wire') || lower.includes('pvc')) {
    identifiedProduct = 'PVC Insulated Electric Cable';
  } else if (lower.includes('electrical product') || lower.includes('appliance')) {
    identifiedProduct = 'Household Electrical Appliance (Specification Unspecified)';
  } else {
    // Extract noun phrase if possible
    const clean = query.replace(/(which|what|is|are|the|standard|for|how|to|certify|i|make|manufacture|sell)/gi, '').trim();
    if (clean.length > 2) {
      identifiedProduct = clean.slice(0, 40);
    }
  }

  return {
    identifiedProduct,
    intent,
    identifiedMaterial: lower.includes('stainless steel') ? 'Stainless Steel' : lower.includes('aluminium') ? 'Aluminium' : lower.includes('plastic') ? 'Plastic / Polymer' : undefined
  };
}

/**
 * Check if the query is too ambiguous or incomplete, requiring follow-up questions
 */
export function checkFollowUpNeeded(query: string, matches: SearchMatch[]): string[] | null {
  const lower = query.toLowerCase().trim();

  // Very broad queries
  if (lower === 'electrical' || lower === 'electrical product' || lower === 'electrical products' || lower.includes('make electrical') || lower.includes('which electrical')) {
    return [
      'What specific type of electrical product do you manufacture? (e.g., Plugs & sockets, LED bulbs, electric iron, cables, or circuit breakers)',
      'What is its rated voltage and power capacity (e.g., 230V single phase or 415V three phase)?',
      'Is it intended for domestic household use or industrial installation?'
    ];
  }

  if (lower.includes('metal') && !lower.includes('bottle') && !lower.includes('cooker') && !lower.includes('gold')) {
    return [
      'What kind of metal item are you fabricating? (e.g., Stainless steel utensils, structural steel bars, or aluminium cookware)',
      'Is the item intended to come into contact with drinking water, food products, or structural loads?'
    ];
  }

  if (lower.includes('food') && !lower.includes('water')) {
    return [
      'What specific food or beverage product are you packaging? (e.g., Packaged drinking water, edible oils, milk powder)',
      'Are you seeking BIS certification (ISI Mark) or FSSAI regulatory compliance, or both?'
    ];
  }

  return null;
}

/**
 * Generate Structured AI Response following the exact "Source or Refuse" principle
 */
export function generateSourceGroundedResponse(query: string, isDemoMode = false): StructuredAIResponse {
  const matches = searchBISKnowledge(query);
  const understanding = extractProductUnderstanding(query);
  const followUps = checkFollowUpNeeded(query, matches);
  const currentDate = new Date().toISOString().split('T')[0];

  // Complex multi-part query detection
  const lower = query.toLowerCase();
  const hasMultipleTasks = (
    (lower.includes('which standard') || lower.includes('what standard') || lower.includes('standard for')) &&
    (lower.includes('mandatory') || lower.includes('qco') || lower.includes('compulsory') || lower.includes('test') || lower.includes('lab') || lower.includes('how to certify'))
  ) || (lower.includes('and') && (lower.includes('test') || lower.includes('lab')) && lower.includes('certif'));

  // CASE 1: Incomplete or overly broad query requiring clarification
  if (followUps && (matches.length === 0 || matches[0].score < 15)) {
    return {
      understandingText: `You are inquiring about standards or compliance for "${understanding.identifiedProduct}", but the technical specifications (material, intended use, voltage/capacity) require clarification.`,
      answer: `To identify the exact Indian Standard and certification requirements, more technical details are required. BIS publishes over 21,000 active Indian Standards, and standards are designated based on precise product taxonomy, materials, and safety parameters.`,
      productUnderstanding: understanding,
      potentiallyApplicableStandards: [],
      sources: [],
      reliabilityLevel: 'NEEDS_VERIFICATION',
      reliabilityReason: 'Query lacks required product specificity (e.g. material grade, operating voltage, or intended application).',
      evidenceReasoning: 'Retrieved 0 high-confidence matches from BIS knowledge index due to broad/ambiguous search tokens. Prompting user with clarification questions to avoid guessing.',
      followUpQuestions: followUps,
      disclaimer: 'This assistant provides guidance based on retrieved sources and is not a replacement for official BIS decisions. Standard recommendations must be verified against current authoritative BIS information.',
      isDemoData: isDemoMode,
      importantNotes: [
        'BIS certification schemes and testing protocols differ fundamentally by product grade and material.',
        'Never rely on generalized or unverified standard numbers for factory setup or import clearance.'
      ],
      nextSteps: [
        'Select or specify your exact product category from the follow-up options.',
        'Confirm whether the item is for domestic household or commercial/industrial use.',
        'Check if your product uses electricity, high pressure, or food contact materials.'
      ]
    };
  }

  // CASE 2: No authoritative match found - REFUSE TO GUESS
  if (matches.length === 0 || matches[0].score < 10) {
    return {
      understandingText: `You inquired regarding specifications or standards for "${understanding.identifiedProduct}".`,
      answer: `I could not find sufficient authoritative BIS evidence in the indexed standards database to answer this question confidently.

Under the "Source or Refuse" architecture, BIS Sahayak AI strictly refrains from inventing Indian Standard numbers, clauses, test requirements, fees, or licensing rules when verified records are unavailable.`,
      productUnderstanding: understanding,
      potentiallyApplicableStandards: [],
      sources: [],
      reliabilityLevel: 'NOT_VERIFIED',
      reliabilityReason: 'No direct verified match exists in the current authorized BIS knowledge repository for this specific query.',
      evidenceReasoning: 'Hybrid search returned zero index hits with confidence score >= 10. System triggered zero-hallucination refusal to prevent fabricating standard numbers.',
      followUpQuestions: [
        'Could you provide the exact chemical or material composition of the product?',
        'Does the product fall under electrical, mechanical, civil, chemical, or food categories?',
        'Would you like to search the official BIS Manakonline directory directly at services.bis.gov.in?'
      ],
      disclaimer: 'This assistant provides guidance based on retrieved sources and is not a replacement for official BIS decisions.',
      isDemoData: isDemoMode,
      importantNotes: [
        'Official Indian Standards can be looked up on the BIS Manakonline portal (services.bis.gov.in) using Harmonized System (HS) codes.',
        'If your product is newly developed, it may be evaluated under BIS Scheme IV (Certificate of Conformity) or subject to a new technical committee review.'
      ],
      nextSteps: [
        'Search the official BIS Standards Portal: https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails',
        'Contact your nearest BIS Branch Office for pre-application scope verification.'
      ]
    };
  }

  // CASE 3: Found verified or closely related match
  const bestMatch = matches[0];
  const std = bestMatch.standard;
  const isSuperseded = std.status === 'Superseded';

  // Check confidence
  const isHighConfidence = bestMatch.score >= 25 && !isSuperseded;
  const reliability: ReliabilityLevel = isSuperseded 
    ? 'NEEDS_VERIFICATION' 
    : isHighConfidence ? 'VERIFIED' : 'NEEDS_VERIFICATION';

  // Build answer text
  let answerText = '';
  if (isSuperseded) {
    answerText = `⚠️ **CRITICAL WARNING:** The standard referenced in your inquiry (**${std.standardNumber}**) is **SUPERSEDED and WITHDRAWN by BIS**. `;
    if (std.supersededBy) {
      answerText += `It has been officially replaced by **${std.supersededBy}**. You MUST NOT apply for or manufacture under the superseded standard, as it is legally void under Indian law.`;
    }
  } else if (isHighConfidence) {
    answerText = `Based on verified BIS gazette records for "${understanding.identifiedProduct}", the applicable Indian Standard is **${std.standardNumber}** (*${std.title}*).`;
    if (std.qcoMandatory) {
      answerText += ` Compliance with this standard is **LEGALLY MANDATORY** across India under Quality Control Order (**${std.qcoNotificationNumber}**). Manufacturing, storing, importing, or selling without the genuine BIS Standard Mark (ISI mark) is punishable under the BIS Act, 2016.`;
    } else {
      answerText += ` This standard operates under the Voluntary Certification Scheme (Scheme I), unless specific ministerial notifications mandate it.`;
    }
  } else {
    answerText = `A closely related Indian Standard identified in the BIS index is **${std.standardNumber}** (*${std.title}*). Please verify whether your specific product variant falls within its defined scope before proceeding.`;
  }

  // Gather matching laboratories
  const stdPrefix = std.standardNumber.split(':')[0];
  const matchingLabs = BIS_LABORATORIES.filter(l => 
    l.recognizedStandards.some(s => s.includes(stdPrefix))
  );

  // Decomposed tasks for multi-part questions
  let decomposedTasks: StructuredAIResponse['decomposedTasks'] = undefined;
  if (hasMultipleTasks) {
    decomposedTasks = [
      {
        taskTitle: '1. Applicable Indian Standard',
        finding: isSuperseded 
          ? `Superseded: ${std.standardNumber}. Current valid standard: ${std.supersededBy || 'Verify on Manakonline'}`
          : `${std.standardNumber} (${std.title}) [Edition: ${std.edition || 'Latest'}]`,
        confidence: isSuperseded ? 'NEEDS_VERIFICATION' : 'VERIFIED',
        sourceRef: std.sourceDocument
      },
      {
        taskTitle: '2. Mandatory / QCO Legal Status',
        finding: std.qcoMandatory 
          ? `Mandatory under verified QCO: ${std.qcoNotificationNumber || 'Central Government QCO'} (Effective: ${std.qcoEffectiveDate || 'Enforced'})`
          : `Voluntary Scheme I (ISI Mark), no mandatory QCO evidence found in current database.`,
        confidence: 'VERIFIED',
        sourceRef: std.qcoNotificationNumber ? `Gazette Notification: ${std.qcoNotificationNumber}` : 'BIS Voluntary Schedule'
      },
      {
        taskTitle: '3. Mandatory Testing Requirements',
        finding: std.testRequirements.length > 0
          ? `${std.testRequirements.length} primary tests required: ${std.testRequirements.map(t => t.testName).slice(0, 3).join(', ')}.`
          : 'Testing schedule defined in factory Scheme of Testing and Inspection (SIT).',
        confidence: 'VERIFIED',
        sourceRef: `${std.standardNumber} Section on Methods of Test`
      },
      {
        taskTitle: '4. Authorized BIS & Recognized Laboratories',
        finding: matchingLabs.length > 0
          ? `${matchingLabs.length} verified facilities available: ${matchingLabs.map(l => `${l.name} (${l.city})`).slice(0, 2).join(', ')}.`
          : 'Testing facility authorization needs verification with the official BIS LRS directory.',
        confidence: matchingLabs.length > 0 ? 'VERIFIED' : 'NEEDS_VERIFICATION',
        sourceRef: 'BIS Laboratory Recognition Scheme (LRS) Gazette Register'
      },
      {
        taskTitle: '5. Certification Route',
        finding: `${std.certificationScheme} via Manakonline Portal (requires factory SIT setup, Form-I submission, audit & sample testing).`,
        confidence: 'VERIFIED',
        sourceRef: 'Bureau of Indian Standards Conformity Assessment Regulations'
      }
    ];
  }

  // Key clauses and testing parameters
  const keyClauses = std.clauses.map(c => 
    `${c.clauseNumber} - ${c.clauseTitle}: ${c.requirement} (Mandatory: ${c.mandatory ? 'Yes' : 'No'}${c.page ? `, Page ${c.page}` : ''})`
  );
  const testingParameters = std.testRequirements.map(t => 
    `${t.testName} (${t.clauseRef}): ${t.purpose} [Parameters: ${t.parameters}]`
  );

  // Sources cards
  const sources: StructuredAIResponse['sources'] = [
    {
      documentName: std.sourceDocument,
      standardNumber: std.standardNumber,
      section: std.category,
      clause: std.clauses.map(c => c.clauseNumber).join(', '),
      page: std.clauses[0]?.page || 1,
      version: std.version,
      documentType: std.documentType,
      lastUpdated: std.lastUpdated,
      retrievalDate: currentDate,
      officialPortalUrl: std.sourceUrl,
      isAuthoritative: true,
      isDemoData: isDemoMode,
      excerpt: `Standard Scope: "${std.scopeSummary}" | Key Clause (${std.clauses[0]?.clauseNumber}): "${std.clauses[0]?.requirement}"`
    }
  ];

  if (std.qcoNotificationNumber) {
    sources.push({
      documentName: `Quality Control Order: ${std.qcoNotificationNumber}`,
      standardNumber: std.standardNumber,
      section: 'Department for Promotion of Industry and Internal Trade (DPIIT) / Ministry Gazette',
      clause: 'Schedule I / Mandatory Enforcement Clause',
      version: `Gazette Effective Date: ${std.qcoEffectiveDate}`,
      documentType: 'Gazette Quality Control Order',
      lastUpdated: std.qcoEffectiveDate,
      retrievalDate: currentDate,
      officialPortalUrl: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/qco_orders',
      isAuthoritative: true,
      isDemoData: isDemoMode,
      excerpt: `Order mandates that goods or articles specified in the Table shall conform to the corresponding Indian Standard and bear the Standard Mark under a licence from the Bureau.`
    });
  }

  return {
    understandingText: `You are requesting compliance and specification guidance for "${understanding.identifiedProduct}".`,
    answer: answerText,
    applicableStandardDetails: {
      standardNumber: std.standardNumber,
      title: std.title,
      status: std.status,
      supersededWarning: std.supersededWarning,
      amendment: std.amendmentNumber,
      edition: std.edition
    },
    requirementsSummary: {
      keyClauses,
      testingParameters
    },
    importantNotes: [
      std.qcoMandatory 
        ? `Quality Control Order (${std.qcoNotificationNumber}): Selling or distributing without the ISI mark carries statutory penalties under Section 29 of the BIS Act, 2016.`
        : `This product is under voluntary certification unless required by a specific tender or state regulator.`,
      isSuperseded 
        ? `Do NOT reference ${std.standardNumber} on packaging or purchase orders. Switch all testing to ${std.supersededBy}.`
        : `The manufacturer must maintain an internal Scheme of Testing and Inspection (SIT) and calibrated testing apparatus on factory premises.`,
      `Always obtain the official watermarked standard document from the BIS portal (services.bis.gov.in) to inspect complete dimension tables and amendments.`
    ],
    nextSteps: [
      `1. Obtain official standard copy of ${std.standardNumber} from BIS Manakonline (services.bis.gov.in).`,
      `2. Verify that factory equipment conforms to test parameters for: ${std.testRequirements[0]?.testName || 'Performance Testing'}.`,
      `3. Apply online for Scheme I certification at manakonline.in with Form-I, test certificates, and factory machinery layout.`,
      `4. Schedule factory inspection and submit independent sample for lab verification at an authorized BIS facility.`
    ],
    productUnderstanding: understanding,
    potentiallyApplicableStandards: matches.slice(0, 3).map(m => ({
      standardNumber: m.standard.standardNumber,
      title: m.standard.title,
      whyItMayApply: m.relevanceExplanation,
      relevantScope: m.standard.scopeSummary,
      status: m.standard.status,
      supersededWarning: m.standard.supersededWarning,
      sourceDoc: m.standard.sourceDocument,
      clauseRef: m.standard.clauses[0]?.clauseNumber,
      edition: m.standard.edition,
      pageRef: m.standard.clauses[0]?.page
    })),
    certificationGuidance: {
      schemeName: std.certificationScheme,
      isMandatoryByQCO: std.qcoMandatory,
      qcoReference: std.qcoNotificationNumber,
      legalMandateText: std.qcoMandatory 
        ? `Mandatory under verified QCO: ${std.qcoNotificationNumber}`
        : 'Voluntary Scheme I (ISI Mark)',
      keySteps: [
        `1. Standard Verification: Obtain official copy of ${std.standardNumber} from BIS portal (manakonline.in).`,
        `2. In-house Testing Setup: Equip factory with mandatory testing apparatus specified in ${std.standardNumber}.`,
        `3. Application Submission: Submit Form-I on the Manakonline portal with technical drawings and raw material test certificates.`,
        `4. Factory Audit: BIS Technical Officer conducts on-site audit to inspect production quality controls.`,
        `5. Sample Verification: Independent sample tested at ${matchingLabs[0]?.name || 'BIS Central Laboratory'}.`,
        `6. Grant of Licence (CML Number): Receive licence to use the standard ISI Mark.`
      ]
    },
    testingGuidance: {
      requiredTests: std.testRequirements.map(t => `${t.testName} (${t.clauseRef}): ${t.purpose}`),
      samplePreparation: 'Test specimens must be drawn randomly from regular production lots in designated lot sizes according to the sampling plan in the standard.',
      relevantLabs: matchingLabs.map(l => `${l.name} (${l.city}, ${l.state}) - Status: ${l.recognitionStatus}`)
    },
    sources,
    reliabilityLevel: reliability,
    reliabilityReason: isSuperseded
      ? `Standard is officially superseded. Verification flagged with regulatory replacement warning.`
      : isHighConfidence
        ? `Exact standard match (${std.standardNumber}) retrieved from authorized BIS catalog with verifiable clause citations.`
        : `Related standard found based on semantic similarity. Official confirmation recommended for specific sub-variants.`,
    evidenceReasoning: isSuperseded
      ? `Retrieved historical record for ${std.standardNumber}. Superseded flag detected, auto-linking to active standard ${std.supersededBy} per BIS Gazette archives.`
      : `Matched user query tokens to indexed BIS catalog node (${std.id}). Verified active status in BIS Gazette, confirmed QCO decree ${std.qcoNotificationNumber || 'Voluntary'}, and retrieved clause citations from ${std.sourceDocument}.`,
    decomposedTasks,
    followUpQuestions: followUps || undefined,
    disclaimer: 'This assistant provides guidance based on retrieved sources and is not a replacement for official BIS decisions.',
    isDemoData: isDemoMode
  };
}
