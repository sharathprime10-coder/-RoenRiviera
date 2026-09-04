The cleanest setup is:

Figma = visual source of truth
Figma MCP = structured bridge into Antigravity
Antigravity = frontend implementation + backend integration
FastAPI/Supabase/Gemini = application backend

Figma's current MCP server is designed specifically to give AI coding agents structured access to Figma components, variables, layout data and other design context, rather than only a screenshot. Figma recommends its remote MCP server for most users.

And Antigravity's current documentation says it supports MCP servers through its MCP Store or custom mcp_config.json, so this is the route I'd use.

First: don't use the Figma "Anyone can view" link as the primary integration

You can give Antigravity the Figma URL, and you should keep it as the permanent design reference.

But for actually transferring the design accurately, use:

Figma MCP + Figma URL + your handoff .md

The MCP server can expose the underlying Figma structure — components, variables, layout information, etc. — which is much more useful to an AI coding agent than a screenshot alone.

Your final RoenRiviera workflow
                    FIGMA
             RoenRiviera Design
                     │
             Figma Design File
                     │
              Figma MCP Server
                     │
                     ▼
                ANTIGRAVITY
                     │
        ┌────────────┴────────────┐
        │                         │
   Frontend Implementation    Backend
        │                         │
 React + TypeScript          FastAPI
 Tailwind                    Supabase
 Components                  pgvector
 Responsive UI               Gemini/Groq
        │                         │
        └────────────┬────────────┘
                     ▼
              ROENRIVIERA WEB
Step 1 — Prepare your Figma file properly

Before connecting anything, I strongly recommend cleaning your Figma structure.

Don't leave everything as random frame names like:

Frame 31
Frame 48
New Frame
Desktop copy
Final final 2

Instead organize it roughly like:

RoenRiviera
│
├── 00 — Cover
│
├── 01 — Design System
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Shadows
│   ├── Radius
│   └── Icons
│
├── 02 — Components
│   ├── Buttons
│   ├── Inputs
│   ├── Sidebar
│   ├── Cards
│   ├── Chat Messages
│   ├── Sources
│   ├── Workflow Cards
│   └── Navigation
│
├── 03 — Landing
│
├── 04 — Authentication
│
├── 05 — Dashboard
│
├── 06 — Chat
│
├── 07 — Knowledge Base
│
├── 08 — History
│
├── 09 — Settings
│
├── 10 — Timetable
│
└── 11 — Mobile Web

This matters because the agent will have a much easier time understanding what is a component, what is a screen, and what is merely a design exploration.

Figma's MCP can make use of components, variables and layout context from the file, so a well-structured Figma file improves the downstream implementation.

Step 2 — Set up Figma MCP in Antigravity

Antigravity currently supports MCP servers through its MCP Store, and it also allows custom servers through mcp_config.json.

In Antigravity

Open:

bottom-left Settings → Customizations → Installed MCP Servers

Then:

Add MCP

Search for:

Figma

If the Figma server is available in your MCP Store, install it and complete the Figma authentication flow. Antigravity's documentation says installed MCP tools become available to the editor after installation.

If Figma isn't in the store

Use Antigravity's custom MCP configuration.

Antigravity documents the config location as:

~/.gemini/config/mcp_config.json

or workspace-local:

.agents/mcp_config.json

depending on your setup.

Figma's preferred remote MCP endpoint is:

https://mcp.figma.com/mcp

So conceptually the server entry is the Figma remote MCP server rather than a local screenshot importer.

Use the authentication flow provided by the MCP client rather than putting Figma credentials or tokens into your project files.

Step 3 — Authenticate Figma

Figma's remote MCP setup uses your Figma account authentication. Figma recommends the remote server for most users because it provides the broadest/current feature set.

Once connected, verify in Antigravity that the Figma tools are actually available.

Don't immediately ask it to build the entire app.

First test it.

Use a small prompt like:

Verify the Figma MCP connection.

Read the RoenRiviera Figma file I provide and tell me:
1. The file name
2. The major pages/frames
3. The main design-system components
4. The primary colors/variables
5. The typography hierarchy
6. The main desktop and mobile frames

Do NOT generate code yet.
Do NOT modify the Figma file.
Only confirm what you can read.

Then give it the Figma URL.

If it correctly describes the file, the bridge is working.

Step 4 — Give Antigravity the Figma URL

The screenshot you showed gives you:

Copy link

Copy that link and put it into Antigravity.

But treat the URL as:

design reference

not:

the entire handoff

Your actual handoff should be:

Figma URL
+
Figma MCP
+
RoenRiviera frontend specification
+
existing repo
Step 5 — Add the renamed project identity

Every document and prompt should now use:

RoenRiviera

Not CampusIQ.

I would also distinguish:

Product name: RoenRiviera
Project architecture: the same multi-workflow architecture we designed earlier.

So the workflows can remain:

syllabus_rag
campus_faq
timetable

No need to change the backend identifiers simply because the product branding changed.

Step 6 — Very important: give Antigravity a "DO NOT REDESIGN" prompt

Paste this after connecting Figma:

ROENRIVIERA — FIGMA FRONTEND IMPLEMENTATION MASTER INSTRUCTION

The connected Figma file is the authoritative visual source of truth
for the RoenRiviera frontend.

Figma URL:
[PASTE YOUR FIGMA LINK HERE]

You have access to the Figma design through the Figma MCP server.

OBJECTIVE:

Recreate the RoenRiviera web application faithfully from the Figma
design and prepare it for integration with the existing backend
architecture.

IMPORTANT:

This is a RESPONSIVE WEB APPLICATION.

Do NOT build:
- Android
- iOS
- React Native
- Flutter
- native mobile UI

Mobile layouts in Figma represent MOBILE WEB RESPONSIVENESS.

--------------------------------------------------
DESIGN SOURCE OF TRUTH
--------------------------------------------------

Priority order:

1. Figma design + Figma MCP structured context
2. RoenRiviera frontend handoff specification
3. Existing frontend code
4. Existing project architecture

Do not replace the Figma design with a generic SaaS template.

Do not redesign the visual system without explicit instruction.

Do not invent alternate layouts when an equivalent Figma layout exists.

--------------------------------------------------
IMPLEMENTATION RULE
--------------------------------------------------

Before writing code:

1. Inspect the repository.
2. Inspect the Figma file through MCP.
3. Identify all pages.
4. Identify components.
5. Identify repeated patterns.
6. Identify typography.
7. Identify colors and variables.
8. Identify spacing.
9. Identify responsive behavior.
10. Map Figma components to reusable React components.

Then create an implementation plan.

DO NOT immediately overwrite the repository.

--------------------------------------------------
FRONTEND STACK
--------------------------------------------------

Use:

React
TypeScript
Vite
Tailwind CSS

Use reusable components and a centralized frontend architecture.

--------------------------------------------------
REQUIRED SCREENS
--------------------------------------------------

Implement the Figma designs for:

Landing
Authentication
Dashboard
Workflow Selection
Chat
Knowledge Base
Chat History
Settings
Timetable

Preserve desktop and mobile-web layouts.

--------------------------------------------------
WORKFLOW IDS
--------------------------------------------------

Keep these exact backend workflow IDs:

syllabus_rag
campus_faq
timetable

Do not rename them.

--------------------------------------------------
API BOUNDARY
--------------------------------------------------

Create a centralized API/service layer.

Suggested:

src/api/
  auth.ts
  chat.ts
  documents.ts
  history.ts
  workflows.ts

UI components must NOT directly contain:
- Gemini calls
- Groq calls
- vector search
- RAG logic
- privileged Supabase operations
- secrets

--------------------------------------------------
DESIGN PRESERVATION
--------------------------------------------------

Preserve:

- typography
- spacing
- component hierarchy
- border radius
- shadows
- colors
- workflow cards
- sidebar
- chat layout
- source cards
- buttons
- input styles
- responsive behavior

When functionality is added, extend the current visual system.

Do NOT replace an existing component with a visually unrelated implementation.

--------------------------------------------------
RESPONSIVE WEB
--------------------------------------------------

Primary target:
Desktop Web

Also support:
Tablet Web
Mobile Web

Do NOT turn this into a native app.

Do NOT spend time on native mobile development.

--------------------------------------------------
ITERATION RULE
--------------------------------------------------

When I ask for a frontend change:

1. Inspect the existing implementation.
2. Inspect the relevant Figma frame/component.
3. Determine the smallest safe code change.
4. Implement the change.
5. Preserve unrelated visuals.
6. Test responsive behavior.
7. Do not rebuild the entire page unless necessary.

Example:

If I say:
"Make the source citation card smaller"

Only modify the source citation component and affected responsive styles.

Do not redesign the dashboard.

--------------------------------------------------
BACKEND INTEGRATION
--------------------------------------------------

Later integrate with:

/api/v1/chat
/api/v1/chat/history
/api/v1/documents
/api/v1/workflows

The frontend should consume stable response schemas.

--------------------------------------------------
IMPORTANT
--------------------------------------------------

Figma is the VISUAL SOURCE OF TRUTH.

The exported React application is the IMPLEMENTATION.

Do not continuously regenerate the whole frontend.

Make incremental changes.

RoenRiviera should remain visually consistent throughout development.
Step 7 — Don't ask Antigravity to build everything in one shot

This is important.

Even with MCP, don't do:

"Build the whole app."

Instead go in stages.

Stage A — Analyze
Read the Figma design using MCP.
Do not code yet.
Map the design system, pages, components, responsive states,
assets and repeated patterns.
Stage B — Design system
Implement the RoenRiviera design tokens and reusable components.
Do not build all pages yet.
Stage C — App shell
Implement sidebar, topbar, navigation, responsive shell.
Stage D — Core pages
Landing
Auth
Dashboard
Chat
Stage E — Secondary pages
Knowledge Base
History
Settings
Timetable
Stage F — Integration
Connect the existing API contracts.

This makes debugging much easier.

Step 8 — Use Figma MCP continuously, not just once

This is the really powerful part.

Figma's MCP can be used to provide design context during development; Figma also supports write capabilities in some plans, allowing agents to create/update Figma content, although you don't need that capability for this hackathon.

So later you can ask:

"Compare the current Chat screen implementation against the Figma Chat frame. Identify visual mismatches in spacing, typography, sizing, and component structure. Fix only those mismatches."

That's much better than:

"Make the chat page look better."

Step 9 — Keep Figma and code synchronized

I recommend this rule:

Figma controls visual intent.
React controls implementation.

For a major redesign:

Figma
 ↓
MCP
 ↓
Antigravity
 ↓
React

For a tiny functional change:

Antigravity
 ↓
React

But if the change materially alters the design, update Figma afterward so you don't end up with two different versions.

Step 10 — Your file structure

I'd use:

RoenRiviera/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── state/
│   │   ├── assets/
│   │   └── utils/
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── workflows/
│   │   ├── rag/
│   │   ├── auth/
│   │   ├── database/
│   │   └── ...
│
├── docs/
│   ├── ROENRIVIERA_FIGMA_HANDOFF.md
│   ├── ROENRIVIERA_BUILD_PLAN.md
│   └── FIGMA_REFERENCE.md
│
├── .env.example
└── README.md

And FIGMA_REFERENCE.md could simply contain:

# RoenRiviera Figma Reference

Figma:
[YOUR FIGMA URL]

Source of truth:
Figma + Figma MCP

Product:
RoenRiviera

Frontend:
Responsive Web Application

Do not implement:
Native Android/iOS
One important clarification about "exactly the same"

You should aim for high-fidelity implementation, but don't expect a perfect 1:1 transfer automatically.

The MCP gives the agent structured design context, but the agent still generates the actual frontend code. Figma itself notes that the MCP server sends design context/details to agentic tools; it doesn't simply hand over a finished application.

So the practical process is:

Figma design
   ↓
MCP context
   ↓
Antigravity implementation
   ↓
Browser preview
   ↓
Compare
   ↓
Refine
   ↓
Compare again

That's how you'll get the closest result.

⭐ And one thing I strongly recommend for RoenRiviera

Since you've already designed it in Figma, do not rebuild the frontend in Google Stitch at all.

Your pipeline is now:

                 ROENRIVIERA
                      │
                 YOUR FIGMA
                      │
                Figma MCP
                      │
                      ▼
                 ANTIGRAVITY
                      │
          ┌───────────┴───────────┐
          │                       │
     FRONTEND                  BACKEND
     React/TS                  FastAPI
     Tailwind                  Supabase
                              pgvector
                              Gemini/Groq
          │                       │
          └───────────┬───────────┘
                      ▼
              ROENRIVIERA WEB

That is the setup I would use.

Your next move

Don't start coding yet. First connect Figma MCP to Antigravity and run the read-only verification prompt. Once Antigravity successfully understands your Figma file, then give it the master implementation prompt and start with the design system + AppShell, not the whole application at once. Figma's official setup docs currently recommend the remote MCP server for most users, and Antigravity supports MCP installation/configuration.