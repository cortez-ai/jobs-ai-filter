import { Preferences } from '@/contexts/AppContext'
import { PoeModelName } from '@/lib/constants'
import { getAiPrompt } from '@/lib/textUtils'
import { AIProvider } from './AIProvider'

export class PoeProvider implements AIProvider {
  providerName = 'Poe'
  private storageKey = 'poe_api_key'
  // Assuming standard OpenAI compatibility at this endpoint.
  // i wonder if https://api.poe.com/v1 would work?
  private baseUrl = 'https://api.poe.com/v1/chat/completions'

  setApiKey(apiKey: string) {
    localStorage.setItem(this.storageKey, apiKey)
  }

  hasApiKey(): boolean {
    return !!localStorage.getItem(this.storageKey)
  }

  getApiKey(): string | null {
    return localStorage.getItem(this.storageKey)
  }

  async analyzeJobListings(
    jobListings: string,
    preferences: Preferences,
    modelName: PoeModelName = 'Gemini-3.1-Pro',
  ): Promise<string> {
    const apiKey = this.getApiKey()

    if (!apiKey) {
      throw new Error(`${this.providerName} API key not found.`)
    }

    const prompt = this.generatePrompt(preferences, jobListings)

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 5000,
          temperature: 0.3,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `${this.providerName} API error: ${errorData.error?.message || 'Unknown error'}`,
        )
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'No response from AI service.'
    } catch (error) {
      console.error(`${this.providerName} analysis failed:`, error)
      throw new Error(
        `Failed to analyze job listings: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      )
    }
  }

  private generatePrompt(preferences: Preferences, jobListings: string): string {
    const interestsText =
      preferences.interested.length > 0
        ? preferences.interested.join(', ')
        : 'No specific interests defined'

    const dislikesText =
      preferences.notInterested.length > 0
        ? preferences.notInterested.join(', ')
        : 'No specific dislikes defined'

    return getAiPrompt(interestsText, dislikesText, jobListings)
  }
}
