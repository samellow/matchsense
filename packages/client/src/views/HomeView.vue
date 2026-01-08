<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { RiskLevel } from '@matchsense/shared'
import { getPickByRiskLevel } from '@/services/mockData'

const router = useRouter()
const selectedRisk = ref<RiskLevel>('low')
const pick = computed(() => getPickByRiskLevel(selectedRisk.value))

const currentDate = computed(() => {
  const now = new Date()
  const month = now.toLocaleString('default', { month: 'short' })
  const day = now.getDate()
  return `${month} ${day}`
})

function formatConfidence(confidence: string): string {
  return confidence.charAt(0).toUpperCase() + confidence.slice(1) + ' Confidence'
}

function viewBreakdown() {
  router.push(`/bet-breakdown?risk=${selectedRisk.value}`)
}
</script>

<template>
  <div class="min-h-screen bg-background pb-20">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-4 border-b border-border">
      <h1 class="text-xl font-bold text-text">MatchSense</h1>
      <div class="flex items-center gap-2 text-text">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-sm">{{ currentDate }}</span>
      </div>
    </header>

    <div class="max-w-2xl mx-auto">
      <!-- Risk Tabs -->
      <div class="flex gap-2 px-4 py-4">
        <button
          @click="selectedRisk = 'low'"
          :class="[
            'flex-1 py-2.5 px-4 rounded-full font-medium transition-colors text-white',
            selectedRisk === 'low'
              ? 'bg-risk-low'
              : 'bg-grey-inactive'
          ]"
        >
          Low Risk
        </button>
        <button
          @click="selectedRisk = 'medium'"
          :class="[
            'flex-1 py-2.5 px-4 rounded-full font-medium transition-colors text-white',
            selectedRisk === 'medium'
              ? 'bg-risk-medium'
              : 'bg-grey-inactive'
          ]"
        >
          Medium Risk
        </button>
      </div>

      <div v-if="pick" class="px-4 space-y-4">
        <!-- Today's Pick Card -->
        <div
          :class="[
            'rounded-xl p-4 bg-gray-900'
          ]"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-xs font-medium mb-1 text-text-muted">
                TODAY'S PICK
              </p>
              <h2 :class="['text-lg font-bold', selectedRisk === 'low' ? 'text-risk-low' : 'text-risk-medium']">
                {{ selectedRisk === 'low' ? 'Low Risk Bet of the Day' : 'Medium Risk Accumulator' }}
              </h2>
            </div>
            <!-- Total Odds Badge -->
            <div
              :class="[
                'rounded-xl px-4 py-2  flex flex-col items-center',
                selectedRisk === 'low'
                  ? 'border-risk-low bg-gray-900'
                  : 'border-risk-medium bg-gray-900'
              ]"
            >
              <p class="text-xs font-medium mb-0.5 text-text-muted">
                TOTAL ODDS
              </p>
              <p class="text-xl font-bold text-white">
                {{ pick.totalOdds.toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- Match List -->
          <div class="space-y-3 mt-4">
            <div
              v-for="match in pick.matches"
              :key="match.id"
              class="bg-gray-800 rounded-lg p-3"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2.5 py-1 bg-gray-800 rounded-full text-xs font-medium text-white">
                  {{ match.league }}
                </span>
                <div class="flex items-center gap-1 text-xs text-text-muted">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ match.time }}</span>
                </div>
              </div>
              <p class="font-bold text-white mb-1">{{ match.homeTeam }} vs {{ match.awayTeam }}</p>
              <p class="text-sm text-text-muted">Market: {{ match.market }}</p>
              <div class="mt-2 flex justify-end">
                <span class="px-3 py-1.5 bg-gray-800 rounded-full text-base font-bold text-white">
                  {{ match.odds.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div>
              <p class="text-xs font-medium text-text-muted">
                TOTAL GAMES
              </p>
              <p class="text-2xl font-bold text-white">
                {{ pick.matches.length }}
              </p>
            </div>
            <!-- Confidence Badge -->
            <div
              :class="[
                'px-4 py-2 rounded-full flex items-center gap-2',
                selectedRisk === 'low' ? 'bg-risk-low text-white' : 'bg-risk-medium text-white'
              ]"
            >
              <svg v-if="pick.confidence === 'high'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm font-medium">{{ formatConfidence(pick.confidence) }}</span>
            </div>
          </div>
        </div>

        <!-- Info Card -->
        <div
          :class="[
            'rounded-lg p-4 flex items-start gap-3',
            selectedRisk === 'low'
              ? 'bg-gray-900'
              : 'bg-gray-900  border-grey-info-border'
          ]"
        >
            <div
              :class="[
                'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                selectedRisk === 'low'
                  ? 'bg-grey-info-card'
                  : 'bg-risk-medium'
              ]"
            >
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <p :class="['text-sm italic', selectedRisk === 'low' ? 'text-text-muted' : 'text-text-muted']">
            {{ pick.explanation }}
          </p>
        </div>

        <!-- CTA Button -->
        <button
          @click="viewBreakdown"
          :class="[
            'w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-white',
            selectedRisk === 'low' ? 'bg-risk-low hover:bg-risk-low-dark' : 'bg-risk-medium hover:bg-risk-medium-dark'
          ]"
        >
          View Full Data Breakdown
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
