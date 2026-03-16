// 1. Define the Interface

import { Preferences } from '@/contexts/AppContext'

// This ensures every provider (OpenAI, Poe, etc.) behaves exactly the same way.
export interface AIProvider {
  providerName: string
  analyzeJobListings(
    jobListings: string,
    preferences: Preferences,
    modelName?: string
  ): Promise<string>

  setApiKey(apiKey: string): void
  hasApiKey(): boolean
  getApiKey(): string | null
}
