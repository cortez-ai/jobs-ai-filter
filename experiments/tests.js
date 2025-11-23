import { saveJobData } from "./fetch_jobs.js";
import jobs from "./results/jobs_full_portugal_2025-07-10_apify.json" with { type: "json" };

console.log(jobs[0]);

saveJobData(jobs);
