# PingX: A Provider-Based Web Platform for Integrated Social Communication, AI Assistance, and Product Comparison

## Author Information

**Authors:** Mohit & Raman  
**Department:** [Information Required]  
**University/College:** Final Year Engineering Major Project; institution name [Information Required]  
**City, Country:** [Information Required]  
**Academic Year:** 2026  

## Abstract

Contemporary users frequently move between separate applications for interpersonal communication, conversational assistance, product discovery, price comparison, reminders, and notifications. This project presents PingX, a browser-based prototype that integrates these activities into a unified interaction space. The implemented system combines a React frontend, provider-based application state, an optional Express and Socket.IO development server, browser local storage, a static product catalogue, and an AI assistant with two operating modes. When a Gemini API key is configured, the assistant forwards text and image requests to the configured Gemini generation endpoint; otherwise, a regular-expression and keyword-based local fallback produces responses. The platform provides direct and group chat, optimistic message updates, media previews, reactions, reminders, product filtering and comparison, watchlist actions, price-watch notifications, profiles, themes, and focus-mode controls. The development server exposes REST endpoints for identity, friend requests, chats, products, AI proxying, and comparison, although several frontend flows remain local and the product database is empty. Functional inspection and a successful Vite production build demonstrate that the implemented prototype is structurally operational. No formal dataset, accuracy measurement, response-time benchmark, or controlled user study was supplied; therefore, quantitative effectiveness is not claimed. The principal contribution is an integrated, extensible prototype architecture that demonstrates how communication, AI interaction, product comparison, and contextual notifications can be composed while making the boundaries between implemented functionality and future production work explicit.

**Keywords:** web application, social communication, React, conversational AI, product comparison, Socket.IO, local persistence, human-computer interaction

## 1. Introduction

Digital interaction is increasingly distributed across specialized services. A user may communicate in a messaging application, ask questions in an AI assistant, compare products on a marketplace, and manage reminders in a separate notification tool. This separation creates context switching, repeated data entry, and fragmented activity history. The problem is particularly visible in workflows that connect communication with action: a group discussion may lead to a product decision, a product search may lead to a price reminder, and a message may require a later follow-up. Traditional single-purpose applications handle each activity effectively within its own boundary, but provide limited continuity across these related tasks.

The importance of this problem is not only convenience. Fragmented interaction can increase cognitive load and make it difficult to preserve context. In a communication setting, users must copy links or product details between applications. In a shopping setting, users may compare offers manually and may not have an integrated way to notify themselves or collaborators. In an assistance setting, an AI response may not be connected to the conversation or action that motivated the question. A unified interface can reduce these transitions, provided that the integration does not obscure the boundaries of the underlying services or overstate the intelligence and reliability of the system.

PingX was developed as a final-year engineering project to explore this integration problem. The system, identified in its creator configuration as a real-time social chat and smart AI discovery platform, presents a dashboard, direct and group messaging, an AI Studio, a Smart Shop, a Pings and reminders view, user profiles, settings, and a UI showcase. The implementation uses a provider-driven React architecture and supports an optional local backend. It is important to characterize PingX accurately: it is a feature-rich interactive prototype with mock data and development-oriented persistence, not a production marketplace, a custom-trained machine-learning system, or a verified end-to-end encrypted messenger.

The main contributions of this project are as follows:

1. An integrated browser workflow joining social chat, AI assistance, product comparison, and contextual pings.
2. A modular React Context architecture that separates authentication, chat, AI, shopping, pings, themes, and toast state.
3. A dual-mode AI interaction design combining an optional external generative model with a deterministic local fallback.
4. A development server scaffold that demonstrates REST-based operations and Socket.IO message broadcasting.
5. A transparent evaluation boundary that distinguishes functional implementation from measurements not collected by the project.

The remainder of this paper defines the problem, reviews related work, describes the proposed system and methodology, reports implementation and evaluation evidence, and discusses limitations and future development.

## 2. Problem Statement

The project addresses the following problem:

> How can a web application provide a coherent workflow for social communication, conversational assistance, product comparison, and reminder-oriented notifications while maintaining modular state management and a usable interface?

The problem includes four technical subproblems. First, information from different interaction modes must be represented within one application without coupling every component directly to every other component. Second, chat actions such as sending messages, attaching media, reacting, and creating reminders must produce immediate and understandable interface feedback. Third, product discovery must support search, filtering, sorting, comparison, and price-watch actions using the data available to the prototype. Fourth, AI interaction must remain usable when an external model is unavailable, while clearly separating generated assistance from deterministic fallback behavior.

The implemented project does not claim to solve live price aggregation, secure consumer authentication, persistent scheduled monitoring, or validated AI accuracy. Those are separate production and research problems identified for future work.

## 3. Objectives

The technical objectives of PingX are:

1. To implement a responsive web interface for navigating communication, AI, shopping, pings, profile, and settings modules.
2. To support direct and group conversations with local message state and optional REST and Socket.IO communication.
3. To provide an AI interaction surface for text prompts and image-based requests through an optional Gemini integration and a local fallback.
4. To implement product search, category filtering, sorting, offer comparison, cheapest-offer calculation, watchlist interaction, and external merchant links using the available catalogue.
5. To connect reminders and price-watch actions to a common pings interface containing social, AI, reminder, and price-alert items.
6. To preserve selected account, chat, theme, and friend-request state in browser local storage and selected server state in the development server’s local state mechanism.
7. To expose the implementation limitations and unmeasured outcomes that must be addressed before production deployment.

## 4. Literature Review

### 4.1 Integrated digital workflows

Human-computer interaction research has long treated usability as more than the presence of individual functions. Nielsen describes usability through qualities including learnability, efficiency, memorability, error prevention, and user satisfaction [1]. These qualities are relevant to an integrated application because adding functions can also add navigation and interpretation costs. PingX therefore organizes related actions into a dashboard and module views rather than presenting independent tools without a common entry point. The implementation includes a sidebar and command-palette-oriented navigation, which supports access to chats, pings, shopping, and AI from a shared shell.

The integration objective also relates to the design of information systems that preserve task context. A user moving from discussion to product comparison should not need to reconstruct the reason for the action. PingX addresses this at the interface level through chat reminders, product price-watch pings, and links from pings into chat or shop views. This is a workflow composition approach rather than a new algorithm for social recommendation.

### 4.2 Conversational and multimodal AI

Recent generative AI systems make it possible to expose language and image interaction through relatively small application clients. In PingX, the application delegates optional generation to the configured Gemini endpoint and includes a local keyword-based fallback. The fallback is deliberately understood as a compatibility mechanism, not as a machine-learning model. It matches categories such as greetings, identity questions, shopping or price requests, and image-analysis requests using regular expressions and predefined responses.

The distinction is important in relation to evaluation. A generative model can produce fluent but non-deterministic responses, while a rule-based fallback is predictable but narrow. Without a labelled prompt set, task-level metric, human rating protocol, or response-time instrumentation, it is not valid to state that either mode is accurate or superior. The project’s contribution is the integration pattern and graceful degradation behavior, not a trained model or a benchmarked AI method.

### 4.3 Product recommendation and comparison

Recommendation-system research distinguishes content-based, collaborative, and hybrid approaches. Adomavicius and Tuzhilin identify the movement toward richer contextual and hybrid recommendation systems and discuss limitations of earlier approaches [2]. Ricci, Rokach, and Shapira provide a broad treatment of recommender-system techniques and evaluation practices [3]. PingX does not implement a recommender model, collaborative filtering, user embeddings, or learned ranking. Its shopping module performs application-level operations over static product data: search, category filtering, sorting by match, price, rating, or discount, and comparison of marketplace offers.

This approach is suitable for a demonstrator because it makes the comparison workflow visible without requiring a training corpus. It also exposes a research gap between interface-level comparison and real market intelligence. The current system has no merchant scraper, live marketplace API, price history, checkout integration, or live synchronization. Thus, its product results should be interpreted as catalogue demonstrations rather than current market claims.

### 4.4 Web and real-time software architecture

The server follows a conventional web application separation in which a browser client communicates with HTTP endpoints and a real-time channel. Fielding’s dissertation describes the Representational State Transfer architectural style and the constraints associated with networked applications [4]. PingX uses REST-like Express endpoints for operations including authentication, friend requests, chats, products, AI proxying, and comparison. Socket.IO supplies room-oriented events for joining, leaving, sending messages, and receiving server-side message broadcasts [5].

React provides the component model used by the client [6], while Vite supplies the development and production build toolchain [7]. This stack is appropriate for a modular prototype because visual modules can be developed independently while shared state is exposed through React Context providers. The server is intentionally minimal, however, and its own documentation identifies it as local-development-only.

### 4.5 Research gap and project position

Existing messaging, assistant, and shopping systems generally optimize their primary domain. The project gap addressed by PingX is an implementation-oriented exploration of cross-domain continuity in one interface. Its novelty should be stated conservatively: the project composes established web, real-time, browser-storage, and external AI techniques into a coherent prototype. It does not introduce a new learning algorithm, dataset, security protocol, or market-data method. The value of the project is therefore in system integration, module composition, fallback behavior, and the explicit identification of what remains necessary for a validated production system.

## 5. Proposed System

### 5.1 System overview

PingX is a client-centered web application with an optional local server. The browser loads the React entry point and mounts the application. The application wraps its views in providers for theme, authentication, toasts, pings, shopping, chat, and AI. The main application selects views through state-based navigation rather than URL routing. The user can open the dashboard, chat, AI Studio, Smart Shop, pings, profile, settings, about, and showcase surfaces through the main layout.

The system has two execution patterns. Local-first features operate directly in React state and browser storage. Server-assisted features use HTTP requests to the Express server and may use Socket.IO for message broadcasting. The AI service can call an external Gemini generation endpoint directly from the frontend when `VITE_GEMINI_API_KEY` is available; without that key, the service uses local fallback logic. The server also exposes AI endpoints, but the inspected frontend provider does not use them in the principal AI flow.

### 5.2 Major modules

**Application shell and navigation:** `App.jsx`, the main layout, sidebar, top header, command palette, theme switcher, and toast container provide the common shell.

**Authentication and profile:** The authentication context and modal support sign-in, registration, demo accounts, logout, account switching, profile editing, avatar selection, and friend-request actions. Authentication is demo-level and not suitable for real credentials.

**Chat:** The chat context and chat view support direct and group conversations, search and filters, text messages, suggested replies, emoji selection, image previews, audio recording or fallback audio, reactions, editing, deletion, in-chat search, group summaries, reminders, and contact creation.

**AI assistant:** The AI context, popup panel, floating bubble, dashboard launcher, and AI Studio support prompts, context suggestions, optional image input, progressive response rendering, and copying responses.

**Smart Shop:** The shop context and shop views support static product search, category and sort controls, product details, marketplace offers, comparison of up to four products, cheapest-offer calculation, watchlist actions, price-watch pings, and external marketplace links.

**Pings:** The pings context and view represent seeded price alerts, reminders, AI insights, social events, read/unread state, deletion, mark-all-as-read, custom pings, focus-mode filtering, and links into related modules.

### 5.3 Inputs and outputs

Inputs include typed identity values, chat text, selected emojis, image files, recorded audio, product search terms, category and sort selections, comparison selections, profile edits, theme selections, and custom ping fields. Outputs include rendered messages, notifications, comparison results, AI responses, modal views, external merchant links, updated local state, REST responses, and Socket.IO broadcasts where the server-assisted path is used.

### 5.4 Data and persistence

No database dependency or schema is present. Browser local storage retains registered accounts, the token, active user, chats, theme selection, friend requests, and the theme-switcher position. Pings, comparison selections, watchlists, and AI history are held in React state and are not persistent across reloads according to the inspected implementation. The server data module maintains in-memory accounts, friend requests, chats, and messages and attempts to write selected state to `server/state.json`; no generated state file was included in the workspace at inspection time.

### 5.5 Security boundary

The server issues JWTs and the client stores tokens in local storage. However, passwords are not verified or hashed in the project’s current authentication flow; the client login path sends an identity rather than a password. Friend-request identifiers are trusted from request bodies, message authorization checks token validity without fully checking chat membership, CORS permits all origins, and a development JWT secret is available as a default. These are implementation limitations, not security features. The settings interface’s end-to-end encryption statement is not supported by the source and is excluded from the claims of this paper.

## 6. Methodology

The project methodology is an iterative software engineering and integration process rather than a machine-learning training methodology.

### 6.1 Requirement decomposition

The initial conceptual requirement was decomposed into four connected activity domains: communication, assistance, discovery, and notification. These domains were mapped to separate modules so that each could be implemented and tested locally while remaining accessible from a common application shell.

### 6.2 Interface and module construction

The frontend was constructed as reusable JSX components. Shared behavior was placed in React Context providers, while views and modals consume the relevant provider state. Static data modules supply demo users, chats, pings, products, and AI history. Public image assets support the landing experience and AI preview. This separation allows UI composition without introducing a global state-management dependency.

### 6.3 Chat processing flow

When a user submits a message, the chat layer updates the local conversation optimistically so that the message appears immediately. Depending on the active configuration, the operation can also be sent to a REST endpoint and/or associated with a Socket.IO room for broadcasting. Attachments are represented through image previews or browser media recording. Reactions, editing, deletion, message search, and reminder creation update the associated conversation state. The implementation includes seeded data to make the workflow demonstrable without a populated remote system.

### 6.4 AI processing flow

The AI input is collected as text, with an optional image payload. If the configured Gemini key is available, the provider constructs a generation request for the configured Gemini model endpoint. The inspected implementation labels the configured model as Gemini 1.5 Flash. If the key is unavailable, a local provider uses regular-expression and keyword matching to select a predefined response path. Shopping-related prompts can use the static product comparison service. The resulting text is exposed through the AI context and rendered progressively in the interface. The progressive display is a presentation behavior and does not constitute streaming inference from the model.

### 6.5 Product comparison flow

The product workflow begins with static product records. The user searches or filters the catalogue, chooses a sort mode, opens product details, and selects products for a comparison tray limited to four entries. The comparison service evaluates the offer data available in the records and calculates the cheapest available offer. The user may open an external merchant link or create a price-watch action, which produces a local ping. Since the project has no live merchant integration, the method terminates at catalogue comparison and outbound linking.

### 6.6 Ping and reminder flow

Pings are created from seeded data or user actions such as custom reminder creation and price watching. Each ping includes a category and read state and may include a target module or conversation. The pings view allows read-state changes, deletion, bulk read actions, and focus-mode filtering. Because the pings context is not persisted, the result is session-oriented rather than a durable notification service.

### 6.7 Verification methodology

Verification was based on source inspection, editor diagnostics, available server smoke-test scripts, and the production build command. The repository contains no frontend unit-test suite and no root test script. The available server scripts do not use assertions; the accept-flow script requires a running server and writes a JSON result file. Accordingly, this paper reports build and functional evidence, not statistical system performance.

## 7. System Architecture

### 7.1 Communication model

The implemented communication path is best represented as two related paths:

**Local-first path:** User -> React component -> Context provider -> local state/localStorage -> rendered response.

**Server-assisted path:** User -> React component -> Context or service -> Express REST endpoint and/or Socket.IO channel -> server data module or event broadcast -> HTTP/socket response -> React state -> rendered response.

**External AI path:** User -> AI component -> AI context/provider -> Gemini generation endpoint when configured -> response parsing -> progressive UI rendering. Without the external key, the path terminates in the local fallback provider.

The project does not contain a database-backed path or a custom AI/ML inference path. The architecture diagram must therefore show the absence of those components rather than imply them.

**Figure 1: Overall System Architecture.** A diagram should show the browser user on the left, the React application shell and module views in the center, and three destinations on the right: browser local storage, the optional Express/Socket.IO server, and the optional Gemini API. Inside the React application, show Auth, Chat, AI, Shop, Pings, Theme, and Toast providers. Connect server data to in-memory arrays and optional local state-file persistence. Label the Gemini route as optional and label the local AI fallback inside the frontend.

### 7.2 User workflow

**Figure 2: System Workflow.** A flow diagram should show: application load; provider initialization; active-user/demo state load; dashboard display; user choice among chat, AI, shop, pings, profile, or settings; action processing; local or server-assisted state update; response rendering; and optional creation of a related ping or navigation target.

### 7.3 Processing pipeline

**Figure 3: Data/Processing Pipeline.** For AI, show prompt and optional image input, provider selection, Gemini request or keyword fallback, response extraction, progressive rendering, and copy action. For shopping, show query and filters, static catalogue selection, sorting, offer comparison, cheapest-offer calculation, and price-watch ping creation. The figure should make clear that no feature extraction, model training, embedding generation, or persistent data warehouse is present.

## 8. Technologies Used

| Technology | Purpose | Role in the project |
|---|---|---|
| React 19 | Component-based UI | Implements application views, forms, modals, and interactive state consumers. |
| React DOM | Browser rendering | Mounts the React application in the browser. |
| JavaScript and JSX | Application language | Defines frontend components, contexts, services, and data modules. |
| Vite 8 | Development and build tooling | Runs the frontend development workflow and creates the production bundle. |
| Tailwind CSS 4 | Utility-based styling | Supports interface styling alongside project CSS files. |
| React Context | Shared state composition | Provides Auth, Chat, AI, Shop, Pings, Theme, and Toast state. |
| Express 4 | HTTP server | Exposes local REST endpoints for server-assisted operations. |
| Socket.IO 4 | Real-time transport | Supports rooms and message broadcasting in the development server. |
| Body Parser | Request parsing | Parses JSON request bodies on the server. |
| CORS | Cross-origin middleware | Allows browser access to the local server during development. |
| JSON Web Token | Token issuance and validation | Provides demo-level identity tokens on selected server routes. |
| Google Gemini API | Optional external generation | Processes configured text and image AI requests. |
| Browser localStorage | Client persistence | Stores selected accounts, chats, theme, token, and friend-request state. |
| MediaRecorder API | Browser audio capture | Supports audio recording in the chat interface when available. |
| lucide-react | Interface icons | Supplies iconography for controls and navigation. |
| canvas-confetti | Visual feedback | Provides confetti effects used by the interface. |
| Oxlint | Static analysis | Provides the configured linting command. |

No database engine, custom ML framework, vector database, merchant scraping service, or payment system is included in the project dependencies.

## 9. Implementation

### 9.1 Frontend implementation

The frontend begins at `main.jsx` and composes the application in `App.jsx`. The application uses state-based view selection and a common layout rather than React Router. Context providers centralize cross-cutting state. The dashboard aggregates recent activity and counts from chat, pings, and shop-related state. The landing experience uses local public assets and presents messaging, AI, and shopping previews.

The visual system is defined through CSS and a Discord-inspired design specification in `DESIGN.md`. The implementation includes themes, responsive layouts, icons, modals, drawers, toast messages, and a UI showcase. These elements make the prototype suitable for demonstrating interaction flows, although visual quality is not itself a measure of task effectiveness.

### 9.2 Chat implementation

`ChatContext.jsx` maintains conversations and message operations, including local storage for chat state. `ChatView.jsx` renders conversation lists, message content, search, filters, reactions, attachments, recording controls, and interaction menus. Direct and group conversations are both represented. The client can make optimistic updates and optionally communicate with the development server. The server provides chat-list, message-list, message-create, and chat-create endpoints and Socket.IO events for joining, leaving, and sending messages.

### 9.3 AI implementation

`aiProvider.js` implements the provider boundary. The external path reads `VITE_GEMINI_API_KEY` and submits the supported text and image content to the configured Gemini generation endpoint. The local path uses regular expressions and product comparison data to respond to a small set of intent categories. `AIContext.jsx` makes the service available to the UI, while the popup panel and AI Studio render the conversation and progressive response state. The selected model label is a UI label; the source does not implement a real model switch.

### 9.4 Shopping implementation

The shopping context consumes static product records and exposes query, category, sort, comparison, watchlist, and price-watch operations. Product cards and detail modals present records and marketplace offers. `productComparisonService.js` performs comparison-related calculations. The comparison tray is limited to four products. External merchant links are opened as outbound actions; no transaction is completed inside PingX.

### 9.5 Backend and API integration

The server in `server/index.js` uses Express, body parsing, CORS, Socket.IO, and JWT. Its routes cover users, login, registration, friend requests, request responses, products, chats, messages, AI, streaming AI, and comparison. The server’s `/api/ai/stream` route is mocked progressive text according to the inspected implementation and is not the frontend’s primary AI route. The backend product database is empty, while the frontend catalogue is populated through static data, producing an important separation between the two paths.

### 9.6 Authentication and data protection

Authentication is implemented for demonstration and integration purposes. The application can begin in an authenticated state, accepts non-empty identity input in the frontend flow, and stores tokens and active-user information in local storage. The server issues JWTs, but passwords are not securely stored or verified. The current system therefore demonstrates account state transitions rather than secure identity management. A production implementation would require password hashing, credential verification, authenticated ownership checks, secret management, transport security, rate limiting, and a clear data-retention policy.

**Figure 4: User Interface / Main Module.** A suitable figure should use a project screenshot showing the dashboard or main application shell, with a caption identifying the sidebar, activity summary, AI launcher, and navigation into chat, shop, and pings. No screenshot file was supplied in the workspace; the final submission should insert an actual captured screen rather than a fabricated figure.

## 10. Results and Evaluation

### 10.1 Functional evidence

Source inspection confirms the presence of the principal user-facing workflows: direct and group chat, messaging controls, AI prompt surfaces, product search and comparison, price-watch actions, pings, profile editing, themes, and settings. The build verification performed during preparation completed successfully with Vite. The build transformed 1,871 modules and emitted the frontend bundle, including approximately 80.48 kB of CSS and 492.70 kB of JavaScript before gzip reporting. These are build-artifact observations, not user-facing performance benchmarks.

The repository includes `local_data_test.js`, which exercises in-memory friend-request and chat creation operations through console output. It contains no assertions. `test_accept_flow.js` performs a login, friend-request submission, request acceptance, and chat-list request when a server is running, then writes `test_result.json`; it also contains no assertions. No frontend test files or root test script were found. The server test flow was not treated as a successful measured result because it requires a separately running server and its execution output was not captured as a validated test report in this preparation.

### 10.2 Quantitative evaluation boundary

No formal accuracy percentage, precision, recall, F-score, recommendation metric, response-time measurement, throughput test, memory profile, usability study, sample size, or comparative experiment is present in the supplied project materials. Consequently, the project cannot support claims such as “highly accurate,” “low latency,” “scalable,” or “better than existing systems.” The actual quantitative evaluation result is therefore: **[Information Required]**.

A future evaluation should define representative tasks, such as sending a message, completing a product comparison, creating a reminder, and obtaining an AI answer. It should collect task completion rate, time on task, error count, response latency, and user-reported usability using a documented protocol. AI evaluation would additionally require a prompt set and a human or task-specific scoring rubric.

### 10.3 Observed strengths

The implemented prototype demonstrates broad functional integration and clear module boundaries. The local AI fallback improves availability when the external API key is absent. Optimistic chat updates improve the perceived immediacy of local interaction. Static product data enables a complete comparison interaction without external merchant dependencies. The dashboard and pings view provide a shared context across otherwise separate activities. The successful production build indicates that the frontend source can be transformed into a deployable static bundle under the current environment.

### 10.4 Observed limitations

The evaluation also exposes limitations. Several state domains are session-only. The server and frontend product sources are not unified. The external AI path depends on a key and network access. The local fallback has narrow intent coverage. The server tests lack assertions, and frontend automated tests are absent. Authentication and authorization are not production-safe. These limitations constrain the conclusions that can be drawn from functional inspection.

**Figure 5: Results or Evaluation.** A valid figure for the final submission could show a table or bar chart generated from a future controlled test. Until such measurements exist, the paper should use a functional test matrix rather than inventing numerical values.

## 11. Discussion

PingX demonstrates that a provider-based client architecture can compose several related workflows without requiring a single monolithic module. Authentication, chat, AI, shopping, pings, themes, and toasts can evolve as separate contexts while remaining available to common views. This is a practical strength for a student project because it makes the interaction model visible and keeps feature-specific logic near its owning module.

The dual AI design is also useful as an engineering pattern. External generation offers broader language and image capabilities, while the local fallback preserves a basic interaction when external configuration is absent. However, the fallback should not be confused with AI model inference, and the project does not establish that either mode is reliable for consequential decisions. The system should communicate this distinction clearly in future interface and documentation work.

The shopping workflow illustrates the difference between product interaction design and market-data infrastructure. Search, filtering, sorting, comparison, and price-watch actions are implemented, but the records are static. The system can demonstrate how a user compares offers, yet it cannot establish that those offers are current or complete. Similarly, the pings view demonstrates notification organization but does not implement a durable scheduler or background price monitor.

Compared with a collection of disconnected traditional tools, the proposed system offers a more continuous interaction path. Compared with mature production platforms, it lacks data scale, security hardening, operational monitoring, validated recommendation logic, and measured user outcomes. The most significant performance limitations are not measured computational bottlenecks; they are architectural boundaries such as external API dependency, in-memory server data, missing persistence for some state, and absent test instrumentation.

## 12. Applications

The current prototype can support several practical demonstrations and future application contexts:

1. **Collaborative product discovery:** Users can discuss products, compare available offers, and create a related price-watch ping in one workflow.
2. **Conversation-centered assistance:** Users can ask text or image-oriented questions from a popup or dedicated AI surface while retaining the surrounding application context.
3. **Personal activity organization:** Users can combine social events, reminders, price alerts, and AI insights in a pings view.
4. **University project demonstration:** The modular frontend and optional backend provide a compact example of full-stack web integration, real-time events, external AI access, and browser persistence.
5. **Prototype platform for user studies:** The interface can serve as a foundation for future usability experiments after test tasks, data collection, and privacy controls are added.

These applications are bounded by the current prototype’s static data, session persistence, development authentication, and absence of production deployment controls.

## 13. Limitations

The project has the following technical and practical limitations:

- It uses static frontend product data and does not implement live merchant aggregation, price history, or marketplace synchronization.
- The server product database is empty and is not the same data source as the frontend catalogue.
- There is no relational or document database, schema, migration system, or verified durable persistence layer.
- Pings, watchlists, comparison selections, and AI history are not persisted across reloads.
- The AI subsystem has no custom-trained model, training dataset, embeddings, vector database, or measured evaluation.
- The local AI fallback uses narrow keyword and regular-expression matching.
- The frontend does not use the server AI endpoints as its primary AI path.
- The login and registration flows do not provide secure password handling.
- JWTs are stored in local storage and the default secret is development-oriented.
- Several server routes trust identifiers from request bodies and do not fully enforce resource ownership.
- CORS is configured permissively, and HTTPS, rate limiting, CSRF protection, and role-based access control are absent.
- Pings do not provide verified background scheduling or real-time price monitoring.
- The server test scripts do not contain assertions, and no frontend automated test suite is included.
- No formal usability, accuracy, latency, scalability, or security evaluation was supplied.
- The application starts in an authenticated state in the current implementation, which is unsuitable for a production login experience.
- No screenshots were supplied as project files for inclusion in the final manuscript.

## 14. Future Scope

Future work should proceed in stages. First, the system should establish a production data model and replace mock and in-memory records with a database, migrations, ownership constraints, and durable storage for pings, watchlists, AI history, and messages. Second, authentication should be redesigned around verified credentials, salted password hashing, secure session or token handling, authenticated friend-request and chat ownership checks, secret management, HTTPS, rate limiting, and documented privacy controls.

Third, the shopping module could integrate permitted merchant APIs or a controlled data-ingestion service, maintain timestamps and price history, and expose data freshness to users. Any future recommendation component should be evaluated with a documented dataset and suitable metrics rather than inferred from interface behavior. Fourth, the AI module could support robust model configuration, correct MIME-type handling, request error states, prompt and response logging with consent, explainability cues, multilingual interaction, and domain-specific evaluation. A larger labelled prompt set and human assessment would be required before reporting accuracy or quality claims.

Finally, the platform could be extended with real-time synchronization, scheduled reminders, cloud deployment, observability, accessibility testing, mobile clients, offline behavior, and load testing. These improvements are relevant only after the core security, persistence, and measurement foundations are in place.

## 15. Conclusion

This paper presented PingX, a browser-based prototype that integrates social communication, conversational assistance, product comparison, and reminder-oriented notifications. The system was implemented with React and a provider-based state architecture, supported by browser local storage and an optional Express and Socket.IO development server. Its AI layer provides an optional Gemini generation path and a deterministic local fallback, while its shopping layer operates over static product records and its pings layer connects user actions to contextual notifications.

The project demonstrates a complete interaction concept and a modular implementation that can be built successfully as a frontend production bundle. It also makes clear that functional breadth is not equivalent to production readiness or measured effectiveness. The supplied materials contain no formal AI accuracy data, latency benchmarks, dataset, controlled experiment, or user study. Security, durability, live market data, scheduled monitoring, and automated test assertions remain incomplete. Within those boundaries, PingX is a credible university-level prototype and a foundation for future research into integrated communication and action-oriented web workflows. Its strongest academic value lies in demonstrating the architecture, workflow composition, and engineering tradeoffs while honestly identifying the evidence required for stronger claims.

## References

[1] J. Nielsen, *Usability Engineering*. San Francisco, CA, USA: Morgan Kaufmann, 1994.

[2] G. Adomavicius and A. Tuzhilin, “Toward the next generation of recommender systems: A survey of the state-of-the-art and possible extensions,” *IEEE Transactions on Knowledge and Data Engineering*, vol. 17, no. 6, pp. 734–749, Jun. 2005, doi: 10.1109/TKDE.2005.99.

[3] F. Ricci, L. Rokach, and B. Shapira, Eds., *Recommender Systems Handbook*, 3rd ed. New York, NY, USA: Springer, 2022, doi: 10.1007/978-1-0716-2197-4.

[4] R. T. Fielding, “Architectural styles and the design of network-based software architectures,” Ph.D. dissertation, Dept. Inf. Comput. Sci., Univ. California, Irvine, CA, USA, 2000. [Online]. Available: https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm

[5] Socket.IO, “Socket.IO documentation,” Socket.IO. Accessed: Sep. 2, 2026. [Online]. Available: https://socket.io/docs/v4/

[6] Meta Open Source, “React documentation,” React. Accessed: Sep. 2, 2026. [Online]. Available: https://react.dev/

[7] Vite, “Vite documentation,” Vite. Accessed: Sep. 2, 2026. [Online]. Available: https://vite.dev/guide/

[8] Google, “Gemini API documentation,” Google AI for Developers. Accessed: Sep. 2, 2026. [Online]. Available: https://ai.google.dev/gemini-api/docs

[9] Open Web Application Security Project, “OWASP Application Security Verification Standard,” OWASP Foundation. Accessed: Sep. 2, 2026. [Online]. Available: https://owasp.org/www-project-application-security-verification-standard/

[10] Express.js, “Express web framework documentation,” OpenJS Foundation. Accessed: Sep. 2, 2026. [Online]. Available: https://expressjs.com/
