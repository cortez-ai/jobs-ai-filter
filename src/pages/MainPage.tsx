import { JobListingInput } from '@/components/JobListingInput'
import { Button } from '@/components/ui/button'
import { useApp } from '@/contexts/AppContext'
import { toast } from '@/hooks/use-toast'
import { checkHasPreviousResults } from '@/lib/utils'
import { getProvider } from '@/services/aiService'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const MainPage: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasPreviousResults, setHasPreviousResults] = useState(false)
  const navigate = useNavigate()
  const { preferences } = useApp()

  useEffect(() => {
    const hasPreviousResults = checkHasPreviousResults()
    setHasPreviousResults(hasPreviousResults)
  }, [isAnalyzing])

  const handleAnalyze = async (jobListings: string) => {
    setIsAnalyzing(true)

    try {
      const provider = getProvider('poe')
      const results = await provider.analyzeJobListings(jobListings, preferences)

      // Store results in sessionStorage for the results page
      sessionStorage.setItem(
        'analysisResults',
        JSON.stringify({
          originalInput: jobListings,
          filteredResults: results,
          timestamp: Date.now(),
        }),
      )

      navigate('/results')
    } catch (error) {
      console.error('Analysis failed:', error)
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze job listings. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const redirectToResultsPage = () => {
    navigate('/results')
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      {hasPreviousResults && (
        <div className="fixed bottom-4 right-4">
          <Button
            variant="outline"
            className="border-teal-600 text-teal-500 hover:bg-teal-600 hover:text-white"
            onClick={redirectToResultsPage}
          >
            View Previous Results
          </Button>
        </div>
      )}
      <JobListingInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
    </div>
  )
}
