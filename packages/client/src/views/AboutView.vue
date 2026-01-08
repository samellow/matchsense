<script setup lang="ts">
</script>

<template>
  <div class="py-16">
    <div class="container">
      <h1 class="text-4xl mb-4">About MatchSense</h1>
      <p class="text-text-muted text-lg mb-8">
        A fullstack monorepo application built with Vue 3, Express, and PostgreSQL.
      </p>
      
      <div class="bg-surface rounded-2xl p-8 my-8 border border-border">
        <h2 class="text-2xl mb-4">Tech Stack</h2>
        <ul class="list-none">
          <li class="py-2 border-b border-border last:border-b-0">
            <strong>Frontend:</strong> Vue 3 + Vite + TypeScript
          </li>
          <li class="py-2 border-b border-border last:border-b-0">
            <strong>State Management:</strong> Pinia
          </li>
          <li class="py-2 border-b border-border last:border-b-0">
            <strong>Routing:</strong> Vue Router
          </li>
          <li class="py-2 border-b border-border last:border-b-0">
            <strong>Backend:</strong> Express + TypeScript
          </li>
          <li class="py-2 border-b border-border last:border-b-0">
            <strong>Database:</strong> PostgreSQL
          </li>
          <li class="py-2 border-b border-border last:border-b-0">
            <strong>Styling:</strong> Tailwind CSS
          </li>
          <li class="py-2 border-b border-border last:border-b-0">
            <strong>Monorepo:</strong> npm workspaces
          </li>
        </ul>
      </div>

      <router-link 
        to="/" 
        class="inline-block mt-8 px-6 py-3 bg-surface rounded-lg border border-border 
               transition-all duration-200 hover:border-primary hover:bg-surface-light"
      >
        ← Back to Home
      </router-link>
    </div>
  </div>
</template>

