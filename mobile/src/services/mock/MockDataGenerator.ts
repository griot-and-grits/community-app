import { Story } from '@/database/models/Story';
import { PrivacyLevel } from '@/database/dao/StoryDAO';

/**
 * MockDataGenerator
 *
 * Generates mock stories for testing and development
 */
class MockDataGenerator {
  private static instance: MockDataGenerator;

  private firstNames = [
    'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
    'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Margaret', 'Anthony', 'Betty', 'Marcus', 'Sandra', 'Donald', 'Ashley',
    'George', 'Dorothy', 'Kenneth', 'Kimberly', 'Steven', 'Emily', 'Edward', 'Donna'
  ];

  private lastNames = [
    'Washington', 'Jefferson', 'Jackson', 'Robinson', 'Johnson', 'Williams', 'Brown',
    'Jones', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas',
    'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
    'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King',
    'Wright', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Carter', 'Mitchell'
  ];

  private storyTitles = [
    'Growing Up in the South',
    'My Journey to Freedom',
    'Grandmother\'s Kitchen Wisdom',
    'The Great Migration Story',
    'Civil Rights March Memories',
    'Sunday Dinners and Family Traditions',
    'Working the Railroad',
    'Life on the Farm',
    'Musical Roots and Jazz Nights',
    'Church Community Stories',
    'First Day of Integration',
    'Vietnam War Experiences',
    'Starting My Own Business',
    'Dance Halls and Romance',
    'Teaching in Segregated Schools',
    'Family Recipes Through Generations',
    'Moving North for Opportunity',
    'Community Activism and Change',
    'Gospel Music Heritage',
    'Breaking Barriers in Sports'
  ];

  private locations = [
    { city: 'Atlanta', state: 'Georgia', lat: 33.7490, lng: -84.3880 },
    { city: 'Chicago', state: 'Illinois', lat: 41.8781, lng: -87.6298 },
    { city: 'New Orleans', state: 'Louisiana', lat: 29.9511, lng: -90.0715 },
    { city: 'Detroit', state: 'Michigan', lat: 42.3314, lng: -83.0458 },
    { city: 'Philadelphia', state: 'Pennsylvania', lat: 39.9526, lng: -75.1652 },
    { city: 'Memphis', state: 'Tennessee', lat: 35.1495, lng: -90.0490 },
    { city: 'Birmingham', state: 'Alabama', lat: 33.5186, lng: -86.8104 },
    { city: 'Houston', state: 'Texas', lat: 29.7604, lng: -95.3698 },
    { city: 'Washington', state: 'D.C.', lat: 38.9072, lng: -77.0369 },
    { city: 'Harlem', state: 'New York', lat: 40.8116, lng: -73.9465 }
  ];

  private descriptions = [
    'A powerful story about family, resilience, and hope during challenging times.',
    'Memories of growing up and the lessons learned from our elders.',
    'An intimate look at community life and the bonds that held us together.',
    'Stories of courage, determination, and the pursuit of dreams.',
    'Preserving the wisdom and traditions passed down through generations.',
    'Personal experiences that shaped our family and community.',
    'A journey through history as told by those who lived it.',
    'Celebrating our heritage and the strength of our ancestors.',
    'Tales of triumph over adversity and the power of faith.',
    'Remembering the people and places that made us who we are.'
  ];

  private constructor() {}

  public static getInstance(): MockDataGenerator {
    if (!MockDataGenerator.instance) {
      MockDataGenerator.instance = new MockDataGenerator();
    }
    return MockDataGenerator.instance;
  }

  /**
   * Generate a random full name
   */
  private generateName(): string {
    const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    return `${firstName} ${lastName}`;
  }

  /**
   * Generate a random date in the past
   */
  private generatePastDate(daysAgo: number = 365): string {
    const now = Date.now();
    const randomDaysAgo = Math.floor(Math.random() * daysAgo);
    const date = new Date(now - randomDaysAgo * 24 * 60 * 60 * 1000);
    return date.toISOString();
  }

  /**
   * Generate a single mock story
   */
  public generateStory(id?: string): Story {
    const storyId = id || `mock-story-${Date.now()}-${Math.random()}`;
    const location = this.locations[Math.floor(Math.random() * this.locations.length)];
    const privacy: PrivacyLevel[] = ['public', 'family_only', 'private'];

    return {
      id: storyId,
      userId: `mock-user-${Math.floor(Math.random() * 100)}`,
      userName: this.generateName(),
      title: this.storyTitles[Math.floor(Math.random() * this.storyTitles.length)],
      description: this.descriptions[Math.floor(Math.random() * this.descriptions.length)],
      videoUrl: `https://example.com/videos/${storyId}.mp4`,
      videoLocalPath: null,
      thumbnailUrl: `https://picsum.photos/seed/${storyId}/400/300`,
      durationSeconds: Math.floor(Math.random() * 3000) + 120, // 2-52 minutes
      recordedAt: this.generatePastDate(730), // Within last 2 years
      uploadedAt: this.generatePastDate(730),
      quality: ['low', 'medium', 'high', 'max'][Math.floor(Math.random() * 4)] as any,
      privacy: privacy[Math.floor(Math.random() * 3)],
      location: `${location.city}, ${location.state}`,
      latitude: location.lat,
      longitude: location.lng,
      transcription: null,
      tags: this.generateTags(),
      viewCount: Math.floor(Math.random() * 10000),
      likeCount: Math.floor(Math.random() * 500),
      shareCount: Math.floor(Math.random() * 100),
      isPublic: Math.random() > 0.3, // 70% public
      isProcessed: true,
      processingStatus: 'completed',
      createdAt: this.generatePastDate(730),
      updatedAt: this.generatePastDate(30),
    };
  }

  /**
   * Generate random tags for a story
   */
  private generateTags(): string[] {
    const allTags = [
      'family', 'history', 'migration', 'civil-rights', 'music', 'food',
      'traditions', 'church', 'education', 'work', 'community', 'activism',
      'sports', 'art', 'culture', 'heritage', 'memories', 'elders', 'youth'
    ];

    const numTags = Math.floor(Math.random() * 4) + 2; // 2-5 tags
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  }

  /**
   * Generate multiple mock stories
   */
  public generateStories(count: number = 20): Story[] {
    const stories: Story[] = [];
    for (let i = 0; i < count; i++) {
      stories.push(this.generateStory());
    }
    return stories;
  }

  /**
   * Generate stories for a specific user
   */
  public generateUserStories(userId: string, count: number = 10): Story[] {
    const stories: Story[] = [];
    for (let i = 0; i < count; i++) {
      const story = this.generateStory();
      story.userId = userId;
      stories.push(story);
    }
    return stories;
  }

  /**
   * Get a featured story (high quality, recent, popular)
   */
  public generateFeaturedStory(): Story {
    const story = this.generateStory();
    story.quality = 'max';
    story.viewCount = Math.floor(Math.random() * 50000) + 10000;
    story.likeCount = Math.floor(Math.random() * 2000) + 500;
    story.isPublic = true;
    story.privacy = 'public';
    story.uploadedAt = this.generatePastDate(30); // Recent
    return story;
  }
}

export const mockDataGenerator = MockDataGenerator.getInstance();
export default mockDataGenerator;
