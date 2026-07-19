<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.0.1
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Responsive, Accessible, and Consistent User Interface
  - [PRINCIPLE_2_NAME] -> II. Modular and Reusable UI Architecture
  - [PRINCIPLE_3_NAME] -> III. Strict Typing and Robust Error Handling
  - [PRINCIPLE_4_NAME] -> IV. Comprehensive Unit and Integration Testing
  - [PRINCIPLE_5_NAME] -> V. Performance Optimization and Low Latency
- Added sections:
  - Technology Stack & Technical Standards
  - Development Quality Gates
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/constitution-template.md (✅ aligned)
  - .specify/templates/plan-template.md (✅ aligned)
  - .specify/templates/spec-template.md (✅ aligned)
  - .specify/templates/tasks-template.md (✅ aligned)
- Follow-up TODOs: None
-->

# Career Portal Constitution

## Core Principles

### I. Responsive, Accessible, and Consistent User Interface
The user interface MUST maintain visual consistency and high responsiveness across the distinct Student (exploratory, assessment-focused) and Job Seeker (intense simulation, CV analysis) dashboard journeys. Global sidebars, streak trackers, visual metric indicators, and transcript views MUST stay visually unified and fully accessible.

### II. Modular and Reusable UI Architecture
All frontend views and layout widgets MUST prioritize modular, reusable design components. Signature components, including the weekly daily streak tracker, the ATS radial score gauge, dynamic roadmaps, and interview transcript components, MUST be implemented as independent modules rather than bespoke templates.

### III. Strict Typing and Robust Error Handling
Codebases MUST enforce strict, compile-time type safety and robust error handling. Error boundaries and fallback states MUST be defined for all external integrations, including third-party LLM API connectors, CV parser engines, and resume/job-description file uploads up to 5MB.

### IV. Comprehensive Unit and Integration Testing
The application MUST establish rigorous unit and integration tests as mandatory quality checks. All gamified learning components (experience point tracking, streak count validation, and roadmap state changes) and mock interview features (speech-to-text inputs and STAR method scoring) MUST achieve test verification.

### V. Performance Optimization and Low Latency
The processing of mock interview audio and video recordings MUST meet strict low-latency requirements. All AI mentor responses and evaluation feedback generation MUST utilize active, visual loading states, keeping execution fast and responsive.

## Technology Stack & Technical Standards
- **Core Technologies**: Next.js, React, and MDX for documentation and content-heavy pages.
- **Styling**: Vanilla CSS or Tailwind CSS for visual styling to implement layout systems.
- **Database & Storage**: Supabase (PostgreSQL) managed via Prisma ORM for user streaks, progress tracking, and history storage.
- **AI Integration**: Integration with OpenAI/Whisper APIs for resume parsing, STAR scoring, and mock interview text-to-speech.

## Development Quality Gates
- **Pre-commit Lints**: Verify syntax, formatting, and strict type check compliance.
- **Testing Gates**: All tests must pass before code is merged into main.
- **Performance Review**: Benchmark response times for file uploads and audio processing to ensure they meet latency requirements.

## Governance
This constitution supersedes all other documentation and guides subsequent specifications, plans, and task breakdowns. Any amendment to these principles requires documentation, a revised implementation plan, and explicit user approval.

**Version**: 1.0.1 | **Ratified**: 2026-07-19 | **Last Amended**: 2026-07-19
