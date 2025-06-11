# Enhancement Roadmap

This document outlines a high-level roadmap for enhancing the n8n-nodes-suno-ai project, focusing on moving from the current mocked implementation to a production-ready node.

## Guiding Principles
- Address Non-Functional Requirements (NFRs) outlined in `docs/enhancement_requirements.md`.
- Iteratively replace mocked components with real API integrations.
- Prioritize a stable and reliable core feature set.
- Continuously improve code quality and test coverage.

## Proposed Milestones

### Milestone 1: Solidify Mock Implementation & Core Structure (Current Phase After This)
*   **Goal:** Ensure the current mocked implementation is robust, well-documented, and all planned mock features are complete. Address immediate structural issues.
*   **Key Tasks:**
    *   **Done:** Populate `interfaces/SunoTypes.ts`.
    *   **Pending:** Verify and remove `HttpBinApi.credentials.ts`.
    *   **Pending:** Refactor `console.log` usage to a more structured approach or remove where appropriate (especially in `utils/sunoApi.ts` and trigger nodes).
    *   **Pending:** Ensure all mocked API functions in `utils/sunoApi.ts` correctly use and return types from `SunoTypes.ts`.
    *   **Pending:** Enhance `tests/checkEndpoints.ts` to cover all mocked functionalities and provide clearer success/failure reporting.
    *   **Documentation:** Ensure JSDoc comments are complete for all modules. Update `dev-log.md` consistently.

### Milestone 2: Real API Integration - Authentication & Basic Read Operations
*   **Goal:** Implement real authentication against the Suno API and integrate simple read-only operations.
*   **Key Tasks:**
    *   **Authentication Research (Actual):** Perform the detailed API investigation previously simulated (Phase 3 of original issue). Document actual auth endpoints, request/response formats, token/cookie handling, refresh mechanisms. Update `docs/dev-log.md`.
    *   **Implement Real `loginWithCredentials`:** Update `utils/sunoApi.ts` and `SunoApi.credentials.ts` to use the actual Suno login mechanism. Securely handle tokens/session data.
    *   **Implement Real `listPreviousSongs`:** Connect this to the actual Suno API endpoint. Handle actual data parsing and error responses.
    *   **Implement Real `isAuthenticated` / `refreshSessionIfExpired`:** Based on actual API behavior.
    *   **Testing:** Add basic integration tests for login and listing songs with test credentials (if possible without cost).
    *   **Documentation:** Update API interaction details in `docs/dev-log.md`.

### Milestone 3: Real API Integration - Core Generation & Management Features
*   **Goal:** Implement the core music generation and management features using the real Suno API.
*   **Key Tasks:**
    *   **Implement Real `submitPrompt`:** Connect to the actual endpoint. Handle prompt options and API responses (job ID, initial status).
    *   **Implement Real `pollJobStatus`:** Connect to the actual endpoint. Handle different job statuses and potential errors.
    *   **Implement Real `downloadTrack`:** Connect to the actual endpoint. Handle binary data correctly.
    *   **(If Applicable) Implement Real `uploadReferenceTrack`:** Based on Suno API capabilities.
    *   **Error Handling:** Implement comprehensive error handling for all API calls as per NFR1.
    *   **Node Logic:** Ensure `Suno.node.ts` correctly processes real API responses and errors.
    *   **Testing:** Expand integration tests for these core features.

### Milestone 4: Real API Integration - Triggers & Advanced Features
*   **Goal:** Implement robust triggers with real API data and any other advanced features.
*   **Key Tasks:**
    *   **Refine `SunoTrigger.node.ts` for `trackGenerationComplete`:** Use real `pollJobStatus`. Implement robust state management to prevent re-triggering for already processed completed tracks (e.g., storing emitted job/track IDs within trigger state or using a small local cache if appropriate for n8n trigger lifecycle).
    *   **Refine `SunoTrigger.node.ts` for `newSongAvailable`:** Use real `listPreviousSongs`. Implement robust state management for detecting genuinely new songs (e.g., comparing against a list of previously seen song IDs from the last poll).
    *   **Input Validation:** Add comprehensive input validation for all node parameters in `Suno.node.ts` and `SunoTrigger.node.ts`.
    *   **(If Applicable) Implement other API features** identified (e.g., `selectVoice`).
    *   **Testing:** Add tests for trigger logic (might require more advanced test setups).

### Milestone 5: Refinement, Testing, and Release Preparation
*   **Goal:** Polish the node, ensure comprehensive testing, and prepare for a potential "release" or wider use.
*   **Key Tasks:**
    *   **Code Review & Refactoring:** Perform a full code review against NFRs (Maintainability, Reliability, Performance).
    *   **Comprehensive Testing:**
        *   Expand unit tests for utility functions and complex logic.
        *   Ensure integration tests cover all operations and triggers with various scenarios.
        *   Perform end-to-end testing within n8n.
    *   **Documentation Review:** Ensure all user-facing descriptions (node properties, operations) are clear and accurate. Finalize `README.md` for the node.
    *   **Performance Optimization:** Based on testing, identify and address any performance bottlenecks if the actual API is slow.
    *   **Finalize `README.md` and other documentation.** (e.g., user guide snippets).

## Future Considerations (Post-Milestone 5)
*   OAuth 2.0 authentication if Suno API supports it.
*   Support for more advanced Suno API features as they become available.
*   Community feedback and feature requests.
