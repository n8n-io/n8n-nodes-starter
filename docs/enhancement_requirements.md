# Functional and Non-Functional Requirements

## 1. Functional Requirements (FRs)

The n8n Suno AI node should provide the following functionalities:

### FR1: User Authentication
- **FR1.1:** The system must allow users to authenticate with the Suno AI service using their credentials (email and password).
- **FR1.2:** Authentication status should be managed (e.g., session token stored and used for subsequent API calls). (Currently mocked)

### FR2: Music Generation
- **FR2.1: Generate Song from Text Prompt:**
    - The node must allow users to submit a text prompt.
    - The node should allow specifying additional options (e.g., style, mood, instrumental - to be defined based on Suno API capabilities).
    - The system should initiate a music generation job via the Suno API.
    - The system should return a job identifier and initial status. (Currently mocked job ID and status)
- **FR2.2: Upload Track Reference (for generation):**
    - The node must allow users to specify a file path for an audio track to be used as a reference (e.g., for style transfer or continuation - dependent on Suno API).
    - The system should upload this track and return a reference identifier or initiate a job. (Currently mocked)

### FR3: Job & Track Management
- **FR3.1: Get Track/Job Status:**
    - The node must allow users to query the status of a specific generation job or track using its ID.
    - The system should return the current status (e.g., queued, generating, complete, failed) and progress if available. (Currently mocked with state changes)
- **FR3.2: Download Generated Track:**
    - Once a track is successfully generated, the node must allow users to download the audio file (e.g., MP3, WAV - dependent on Suno API).
    - The system should provide the audio data as a binary output. (Currently mocked with dummy binary data)
- **FR3.3: List Previous Songs:**
    - The node must allow users to retrieve a list of their previously generated songs.
    - The system should return track details (e.g., ID, title, status, URLs). (Currently mocked)

### FR4: Workflow Triggers
- **FR4.1: Trigger on Track Generation Complete:**
    - The system must provide a trigger that activates when a specific music generation job/track is complete.
    - The trigger should output details of the completed track. (Currently mocked polling)
- **FR4.2: Trigger on New Song Available:**
    - The system must provide a trigger that activates when a new song becomes available in the user's Suno AI library.
    - The trigger should output details of the new song(s). (Currently mocked polling, needs robust new song detection)

### FR5: (Placeholder) Other Suno API Features
- (e.g., Select Voice/Style - `selectVoice` is a placeholder in `sunoApi.ts`) - to be defined if Suno API supports these as distinct actions relevant to the n8n node.

## 2. Non-Functional Requirements (NFRs)

### NFR1: Reliability
- **NFR1.1:** All API interactions must include robust error handling.
- **NFR1.2:** Clear and informative error messages should be provided to the n8n user in case of failures.
- **NFR1.3:** Polling triggers should be fault-tolerant (e.g., handle temporary API unavailability gracefully).
- **NFR1.4:** The node should correctly manage authentication state and attempt re-authentication or token refresh if necessary and feasible (actual mechanism TBD based on Suno API).

### NFR2: Maintainability
- **NFR2.1:** Code must be clean, well-organized, and follow established TypeScript best practices. Module separation should be preserved.
- **NFR2.2:** Comprehensive JSDoc comments for all functions, classes, interfaces, and type properties.
- **NFR2.3:** The `docs/dev-log.md` should be kept up-to-date with significant decisions and progress.
- **NFR2.4:** Configuration and magic strings should be minimized, using constants or configuration variables where appropriate.

### NFR3: Usability (n8n User Experience)
- **NFR3.1:** Node parameters should be clearly named and described in the n8n UI.
- **NFR3.2:** Operations should be logically grouped and named.
- **NFR3.3:** Output data from node operations and triggers should be well-structured and useful for downstream n8n nodes.
- **NFR3.4:** Placeholder text and default values for node parameters should be helpful.

### NFR4: Performance
- **NFR4.1:** API calls should be made efficiently. Avoid unnecessary calls. (Dependent on actual Suno API structure).
- **NFR4.2:** Mocked API calls (current state) should be lightweight and fast to not hinder development or testing.
- **NFR4.3:** For operations involving file handling (e.g., download, upload reference), streams should be considered if the actual API supports them and files can be large, to manage memory efficiently.

### NFR5: Testability
- **NFR5.1:** Code should be structured to facilitate unit and integration testing.
- **NFR5.2:** Key logic, especially in `utils/sunoApi.ts` (once it targets a real API), should have good test coverage.
- **NFR5.3:** The existing `tests/checkEndpoints.ts` should be expanded or replaced by a proper test suite.

### NFR6: Security
- **NFR6.1:** Credentials must be handled securely as per n8n standards.
- **NFR6.2:** No sensitive information should be inadvertently logged (e.g., full tokens, passwords after initial use).
