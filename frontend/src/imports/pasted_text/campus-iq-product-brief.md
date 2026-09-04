You are the lead product designer, senior UI/UX designer, design-system architect, and frontend engineer responsible for designing and generating the complete CAMPUSIQ web application.

This is a serious 48-hour hackathon product.

Your task is NOT to create a generic AI dashboard, a ChatGPT clone, or a collection of attractive mockup screens.

Your task is to create a complete, coherent, premium, responsive student-facing campus intelligence platform whose frontend can later be exported and seamlessly integrated with an external FastAPI + Supabase + pgvector + Gemini/Groq backend.

==================================================

1. PRODUCT VISION

==================================================

Product name:

CAMPUSIQ

Core idea:

"Your campus, intelligently connected."

CampusIQ is an AI-powered campus intelligence platform that helps students interact with three categories of campus knowledge:

1. SYLLABUS & NOTES

   Workflow ID:

   syllabus_rag

   Purpose:

   Ask questions grounded in academic notes, syllabus documents, study material, and uploaded documents.

2. CAMPUS INFORMATION

   Workflow ID:

   campus_faq

   Purpose:

   Find answers from official campus circulars, notices, deadlines, forms, procedures, announcements, and institutional information.

3. TIMETABLE & EXAMS

   Workflow ID:

   timetable

   Purpose:

   View/query academic schedules and identify timetable or exam conflicts.

IMPORTANT:

These are NOT three separate products.

They are three workflows inside one unified CampusIQ experience.

The interface must communicate:

ONE ASSISTANT

ONE PLATFORM

MULTIPLE WORKFLOWS

==================================================

2. DEVELOPMENT STRATEGY

==================================================

This frontend is being designed FIRST in Google Stitch.

Later:

Google Stitch

→ Export frontend

→ Git repository

→ Antigravity

→ FastAPI backend

→ Supabase

→ pgvector

→ Workflow Router

→ Gemini/Groq

→ Frontend integration

Therefore the frontend MUST be backend-agnostic.

Do NOT put these inside frontend components:

- Gemini API calls

- Groq API calls

- vector search

- embedding generation

- RAG logic

- document processing

- privileged Supabase logic

- Supabase service-role key

- backend secrets

Create a clean frontend API/service boundary that can initially use mock adapters.

==================================================

3. DESIGN PERSONALITY

==================================================

CampusIQ should feel:

- premium

- intelligent

- sophisticated

- modern

- academic

- trustworthy

- calm

- futuristic but restrained

- technically credible

- startup-quality

It should NOT feel:

- childish

- overly futuristic

- like a gaming UI

- like a ChatGPT clone

- like a generic SaaS admin dashboard

- like an AI-generated template

- overloaded with glass cards

- overloaded with neon

- visually noisy

The goal is:

"Premium campus intelligence platform"

NOT:

"AI dashboard with random glowing cards"

==================================================

4. VISUAL LANGUAGE

==================================================

Base visual system:

- deep charcoal / near-black background

- subtle blue accents

- subtle violet accents

- small amounts of cyan

- soft ambient gradients

- restrained glassmorphism

- thin low-contrast borders

- controlled shadows

- subtle depth

- excellent contrast

- clean negative space

Glassmorphism must be used selectively.

Do not put every component inside a glass card.

Some surfaces should be flat and clean.

The product should retain visual hierarchy even without effects.

==================================================

5. COLOR BEHAVIOR

==================================================

Use a restrained palette.

Primary:

deep dark neutral

Secondary accents:

blue / violet

Optional highlight:

cyan

Use accent colors for:

- workflow identification

- interaction states

- important actions

- selected navigation

- subtle data visualization

Do not create rainbow interfaces.

Do not use intense neon everywhere.

==================================================

6. TYPOGRAPHY

==================================================

Use one strong modern sans-serif family.

Prioritize:

- readability

- hierarchy

- clean numbers

- strong headings

- comfortable body text

Suggested desktop sizing:

Display:

48–64px

Page heading:

32–40px

Section heading:

20–24px

Body:

14–17px

Metadata:

12–13px

Mobile typography must scale proportionally.

Avoid excessive font weights.

==================================================

7. DESIGN SYSTEM FIRST

==================================================

Before building pages, establish:

- spacing system

- typography system

- color tokens

- border radius

- shadows

- surface styles

- buttons

- inputs

- badges

- cards

- icon behavior

- modal behavior

- navigation behavior

- focus states

- loading states

- empty states

- error states

Create reusable components rather than duplicating markup.

==================================================

8. APPLICATION SHELL

==================================================

Desktop application structure:

LEFT SIDEBAR

approximately 240–280px

MAIN CONTENT

fluid

OPTIONAL RIGHT CONTEXT/SOURCE PANEL

approximately 280–360px

Sidebar:

CampusIQ logo

--------------------

New Chat

Recent Chats

WORKSPACES

Syllabus & Notes

Campus Information

Timetable & Exams

KNOWLEDGE

Knowledge Base

ACCOUNT

Settings

Profile

--------------------

Help / Feedback

User

Mobile:

Replace sidebar with:

- drawer

or

- bottom navigation

Mobile navigation:

Home

Chats

Workflows

Knowledge

Profile

==================================================

9. GLOBAL REUSABLE COMPONENTS

==================================================

Build reusable components such as:

AppShell

Sidebar

MobileNavigation

TopBar

PageHeader

SectionHeader

Button

IconButton

Input

SearchInput

Textarea

Select

ChatComposer

MessageBubble

SourceCitation

SourceDrawer

WorkflowCard

WorkflowSelector

DocumentCard

DocumentTable

StatusBadge

Modal

ConfirmationDialog

Toast

Tooltip

EmptyState

LoadingState

ErrorState

Skeleton

UserAvatar

Components must be reusable across the product.

==================================================

10. LANDING PAGE

==================================================

Create a premium landing page.

Hero:

Headline conveying:

"Your campus, intelligently connected."

Supporting text:

CampusIQ helps students find grounded answers from academic material, official campus information, and schedules.

Primary CTA:

Get Started

Secondary CTA:

See How It Works

Hero visual:

Create a sophisticated product visualization showing the relationship between:

Student Query

→ Campus Knowledge

→ Intelligent Answer

Do NOT create a cheesy robot illustration.

Do NOT use giant generic AI imagery.

Three capability cards:

1.

Syllabus & Notes

2.

Campus Information

3.

Timetable & Exams

Add a subtle trust statement:

"Grounded in your campus knowledge."

Footer:

Product

About

Privacy

Terms

Contact

==================================================

11. AUTHENTICATION SCREEN

==================================================

Create a minimal premium authentication experience.

Elements:

CampusIQ logo

Welcome text

Google sign-in button

Short explanation

Terms/privacy text

Loading state

Authentication error state

Do NOT create password authentication unless explicitly required.

==================================================

12. DASHBOARD

==================================================

Primary objective:

The dashboard should immediately make the user understand what CampusIQ can do.

Header:

"Good evening, [Name]."

Secondary:

"What would you like to know?"

Large central chat composer.

Workflow selector:

Syllabus & Notes

Campus Information

Timetable & Exams

Suggested questions:

"What topics are included in Unit 3?"

"When is the exam form deadline?"

"Do I have an exam conflict next week?"

Recent conversations:

Show 4–6 realistic conversations.

Knowledge snapshot:

Documents indexed

Recent uploads

Active workflow

Do not overcrowd the dashboard.

The main CTA must remain obvious.

==================================================

13. WORKFLOW SELECTOR

==================================================

Create a premium workflow selection component.

Workflow 1:

Name:

Syllabus & Notes

ID:

syllabus_rag

Description:

"Ask questions grounded in your academic material."

Workflow 2:

Name:

Campus Information

ID:

campus_faq

Description:

"Find answers from official notices, circulars and procedures."

Workflow 3:

Name:

Timetable & Exams

ID:

timetable

Description:

"Check schedules and detect timetable conflicts."

Each workflow needs:

- icon

- title

- description

- selected state

- hover state

- loading state

- disabled state

- unavailable state

The selected workflow must be immediately recognizable.

Do not use three visually unrelated designs.

==================================================

14. MAIN CHAT EXPERIENCE

==================================================

This is the MOST IMPORTANT SCREEN.

Structure:

LEFT:

conversation history

CENTER:

conversation

BOTTOM:

chat composer

OPTIONAL RIGHT:

sources/context

Chat header:

Current workflow

Conversation title

Status

Composer:

Text input

Attach

Send

Keyboard shortcut hint

Empty conversation:

Friendly welcome

workflow description

3–4 suggested questions

The conversation should feel spacious and premium.

==================================================

15. MESSAGE DESIGN

==================================================

User message:

compact

clear

visually distinct

Assistant message:

more prominent

high readability

structured

Responses must support:

- paragraphs

- bullets

- numbered lists

- tables where necessary

- inline emphasis

- citations

Assistant actions:

Copy

Regenerate

Feedback

View Sources

Keep actions subtle.

Do NOT create a toolbar of 15 buttons.

==================================================

16. SOURCE CITATIONS

==================================================

This is a CORE CAMPUSIQ DIFFERENTIATOR.

Every grounded AI response must have a clear path to source information.

Source card should display:

Document name

Source type

Page

Section

Relevant snippet

Example:

Computer Networks — Unit 3 Notes

Page 14

Unit 3

"Distance vector routing exchanges routing information..."

Badge:

OFFICIAL CAMPUS SOURCE

OR

UPLOADED STUDY MATERIAL

Desktop:

citation cards below/inside response.

Mobile:

compact expandable source cards/drawer.

Sources should feel trustworthy and easy to inspect.

Do NOT overwhelm the answer with citations.

==================================================

17. GROUNDING / I DON'T KNOW EXPERIENCE

==================================================

Create a dedicated valid response state for insufficient evidence.

Example:

"I don't have enough information in the CampusIQ knowledge base to answer that reliably."

Supporting text:

"Try uploading relevant material or asking a question covered by the available campus knowledge."

Possible badge:

Insufficient evidence

This must NOT look like a system failure.

It is a successful, trustworthy product behavior.

Do NOT invent sources.

==================================================

18. CONFIDENCE EXPERIENCE

==================================================

Backend may return:

high

medium

low

Render subtly as:

High grounding

Moderate grounding

Limited evidence

The frontend must NOT calculate confidence.

The backend owns confidence.

Do not use giant confidence meters.

==================================================

19. KNOWLEDGE BASE

==================================================

Create a polished document management experience.

Header:

Knowledge Base

Actions:

Upload Documents

Search

Filter

Filters:

Subject

Department

Document Type

Source Type

Status

Document display:

Name

Type

Subject

Source

Status

Uploaded date

Actions

Status:

Processing

Ready

Failed

Upload experience:

Drag and drop

Browse files

Supported types

Size limit

Upload progress

Success

Failure

Supported:

PDF

DOCX

TXT

Do not implement document parsing or embedding logic in frontend.

==================================================

20. OFFICIAL VS UPLOADED MATERIAL

==================================================

Make source type visually distinguishable.

Official:

"OFFICIAL CAMPUS SOURCE"

Uploaded:

"UPLOADED STUDY MATERIAL"

System:

"SYSTEM SOURCE"

Allowed source IDs:

official

uploaded

system

Use these labels consistently throughout:

Chat

Sources

Knowledge Base

Search results

Official sources should feel more authoritative without making the UI visually aggressive.

==================================================

21. CHAT HISTORY

==================================================

Build:

New Chat

Search conversations

Group by:

Today

Yesterday

Previous 7 Days

Older

Each conversation shows:

Title

Workflow

Timestamp

Actions:

Open

Rename

Delete

Never display internal database IDs.

==================================================

22. TIMETABLE UI

==================================================

Design the timetable workflow now even though backend implementation may be P2.

Show:

Upcoming exams

Timetable

Date

Course

Start time

End time

Location

Conflict state:

CLEAR

or:

CONFLICT DETECTED

Example:

DBMS

10:00–13:00

Operating Systems

10:00–13:00

Conflict detected

Important:

Frontend does NOT calculate conflicts.

Frontend only displays backend results.

==================================================

23. SETTINGS

==================================================

Create:

Profile

Name

Email

Avatar

Preferences

Appearance

Notifications placeholder where necessary

Usage

Rate limit / usage information if available

Account

Logout

Do not add meaningless fake settings.

==================================================

24. EMPTY / LOADING / ERROR STATES

==================================================

Every important page must have intentional states.

Knowledge Base:

"No documents yet."

Chat:

"Ask CampusIQ anything about your campus knowledge."

Loading:

Use skeletons and lightweight progress states.

Error:

"Something went wrong. Please try again."

Network:

"Unable to reach CampusIQ."

No results:

"No matching documents found."

Do not use giant spinners everywhere.

==================================================

25. RESPONSIVE REQUIREMENTS

==================================================

Desktop:

>=1280px

Tablet:

768–1279px

Mobile:

<768px

Test:

1440×900

1280×800

1024×768

768×1024

390×844

360×800

Ensure:

No horizontal scrolling.

No clipped dialogs.

No broken source cards.

No tiny tap targets.

No sidebar collisions.

No overlapping chat composer.

Mobile composer must remain usable with the keyboard visible.

==================================================

26. MOBILE EXPERIENCE

==================================================

The mobile version must feel intentionally designed.

Do NOT simply shrink the desktop interface.

Mobile:

- bottom navigation or drawer

- large touch targets

- compact workflow selection

- simplified source cards

- expandable citations

- single-column layout

- condensed top bar

- accessible chat composer

The mobile layout should look like a high-quality mobile product even though CampusIQ is primarily being built as a web app.

==================================================

27. ACCESSIBILITY

==================================================

Implement:

Semantic HTML

Keyboard navigation

Visible focus states

Accessible labels

Accessible buttons

ARIA labels where useful

Sufficient contrast

Reduced motion behavior

Never communicate important information through color alone.

==================================================

28. MOTION DESIGN

==================================================

Use restrained motion.

Good examples:

150–250ms transitions

Subtle fade/slide

Workflow selection

Source expansion

Sidebar transitions

Message appearance

Button feedback

Avoid:

continuous animation

blinking

heavy parallax

giant moving backgrounds

excessive particle effects

distracting effects

Motion must communicate state.

==================================================

29. FRONTEND API BOUNDARY

==================================================

The frontend MUST use a centralized API layer.

Suggested:

src/api/

auth.ts

chat.ts

documents.ts

history.ts

workflows.ts

Conceptual functions:

loginWithGoogle()

sendMessage()

getConversation()

getChatHistory()

uploadDocument()

getDocuments()

deleteDocument()

getWorkflows()

Initially:

use mock adapters.

Later:

replace mock implementation with real backend calls.

DO NOT place fetch logic throughout components.

==================================================

30. STABLE BACKEND CONTRACT

==================================================

The frontend should be designed around versioned backend APIs:

/api/v1/chat

/api/v1/chat/history

/api/v1/documents

/api/v1/workflows

Workflow IDs MUST remain:

syllabus_rag

campus_faq

timetable

==================================================

31. DATA CONTRACTS

==================================================

USER:

{

  "id": "string",

  "name": "string",

  "email": "string",

  "avatarUrl": "string"

}

WORKFLOW:

{

  "id": "syllabus_rag | campus_faq | timetable",

  "name": "string",

  "description": "string",

  "enabled": true

}

CHAT REQUEST:

{

  "message": "string",

  "workflow": "syllabus_rag",

  "conversation_id": "string | null"

}

CHAT RESPONSE:

{

  "conversation_id": "string",

  "workflow": "syllabus_rag",

  "answer": "string",

  "grounded": true,

  "confidence": "high | medium | low",

  "sources": [

    {

      "document_id": "string",

      "document_name": "string",

      "page": 4,

      "section": "Unit 3",

      "snippet": "string",

      "source_type": "official | uploaded | system"

    }

  ],

  "metadata": {

    "retrieval_count": 5,

    "latency_ms": 820

  }

}

The frontend should render only user-safe fields.

==================================================

32. ROUTES

==================================================

Suggested:

/

 /auth

 /dashboard

 /chat/:conversationId

 /workflows

 /knowledge

 /history

 /settings

Keep workflow IDs stable.

==================================================

33. MOCK DATA

==================================================

Use realistic campus-style mock data.

Provide:

3–5 academic documents

3–5 official campus notices

1 sample timetable

5–10 sample conversations

10+ suggested questions

Mock data must be centralized and replaceable.

Do not hard-code answer strings directly inside components.

==================================================

34. FRONTEND ARCHITECTURE

==================================================

Suggested:

src/

components/

  layout/

  chat/

  workflow/

  knowledge/

  common/

pages/

api/

hooks/

types/

state/

data/

utils/

Prefer reusable composition.

==================================================

35. SECURITY

==================================================

NEVER:

Expose Gemini API key

Expose Groq API key

Expose Supabase service-role key

Place secrets in frontend

Perform privileged backend operations directly from the browser

Assume frontend authorization is sufficient

All privileged operations belong on backend.

==================================================

36. PERFORMANCE

==================================================

Prioritize:

Fast initial rendering

Efficient component rendering

Lazy loading where useful

Optimized images

Minimal unnecessary dependencies

Do not add huge animation libraries simply for visual effects.

==================================================

37. UX PRINCIPLE

==================================================

At every moment, the interface should make the next action obvious.

After login:

Ask a question.

After upload:

See processing status.

After answer:

Inspect sources.

After insufficient evidence:

Upload material or ask a better-covered question.

After conflict:

See exactly which schedule entries overlap.

==================================================

38. HACKATHON DEMO FLOW

==================================================

The UI MUST support this storyline:

1. Login

2. Dashboard

3. Display all three workflows

4. Open Syllabus & Notes

5. Ask a known academic question

6. Display grounded answer

7. Open source citation

8. Ask unsupported question

9. Display "I don't know"

10. Switch to Campus Information

11. Ask official campus question

12. Switch to Timetable

13. Display schedule/conflict result

14. Return to Dashboard

The transition between workflows must feel seamless.

==================================================

39. PRODUCT QUALITY BAR

==================================================

Before considering the frontend complete, verify:

- visual consistency

- responsive layouts

- accessible controls

- polished empty states

- polished error states

- polished loading states

- realistic mock data

- reusable components

- stable workflow IDs

- API layer separation

- source citation rendering

- mobile usability

- no broken overflow

- no visual clutter

==================================================

40. IMPORTANT: DO NOT OVERENGINEER

==================================================

Do NOT introduce:

MCP

LangGraph

multi-agent orchestration

microservices

Kubernetes

unnecessary queues

unnecessary databases

unnecessary state-management complexity

The frontend should remain simple enough to integrate quickly into a 48-hour hackathon backend.

==================================================

41. FINAL OUTPUT REQUIREMENT

==================================================

Create the complete CampusIQ frontend experience.

Build in this order:

1. Design system

2. AppShell

3. Navigation

4. Landing

5. Authentication

6. Dashboard

7. Workflow selector

8. Main chat

9. Source/citation system

10. Knowledge Base

11. Chat History

12. Settings

13. Timetable UI

14. Responsive/mobile layouts

15. Loading/error/empty states

16. Mock API layer

17. Final visual polish

Do not stop after making only a landing page.

The product must feel like one finished application.

FINAL DESIGN OBJECTIVE:

CampusIQ should look like a product that could realistically become a real student-facing campus platform.

It should communicate:

PREMIUM

TRUSTWORTHY

INTELLIGENT

ACADEMIC

MODERN

CALM

TECHNICAL

It should NOT look like:

AI-generated template

ChatGPT clone

Generic dashboard

Over-designed hackathon UI

Build the interface with strong hierarchy, excellent spacing, disciplined visual effects, responsive behavior, and a clear product story.

The exported frontend must later integrate cleanly with a FastAPI + Supabase + pgvector + Gemini/Groq backend without requiring a visual redesign.



i wanted a brand new design from scratch with glass morphism type stars , galxy type motion moved background with good ui/ux design please 



📄 Google Stitch handoff file

I also created the companion Markdown specification you can keep alongside the project:

Download CAMPUSIQ_GOOGLE_STITCH_FRONTEND_SPEC.md

How I would use this

Paste the master prompt into Stitch first. Keep the .md file as the persistent frontend specification/reference.

The ideal sequence is:

Stitch → generate design system/AppShell → generate all major screens → refine visual consistency → test mobile → export frontend → Git → Antigravity integration.

One important rule while using Stitch: don't ask it to build the backend or "AI functionality." Let it concentrate on the frontend contract above. That will make the later Antigravity integration substantially cleaner.



The confusion comes from the phrase "PWA-ready" and the fact that I described mobile layouts. Those are about making the web application responsive and future-compatible, not turning CampusIQ into an Android/iOS app.

The actual decision is:

NOW: 🌐 Responsive Web App LATER: 📱 Android/iOS app, using the same backend

So Google Stitch should be instructed to design a web application, not a mobile/native app.

What Stitch should build

Think:



              CAMPUSIQ WEB
                   │
        ┌──────────┴──────────┐
        │                     │
    DESKTOP WEB           MOBILE WEB
    1440px+                360–767px
        │                     │
        └──────────┬──────────┘
                   │
             Same React app
                   │
                FastAPI

The mobile screens I mentioned are simply:

responsive mobile-web layouts

They are not:





 React Native 



 Flutter 



 Android app 



 iOS app 



 native navigation 



 App Store build 



 Play Store build 

I would actually change the Stitch prompt

The line:

"Responsive Web, PWA-ready architecture"

can create unnecessary ambiguity.

Change it to:

"Build a responsive web application. The primary target is desktop web. Include carefully designed tablet and mobile-web breakpoints so the same web application works beautifully on phones. Do not design a native mobile application."

And change:

"PWA-Ready Requirement"

to:

"Future Mobile Compatibility — Architecture Only"

Meaning:

The frontend should use responsive web architecture that does not prevent a future mobile client, but do not implement native mobile features or spend hackathon time on PWA functionality.

Your final Stitch scope

Build these as WEB pages:



/
├── Landing
├── Auth
├── Dashboard
├── Chat
├── Workflows
├── Knowledge Base
├── Chat History
└── Settings

Desktop is the primary design target.

Then make the same pages adapt to:



Desktop Web
      ↓
Tablet Web
      ↓
Mobile Web

That's it.

Why I'm recommending this strongly

For your hackathon, you don't need:



Android Studio
Xcode
React Native
Flutter
App Store
Play Store
native navigation
native permissions
mobile build pipelines

Your entire focus should be:



Stitch
 ↓
Premium Web UI
 ↓
React + TypeScript
 ↓
FastAPI
 ↓
Supabase
 ↓
RAG
 ↓
Gemini
 ↓
3 workflows

Then after the hackathon:



                    FastAPI
                       │
             ┌─────────┴─────────┐
             │                   │
       CampusIQ Web        CampusIQ Mobile
             │                   │
        React/Vite          React Native/
                            Flutter/etc.

Both consume the same backend.

So yes — we're sticking with web.

The correct wording for the entire project is:

"CampusIQ is a premium responsive web application, optimized for desktop but fully responsive on tablet and mobile web. Its API-first backend is client-agnostic so native mobile applications can be added later."

That is what I would use everywhere going forward.

And don't regenerate the Stitch project as a "mobile app." Use Stitch specifically for the responsive web experience.