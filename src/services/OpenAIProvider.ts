import { Preferences } from '@/contexts/AppContext'
import { getAiPrompt } from '@/lib/textUtils'
import { AIProvider } from './AIProvider'

/**
 * Right now this provider isn't used anymore. It may need some changes for it to work again.
 * Problems might include changes in the openai API and CORS issues.
 */

export class OpenAIProvider implements AIProvider {
  providerName = 'OpenAI'
  private storageKey = 'openai_api_key'
  private baseUrl = 'https://api.openai.com/v1/chat/completions'

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
    modelName: string = 'gpt-4.1',
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
          max_tokens: 2000,
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

  // Helper to keep the prompt logic centralized
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
