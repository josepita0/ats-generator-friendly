export interface JobAnalysisResult {
  matchScore: number;
  technicalMatch: number;
  atsStructure: number;
  softSkillsMatch: number;
  foundKeywords: string[];
  missingKeywords: string[];
  suggestions: BulletSuggestion[];
}

export interface BulletSuggestion {
  originalText: string;
  adaptedText: string;
  position: string;
  period: string;
  matchPointsGained: number;
  keywordsIntegrated: number;
}

export interface JobMatcherState {
  jobDescription: string;
  isAnalyzing: boolean;
  analysisResult: JobAnalysisResult | null;
  selectedSuggestionIndex: number | null;
  showManualEdit: boolean;
}

export const EXAMPLE_JOB_DESCRIPTION = `Senior Full Stack Developer — Fintech Platform

We are looking for a Senior Full Stack Developer to join our growing engineering team. You will work across the entire stack, building scalable microservices and modern front-end applications.

Requirements:
• 5+ years of professional experience with TypeScript and React
• Strong experience with Node.js and REST API design
• Proficiency with PostgreSQL or similar relational databases
• Experience with AWS services (Lambda, S3, CloudFront)
• Familiarity with Docker and CI/CD pipelines
• Knowledge of microfrontend architectures is a plus
• Experience with Git workflows and code review practices
• Strong communication skills and ability to work in cross-functional teams
• Agile/Scrum methodology experience

Responsibilities:
• Design and implement scalable backend services using Node.js and AWS Lambda
• Build responsive, accessible front-end applications with React and TypeScript
• Optimize database queries and data models for performance
• Collaborate with product and design teams in an Agile environment
• Mentor junior developers and participate in code reviews
• Contribute to architectural decisions and technical documentation

Nice to have:
• Experience with serverless architectures
• Knowledge of GraphQL
• Familiarity with monitoring tools (Datadog, CloudWatch)
• Contributions to open-source projects`;
