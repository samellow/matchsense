import NodeCache from 'node-cache'

const DEFAULT_TTL = parseInt(process.env.CACHE_TTL || '3600', 10)
const MAX_SIZE = parseInt(process.env.CACHE_MAX_SIZE || '1000', 10)

class MemoryCache {
  private cache: NodeCache

  constructor() {
    this.cache = new NodeCache({
      stdTTL: DEFAULT_TTL,
      checkperiod: 600,
      maxKeys: MAX_SIZE,
      useClones: false, // Better performance for large objects
    })
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key)
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || DEFAULT_TTL)
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  del(key: string): number {
    return this.cache.del(key)
  }

  flush(): void {
    this.cache.flushAll()
  }

  getStats() {
    return this.cache.getStats()
  }
}

// Singleton instance
export const memoryCache = new MemoryCache()

