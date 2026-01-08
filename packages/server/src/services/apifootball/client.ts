import axios, { AxiosInstance, AxiosError } from 'axios'

const API_KEY = process.env.API_FOOTBALL_KEY || ''
const BASE_URL = process.env.API_FOOTBALL_BASE_URL || 'https://v3.football.api-sports.io'
const RATE_LIMIT = parseInt(process.env.API_FOOTBALL_RATE_LIMIT || '10', 10)
const RATE_LIMIT_WINDOW = parseInt(process.env.API_FOOTBALL_RATE_LIMIT_WINDOW || '60000', 10)

class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now()
    
    // Remove requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    
    // If we're at the limit, wait until the oldest request expires
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0]
      const waitTime = this.windowMs - (now - oldestRequest) + 100 // Add 100ms buffer
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
        return this.waitIfNeeded() // Recursively check again
      }
    }
    
    // Record this request
    this.requests.push(Date.now())
  }
}

class ApiFootballClient {
  private client: AxiosInstance
  private rateLimiter: RateLimiter

  constructor() {
    if (!API_KEY) {
      throw new Error('API_FOOTBALL_KEY environment variable is required')
    }

    this.rateLimiter = new RateLimiter(RATE_LIMIT, RATE_LIMIT_WINDOW)
    
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'x-apisports-key': API_KEY,
      },
      timeout: 30000,
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        if (error.response?.status === 429) {
          // Rate limit exceeded - wait longer
          const retryAfter = parseInt(
            error.response.headers['retry-after'] || '60',
            10
          ) * 1000
          console.warn(`Rate limit exceeded. Waiting ${retryAfter}ms...`)
          await new Promise(resolve => setTimeout(resolve, retryAfter))
          if (error.config) {
            return this.request(error.config, 3)
          }
        }
        
        if (error.response?.status && error.response.status >= 500) {
          // Server error - retry with exponential backoff
          throw error // Will be handled by retry logic
        }
        
        throw error
      }
    )
  }

  private async request(config: any, retries = 3): Promise<any> {
    await this.rateLimiter.waitIfNeeded()

    try {
      const response = await this.client.request(config)
      return response.data
    } catch (error: any) {
      if (retries > 0 && error.response?.status >= 500) {
        // Exponential backoff for server errors
        const delay = Math.pow(2, 4 - retries) * 1000
        console.warn(`Request failed, retrying in ${delay}ms... (${retries} retries left)`)
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.request(config, retries - 1)
      }
      throw error
    }
  }

  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    return this.request({
      method: 'GET',
      url: endpoint,
      params,
    })
  }

  async post<T>(endpoint: string, data: any = {}): Promise<T> {
    return this.request({
      method: 'POST',
      url: endpoint,
      data,
    })
  }
}

// Singleton instance
export const apiFootballClient = new ApiFootballClient()

