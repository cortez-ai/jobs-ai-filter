import { AIProvider } from './AIProvider'
import { OpenAIProvider } from './OpenAIProvider'
import { PoeProvider } from './PoeProvider'

export const openAIProvider = new OpenAIProvider()
export const poeProvider = new PoeProvider()

export const getProvider = (type: 'openai' | 'poe'): AIProvider => {
  if (type === 'poe') return poeProvider
  return openAIProvider
}
