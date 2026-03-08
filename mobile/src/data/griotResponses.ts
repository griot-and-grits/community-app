import { SourceCitation, SuggestedQuestion } from '@/types/chat';
import { GRIOT_VIDEOS, VideoMetadata } from './videos';

export const GRIOT_WELCOME_MESSAGE =
  "Welcome, family. I am the Griot — the keeper of stories, the voice of memory. " +
  "I hold the threads of your family's history, woven from the stories shared here. " +
  "Ask me anything about the lives, places, and experiences your elders have preserved, " +
  "and I will do my best to guide you through their words.";

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    id: 'sq1',
    text: 'What stories do we have about North Carolina?',
    icon: 'map-marker',
  },
  {
    id: 'sq2',
    text: 'Tell me about our elders\' childhood experiences',
    icon: 'account-child',
  },
  {
    id: 'sq3',
    text: 'What can you tell me about resilience in our family?',
    icon: 'arm-flex',
  },
  {
    id: 'sq4',
    text: 'Are there any love stories in our family history?',
    icon: 'heart',
  },
  {
    id: 'sq5',
    text: 'What do we know about the Great Migration?',
    icon: 'train',
  },
  {
    id: 'sq6',
    text: 'Who are the storytellers in our collection?',
    icon: 'account-group',
  },
];

interface MockResponse {
  content: string;
  citations: SourceCitation[];
}

function matchVideos(message: string): VideoMetadata[] {
  const lower = message.toLowerCase();
  const matches: { video: VideoMetadata; score: number }[] = [];

  for (const video of GRIOT_VIDEOS) {
    let score = 0;

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

export function generateMockResponse(message: string): MockResponse {
  const matchedVideos = matchVideos(message);
  const content = buildResponse(message, matchedVideos);
  const citations = buildCitations(matchedVideos);

  return { content, citations };
}
