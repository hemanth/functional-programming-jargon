const fs = require('fs');
const path = require('path');

const readmePath = fs.existsSync(path.join(__dirname, '../../readme.md'))
  ? path.join(__dirname, '../../readme.md')
  : path.join(__dirname, '../readme.md');
const content = fs.readFileSync(readmePath, 'utf8');

// Category mapping helper
const CATEGORY_MAP = {
  // Core Functions
  'function': 'core-functions',
  'pure-function': 'core-functions',
  'higher-order-functions-hof': 'core-functions',
  'lambda': 'core-functions',
  'closure': 'core-functions',
  'arity': 'core-functions',
  'predicate': 'core-functions',
  'total-function': 'core-functions',
  'partial-function': 'core-functions',
  'dealing-with-partial-functions': 'core-functions',
  'trampoline': 'core-functions',
  'thunk': 'core-functions',

  // Composition & Execution
  'function-composition': 'composition',
  'currying': 'composition',
  'auto-currying': 'composition',
  'partial-application': 'composition',
  'point-free-style': 'composition',
  'functional-combinator': 'composition',
  'continuation': 'composition',
  'lazy-evaluation': 'composition',
  'io': 'composition',
  'algebraic-effects': 'composition',

  // Purity & State
  'side-effects': 'purity-state',
  'referential-transparency': 'purity-state',
  'equational-reasoning': 'purity-state',
  'idempotence': 'purity-state',
  'value': 'purity-state',
  'constant': 'purity-state',
  'constant-function': 'purity-state',
  'contracts': 'purity-state',
  'memoization': 'purity-state',

  // Category Theory & Morphisms
  'category': 'category-morphisms',
  'semigroupoid': 'category-morphisms',
  'morphism': 'category-morphisms',
  'homomorphism': 'category-morphisms',
  'endomorphism': 'category-morphisms',
  'isomorphism': 'category-morphisms',
  'catamorphism': 'category-morphisms',
  'anamorphism': 'category-morphisms',
  'hylomorphism': 'category-morphisms',
  'paramorphism': 'category-morphisms',
  'apomorphism': 'category-morphisms',
  'natural-transformation': 'category-morphisms',

  // Algebraic Structures
  'functor': 'algebraic-structures',
  'pointed-functor': 'algebraic-structures',
  'applicative-functor': 'algebraic-structures',
  'monad': 'algebraic-structures',
  'free-monad': 'algebraic-structures',
  'monad-transformer': 'algebraic-structures',
  'comonad': 'algebraic-structures',
  'monoid': 'algebraic-structures',
  'semigroup': 'algebraic-structures',
  'setoid': 'algebraic-structures',
  'foldable': 'algebraic-structures',
  'kleisli-composition': 'algebraic-structures',
  'constant-functor': 'algebraic-structures',
  'constant-monad': 'algebraic-structures',
  'lift': 'algebraic-structures',
  'bifunctor': 'algebraic-structures',
  'profunctor': 'algebraic-structures',
  'traversable': 'algebraic-structures',
  'contravariant-functor': 'algebraic-structures',
  'alternative': 'algebraic-structures',

  // Types & Modeling
  'type-signatures': 'types-data',
  'algebraic-data-type': 'types-data',
  'sum-type': 'types-data',
  'product-type': 'types-data',
  'option': 'types-data',
  'either': 'types-data',
  'lens': 'types-data',
  'prism': 'types-data',
  'iso': 'types-data',
  'traversal': 'types-data',
  'lambda-calculus': 'types-data',
  'functional-programming-libraries-in-javascript': 'types-data'
};

const CATEGORIES = {
  'core-functions': {
    id: 'core-functions',
    name: 'Core Functions',
    description: 'First-class citizens, closures, predicates, and functional building blocks.',
    color: '#3b82f6', // blue
    accent: 'text-blue-500 bg-blue-500/10 border-blue-500/30'
  },
  'composition': {
    id: 'composition',
    name: 'Composition & Flow',
    description: 'Chaining, currying, partial application, and execution pipelines.',
    color: '#10b981', // emerald
    accent: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
  },
  'purity-state': {
    id: 'purity-state',
    name: 'Purity & Reasoning',
    description: 'Referential transparency, determinism, side effects, and equational proofs.',
    color: '#f59e0b', // amber
    accent: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
  },
  'category-morphisms': {
    id: 'category-morphisms',
    name: 'Category & Morphisms',
    description: 'Abstract mappings, homomorphisms, isomorphisms, and recursive fold/unfolds.',
    color: '#a855f7', // purple
    accent: 'text-purple-500 bg-purple-500/10 border-purple-500/30'
  },
  'algebraic-structures': {
    id: 'algebraic-structures',
    name: 'Algebraic Structures',
    description: 'Functors, Monads, Monoids, Semigroups, and Fantasy Land standards.',
    color: '#ec4899', // pink
    accent: 'text-pink-500 bg-pink-500/10 border-pink-500/30'
  },
  'types-data': {
    id: 'types-data',
    name: 'Types & Data Modeling',
    description: 'Algebraic data types, Option/Maybe, Lenses, and Type Signatures.',
    color: '#06b6d4', // cyan
    accent: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30'
  }
};

const ALIASES_MAP = {
  'option': ['maybe', 'some', 'none', 'just', 'nothing'],
  'either': ['result', 'left and right', 'right is right'],
  'point-free-style': ['tacit programming', 'tacit', 'point-free', 'pointfree'],
  'monad': ['flatmap', 'bind', 'chain', 'return'],
  'sum-type': ['union type', 'discriminated union', 'tagged union'],
  'product-type': ['tuple', 'pair', 'record', 'struct'],
  'arity': ['unary', 'binary', 'ternary', 'nullary', 'variadic'],
  'higher-order-functions-hof': ['hof', 'higher order function'],
  'pure-function': ['deterministic function', 'purity'],
  'catamorphism': ['fold', 'reduce', 'reduceright'],
  'anamorphism': ['unfold', 'generate'],
  'hylomorphism': ['refold', 'unfold-then-fold'],
  'paramorphism': ['para', 'reductive history'],
  'apomorphism': ['apo', 'early return unfold'],
  'algebraic-data-type': ['adt'],
  'referential-transparency': ['referential transparent', 'substitution model'],
  'equational-reasoning': ['algebraic reasoning'],
  'currying': ['curried'],
  'lambda': ['anonymous function', 'arrow function'],
  'functor': ['map', 'mappable'],
  'applicative-functor': ['applicative', 'ap'],
  'bifunctor': ['bimap', 'pair map'],
  'traversable': ['sequence', 'traverse'],
  'monoid': ['empty', 'identity', 'semigroup with identity'],
  'lens': ['getter', 'setter', 'optics'],
  'prism': ['affine traversal', 'sum optics'],
  'lazy-evaluation': ['call-by-need', 'deferred execution', 'generators'],
  'io': ['task', 'effect container', 'side effect recipe'],
  'trampoline': ['thunk loop', 'tail recursion optimization'],
  'thunk': ['deferred computation', 'nullary function', 'lazy thunk'],
  'memoization': ['memoize', 'memoized', 'caching'],
  'contravariant-functor': ['contravariant', 'cmap', 'contramap'],
  'alternative': ['alt', 'choice operator', 'fallback'],
  'natural-transformation': ['nat', 'functor transformation'],
  'iso': ['isomorphism optic', 'lossless conversion', 'reversible mapping']
};

// Explicit semantic connections between concepts in FP
const EXPLICIT_RELATIONSHIPS = [
  // Currying & Applications
  ['currying', 'partial-application'],
  ['currying', 'arity'],
  ['auto-currying', 'currying'],
  ['partial-application', 'higher-order-functions-hof'],
  ['point-free-style', 'currying'],
  ['point-free-style', 'function-composition'],
  ['point-free-style', 'higher-order-functions-hof'],
  ['functional-combinator', 'point-free-style'],
  ['functional-combinator', 'higher-order-functions-hof'],

  // Purity & State
  ['pure-function', 'side-effects'],
  ['pure-function', 'referential-transparency'],
  ['pure-function', 'idempotence'],
  ['pure-function', 'equational-reasoning'],
  ['referential-transparency', 'equational-reasoning'],
  ['referential-transparency', 'constant'],
  ['constant', 'constant-function'],
  ['constant-function', 'constant-functor'],
  ['constant-functor', 'constant-monad'],
  ['value', 'constant'],

  // Category Theory & Morphisms
  ['category', 'morphism'],
  ['category', 'function-composition'],
  ['morphism', 'homomorphism'],
  ['homomorphism', 'endomorphism'],
  ['homomorphism', 'isomorphism'],
  ['catamorphism', 'anamorphism'],
  ['catamorphism', 'foldable'],
  ['anamorphism', 'hylomorphism'],
  ['catamorphism', 'hylomorphism'],
  ['paramorphism', 'catamorphism'],
  ['apomorphism', 'anamorphism'],

  // Algebraic Structures
  ['semigroup', 'monoid'],
  ['monoid', 'foldable'],
  ['functor', 'pointed-functor'],
  ['functor', 'applicative-functor'],
  ['pointed-functor', 'applicative-functor'],
  ['applicative-functor', 'monad'],
  ['monad', 'kleisli-composition'],
  ['monad', 'comonad'],
  ['monad', 'option'],
  ['lift', 'applicative-functor'],
  ['lift', 'functor'],
  ['setoid', 'semigroup'],

  // Functions & Types
  ['function', 'pure-function'],
  ['function', 'lambda'],
  ['lambda', 'closure'],
  ['lambda', 'lambda-calculus'],
  ['higher-order-functions-hof', 'closure'],
  ['higher-order-functions-hof', 'predicate'],
  ['higher-order-functions-hof', 'function-composition'],
  ['continuation', 'higher-order-functions-hof'],
  ['lazy-evaluation', 'pure-function'],
  ['partial-function', 'total-function'],
  ['partial-function', 'dealing-with-partial-functions'],
  ['dealing-with-partial-functions', 'option'],
  ['algebraic-data-type', 'sum-type'],
  ['algebraic-data-type', 'product-type'],
  ['option', 'sum-type'],
  ['option', 'monad'],
  ['either', 'option'],
  ['either', 'sum-type'],
  ['either', 'monad'],
  ['either', 'bifunctor'],
  ['traversable', 'foldable'],
  ['traversable', 'functor'],
  ['traversable', 'applicative-functor'],
  ['bifunctor', 'functor'],
  ['bifunctor', 'product-type'],
  ['lens', 'function-composition'],
  ['lens', 'pure-function'],
  ['prism', 'lens'],
  ['prism', 'sum-type'],
  ['prism', 'option'],
  ['io', 'side-effects'],
  ['io', 'monad'],
  ['io', 'lazy-evaluation'],
  ['trampoline', 'higher-order-functions-hof'],
  ['trampoline', 'continuation'],
  ['thunk', 'lazy-evaluation'],
  ['thunk', 'trampoline'],
  ['thunk', 'io'],
  ['memoization', 'pure-function'],
  ['memoization', 'referential-transparency'],
  ['memoization', 'idempotence'],
  ['contravariant-functor', 'functor'],
  ['contravariant-functor', 'predicate'],
  ['alternative', 'applicative-functor'],
  ['alternative', 'monoid'],
  ['alternative', 'option'],
  ['natural-transformation', 'functor'],
  ['natural-transformation', 'morphism'],
  ['natural-transformation', 'category'],
  ['iso', 'lens'],
  ['iso', 'prism'],
  ['iso', 'isomorphism'],
  ['contracts', 'type-signatures'],
  ['free-monad', 'monad'],
  ['free-monad', 'functor'],
  ['free-monad', 'io'],
  ['monad-transformer', 'monad'],
  ['monad-transformer', 'kleisli-composition'],
  ['monad-transformer', 'either'],
  ['profunctor', 'bifunctor'],
  ['profunctor', 'contravariant-functor'],
  ['profunctor', 'lens'],
  ['semigroupoid', 'category'],
  ['semigroupoid', 'function-composition'],
  ['semigroupoid', 'semigroup'],
  ['traversal', 'lens'],
  ['traversal', 'prism'],
  ['traversal', 'traversable'],
  ['algebraic-effects', 'continuation'],
  ['algebraic-effects', 'side-effects'],
  ['algebraic-effects', 'free-monad']
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Slice out main content after TOC
const tocEndMarker = '<!-- /RM -->';
const tocIndex = content.indexOf(tocEndMarker);
const mainBody = tocIndex !== -1 ? content.slice(tocIndex + tocEndMarker.length) : content;

// Match ## or ### headings
const sectionRegex = /(?:^|\n)(#{2,3})\s+([^\n]+)\n([\s\S]*?)(?=(?:\n#{2,3}\s+[^\n]+|$))/g;

const entries = [];
let match;

while ((match = sectionRegex.exec(mainBody)) !== null) {
  const depth = match[1].length;
  const rawTitle = match[2].trim();
  const rawBody = match[3].trim();

  // If this is the "Functional Programming Libraries in JavaScript" section, handle specially or include as a term
  const slug = slugify(rawTitle);

  // Extract code snippets
  const codeBlocks = [];
  const codeRegex = /```(js|javascript)?\n([\s\S]*?)```/g;
  let codeMatch;
  while ((codeMatch = codeRegex.exec(rawBody)) !== null) {
    codeBlocks.push({
      lang: codeMatch[1] || 'js',
      code: codeMatch[2].trim()
    });
  }

  // Extract further reading links
  const furtherReading = [];
  const readingRegex = /\*\s+\[([^\]]+)\]\(([^)]+)\)/g;
  let rMatch;
  while ((rMatch = readingRegex.exec(rawBody)) !== null) {
    // Only capture if in further reading context
    if (rawBody.indexOf(rMatch[0]) > rawBody.toLowerCase().indexOf('further reading') ||
        rawBody.toLowerCase().indexOf('further reading') === -1) {
      furtherReading.push({
        title: rMatch[1],
        url: rMatch[2]
      });
    }
  }

  // Extract cross references from markdown links pointing to #slug
  const internalRefRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
  const crossRefs = new Set();
  let refMatch;
  while ((refMatch = internalRefRegex.exec(rawBody)) !== null) {
    crossRefs.add(refMatch[2].toLowerCase());
  }

  // Generate plain-text summary (first paragraph)
  const paragraphs = rawBody
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0 && !p.startsWith('```') && !p.startsWith('__Further') && !p.startsWith('*'));

  let summary = '';
  if (slug === 'functional-programming-libraries-in-javascript') {
    summary = 'A curated catalog of functional programming libraries and toolkits in JavaScript including Ramda, Folktale, Sanctuary, and fp-ts.';
  } else if (paragraphs[0]) {
    summary = paragraphs[0]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\n+/g, ' ')
      .trim();
  } else {
    summary = rawTitle;
  }

  const categoryId = CATEGORY_MAP[slug] || 'core-functions';

  entries.push({
    id: slug,
    title: rawTitle,
    depth,
    category: categoryId,
    aliases: ALIASES_MAP[slug] || [],
    summary,
    body: rawBody,
    codeBlocks,
    furtherReading,
    crossRefs: Array.from(crossRefs)
  });
}

// Build node and links graph
const termIds = new Set(entries.map(e => e.id));
const linksSet = new Set();
const links = [];

function addLink(source, target, type = 'semantic') {
  if (!termIds.has(source) || !termIds.has(target) || source === target) return;
  const key = [source, target].sort().join('---');
  if (linksSet.has(key)) return;
  linksSet.add(key);
  links.push({ source, target, type });
}

// Add explicit relationships
EXPLICIT_RELATIONSHIPS.forEach(([src, tgt]) => {
  addLink(src, tgt, 'core');
});

// Add cross references detected in markdown
entries.forEach(entry => {
  entry.crossRefs.forEach(targetSlug => {
    addLink(entry.id, targetSlug, 'reference');
  });
});

// Add relatedIds to each entry
entries.forEach(entry => {
  const related = new Set();
  links.forEach(link => {
    if (link.source === entry.id) related.add(link.target);
    if (link.target === entry.id) related.add(link.source);
  });
  entry.relatedIds = Array.from(related);
});

const output = {
  meta: {
    title: "FP Jargon",
    subtitle: "The vocabulary of functional programming mapped into an interactive graph",
    totalTerms: entries.length,
    totalRelationships: links.length,
    sourceRepo: "https://github.com/hemanth/functional-programming-jargon",
    originalAuthor: "Hemanth HM"
  },
  categories: CATEGORIES,
  terms: entries,
  graph: {
    nodes: entries.map(e => ({
      id: e.id,
      name: e.title,
      category: e.category,
      val: e.relatedIds.length + (e.depth === 2 ? 4 : 2),
      summary: e.summary
    })),
    links
  }
};

const outputPath = path.join(__dirname, '../src/data/jargons.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

// Also export to public directory for direct agent access
const publicDataDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(publicDataDir)) fs.mkdirSync(publicDataDir, { recursive: true });
fs.writeFileSync(path.join(publicDataDir, 'jargons.json'), JSON.stringify(output, null, 2), 'utf8');

// Generate agent-readable full text reference (llms-full.txt)
let llmsFull = `# FP Jargon - Full Reference

> Complete catalog of ${entries.length} functional programming concepts, morphisms, algebraic structures, and category theory terms with JavaScript ES2015 examples.
> Source: https://github.com/hemanth/functional-programming-jargon
> Live app: https://hemanth.github.io/functional-programming-jargon/

`;

entries.forEach(e => {
  llmsFull += `## ${e.title}\n\n`;
  llmsFull += `- Category: ${CATEGORIES[e.category]?.name || e.category}\n`;
  llmsFull += `- ID: #${e.id}\n`;
  if (e.aliases && e.aliases.length > 0) {
    llmsFull += `- Aliases: ${e.aliases.join(', ')}\n`;
  }
  if (e.relatedIds && e.relatedIds.length > 0) {
    llmsFull += `- Related concepts: ${e.relatedIds.map(id => `#${id}`).join(', ')}\n`;
  }
  llmsFull += `\n### Definition\n${e.summary}\n\n`;
  
  if (e.codeBlocks && e.codeBlocks.length > 0) {
    llmsFull += `### Code Examples\n\n`;
    e.codeBlocks.forEach(cb => {
      llmsFull += `\`\`\`${cb.lang}\n${cb.code}\n\`\`\`\n\n`;
    });
  }
  
  llmsFull += `---\n\n`;
});

const llmsFullPath = path.join(__dirname, '../public/llms-full.txt');
fs.writeFileSync(llmsFullPath, llmsFull, 'utf8');

// Also generate llms.txt index per llmstxt.org specification
let llmsTxt = `# FP Jargon

> Interactive functional programming knowledge graph and specification exploring ${entries.length} concepts, category theory morphisms, and algebraic structures with JavaScript ES2015 examples.

FP Jargon maps out the entire vocabulary of functional programming into an interconnected graph with deterministic explanations, formal properties, and executable JavaScript examples.

## Links

- [Interactive Knowledge Graph](https://hemanth.github.io/functional-programming-jargon/): The live interactive application
- [Full Text Specification (llms-full.txt)](https://hemanth.github.io/functional-programming-jargon/llms-full.txt): Complete catalog with all definitions and code blocks
- [Raw JSON Dataset](https://hemanth.github.io/functional-programming-jargon/data/jargons.json): Structured JSON dataset of terms, categories, and graph edges
- [GitHub Repository](https://github.com/hemanth/functional-programming-jargon): Source code and collaborative community specification
- [Author](https://h3manth.com): Hemanth HM

## Categories & Concepts

`;

Object.keys(CATEGORIES).forEach(catKey => {
  const cat = CATEGORIES[catKey];
  const catEntries = entries.filter(e => e.category === catKey);
  if (catEntries.length > 0) {
    llmsTxt += `### ${cat.name}\n`;
    catEntries.forEach(e => {
      const summaryClean = (e.summary || '').replace(/\n+/g, ' ').slice(0, 120);
      llmsTxt += `- [${e.title}](https://hemanth.github.io/functional-programming-jargon/#${e.id}): ${summaryClean}\n`;
    });
    llmsTxt += `\n`;
  }
});

llmsTxt += `## Agent & LLM Usage

AI agents can directly query or ingest this dataset via:
- LLMS Full Text: \`https://hemanth.github.io/functional-programming-jargon/llms-full.txt\`
- Raw JSON Graph API: \`https://hemanth.github.io/functional-programming-jargon/data/jargons.json\`
`;

const llmsTxtPath = path.join(__dirname, '../public/llms.txt');
fs.writeFileSync(llmsTxtPath, llmsTxt, 'utf8');

console.log(`Successfully parsed ${entries.length} terms and ${links.length} graph connections into ${outputPath}, public/data/jargons.json, llms.txt, and llms-full.txt`);


