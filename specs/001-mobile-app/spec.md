# Feature Specification: Griot and Grits Mobile App

**Feature Branch**: `001-mobile-app`
**Created**: 2026-01-05
**Status**: Draft
**Input**: User description: "I am building a modern mobile app for the Griot and Grits open source project which you can research at https://griotandgrits.org. It should work for the latest Android and iOS devices, and their corresponding mobile stores. Griot and Grits has the mission to preserve the history of the black experience by collecting oral history from Blacks through the use of AI and other advanced technologies. This mobile app will allow users to record video of their own family members talking about historic or personal events using the mobile phone, and upload it for processing and cataloging into the Griot and Grits back end systems. It will also allow users to view the processed content and share it with other family members. We want families to be able to share stories between themselves and with the general public. The point of uploading it to the Griot and Grits backend is to process the video files using AI to enrich it with Gen AI content, tag it with metadata, make it searchable and discoverable, and to allow users to provide additional family content like photos about their stories. It should allow the for the attachment of photos, other video and important family documents so they are associated with the story being uploaded. It should also allow users to upload both low quality videos for when bandwidth or storage saving is important, or high quality when they have bandwidth and storage. The users should be allowed to record content when not connected to the internet, and it should upload when the user is back online. It should also allow for pausing and minor editing, trimming, stitching, enhancing, etc from their mobile phone before uploading. It's also important that it allows families to share their stories and being able to search specific topics, people or places. It should also allow people to navigate uploaded content by map and select things to listen to based on location. Lastly, and importantly, it should allow for a chatbot, called a Griot, and let families ask family history questions via the app and the answers are based on overall history or specific content uploaded by them."

## Clarifications

### Session 2026-01-05

- Q: How should users form and join family groups to share family-only stories? → A: Invitation-based with confirmation: Users send invitations; recipients must accept to join the family group
- Q: What is the maximum duration for a single video recording? → A: 60 minutes maximum; uploads may be chunked based on file size for reliable transfer and backend processing
- Q: What authentication method should the app use for user accounts? → A: Email/password with optional social login (both methods supported)
- Q: How should the app collect location data for stories? → A: Optional with manual entry (users can enable GPS or manually tag location)
- Q: How should users flag inappropriate content in public stories, and what immediate feedback do they receive? → A: Users tap "Report" with required reason selection (spam, harassment, inappropriate, etc.); content remains visible to others but user can optionally hide it from their own feed; user receives confirmation with tracking ID and can check status
- Q: What specific audio enhancement capabilities should the mobile app provide? → A: Automatic AI-powered enhancement (noise reduction, volume normalization, clarity improvement) with manual on/off toggle
- Q: How should the app handle user storage quota limits? → A: Proactive warnings at 80% quota; at 100% users can still record offline but cannot upload until space freed; app shows quota usage and allows deleting old stories; free members have base quota while paid membership allows for increased quota
- Q: What is the relationship between Family Objects and Attachments in the data model? → A: Family Objects are standalone content items that can also be attached to interviews, but exist independently with their own metadata and privacy
- Q: How should the discovery feed ranking algorithm work? → A: Hybrid recommendation: Initially chronological (newest first) for new users, then progressively personalized based on likes with user-selectable sort options ("Recent" or "For You")
- Q: How should location-based notifications be configured for privacy compliance? → A: Fully opt-in with granular controls: Disabled by default; users must explicitly enable in settings with clear privacy explanation; users control notification radius and content types
- Q: How should the app handle backend service unavailability when users attempt critical operations like uploading content or accessing the discovery feed? → A: Graceful degradation with cached content: App continues functioning with cached/local content when backend unavailable; users can record and view cached stories, but cannot upload or access fresh discovery feed until connection restored
- Q: What guided interview question generation strategy should the app use when real-time speech recognition detects specific topics mentioned during recording? → A: Hybrid approach with local templates and optional AI enhancement: App uses local template matching for immediate suggestions, then optionally enhances with AI-generated questions when connectivity allows for graceful degradation
- Q: What observability approach should the app implement for production operations, debugging, and monitoring? → A: Structured events with metrics and distributed tracing: Log key user actions as structured events; track metrics (upload success rate, cache hit rate); support distributed tracing for cross-system debugging

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record and Upload Family Story (Priority: P1)

A family member wants to capture their grandmother telling stories about her childhood in the 1960s. They open the app, start recording video on their phone, and upload it to preserve the story for future generations. By default, the story will be public to contribute to the broader community, but they can choose to make it family-only or private.

**Why this priority**: This is the core value proposition - capturing oral histories. Without this, the app has no purpose. It represents the primary data creation flow.

**Independent Test**: Can be fully tested by recording a video, pausing/resuming during recording, setting privacy options, and successfully uploading it to the backend. Delivers immediate value by preserving a family story.

**Acceptance Scenarios**:

1. **Given** the user has opened the app, **When** they tap the record button, **Then** video recording starts with audio capture
2. **Given** recording is in progress, **When** the user taps pause, **Then** recording pauses and can be resumed
3. **Given** a video has been recorded, **When** the user reviews upload settings, **Then** privacy is set to "Public" by default with clear options to change to "Family Only" or "Private"
4. **Given** a user is setting privacy, **When** they select "Public", **Then** a clear explanation indicates the story will be discoverable by all app users
5. **Given** a user is setting privacy, **When** they select "Family Only", **Then** a clear explanation indicates only family members can view the story
6. **Given** a user is setting privacy, **When** they select "Private", **Then** a clear explanation indicates only they can view the story
7. **Given** the user has selected privacy settings, **When** they upload, **Then** the video is queued for upload to the backend with chosen privacy level
8. **Given** the user has no internet connection, **When** they complete recording, **Then** the video is saved locally and marked for upload when online
9. **Given** the user has recorded a video offline, **When** they regain internet connection, **Then** the app automatically uploads pending videos
10. **Given** the user is uploading a video, **When** they select quality settings, **Then** they can choose between low quality (bandwidth/storage saving) or high quality

---

### User Story 2 - Attach Supporting Materials to Story (Priority: P2)

After recording a video of their uncle talking about his military service, a user wants to attach photos from his time in the service, his discharge papers, and another short video clip from a reunion. These attached materials can optionally be linked to specific timestamps in the interview for interactive playback (see User Story 18).

**Why this priority**: Enriching stories with context makes them more valuable and complete. This is essential for comprehensive family history documentation but depends on having a story recorded first.

**Independent Test**: Can be tested by selecting an existing or newly recorded story and attaching multiple types of media (photos, videos, documents). Delivers value by creating richer, more complete family narratives.

**Acceptance Scenarios**:

1. **Given** a user has recorded a story, **When** they select "attach materials", **Then** they can browse and select photos from their device
2. **Given** a user is attaching materials, **When** they select multiple items, **Then** all selected items are associated with the story
3. **Given** a user wants to attach documents, **When** they browse files, **Then** they can select PDF and Word documents
4. **Given** a user has attached materials, **When** they view the story, **Then** all attached materials are displayed with the video
5. **Given** a user has attached materials, **When** they want interactive playback, **Then** they can optionally specify timestamps for when each material should appear during interview playback (this creates interactive object overlays as described in User Story 18)

---

### User Story 3 - Upload Family Object with Audio Narration (Priority: P2)

A user has a family heirloom (grandma's recipe book, great-grandfather's military medals photo, old home video) and wants to share it with the family. They upload the object (photo, document, or video) and record an audio narration explaining what it is, its history, and why it's important to the family. The object is shared with the same privacy controls as interview stories.

**Why this priority**: Preserving family artifacts with context is essential for comprehensive family history. This provides a second content creation path beyond interviews, allowing families to document objects that tell their story. Critical for capturing the full scope of family heritage.

**Independent Test**: Can be tested by uploading a photo/document/video, recording audio narration about it, setting privacy options, and successfully sharing with family. Delivers immediate value by preserving family artifacts with historical context.

**Acceptance Scenarios**:

1. **Given** a user opens the app, **When** they select "Upload Family Object", **Then** they can choose to upload a photo, document, or video from their device
2. **Given** a user has selected an object to upload, **When** they proceed, **Then** they are prompted to record audio narration explaining the object
3. **Given** a user is recording narration, **When** they tap record, **Then** audio recording starts with pause/resume functionality
4. **Given** a user has recorded narration, **When** they review, **Then** they can play back the audio and re-record if needed
5. **Given** a user has uploaded an object with narration, **When** they set privacy, **Then** they can choose Public, Family Only, or Private (same as interview stories)
6. **Given** a user uploads a family object, **When** the upload completes, **Then** it appears in the family library alongside interview stories with a clear object indicator
7. **Given** a user has no internet connection, **When** they upload an object with narration, **Then** it is saved locally and queued for upload when online
8. **Given** a user views a family object, **When** they tap play, **Then** the object is displayed and the audio narration plays automatically
9. **Given** a user is uploading an object, **When** they select quality settings for video objects, **Then** they can choose between low quality and high quality

---

### User Story 4 - Edit Video Before Upload (Priority: P3)

A user has recorded a 10-minute video but wants to trim the first minute where they were setting up, remove a middle section where someone walked by, and enhance the audio quality before uploading.

**Why this priority**: Editing improves story quality but is not essential for the core function. Users can upload raw footage and still achieve the primary goal of preservation.

**Independent Test**: Can be tested by recording a video and using trim, stitch, and enhancement tools before uploading. Delivers value by allowing users to create more polished stories.

**Acceptance Scenarios**:

1. **Given** a user has recorded a video, **When** they select edit, **Then** they can trim the beginning and end of the video
2. **Given** a user is editing, **When** they select portions to remove, **Then** those sections are cut from the final video
3. **Given** a user has multiple video clips, **When** they select stitch, **Then** clips are combined into a single video
4. **Given** a user has a video with poor audio, **When** they enable audio enhancement, **Then** automatic AI-powered processing applies noise reduction, volume normalization, and clarity improvement
5. **Given** audio enhancement is enabled, **When** the user toggles it off, **Then** the original audio is restored
6. **Given** a user has edited a video, **When** they preview it, **Then** they see the edited version with all enhancements before uploading

---

### User Story 5 - Discover Stories via Social Feed (Priority: P1)

A user opens the app and wants to discover interesting stories from the broader community. They scroll through an endless feed of public stories, similar to Instagram, watching different families' oral histories and discovering new perspectives on Black history. They can like stories to see more similar content and mark favorites for later viewing.

**Why this priority**: Social discovery is a primary engagement mechanism that encourages content consumption and community building. It makes the app valuable for exploring beyond just family stories and creates viral discovery potential.

**Independent Test**: Can be tested by opening the discovery feed, scrolling through public stories, liking content, and filtering favorites. Delivers immediate value by exposing users to diverse community content.

**Acceptance Scenarios**:

1. **Given** a new user opens the discovery feed for the first time, **When** they view the feed, **Then** stories are displayed in chronological order (newest first)
2. **Given** a user opens the discovery feed, **When** they scroll down, **Then** new public stories load continuously without pagination
3. **Given** stories are displayed in the feed, **When** a user taps a story, **Then** the video plays with full AI-enriched content visible
4. **Given** a user is scrolling the feed, **When** they reach the end of loaded content, **Then** more stories are automatically fetched and displayed
5. **Given** the feed displays stories, **When** a user refreshes, **Then** new or recently uploaded stories appear based on current sort mode
6. **Given** a user has liked stories, **When** they view the feed in "For You" mode, **Then** the algorithm prioritizes showing similar stories based on their preferences
7. **Given** a user has engagement history, **When** they switch to "For You" sort, **Then** they see personalized recommendations based on their likes
8. **Given** a user wants chronological order, **When** they switch to "Recent" sort, **Then** stories are displayed newest first regardless of personalization
9. **Given** a user views a story, **When** they mark it as favorite, **Then** the story is saved to their favorites collection
10. **Given** a user has favorites, **When** they select the favorites filter, **Then** only favorited stories are displayed
11. **Given** a user is on the discovery feed, **When** they switch between "Recent", "For You", and "Favorites" views, **Then** the feed updates accordingly with appropriate sort logic

---

### User Story 6 - View and Explore Family Stories (Priority: P1)

A user wants to explore their own family's uploaded stories separately from the public feed, view the AI-enriched content with metadata tags, and discover family stories they haven't seen yet.

**Why this priority**: Viewing family-specific content is essential for the core value proposition of preserving family history. This is distinct from the public discovery feed and provides focused family content access.

**Independent Test**: Can be tested by browsing family stories library, viewing AI-generated tags and metadata, and playing back videos. Delivers immediate value by making family histories accessible and organized.

**Acceptance Scenarios**:

1. **Given** a user has uploaded stories, **When** they open the family library, **Then** they see all their family's stories (including public, family-only, and private) with thumbnails and titles
2. **Given** stories have been processed, **When** a user views a story, **Then** they see AI-generated tags, metadata, and enriched content
3. **Given** a user is viewing a story, **When** they tap play, **Then** the video plays with attached photos and documents accessible
4. **Given** multiple stories exist, **When** a user scrolls through the family library, **Then** content loads smoothly with clear organization
5. **Given** a user is in the family library, **When** they view privacy indicators, **Then** they can clearly see which stories are public, family-only, or private

---

### User Story 7 - Search Stories by Topic, People, or Places (Priority: P2)

A user wants to find all stories that mention "Chicago" or their great-grandfather "James Wilson" or discuss "civil rights movement."

**Why this priority**: Search enables discovery of relevant content across large collections but requires stories to exist first. Critical for long-term value as collections grow.

**Independent Test**: Can be tested by entering search terms and verifying relevant stories are returned. Delivers value by making large story collections navigable and useful.

**Acceptance Scenarios**:

1. **Given** stories have been uploaded and processed, **When** a user searches for a person's name, **Then** all stories mentioning that person are displayed
2. **Given** a user searches for a topic, **When** they enter "civil rights", **Then** stories tagged with related content appear
3. **Given** a user searches for a place, **When** they enter "Chicago", **Then** stories associated with that location are shown
4. **Given** search results are displayed, **When** a user selects a result, **Then** they can view the full story with context highlighting the search term

---

### User Story 8 - Navigate Stories by Map (Priority: P3)

A user wants to explore their family's migration history visually, seeing where different stories took place on a map and discovering geographic patterns in their family history.

**Why this priority**: Map navigation is a powerful discovery tool but represents an enhanced experience beyond basic browsing and search. Valuable but not essential for core functionality.

**Independent Test**: Can be tested by opening map view, seeing story markers at various locations, and selecting locations to view associated stories. Delivers value through geographic context and visual exploration.

**Acceptance Scenarios**:

1. **Given** stories have location metadata, **When** a user opens map view, **Then** they see markers for each story location
2. **Given** markers are displayed on the map, **When** a user taps a marker, **Then** they see stories associated with that location
3. **Given** multiple stories share a location, **When** a user selects that location, **Then** all stories are listed for selection
4. **Given** a user is viewing the map, **When** they zoom and pan, **Then** the map updates smoothly with appropriate markers visible

---

### User Story 9 - Manage Story Privacy Settings (Priority: P2)

A user has uploaded a story that is public by default, but they want to change it to family-only so only their family members can view it. Later, they decide to make another story completely private.

**Why this priority**: Privacy control is essential for user trust and compliance, allowing users to manage who sees their content. While stories default to public to build community, users need clear control.

**Independent Test**: Can be tested by uploading a story, verifying it's public by default, changing privacy settings, and confirming access controls work correctly. Delivers value by giving users control over their content.

**Acceptance Scenarios**:

1. **Given** a user uploads a story, **When** they review the upload confirmation, **Then** they see it's set to "Public" with a clear explanation of what that means
2. **Given** a user has uploaded a public story, **When** they open story settings, **Then** they can change privacy to "Family Only" or "Private"
3. **Given** a user changes a story to "Family Only", **When** family members view the family library, **Then** they can see the story but it doesn't appear in public feeds
4. **Given** a user changes a story to "Private", **When** they confirm, **Then** only they can view the story in any context
5. **Given** a user views their uploaded stories, **When** they see privacy indicators, **Then** each story clearly shows whether it's Public, Family Only, or Private

---

### User Story 10 - Ask the Griot About Family History (Priority: P2)

A user wants to ask "What do we know about our family's experience during the Great Migration?" using the "Ask the Griot" feature and receive answers based on their uploaded family stories and general historical context.

**Why this priority**: The "Ask the Griot" chatbot represents advanced engagement with family history content, but requires a corpus of stories to be valuable. Important for deepening understanding but not essential for core preservation functions.

**Independent Test**: Can be tested by asking questions about family history and receiving relevant answers citing uploaded stories and historical context. Delivers value through conversational access to family knowledge.

**Acceptance Scenarios**:

1. **Given** a user opens "Ask the Griot", **When** they ask a question about their family, **Then** the chatbot responds with relevant information from their uploaded stories
2. **Given** a user asks a historical question, **When** the Griot processes the query, **Then** it provides context from both general history and family-specific content
3. **Given** the Griot references a family story, **When** the response is displayed, **Then** it includes links to the relevant uploaded stories
4. **Given** a user asks about a person mentioned in stories, **When** the Griot responds, **Then** it synthesizes information across multiple stories about that person
5. **Given** no relevant family content exists, **When** a user asks a question, **Then** the Griot provides general historical context and suggests what stories to record

---

### User Story 11 - Learn Through Griot Tutorials (Priority: P2)

A new user wants to learn how to effectively capture family history and use the app features. They access tutorial videos that teach them best practices for recording oral histories, how to be a Griot for their family, and tips for getting relatives to share stories.

**Why this priority**: Educational content empowers users to create higher quality stories and increases engagement, but the core recording functionality works without tutorials. Essential for user success but not blocking basic usage.

**Independent Test**: Can be tested by accessing tutorial library, watching videos, and applying learned techniques to recordings. Delivers value by improving user confidence and story quality.

**Acceptance Scenarios**:

1. **Given** a user opens the tutorials section, **When** they browse available content, **Then** they see organized categories (recording basics, interview techniques, app features, being a Griot)
2. **Given** a user selects a tutorial, **When** the video loads, **Then** they can play, pause, and seek through the content
3. **Given** a user is watching a tutorial, **When** they exit and return later, **Then** the video resumes from where they left off
4. **Given** a user completes a tutorial, **When** they return to the library, **Then** completed tutorials are marked with progress indicators
5. **Given** a new user opens the app for the first time, **When** they complete onboarding, **Then** they are prompted to watch a getting started tutorial

---

### User Story 12 - Guided Interview Mode (Priority: P1)

A user is recording their grandmother's story but doesn't know what questions to ask. They enable guided interview mode which suggests relevant questions before and during the recording. As grandmother talks about growing up in the South, the system suggests follow-up questions about specific events, people, and places mentioned.

**Why this priority**: Guided mode dramatically improves story quality and helps users who are unsure how to conduct interviews. This is critical for capturing rich, detailed oral histories and makes the app accessible to users without interview experience.

**Independent Test**: Can be tested by starting a guided recording, receiving question prompts, and getting AI-generated follow-ups based on speech recognition. Delivers immediate value by helping users capture comprehensive stories.

**Acceptance Scenarios**:

1. **Given** a user starts recording, **When** they enable guided interview mode, **Then** they see suggested starter questions organized by topic (childhood, family origins, significant events, cultural traditions)
2. **Given** guided mode is active, **When** the user selects a starter question, **Then** the question is displayed and they can begin recording the response
3. **Given** recording is in progress with guided mode, **When** the interviewee mentions specific topics (locations, people, events), **Then** relevant follow-up questions from local template database are suggested immediately
4. **Given** guided mode is active with backend connectivity, **When** the interviewee mentions topics, **Then** AI-enhanced contextually relevant questions supplement the template suggestions
5. **Given** guided mode is active without backend connectivity, **When** the interviewee mentions topics, **Then** template-based suggestions continue to appear without AI enhancement
6. **Given** follow-up questions appear, **When** the user views them, **Then** they can see whether suggestions are template-based or AI-enhanced
7. **Given** follow-up questions appear, **When** the user taps a suggestion, **Then** it's queued for them to ask after the current response concludes
8. **Given** a user is in guided mode, **When** they want to ask their own question, **Then** they can dismiss suggestions and record freely
9. **Given** guided mode suggestions appear, **When** the user dismisses them, **Then** they can toggle suggestions back on at any time
10. **Given** an interview session completes, **When** the user reviews, **Then** they see which suggested questions were covered and which were skipped

---

### User Story 13 - Tag People in Photos and Add Multiple Narrations (Priority: P2)

A user uploads a family photo from a reunion showing multiple relatives. They want to tag each person in the photo by name and record a separate audio narration for each person, explaining who they are and their significance to the family.

**Why this priority**: Tagging people creates structured family data and enables powerful search/discovery. Multiple narrations allow comprehensive documentation of each individual, making photos much more valuable for family history preservation.

**Independent Test**: Can be tested by uploading a photo, tagging multiple people, recording separate narrations for each, and verifying playback. Delivers value by creating rich, person-centric family documentation.

**Acceptance Scenarios**:

1. **Given** a user uploads or takes a photo, **When** they tap to add tags, **Then** they can tap on faces in the photo to tag them with names
2. **Given** a user has tagged a person, **When** they select that person, **Then** they can record an audio narration specifically about that person
3. **Given** a photo has multiple tagged people, **When** a user adds narrations, **Then** each person can have their own separate audio narration
4. **Given** a user views a photo with tagged people, **When** they tap a tagged person, **Then** they see the person's name and can play their specific narration
5. **Given** multiple narrations exist for one photo, **When** a user plays them, **Then** they can navigate between different people's narrations
6. **Given** a user has tagged people, **When** they search for a person's name, **Then** all photos where that person is tagged appear in results

---

### User Story 14 - Build and Navigate Interactive Family Tree (Priority: P1)

A user wants to visualize their family relationships in an interactive family tree. They add family members, define relationships (parent, child, sibling, spouse), and link stories and family objects to each person. When they tap on a person in the tree, they can see all related content and listen to their stories.

**Why this priority**: The family tree is a core organizational structure that makes the entire app more valuable. It transforms disconnected stories into a cohesive family narrative and enables powerful discovery through relationships.

**Independent Test**: Can be tested by creating a family tree, adding members, defining relationships, linking content, and navigating the tree. Delivers immediate value by organizing family history around people and relationships.

**Acceptance Scenarios**:

1. **Given** a user opens the family tree, **When** they tap "Add Person", **Then** they can enter name, birth date, and relationship to existing members
2. **Given** a user has added people, **When** they view the tree, **Then** they see a visual representation showing family relationships
3. **Given** a user selects a person in the tree, **When** they tap "Link Content", **Then** they can associate interviews or family objects with that person
4. **Given** a person has linked stories, **When** a user taps that person in the tree, **Then** they see all associated content and can play stories
5. **Given** a user views the family tree, **When** they zoom and pan, **Then** the tree updates smoothly showing multiple generations
6. **Given** a user wants to modify the tree, **When** they select a person, **Then** they can edit details, change relationships, or remove them
7. **Given** AI detects a person in an interview, **When** processing completes, **Then** the system suggests matching them to existing tree members or prompts user to add them with relationship details

---

### User Story 15 - Receive Location-Based Story Notifications (Priority: P3)

A user is visiting Atlanta and walks near the historic Auburn Avenue neighborhood. The app detects their location and sends a notification: "Your grandfather told a story about this area - listen now?" They tap to hear his interview about growing up in this neighborhood.

**Why this priority**: Location-based notifications create serendipitous discovery moments and connect family history to physical places. Enhances engagement but not essential for core preservation functionality.

**Independent Test**: Can be tested by enabling location services, moving near a story location, receiving notification, and playing the story. Delivers value through contextual, location-aware family history discovery.

**Acceptance Scenarios**:

1. **Given** location-based notifications are disabled by default, **When** a new user installs the app, **Then** they do not receive location notifications until explicitly enabled
2. **Given** a user wants location notifications, **When** they open settings, **Then** they see a clear privacy explanation and must explicitly enable the feature
3. **Given** a user is enabling location notifications, **When** they review settings, **Then** they can configure notification radius and choose which content types (interviews, family objects, or both) trigger notifications
4. **Given** a user has enabled location notifications with configured preferences, **When** they enter an area with associated stories matching their preferences, **Then** they receive a notification about nearby family history
5. **Given** a user receives a location notification, **When** they tap it, **Then** the app opens to the relevant story or family object
6. **Given** multiple stories exist for one location, **When** a user is nearby, **Then** the notification indicates how many stories are available
7. **Given** a user has viewed a location-triggered story, **When** they return to that location later, **Then** they don't receive duplicate notifications for the same content
8. **Given** a user wants to disable location notifications, **When** they toggle the setting off, **Then** background location monitoring stops and no further notifications are sent

---

### User Story 16 - View Source Citations in Ask the Griot (Priority: P2)

A user asks the Griot "What do we know about our family's migration from Mississippi?" The Griot provides an answer and lists specific sources: "Based on: Interview with Grandma Ruth (May 2025), Family letter uploaded March 2025, Encyclopedia Britannica article on Great Migration."

**Why this priority**: Source citations build trust in AI responses and help users verify information. Essential for credibility but depends on existing content.

**Independent Test**: Can be tested by asking questions and verifying that responses include specific source citations with links. Delivers value through transparency and traceability.

**Acceptance Scenarios**:

1. **Given** a user asks the Griot a question, **When** the response is generated, **Then** all source materials used are listed at the end with clear citations
2. **Given** source citations are displayed, **When** a user taps a cited interview, **Then** the app opens that interview for playback
3. **Given** source citations are displayed, **When** a user taps a cited family object, **Then** the app displays that object with its narration
4. **Given** source citations include external sources, **When** listed, **Then** they show the source name and type (e.g., "Historical database", "Encyclopedia entry")
5. **Given** a response synthesizes multiple sources, **When** displayed, **Then** citations clearly indicate which information came from which source

---

### User Story 17 - Watch Condensed Interview Highlights (Priority: P3)

A user's grandmother recorded a 45-minute interview about her life. The user wants to share it with relatives but knows they won't watch the full length. They select "View Highlights" and watch a 5-minute condensed version with the most important moments.

**Why this priority**: Condensed versions increase content consumption and sharing but require existing interviews. Valuable for engagement but not essential for preservation.

**Independent Test**: Can be tested by viewing an interview's highlights reel and verifying key moments are included. Delivers value by making long-form content more accessible.

**Acceptance Scenarios**:

1. **Given** an interview has been processed, **When** a user selects it, **Then** they see options for "Full Interview" and "Highlights"
2. **Given** a user selects "Highlights", **When** playback starts, **Then** they see a condensed version with AI-identified important moments
3. **Given** a user is watching highlights, **When** they want more context, **Then** they can tap to jump to the full interview at that moment
4. **Given** highlights are being generated, **When** a user views the interview, **Then** they see processing status and estimated time until highlights are ready
5. **Given** a user shares an interview, **When** they select sharing options, **Then** they can choose to share the full version or highlights

---

### User Story 18 - View Linked Objects During Interview Playback (Priority: P2)

A user watches an interview where their uncle discusses his military service. At the 12-minute mark, an overlay appears: "View discharge papers mentioned in this segment?" They tap yes, the video pauses, and they view the uploaded document before resuming the interview.

**Note**: This feature uses the same attached materials from User Story 2, but with timestamp metadata added. When materials are attached to an interview with specific timestamps, they become "interactive object overlays" during playback. This is not a separate type of content - it's simply the same attached materials with timestamp information to enable interactive viewing.

**Why this priority**: Interactive object overlays create rich, multimedia experiences and increase engagement with content. Important for content depth but depends on associated objects existing.

**Independent Test**: Can be tested by watching an interview with linked objects, receiving overlay prompts, viewing objects, and resuming playback. Delivers value through contextual, interactive storytelling.

**Acceptance Scenarios**:

1. **Given** an interview has attached materials with timestamps, **When** playback reaches that timestamp, **Then** an overlay prompt appears offering to view the attached material
2. **Given** an overlay prompt appears, **When** the user taps "View", **Then** the video pauses and the attached material is displayed with its narration
3. **Given** a user is viewing an object overlay, **When** they finish, **Then** they can tap "Resume" to continue the interview from where it paused
4. **Given** a user attaches materials to an interview, **When** adding the attachment, **Then** they can specify the timestamp or let AI suggest it based on content analysis
5. **Given** multiple materials are attached to one interview with timestamps, **When** a user views the interview timeline, **Then** they see markers indicating where object overlays will appear
6. **Given** a user doesn't want interruptions, **When** they start an interview, **Then** they can toggle object overlays on or off

---

### Edge Cases

- What happens when a user's device runs out of storage during recording?
- How does the system handle very large files (multiple hours of high-quality video)?
- What happens if a user loses internet connection during upload?
- How are conflicts resolved when multiple family members edit the same story?
- What happens when the backend is unavailable or experiencing issues?
- How does the app handle videos in different formats or aspect ratios?
- What happens when a user tries to attach files that are too large or in unsupported formats?
- What happens if a user submits multiple reports for the same story?
- How does the system handle false or malicious content reports?
- What happens when the AI processing fails or produces poor quality metadata?
- How are duplicate uploads prevented if a user uploads the same video multiple times?
- What happens when location data is unavailable or inaccurate?
- How does the app handle users who revoke permissions (camera, microphone, location)?
- What happens when a user at 100% quota attempts to upload while online?
- How does quota usage update when users delete stories?
- What happens when a paid member's subscription expires and their usage exceeds free tier quota?
- How does the system determine which videos are "over quota" when membership is downgraded?
- What happens to stories that were public or family-only before being auto-privated due to quota exceeded?
- What happens when a tutorial video fails to load or stream?
- How does the app handle interrupted tutorial viewing (app backgrounded, device locked)?
- What happens when guided interview mode receives unclear speech or multiple speakers talking simultaneously?
- How does guided mode handle very long pauses during recording?
- What happens when the AI fails to generate follow-up questions during guided interview?
- How does the app handle network disconnection during tutorial streaming?
- What happens when a user skips all suggested questions in guided mode?
- What happens when a user uploads a family object without recording audio narration?
- How does the app handle very large photo or document files for family objects?
- What happens if audio narration recording fails or has poor quality for a family object?
- How are family objects displayed differently from interview stories in the library?
- What happens when a user tries to upload an unsupported file type as a family object?
- How does the app handle AI face detection failures when tagging people in photos?
- What happens when a user tags the same person multiple times in one photo?
- How does the system handle very large family trees (hundreds of people)?
- What happens when AI suggests an incorrect person match for the family tree?
- How are duplicate notifications prevented when a user lingers near a story location?
- What happens when the Griot cannot find any sources for a user's question?
- How does the system generate highlights when an interview has no clear key moments?
- What happens when object timestamps conflict with interview duration?
- How does the app handle multiple object overlays appearing at the same timestamp?
- What happens when a user tries to link the same content to multiple people in the family tree?
- How does location-based notification respect user privacy when location data is sensitive?

## Requirements *(mandatory)*

### Functional Requirements

#### Recording & Capture
- **FR-001**: System MUST allow users to record video with audio on Android and iOS devices
- **FR-002**: System MUST support pause and resume functionality during video recording
- **FR-003**: System MUST allow users to select between low quality and high quality recording options
- **FR-004**: System MUST save recordings locally if no internet connection is available
- **FR-005**: System MUST handle interruptions during recording (incoming calls, notifications) gracefully
- **FR-006-NEW**: System MUST support video recordings up to 60 minutes in duration
- **FR-007-NEW**: System MUST display recording time remaining to user during recording
- **FR-008-NEW**: System MUST warn user when approaching the 60-minute recording limit

#### Editing
- **FR-009**: System MUST allow users to trim video content (remove beginning/end sections)
- **FR-010**: System MUST allow users to cut sections from the middle of videos
- **FR-011**: System MUST allow users to stitch multiple video clips together
- **FR-012**: System MUST provide automatic AI-powered audio enhancement including noise reduction, volume normalization, and clarity improvement
- **FR-013**: System MUST allow users to manually toggle audio enhancement on or off
- **FR-014**: System MUST allow users to preview edited videos before uploading

#### Family Object Upload
- **FR-015**: System MUST provide a separate "Upload Family Object" flow distinct from interview recording
- **FR-016**: System MUST allow users to upload photos as family objects
- **FR-017**: System MUST allow users to upload documents (PDF, Word) as family objects
- **FR-018**: System MUST allow users to upload videos as family objects
- **FR-019**: System MUST support common photo formats (JPEG, PNG, HEIC) for family object uploads
- **FR-020**: System MUST support common document formats (PDF, DOC, DOCX) for family object uploads
- **FR-021**: System MUST support common video formats (MP4, MOV) for family object uploads
- **FR-022**: System MUST prompt users to record audio narration after selecting a family object to upload
- **FR-023**: System MUST support pause and resume functionality during audio narration recording
- **FR-024**: System MUST allow users to review and re-record audio narration before uploading
- **FR-025**: System MUST associate audio narration file with the uploaded family object
- **FR-026**: System MUST apply the same privacy controls (Public, Family Only, Private) to family objects as interview stories
- **FR-027**: System MUST set family objects to "Public" privacy by default with clear options to change
- **FR-028**: System MUST save family objects locally if no internet connection is available and queue for upload when online
- **FR-029**: System MUST allow users to select quality settings for video family objects (low or high quality)
- **FR-030**: System MUST display family objects in the family library alongside interview stories with distinct visual indicators
- **FR-031**: System MUST automatically play audio narration when user views a family object
- **FR-032**: System MUST display the object (photo/document/video) with audio narration playback controls
- **FR-033**: System MUST count family object uploads toward user's storage quota
- **FR-034**: System MUST encrypt family objects and audio narration in transit and at rest

#### Attachments
- **FR-035**: System MUST allow users to attach photos to recorded stories (photos can be uploaded directly as attachments or selected from existing Family Objects)
- **FR-036**: System MUST allow users to attach additional videos to stories (videos can be uploaded directly as attachments or selected from existing Family Objects)
- **FR-037**: System MUST allow users to attach documents (PDF, Word) to stories (documents can be uploaded directly as attachments or selected from existing Family Objects)
- **FR-038**: System MUST associate all attached materials with the primary story while preserving the independence of Family Objects that are referenced
- **FR-038a**: System MUST allow users to optionally specify timestamps when attaching materials to interviews (this enables interactive object overlays during playback as described in FR-201 to FR-210)
- **FR-038b**: System MUST allow Family Objects to be attached to multiple interviews while maintaining a single source of truth for the Family Object's metadata and privacy settings

#### Upload & Sync
- **FR-039**: System MUST upload recorded videos to the Griot and Grits backend for processing
- **FR-040**: System MUST automatically chunk large video files based on file size for reliable upload
- **FR-041**: System MUST maintain story unity by linking all chunks to the same story record for backend reconstruction
- **FR-042**: System MUST encrypt all video files, photos, and documents in transit during upload using secure protocols
- **FR-043**: System MUST encrypt all content at rest in local storage
- **FR-044**: System MUST queue videos for upload when offline and automatically upload when connection is restored
- **FR-045**: System MUST support both low and high quality video uploads based on user selection
- **FR-046**: System MUST show upload progress and status to users for each chunk
- **FR-047**: System MUST handle failed uploads with retry capability per chunk
- **FR-048**: System MUST set uploaded stories to "Public" privacy by default
- **FR-049**: System MUST display clear privacy setting options (Public, Family Only, Private) during upload with explanations

#### Content Viewing
- **FR-050**: System MUST display a social discovery feed with endless scrolling of public stories
- **FR-051**: System MUST automatically load more stories as user scrolls in the discovery feed
- **FR-052**: System MUST allow users to like stories in the discovery feed
- **FR-053**: System MUST provide feed sort options: "Recent" (chronological newest first) and "For You" (personalized recommendations)
- **FR-053a**: System MUST display stories in chronological order (newest first) for new users with no engagement history
- **FR-053b**: System MUST progressively enable personalized recommendations in "For You" mode as users like stories
- **FR-053c**: System MUST allow users to switch between "Recent" and "For You" sort modes at any time
- **FR-054**: System MUST allow users to mark stories as favorites
- **FR-055**: System MUST provide a favorites filter to view only favorited stories
- **FR-056**: System MUST display separate views for "Recent", "For You", and "Favorites"
- **FR-057**: System MUST display user's family stories separately from the public discovery feed
- **FR-058**: System MUST display user's uploaded stories with thumbnails and titles
- **FR-059**: System MUST show AI-generated tags and metadata for processed stories
- **FR-060**: System MUST display AI-enriched content alongside original videos
- **FR-061**: System MUST provide video playback functionality
- **FR-062**: System MUST seamlessly play multi-chunk videos as a single continuous story after backend reconstruction
- **FR-063**: System MUST display attached photos, videos, and documents with each story
- **FR-064**: System MUST show privacy indicators (Public, Family Only, Private) on stories in family library
- **FR-065**: System MUST display family objects with distinct visual indicators from interview stories

#### Search & Discovery
- **FR-066**: System MUST allow users to search stories by topic keywords
- **FR-067**: System MUST allow users to search stories by people's names
- **FR-068**: System MUST allow users to search stories by places/locations
- **FR-069**: System MUST display relevant search results based on AI-generated metadata
- **FR-070**: System MUST highlight or provide context for search terms in results
- **FR-071**: System MUST include family objects in search results when relevant

#### Location & Map Navigation
- **FR-072**: System MUST allow users to optionally enable automatic GPS location capture during recording
- **FR-073**: System MUST allow users to manually tag location by searching for place names or addresses
- **FR-074**: System MUST allow users to add or edit location information after recording
- **FR-075**: System MUST not require location data for story upload
- **FR-076**: System MUST request location permission only when user attempts to use location features
- **FR-077**: System MUST display a map view showing story locations
- **FR-078**: System MUST place markers on the map for each story with location data
- **FR-079**: System MUST allow users to select map markers to view associated stories
- **FR-080**: System MUST support zoom and pan interactions on the map
- **FR-081**: System MUST handle multiple stories at the same location
- **FR-082**: System MUST allow users to remove location data from stories
- **FR-083**: System MUST allow users to tag family objects with location data

#### Privacy & Sharing
- **FR-084**: System MUST allow users to change story privacy from Public to Family Only or Private
- **FR-085**: System MUST allow users to change story privacy from Family Only to Public or Private
- **FR-086**: System MUST allow users to change story privacy from Private to Public or Family Only
- **FR-087**: System MUST provide clear explanations of what each privacy level means when selected
- **FR-088**: System MUST enforce privacy controls so Public stories appear in discovery feed
- **FR-089**: System MUST enforce privacy controls so Family Only stories only appear to family members
- **FR-090**: System MUST enforce privacy controls so Private stories only appear to the story owner
- **FR-091**: System MUST allow users to send family group invitations to other users by email or username
- **FR-092**: System MUST require invited users to explicitly accept family group invitations before joining
- **FR-093**: System MUST allow users to view pending sent and received family group invitations
- **FR-094**: System MUST allow users to cancel sent invitations or decline received invitations
- **FR-095**: System MUST apply the same privacy controls to family objects as interview stories

#### Content Moderation
- **FR-096**: System MUST provide a "Report" button on all public stories
- **FR-097**: System MUST require users to select a reason when reporting content (spam, harassment, inappropriate, other)
- **FR-098**: System MUST allow users to optionally hide reported content from their own feed
- **FR-099**: System MUST provide confirmation with a unique tracking ID when a report is submitted
- **FR-100**: System MUST allow users to check the status of their submitted reports using the tracking ID
- **FR-101**: System MUST keep reported content visible to other users unless removed by backend moderation
- **FR-102**: System MUST allow reporting of family objects in the same way as interview stories

#### Ask the Griot
- **FR-103**: System MUST provide a conversational chatbot interface called "Ask the Griot"
- **FR-104**: Ask the Griot MUST answer questions based on user's uploaded family stories
- **FR-105**: Ask the Griot MUST provide general historical context when relevant
- **FR-106**: Ask the Griot MUST cite or link to specific stories when referencing them
- **FR-107**: Ask the Griot MUST synthesize information across multiple stories
- **FR-108**: Ask the Griot MUST handle questions when no relevant family content exists
- **FR-109**: Ask the Griot MUST include family objects in responses when relevant to questions asked

#### Authentication & User Management
- **FR-110**: System MUST support user registration and login with email and password
- **FR-111**: System MUST support optional social login via Google Sign-In
- **FR-112**: System MUST support optional social login via Apple Sign-In (required for iOS)
- **FR-113**: System MUST support optional social login via Facebook
- **FR-114**: System MUST allow users to link multiple authentication methods to the same account
- **FR-115**: System MUST provide password reset functionality via email
- **FR-116**: System MUST enforce secure password requirements (minimum length, complexity)

#### Storage & Quota Management
- **FR-117**: System MUST track and display user's current storage quota usage
- **FR-118**: System MUST warn users when they reach 80% of their storage quota
- **FR-119**: System MUST allow users to record content offline when at 100% quota
- **FR-120**: System MUST prevent upload of new content when user is at 100% quota until space is freed
- **FR-121**: System MUST provide interface for users to view all their stories with storage size information
- **FR-122**: System MUST allow users to delete their own stories to free up quota
- **FR-123**: System MUST support different quota tiers for free members and paid members
- **FR-124**: System MUST clearly display current quota limit and available upgrade options
- **FR-125**: System MUST NOT delete any user content when membership is downgraded and usage exceeds new quota limit
- **FR-126**: System MUST prevent new uploads when user has downgraded membership and is over new quota limit
- **FR-127**: System MUST automatically change privacy of over-quota stories to Private based on latest upload date (newest stories over quota are privated first)
- **FR-128**: System MUST store original privacy settings (Public, Family Only, or Private) of stories that were auto-privated due to quota exceeded
- **FR-129**: System MUST automatically restore original privacy settings when user upgrades membership and is back within quota limits
- **FR-130**: System MUST clearly indicate to users which stories have been auto-privated due to quota exceeded
- **FR-131**: System MUST count family object uploads (including object file and audio narration) toward storage quota

#### Tutorials & Education
- **FR-132**: System MUST provide a tutorial library accessible from the app
- **FR-133**: System MUST organize tutorials into categories (recording basics, interview techniques, app features, being a Griot)
- **FR-134**: System MUST support video playback for tutorial content with standard controls (play, pause, seek)
- **FR-135**: System MUST track tutorial viewing progress and allow users to resume from where they left off
- **FR-136**: System MUST mark tutorials as completed when users finish watching them
- **FR-137**: System MUST display tutorial completion status in the library
- **FR-138**: System MUST prompt new users to watch getting started tutorial after completing onboarding
- **FR-139**: System MUST allow users to replay completed tutorials

#### Guided Interview Mode
- **FR-140**: System MUST provide a guided interview mode that can be enabled during recording
- **FR-141**: System MUST display suggested starter questions organized by topic when guided mode is activated
- **FR-142**: System MUST include starter question topics for childhood, family origins, significant events, and cultural traditions
- **FR-143**: System MUST allow users to select a starter question to begin recording
- **FR-144**: System MUST use real-time speech recognition to analyze interview content during recording
- **FR-145**: System MUST maintain local database of template questions organized by keywords and topic categories
- **FR-146**: System MUST match detected keywords/topics from speech recognition against local template database for immediate question suggestions
- **FR-147**: System MUST display follow-up question suggestions in real-time during guided interview using local template matching
- **FR-148**: System MUST send speech transcription to backend for AI-enhanced question generation when connectivity is available
- **FR-149**: System MUST supplement local template suggestions with AI-generated contextually relevant questions when backend responds
- **FR-150**: System MUST gracefully degrade to template-only suggestions when backend is unavailable during guided interview
- **FR-151**: System MUST allow users to queue suggested questions for asking after current response concludes
- **FR-152**: System MUST allow users to dismiss suggestions and record freely in guided mode
- **FR-153**: System MUST allow users to toggle question suggestions on or off at any time during recording
- **FR-154**: System MUST track which suggested questions were covered and which were skipped during interview session
- **FR-155**: System MUST display interview session summary showing covered and skipped questions after recording completes
- **FR-156**: System MUST indicate to users whether suggestions are template-based or AI-enhanced (when connectivity allows)

#### Photo Tagging & Multiple Narrations
- **FR-157**: System MUST allow users to tag people in photos by tapping on faces
- **FR-158**: System MUST support tagging multiple people in a single photo
- **FR-159**: System MUST allow users to record separate audio narrations for each tagged person in a photo
- **FR-160**: System MUST associate each narration with the specific tagged person
- **FR-161**: System MUST display tagged people's names when viewing a photo
- **FR-162**: System MUST allow users to play narrations for individual tagged people
- **FR-163**: System MUST provide navigation between multiple narrations for the same photo
- **FR-164**: System MUST include tagged people in search results
- **FR-165**: System MUST allow users to edit or remove person tags from photos
- **FR-166**: System MUST use AI-powered face detection to suggest tag locations (optional user assistance)

#### Interactive Family Tree
- **FR-167**: System MUST provide an interactive family tree visualization
- **FR-168**: System MUST allow users to add people to the family tree with name and birth date
- **FR-169**: System MUST allow users to define relationships between family members (parent, child, sibling, spouse)
- **FR-170**: System MUST display the family tree with visual representation of relationships across multiple generations
- **FR-171**: System MUST support zoom and pan interactions on the family tree
- **FR-172**: System MUST allow users to link interviews to specific people in the family tree
- **FR-173**: System MUST allow users to link family objects to specific people in the family tree
- **FR-174**: System MUST display all linked content when a user selects a person in the tree
- **FR-175**: System MUST allow users to edit family member details and relationships
- **FR-176**: System MUST allow users to remove people from the family tree
- **FR-177**: System MUST use AI to detect people mentioned in interviews and suggest family tree matches
- **FR-178**: System MUST prompt users to add detected people to the family tree with relationship specification
- **FR-179**: System MUST automatically update the family tree when users confirm AI-suggested person matches
- **FR-180**: System MUST allow the same content to be linked to multiple people in the family tree

#### Location-Based Notifications
- **FR-181**: System MUST support background location monitoring for story notifications
- **FR-182**: System MUST send notifications when users enter areas with associated stories or family objects
- **FR-183**: System MUST indicate the number of stories available at the detected location
- **FR-184**: System MUST open to the relevant story when user taps a location notification
- **FR-185**: System MUST allow users to enable/disable location-based notifications in settings
- **FR-186**: System MUST allow users to set notification distance radius
- **FR-187**: System MUST prevent duplicate notifications for the same content at the same location
- **FR-188**: System MUST respect user privacy by allowing location data deletion and notification opt-out

#### Enhanced Ask the Griot
- **FR-189**: System MUST display source citations for all information provided by Ask the Griot
- **FR-190**: System MUST list specific interviews used as sources with titles and dates
- **FR-191**: System MUST list specific family objects used as sources with descriptions
- **FR-192**: System MUST list external sources (encyclopedias, databases) with source type indicators
- **FR-193**: System MUST make source citations tappable to navigate to the referenced content
- **FR-194**: System MUST clearly indicate which information came from which source when synthesizing multiple sources

#### Interview Highlights
- **FR-195**: System MUST generate condensed highlight versions of interviews using AI
- **FR-196**: System MUST display "Full Interview" and "Highlights" options when viewing processed interviews
- **FR-197**: System MUST allow users to play highlight reels with AI-identified important moments
- **FR-198**: System MUST allow users to jump from highlights to the full interview at that moment
- **FR-199**: System MUST display processing status while highlights are being generated
- **FR-200**: System MUST allow users to share either full interviews or highlights

#### Interactive Object Overlays
**Note**: Interactive object overlays are the playback visualization mechanism for attached materials (FR-035 to FR-038) that have timestamp metadata. These are not separate content types - overlays simply display timestamped attachments during interview playback.

- **FR-201**: System MUST support associating attached materials (photos, videos, documents) with interviews at specific timestamps
- **FR-202**: System MUST allow users to manually specify timestamps when attaching materials to interviews
- **FR-203**: System MUST use AI to suggest optimal timestamps based on content analysis when attaching materials
- **FR-204**: System MUST display overlay prompts when interview playback reaches a timestamp where attached material is associated
- **FR-205**: System MUST pause video playback when user chooses to view an attached material via overlay
- **FR-206**: System MUST display the attached material with its narration in the overlay
- **FR-207**: System MUST allow users to resume interview playback from where it paused after viewing attached material
- **FR-208**: System MUST display timeline markers indicating where attached materials with timestamps will appear during playback
- **FR-209**: System MUST allow users to toggle object overlays on or off for uninterrupted viewing
- **FR-210**: System MUST handle multiple attached materials at the same timestamp by queuing them sequentially

#### Backend Resilience & Offline Support
- **FR-211**: System MUST continue functioning with cached/local content when backend is unavailable
- **FR-212**: System MUST allow users to record videos when backend is unavailable
- **FR-213**: System MUST allow users to view previously cached stories when backend is unavailable
- **FR-214**: System MUST display clear status indicators showing backend connectivity state
- **FR-215**: System MUST prevent upload operations when backend is unavailable and queue them for later
- **FR-216**: System MUST prevent discovery feed refresh when backend is unavailable and display cached content
- **FR-217**: System MUST prevent Ask the Griot queries when backend is unavailable with clear messaging
- **FR-218**: System MUST cache discovery feed content for offline viewing
- **FR-219**: System MUST cache family library content for offline viewing
- **FR-220**: System MUST display last successful sync timestamp to users
- **FR-221**: System MUST automatically attempt backend reconnection at appropriate intervals
- **FR-222**: System MUST resume queued operations when backend connectivity is restored

#### Observability & Monitoring
- **FR-228**: System MUST log key user actions (record, upload, view, share) as structured events with contextual metadata
- **FR-229**: System MUST track operational metrics including upload success rate, upload duration, cache hit rate, and playback errors
- **FR-230**: System MUST support distributed tracing to correlate mobile app events with backend processing for cross-system debugging
- **FR-231**: System MUST include correlation IDs in all backend API requests to enable request tracking across systems
- **FR-232**: System MUST log errors with stack traces, device context (OS version, app version), and user context (anonymized user ID)
- **FR-233**: System MUST capture performance metrics including app launch time, video recording start latency, and UI responsiveness
- **FR-234**: System MUST anonymize personally identifiable information (PII) in logs and metrics before transmission
- **FR-235**: System MUST send structured logs and metrics to analytics backend when connectivity is available
- **FR-236**: System MUST buffer logs and metrics locally when offline and transmit when connection is restored
- **FR-237**: System MUST allow users to opt out of analytics data collection in privacy settings while maintaining error reporting for app stability

#### Platform & Technical
- **FR-238**: System MUST work on latest Android devices and be available in Google Play Store
- **FR-239**: System MUST work on latest iOS devices and be available in Apple App Store
- **FR-240**: System MUST request and handle required permissions (camera, microphone, storage, location, notifications)
- **FR-241**: System MUST require explicit user consent before recording
- **FR-242**: System MUST comply with Apple App Store and Google Play Store privacy requirements

### Key Entities

- **Story**: Represents a recorded family history video, including the primary video file (up to 60 minutes, may be chunked based on file size for upload), recording metadata (date, duration, quality, upload timestamp), processing status, AI-generated tags and enriched content, attached materials, location data, current privacy settings (Public, Family Only, or Private with Public as default), original privacy settings (stored when auto-privated due to quota), auto-privated flag (indicates if privacy was changed due to quota exceeded), chunk information for reconstructing complete videos on backend, like count, favorite status, and encrypted storage state

- **User**: Represents an individual using the app to record, view, and share family stories, including authentication credentials (email/password or social login providers), linked authentication methods, family associations, uploaded stories, liked stories, favorited stories, feed preferences, membership tier (free or paid), current storage quota usage, and quota limit based on membership tier

- **Attachment**: Represents supporting materials associated with a story, including photos, additional video clips, and documents (PDF, Word), with file metadata, association to parent story, optional timestamp metadata (for interactive playback overlays), and encryption status. When attachments have timestamps, they enable interactive object overlays during interview playback.

- **Location**: Represents optional geographic information associated with stories, including GPS coordinates (if user enabled automatic capture), manually entered place names or addresses, AI-extracted locations from video content (identified during backend processing), map markers for discovery, and user's ability to add/edit/remove location data

- **Family Group**: Represents a collection of related users who share family stories, including member relationships, shared content permissions based on privacy settings, pending invitations, and invitation acceptance status

- **AI Metadata**: Represents processed information extracted from stories, including topic tags, people mentioned, places referenced, dates/events identified, and searchable content

- **Discovery Feed**: Represents the personalized stream of public stories, including ranking algorithm based on user likes, endless scroll position, and story recommendations

- **Like**: Represents a user's positive engagement with a story, used for feed personalization and content recommendations

- **Favorite**: Represents a user's saved story for later viewing, accessible through favorites filter

- **Ask the Griot Session**: Represents conversations with the Ask the Griot chatbot, including questions asked, answers provided, story references cited, and conversational context

- **Content Report**: Represents a user-submitted report of inappropriate content, including the reporting user, reported story, reason category (spam, harassment, inappropriate, other), tracking ID, submission timestamp, moderation status, and whether the reporting user has hidden the content from their feed

- **Tutorial**: Represents educational video content to help users capture family history, including video file, title, description, category (recording basics, interview techniques, app features, being a Griot), duration, and user's viewing progress and completion status

- **Interview Question**: Represents suggested questions for guided interview mode, including question text, topic category (childhood, family origins, significant events, cultural traditions), context triggers (words, topics, or entities that make the question relevant), and question type (starter or follow-up)

- **Guided Interview Session**: Represents a single guided recording session, including enabled status, selected starter question, suggested follow-up questions displayed, questions covered by user, questions skipped, real-time speech recognition data, and session summary

- **Family Object**: Represents an uploaded family artifact (photo, document, or video) with audio narration that exists as standalone content with its own identity and metadata. Can optionally be referenced/attached to interviews while maintaining independence. Includes the object file (with format metadata), audio narration file(s) (can have multiple for different tagged people), upload timestamp, privacy settings (Public, Family Only, or Private with Public as default), original privacy settings (stored when auto-privated due to quota), auto-privated flag, AI-generated tags and metadata, location data, like count, favorite status, encrypted storage state, content type indicator (photo/document/video), tagged people with associated narrations, optional references to interviews where attached (with timestamps for overlay functionality), and family tree member links

- **Person Tag**: Represents a tagged individual in a photo, including tag coordinates (location in image), person's name, link to family tree member (if exists), associated audio narration specific to that person, and AI-suggested tag confidence level

- **Family Tree Member**: Represents an individual in the family tree, including name, birth date, death date (if applicable), relationships to other members (parent, child, sibling, spouse), linked interviews, linked family objects, AI-detected mentions in content, profile photo, and biographical information

- **Family Relationship**: Represents a connection between two family tree members, including relationship type (parent-child, sibling, spouse), confidence level (user-confirmed vs AI-suggested), and date information

- **Location Notification**: Represents a geofenced notification trigger, including location coordinates, notification radius, associated stories or objects, notification text, last triggered timestamp, and user notification preferences

- **Source Citation**: Represents a reference used by Ask the Griot, including source type (interview, family object, external database), source title or description, source date, specific excerpt or timestamp referenced, and navigation link to source content

- **Interview Highlight**: Represents a condensed version of an interview, including source interview reference, AI-selected segments with timestamps, total highlight duration, generation status, and share metadata

- **Object Overlay**: Represents the interactive playback visualization of timestamped attached materials during interview playback. This is not a separate content type - it's the UI/UX mechanism for displaying Attachments that have timestamp metadata. Includes reference to the associated attachment, timestamp in interview, overlay trigger settings, display format, and user interaction history.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can record a video story and start playback within 3 taps from app launch
- **SC-002**: All uploaded content is encrypted in transit using secure protocols with 100% coverage
- **SC-003**: All locally stored content is encrypted at rest with 100% coverage
- **SC-004**: Users can successfully upload recorded videos over varying network conditions (3G, 4G, WiFi) with less than 5% failure rate
- **SC-005**: Offline recordings automatically sync when connection is restored without user intervention in 95% of cases
- **SC-006**: 95% of users understand that stories are public by default based on upload flow clarity
- **SC-007**: Users can change privacy settings in under 3 taps with clear understanding of each option
- **SC-008**: Discovery feed loads initial stories within 2 seconds for 95% of users
- **SC-009**: New stories automatically load in discovery feed as user scrolls with no visible delay
- **SC-010**: Liked stories influence feed content within 5 subsequent story recommendations
- **SC-011**: Users can access favorited stories within 2 taps from main screen
- **SC-012**: Users can locate a specific story through search in under 30 seconds
- **SC-013**: Map view loads and displays all story locations within 3 seconds for collections up to 1000 stories
- **SC-014**: 90% of users successfully complete their first video recording and upload without assistance
- **SC-015**: Ask the Griot provides relevant responses (citing family stories or historical context) to 85% of user questions
- **SC-016**: Users can trim, enhance, and upload a video in under 5 minutes
- **SC-017**: Privacy controls correctly restrict access to Family Only and Private stories in 100% of cases
- **SC-018**: System supports concurrent usage by 10,000 active users without degradation
- **SC-019**: Video playback begins within 2 seconds of selection for 95% of videos
- **SC-020**: App successfully passes Apple App Store and Google Play Store review processes on first submission
- **SC-021**: 70% of users engage with the discovery feed within first session
- **SC-022**: Average session time increases by 40% with introduction of discovery feed compared to family-only viewing
- **SC-023**: Users can record videos up to 60 minutes without errors or data loss
- **SC-024**: Multi-chunk videos play seamlessly without visible breaks after backend reconstruction
- **SC-025**: Users can report inappropriate content and receive tracking confirmation within 5 seconds
- **SC-026**: Users can hide reported content from their feed with immediate effect (content removed from view instantly)
- **SC-027**: Users receive clear warning when reaching 80% storage quota with actionable next steps
- **SC-028**: Users can view their storage usage and manage content to free space within 3 taps
- **SC-029**: Quota usage updates within 10 seconds after user deletes a story
- **SC-030**: When membership is downgraded, zero user content is deleted (100% retention of all stories)
- **SC-031**: Over-quota stories are auto-privated within 30 seconds of membership downgrade
- **SC-032**: Users can clearly identify which stories have been auto-privated in their library
- **SC-033**: When membership is upgraded, original privacy settings are restored within 30 seconds for all auto-privated stories
- **SC-034**: 60% of new users watch at least one tutorial within their first session
- **SC-035**: Tutorial videos load and begin playback within 3 seconds for 95% of users
- **SC-036**: Users can resume tutorial viewing from saved progress with no more than 5 seconds deviation from stop point
- **SC-037**: 40% of users who watch interview technique tutorials subsequently use guided interview mode
- **SC-038**: 50% of users enable guided interview mode when starting their first recording
- **SC-039**: Guided interview mode generates relevant follow-up questions for 80% of identifiable topics mentioned during recording
- **SC-040**: Users find suggested questions helpful in 70% of guided interview sessions (based on usage of suggestions vs dismissal)
- **SC-041**: Stories recorded with guided interview mode are 30% longer on average than stories without guidance
- **SC-042**: Users who use guided mode complete recordings without abandoning 85% of the time (vs 70% baseline)
- **SC-042a**: Template-based question suggestions appear within 1 second of keyword/topic detection during guided interview
- **SC-042b**: AI-enhanced questions supplement template suggestions within 5 seconds when backend connectivity is available
- **SC-042c**: Guided interview mode continues functioning with template-only suggestions when backend is unavailable (100% offline capability)
- **SC-043**: Follow-up question suggestions appear within 3 seconds of relevant topic being mentioned during guided interview
- **SC-044**: Users can upload a family object with audio narration within 5 taps from main screen
- **SC-045**: 30% of users upload at least one family object within their first month
- **SC-046**: Family objects with audio narration receive 40% more engagement (likes, views) than objects without narration
- **SC-047**: Users can clearly distinguish family objects from interview stories in the library
- **SC-048**: Audio narration playback begins within 2 seconds when viewing a family object
- **SC-049**: Family object uploads succeed with less than 5% failure rate across varying network conditions
- **SC-050**: Users can tag a person in a photo and record their narration within 4 taps
- **SC-051**: 40% of photos uploaded have at least one person tagged
- **SC-052**: Photos with multiple narrations receive 50% more views than photos with single narrations
- **SC-053**: Family tree loads and displays up to 100 family members within 3 seconds
- **SC-054**: Users can navigate from a family tree member to their linked stories within 2 taps
- **SC-055**: 60% of users build a family tree with at least 10 members within first 3 months
- **SC-056**: AI person detection in interviews achieves 75% accuracy in suggesting family tree matches
- **SC-057**: Location-based notifications are delivered within 30 seconds of user entering the geofenced area
- **SC-058**: Users engage with location-triggered stories 65% of the time (tap notification to view)
- **SC-059**: Ask the Griot displays source citations for 100% of responses
- **SC-060**: Users tap on source citations to view referenced content in 45% of Ask the Griot interactions
- **SC-061**: Interview highlights are 15-20% of the original interview length on average
- **SC-062**: 70% of users who view highlights subsequently watch portions of the full interview
- **SC-063**: Highlight generation completes within 5 minutes of interview processing completion for 90% of interviews
- **SC-064**: Object overlay prompts appear within 0.5 seconds of reaching the associated timestamp
- **SC-065**: Users engage with object overlays (tap to view) in 55% of presentations
- **SC-066**: Users can resume interview playback after viewing overlay within 2 seconds
- **SC-067**: App continues functioning when backend is unavailable with 100% of core offline features accessible (recording, viewing cached content)
- **SC-068**: Backend connectivity status is displayed to users with updates within 5 seconds of state change
- **SC-069**: Cached discovery feed content allows browsing of at least 50 previously loaded stories when offline
- **SC-070**: Upload operations queued during backend unavailability resume automatically within 30 seconds of connectivity restoration
- **SC-071**: Users can view last successful sync timestamp with accuracy within 1 minute
- **SC-072**: All key user actions (record, upload, view) are captured as structured log events with 100% coverage
- **SC-073**: Critical operational metrics (upload success rate, cache hit rate, error rate) are tracked and transmitted to analytics backend
- **SC-074**: Error logs include sufficient context (stack trace, device info, user journey) to diagnose and reproduce issues in 90% of cases
- **SC-075**: Distributed tracing correlation IDs are included in all backend API requests for end-to-end request tracking

## Assumptions

1. **Backend Service**: Assumes existence of a Griot and Grits backend service that can receive chunked video uploads, reconstruct complete videos from chunks for AI processing, process family objects with audio narration, generate metadata for both interview stories and family objects, return enriched content, and support feed ranking algorithms. Backend API contracts and capabilities are outside scope of mobile app specification.

2. **Authentication**: Users can authenticate via email/password or social login (Google, Apple, Facebook). Users can link multiple auth methods to same account. Apple Sign-In required for iOS per App Store guidelines. Password reset via email link. Secure password requirements enforced.

3. **Family Relationships**: Family groups are formed through invitation-based system where users send invitations and recipients must explicitly accept to join. Users can invite by email or username. Invitation management (pending, accepted, declined, canceled) to be implemented.

4. **Video Processing Time**: Assumes backend AI processing occurs asynchronously and may take minutes to hours depending on video length. Users will be notified when processing completes.

5. **Storage Limits**: Mobile app implements tiered storage quota system with free and paid membership levels. Users receive proactive warnings at 80% quota usage. At 100% quota, users can record offline but cannot upload until space is freed by deleting content. App displays quota usage, allows content management for freeing space, and shows upgrade options. Both interview stories and family objects (including their audio narration) count toward storage quota. When membership is downgraded and usage exceeds new quota, no content is deleted; newest content exceeding quota is automatically changed to Private (original privacy settings stored); new uploads are prevented until quota compliance; upgrading membership restores original privacy settings. Specific quota limits (free vs paid tiers) to be determined based on backend infrastructure capabilities.

6. **Content Moderation**: Assumes backend provides content moderation capabilities for public stories and family objects. Mobile app collects user reports with required reason categories (spam, harassment, inappropriate, other), generates unique tracking IDs, and allows users to track report status. Reported content remains visible to other users unless backend moderation removes it. Users can optionally hide reported content from their own feed immediately. Backend handles review workflow and enforcement.

7. **Map Service**: Assumes integration with standard mobile mapping services (Google Maps for Android, Apple Maps for iOS) for map-based navigation. Location data comes from three sources: optional GPS capture, manual user entry, and AI extraction from video content during backend processing.

8. **Video Formats**: Assumes standard mobile video formats (MP4, MOV) are supported. Specific codec support determined by platform capabilities.

9. **Accessibility**: Assumes standard mobile accessibility features (screen readers, voice control) are supported following platform guidelines.

10. **Localization**: Initial version assumes English language support. Multi-language support may be added in future versions.

11. **Network Requirements**: Assumes users have intermittent network connectivity. App implements graceful degradation when backend is unavailable: users can record videos and view cached content (previously loaded discovery feed stories, family library), but cannot upload new content, refresh discovery feed, or use Ask the Griot. App displays clear connectivity status indicators and last successful sync timestamp. Upload operations are queued when backend unavailable and automatically resume when connectivity is restored. Cache size and retention policy to be determined based on device storage constraints and user experience requirements.

12. **Privacy Compliance**: Assumes backend handles data privacy compliance (GDPR, CCPA). Mobile app implements required consent flows and privacy controls. Public-by-default privacy setting assumes users are informed and consent to public sharing.

13. **Encryption Standards**: Assumes industry-standard encryption protocols (TLS for transit, AES-256 or equivalent for at-rest) are used. Specific encryption implementation to be determined during planning based on platform capabilities and security requirements.

14. **Feed Algorithm**: Assumes backend provides hybrid recommendation system supporting both chronological sorting (newest first) and personalized recommendations based on user likes. New users see chronological feed; personalization progressively improves as engagement data accumulates. Users can toggle between "Recent" (chronological) and "For You" (personalized) modes. Algorithm sophistication and machine learning approach to be determined by backend capabilities.

15. **Privacy Setting Changes**: Assumes stories and family objects can have their privacy changed retroactively and that backend will handle propagation of privacy changes (e.g., removing from public feed when changed to Family Only).

16. **Tutorial Content**: Assumes backend or content delivery network hosts tutorial videos. Tutorial content is curated and produced by Griot and Grits organization. Mobile app streams or downloads tutorial content. Specific tutorial topics and content quality determined by content team.

17. **Speech Recognition for Guided Mode**: Assumes access to real-time speech recognition service (platform-specific APIs like Google Speech-to-Text for Android, Apple Speech Framework for iOS, or cloud service). Speech recognition accuracy depends on audio quality, accents, and background noise. App uses hybrid question generation strategy: maintains local database of template questions organized by keywords/topics for immediate offline suggestions, and optionally sends transcriptions to backend for AI-enhanced contextually relevant questions when connectivity is available. Template database content and organization to be determined during planning. AI question generation uses natural language processing on backend to analyze transcribed speech and generate contextually adaptive follow-up questions.

18. **Family Object File Formats**: Assumes support for common family object formats including photos (JPEG, PNG, HEIC), documents (PDF, DOC, DOCX), and videos (MP4, MOV). Audio narration is recorded in standard audio format (M4A, AAC, or MP3) determined by platform capabilities. File size limits for family objects to be determined based on storage quota constraints and upload performance requirements.

19. **AI Person Detection**: Assumes access to AI-powered face detection and person recognition services for tagging people in photos and matching family tree members. Backend provides person detection in interviews through speech analysis. Accuracy varies based on image quality, audio clarity, and content context. Users can override or confirm all AI suggestions.

20. **Family Tree Data Model**: Assumes family tree supports standard genealogical relationships (parent-child, sibling, spouse) with ability to represent complex family structures. Multiple marriages, adoptions, and step-relationships can be modeled. Tree visualization scales to hundreds of members with performance optimization.

21. **Geolocation Services**: Assumes access to platform location services with background monitoring capability. Location-based notifications require appropriate permissions and respect battery optimization. Geofencing radius configurable by users. Privacy-first approach with user control over location data retention and sharing.

22. **Source Attribution**: Assumes Ask the Griot backend tracks and returns source information for all AI-generated responses. Citations include internal sources (interviews, family objects) and external sources (historical databases, encyclopedias). Citation format and linking capabilities determined by backend implementation.

23. **Highlight Generation**: Assumes backend AI can analyze interview content to identify key moments, important topics, and emotional highlights. Highlight length is typically 15-20% of original duration. Generation time depends on video length and processing queue. Users can regenerate highlights if unsatisfied with initial results.

24. **Object-Interview Linking**: Assumes backend can analyze interview content and attached material metadata to suggest optimal timestamps for interactive overlay associations. Users can manually override AI suggestions. Multiple attached materials can be associated with single interviews at different timestamps. Object overlays are the playback mechanism for timestamped attachments, not a separate content type.

25. **Observability Infrastructure**: Assumes access to analytics and monitoring backend for collecting structured logs, metrics, and distributed traces. Mobile app uses structured event logging with contextual metadata for key user actions (record, upload, view, share). Operational metrics (upload success rate, cache hit rate, error rate, performance timings) tracked and transmitted to backend. Distributed tracing with correlation IDs enables cross-system debugging between mobile app and backend services. All logs and metrics anonymize PII before transmission. Users can opt out of analytics while maintaining error reporting for app stability. Specific observability platform (e.g., Firebase Analytics, Datadog, custom solution) to be determined during planning based on cost, platform support, and privacy requirements.
