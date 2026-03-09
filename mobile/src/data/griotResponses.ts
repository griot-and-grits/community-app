import { SourceCitation, SuggestedQuestion } from '@/types/chat';
import { GRIOT_VIDEOS, VideoMetadata } from './videos';
import { MOCK_FAMILY_MEMBERS } from './filters';

export const GRIOT_WELCOME_MESSAGE =
  "Welcome, family. I am the Griot — the keeper of stories, the voice of memory. " +
  "I hold the threads of your family's history, woven from the stories shared here. " +
  "Ask me anything about the lives, places, and experiences your elders have preserved, " +
  "and I will do my best to guide you through their words.";

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  // My Family prompts
  {
    id: 'sq1',
    text: 'Tell me about my family tree',
    icon: 'family-tree',
  },
  {
    id: 'sq2',
    text: 'Are there any love stories in my family?',
    icon: 'heart',
  },
  {
    id: 'sq3',
    text: 'Has my family served in the military?',
    icon: 'shield-star',
  },
  {
    id: 'sq4',
    text: 'What historic events has my family lived through?',
    icon: 'history',
  },
  // General Black stories prompts
  {
    id: 'sq5',
    text: 'What stories do we have about North Carolina?',
    icon: 'map-marker',
  },
  {
    id: 'sq6',
    text: 'What do we know about the Great Migration?',
    icon: 'train',
  },
  {
    id: 'sq7',
    text: 'What can you tell me about resilience in our community?',
    icon: 'arm-flex',
  },
  {
    id: 'sq8',
    text: 'Who are the storytellers in our collection?',
    icon: 'account-group',
  },
];

interface MockResponse {
  content: string;
  citations: SourceCitation[];
}

const FAMILY_KEYWORDS = [
  'my family', 'our family', 'family history', 'family stories',
  'family tree', 'family served', 'family lived',
  'mcduffie', 'mcduffies', 'the mcduffie',
];

function isFamilyQuery(message: string): boolean {
  const lower = message.toLowerCase();
  return FAMILY_KEYWORDS.some(kw => lower.includes(kw));
}

function isMcDuffieMember(video: VideoMetadata): boolean {
  const familyLower = MOCK_FAMILY_MEMBERS.map(n => n.toLowerCase());
  return (
    video.interviewees.some(name => familyLower.includes(name.toLowerCase())) ||
    video.people.some(name => familyLower.includes(name.toLowerCase()))
  );
}

function matchVideos(message: string): VideoMetadata[] {
  const lower = message.toLowerCase();
  const familyQuery = isFamilyQuery(lower);
  const matches: { video: VideoMetadata; score: number }[] = [];

  for (const video of GRIOT_VIDEOS) {
    let score = 0;

    // For family queries, heavily boost McDuffie family videos
    if (familyQuery && isMcDuffieMember(video)) {
      score += 10;
    }

    // Check interviewee names
    for (const name of video.interviewees) {
      if (lower.includes(name.toLowerCase()) || lower.includes(name.split(' ').pop()!.toLowerCase())) {
        score += 5;
      }
    }

    // Check tags
    for (const tag of video.tags) {
      if (lower.includes(tag.toLowerCase())) {
        score += 3;
      }
    }

    // Check locations
    for (const ctx of video.historicalContext) {
      const locName = ctx.location.name.toLowerCase();
      if (lower.includes(locName) || locName.split(',').some(part => lower.includes(part.trim()))) {
        score += 4;
      }
    }

    // Check description keywords
    const descWords = video.description.toLowerCase().split(/\s+/);
    const queryWords = lower.split(/\s+/).filter(w => w.length > 3);
    for (const qw of queryWords) {
      if (descWords.includes(qw)) {
        score += 1;
      }
    }

    // Check title
    if (lower.includes(video.title.toLowerCase()) || video.title.toLowerCase().split(' ').some(w => w.length > 3 && lower.includes(w))) {
      score += 2;
    }

    if (score > 0) {
      matches.push({ video, score });
    }
  }

  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(m => m.video);
}

function buildCitations(videos: VideoMetadata[]): SourceCitation[] {
  return videos.map(v => ({
    videoId: v.id,
    title: v.title,
    interviewee: v.interviewees[0],
    relevantExcerpt: v.description.substring(0, 120) + '...',
  }));
}

function buildResponse(message: string, matchedVideos: VideoMetadata[]): string {
  if (matchedVideos.length === 0) {
    return getGenericResponse(message);
  }

  const intro = getContextualIntro(message);
  const videoSummaries = matchedVideos.map(v => {
    const locations = v.historicalContext
      .map(ctx => {
        const year = ctx.year ? `in ${ctx.year}` : '';
        return `${ctx.location.name} ${year}`.trim();
      })
      .join(', ');
    return `${v.interviewees[0]} shares a story about ${v.tags.slice(0, 2).join(' and ').toLowerCase()}. ${v.description.substring(0, 150)}... This takes us to ${locations}.`;
  });

  return `${intro}\n\n${videoSummaries.join('\n\n')}\n\nWould you like to hear more about any of these stories, or explore another part of your family's history?`;
}

function getContextualIntro(message: string): string {
  const lower = message.toLowerCase();

  // Family / McDuffie-specific intros (check first for priority)
  if (lower.includes('mcduffie') || lower.includes('mcduffies')) {
    return "The McDuffie family has shared some truly powerful stories. Ty and Sharon McDuffie have preserved memories that span love, service, and historic moments that shaped their lives.";
  }
  if (isFamilyQuery(lower) && (lower.includes('love') || lower.includes('marriage') || lower.includes('wife') || lower.includes('husband') || lower.includes('met'))) {
    return "The McDuffie family has a beautiful love story. Ty and Sharon's journey together began before his Air Force service and has been a foundation of your family ever since.";
  }
  if (isFamilyQuery(lower)) {
    return "The McDuffie family has been building a rich collection of stories. From moments of love to living through historic events, your family's voices carry powerful memories.";
  }

  // General topic intros
  if (lower.includes('north carolina') || lower.includes('carolina')) {
    return "North Carolina runs deep in your family's roots. Several of our storytellers have strong ties to the Tar Heel State.";
  }
  if (lower.includes('childhood') || lower.includes('growing up')) {
    return "The childhood memories preserved in your family's stories paint a vivid picture of resilience and community.";
  }
  if (lower.includes('love') || lower.includes('marriage') || lower.includes('wife') || lower.includes('husband')) {
    return "Love stories are some of the most treasured threads in the fabric of family history.";
  }
  if (lower.includes('military') || lower.includes('air force') || lower.includes('navy') || lower.includes('service')) {
    return "Military service has shaped many chapters of your family's journey.";
  }
  if (lower.includes('migration') || lower.includes('moved') || lower.includes('brooklyn') || lower.includes('philadelphia')) {
    return "The Great Migration transformed countless Black families, and yours is no exception. The journeys from South to North carry powerful stories.";
  }
  if (lower.includes('resilience') || lower.includes('strength') || lower.includes('overcome')) {
    return "Resilience is a golden thread that runs through nearly every story in your family's collection.";
  }
  if (lower.includes('who') || lower.includes('storyteller') || lower.includes('people')) {
    return "Your family's history is carried by remarkable voices. Let me introduce you to some of them.";
  }

  return "I found some stories that connect to what you're asking about.";
}

function getGenericResponse(message: string): string {
  const responses = [
    "That's a wonderful question. While I don't have specific family stories that directly address this, I encourage you to record a conversation with your elders about this topic. The stories we preserve today become the heritage of tomorrow.",
    "I don't have stories in our collection that speak directly to this, but it reminds me of the importance of capturing these memories. Every family has untold stories waiting to be shared. Perhaps this could inspire a new recording session?",
    "Your curiosity about family history is exactly what keeps these traditions alive. While this particular topic hasn't been covered in the stories we have, consider sitting down with a family member to explore it together. The Griot tradition is about passing wisdom from one generation to the next.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function getFamilyResponse(message: string): MockResponse | null {
  const lower = message.toLowerCase();
  if (!isFamilyQuery(lower)) return null;

  const familyVideos = GRIOT_VIDEOS.filter(v => isMcDuffieMember(v));
  const citations = buildCitations(familyVideos);

  // Family tree
  if (lower.includes('family tree') || lower.includes('related') || lower.includes('who is') || lower.includes('tell me about my family')) {
    return {
      content:
        "Your family tree holds deep roots. Here's what we know from the stories preserved so far:\n\n" +
        "Ty McDuffie and Sharon Burwell McDuffie are husband and wife. They met before Ty left for Air Force basic training in 1992 — a love story that has anchored your family for over three decades.\n\n" +
        "Sharon McDuffie, also part of the family, has shared her own powerful memories, including living through September 11, 2001 in Raleigh, North Carolina.\n\n" +
        "There are more branches of this tree waiting to be recorded. Every conversation you capture adds another generation to the story.",
      citations,
    };
  }

  // Love stories in my family
  if (lower.includes('love') || lower.includes('marriage') || lower.includes('wife') || lower.includes('husband') || lower.includes('met') || lower.includes('romance')) {
    return {
      content:
        "Your family has a beautiful love story at its heart.\n\n" +
        "Ty McDuffie recalls the moment he met Sharon Burwell before heading off to Air Force basic training in 1992. " +
        "He was at MEPS (Military Entrance Processing Station) when their paths crossed — and that meeting changed the course of both their lives. " +
        "They went on to build a life and a family together.\n\n" +
        "This is the kind of story that future generations will treasure. Have other family members share their love stories too — every one of them matters.",
      citations,
    };
  }

  // Military service in my family
  if (lower.includes('military') || lower.includes('served') || lower.includes('air force') || lower.includes('navy') || lower.includes('army') || lower.includes('service')) {
    return {
      content:
        "Your family has a proud history of military service.\n\n" +
        "Ty McDuffie served in the United States Air Force. His story about heading to basic training in 1992 captures a pivotal moment — " +
        "not only in his military career, but in his personal life, as it was right before basic training that he met the love of his life, Sharon Burwell McDuffie.\n\n" +
        "Military service often shapes families in ways that echo through generations. If there are other veterans in your family, their stories deserve to be captured too.",
      citations,
    };
  }

  // Historic events my family lived through
  if (lower.includes('historic') || lower.includes('event') || lower.includes('lived through') || lower.includes('history') || lower.includes('911') || lower.includes('september')) {
    return {
      content:
        "Your family has lived through moments that changed the world, and they've preserved those memories for future generations.\n\n" +
        "Sharon McDuffie shares a deeply personal account of September 11, 2001. She was in Raleigh, North Carolina when the attacks on the World Trade Center unfolded, " +
        "and her story captures the fear, confusion, and resilience of that day from the perspective of someone watching it all unfold far from New York.\n\n" +
        "These firsthand accounts of historic events are among the most valuable stories a family can preserve. " +
        "What other historic moments have your family members witnessed?",
      citations,
    };
  }

  // Generic family fallback — still return McDuffie-specific content
  return null;
}

export function generateMockResponse(message: string): MockResponse {
  // Check for hardcoded family-specific responses first
  const familyResponse = getFamilyResponse(message);
  if (familyResponse) return familyResponse;

  const matchedVideos = matchVideos(message);
  const content = buildResponse(message, matchedVideos);
  const citations = buildCitations(matchedVideos);

  return { content, citations };
}
