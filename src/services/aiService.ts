import { Preferences } from '@/contexts/AppContext'
import { getAiPrompt } from '@/lib/textUtils'

export const analyzeJobListings = async (
  jobListings: string,
  preferences: Preferences
): Promise<string> => {
  // Get the API key fresh each time the function is called
  const OPENAI_API_KEY = localStorage.getItem('openai_api_key')

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found. Please add your API key in the preferences.')
  }

  const interestsText =
    preferences.interested.length > 0
      ? preferences.interested.join(', ')
      : 'No specific interests defined'

  const dislikesText =
    preferences.notInterested.length > 0
      ? preferences.notInterested.join(', ')
      : 'No specific dislikes defined'

  const prompt = getAiPrompt(interestsText, dislikesText, jobListings)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // suggestions: gpt-4o-mini gpt-4o o3 gpt-4.1
        model: 'gpt-4.1',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'No response from AI service.'
  } catch (error) {
    console.error('AI analysis failed:', error)
    throw new Error(
      `Failed to analyze job listings: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// Function to set API key
export const setOpenAIApiKey = (apiKey: string) => {
  localStorage.setItem('openai_api_key', apiKey)
}

// Function to check if API key exists
export const hasOpenAIApiKey = (): boolean => {
  return !!localStorage.getItem('openai_api_key')
}

// Function to get API key
export const getOpenAIApiKey = (): string | null => {
  return localStorage.getItem('openai_api_key')
}
