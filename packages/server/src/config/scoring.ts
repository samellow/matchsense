/**
 * Risk scoring weights configuration
 */

export const RISK_SCORING_WEIGHTS = {
  RECENT_FORM: 0.25,           // 25% - Recent form consistency
  GOAL_TRENDS: 0.20,           // 20% - Goal scoring/conceding trends
  DEFENSIVE_STABILITY: 0.20,   // 20% - Defensive consistency
  LEAGUE_POSITION_GAP: 0.15,   // 15% - League position difference
  HISTORICAL_MATCHUP: 0.10,    // 10% - Head-to-head patterns
  ODDS_STABILITY: 0.10,        // 10% - Odds consistency
} as const

export const RISK_THRESHOLDS = {
  LOW: 30,      // Risk score 0-30 = Low Risk
  MEDIUM: 60,   // Risk score 31-60 = Medium Risk
  HIGH: 100,    // Risk score 61-100 = High Risk
} as const

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 20,     // Risk score 0-20 = High Confidence
  MEDIUM: 45,   // Risk score 21-45 = Medium Confidence
  LOW: 100,     // Risk score 46+ = Low Confidence
} as const

export const BET_TARGETS = {
  LOW_RISK: {
    MIN_ODDS: 2.0,
    MAX_ODDS: 3.0,
    MIN_SELECTIONS: 1,
    MAX_SELECTIONS: 3,
    MAX_RISK_SCORE: 30,
  },
  MEDIUM_RISK: {
    MIN_ODDS: 8.5,
    MAX_ODDS: 11.5,
    MIN_SELECTIONS: 4,
    MAX_SELECTIONS: 8,
    MAX_RISK_SCORE: 60,
  },
} as const

