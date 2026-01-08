/**
 * League configuration for Europe and Asia
 * Top and mid-tier leagues only
 */
export const ALLOWED_LEAGUES = {
  // Europe - Top Tier
  PREMIER_LEAGUE: 39,        // England
  LA_LIGA: 140,              // Spain
  SERIE_A: 135,              // Italy
  BUNDESLIGA: 78,            // Germany
  LIGUE_1: 61,               // France
  EREDIVISIE: 88,            // Netherlands
  PRIMEIRA_LIGA: 94,         // Portugal
  SUPERLIG: 203,             // Turkey
  BELGIAN_PRO_LEAGUE: 144,   // Belgium
  RUSSIAN_PREMIER_LEAGUE: 235, // Russia
  SCOTTISH_PREMIERSHIP: 179, // Scotland
  SWISS_SUPER_LEAGUE: 207,   // Switzerland
  AUSTRIAN_BUNDESLIGA: 218,  // Austria
  
  // Europe - Mid Tier
  CHAMPIONSHIP: 40,          // England Championship
  LA_LIGA_2: 141,            // Spain Segunda
  SERIE_B: 136,              // Italy Serie B
  CHAMPIONSHIP_2: 79,        // Germany 2. Bundesliga
  
  // Asia - Top Tier
  J_LEAGUE: 98,              // Japan
  K_LEAGUE_1: 292,           // South Korea
  CHINESE_SUPER_LEAGUE: 169, // China
  A_LEAGUE: 106,             // Australia
  SAUDI_PRO_LEAGUE: 307,     // Saudi Arabia
  QATAR_STARS_LEAGUE: 294,   // Qatar
  UAE_PRO_LEAGUE: 295,       // UAE
  INDIAN_SUPER_LEAGUE: 323,  // India
} as const

export const LEAGUE_IDS = Object.values(ALLOWED_LEAGUES)

export const EXCLUDED_FIXTURE_TYPES = [
  'Friendly',
  'U21',
  'U20',
  'U19',
  'U18',
  'Youth',
]

