export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'SCALE' | 'MCQ';
  options?: QuestionOption[];
}

export interface AssessmentDefinition {
  id: string;
  type: 'CAREER_INTEREST' | 'PERSONALITY_TRAITS' | 'MOTIVATORS' | 'COGNITIVE_ABILITIES' | 'LEARNING_READINESS';
  title: string;
  subtitle: string;
  iconName: string;
  estimatedMinutes: number;
  totalQuestions: number;
  questions: Question[];
}

export const SCALE_OPTIONS: QuestionOption[] = [
  { label: 'Strongly Disagree', value: '1' },
  { label: 'Disagree', value: '2' },
  { label: 'Neutral', value: '3' },
  { label: 'Agree', value: '4' },
  { label: 'Strongly Agree', value: '5' },
];

export const DISCOVERY_ASSESSMENTS: AssessmentDefinition[] = [
  {
    id: 'career-interests',
    type: 'CAREER_INTEREST',
    title: 'Career Interests',
    subtitle: 'Discover work activities and environments that spark your passion and drive.',
    iconName: 'Compass',
    estimatedMinutes: 5,
    totalQuestions: 7,
    questions: [
      {
        id: 'ci_1',
        text: 'I enjoy solving complex problems that require deep thinking.',
        type: 'SCALE',
      },
      {
        id: 'ci_2',
        text: 'Helping people achieve their goals energizes me.',
        type: 'SCALE',
      },
      {
        id: 'ci_3',
        text: 'I like creating or building things from scratch.',
        type: 'SCALE',
      },
      {
        id: 'ci_4',
        text: 'I enjoy analyzing data and identifying patterns.',
        type: 'SCALE',
      },
      {
        id: 'ci_5',
        text: 'I prefer leading teams and driving group results.',
        type: 'SCALE',
      },
      {
        id: 'ci_6',
        text: 'Which activity would you voluntarily do on a free day?',
        type: 'MCQ',
        options: [
          { label: 'Research a topic deeply', value: 'research' },
          { label: 'Teach someone a skill', value: 'teach' },
          { label: 'Organize or improve a system', value: 'organize' },
          { label: 'Design something visual', value: 'design' },
          { label: 'Tinker with tools or technology', value: 'tinker' },
        ],
      },
      {
        id: 'ci_7',
        text: 'Which work environment energizes you most?',
        type: 'MCQ',
        options: [
          { label: 'Fast-paced and dynamic', value: 'fast_paced' },
          { label: 'Collaborative and discussion-heavy', value: 'collaborative' },
          { label: 'Independent and autonomous', value: 'independent' },
          { label: 'Structured and predictable', value: 'structured' },
          { label: 'Exploratory and experimental', value: 'exploratory' },
        ],
      },
    ],
  },
  {
    id: 'personality-traits',
    type: 'PERSONALITY_TRAITS',
    title: 'Personality Traits',
    subtitle: 'Understand how you think, communicate, handle decisions, and navigate group dynamics.',
    iconName: 'UserCheck',
    estimatedMinutes: 5,
    totalQuestions: 7,
    questions: [
      {
        id: 'pt_1',
        text: 'I prefer planning thoroughly before starting a project.',
        type: 'SCALE',
      },
      {
        id: 'pt_2',
        text: 'I am comfortable working with ambiguity.',
        type: 'SCALE',
      },
      {
        id: 'pt_3',
        text: 'I tend to take leadership naturally in group settings.',
        type: 'SCALE',
      },
      {
        id: 'pt_4',
        text: 'I rely on logic and data when making decisions.',
        type: 'SCALE',
      },
      {
        id: 'pt_5',
        text: 'Deadlines motivate me to perform better.',
        type: 'SCALE',
      },
      {
        id: 'pt_6',
        text: 'In meetings, I usually:',
        type: 'MCQ',
        options: [
          { label: 'Speak early with ideas', value: 'speak_early' },
          { label: 'Listen first then contribute', value: 'listen_first' },
          { label: 'Ask clarifying questions', value: 'ask_questions' },
          { label: 'Facilitate discussion', value: 'facilitate' },
          { label: 'Observe quietly', value: 'observe' },
        ],
      },
      {
        id: 'pt_7',
        text: 'When facing conflict, I typically:',
        type: 'MCQ',
        options: [
          { label: 'Address it immediately', value: 'address_immediately' },
          { label: 'Avoid confrontation', value: 'avoid_confrontation' },
          { label: 'Seek compromise', value: 'seek_compromise' },
          { label: 'Use data to resolve', value: 'use_data' },
          { label: 'Wait until emotions settle', value: 'wait_emotions' },
        ],
      },
    ],
  },
  {
    id: 'motivators',
    type: 'MOTIVATORS',
    title: 'Motivators',
    subtitle: 'Uncover what truly drives your career satisfaction and sense of accomplishment.',
    iconName: 'Zap',
    estimatedMinutes: 4,
    totalQuestions: 5,
    questions: [
      {
        id: 'm_1',
        text: 'Continuous learning is essential for me to stay motivated.',
        type: 'SCALE',
      },
      {
        id: 'm_2',
        text: 'Making meaningful impact matters more to me than recognition.',
        type: 'SCALE',
      },
      {
        id: 'm_3',
        text: 'Autonomy is critical for my job satisfaction.',
        type: 'SCALE',
      },
      {
        id: 'm_4',
        text: 'Being recognized as an expert motivates me.',
        type: 'SCALE',
      },
      {
        id: 'm_5',
        text: 'What makes you most proud of your work?',
        type: 'MCQ',
        options: [
          { label: 'Quality and craftsmanship', value: 'quality' },
          { label: 'Measurable results', value: 'results' },
          { label: 'Helping someone meaningfully', value: 'helping' },
          { label: 'Innovation', value: 'innovation' },
          { label: 'Overcoming a major challenge', value: 'challenge' },
        ],
      },
    ],
  },
  {
    id: 'cognitive-abilities',
    type: 'COGNITIVE_ABILITIES',
    title: 'Cognitive Abilities',
    subtitle: 'Identify your natural problem-solving style and analytical approach.',
    iconName: 'Brain',
    estimatedMinutes: 4,
    totalQuestions: 5,
    questions: [
      {
        id: 'ca_1',
        text: 'When solving problems, I naturally break them into smaller parts.',
        type: 'SCALE',
      },
      {
        id: 'ca_2',
        text: 'I often look for patterns and trends in information.',
        type: 'SCALE',
      },
      {
        id: 'ca_3',
        text: 'I focus on understanding underlying principles.',
        type: 'SCALE',
      },
      {
        id: 'ca_4',
        text: 'I experiment quickly rather than overanalyzing.',
        type: 'SCALE',
      },
      {
        id: 'ca_5',
        text: 'When explaining complex ideas, I prefer:',
        type: 'MCQ',
        options: [
          { label: 'Analogies', value: 'analogies' },
          { label: 'Step-by-step walkthrough', value: 'step_by_step' },
          { label: 'Concrete examples', value: 'examples' },
          { label: 'Visual diagrams', value: 'diagrams' },
          { label: 'Foundational principles', value: 'principles' },
        ],
      },
    ],
  },
  {
    id: 'learning-readiness',
    type: 'LEARNING_READINESS',
    title: 'Learning Readiness',
    subtitle: 'Gauge your adaptability, growth mindset, and learning preferences.',
    iconName: 'BookOpen',
    estimatedMinutes: 4,
    totalQuestions: 5,
    questions: [
      {
        id: 'lr_1',
        text: 'I feel excited when starting something completely new.',
        type: 'SCALE',
      },
      {
        id: 'lr_2',
        text: 'I push through frustration during learning plateaus.',
        type: 'SCALE',
      },
      {
        id: 'lr_3',
        text: 'I actively seek feedback while learning.',
        type: 'SCALE',
      },
      {
        id: 'lr_4',
        text: 'I prefer structured curriculum over self-directed learning.',
        type: 'SCALE',
      },
      {
        id: 'lr_5',
        text: 'When learning from others, I prefer:',
        type: 'MCQ',
        options: [
          { label: 'Watching then trying', value: 'watch_try' },
          { label: 'Understanding the "why" first', value: 'why_first' },
          { label: 'Working side-by-side', value: 'side_by_side' },
          { label: 'Trying first then getting feedback', value: 'try_feedback' },
          { label: 'Following structured guidance', value: 'structured' },
        ],
      },
    ],
  },
];
