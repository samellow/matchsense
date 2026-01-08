<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RiskLevel } from '@matchsense/shared'
import { getPickByRiskLevel } from '@/services/mockData'

const route = useRoute()
const router = useRouter()

const riskLevel = computed(() => (route.query.risk as RiskLevel) || 'low')
const pick = computed(() => getPickByRiskLevel(riskLevel.value))

// Mock data for match details
interface MatchDetails {
  reasons: string[]
  homeForm: ('W' | 'L' | 'D')[]
  awayForm: ('W' | 'L' | 'D')[]
  homeGoalsPerGame?: number
  awayGoalsPerGame?: number
  homeBTTSRate?: number
  awayBTTSRate?: number
  homeWinRate?: number
  awayWinRate?: number
}

const matchDetails: Record<string, MatchDetails> = {
  '1': {
    reasons: [
      'Both teams have scored in 8 of their last 10 matches',
      'Manchester City averaging 2.8 goals per home game',
      'Newcastle conceded in 7 consecutive away fixtures',
      'Historical head-to-head shows high-scoring trend',
    ],
    homeForm: ['W', 'W', 'W', 'D', 'W'],
    awayForm: ['W', 'L', 'W', 'D', 'L'],
    homeGoalsPerGame: 2.8,
    awayGoalsPerGame: 1.6,
  },
  '2': {
    reasons: [
      'Real Madrid won 5 consecutive home games',
      'Athletic Bilbao lost 4 of last 6 away matches',
      'Real Madrid unbeaten at home this season',
      '12-point league position difference',
    ],
    homeForm: ['W', 'W', 'W', 'W', 'W'],
    awayForm: ['L', 'D', 'L', 'W', 'L'],
    homeWinRate: 85,
    awayWinRate: 28,
  },
  '3': {
    reasons: [
      'Both teams scored in 9 of Bayern\'s last 10 home games',
      'Hoffenheim scored in 7 of last 8 away matches',
      'Bayern\'s attacking form vs Hoffenheim\'s defensive record',
      'Recent meetings show consistent scoring from both sides',
    ],
    homeForm: ['W', 'W', 'D', 'W', 'W'],
    awayForm: ['W', 'L', 'D', 'W', 'L'],
    homeBTTSRate: 78,
    awayBTTSRate: 71,
  },
  '4': {
    reasons: [
      'Both teams scored in 8 of their last 10 matches',
      'Napoli averaging 2.1 goals per home game',
      'Inter Milan scored in 9 of last 10 away fixtures',
      'Recent head-to-head shows high-scoring trend',
    ],
    homeForm: ['W', 'L', 'W', 'D', 'W'],
    awayForm: ['W', 'W', 'L', 'W', 'D'],
    homeBTTSRate: 72,
    awayBTTSRate: 68,
  },
  '5': {
    reasons: [
      'Marseille averaging 2.5 goals per home game',
      'Monaco averaging 1.8 goals per away game',
      'Both teams scored in 7 of last 8 meetings',
      'High-scoring trend in recent fixtures',
    ],
    homeForm: ['W', 'D', 'W', 'L', 'W'],
    awayForm: ['L', 'W', 'D', 'W', 'L'],
    homeGoalsPerGame: 2.5,
    awayGoalsPerGame: 1.8,
  },
  '6': {
    reasons: [
      'Both teams scored in 9 of Ajax\'s last 10 home games',
      'PSV scored in 8 of last 9 away matches',
      'High-scoring head-to-head record',
      'Both teams strong attacking form',
    ],
    homeForm: ['W', 'W', 'D', 'L', 'W'],
    awayForm: ['W', 'L', 'W', 'D', 'W'],
    homeBTTSRate: 75,
    awayBTTSRate: 70,
  },
}

function getMatchDetails(matchId: string): MatchDetails {
  return matchDetails[matchId] || {
    reasons: ['Statistical analysis indicates favorable outcome', 'Recent form supports this selection', 'Head-to-head record favors this pick', 'Team performance metrics align'],
    homeForm: ['W', 'W', 'D', 'L', 'W'],
    awayForm: ['L', 'W', 'D', 'W', 'L'],
  }
}

function getFormColor(result: 'W' | 'L' | 'D'): string {
  if (result === 'W') return 'bg-green-500'
  if (result === 'L') return 'bg-red-500'
  return 'bg-gray-500'
}

const formattedDate = computed(() => {
  const now = new Date()
  const day = now.getDate()
  const month = now.toLocaleString('default', { month: 'long' })
  const year = now.getFullYear()
  return `Today, ${day} ${month} ${year}`
})

function formatConfidence(confidence: string): string {
  return confidence.charAt(0).toUpperCase() + confidence.slice(1)
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background pb-20">
    <!-- Header -->
    <header class="flex items-center gap-3 px-4 py-4 border-b border-border">
      <button @click="goBack" class="text-text hover:text-text-muted transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-xl font-bold text-text flex-1">Bet Breakdown</h1>
      <div
        :class="[
          'px-3 py-1 rounded-full text-xs font-medium text-white',
          riskLevel === 'low' ? 'bg-risk-low' : 'bg-risk-medium'
        ]"
      >
        {{ riskLevel === 'low' ? 'Low Risk' : 'Medium Risk' }}
      </div>
    </header>

    <div v-if="pick" class="max-w-2xl mx-auto px-4 space-y-4 py-4">
      <!-- Date -->
      <p class="text-sm text-text-muted">{{ formattedDate }}</p>

      <!-- Summary Card -->
      <div
        :class="[
          'rounded-xl p-4',
          riskLevel === 'low' ? 'bg-risk-low' : 'bg-risk-medium'
        ]"
      >
        <div class="flex items-center gap-2 mb-4">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <h2 class="text-lg font-bold text-white">{{ riskLevel === 'low' ? 'Low Risk Bet' : 'Medium Risk Bet' }}</h2>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-xs font-medium text-white/80 mb-1">Total Odds</p>
            <p class="text-3xl font-bold text-white">{{ pick.totalOdds.toFixed(2) }}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-white/80 mb-1">Matches</p>
            <p class="text-3xl font-bold text-white">{{ pick.matches.length }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-white/20">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span class="text-sm font-medium text-white">Confidence: {{ formatConfidence(pick.confidence) }}</span>
          </div>
          <p class="text-xs text-white/80">Based on statistical analysis</p>
        </div>
      </div>

      <!-- Match Breakdown Section -->
      <div>
        <h3 class="text-lg font-bold text-text mb-4">Match Breakdown</h3>
        
        <div class="space-y-4">
          <div
            v-for="match in pick.matches"
            :key="match.id"
            class="bg-gray-900 rounded-xl p-4 space-y-4"
          >
            <!-- League and Time -->
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-text-muted">{{ match.league }}</span>
              <div class="flex items-center gap-1 text-sm text-text-muted">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ match.time }}</span>
              </div>
            </div>

            <!-- Teams -->
            <h4 class="text-lg font-bold text-white">{{ match.homeTeam }} vs {{ match.awayTeam }}</h4>

            <!-- Market and Odds -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-text-muted mb-1">Selected Market</p>
                <p class="text-base font-bold text-white">{{ match.market }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs font-medium text-text-muted mb-1">Odds</p>
                <p
                  :class="[
                    'text-xl font-bold',
                    riskLevel === 'low' ? 'text-risk-low' : 'text-risk-medium'
                  ]"
                >
                  {{ match.odds.toFixed(2) }}
                </p>
              </div>
            </div>

            <!-- Why This Pick? -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <h5 class="text-base font-bold text-white">Why This Pick?</h5>
              </div>
              <ul class="space-y-2 pl-7">
                <li
                  v-for="(reason, index) in getMatchDetails(match.id).reasons"
                  :key="index"
                  class="flex items-start gap-2 text-sm text-text-muted"
                >
                  <svg class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ reason }}</span>
                </li>
              </ul>
            </div>

            <!-- Recent Form -->
            <div class="space-y-3">
              <h5 class="text-base font-bold text-white">Recent Form</h5>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-text-muted w-32">{{ match.homeTeam }}</span>
                  <div class="flex gap-1">
                    <div
                      v-for="(result, index) in getMatchDetails(match.id).homeForm"
                      :key="index"
                      :class="[
                        'w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white',
                        getFormColor(result)
                      ]"
                    >
                      {{ result }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-text-muted w-32">{{ match.awayTeam }}</span>
                  <div class="flex gap-1">
                    <div
                      v-for="(result, index) in getMatchDetails(match.id).awayForm"
                      :key="index"
                      :class="[
                        'w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white',
                        getFormColor(result)
                      ]"
                    >
                      {{ result }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Statistics -->
            <div v-if="getMatchDetails(match.id).homeGoalsPerGame" class="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <p class="text-xs font-medium text-text-muted mb-1">Home Goals/Game</p>
                <p class="text-lg font-bold text-white">{{ getMatchDetails(match.id).homeGoalsPerGame?.toFixed(1) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-text-muted mb-1">Away Goals/Game</p>
                <p class="text-lg font-bold text-white">{{ getMatchDetails(match.id).awayGoalsPerGame?.toFixed(1) }}</p>
              </div>
            </div>

            <div v-if="getMatchDetails(match.id).homeBTTSRate" class="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <p class="text-xs font-medium text-text-muted mb-1">BTTS Rate (Home)</p>
                <p class="text-lg font-bold text-white">{{ getMatchDetails(match.id).homeBTTSRate }}%</p>
              </div>
              <div>
                <p class="text-xs font-medium text-text-muted mb-1">BTTS Rate (Away)</p>
                <p class="text-lg font-bold text-white">{{ getMatchDetails(match.id).awayBTTSRate }}%</p>
              </div>
            </div>

            <div v-if="getMatchDetails(match.id).homeWinRate" class="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <p class="text-xs font-medium text-text-muted mb-1">Home Win Rate</p>
                <p class="text-lg font-bold text-white">{{ getMatchDetails(match.id).homeWinRate }}%</p>
              </div>
              <div>
                <p class="text-xs font-medium text-text-muted mb-1">Away Win Rate</p>
                <p class="text-lg font-bold text-white">{{ getMatchDetails(match.id).awayWinRate }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Understanding Risk Level -->
      <div class="bg-gray-900 rounded-lg p-4 space-y-3">
        <div class="flex items-center gap-2">
          <div
            :class="[
              'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
              riskLevel === 'low' ? 'bg-grey-info-card' : 'bg-risk-medium'
            ]"
          >
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-base font-bold text-white">Understanding Risk Level</h3>
        </div>
        <div>
          <h4
            :class="[
              'text-sm font-bold mb-2',
              riskLevel === 'low' ? 'text-risk-low' : 'text-risk-medium'
            ]"
          >
            {{ riskLevel === 'low' ? 'Low Risk Strategy' : 'Medium Risk Strategy' }}
          </h4>
          <p class="text-sm text-text-muted mb-3">
            {{ riskLevel === 'low' 
              ? 'This bet prioritizes consistency over high returns. While no bet is guaranteed, selections are chosen to reduce volatility.'
              : 'This bet targets higher returns with moderate risk. Selections are based on strong statistical patterns and team form.' }}
          </p>
          <ul class="space-y-1.5 text-sm text-text-muted">
            <li class="flex items-start gap-2">
              <span class="text-white">•</span>
              <span>{{ riskLevel === 'low' ? 'Focus on reliable markets with proven patterns' : 'Target markets with strong statistical backing' }}</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-white">•</span>
              <span>{{ riskLevel === 'low' ? 'Teams with consistent recent performance' : 'Teams showing strong form and momentum' }}</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-white">•</span>
              <span>{{ riskLevel === 'low' ? 'Lower odds but higher probability outcomes' : 'Balanced odds with favorable probability' }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Disclaimer -->
      <div class="bg-gray-800 rounded-lg p-4">
        <p class="text-xs text-text-muted text-center">
          This app provides football insights, not betting guarantees. Always bet responsibly.
        </p>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex gap-3 pb-4">
        <button
          class="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          View Past Results
        </button>
        <button
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors',
            riskLevel === 'low' ? 'bg-risk-low hover:bg-risk-low-dark' : 'bg-risk-medium hover:bg-risk-medium-dark'
          ]"
          @click="goBack"
        >
          Back to Today's Picks
        </button>
      </div>
    </div>
  </div>
</template>

