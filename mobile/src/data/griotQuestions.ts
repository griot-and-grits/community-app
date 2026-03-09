export interface GriotQuestion {
  id: string;
  category: string;
  question: string;
  followUp?: string;
}

export const GRIOT_QUESTIONS: GriotQuestion[] = [
  // Early Life & Origins
  {
    id: 'early-1',
    category: 'Early Life',
    question: 'Where were you born and what was the neighborhood like growing up?',
    followUp: 'Ask about their earliest childhood memory.',
  },
  {
    id: 'early-2',
    category: 'Early Life',
    question: 'What is your earliest childhood memory?',
    followUp: 'Ask who was there and how it made them feel.',
  },
  {
    id: 'early-3',
    category: 'Early Life',
    question: 'Who raised you, and what were they like as people?',
    followUp: 'Ask what values they instilled.',
  },

  // Family Heritage
  {
    id: 'heritage-1',
    category: 'Family Heritage',
    question: 'What do you know about where our family originally came from?',
    followUp: 'Ask about migration stories or how the family ended up here.',
  },
  {
    id: 'heritage-2',
    category: 'Family Heritage',
    question: 'Who is the oldest relative you remember, and what were they like?',
    followUp: 'Ask for a specific story about that person.',
  },
  {
    id: 'heritage-3',
    category: 'Family Heritage',
    question: 'Is there a family story that has been passed down through generations?',
    followUp: 'Ask who first told them this story.',
  },

  // Life Lessons & Wisdom
  {
    id: 'lessons-1',
    category: 'Life Lessons',
    question: 'What is the hardest thing you have ever had to overcome?',
    followUp: 'Ask what they learned from that experience.',
  },
  {
    id: 'lessons-2',
    category: 'Life Lessons',
    question: 'What is the best advice you were ever given, and who gave it to you?',
    followUp: 'Ask how that advice shaped their decisions.',
  },
  {
    id: 'lessons-3',
    category: 'Life Lessons',
    question: 'If you could go back and tell your younger self one thing, what would it be?',
  },

  // Career & Purpose
  {
    id: 'career-1',
    category: 'Career & Purpose',
    question: 'What did you dream of becoming when you were young?',
    followUp: 'Ask how their path compared to that dream.',
  },
  {
    id: 'career-2',
    category: 'Career & Purpose',
    question: 'What work are you most proud of in your life?',
    followUp: 'Ask what made it meaningful.',
  },

  // Traditions & Culture
  {
    id: 'traditions-1',
    category: 'Traditions & Culture',
    question: 'What family traditions did you grow up with that you want future generations to keep?',
    followUp: 'Ask about holiday traditions, recipes, or gatherings.',
  },
  {
    id: 'traditions-2',
    category: 'Traditions & Culture',
    question: 'Is there a special family recipe or dish that tells a story about who we are?',
    followUp: 'Ask who created it and when it was served.',
  },
  {
    id: 'traditions-3',
    category: 'Traditions & Culture',
    question: 'What role did faith, church, or spirituality play in our family?',
    followUp: 'Ask for a specific memory tied to their faith.',
  },

  // Love & Relationships
  {
    id: 'love-1',
    category: 'Love & Relationships',
    question: 'How did you meet the love of your life?',
    followUp: 'Ask what their first impression was.',
  },
  {
    id: 'love-2',
    category: 'Love & Relationships',
    question: 'What has marriage or partnership taught you about life?',
  },

  // Legacy
  {
    id: 'legacy-1',
    category: 'Legacy',
    question: 'What do you want future generations of this family to know about you?',
    followUp: 'Ask what they hope their legacy will be.',
  },
  {
    id: 'legacy-2',
    category: 'Legacy',
    question: 'What makes you most proud about this family?',
  },
  {
    id: 'legacy-3',
    category: 'Legacy',
    question: 'Is there anything you have never shared that you want on the record for the family?',
    followUp: 'Give them space — this is often the most powerful moment.',
  },
];
