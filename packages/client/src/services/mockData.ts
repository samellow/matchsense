import type { BetPick, RiskLevel } from '@matchsense/shared'

const lowRiskPick: BetPick = {
  id: '1',
  riskLevel: 'low',
  totalOdds: 2.15,
  confidence: 'high',
  date: new Date().toISOString().split('T')[0],
  explanation: 'Selection based on teams with defensive stability and consistent goal production in 85% of recent home matches.',
  matches: [
    {
      id: '1',
      league: 'PREMIER LEAGUE',
      time: '15:00',
      homeTeam: 'Man City',
      awayTeam: 'Brighton',
      market: 'Home Win',
      odds: 1.35,
    },
    {
      id: '2',
      league: 'LA LIGA',
      time: '18:30',
      homeTeam: 'Real Madrid',
      awayTeam: 'Getafe',
      market: 'Over 1.5 Goals',
      odds: 1.25,
    },
    {
      id: '3',
      league: 'BUNDESLIGA',
      time: '20:00',
      homeTeam: 'Bayern',
      awayTeam: 'Mainz',
      market: 'Over 2.5 Goals',
      odds: 1.28,
    },
  ],
}

const mediumRiskPick: BetPick = {
  id: '2',
  riskLevel: 'medium',
  totalOdds: 5.85,
  confidence: 'medium',
  date: new Date().toISOString().split('T')[0],
  explanation: 'Targeting aggressive away sides with high transition rates. Expecting goals from both ends in these matchups.',
  matches: [
    {
      id: '4',
      league: 'SERIE A',
      time: '19:45',
      homeTeam: 'Napoli',
      awayTeam: 'Inter Milan',
      market: 'BTTS (Yes)',
      odds: 1.75,
    },
    {
      id: '5',
      league: 'LIGUE 1',
      time: '21:00',
      homeTeam: 'Marseille',
      awayTeam: 'Monaco',
      market: 'Over 2.5 Goals',
      odds: 1.82,
    },
    {
      id: '6',
      league: 'EREDIVISIE',
      time: '14:30',
      homeTeam: 'Ajax',
      awayTeam: 'PSV',
      market: 'BTTS (Yes)',
      odds: 1.84,
    },
  ],
}

export function getPickByRiskLevel(riskLevel: RiskLevel): BetPick | null {
  if (riskLevel === 'low') {
    return lowRiskPick
  } else if (riskLevel === 'medium') {
    return mediumRiskPick
  }
  return null
}

export function getAllPicks(): BetPick[] {
  return [lowRiskPick, mediumRiskPick]
}

