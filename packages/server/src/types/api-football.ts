/**
 * API-Football response types
 */

export interface ApiFootballResponse<T> {
  get: string
  parameters: Record<string, any>
  errors: any[]
  results: number
  paging?: {
    current: number
    total: number
  }
  response: T[]
}

export interface Fixture {
  fixture: {
    id: number
    referee: string | null
    timezone: string
    date: string
    timestamp: number
    periods: {
      first: number | null
      second: number | null
    }
    venue: {
      id: number | null
      name: string
      city: string
    }
    status: {
      long: string
      short: string
      elapsed: number | null
    }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
    season: number
    round: string
  }
  teams: {
    home: TeamInfo
    away: TeamInfo
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    halftime: {
      home: number | null
      away: number | null
    }
    fulltime: {
      home: number | null
      away: number | null
    }
    extratime: {
      home: number | null
      away: number | null
    }
    penalty: {
      home: number | null
      away: number | null
    }
  }
}

export interface TeamInfo {
  id: number
  name: string
  logo: string
  winner: boolean | null
}

export interface TeamStatistics {
  team: {
    id: number
    name: string
    logo: string
  }
  statistics: Array<{
    type: string
    value: number | string | null
  }>
}

export interface Standing {
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
    season: number
    standings: Array<Array<StandingEntry>>
  }
}

export interface StandingEntry {
  rank: number
  team: {
    id: number
    name: string
    logo: string
  }
  points: number
  goalsDiff: number
  group: string
  form: string
  status: string
  description: string | null
  all: MatchStats
  home: MatchStats
  away: MatchStats
}

export interface MatchStats {
  played: number
  win: number
  draw: number
  lose: number
  goals: {
    for: number
    against: number
  }
}

export interface HeadToHead {
  fixture: {
    id: number
    referee: string | null
    timezone: string
    date: string
    timestamp: number
    venue: {
      id: number | null
      name: string
      city: string
    }
    status: {
      long: string
      short: string
      elapsed: number | null
    }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
    season: number
    round: string
  }
  teams: {
    home: TeamInfo
    away: TeamInfo
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    halftime: {
      home: number | null
      away: number | null
    }
    fulltime: {
      home: number | null
      away: number | null
    }
  }
}

export interface Odds {
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
    season: number
  }
  fixture: {
    id: number
    timezone: string
    date: string
    timestamp: number
  }
  update: string
  bookmakers: Array<{
    id: number
    name: string
    bets: Array<{
      id: number
      name: string
      values: Array<{
        value: string
        odd: string
      }>
    }>
  }>
}

