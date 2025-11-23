export const getAiPrompt = (
  interestsText: string,
  dislikesText: string,
  jobListings: string
) => `You are a job filtering assistant. I will provide you with job listings and my preferences.

MY INTERESTS: ${interestsText}
MY DISLIKES (BLACKLIST - EXCLUDE THESE): ${dislikesText}

IMPORTANT FILTERING RULES:
- Only include jobs that match my interests
- EXCLUDE any job that contains elements from my dislikes list, even if it partially matches my interests
- The dislikes list is a BLACKLIST - any job mentioning these should be completely filtered out
- Count the total jobs received, jobs kept, and jobs filtered out

RESPONSE FORMAT:
First, provide these statistics:
- Jobs received: [number]
- Jobs kept: [number] 
- Jobs filtered out: [number]

Then, determine if the input contains JOB TITLES or JOB DESCRIPTIONS:

If these are JOB TITLES:
1. Filter the titles keeping only those that match my interests and avoid my dislikes
2. Return only the filtered titles in a bullet list
3. Start with "List of Titles Detected:" and then list the matching titles

If these are JOB DESCRIPTIONS:
1. Filter the descriptions keeping only those that match my interests and avoid my dislikes
2. For each relevant description, provide a title, with a line break after it.
3. Add a brief summary (2-3 sentences)
3. Add 1-2 bullet points explaining why it's a good match for me
4. Add a link to the job listing. If you find more than one url for a listing, add 3 at most.
4. Start with "List of Descriptions Detected:" followed by the summaries

Then, at the end of the response, include a short summary explaining why some jobs where filtered out. Do not mention a
reason if it was not actually used to fiter out a position. Choose 1-2 positions that where filtered out to give as example.

If you're unsure if it's titles or descriptions, make your best guess based on the length and content.

Here are the job listings to analyze:
${jobListings}`
