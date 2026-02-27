/* ═══════════════════════════════════════════════════════
   GOLDSTAR TCG TERMINAL v5  ·  app.js
   GoldStarTCG LLC  ·  goldstaartcg (eBay)  ·  @goldstartcg.llc
   ENHANCED v5: Language-aware pricing, Universal Search, Enhanced Portfolio
═══════════════════════════════════════════════════════ */

const CGI_BIN = "__CGI_BIN__";
let sessionStartValue = 0;

// ─────────────────────────────────────────────────────
// URL BUILDERS (TCGPlayer + eBay deep links) — language-aware
// ─────────────────────────────────────────────────────
function tcgPlayerUrl(cardName, lang='EN') {
  const q = lang === 'JP' ? `${cardName} Japanese` : cardName;
  return `https://www.tcgplayer.com/search/all/product?q=${encodeURIComponent(q)}`;
}
function ebaySearchUrl(cardName, lang='EN') {
  const langTag = lang === 'JP' ? ' Japanese' : ' English';
  return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(cardName + langTag)}&_sacat=0&LH_Sold=1`;
}
function ebayBuyUrl(cardName, lang='EN') {
  const langTag = lang === 'JP' ? ' Japanese' : ' English';
  return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(cardName + langTag)}&_sacat=0&LH_BIN=1&_sop=15`;
}
function cardMarketUrl(cardName) {
  return `https://www.cardmarket.com/en/Magic/Products/Search?searchString=${encodeURIComponent(cardName)}`;
}
function collectrUrl() {
  return 'https://app.getcollectr.com/showcase/profile/e59fe50f-3a80-4602-928b-6576c90b71fb';
}
function goldstarEbayUrl() {
  return 'https://www.ebay.com/usr/goldstaartcg';
}
function goldstarIgUrl() {
  return 'https://www.instagram.com/goldstartcg.llc/';
}

// ─────────────────────────────────────────────────────
// CARD DATA UNIVERSE (48 cards) — v5: lang field added
// ─────────────────────────────────────────────────────
const CARDS = [
  // ── POKEMON ──
  { sym:"CHARZ-EX",   name:"Charizard ex SIR 199/165 (151)",       game:"pokemon",  set:"151",             setNum:"199/165", lang:"EN", price:220.00, change7:8.2,  change30:22.1, vol:"1.2K" },
  { sym:"MOONBREON",  name:"Umbreon VMAX Alt Art (Evolving Skies)", game:"pokemon",  set:"Evolving Skies",  setNum:"",        lang:"EN", price:485.00, change7:3.1,  change30:12.5, vol:"890"  },
  { sym:"MEW-053",    name:"Mew ex 053 Promo",                      game:"pokemon",  set:"Promo",           setNum:"053",     lang:"EN", price:52.00,  change7:-1.8, change30:4.2,  vol:"2.1K" },
  { sym:"PIKAVMAX",   name:"Pikachu VMAX Rainbow (Vivid Voltage)",  game:"pokemon",  set:"Vivid Voltage",   setNum:"",        lang:"EN", price:310.00, change7:5.4,  change30:18.7, vol:"650"  },
  { sym:"ESPVMAX",    name:"Espeon VMAX Alt Art (Evolving Skies)",  game:"pokemon",  set:"Evolving Skies",  setNum:"",        lang:"EN", price:225.00, change7:2.8,  change30:9.4,  vol:"430"  },
  { sym:"LUGIA-V",    name:"Lugia V Alt Art (Silver Tempest)",      game:"pokemon",  set:"Silver Tempest",  setNum:"",        lang:"EN", price:178.00, change7:-4.2, change30:-8.1, vol:"760"  },
  { sym:"CHARZPR",    name:"Charizard VSTAR Promo SWSH262",         game:"pokemon",  set:"Promo",           setNum:"SWSH262", lang:"EN", price:54.00,  change7:1.1,  change30:7.5,  vol:"940"  },
  { sym:"CHARZ-HB",   name:"Charizard-H (Obsidian Flames) ex",      game:"pokemon",  set:"Obsidian Flames", setNum:"",        lang:"EN", price:135.00, change7:6.8,  change30:24.3, vol:"1.8K" },
  { sym:"RALTS-SIR",  name:"Gardevoir ex SIR (Paldea Evolved)",     game:"pokemon",  set:"Paldea Evolved",  setNum:"",        lang:"EN", price:68.00,  change7:9.2,  change30:31.0, vol:"3.2K" },
  { sym:"MIRAIDON",   name:"Miraidon ex SIR (Scarlet & Violet)",    game:"pokemon",  set:"SV Base",         setNum:"",        lang:"EN", price:42.00,  change7:-2.1, change30:3.1,  vol:"1.5K" },
  { sym:"CORVI-V",    name:"Corviknight VMAX Alt Art (Rebel Clash)", game:"pokemon",  set:"Rebel Clash",     setNum:"",        lang:"EN", price:89.00,  change7:4.5,  change30:11.0, vol:"510"  },
  { sym:"SYLVEON",    name:"Sylveon VMAX Alt Art (Evolving Skies)", game:"pokemon",  set:"Evolving Skies",  setNum:"",        lang:"EN", price:115.00, change7:3.2,  change30:7.8,  vol:"340"  },
  { sym:"CHARZ-RAD",  name:"Charizard ex Full Art (PAL Base)",      game:"pokemon",  set:"Paldean Fates",   setNum:"",        lang:"EN", price:185.00, change7:11.4, change30:38.2, vol:"4.1K" },
  { sym:"PIKACHU-WB", name:"Pikachu World's 2016 Promo",            game:"pokemon",  set:"Promo",           setNum:"WCS2016", lang:"EN", price:820.00, change7:1.0,  change30:5.5,  vol:"120"  },
  { sym:"BLISSY-ALT", name:"Blissey V Alt Art (Chilling Reign)",    game:"pokemon",  set:"Chilling Reign",  setNum:"",        lang:"EN", price:62.00,  change7:0.5,  change30:-2.8, vol:"290"  },

  // ── MAGIC ──
  { sym:"BLKLOTUS",   name:"Black Lotus (Alpha)",                   game:"magic",    set:"Alpha",           setNum:"",        lang:"EN", price:65000.0,change7:0.8,  change30:4.2,  vol:"12"   },
  { sym:"MOXPEARL",   name:"Mox Pearl (Beta)",                      game:"magic",    set:"Beta",            setNum:"",        lang:"EN", price:3200.0, change7:1.2,  change30:6.8,  vol:"45"   },
  { sym:"TIMETWST",   name:"Timetwister (Unlimited)",               game:"magic",    set:"Unlimited",       setNum:"",        lang:"EN", price:5142.0, change7:0.5,  change30:2.1,  vol:"28"   },
  { sym:"FORCEWLL",   name:"Force of Will (Alliances)",             game:"magic",    set:"Alliances",       setNum:"",        lang:"EN", price:89.00,  change7:3.4,  change30:8.9,  vol:"1.1K" },
  { sym:"MANACRYPT",  name:"Mana Crypt (Mystery Booster)",          game:"magic",    set:"Mystery Booster", setNum:"",        lang:"EN", price:165.00, change7:-1.8, change30:5.2,  vol:"890"  },
  { sym:"GAESCRD",    name:"Gaea's Cradle (Urza's Saga)",           game:"magic",    set:"Urza's Saga",     setNum:"",        lang:"EN", price:750.00, change7:2.3,  change30:9.7,  vol:"210"  },
  { sym:"DBLSEASN",   name:"Doubling Season (Ravnica)",             game:"magic",    set:"Ravnica",         setNum:"",        lang:"EN", price:55.00,  change7:0.9,  change30:-1.4, vol:"2.3K" },
  { sym:"SNAPCSTR",   name:"Snapcaster Mage (INN)",                 game:"magic",    set:"Innistrad",       setNum:"",        lang:"EN", price:42.00,  change7:1.8,  change30:4.1,  vol:"1.7K" },
  { sym:"LILIANA",    name:"Liliana of the Veil (INN)",             game:"magic",    set:"Innistrad",       setNum:"",        lang:"EN", price:31.00,  change7:-0.8, change30:2.3,  vol:"2.1K" },
  { sym:"FETHLAND",   name:"Fetchland Scalding Tarn (ZEN)",         game:"magic",    set:"Zendikar",        setNum:"",        lang:"EN", price:72.00,  change7:2.1,  change30:6.4,  vol:"3.5K" },
  { sym:"DARKRTL",    name:"Dark Ritual (Alpha)",                   game:"magic",    set:"Alpha",           setNum:"",        lang:"EN", price:410.00, change7:0.3,  change30:1.8,  vol:"95"   },
  { sym:"ANCESTRL",   name:"Ancestral Recall (Beta)",               game:"magic",    set:"Beta",            setNum:"",        lang:"EN", price:7200.0, change7:0.9,  change30:3.5,  vol:"18"   },
  { sym:"SOLRING",    name:"Sol Ring (Alpha)",                      game:"magic",    set:"Alpha",           setNum:"",        lang:"EN", price:1850.0, change7:1.4,  change30:5.2,  vol:"52"   },

  // ── ONE PIECE ──
  { sym:"SABO-OP13",  name:"Sabo OP13-120 Super AA",                game:"onepiece", set:"OP-13",           setNum:"OP13-120",lang:"JP", price:3500.0, change7:15.2, change30:42.8, vol:"180"  },
  { sym:"SHANKS-01",  name:"Shanks OP01 SEC",                       game:"onepiece", set:"OP-01",           setNum:"OP01-SEC",lang:"EN", price:280.00, change7:5.8,  change30:18.4, vol:"620"  },
  { sym:"YAMATO-05",  name:"Yamato OP05 Alt Art",                   game:"onepiece", set:"OP-05",           setNum:"",        lang:"EN", price:85.00,  change7:2.4,  change30:9.1,  vol:"1.1K" },
  { sym:"PERONA-14",  name:"Perona OP14",                           game:"onepiece", set:"OP-14",           setNum:"",        lang:"EN", price:13.00,  change7:85.7, change30:220.0,vol:"4.8K" },
  { sym:"LAW-OP05",   name:"Trafalgar Law OP05",                    game:"onepiece", set:"OP-05",           setNum:"",        lang:"EN", price:45.00,  change7:8.9,  change30:22.5, vol:"1.4K" },
  { sym:"LUFFY-ALT",  name:"Luffy OP01 Alt Art",                    game:"onepiece", set:"OP-01",           setNum:"",        lang:"EN", price:420.00, change7:3.2,  change30:14.8, vol:"480"  },
  { sym:"ZORO-OP04",  name:"Zoro OP04 Leader AA",                   game:"onepiece", set:"OP-04",           setNum:"",        lang:"EN", price:95.00,  change7:-1.5, change30:5.3,  vol:"870"  },
  { sym:"ACE-OP01",   name:"Portgas Ace OP01 SEC",                  game:"onepiece", set:"OP-01",           setNum:"",        lang:"EN", price:165.00, change7:4.1,  change30:12.6, vol:"710"  },
  { sym:"NAMI-OP04",  name:"Nami OP04 Alt Art",                     game:"onepiece", set:"OP-04",           setNum:"",        lang:"EN", price:38.00,  change7:6.8,  change30:25.4, vol:"1.9K" },
  { sym:"KAIDO-OP04", name:"Kaido OP04 Leader",                     game:"onepiece", set:"OP-04",           setNum:"",        lang:"EN", price:72.00,  change7:-3.4, change30:-5.2, vol:"650"  },
  { sym:"BIG-MOM",    name:"Big Mom OP04 Parallel",                 game:"onepiece", set:"OP-04",           setNum:"",        lang:"EN", price:55.00,  change7:7.2,  change30:19.1, vol:"920"  },
  { sym:"ROBIN-OP07", name:"Robin OP07 SEC",                        game:"onepiece", set:"OP-07",           setNum:"",        lang:"EN", price:210.00, change7:9.8,  change30:28.3, vol:"390"  },
  { sym:"COBY-OP10",  name:"Coby OP10 Leader Alt",                  game:"onepiece", set:"OP-10",           setNum:"",        lang:"EN", price:48.00,  change7:12.4, change30:35.7, vol:"2.2K" },
  { sym:"BENN-OP06",  name:"Beckman OP06 Parallel",                 game:"onepiece", set:"OP-06",           setNum:"",        lang:"EN", price:29.00,  change7:3.8,  change30:8.6,  vol:"1.3K" },
];

// ─────────────────────────────────────────────────────
// SEALED PRODUCTS — v5: lang field added
// ─────────────────────────────────────────────────────
const SEALED = [
  { name:"Scarlet & Violet Elite Trainer Box",  game:"pokemon",  lang:"EN", price:52,  cost:45,  trend:"up",  rating:4, breakEven:"$41 EV",  notes:"Strong reprint risk",   heat:"cool" },
  { name:"Evolving Skies Booster Box",          game:"pokemon",  lang:"EN", price:420, cost:95,  trend:"up",  rating:5, breakEven:"$340 EV", notes:"No reprint, grail set",  heat:"hot"  },
  { name:"151 Booster Box",                     game:"pokemon",  lang:"EN", price:175, cost:85,  trend:"flat",rating:3, breakEven:"$155 EV", notes:"Heavy supply",           heat:"cool" },
  { name:"Obsidian Flames ETB",                 game:"pokemon",  lang:"EN", price:48,  cost:40,  trend:"up",  rating:4, breakEven:"$38 EV",  notes:"Charz hype driver",      heat:"hot"  },
  { name:"Paldean Fates ETB",                   game:"pokemon",  lang:"EN", price:45,  cost:38,  trend:"down",rating:2, breakEven:"$32 EV",  notes:"Waning interest",        heat:"cold" },
  { name:"Eevee Heroes Booster Box (JPN)",      game:"pokemon",  lang:"JP", price:310, cost:72,  trend:"up",  rating:5, breakEven:"$240 EV", notes:"Alt art eeveelutions",   heat:"hot"  },
  { name:"Crown Zenith ETB",                    game:"pokemon",  lang:"EN", price:62,  cost:50,  trend:"flat",rating:3, breakEven:"$48 EV",  notes:"Galarian Gallery strong",heat:"cool" },
  { name:"Silver Tempest Booster Box",          game:"pokemon",  lang:"EN", price:95,  cost:85,  trend:"down",rating:2, breakEven:"$78 EV",  notes:"Lugia carries EV",       heat:"cold" },
  { name:"Alpha Edition Booster Pack (MTG)",    game:"magic",    lang:"EN", price:4800,cost:2200,trend:"up",  rating:5, breakEven:"$3200 EV",notes:"Unopened grail",         heat:"hot"  },
  { name:"Innistrad Booster Box (MTG)",         game:"magic",    lang:"EN", price:620, cost:280, trend:"up",  rating:4, breakEven:"$490 EV", notes:"Snapper + lilliana",     heat:"hot"  },
  { name:"Mystery Booster Box (MTG)",           game:"magic",    lang:"EN", price:155, cost:120, trend:"flat",rating:3, breakEven:"$130 EV", notes:"Mana Crypt hits big",    heat:"cool" },
  { name:"OP-01 Romance Dawn Booster Box",      game:"onepiece", lang:"EN", price:285, cost:72,  trend:"up",  rating:5, breakEven:"$210 EV", notes:"Luffy/Shanks chase",     heat:"hot"  },
  { name:"OP-05 Awakening of the New Era Box",  game:"onepiece", lang:"EN", price:180, cost:68,  trend:"up",  rating:4, breakEven:"$140 EV", notes:"Yamato chase",           heat:"hot"  },
  { name:"OP-13 Ultra Deck Box",                game:"onepiece", lang:"JP", price:320, cost:75,  trend:"up",  rating:5, breakEven:"$250 EV", notes:"Sabo breakout potential",heat:"hot"  },
  { name:"OP-04 Kingdoms of Intrigue Box",      game:"onepiece", lang:"EN", price:145, cost:65,  trend:"flat",rating:3, breakEven:"$115 EV", notes:"Kaido/BM chase",         heat:"cool" },
];

// ─────────────────────────────────────────────────────
// ARBITRAGE DATA
// ─────────────────────────────────────────────────────
const ARB_DATA = [
  { card:"Charizard ex SIR 199/165",   sym:"CHARZ-EX",   game:"pokemon",  lang:"EN", tcgp:220,  ebay:265,  spread:45,  spreadPct:20.5, signal:"BUY",  flipScore:9, cat:"grail",  volume:"HIGH",  profitEst:31.5 },
  { card:"Umbreon VMAX Alt Art",       sym:"MOONBREON",  game:"pokemon",  lang:"EN", tcgp:485,  ebay:540,  spread:55,  spreadPct:11.3, signal:"BUY",  flipScore:8, cat:"grail",  volume:"MED",   profitEst:26.1 },
  { card:"Sabo OP13-120 Super AA",     sym:"SABO-OP13",  game:"onepiece", lang:"JP", tcgp:3200, ebay:3500, spread:300, spreadPct:9.4,  signal:"BUY",  flipScore:9, cat:"grail",  volume:"LOW",   profitEst:188  },
  { card:"Perona OP14",               sym:"PERONA-14",  game:"onepiece", lang:"EN", tcgp:8,    ebay:13,   spread:5,   spreadPct:62.5, signal:"BUY",  flipScore:7, cat:"flip",   volume:"HIGH",  profitEst:3.4  },
  { card:"Charizard VSTAR Promo",     sym:"CHARZPR",    game:"pokemon",  lang:"EN", tcgp:60,   ebay:54,   spread:-6,  spreadPct:-10,  signal:"SELL", flipScore:4, cat:"flip",   volume:"HIGH",  profitEst:-1.2 },
  { card:"Lugia V Alt Art",           sym:"LUGIA-V",    game:"pokemon",  lang:"EN", tcgp:178,  ebay:155,  spread:-23, spreadPct:-12.9,signal:"SELL", flipScore:3, cat:"grail",  volume:"MED",   profitEst:-6.8 },
  { card:"Pikachu VMAX Rainbow",      sym:"PIKAVMAX",   game:"pokemon",  lang:"EN", tcgp:310,  ebay:350,  spread:40,  spreadPct:12.9, signal:"BUY",  flipScore:8, cat:"grail",  volume:"MED",   profitEst:22.0 },
  { card:"Shanks OP01 SEC",           sym:"SHANKS-01",  game:"onepiece", lang:"EN", tcgp:260,  ebay:280,  spread:20,  spreadPct:7.7,  signal:"BUY",  flipScore:7, cat:"grail",  volume:"MED",   profitEst:8.4  },
  { card:"Gardevoir ex SIR",          sym:"RALTS-SIR",  game:"pokemon",  lang:"EN", tcgp:65,   ebay:68,   spread:3,   spreadPct:4.6,  signal:"HOLD", flipScore:5, cat:"flip",   volume:"HIGH",  profitEst:0.8  },
  { card:"Force of Will (Alliances)", sym:"FORCEWLL",   game:"magic",    lang:"EN", tcgp:85,   ebay:96,   spread:11,  spreadPct:12.9, signal:"BUY",  flipScore:7, cat:"flip",   volume:"MED",   profitEst:5.4  },
  { card:"Mana Crypt (Myst. Booster)",sym:"MANACRYPT",  game:"magic",    lang:"EN", tcgp:162,  ebay:155,  spread:-7,  spreadPct:-4.3, signal:"HOLD", flipScore:5, cat:"flip",   volume:"HIGH",  profitEst:-2.2 },
  { card:"Gaea's Cradle",            sym:"GAESCRD",    game:"magic",    lang:"EN", tcgp:720,  ebay:795,  spread:75,  spreadPct:10.4, signal:"BUY",  flipScore:8, cat:"grail",  volume:"LOW",   profitEst:44.8 },
  { card:"Evolving Skies BB (Sealed)",sym:"ES-SEALED",  game:"pokemon",  lang:"EN", tcgp:390,  ebay:425,  spread:35,  spreadPct:9.0,  signal:"BUY",  flipScore:8, cat:"sealed", volume:"MED",   profitEst:17.5 },
  { card:"OP-01 Romance Dawn BB",    sym:"OP01-BOX",   game:"onepiece", lang:"EN", tcgp:260,  ebay:285,  spread:25,  spreadPct:9.6,  signal:"BUY",  flipScore:7, cat:"sealed", volume:"MED",   profitEst:10.9 },
  { card:"Robin OP07 SEC",           sym:"ROBIN-OP07", game:"onepiece", lang:"EN", tcgp:195,  ebay:215,  spread:20,  spreadPct:10.3, signal:"BUY",  flipScore:7, cat:"flip",   volume:"MED",   profitEst:9.8  },
  { card:"Espeon VMAX Alt Art",      sym:"ESPVMAX",    game:"pokemon",  lang:"EN", tcgp:220,  ebay:230,  spread:10,  spreadPct:4.5,  signal:"HOLD", flipScore:5, cat:"grail",  volume:"LOW",   profitEst:1.6  },
  { card:"Doubling Season (Ravnica)", sym:"DBLSEASN",   game:"magic",    lang:"EN", tcgp:52,   ebay:60,   spread:8,   spreadPct:15.4, signal:"BUY",  flipScore:7, cat:"flip",   volume:"MED",   profitEst:3.8  },
  { card:"Yamato OP05 Alt Art",      sym:"YAMATO-05",  game:"onepiece", lang:"EN", tcgp:80,   ebay:89,   spread:9,   spreadPct:11.3, signal:"BUY",  flipScore:6, cat:"flip",   volume:"MED",   profitEst:4.2  },
];

// ─────────────────────────────────────────────────────
// NEWS DATA
// ─────────────────────────────────────────────────────
const NEWS = [
  { headline:"GoldStar Intel: Sabo OP13-120 Super AA — Population under 200 raw, massive grail play at current $3500", source:"GOLDSTAR INTEL", sourceClass:"goldstar", time:3,  tag:"bullish",  url:"#" },
  { headline:"PSA submissions back to 30-day turnaround after holiday backlog clears — grading window open", source:"PSA",          sourceClass:"",         time:8,  tag:"bullish",  url:"#" },
  { headline:"Charizard ex SIR 199/165 breaks $280 on eBay — 151 set demand outpacing supply at distributor level", source:"TCGPLAYER",    sourceClass:"",         time:12, tag:"bullish",  url:"#" },
  { headline:"One Piece TCG English OP-13 distribution confirmed Q2 — JP premium expected to compress 15-20%", source:"BANDAI",       sourceClass:"",         time:18, tag:"bearish",  url:"#" },
  { headline:"GoldStar Intel: Moonbreon holding $485+ floor — low pop PSA 10s trading $1,800+ confirming grail status", source:"GOLDSTAR INTEL", sourceClass:"goldstar", time:25, tag:"bullish",  url:"#" },
  { headline:"Pokemon TCG 2026 SV roadmap leaked: 4 alt-art heavy sets planned — Eevee Heroes energy returns", source:"POKEBEACH",    sourceClass:"",         time:42, tag:"bullish",  url:"#" },
  { headline:"Magic: The Gathering Reserved List — WotC reaffirms no changes in Q1 earnings call", source:"WOTC",         sourceClass:"",         time:58, tag:"neutral",  url:"#" },
  { headline:"GoldStar Intel: Perona OP14 — under-the-radar buy. 85% gain in 30 days, supply tight from JPN", source:"GOLDSTAR INTEL", sourceClass:"goldstar", time:67, tag:"intel",    url:"#" },
  { headline:"Gaea's Cradle (Urza's Saga) hits $800+ on multiple eBay sales — Commander demand sustaining premium", source:"MTGFINANCE",   sourceClass:"",         time:89, tag:"bullish",  url:"#" },
  { headline:"eBay authenticates TCG items over $750 — grading arbitrage on raw Moonbreons becoming viable", source:"EBAY",         sourceClass:"",         time:104,tag:"bullish",  url:"#" },
  { headline:"GoldStar Intel: Show season pickup — Chicago regionals Feb 28-Mar 2 driving local demand for sealed OP product", source:"GOLDSTAR INTEL", sourceClass:"goldstar", time:118,tag:"intel",    url:"#" },
  { headline:"Evolving Skies no reprint confirmed for 3rd year — MSRP booster boxes now $420 and rising", source:"POKEMON CO",   sourceClass:"",         time:145,tag:"bullish",  url:"#" },
  { headline:"Alpha Black Lotus sells for $65,000 raw on eBay — collector market strengthening for power 9", source:"HERITAGE",     sourceClass:"",         time:162,tag:"bullish",  url:"#" },
  { headline:"One Piece TCG tournament attendance up 340% YoY — retailer reorders indicate supply shortage incoming", source:"BANDAI",       sourceClass:"",         time:184,tag:"bullish",  url:"#" },
  { headline:"GoldStar Intel: Force of Will (Alliances) undervalued vs CGC holders — buy under $95 for flip", source:"GOLDSTAR INTEL", sourceClass:"goldstar", time:201,tag:"intel",    url:"#" },
  { headline:"PSA CGC grading fee increase effective April 1 — rush orders ahead of deadline expected", source:"PSA/CGC",       sourceClass:"",         time:245,tag:"bearish",  url:"#" },
  { headline:"Pikachu VMAX Rainbow crossing $350 on BGS 9.5 — raw copies still available sub-$320 regionally", source:"TCGPLAYER",    sourceClass:"",         time:288,tag:"bullish",  url:"#" },
  { headline:"Shopify TCG store launches surge 180% in 2025 — B2C channel becoming critical for margin", source:"SHOPIFY",      sourceClass:"",         time:312,tag:"neutral",  url:"#" },
  { headline:"GoldStar Intel: Charizard VSTAR Promo SWSH262 — SELL signal. Oversupplied vs demand. Target $48", source:"GOLDSTAR INTEL", sourceClass:"goldstar", time:378,tag:"bearish",  url:"#" },
  { headline:"Luffy OP01 Alt Art maintains $420+ — cornerstone of One Piece high-end market", source:"CARDMARKET",   sourceClass:"",         time:412,tag:"bullish",  url:"#" },
  { headline:"Magic Modern format banlist update drops Cascade staples — fetchland demand increases", source:"WOTC",         sourceClass:"",         time:445,tag:"bullish",  url:"#" },
  { headline:"Pokemon Celebrations 25th Anniversary sealed rising — Dark Sylveon hitting $900+ on eBay", source:"EBAY",         sourceClass:"",         time:480,tag:"bullish",  url:"#" },
  { headline:"BGS announces new 'Pristine Black Label' tier — top PSA 10s re-submitting for premium marks", source:"BGS",          sourceClass:"",         time:510,tag:"neutral",  url:"#" },
  { headline:"GoldStar Intel: Robin OP07 SEC — buy window $195-205. Target $250 in 60 days as OP08 hype builds", source:"GOLDSTAR INTEL", sourceClass:"goldstar", time:540,tag:"intel",    url:"#" },
  { headline:"Card show circuit reporting record Q1 attendance — show-only exclusives driving 30%+ premiums",  source:"CARDSHOW.IO",  sourceClass:"",         time:620,tag:"bullish",  url:"#" },
];

// ─────────────────────────────────────────────────────
// MARKET INDICES
// ─────────────────────────────────────────────────────
const INDICES = [
  { id:"idx-poke",  label:"POKEMON INDEX", value:4287.52, change:+2.84, changePct:+3.12 },
  { id:"idx-magic", label:"MAGIC INDEX",   value:8143.80, change:+41.2, changePct:+0.51 },
  { id:"idx-op",    label:"ONE PIECE IDX", value:1892.34, change:+87.6, changePct:+4.86 },
  { id:"idx-gs",    label:"GOLDSTAR PORT", value:12450.0, change:+340,  changePct:+2.81 },
];

// ─────────────────────────────────────────────────────
// GRADING PRESETS
// ─────────────────────────────────────────────────────
const GRADE_PRESETS = [
  { name:"Charizard ex SIR 199/165", raw:220,  gradeService:"PSA", estGrade:9,  gradingCost:50 },
  { name:"Umbreon VMAX Alt Art",     raw:485,  gradeService:"PSA", estGrade:10, gradingCost:75 },
  { name:"Sabo OP13-120 Super AA",   raw:3500, gradeService:"PSA", estGrade:10, gradingCost:150},
  { name:"Pikachu VMAX Rainbow",     raw:310,  gradeService:"CGC", estGrade:9.5,gradingCost:50 },
  { name:"Luffy OP01 Alt Art",       raw:420,  gradeService:"PSA", estGrade:9,  gradingCost:50 },
  { name:"Gaea's Cradle",            raw:750,  gradeService:"BGS", estGrade:9,  gradingCost:100},
];

const GRADE_MULTIPLIERS = {
  PSA:  { 10:3.8, 9:1.9, 8:1.35, 7:1.1,  6:0.85 },
  CGC:  { "10":3.5, "9.5":2.8, "9":1.75, "8.5":1.3, "8":1.1 },
  BGS:  { "10":4.5, "9.5":3.2, "9":2.0,  "8.5":1.4, "8":1.1 },
};

const GRADE_OPTIONS = {
  PSA: [10, 9, 8, 7, 6],
  CGC: ["10", "9.5", "9", "8.5", "8"],
  BGS: ["10", "9.5", "9", "8.5", "8"],
};

const GRADE_COSTS = {
  PSA:  { regular:25,  express:75,  walkthrough:150, shipping:18, insurance:12 },
  CGC:  { economy:20,  standard:35, express:65,      shipping:15, insurance:10 },
  BGS:  { economy:20,  standard:30, express:90,      shipping:18, insurance:12 },
};

const GRADE_TURNAROUND = {
  PSA:  { regular:"30-45 days", express:"10-15 days", walkthrough:"2-3 days" },
  CGC:  { economy:"45-60 days", standard:"20-30 days",express:"5-10 days"    },
  BGS:  { economy:"30-45 days", standard:"15-25 days",express:"5-8 days"     },
};

// ─────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────
let currentView = "dashboard";
let currentChartCard = CARDS[0];
let priceChart = null;
let modalChart = null;
let sentimentChart = null;
let portfolioItems = [];
let watchlistItems = [];
let arbFilter = "all";
let sessionPnl = 0;
let sellTargetItem = null;
let isPremiumUser = false;

// Global search state
let searchOpen = false;
let searchQuery = '';
let searchFilter = 'all'; // all, pokemon, magic, onepiece, sealed

// Bulk selection state
let selectedPortfolioIds = new Set();

// Live price simulation
const livePrices = {};
CARDS.forEach(c => { livePrices[c.sym] = c.price; });

// ─────────────────────────────────────────────────────
// PRICE HISTORY GENERATOR
// ─────────────────────────────────────────────────────
function generatePriceHistory(basePrice, days=60, trend=0.002) {
  const pts = [];
  let p = basePrice * (0.78 + Math.random() * 0.12);
  for(let i=0; i<days; i++) {
    const noise = (Math.random()-0.48) * 0.032;
    p = p * (1 + trend + noise);
    if(p < basePrice * 0.5) p = basePrice * 0.5;
    pts.push(+p.toFixed(2));
  }
  pts[pts.length-1] = basePrice;
  return pts;
}

function movingAverage(data, window) {
  return data.map((_, i) => {
    if(i < window-1) return null;
    const slice = data.slice(i-window+1, i+1);
    return +(slice.reduce((a,b)=>a+b,0)/slice.length).toFixed(2);
  });
}

// ─────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────
function fmt$(n) {
  if(n >= 1000) return '$' + n.toLocaleString('en-US', {maximumFractionDigits:0});
  return '$' + n.toFixed(2);
}
function fmtChg(n, pct=false) {
  const sign = n >= 0 ? '+' : '';
  return pct ? `${sign}${n.toFixed(2)}%` : `${sign}${fmt$(Math.abs(n))}`;
}
function colorClass(n) { return n > 0 ? 'pos' : n < 0 ? 'neg' : 'neu'; }
function timeAgo(mins) {
  if(mins < 60) return `${mins}m ago`;
  if(mins < 1440) return `${Math.floor(mins/60)}h ago`;
  return `${Math.floor(mins/1440)}d ago`;
}
function starRating(n) {
  let s='';
  for(let i=1;i<=5;i++) s+=`<span class="sc-star${i<=n?'':' empty'}">★</span>`;
  return s;
}
function gameClass(g) {
  return g==='pokemon'?'pokemon':g==='magic'?'magic':'onepiece';
}
function gameName(g) {
  return g==='pokemon'?'PKM':g==='magic'?'MTG':'OP';
}
function getCardBySymbol(sym) {
  return CARDS.find(c=>c.sym===sym);
}
function langBadge(lang) {
  return `<span class="lang-badge ${lang==='JP'?'jp':'en'}">${lang}</span>`;
}

// ─────────────────────────────────────────────────────
// MARKETPLACE LINKS BUILDER — language-aware
// ─────────────────────────────────────────────────────
function marketplaceLinks(cardName, compact=false, lang='EN') {
  const tc = tcgPlayerUrl(cardName, lang);
  const eb = ebayBuyUrl(cardName, lang);
  const es = ebaySearchUrl(cardName, lang);
  if(compact) {
    return `<span class="mkt-links-compact">
      <a href="${tc}" target="_blank" rel="noopener noreferrer" class="mkt-link-chip tcgp" title="Buy on TCGPlayer" onclick="event.stopPropagation()">TCG</a>
      <a href="${eb}" target="_blank" rel="noopener noreferrer" class="mkt-link-chip ebay" title="Buy on eBay" onclick="event.stopPropagation()">eBay</a>
    </span>`;
  }
  return `<div class="mkt-links">
    <a href="${tc}" target="_blank" rel="noopener noreferrer" class="mkt-btn tcgp" onclick="event.stopPropagation()">★ BUY ON TCGPLAYER</a>
    <a href="${eb}" target="_blank" rel="noopener noreferrer" class="mkt-btn ebay" onclick="event.stopPropagation()">★ BUY ON EBAY</a>
    <a href="${es}" target="_blank" rel="noopener noreferrer" class="mkt-btn comps" onclick="event.stopPropagation()">SOLD COMPS</a>
  </div>`;
}

// ─────────────────────────────────────────────────────
// NOTIFICATION
// ─────────────────────────────────────────────────────
function notify(msg, dur=2500) {
  const el = document.getElementById('notification');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), dur);
}

// ─────────────────────────────────────────────────────
// CLOCK
// ─────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const t = now.toLocaleTimeString('en-US', {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'});
  const d = now.toLocaleDateString('en-US', {month:'short', day:'2-digit', year:'numeric'});
  const el = document.querySelector('.time-display');
  if(el) el.textContent = `${d}  ${t} EST`;
}

// ─────────────────────────────────────────────────────
// TICKER BUILD
// ─────────────────────────────────────────────────────
function buildTicker() {
  const items = [...CARDS, ...CARDS];
  const track = document.getElementById('ticker-track');
  track.innerHTML = items.map(c => {
    const chg = livePrices[c.sym] - c.price + (c.change7/100 * c.price);
    const cls = chg > 0 ? 'pos' : chg < 0 ? 'neg' : 'flat';
    const sign = chg >= 0 ? '▲' : '▼';
    return `<div class="tick-item" onclick="openCardModal('${c.sym}')">
      <span class="tick-sym">${c.sym}</span>
      <span class="tick-price">${fmt$(livePrices[c.sym])}</span>
      <span class="tick-chg ${cls}">${sign} ${Math.abs(chg).toFixed(2)}%</span>
    </div>`;
  }).join('');
}

// ─────────────────────────────────────────────────────
// INDICES
// ─────────────────────────────────────────────────────
function renderIndices() {
  INDICES.forEach((idx, i) => {
    const el = document.getElementById(idx.id);
    if(!el) return;
    el.querySelector('.idx-val').textContent = idx.label === 'GOLDSTAR PORT' ? fmt$(idx.value) : idx.value.toLocaleString('en-US');
    const chgEl = el.querySelector('.idx-chg');
    chgEl.textContent = `${idx.changePct >= 0 ? '+' : ''}${idx.changePct.toFixed(2)}%  ${idx.changePct >= 0 ? '▲' : '▼'} ${fmt$(Math.abs(idx.change))}`;
    chgEl.className = 'idx-chg ' + colorClass(idx.changePct);
    const barPct = Math.min(100, Math.abs(idx.changePct) * 8);
    el.querySelector('.idx-bar').style.width = barPct + '%';
    el.querySelector('.idx-bar').style.background = idx.changePct >= 0 ? 'var(--green)' : 'var(--red)';
  });
}

// ─────────────────────────────────────────────────────
// LIVE PRICE SIMULATION
// ─────────────────────────────────────────────────────
function simulatePrices() {
  CARDS.forEach(c => {
    const move = (Math.random() - 0.49) * 0.008;
    livePrices[c.sym] = +(livePrices[c.sym] * (1 + move)).toFixed(2);
  });
  updateStatusBar();
}

// ─────────────────────────────────────────────────────
// TOP MOVERS
// ─────────────────────────────────────────────────────
function renderTopMovers() {
  const sorted = [...CARDS].sort((a,b) => Math.abs(b.change7) - Math.abs(a.change7));
  const gainers = sorted.filter(c=>c.change7>0).slice(0,8);
  const losers  = sorted.filter(c=>c.change7<0).slice(0,5);

  const gEl = document.getElementById('movers-gain');
  const lEl = document.getElementById('movers-loss');
  if(!gEl || !lEl) return;

  gEl.innerHTML = gainers.map(c => `
    <div class="mover-row" onclick="openCardModal('${c.sym}')">
      <div>
        <div class="mover-name">${c.name} ${langBadge(c.lang)}</div>
        <div class="mover-game">${gameName(c.game)} · ${c.set} ${marketplaceLinks(c.name, true, c.lang)}</div>
      </div>
      <div class="mover-price">${fmt$(livePrices[c.sym])}</div>
      <div class="mover-chg pos">+${c.change7.toFixed(2)}%</div>
      <div class="mover-vol">${c.vol}</div>
    </div>
  `).join('');

  lEl.innerHTML = losers.map(c => `
    <div class="mover-row" onclick="openCardModal('${c.sym}')">
      <div>
        <div class="mover-name">${c.name} ${langBadge(c.lang)}</div>
        <div class="mover-game">${gameName(c.game)} · ${c.set} ${marketplaceLinks(c.name, true, c.lang)}</div>
      </div>
      <div class="mover-price">${fmt$(livePrices[c.sym])}</div>
      <div class="mover-chg neg">${c.change7.toFixed(2)}%</div>
      <div class="mover-vol">${c.vol}</div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────────────
// NEWS
// ─────────────────────────────────────────────────────
function renderNews() {
  const el = document.getElementById('news-feed');
  if(!el) return;
  el.innerHTML = NEWS.map(n => `
    <div class="news-item" onclick="window.open('${n.url}', '_blank')">
      <div class="news-headline">${n.headline}</div>
      <div class="news-meta">
        <span class="news-source ${n.sourceClass}">${n.source}</span>
        <span class="news-time">${timeAgo(n.time)}</span>
        <span class="news-tag ${n.tag}">${n.tag.toUpperCase()}</span>
      </div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────────────
// DEAL FINDER
// ─────────────────────────────────────────────────────
function renderDealFinder() {
  const el = document.getElementById('deal-finder');
  if(!el) return;
  const deals = CARDS.filter(c => c.change30 > 5 && c.change7 < 2).slice(0, 10);
  el.innerHTML = deals.map(c => {
    const ma30sim = c.price * (1 - c.change30 / 100 * 0.3);
    const below = ((c.price - ma30sim) / ma30sim * 100);
    return `
    <div class="deal-row" onclick="openCardModal('${c.sym}')">
      <div>
        <div class="deal-name">${c.name}</div>
        <div style="font-size:9px;color:var(--gold-dim)">${gameName(c.game)} ${langBadge(c.lang)} ${marketplaceLinks(c.name, true, c.lang)}</div>
      </div>
      <div class="deal-below">-${Math.abs(below).toFixed(1)}% MA30</div>
      <div class="deal-price">${fmt$(livePrices[c.sym])}</div>
    </div>
    `;
  }).join('');
}

// ─────────────────────────────────────────────────────
// SENTIMENT GAUGE
// ─────────────────────────────────────────────────────
function renderSentiment() {
  const canvas = document.getElementById('sentiment-gauge');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 120; canvas.height = 65;

  const gainers = CARDS.filter(c=>c.change7>0).length;
  const pct = gainers / CARDS.length;
  const score = Math.round(pct * 100);

  ctx.clearRect(0,0,120,65);
  const cx=60, cy=58, r=48;
  const startAngle = Math.PI;
  const endAngle = 2*Math.PI;

  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 8;
  ctx.stroke();

  const grd = ctx.createLinearGradient(12, cy, 108, cy);
  grd.addColorStop(0, '#ff3b30');
  grd.addColorStop(0.5, '#D4AF37');
  grd.addColorStop(1, '#00d26a');
  ctx.beginPath();
  const fillEnd = startAngle + (pct * Math.PI);
  ctx.arc(cx, cy, r, startAngle, fillEnd);
  ctx.strokeStyle = grd;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();

  const needleAngle = startAngle + pct * Math.PI;
  const nx = cx + (r-4) * Math.cos(needleAngle);
  const ny = cy + (r-4) * Math.sin(needleAngle);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(nx, ny);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.stroke();

  const verdict = score >= 60 ? 'BULLISH' : score >= 40 ? 'NEUTRAL' : 'BEARISH';
  const vColor  = score >= 60 ? 'var(--green)' : score >= 40 ? 'var(--gold)' : 'var(--red)';
  const lbl = document.getElementById('sentiment-label');
  const sub = document.getElementById('sentiment-sub');
  if(lbl) { lbl.textContent = verdict; lbl.style.color = vColor; }
  if(sub) sub.textContent = `${gainers}/${CARDS.length} CARDS GAINING`;

  const stats = [
    { val: gainers, lbl: 'BULLISH',  color: 'var(--green)' },
    { val: CARDS.filter(c=>c.change7===0).length, lbl: 'NEUTRAL', color: 'var(--gold)' },
    { val: CARDS.filter(c=>c.change7<0).length,   lbl: 'BEARISH', color: 'var(--red)' },
  ];
  stats.forEach((s, i) => {
    const statEl = document.getElementById(`sent-stat-${i}`);
    if(statEl) {
      statEl.querySelector('.sent-stat-val').textContent = s.val;
      statEl.querySelector('.sent-stat-val').style.color = s.color;
    }
  });
}

// ─────────────────────────────────────────────────────
// DASHBOARD P&L WIDGET
// ─────────────────────────────────────────────────────
function updateDashboardPnl() {
  const totalVal = portfolioItems
    .filter(p => !p.is_sold)
    .reduce((sum, p) => sum + (livePrices[p.sym] || p.current_price) * p.quantity, 0);
  const totalCost = portfolioItems.filter(p=>!p.is_sold).reduce((s,p)=>s+p.purchase_price*p.quantity, 0);
  const gain = totalVal - totalCost;
  const gainPct = totalCost > 0 ? (gain/totalCost*100) : 0;
  const realizedGain = portfolioItems.filter(p=>p.is_sold).reduce((s,p)=>s+((p.sold_price||0)-p.purchase_price)*p.quantity,0);

  const w = document.getElementById('dashboard-pnl');
  if(!w) return;
  w.innerHTML = `
    <div class="pnl-cell">
      <div class="pnl-label">PORTFOLIO VALUE</div>
      <div class="pnl-value">${fmt$(totalVal)}</div>
      <div class="pnl-sub">${portfolioItems.filter(p=>!p.is_sold).length} positions open</div>
    </div>
    <div class="pnl-cell">
      <div class="pnl-label">UNREALIZED P&L</div>
      <div class="pnl-value ${colorClass(gain)}">${fmtChg(gain)} (${fmtChg(gainPct, true)})</div>
      <div class="pnl-sub">Cost basis: ${fmt$(totalCost)}</div>
    </div>
    <div class="pnl-cell">
      <div class="pnl-label">REALIZED GAINS</div>
      <div class="pnl-value ${colorClass(realizedGain)}">${fmtChg(realizedGain)}</div>
      <div class="pnl-sub">${portfolioItems.filter(p=>p.is_sold).length} sold positions</div>
    </div>
    <div class="pnl-cell">
      <div class="pnl-label">SESSION P&L</div>
      <div class="pnl-value ${colorClass(sessionPnl)}">${fmtChg(sessionPnl)}</div>
      <div class="pnl-sub">Since page load</div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────
// STATUS BAR
// ─────────────────────────────────────────────────────
function updateStatusBar() {
  const totalVal = portfolioItems.filter(p=>!p.is_sold).reduce((s,p)=>s+(livePrices[p.sym]||p.current_price)*p.quantity, 0);
  const pEl = document.getElementById('sb-portfolio');
  const sEl = document.getElementById('sb-session');
  if(pEl) pEl.innerHTML = `<strong>${fmt$(totalVal)}</strong>`;
  if(sEl) {
    const sign = sessionPnl >= 0 ? '+' : '';
    sEl.innerHTML = `<strong class="${colorClass(sessionPnl)}">${sign}${fmt$(Math.abs(sessionPnl))}</strong>`;
  }
}

// ─────────────────────────────────────────────────────
// CHART VIEW
// ─────────────────────────────────────────────────────
function buildChartList(filter='') {
  const el = document.getElementById('chart-list-items');
  if(!el) return;
  const cards = CARDS.filter(c =>
    !filter || c.name.toLowerCase().includes(filter.toLowerCase()) || c.sym.toLowerCase().includes(filter.toLowerCase())
  );
  el.innerHTML = cards.map(c => `
    <div class="chart-list-item ${c.sym === currentChartCard.sym ? 'active' : ''}" onclick="selectChartCard('${c.sym}')">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span class="cli-sym">${c.sym}</span>
        <span class="cli-price ${colorClass(c.change7)}">${fmt$(livePrices[c.sym])}</span>
      </div>
      <div class="cli-name">${c.name} ${langBadge(c.lang)}</div>
      <span class="cli-chg ${colorClass(c.change7)}">${fmtChg(c.change7, true)}</span>
    </div>
  `).join('') || '<div class="empty-state"><div class="empty-msg">NO RESULTS</div></div>';
}

function selectChartCard(sym) {
  const card = getCardBySymbol(sym);
  if(!card) return;
  currentChartCard = card;
  buildChartList(document.getElementById('chart-search-input')?.value || '');
  renderPriceChart();
}

function renderPriceChart(range = 60) {
  const c = currentChartCard;
  const header = document.getElementById('chart-card-header');
  if(header) {
    header.innerHTML = `
      <div class="cch-left">
        <div class="cch-sym">${c.sym}</div>
        <div class="cch-name">${c.name} ${langBadge(c.lang)}</div>
        <div class="cch-name" style="color:var(--gold-dim);margin-top:3px">${c.game.toUpperCase()} · ${c.set}</div>
        <div style="margin-top:6px">${marketplaceLinks(c.name, true, c.lang)}</div>
      </div>
      <div class="cch-right">
        <div class="cch-price">${fmt$(livePrices[c.sym])}</div>
        <div class="cch-chg ${colorClass(c.change7)}">${fmtChg(c.change7, true)} 7D  &nbsp; ${fmtChg(c.change30, true)} 30D</div>
        <div class="cch-meta">VOL: ${c.vol} &nbsp; GAME: ${c.game.toUpperCase()}</div>
      </div>
    `;
  }

  const canvas = document.getElementById('main-chart');
  if(!canvas) return;
  if(priceChart) { priceChart.destroy(); priceChart = null; }

  const data = generatePriceHistory(c.price, range, c.change30 > 0 ? 0.002 : -0.001);
  const labels = Array.from({length:range}, (_,i) => {
    const d = new Date(); d.setDate(d.getDate() - (range - i));
    return d.toLocaleDateString('en-US', {month:'short', day:'numeric'});
  });
  const ma7  = movingAverage(data, 7);
  const ma30 = movingAverage(data, 30);

  priceChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Price',
          data,
          borderColor: '#D4AF37',
          backgroundColor: 'rgba(212,175,55,0.06)',
          borderWidth: 1.5,
          pointRadius: 0,
          fill: true,
          tension: 0.3,
        },
        {
          label: 'MA7',
          data: ma7,
          borderColor: '#00b4d8',
          borderWidth: 1,
          pointRadius: 0,
          borderDash: [4, 2],
          fill: false,
          tension: 0.3,
        },
        {
          label: 'MA30',
          data: ma30,
          borderColor: '#ff3b30',
          borderWidth: 1,
          pointRadius: 0,
          borderDash: [8, 4],
          fill: false,
          tension: 0.3,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: {
            color: '#aaa',
            font: { family: 'IBM Plex Mono', size: 10 },
            boxWidth: 20,
          }
        },
        tooltip: {
          backgroundColor: '#0e0e14',
          borderColor: 'rgba(212,175,55,0.3)',
          borderWidth: 1,
          titleColor: '#D4AF37',
          bodyColor: '#e8e8e8',
          titleFont: { family: 'IBM Plex Mono', size: 10 },
          bodyFont: { family: 'IBM Plex Mono', size: 10 },
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${fmt$(ctx.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#555',
            font: { family: 'IBM Plex Mono', size: 9 },
            maxTicksLimit: 10,
            maxRotation: 0,
          },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.08)' }
        },
        y: {
          ticks: {
            color: '#888',
            font: { family: 'IBM Plex Mono', size: 9 },
            callback: v => fmt$(v),
          },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.08)' }
        }
      }
    }
  });
}

// ─────────────────────────────────────────────────────
// PORTFOLIO VIEW
// ─────────────────────────────────────────────────────
async function loadPortfolio() {
  try {
    const res = await fetch(`${CGI_BIN}/api.py?action=list`);
    portfolioItems = await res.json();
  } catch(e) {
    portfolioItems = [];
  }
  renderPortfolio();
  updateStatusBar();
  updateDashboardPnl();
}

async function loadPortfolioSummary() {
  try {
    const res = await fetch(`${CGI_BIN}/api.py?action=summary`);
    const data = await res.json();
    renderPortfolioStats(data);
  } catch(e) {}
}

function renderPortfolioStats(data) {
  if(!data) return;
  const setVal = (id, html) => { const e=document.getElementById(id); if(e) e.innerHTML=html; };
  setVal('ps-value',    `<span class="${colorClass(data.total_gain)}">${fmt$(data.total_value)}</span>`);
  setVal('ps-cost',     `<span>${fmt$(data.total_cost)}</span>`);
  setVal('ps-gain',     `<span class="${colorClass(data.total_gain)}">${fmtChg(data.total_gain)} (${fmtChg(data.pct_change, true)})</span>`);
  setVal('ps-realized', `<span class="${colorClass(data.realized_gain)}">${fmtChg(data.realized_gain)}</span>`);
  setVal('ps-count',    `<span>${data.count}</span>`);
}

function renderPortfolio() {
  const tbody = document.getElementById('portfolio-tbody');
  if(!tbody) return;

  if(!portfolioItems.length) {
    tbody.innerHTML = `<tr><td colspan="15" style="text-align:center;padding:30px;color:var(--text-dim)">No positions. Click + ADD POSITION to add your first card.</td></tr>`;
    updateBulkActionsBar();
    return;
  }

  tbody.innerHTML = portfolioItems.map(p => {
    const liveP = livePrices[p.sym] || p.current_price;
    const cost   = p.purchase_price * p.quantity;
    const val    = liveP * p.quantity;
    const gain   = val - cost;
    const gainPct = cost > 0 ? (gain/cost*100) : 0;
    const condClass = p.condition_grade?.includes('PSA 10') ? 'psa10'
                    : p.condition_grade?.includes('PSA') ? 'psa9'
                    : p.condition_grade?.includes('CGC') ? 'cgc'
                    : p.condition_grade?.includes('BGS') ? 'bgs'
                    : 'raw';
    const isSelected = selectedPortfolioIds.has(p.id);
    const cardLang = p.lang || 'EN';
    return `<tr class="${p.is_sold ? 'sold' : ''} ${isSelected ? 'row-selected' : ''}">
      <td class="portfolio-checkbox-cell">
        <input type="checkbox" class="portfolio-checkbox" ${isSelected ? 'checked' : ''} onchange="togglePortfolioSelect(${p.id}, this.checked)" onclick="event.stopPropagation()">
      </td>
      <td><span class="td-game ${gameClass(p.game)}">${gameName(p.game)}</span></td>
      <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-bright);font-weight:600;cursor:pointer" onclick="openCardModal('${p.sym||''}')">
        ${p.card_name}
        ${cardLang !== 'EN' ? langBadge(cardLang) : ''}
      </td>
      <td style="color:var(--text-dim);font-size:10px">${p.set_name||'—'}</td>
      <td style="text-align:center" ondblclick="inlineEdit(this, ${p.id}, 'quantity', ${p.quantity})">${p.quantity}</td>
      <td ondblclick="inlineEdit(this, ${p.id}, 'purchase_price', ${p.purchase_price})">${fmt$(p.purchase_price)}</td>
      <td style="font-weight:700" ondblclick="inlineEdit(this, ${p.id}, 'current_price', ${liveP})">${fmt$(liveP)}</td>
      <td class="${colorClass(gain)}" style="font-weight:700">${fmtChg(gain)}</td>
      <td class="${colorClass(gainPct)}">${fmtChg(gainPct, true)}</td>
      <td ondblclick="inlineEdit(this, ${p.id}, 'condition_grade', '${p.condition_grade||'Raw'}')"><span class="condition-badge ${condClass}">${p.condition_grade||'Raw'}</span></td>
      <td style="color:var(--text-dim);font-size:10px">${p.platform||'—'}</td>
      <td style="font-size:10px;color:var(--text-dim);max-width:100px;overflow:hidden;text-overflow:ellipsis" title="${p.notes||''}" ondblclick="inlineEdit(this, ${p.id}, 'notes', '${(p.notes||'').replace(/'/g,\"\\\'\")}\')\'>
        ${p.notes||'—'}
      </td>
      <td>${marketplaceLinks(p.card_name, true, cardLang)}</td>
      <td>${p.is_sold ? `<span style="color:var(--green);font-size:10px">SOLD ${p.sold_price ? fmt$(p.sold_price) : ''}</span>` : `<button class="action-btn sell" onclick="openSellModal(${p.id},'${p.card_name.replace(/'/g,\"\\\'\")}",${p.purchase_price},${p.quantity})">SELL</button>`}</td>
      <td><button class="action-btn del" onclick="deletePortfolioItem(${p.id})">✕</button></td>
    </tr>`;
  }).join('');

  updateBulkActionsBar();
}

// Inline editing
function inlineEdit(cell, id, field, currentVal) {
  if(cell.querySelector('input, select')) return; // already editing
  const original = cell.innerHTML;
  let inputEl;

  if(field === 'condition_grade') {
    inputEl = document.createElement('select');
    inputEl.className = 'inline-edit';
    ['Raw','PSA 10','PSA 9','PSA 8','CGC 10','CGC 9.5','CGC 9','BGS 10','BGS 9.5','BGS 9'].forEach(v => {
      const opt = document.createElement('option');
      opt.value = v; opt.textContent = v;
      if(v === currentVal) opt.selected = true;
      inputEl.appendChild(opt);
    });
  } else {
    inputEl = document.createElement('input');
    inputEl.className = 'inline-edit';
    inputEl.type = (field === 'quantity' || field === 'purchase_price' || field === 'current_price') ? 'number' : 'text';
    inputEl.value = currentVal;
    if(field === 'purchase_price' || field === 'current_price') inputEl.step = '0.01';
  }

  cell.innerHTML = '';
  cell.appendChild(inputEl);
  inputEl.focus();
  if(inputEl.tagName === 'INPUT') inputEl.select();

  const save = async () => {
    const newVal = inputEl.tagName === 'SELECT' ? inputEl.value : inputEl.value.trim();
    if(newVal === '' || newVal == currentVal) {
      cell.innerHTML = original;
      return;
    }
    try {
      const payload = { id, [field]: field === 'quantity' ? parseInt(newVal) : (field === 'purchase_price' || field === 'current_price' ? parseFloat(newVal) : newVal) };
      await fetch(`${CGI_BIN}/api.py?action=update`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const idx = portfolioItems.findIndex(p => p.id === id);
      if(idx !== -1) portfolioItems[idx][field] = payload[field];
      renderPortfolio();
      notify(`Updated ${field.replace('_',' ')}`);
    } catch(e) {
      cell.innerHTML = original;
      notify('Update failed');
    }
  };

  inputEl.addEventListener('blur', save);
  inputEl.addEventListener('keydown', e => {
    if(e.key === 'Enter') { e.preventDefault(); save(); }
    if(e.key === 'Escape') { e.preventDefault(); cell.innerHTML = original; }
  });
}

// Bulk select
function togglePortfolioSelect(id, checked) {
  if(checked) selectedPortfolioIds.add(id);
  else selectedPortfolioIds.delete(id);
  updateBulkActionsBar();
}

function toggleSelectAll(checked) {
  if(checked) {
    portfolioItems.forEach(p => selectedPortfolioIds.add(p.id));
  } else {
    selectedPortfolioIds.clear();
  }
  renderPortfolio();
}

function updateBulkActionsBar() {
  const bar = document.getElementById('bulk-actions-bar');
  if(!bar) return;
  const count = selectedPortfolioIds.size;
  if(count === 0) {
    bar.style.display = 'none';
    return;
  }
  bar.style.display = 'flex';
  bar.querySelector('.bulk-count').textContent = `${count} selected`;
}

async function bulkDelete() {
  if(selectedPortfolioIds.size === 0) return;
  const ids = [...selectedPortfolioIds];
  try {
    await fetch(`${CGI_BIN}/api.py?action=bulk_delete`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ ids })
    });
    portfolioItems = portfolioItems.filter(p => !selectedPortfolioIds.has(p.id));
    selectedPortfolioIds.clear();
    renderPortfolio();
    loadPortfolioSummary();
    updateStatusBar();
    notify(`Deleted ${ids.length} positions`);
  } catch(e) { notify('Bulk delete failed'); }
}

async function bulkSell() {
  if(selectedPortfolioIds.size === 0) return;
  const ids = [...selectedPortfolioIds];
  try {
    await fetch(`${CGI_BIN}/api.py?action=bulk_sell`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ ids, sold_price: null })
    });
    portfolioItems.forEach(p => {
      if(selectedPortfolioIds.has(p.id)) {
        p.is_sold = 1;
        p.sold_price = p.current_price;
      }
    });
    selectedPortfolioIds.clear();
    renderPortfolio();
    loadPortfolioSummary();
    updateStatusBar();
    notify(`Marked ${ids.length} positions as sold`);
  } catch(e) { notify('Bulk sell failed'); }
}

function clearBulkSelection() {
  selectedPortfolioIds.clear();
  renderPortfolio();
}

// ─────────────────────────────────────────────────────
// ADD POSITION MODAL
// ─────────────────────────────────────────────────────
function openAddPositionModal(prefill={}) {
  const modal = document.getElementById('add-position-modal');
  if(!modal) return;

  // Reset form
  ['ap-name','ap-set','ap-notes'].forEach(id => { const el = document.getElementById(id); if(el) el.value = prefill[id] || ''; });
  if(document.getElementById('ap-qty')) document.getElementById('ap-qty').value = '1';
  if(document.getElementById('ap-buy')) document.getElementById('ap-buy').value = prefill.price || '';
  if(document.getElementById('ap-curr')) document.getElementById('ap-curr').value = prefill.price || '';
  if(document.getElementById('ap-date')) document.getElementById('ap-date').value = new Date().toISOString().split('T')[0];

  // Game selector
  if(prefill.game) {
    document.querySelectorAll('.ap-game-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.game === prefill.game);
    });
  }

  // Card name autocomplete
  const nameInput = document.getElementById('ap-name');
  if(nameInput) {
    if(prefill.name) nameInput.value = prefill.name;
    nameInput.addEventListener('input', handleApNameInput);
  }

  modal.classList.add('visible');
  setTimeout(() => { if(nameInput) nameInput.focus(); }, 100);
}

function closeAddPositionModal() {
  const modal = document.getElementById('add-position-modal');
  if(modal) modal.classList.remove('visible');
  const dropdown = document.getElementById('ap-autocomplete');
  if(dropdown) dropdown.style.display = 'none';
}

function handleApNameInput(e) {
  const q = e.target.value.trim().toLowerCase();
  const dropdown = document.getElementById('ap-autocomplete');
  if(!dropdown) return;
  if(q.length < 2) { dropdown.style.display = 'none'; return; }

  const matches = CARDS.filter(c =>
    c.name.toLowerCase().includes(q) || c.sym.toLowerCase().includes(q)
  ).slice(0, 8);

  if(!matches.length) { dropdown.style.display = 'none'; return; }

  dropdown.innerHTML = matches.map(c => `
    <div class="ap-autocomplete-item" onclick="apSelectCard('${c.sym}')">
      <span class="sr-game ${c.game}">${gameName(c.game)}</span>
      <span class="sr-name">${c.name}</span>
      ${langBadge(c.lang)}
      <span class="sr-price">${fmt$(livePrices[c.sym])}</span>
    </div>
  `).join('');
  dropdown.style.display = 'block';
}

function apSelectCard(sym) {
  const card = getCardBySymbol(sym);
  if(!card) return;
  const nameInput = document.getElementById('ap-name');
  if(nameInput) nameInput.value = card.name;
  const setInput = document.getElementById('ap-set');
  if(setInput) setInput.value = card.set;
  const currInput = document.getElementById('ap-curr');
  if(currInput) currInput.value = livePrices[card.sym];

  // Set game buttons
  document.querySelectorAll('.ap-game-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.game === card.game);
  });

  // Hide dropdown
  const dropdown = document.getElementById('ap-autocomplete');
  if(dropdown) dropdown.style.display = 'none';
}

function getApGame() {
  const active = document.querySelector('.ap-game-btn.active');
  return active ? active.dataset.game : 'pokemon';
}

async function submitAddPosition() {
  const game  = getApGame();
  const name  = document.getElementById('ap-name')?.value.trim();
  const set   = document.getElementById('ap-set')?.value.trim() || '';
  const qty   = parseInt(document.getElementById('ap-qty')?.value) || 1;
  const buy   = parseFloat(document.getElementById('ap-buy')?.value) || 0;
  const curr  = parseFloat(document.getElementById('ap-curr')?.value) || buy;
  const cond  = document.getElementById('ap-cond')?.value || 'Raw';
  const plat  = document.getElementById('ap-plat')?.value || 'eBay';
  const notes = document.getElementById('ap-notes')?.value.trim() || '';
  const date  = document.getElementById('ap-date')?.value || new Date().toISOString().split('T')[0];

  if(!name) { notify('Enter a card name'); return; }

  // Try to find matching card for sym and lang
  const matchedCard = CARDS.find(c => c.name === name || c.name.toLowerCase() === name.toLowerCase());
  const sym  = matchedCard ? matchedCard.sym : '';
  const lang = matchedCard ? matchedCard.lang : 'EN';

  try {
    const res = await fetch(`${CGI_BIN}/api.py?action=add`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ game, card_name:name, set_name:set, quantity:qty,
        purchase_price:buy, current_price:curr, condition_grade:cond,
        platform:plat, notes, acquired_date:date, sym, lang })
    });
    const item = await res.json();
    portfolioItems.unshift(item);
    renderPortfolio();
    loadPortfolioSummary();
    updateStatusBar();
    updateDashboardPnl();
    closeAddPositionModal();
    notify(`Added ${name} to portfolio`);
  } catch(e) {
    notify('Error adding item');
  }
}

// Legacy form add (keep for compatibility, delegates to modal)
async function addPortfolioItem() {
  openAddPositionModal();
}

async function deletePortfolioItem(id) {
  try {
    await fetch(`${CGI_BIN}/api.py?id=${id}`, { method:'DELETE' });
    portfolioItems = portfolioItems.filter(p=>p.id!==id);
    selectedPortfolioIds.delete(id);
    renderPortfolio();
    loadPortfolioSummary();
    updateStatusBar();
    notify('Position removed');
  } catch(e) {}
}

// ─────────────────────────────────────────────────────
// SELL MODAL
// ─────────────────────────────────────────────────────
function openSellModal(id, name, buyPrice, qty) {
  sellTargetItem = { id, name, buyPrice, qty };
  document.getElementById('sell-card-name').textContent = name;
  document.getElementById('sell-price-input').value = '';
  document.getElementById('sell-profit-preview').innerHTML = 'Enter sale price above to see P&L';
  document.getElementById('sell-modal').classList.add('visible');
}
function closeSellModal() {
  document.getElementById('sell-modal').classList.remove('visible');
  sellTargetItem = null;
}
async function confirmSell() {
  if(!sellTargetItem) return;
  const price = parseFloat(document.getElementById('sell-price-input').value);
  if(isNaN(price) || price <= 0) { notify('Enter valid sale price'); return; }
  try {
    await fetch(`${CGI_BIN}/api.py?action=sell`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id: sellTargetItem.id, sold_price: price })
    });
    const idx = portfolioItems.findIndex(p=>p.id===sellTargetItem.id);
    if(idx !== -1) {
      portfolioItems[idx].is_sold = 1;
      portfolioItems[idx].sold_price = price;
    }
    const profit = (price - sellTargetItem.buyPrice) * sellTargetItem.qty;
    sessionPnl += profit;
    renderPortfolio();
    loadPortfolioSummary();
    updateStatusBar();
    closeSellModal();
    notify(`Sold! P&L: ${fmtChg(profit)}`);
  } catch(e) { notify('Error recording sale'); }
}

function updateSellPreview() {
  if(!sellTargetItem) return;
  const price = parseFloat(document.getElementById('sell-price-input').value);
  if(isNaN(price)) return;
  const profit = (price - sellTargetItem.buyPrice) * sellTargetItem.qty;
  const ebayFees = price * 0.13 * sellTargetItem.qty;
  const netProfit = profit - ebayFees;
  const pEl = document.getElementById('sell-profit-preview');
  pEl.innerHTML = `Gross P&L: <span class="${colorClass(profit)}" style="font-weight:700">${fmtChg(profit)}</span>  |  eBay fees: <span style="color:var(--red)">-${fmt$(ebayFees)}</span>  |  Net: <span class="${colorClass(netProfit)}" style="font-weight:700">${fmtChg(netProfit)}</span>`;
}

// ─────────────────────────────────────────────────────
// CSV EXPORT — blob download (works in sandboxed iframe)
// ─────────────────────────────────────────────────────
async function exportPortfolioCSV() {
  try {
    const res = await fetch(`${CGI_BIN}/api.py?action=export`);
    const csvText = await res.text();
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goldstar_portfolio_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify('CSV exported');
  } catch(e) {
    notify('Export failed');
  }
}

// ─────────────────────────────────────────────────────
// CSV IMPORT MODAL
// ─────────────────────────────────────────────────────
let csvImportPreviewData = [];

function openImportModal() {
  const modal = document.getElementById('import-modal');
  if(!modal) return;
  modal.classList.add('visible');
  const textarea = document.getElementById('import-csv-text');
  if(textarea) textarea.value = '';
  document.getElementById('import-preview-section').style.display = 'none';
  document.getElementById('import-confirm-btn').style.display = 'none';
  csvImportPreviewData = [];
}

function closeImportModal() {
  const modal = document.getElementById('import-modal');
  if(modal) modal.classList.remove('visible');
  csvImportPreviewData = [];
}

function parseImportCSV(text) {
  const lines = text.trim().split('\n');
  if(lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z_]/g, '_'));
  const items = [];
  for(let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if(parts.length < 2) continue;
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (parts[idx] || '').trim(); });
    // Map common column names
    const item = {
      game: obj.game || obj.category || 'pokemon',
      card_name: obj.card_name || obj.name || obj.card || '',
      set_name: obj.set_name || obj.set || '',
      quantity: parseInt(obj.quantity || obj.qty || 1) || 1,
      purchase_price: parseFloat(obj.purchase_price || obj.buy_price || obj.cost || 0) || 0,
      current_price: parseFloat(obj.current_price || obj.market_price || obj.price || 0) || 0,
      condition_grade: obj.condition_grade || obj.condition || obj.grade || 'Raw',
      platform: obj.platform || obj.source || 'eBay',
      notes: obj.notes || '',
      acquired_date: obj.acquired_date || obj.date || new Date().toISOString().split('T')[0],
      lang: obj.lang || obj.language || 'EN',
    };
    if(item.card_name) items.push(item);
  }
  return items;
}

function previewImportCSV() {
  const textarea = document.getElementById('import-csv-text');
  if(!textarea || !textarea.value.trim()) {
    notify('Paste CSV data first');
    return;
  }
  csvImportPreviewData = parseImportCSV(textarea.value);
  if(!csvImportPreviewData.length) {
    notify('No valid rows found. Check format.');
    return;
  }

  const previewSection = document.getElementById('import-preview-section');
  previewSection.style.display = 'block';
  previewSection.innerHTML = `
    <div class="import-preview-header">${csvImportPreviewData.length} rows ready to import</div>
    <div class="import-preview-table-wrap">
      <table class="import-preview-table">
        <thead>
          <tr><th>GAME</th><th>CARD NAME</th><th>SET</th><th>QTY</th><th>BUY $</th><th>CURR $</th><th>COND</th><th>PLATFORM</th><th>LANG</th></tr>
        </thead>
        <tbody>
          ${csvImportPreviewData.slice(0,20).map(r => `
            <tr>
              <td><span class="td-game ${gameClass(r.game)}">${gameName(r.game)}</span></td>
              <td>${r.card_name}</td>
              <td style="font-size:9px;color:var(--text-dim)">${r.set_name||'—'}</td>
              <td style="text-align:center">${r.quantity}</td>
              <td>${fmt$(r.purchase_price)}</td>
              <td>${fmt$(r.current_price)}</td>
              <td>${r.condition_grade}</td>
              <td style="font-size:9px">${r.platform}</td>
              <td>${langBadge(r.lang || 'EN')}</td>
            </tr>
          `).join('')}
          ${csvImportPreviewData.length > 20 ? `<tr><td colspan="9" style="text-align:center;color:var(--text-dim);font-size:10px">... and ${csvImportPreviewData.length - 20} more rows</td></tr>` : ''}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('import-confirm-btn').style.display = 'block';
}

function handleImportFile(event) {
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const textarea = document.getElementById('import-csv-text');
    if(textarea) textarea.value = e.target.result;
    previewImportCSV();
  };
  reader.readAsText(file);
}

async function confirmImport() {
  if(!csvImportPreviewData.length) return;
  try {
    const res = await fetch(`${CGI_BIN}/api.py?action=import`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(csvImportPreviewData)
    });
    const result = await res.json();
    if(result.imported) {
      result.items.forEach(item => portfolioItems.unshift(item));
      renderPortfolio();
      loadPortfolioSummary();
      updateStatusBar();
      closeImportModal();
      notify(`Imported ${result.imported} positions`);
    }
  } catch(e) {
    notify('Import failed');
  }
}

// ─────────────────────────────────────────────────────
// SEALED PRODUCTS
// ─────────────────────────────────────────────────────
function renderSealed() {
  const el = document.getElementById('sealed-grid');
  if(!el) return;
  el.innerHTML = SEALED.map(s => {
    const roi = ((s.price - s.cost) / s.cost * 100).toFixed(0);
    return `
    <div class="sealed-card ${s.heat}">
      <div class="sc-game">${s.game.toUpperCase()} ${langBadge(s.lang)}</div>
      <div class="sc-name">${s.name}</div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div class="sc-price">${fmt$(s.price)}</div>
        <span class="sc-trend ${s.trend==='up'?'up':s.trend==='down'?'down':'flat'}">${s.trend==='up'?'▲ HOT':s.trend==='down'?'▼ COLD':'— FLAT'}</span>
      </div>
      <div class="sc-meta">
        <div class="sc-row"><span>HOLD RATING</span> <span class="sc-rating">${starRating(s.rating)}</span></div>
        <div class="sc-row"><span>BREAK EVEN</span> <span class="sc-val">${s.breakEven}</span></div>
        <div class="sc-row"><span>COST BASIS</span> <span class="sc-val">${fmt$(s.cost)}</span></div>
        <div class="sc-row"><span>ROI %</span> <span class="sc-val ${roi>0?'pos':'neg'}">${roi>0?'+':''}${roi}%</span></div>
        <div class="sc-row" style="margin-top:4px;font-size:9px;color:var(--text-dim);font-style:italic">${s.notes}</div>
      </div>
      <div class="sealed-mkt-links">
        <a href="${tcgPlayerUrl(s.name, s.lang)}" target="_blank" rel="noopener noreferrer" class="mkt-link-chip tcgp">TCG</a>
        <a href="${ebayBuyUrl(s.name, s.lang)}" target="_blank" rel="noopener noreferrer" class="mkt-link-chip ebay">eBay</a>
        <a href="${ebaySearchUrl(s.name, s.lang)}" target="_blank" rel="noopener noreferrer" class="mkt-link-chip comps">Comps</a>
      </div>
    </div>
    `;
  }).join('');
}

// ─────────────────────────────────────────────────────
// ARBITRAGE VIEW
// ─────────────────────────────────────────────────────
function renderArb() {
  const el = document.getElementById('arb-tbody');
  if(!el) return;

  let data = [...ARB_DATA];
  if(arbFilter !== 'all') data = data.filter(d => d.cat === arbFilter);

  el.innerHTML = data.map(a => {
    const sigClass = a.signal==='BUY' ? 'signal-buy' : a.signal==='SELL' ? 'signal-sell' : 'signal-hold';
    const catClass = a.cat==='flip' ? 'cat-flip' : a.cat==='grail' ? 'cat-grail' : 'cat-sealed';
    const catLabel = a.cat==='flip' ? 'QUICK FLIP' : a.cat==='grail' ? 'GRAIL PLAY' : 'SEALED ARB';
    const flipClass = a.flipScore >= 8 ? 'flip-high' : a.flipScore >= 6 ? 'flip-mid' : 'flip-low';
    const spreadColor = a.spread > 0 ? 'pos' : 'neg';
    return `<tr onclick="openCardModal('${a.sym}')">
      <td>
        <div style="font-weight:700;color:var(--text-bright);font-size:11px">${a.card} ${langBadge(a.lang||'EN')}</div>
        <div style="font-size:9px;color:var(--gold-dim)">${gameName(a.game)} <span class="arb-cat-badge ${catClass}">${catLabel}</span></div>
      </td>
      <td>
        <div style="font-weight:700">${fmt$(a.tcgp)}</div>
        <a href="${tcgPlayerUrl(a.card, a.lang)}" target="_blank" rel="noopener noreferrer" class="arb-action-link tcgp" onclick="event.stopPropagation()">BUY →</a>
      </td>
      <td>
        <div style="font-weight:700;color:var(--cyan)">${fmt$(a.ebay)}</div>
        <a href="${ebayBuyUrl(a.card, a.lang)}" target="_blank" rel="noopener noreferrer" class="arb-action-link ebay" onclick="event.stopPropagation()">BUY →</a>
      </td>
      <td class="${spreadColor}" style="font-weight:700">${a.spread>0?'+':''}${fmt$(a.spread)}</td>
      <td class="${spreadColor}" style="font-weight:700">${a.spreadPct>0?'+':''}${a.spreadPct.toFixed(1)}%</td>
      <td><span class="signal-badge ${sigClass}">${a.signal} SIGNAL</span></td>
      <td><span class="flip-score ${flipClass}">${a.flipScore}</span></td>
      <td class="${colorClass(a.profitEst)}" style="font-weight:700">${a.profitEst>0?'+':''}${fmt$(a.profitEst)}</td>
      <td style="font-size:9px;color:var(--text-dim)">${a.volume}</td>
    </tr>`;
  }).join('');

  const buys = data.filter(d=>d.signal==='BUY').length;
  const bigSpread = Math.max(...data.map(d=>Math.abs(d.spreadPct))).toFixed(1);
  document.getElementById('arb-stat-buys').innerHTML = `<span>${buys}</span> BUY SIGNALS`;
  document.getElementById('arb-stat-spread').innerHTML = `MAX SPREAD: <span>${bigSpread}%</span>`;
}

// ─────────────────────────────────────────────────────
// GRADING CALCULATOR
// ─────────────────────────────────────────────────────
function loadGradePreset(idx) {
  const p = GRADE_PRESETS[idx];
  if(!p) return;
  document.getElementById('grade-card-name').value = p.name;
  document.getElementById('grade-raw-price').value = p.raw;
  document.getElementById('grade-service').value = p.gradeService;
  updateGradeOptions();
  document.getElementById('grade-est-grade').value = p.estGrade;
  document.getElementById('grade-cost').value = p.gradingCost;
  calcGrade();
}

function updateGradeOptions() {
  const svc = document.getElementById('grade-service').value;
  const opts = GRADE_OPTIONS[svc] || [];
  const sel = document.getElementById('grade-est-grade');
  sel.innerHTML = opts.map(g=>`<option value="${g}">${svc} ${g}</option>`).join('');
}

function calcGrade() {
  const name    = document.getElementById('grade-card-name').value || 'Card';
  const rawP    = parseFloat(document.getElementById('grade-raw-price').value) || 0;
  const svc     = document.getElementById('grade-service').value;
  const grade   = document.getElementById('grade-est-grade').value;
  const costLvl = document.getElementById('grade-tier').value;
  const multi   = GRADE_MULTIPLIERS[svc]?.[grade] || 1;
  const gradedVal = rawP * multi;

  const costs = GRADE_COSTS[svc];
  const gradingFee = costs[costLvl] || costs.regular || 25;
  const shipping   = costs.shipping || 18;
  const insurance  = costs.insurance || 12;
  const totalCost  = gradingFee + shipping + insurance;
  const net        = gradedVal - rawP - totalCost;
  const netPct     = rawP > 0 ? (net / rawP * 100) : 0;
  const turnaround = GRADE_TURNAROUND[svc]?.[costLvl] || '30 days';

  let verdict, reason, decClass;
  if(net > rawP * 0.3 && grade >= 9) {
    verdict = 'GRADE IT'; decClass = 'yes';
    reason = `Strong ROI of ${fmtChg(netPct,true)} after all fees. ${svc} ${grade} represents significant premium over raw value.`;
  } else if(net > 20 && grade >= 8) {
    verdict = 'MAYBE';   decClass = 'maybe';
    reason = `Marginal ROI of ${fmtChg(netPct,true)}. Consider if you're confident in ${svc} ${grade} outcome. Risk-adjusted only if card is a collector staple.`;
  } else {
    verdict = 'HOLD RAW'; decClass = 'no';
    reason = `Insufficient ROI at ${fmtChg(netPct,true)}. Grading fees exceed expected value gain. Sell raw or wait for price appreciation.`;
  }

  const resultsEl = document.getElementById('grade-results-content');
  if(!resultsEl) return;

  const allGrades = GRADE_OPTIONS[svc] || [];
  const matrixRows = allGrades.map(g => {
    const m = GRADE_MULTIPLIERS[svc]?.[g] || 1;
    const gVal = rawP * m;
    const gNet = gVal - rawP - totalCost;
    const isBest = String(g) === String(grade);
    return `<tr class="${isBest?'best':''}">
      <td style="font-weight:700;color:var(--gold)">${svc} ${g}</td>
      <td style="font-weight:700">${fmt$(gVal)}</td>
      <td>${(m).toFixed(1)}x</td>
      <td class="${colorClass(gNet)}" style="font-weight:700">${fmtChg(gNet)}</td>
      <td class="${colorClass(gNet/rawP*100)}">${gNet>0?'+':''}${rawP>0?(gNet/rawP*100).toFixed(0):'0'}%</td>
    </tr>`;
  }).join('');

  const popData = allGrades.map((g, i) => ({
    grade: `${svc} ${g}`,
    count: Math.round(800 / (i+1) * (Math.random()*0.3+0.85)),
    max: 800
  }));
  const maxPop = Math.max(...popData.map(p=>p.count));
  const popHTML = popData.map(p => `
    <div class="pop-bar-row">
      <span class="pop-grade-lbl">${p.grade}</span>
      <div class="pop-bar-wrap"><div class="pop-bar-fill" style="width:${(p.count/maxPop*100)}%"></div></div>
      <span class="pop-count">${p.count.toLocaleString()}</span>
    </div>
  `).join('');

  resultsEl.innerHTML = `
    <div class="decision-box ${decClass}">
      <div class="decision-verdict">${verdict}</div>
      <div class="decision-reason">${reason}</div>
    </div>
    <div>
      <div class="panel-header"><span class="panel-title">GRADE ROI MATRIX</span><span class="panel-meta">${name}</span></div>
      <table class="grade-matrix-table">
        <thead><tr><th>GRADE</th><th>GRADED VALUE</th><th>MULTIPLIER</th><th>NET PROFIT</th><th>ROI %</th></tr></thead>
        <tbody>${matrixRows}</tbody>
      </table>
    </div>
    <div class="fee-breakdown">
      <div class="panel-title" style="margin-bottom:8px">FEE BREAKDOWN</div>
      <div class="fee-row"><span class="fee-label">Raw card cost</span><span class="fee-value">${fmt$(rawP)}</span></div>
      <div class="fee-row"><span class="fee-label">${svc} grading fee (${costLvl})</span><span class="fee-value">-${fmt$(gradingFee)}</span></div>
      <div class="fee-row"><span class="fee-label">Shipping & handling</span><span class="fee-value">-${fmt$(shipping)}</span></div>
      <div class="fee-row"><span class="fee-label">Insurance</span><span class="fee-value">-${fmt$(insurance)}</span></div>
      <div class="fee-row"><span class="fee-label">Total investment</span><span class="fee-value">${fmt$(rawP + totalCost)}</span></div>
      <div class="fee-row"><span class="fee-label">Expected graded value (${svc} ${grade})</span><span class="fee-value">${fmt$(gradedVal)}</span></div>
      <div class="fee-row"><span class="fee-label">NET PROFIT ESTIMATE</span><span class="fee-value ${colorClass(net)}">${fmtChg(net)}</span></div>
      <div class="fee-row" style="font-size:10px;color:var(--text-dim);border:none;margin-top:4px">Turnaround: ${turnaround}</div>
    </div>
    <div class="pop-report">
      <div class="pop-title">PSA POPULATION REPORT (SYNTHETIC)</div>
      ${popHTML}
    </div>
  `;
}

// ─────────────────────────────────────────────────────
// WATCHLIST
// ─────────────────────────────────────────────────────
async function loadWatchlist() {
  try {
    const res = await fetch(`${CGI_BIN}/api.py?resource=watchlist`);
    watchlistItems = await res.json();
  } catch(e) {
    watchlistItems = [];
  }
  renderWatchlist();
}

async function addWatchlistItem() {
  const ticker = document.getElementById('watch-ticker').value.trim().toUpperCase();
  const target = parseFloat(document.getElementById('watch-target').value) || null;
  if(!ticker) { notify('Enter a ticker symbol'); return; }

  const card = getCardBySymbol(ticker) || { name: ticker, game: 'unknown' };
  try {
    const res = await fetch(`${CGI_BIN}/api.py?resource=watchlist`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ticker, card_name: card.name, game: card.game, alert_target: target })
    });
    const item = await res.json();
    watchlistItems.unshift(item);
    renderWatchlist();
    document.getElementById('watch-ticker').value = '';
    document.getElementById('watch-target').value = '';
    notify(`Watching ${ticker}`);
  } catch(e) { notify('Error adding to watchlist'); }
}

async function removeWatchlistItem(id) {
  try {
    await fetch(`${CGI_BIN}/api.py?resource=watchlist&id=${id}`, { method:'DELETE' });
    watchlistItems = watchlistItems.filter(w=>w.id!==id);
    renderWatchlist();
    notify('Removed from watchlist');
  } catch(e) {}
}

function renderWatchlist() {
  const tbody = document.getElementById('watchlist-tbody');
  if(!tbody) return;

  if(!watchlistItems.length) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:30px;color:var(--text-dim)">
      Watchlist empty. Add tickers above or right-click any card.
    </td></tr>`;
    return;
  }

  tbody.innerHTML = watchlistItems.map(w => {
    const card = getCardBySymbol(w.ticker);
    const price  = card ? livePrices[card.sym] : (w.alert_target || 0);
    const chg7   = card ? card.change7  : 0;
    const chg30  = card ? card.change30 : 0;
    const alertHit = w.alert_target && price >= w.alert_target;
    const cardLang = card ? card.lang : 'EN';
    return `<tr>
      <td style="font-weight:700;color:var(--gold)">${w.ticker}</td>
      <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;color:var(--text-primary)">${w.card_name} ${langBadge(cardLang)}</td>
      <td style="font-weight:700">${fmt$(price)}</td>
      <td class="${colorClass(chg7)}" style="font-weight:600">${fmtChg(chg7, true)}</td>
      <td class="${colorClass(chg30)}" style="font-weight:600">${fmtChg(chg30, true)}</td>
      <td style="font-size:9px;color:var(--text-dim)">${card?.vol || '—'}</td>
      <td class="sparkline-cell"><canvas id="spark-${w.id}" width="80" height="24"></canvas></td>
      <td>${marketplaceLinks(w.card_name, true, cardLang)}</td>
      <td><input class="alert-input ${alertHit?'alert-hit':''}" value="${w.alert_target||''}" placeholder="Target" onchange="updateAlertTarget(${w.id}, this.value)" /></td>
      <td><button class="action-btn del" onclick="removeWatchlistItem(${w.id})">✕</button></td>
    </tr>`;
  }).join('');

  watchlistItems.forEach(w => {
    const canvas = document.getElementById(`spark-${w.id}`);
    if(!canvas) return;
    const card = getCardBySymbol(w.ticker);
    const base = card ? card.price : 100;
    const data = generatePriceHistory(base, 14, card ? (card.change30 > 0 ? 0.002 : -0.001) : 0);
    drawSparkline(canvas, data);
  });
}

function drawSparkline(canvas, data) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  ctx.clearRect(0,0,w,h);
  const trend = data[data.length-1] >= data[0];
  ctx.beginPath();
  ctx.strokeStyle = trend ? '#00d26a' : '#ff3b30';
  ctx.lineWidth = 1.2;
  data.forEach((v, i) => {
    const x = (i / (data.length-1)) * w;
    const y = h - ((v - min) / range * (h-2)) - 1;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
}

async function updateAlertTarget(id, val) {
  const target = parseFloat(val) || null;
  try {
    await fetch(`${CGI_BIN}/api.py?resource=watchlist`, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id, alert_target: target })
    });
    const idx = watchlistItems.findIndex(w=>w.id===id);
    if(idx !== -1) watchlistItems[idx].alert_target = target;
    notify(target ? `Alert set at ${fmt$(target)}` : 'Alert cleared');
  } catch(e) {}
}

// ─────────────────────────────────────────────────────
// CARD DETAIL MODAL
// ─────────────────────────────────────────────────────
function openCardModal(sym) {
  const card = getCardBySymbol(sym);
  if(!card) return;
  const modal = document.getElementById('card-modal');
  modal.querySelector('.modal-sym').textContent = card.sym;
  modal.querySelector('.modal-name').textContent = `${card.name}  ·  ${card.game.toUpperCase()}  ·  ${card.set}`;
  modal.querySelector('.modal-price').textContent = fmt$(livePrices[card.sym]);
  const chgEl = modal.querySelector('.modal-chg');
  chgEl.textContent = `${fmtChg(card.change7, true)} 7D  /  ${fmtChg(card.change30, true)} 30D`;
  chgEl.className = 'modal-chg ' + colorClass(card.change7);

  const stats = modal.querySelector('.modal-stats-grid');
  stats.innerHTML = [
    { lbl:'MARKET VALUE',val: fmt$(livePrices[card.sym]) },
    { lbl:'52W HIGH',  val: fmt$(livePrices[card.sym] * 1.45) },
    { lbl:'52W LOW',   val: fmt$(livePrices[card.sym] * 0.62) },
    { lbl:'VOLUME',    val: card.vol },
    { lbl:'MA7',       val: fmt$(livePrices[card.sym] * 0.97) },
    { lbl:'MA30',      val: fmt$(livePrices[card.sym] * 0.88) },
    { lbl:'LANGUAGE',  val: langBadge(card.lang) },
    { lbl:'SET #',     val: card.setNum || '—' },
  ].map(s=>`<div class="modal-stat"><div class="modal-stat-label">${s.lbl}</div><div class="modal-stat-value">${s.val}</div></div>`).join('');

  // Mini chart
  const mcanvas = document.getElementById('modal-chart-canvas');
  if(modalChart) { modalChart.destroy(); modalChart=null; }
  const mData = generatePriceHistory(card.price, 30, card.change30>0?0.002:-0.001);
  const mLabels = Array.from({length:30},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(30-i));
    return d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  });
  modalChart = new Chart(mcanvas.getContext('2d'), {
    type:'line',
    data:{ labels:mLabels, datasets:[{
      data:mData, borderColor:'#D4AF37',
      backgroundColor:'rgba(212,175,55,0.05)',
      borderWidth:1.5, pointRadius:0, fill:true, tension:0.3
    }]},
    options:{
      responsive:true, maintainAspectRatio:false, animation:{duration:200},
      plugins:{legend:{display:false},tooltip:{
        backgroundColor:'#0e0e14', borderColor:'rgba(212,175,55,0.3)', borderWidth:1,
        titleColor:'#D4AF37', bodyColor:'#e8e8e8',
        titleFont:{family:'IBM Plex Mono',size:10}, bodyFont:{family:'IBM Plex Mono',size:10},
        callbacks:{label:ctx=>` ${fmt$(ctx.parsed.y)}`}
      }},
      scales:{
        x:{display:false},
        y:{ticks:{color:'#666',font:{family:'IBM Plex Mono',size:8},callback:v=>fmt$(v)},
           grid:{color:'rgba(255,255,255,0.04)'},border:{color:'transparent'}}
      }
    }
  });

  // Marketplace links in modal — language-aware
  const modalActions = modal.querySelector('.modal-actions');
  modalActions.innerHTML = `
    <a href="${tcgPlayerUrl(card.name, card.lang)}" target="_blank" rel="noopener noreferrer" class="modal-btn primary" onclick="event.stopPropagation()">★ BUY ON TCGPLAYER</a>
    <a href="${ebayBuyUrl(card.name, card.lang)}" target="_blank" rel="noopener noreferrer" class="modal-btn primary" style="border-color:var(--cyan);color:var(--cyan);background:rgba(0,180,216,0.08)" onclick="event.stopPropagation()">★ BUY ON EBAY</a>
    <button class="modal-btn" onclick="addModalToWatchlist()">★ WATCHLIST</button>
    <button class="modal-btn" onclick="addModalToPortfolio()">+ PORTFOLIO</button>
    <a href="${ebaySearchUrl(card.name, card.lang)}" target="_blank" rel="noopener noreferrer" class="modal-btn" onclick="event.stopPropagation()">SOLD COMPS</a>
  `;

  modal.classList.add('visible');
}
function closeCardModal() {
  document.getElementById('card-modal').classList.remove('visible');
  if(modalChart) { modalChart.destroy(); modalChart=null; }
}
function addModalToWatchlist() {
  const sym = document.getElementById('card-modal').querySelector('.modal-sym').textContent;
  const card = getCardBySymbol(sym);
  if(card) {
    document.getElementById('watch-ticker').value = sym;
    switchView('watchlist');
    closeCardModal();
    notify(`Ready to add ${sym} to watchlist`);
  }
}
function addModalToPortfolio() {
  const sym = document.getElementById('card-modal').querySelector('.modal-sym').textContent;
  const card = getCardBySymbol(sym);
  if(card) {
    closeCardModal();
    openAddPositionModal({
      name: card.name,
      game: card.game,
      price: card.price,
      'ap-set': card.set,
    });
    switchView('portfolio');
    notify(`Pre-filled form for ${card.name}`);
  }
}

// ─────────────────────────────────────────────────────
// UNIVERSAL SEARCH ENGINE
// ─────────────────────────────────────────────────────
function openGlobalSearch() {
  searchOpen = true;
  const container = document.getElementById('global-search-container');
  if(container) container.classList.add('open');
  const input = document.getElementById('global-search-input');
  if(input) { input.value = ''; input.focus(); }
  renderSearchResults('');
}

function closeGlobalSearch() {
  searchOpen = false;
  const container = document.getElementById('global-search-container');
  if(container) container.classList.remove('open');
  const dropdown = document.getElementById('search-dropdown');
  if(dropdown) dropdown.style.display = 'none';
}

function setSearchFilter(filter) {
  searchFilter = filter;
  document.querySelectorAll('.search-filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === filter);
  });
  const input = document.getElementById('global-search-input');
  renderSearchResults(input ? input.value : '');
}

function fuzzyScore(str, query) {
  str = str.toLowerCase();
  query = query.toLowerCase();
  if(str === query) return 100;
  if(str.startsWith(query)) return 80;
  if(str.includes(query)) return 60;
  // Check if all chars of query appear in order
  let qi = 0;
  for(let i = 0; i < str.length && qi < query.length; i++) {
    if(str[i] === query[qi]) qi++;
  }
  return qi === query.length ? 30 : 0;
}

function performSearch(query) {
  if(!query || query.length < 1) return [];
  const q = query.toLowerCase();
  const results = [];

  // Search cards
  CARDS.forEach(c => {
    if(searchFilter !== 'all' && searchFilter !== c.game) return;
    const score = Math.max(
      fuzzyScore(c.name, q),
      fuzzyScore(c.sym, q),
      fuzzyScore(c.set, q)
    );
    if(score > 0) {
      results.push({ type: 'card', item: c, score });
    }
  });

  // Search sealed
  if(searchFilter === 'all' || searchFilter === 'sealed') {
    SEALED.forEach(s => {
      const score = Math.max(
        fuzzyScore(s.name, q),
        fuzzyScore(s.game, q)
      );
      if(score > 0) {
        results.push({ type: 'sealed', item: s, score });
      }
    });
  }

  return results.sort((a,b) => b.score - a.score).slice(0, 20);
}

function renderSearchResults(query) {
  const dropdown = document.getElementById('search-dropdown');
  if(!dropdown) return;

  if(!query || query.length < 1) {
    // Show trending cards when empty
    dropdown.innerHTML = `
      <div class="search-section-header">TRENDING NOW</div>
      ${CARDS.slice(0,5).map(c => searchResultHtml({ type:'card', item:c })).join('')}
    `;
    dropdown.style.display = 'block';
    return;
  }

  const results = performSearch(query);

  if(!results.length) {
    dropdown.innerHTML = `<div class="search-empty">No results for "${query}"</div>`;
    dropdown.style.display = 'block';
    return;
  }

  // Group by type/game
  const cardResults = results.filter(r => r.type === 'card');
  const sealedResults = results.filter(r => r.type === 'sealed');

  let html = '';

  if(cardResults.length) {
    // Group by game
    const byGame = {};
    cardResults.forEach(r => {
      const g = r.item.game;
      if(!byGame[g]) byGame[g] = [];
      byGame[g].push(r);
    });
    Object.entries(byGame).forEach(([game, items]) => {
      html += `<div class="search-section-header"><span class="sr-game-header ${game}">${gameName(game)}</span> CARDS</div>`;
      html += items.map(r => searchResultHtml(r)).join('');
    });
  }

  if(sealedResults.length) {
    html += `<div class="search-section-header">SEALED PRODUCTS</div>`;
    html += sealedResults.map(r => searchResultHtml(r)).join('');
  }

  dropdown.innerHTML = html;
  dropdown.style.display = 'block';
}

function searchResultHtml(result) {
  const { type, item } = result;
  if(type === 'card') {
    const c = item;
    const price = livePrices[c.sym];
    const chgClass = colorClass(c.change7);
    return `
      <div class="search-result-item" onclick="searchSelectCard('${c.sym}')">
        <div class="search-result-left">
          <span class="sr-game ${c.game}">${gameName(c.game)}</span>
          <div class="sr-name">${c.name}</div>
          <div class="sr-set">${c.set} ${langBadge(c.lang)}</div>
        </div>
        <div class="search-result-right">
          <div class="sr-price">${fmt$(price)}</div>
          <div class="sr-change ${chgClass}">${fmtChg(c.change7, true)} 7D</div>
          <div class="sr-actions">
            <button class="sr-action-btn" onclick="event.stopPropagation(); searchAddToPortfolio('${c.sym}')">+PORT</button>
            <button class="sr-action-btn" onclick="event.stopPropagation(); searchAddToWatchlist('${c.sym}')">★WATCH</button>
          </div>
        </div>
      </div>
    `;
  } else {
    // Sealed
    const s = item;
    const roi = ((s.price - s.cost) / s.cost * 100).toFixed(0);
    return `
      <div class="search-result-item" onclick="switchView('sealed'); closeGlobalSearch();">
        <div class="search-result-left">
          <span class="sr-game ${s.game}">${s.game.toUpperCase()}</span>
          <div class="sr-name">${s.name}</div>
          <div class="sr-set">SEALED ${langBadge(s.lang)}</div>
        </div>
        <div class="search-result-right">
          <div class="sr-price">${fmt$(s.price)}</div>
          <div class="sr-change ${roi > 0 ? 'pos' : 'neg'}">${roi > 0 ? '+' : ''}${roi}% ROI</div>
        </div>
      </div>
    `;
  }
}

function searchSelectCard(sym) {
  closeGlobalSearch();
  openCardModal(sym);
}

function searchAddToPortfolio(sym) {
  const card = getCardBySymbol(sym);
  if(!card) return;
  closeGlobalSearch();
  switchView('portfolio');
  openAddPositionModal({
    name: card.name,
    game: card.game,
    price: card.price,
    'ap-set': card.set,
  });
  notify(`Pre-filled form for ${card.name}`);
}

function searchAddToWatchlist(sym) {
  const card = getCardBySymbol(sym);
  if(!card) return;
  document.getElementById('watch-ticker').value = sym;
  closeGlobalSearch();
  switchView('watchlist');
  notify(`Ready to add ${sym} to watchlist`);
}

// ─────────────────────────────────────────────────────
// USER GUIDE
// ─────────────────────────────────────────────────────
function showHelp() {
  document.getElementById('help-overlay').classList.add('visible');
}
function hideHelp() {
  document.getElementById('help-overlay').classList.remove('visible');
}
function switchGuideTab(tab) {
  document.querySelectorAll('.guide-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.guide-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.guide-tab-btn[data-tab="${tab}"]`)?.classList.add('active');
  document.getElementById(`guide-${tab}`)?.classList.add('active');
}

// ─────────────────────────────────────────────────────
// SUBSCRIPTION / PAYWALL
// ─────────────────────────────────────────────────────
function showSubscriptionModal() {
  document.getElementById('sub-modal').classList.add('visible');
}
function hideSubscriptionModal() {
  document.getElementById('sub-modal').classList.remove('visible');
}
function selectSubPlan(plan) {
  if(plan === 'free') {
    hideSubscriptionModal();
    notify('Free tier activated — upgrade anytime for full access');
  } else {
    hideSubscriptionModal();
    isPremiumUser = true;
    document.body.classList.add('premium');
    notify('GoldStar PRO activated — full access unlocked');
  }
}

// ─────────────────────────────────────────────────────
// VIEW SWITCHING
// ─────────────────────────────────────────────────────
function switchView(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const viewEl = document.getElementById(`view-${view}`);
  if(viewEl) viewEl.classList.add('active');

  const navBtn = document.querySelector(`[data-view="${view}"]`);
  if(navBtn) navBtn.classList.add('active');

  if(view === 'charts') {
    buildChartList();
    setTimeout(() => renderPriceChart(), 50);
  } else if(view === 'portfolio') {
    loadPortfolio();
    loadPortfolioSummary();
  } else if(view === 'sealed') {
    renderSealed();
  } else if(view === 'arb') {
    renderArb();
  } else if(view === 'watchlist') {
    loadWatchlist();
  } else if(view === 'dashboard') {
    renderTopMovers();
    renderNews();
    renderDealFinder();
    renderSentiment();
    updateDashboardPnl();
  }
}

// ─────────────────────────────────────────────────────
// COMMAND BAR
// ─────────────────────────────────────────────────────
const COMMANDS = [
  { cmd:'/DASH',    desc:'Go to Dashboard (F1)',        action:()=>switchView('dashboard') },
  { cmd:'/CHART',   desc:'Go to Charts (F2)',            action:()=>switchView('charts') },
  { cmd:'/PORT',    desc:'Go to Portfolio (F3)',         action:()=>switchView('portfolio') },
  { cmd:'/SEALED',  desc:'Go to Sealed Products (F4)',   action:()=>switchView('sealed') },
  { cmd:'/ARB',     desc:'Go to Arbitrage Scanner (F5)', action:()=>switchView('arb') },
  { cmd:'/GRADE',   desc:'Go to Grading Calculator (F6)',action:()=>switchView('grade') },
  { cmd:'/WATCH',   desc:'Go to Watchlist (F7)',         action:()=>switchView('watchlist') },
  { cmd:'/GUIDE',   desc:'User Guide & Documentation',   action:()=>showHelp() },
  { cmd:'/EXPORT',  desc:'Export portfolio CSV',         action:()=>exportPortfolioCSV() },
  { cmd:'/IMPORT',  desc:'Import portfolio CSV',         action:()=>openImportModal() },
  { cmd:'/ADD',     desc:'Add position to portfolio',    action:()=>{ switchView('portfolio'); openAddPositionModal(); } },
  { cmd:'/SEARCH',  desc:'Universal card search',        action:()=>openGlobalSearch() },
  { cmd:'/HELP',    desc:'Show keyboard shortcuts',      action:()=>showHelp() },
  { cmd:'/EBAY',    desc:'Open GoldStar eBay store',     action:()=>window.open('https://www.ebay.com/usr/goldstaartcg','_blank') },
  { cmd:'/IG',      desc:'Open GoldStar Instagram',      action:()=>window.open('https://www.instagram.com/goldstartcg.llc','_blank') },
  { cmd:'/COLLECTR', desc:'Open GoldStar Collectr',      action:()=>window.open(collectrUrl(),'_blank') },
  { cmd:'/PRO',     desc:'Upgrade to GoldStar PRO',      action:()=>showSubscriptionModal() },
];

function openCommandBar() {
  const bar = document.getElementById('cmd-bar');
  bar.classList.add('visible');
  document.getElementById('cmd-input').value = '';
  renderCmdSuggestions('');
  document.getElementById('cmd-input').focus();
}
function closeCommandBar() {
  document.getElementById('cmd-bar').classList.remove('visible');
}
function renderCmdSuggestions(query) {
  const q = query.toLowerCase();
  const matches = COMMANDS.filter(c =>
    c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
  );
  const el = document.getElementById('cmd-suggestions');
  if(!el) return;
  el.innerHTML = matches.map(c => `
    <div class="cmd-suggestion" onclick="execCommand('${c.cmd}')">
      <span class="cmd-name">${c.cmd}</span>
      <span class="cmd-desc">${c.desc}</span>
    </div>
  `).join('') || '<div class="cmd-suggestion"><span class="cmd-desc">No matching commands</span></div>';
}
function execCommand(cmd) {
  const command = COMMANDS.find(c => c.cmd === cmd);
  if(command) {
    command.action();
    closeCommandBar();
  }
}

// ─────────────────────────────────────────────────────
// KEYBOARD SHORTCUTS
// ─────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  // Command bar
  if(e.key === '/' && !e.target.matches('input, textarea, select')) {
    e.preventDefault();
    openCommandBar();
    return;
  }
  if(e.key === 'Escape') {
    closeCommandBar();
    closeCardModal();
    closeSellModal();
    closeAddPositionModal();
    closeImportModal();
    closeGlobalSearch();
    hideHelp();
    hideSubscriptionModal();
    return;
  }

  // Global search
  if((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openGlobalSearch();
    return;
  }

  // Function keys
  if(e.key === 'F1') { e.preventDefault(); switchView('dashboard'); }
  if(e.key === 'F2') { e.preventDefault(); switchView('charts'); }
  if(e.key === 'F3') { e.preventDefault(); switchView('portfolio'); }
  if(e.key === 'F4') { e.preventDefault(); switchView('sealed'); }
  if(e.key === 'F5') { e.preventDefault(); switchView('arb'); }
  if(e.key === 'F6') { e.preventDefault(); switchView('grade'); }
  if(e.key === 'F7') { e.preventDefault(); switchView('watchlist'); }
});

// ─────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildTicker();
  renderIndices();
  switchView('dashboard');
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(() => {
    simulatePrices();
    buildTicker();
    renderIndices();
    if(currentView === 'dashboard') {
      renderTopMovers();
      updateDashboardPnl();
    }
  }, 4000);

  // Command bar input
  const cmdInput = document.getElementById('cmd-input');
  if(cmdInput) {
    cmdInput.addEventListener('input', e => renderCmdSuggestions(e.target.value));
    cmdInput.addEventListener('keydown', e => {
      if(e.key === 'Enter') {
        const first = document.querySelector('.cmd-suggestion');
        if(first) first.click();
      }
    });
  }

  // Chart range buttons
  document.querySelectorAll('.range-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPriceChart(parseInt(btn.dataset.range));
    });
  });

  // Chart search
  const chartSearchInput = document.getElementById('chart-search-input');
  if(chartSearchInput) {
    chartSearchInput.addEventListener('input', e => buildChartList(e.target.value));
  }

  // Arb filter
  document.querySelectorAll('.arb-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.arb-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      arbFilter = btn.dataset.filter;
      renderArb();
    });
  });

  // Grade service change
  const gradeSvcEl = document.getElementById('grade-service');
  if(gradeSvcEl) {
    gradeSvcEl.addEventListener('change', () => { updateGradeOptions(); calcGrade(); });
  }

  // Grade inputs
  ['grade-card-name','grade-raw-price','grade-est-grade','grade-tier'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('change', calcGrade);
  });

  // Sell price preview
  const sellInput = document.getElementById('sell-price-input');
  if(sellInput) sellInput.addEventListener('input', updateSellPreview);

  // Global search input
  const globalSearchInput = document.getElementById('global-search-input');
  if(globalSearchInput) {
    globalSearchInput.addEventListener('input', e => renderSearchResults(e.target.value));
    globalSearchInput.addEventListener('keydown', e => {
      if(e.key === 'Escape') closeGlobalSearch();
      if(e.key === 'Enter') {
        const first = document.querySelector('.search-result-item');
        if(first) first.click();
      }
    });
  }

  // Game filter chips in search
  document.querySelectorAll('.search-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => setSearchFilter(chip.dataset.filter));
  });

  // Click outside to close search
  document.addEventListener('click', e => {
    const container = document.getElementById('global-search-container');
    if(container && !container.contains(e.target)) {
      closeGlobalSearch();
    }
  });

  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // Modals close on backdrop click
  const importModal = document.getElementById('import-modal');
  if(importModal) {
    importModal.addEventListener('click', e => {
      if(e.target === importModal) closeImportModal();
    });
  }
});
