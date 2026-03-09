export interface FamilyMember {
  id: string;
  name: string;
  birthYear?: number;
  relationship: string;
  generation: number;
  parentIds: string[];
  spouseId?: string;
  hasStory: boolean;
  storyVideoIds: string[];
}

export const MCDUFFIE_FAMILY_TREE: FamilyMember[] = [
  // Generation 0 — Grandparents
  {
    id: 'james-sr',
    name: 'James McDuffie Sr.',
    birthYear: 1940,
    relationship: 'Grandfather',
    generation: 0,
    parentIds: [],
    spouseId: 'dorothy',
    hasStory: false,
    storyVideoIds: [],
  },
  {
    id: 'dorothy',
    name: 'Dorothy McDuffie',
    birthYear: 1942,
    relationship: 'Grandmother',
    generation: 0,
    parentIds: [],
    spouseId: 'james-sr',
    hasStory: false,
    storyVideoIds: [],
  },

  // Generation 1 — Parents / Aunts / Uncles
  {
    id: 'jimmy',
    name: 'James "Jimmy" McDuffie Jr.',
    birthYear: 1962,
    relationship: 'Uncle',
    generation: 1,
    parentIds: ['james-sr', 'dorothy'],
    spouseId: 'brenda',
    hasStory: false,
    storyVideoIds: [],
  },
  {
    id: 'brenda',
    name: 'Brenda McDuffie',
    birthYear: 1964,
    relationship: 'Aunt',
    generation: 1,
    parentIds: [],
    spouseId: 'jimmy',
    hasStory: false,
    storyVideoIds: [],
  },
  {
    id: 'ty',
    name: 'Ty McDuffie',
    birthYear: 1970,
    relationship: 'Father',
    generation: 1,
    parentIds: ['james-sr', 'dorothy'],
    spouseId: 'sharon-burwell',
    hasStory: true,
    storyVideoIds: ['vH1a8RhP0Oo'],
  },
  {
    id: 'sharon-burwell',
    name: 'Sharon Burwell McDuffie',
    birthYear: 1972,
    relationship: 'Mother',
    generation: 1,
    parentIds: [],
    spouseId: 'ty',
    hasStory: true,
    storyVideoIds: ['vH1a8RhP0Oo'],
  },

  // Generation 2 — Children
  {
    id: 'son',
    name: 'Son McDuffie',
    birthYear: 1995,
    relationship: 'Son',
    generation: 2,
    parentIds: ['ty', 'sharon-burwell'],
    hasStory: false,
    storyVideoIds: [],
  },
];

export const getFamilyMemberById = (id: string): FamilyMember | undefined => {
  return MCDUFFIE_FAMILY_TREE.find(m => m.id === id);
};

export const getFamilyMembersByGeneration = (generation: number): FamilyMember[] => {
  return MCDUFFIE_FAMILY_TREE.filter(m => m.generation === generation);
};

export const getMembersWithStories = (): FamilyMember[] => {
  return MCDUFFIE_FAMILY_TREE.filter(m => m.hasStory);
};

export const getGenerationCount = (): number => {
  return Math.max(...MCDUFFIE_FAMILY_TREE.map(m => m.generation)) + 1;
};
