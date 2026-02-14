/**
 * Real video metadata from Griot & Grits
 * Source: https://github.com/griot-and-grits/gng-web/blob/main/metadata/videos.yaml
 */

export interface HistoricalContext {
  year?: number;
  location: {
    name: string;
    coordinates: [number, number];
  };
}

export interface VideoMetadata {
  id: string;
  thumbnail: string;
  title: string;
  interviewees: string[];
  description: string;
  duration: string;
  createdDate: string;
  videoUrl: string;
  featured: boolean;
  historicalContext: HistoricalContext[];
  tags: string[];
  people: string[];
  podcastUrl?: string;
}

export const GRIOT_VIDEOS: VideoMetadata[] = [
  {
    id: "mE7xK2qR9Ld",
    thumbnail: "https://res.cloudinary.com/ducxigdil/image/upload/v1739667555/Screenshot_62_wjthuw.png",
    title: "Mrs. Clark Talks Black Prisoner Cadavers",
    interviewees: ["Irene Clark"],
    description: "Irene Clark examines the historical use of black prisoners' cadavers in medical schools without family consent. This legal practice primarily benefited white institutions while restricting white cadavers from black schools.",
    duration: "3:00",
    createdDate: "2024-08-25T13:10:00Z",
    videoUrl: "https://www.youtube.com/watch?v=mE1PTJeDBXI",
    featured: true,
    historicalContext: [
      {
        year: 1926,
        location: {
          name: "United States",
          coordinates: [39.8283, -98.5795]
        }
      }
    ],
    tags: ["Medical History", "Prison System", "Racial Injustice", "Medical Ethics", "Historical Exploitation"],
    people: ["Irene Clark"]
  },
  {
    id: "Bw5yP8vV3mN",
    thumbnail: "https://res.cloudinary.com/ducxigdil/image/upload/v1739470989/image_vfqft9.png",
    title: "The Storied Life of Ms. Gladys M. Williams",
    interviewees: ["Gladys M. Williams"],
    description: "Gladys Williams shares her journey from her early years in Washington, North Carolina, to her experiences in Brooklyn and beyond. She reflects on her dedication to work, education, and personal values, emphasizing resilience and integrity.",
    duration: "12:56",
    createdDate: "2023-09-14T10:25:00Z",
    videoUrl: "https://www.youtube.com/watch?v=Bwk5yovVvmM",
    featured: true,
    historicalContext: [
      {
        year: 1924,
        location: {
          name: "Washington, North Carolina",
          coordinates: [35.5468, -77.0522]
        }
      },
      {
        year: 1960,
        location: {
          name: "Brooklyn, New York",
          coordinates: [40.6782, -73.9442]
        }
      }
    ],
    tags: ["Personal Stories", "Work & Employment", "Education", "Resilience", "Brooklyn", "North Carolina", "Migration"],
    people: ["Gladys M. Williams"]
  },
  {
    id: "nD9r6Y_lPXz",
    thumbnail: "https://img.youtube.com/vi/9Nwl-6DRPYI/0.jpg",
    title: "Deborah Ragan McCoy",
    interviewees: ["Deborah Ragan McCoy"],
    description: "Deborah McCoy reflects on her life, starting with her birth in Philadelphia, Pennsylvania in 1949. She explains how she got her name and shares various names she has been called, including Debbie and Elder Deb.",
    duration: "3:27",
    createdDate: "2024-10-03T16:30:00Z",
    videoUrl: "https://www.youtube.com/watch?v=9Nwl-6DRPYI",
    featured: false,
    historicalContext: [
      {
        year: 1949,
        location: {
          name: "Philadelphia, Pennsylvania",
          coordinates: [39.9526, -75.1652]
        }
      }
    ],
    tags: ["Philadelphia", "Personal Stories", "Name Origins", "1949", "Elder", "Family History", "Identity"],
    people: ["Deborah Ragan McCoy"]
  },
  {
    id: "hR2k4ie8lYm",
    thumbnail: "https://res.cloudinary.com/ducxigdil/image/upload/v1739667554/Screenshot_61_e3jz6q.png",
    title: "Sharon McDuffie Recalls 911",
    interviewees: ["Sharon McDuffie"],
    description: "On the morning of September 11, 2001, she awoke in Raleigh, North Carolina, to the shocking news of a plane crashing into the World Trade Center. As a second plane struck, confirming the attack, a sense of urgency and fear set in.",
    duration: "9:36",
    createdDate: "2024-11-17T08:45:00Z",
    videoUrl: "https://www.youtube.com/watch?v=meR02ie2lYg",
    featured: true,
    historicalContext: [
      {
        year: 2001,
        location: {
          name: "Raleigh, North Carolina",
          coordinates: [35.7796, -78.6382]
        }
      },
      {
        year: 2001,
        location: {
          name: "New York, New York",
          coordinates: [40.7128, -74.0060]
        }
      }
    ],
    tags: ["September 11", "Raleigh", "World Trade Center", "Personal Stories", "Historical Events"],
    people: ["Sharon McDuffie"]
  },
  {
    id: "vH1a8RhP0Oo",
    thumbnail: "https://img.youtube.com/vi/1veIaRHpYO0/0.jpg",
    title: "Ty McDuffie Remembers Meeting His Wife",
    interviewees: ["Ty McDuffie"],
    description: "Ty McDuffie, founder of Griot and Grits, shares his personal story about meeting his wife, Sharon Burwell McDuffie, just before Air Force basic training at a MEPS station. They were assigned different flights but managed to connect by passing notes.",
    duration: "3:16",
    createdDate: "2024-12-08T14:20:00Z",
    videoUrl: "https://www.youtube.com/watch?v=1veIaRHpYO0",
    featured: false,
    historicalContext: [
      {
        year: 1992,
        location: {
          name: "United States",
          coordinates: [39.8283, -98.5795]
        }
      }
    ],
    tags: ["Love Stories", "Air Force", "Military Service", "MEPS", "Founder Stories", "Personal Stories"],
    people: ["Ty McDuffie", "Sharon Burwell McDuffie"]
  },
  {
    id: "Wy3d0Hwc7iA",
    thumbnail: "https://img.youtube.com/vi/Wygd0hwc7iA/0.jpg",
    title: "Deborah McCoy Recalls a Historic Snowstorm",
    interviewees: ["Deborah Ragan McCoy"],
    description: "At just 10 years old, Deborah Ragan McCoy found herself babysitting her aunt's six children in West Philadelphia—a responsibility far beyond her years. As the evening wore on, an approaching snowstorm made her eager to get home. Determined, she braved the bitter cold and deepening snow, embarking on an arduous four-hour trek.",
    duration: "5:14",
    createdDate: "2025-01-12T12:15:00Z",
    videoUrl: "https://www.youtube.com/watch?v=Wygd0hwc7iA",
    featured: true,
    historicalContext: [
      {
        year: 1958,
        location: {
          name: "West Philadelphia, Pennsylvania",
          coordinates: [39.9526, -75.1652]
        }
      }
    ],
    tags: ["Childhood", "Philadelphia", "Snowstorm", "Babysitting", "Resilience", "Family Responsibility", "Weather Events"],
    people: ["Deborah Ragan McCoy"]
  },
  {
    id: "Y4xON7_lXUe",
    thumbnail: "https://img.youtube.com/vi/Y48ON7_lUXE/0.jpg",
    title: "Dr. Oliver T. Reid Reflects on Growing Up Between Danger and Sanctuary",
    interviewees: ["Dr. Oliver T. Reid"],
    description: "Dr. Oliver T. Reid reflects on the complicated journey of growing into his own name, sharing how \"Oliver\" once felt like a burden until he uncovered the powerful legacy behind it—a grandfather who rose from enslavement to reclaim the very land his family once worked. He traces the nicknames that marked different chapters of his life, the move from Concord to Charlotte in North Carolina, and the Boys and Girls Club that became a rare place of safety and belonging during a turbulent childhood. Through heritage, hardship, and the people who held him up, he tells the story of learning to take pride in the name he once rejected.",
    duration: "4:39",
    createdDate: "2026-01-31T12:00:00Z",
    videoUrl: "https://www.youtube.com/watch?v=Y48ON7_lUXE",
    podcastUrl: "https://open.spotify.com/episode/02DSQX5xtuqWzL70nWdzRD?si=7c6e581980ae4b67",
    featured: true,
    historicalContext: [
      {
        location: {
          name: "Concord, North Carolina",
          coordinates: [35.4089, -80.5816]
        }
      },
      {
        year: 1980,
        location: {
          name: "Charlotte, North Carolina",
          coordinates: [35.2271, -80.8431]
        }
      }
    ],
    tags: ["North Carolina", "Charlotte", "Boys and Girls Club", "Childhood", "Heritage", "Personal Stories", "Resilience"],
    people: ["Dr. Oliver T. Reid"]
  },
  {
    id: "Ue1a7sw8xW0",
    thumbnail: "https://img.youtube.com/vi/Uea17sw8xW0/0.jpg",
    title: "Roots, Work, and Quiet Strength with Rickey Thomas",
    interviewees: ["Rickey Gerard Thomas"],
    description: "Rickey Gerard Thomas reflects on his upbringing in Brooklyn as the son of Southern parents who built a new life after meeting at the Brooklyn Navy Yard. He describes his father's influence as a hardworking Navy veteran–turned–plumber whose consistency shaped Rickey's own quiet, steady approach to life. The interview traces the dynamics of a large family, the personalities of his siblings, and the lessons absorbed from watching people work, study, and find their way. Woven through his memories is a sense of place—how the streets, the block, and the rhythm of New York instilled awareness, resilience, and a belief that true character shows itself through everyday consistency.",
    duration: "6:20",
    createdDate: "2026-02-09T12:00:00Z",
    videoUrl: "https://www.youtube.com/watch?v=Uea17sw8xW0",
    podcastUrl: "https://open.spotify.com/episode/5MJzmnOw8C2sy0yw3URK5k?si=UcYW5o3eQf66FOUBLU7A5g",
    featured: true,
    historicalContext: [
      {
        location: {
          name: "Raleigh, North Carolina",
          coordinates: [35.7721, -78.6386]
        }
      },
      {
        location: {
          name: "Miami, Florida",
          coordinates: [25.761681, -80.191788]
        }
      },
      {
        location: {
          name: "Fort Lauderdale, Florida",
          coordinates: [26.12231, -80.14338]
        }
      },
      {
        year: 1954,
        location: {
          name: "Brooklyn, New York",
          coordinates: [40.6501, -73.9496]
        }
      }
    ],
    tags: ["North Carolina", "Raleigh", "Brooklyn", "Boys and Girls Club", "Childhood", "Heritage", "Personal Stories", "Resilience", "Family History", "Migration", "Work & Employment", "Military Service"],
    people: ["Rickey Gerard Thomas"]
  }
];

export const getFeaturedVideos = (): VideoMetadata[] => {
  return GRIOT_VIDEOS.filter(v => v.featured);
};

export const getVideoById = (id: string): VideoMetadata | undefined => {
  return GRIOT_VIDEOS.find(v => v.id === id);
};

export const getVideosByTag = (tag: string): VideoMetadata[] => {
  return GRIOT_VIDEOS.filter(v => v.tags.includes(tag));
};

export const getVideosByPerson = (person: string): VideoMetadata[] => {
  return GRIOT_VIDEOS.filter(v => v.people.includes(person));
};
