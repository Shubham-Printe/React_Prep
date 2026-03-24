# Team Management, Tools & Concepts — What a 5+ Year Engineer Should Know

A practical guide to how software teams are run, what tools they use, and the terms you’re expected to know when talking to managers, in interviews, or when stepping into tech lead / manager-adjacent roles.

---

## 1. How Teams Are Managed Efficiently

### High-level principles

- **Clarity of goals** — OKRs (Objectives and Key Results) or team goals are visible; everyone knows what “done” looks like.
- **Right-sized communication** — Sync when needed (stand-ups, planning), async for execution (docs, tickets, Slack).
- **Single source of truth** — Backlog, specs, and status live in one place (e.g. Jira/Linear), not in scattered chats or emails.
- **Flow over heroics** — Sustainable pace, predictable delivery, and reducing blockers matter more than last-minute hero work.
- **Feedback loops** — Retrospectives, 1:1s (one-on-ones), and metrics (velocity, cycle time, DORA [DevOps Research and Assessment: deployment frequency, lead time, MTTR, change failure rate]) used to improve.

**Brief understanding of these terms:**

- **Retrospectives** — A dedicated meeting (often at the end of a sprint) where the team reflects on what went well, what didn’t, and what to try differently next time. Focus is on process and behaviour, not blame.
- **1:1s (one-on-ones)** — Regular private meetings between an individual and their manager (or tech lead). Used for career growth, expectations, feedback, and raising concerns in a safe setting.
- **Velocity** — How much work the team typically completes in a sprint (e.g. in story points or number of items). Used to plan future sprints and set realistic commitments.
- **Cycle time** — Time from when work on an item starts until it’s done (e.g. from “In progress” to “Done”). Shorter cycle time usually means faster delivery and fewer bottlenecks.
- **DORA metrics** — Four metrics from DevOps Research and Assessment used to measure delivery and reliability:
  - **Deployment frequency** — How often you ship (e.g. daily vs weekly). Higher often means smaller, lower-risk changes.
  - **Lead time** — Time from code commit to running in production. Shorter means faster feedback and value to users.
  - **MTTR (Mean Time to Recovery)** — Average time to restore service after an incident. Lower means you recover from failures faster.
  - **Change failure rate** — Percentage of releases that cause a production incident or need a fix. Lower means more stable releases.

### Practices that show up everywhere

| Practice | What it is | Why it helps |
|----------|------------|--------------|
| **Stand-up / Daily sync** | Short (e.g. 15 min) daily check-in: what I did, what I’ll do, blockers. | Alignment and quick unblocking without long meetings. |
| **Sprint planning** | Team commits to a set of work for a fixed period (e.g. 2 weeks). | Predictability and scope control. |
| **Backlog grooming / refinement** | Regularly clarifying, estimating, and prioritizing backlog items. | Prevents “big unknown” items from blowing up mid-sprint. |
| **Retrospective** | End-of-sprint (or periodic) session: what went well, what didn’t, what we’ll try next. | Continuous improvement, not blame. |
| **1:1s** | Recurring 1:1 between report and manager (or tech lead). | Career, growth, concerns, and expectations. |
| **WIP (Work In Progress) limits** | Cap on how many items can be “in progress” at once (Kanban). | Reduces context-switching and half-done work. |

### What “efficient” usually means in practice

- **Predictable delivery** — Stakeholders get a reliable sense of when things ship.
- **Fewer surprises** — Risks and blockers surface early.
- **Less rework** — Requirements and acceptance criteria are clear before build.
- **Healthy team** — Sustainable pace, psychological safety, and clear ownership.

---

## 2. Industry Tools (Common Stack)

### Work & project management

| Tool | Typical use | You should know |
|------|-------------|------------------|
| **Jira** | Issues, sprints, backlogs, boards (Scrum/Kanban), reporting. | Epics, stories, tasks, sprints, boards, filters, basic reporting. |
| **Linear** | Modern issue tracking, cycles, roadmaps; popular in startups. | Issues, cycles, projects, keyboard-first workflow. |
| **Asana** | Task and project management, timelines. | Tasks, projects, dependencies, timelines. |
| **Monday.com** | Workflows, boards, automations. | Boards, status columns, automations. |
| **Notion** | Docs, wikis, lightweight project tracking, runbooks. | Pages, databases, templates. |

**Jira terms at a glance:**

- **Epic** — A large initiative or theme that groups many smaller items (e.g. “User dashboard v2”). You break it into stories and track progress at a high level.
- **Story** — A single unit of user-facing or business value, often written as “As a [user], I want [X] so that [benefit].” Has acceptance criteria and is sized for one sprint.
- **Task** — A concrete piece of work (e.g. “Add API call”, “Write tests”) that belongs to a story or stands alone. Smaller than a story.
- **Sprint** — A fixed time box (e.g. 2 weeks) where the team commits to a set of stories/tasks. Has a backlog, goal, and end date.
- **Board** — Visual view of work in columns (e.g. To Do, In Progress, In Review, Done). Can be Scrum (sprint-based) or Kanban (flow-based).
- **Filters** — Saved JQL (Jira Query Language) searches to list issues by assignee, project, status, sprint, etc. Used for personal or team views.
- **Basic reporting** — Built-in reports such as sprint burndown, velocity chart, and issue breakdown by status/assignee to see progress and capacity.

### Communication & collaboration

| Tool | Typical use |
|------|-------------|
| **Slack** | Channels, threads, integrations (Jira, CI [Continuous Integration], alerts), async communication. |
| **Microsoft Teams** | Chat, meetings, file sharing; common in enterprises. |
| **Confluence** | Documentation, specs, ADRs (Architecture Decision Records), runbooks (often paired with Jira). |
| **Google Workspace** | Docs, Sheets, Meet, Drive for specs and collaboration. |

**Slack terms at a glance:**

- **Channels** — Topic or team-based chat rooms (e.g. `#frontend`, `#releases`). Public channels are visible to the org; private ones are invite-only. Keeps conversations findable and reduces inbox noise.
- **Threads** — Replies to a specific message in a channel. Keeps the main channel readable and puts follow-up in one place; you can “thread the discussion” instead of long linear chats.
- **Integrations** — Connectors to other tools (e.g. Jira, CI, PagerDuty). You get notifications (build status, new tickets, incidents) and sometimes can take actions (create Jira issue, acknowledge alert) from Slack.
- **Async communication** — Post and respond when it suits you instead of scheduling a call. Relies on clear messages and expectations so others can catch up without real-time presence.

**Confluence terms at a glance:**

- **Spaces** — Top-level containers for related content (e.g. “Engineering”, “Product”). Each space has its own hierarchy of pages and permissions.
- **Pages** — Documents inside a space. You create and nest them in a tree; they support rich text, tables, macros, and @mentions. Often used for specs, runbooks, and meeting notes.
- **Specs (specifications)** — Written descriptions of what to build: requirements, acceptance criteria, and sometimes technical design. Confluence is commonly where product and eng align before implementation.
- **ADRs (Architecture Decision Records)** — Short documents that capture an important technical or design decision, context, and consequences. Used so future teams understand why things are built a certain way.
- **Runbooks** — Step-by-step guides for operations (e.g. deploy, rollback, handle incident X). Stored in Confluence so anyone on-call can follow them; often linked from Jira tickets or alerting tools.
- **Pairing with Jira** — Confluence pages link to Jira issues (and vice versa). Specs and ADRs live in Confluence; execution and status live in Jira, so “one source of truth” for both why and what’s done.

### Engineering-specific

| Tool | Typical use |
|------|-------------|
| **GitHub / GitLab** | Code, PRs (pull requests), issues, CI/CD (Continuous Integration / Continuous Deployment), code review. |
| **Figma** | Design, handoff, component libraries. |
| **PagerDuty / Opsgenie** | On-call, incidents, escalation. |
| **Datadog, New Relic, etc.** | Observability; often referenced in post-incident and planning. |

**GitHub / GitLab terms at a glance:**

- **Repository (repo)** — Where code lives: branches, commits, and history. Can be linked to issues and CI/CD pipelines.
- **PR (pull request)** — Proposal to merge a branch into another (e.g. feature branch into `main`). Triggers discussion, code review, and often CI checks before merge.
- **Issues** — Track bugs, tasks, and feature requests. Can be linked to PRs and milestones; many teams use them as the engineering backlog (or sync with Jira/Linear).
- **CI/CD (Continuous Integration / Continuous Deployment)** — On push/PR, the platform runs build, test, and sometimes deploy. CI = “does it pass?”; CD = “ship it to an environment.” Reduces manual release risk.
- **Code review** — Peers comment on the PR’s diff (logic, style, security). Comments can be resolved; approval is often required before merge. Used for quality and knowledge sharing.

**Figma terms at a glance:**

- **Design** — UI mockups, flows, and prototypes. Designers create screens and states; engineers use them as the visual spec.
- **Handoff** — Moving from design to implementation: dev mode (or inspect) shows specs, spacing, colors, and assets so engineers can implement accurately without guessing.
- **Component libraries** — Reusable UI components (buttons, cards, inputs) defined in Figma and often mirrored in code. Keeps design and front-end consistent and speeds up both design and build.

**PagerDuty / Opsgenie terms at a glance:**

- **On-call** — Rotating responsibility to respond to alerts and incidents outside work hours. Schedules (e.g. weekly rotation) define who is primary and who escalates.
- **Incidents** — Events that need a response (e.g. outage, critical bug). Created from alerts or manually; have severity, status, and a timeline. Often linked to postmortems and Jira.
- **Escalation** — If the on-call person doesn’t acknowledge or resolve in time, the alert moves to the next person or tier. Policies define timeouts and escalation paths so issues don’t go unanswered.

**Datadog / New Relic (observability) terms at a glance:**

- **Observability** — Ability to understand system behaviour from the outside using data: logs, metrics, and traces. “Can we answer what went wrong and where without adding more instrumentation on the spot?”
- **Logs** — Discrete events or messages (e.g. errors, request logs). Search and filter to debug issues; often correlated with traces and metrics.
- **Metrics** — Numeric measurements over time (e.g. request rate, latency, error rate, CPU). Dashboards and alerts are built on metrics; SLOs are usually metric-based.
- **Traces** — Request flow across services (e.g. API → auth → DB). Show latency per step and help find bottlenecks; key for distributed systems.
- **Post-incident** — After an outage or incident, teams use observability (logs, metrics, traces) to reconstruct what happened and feed into blameless postmortems and action items.
- **Planning** — Capacity and performance planning use historical metrics and trends (e.g. traffic growth, p99 latency) to decide scaling and tech debt priorities.

### Concepts that span tools

- **Backlog** — Ordered list of work to be done (stories, bugs, chores).
- **Sprint / cycle** — Time-boxed period of committed work.
- **Epic** — Large initiative broken into many stories.
- **Story / ticket** — One unit of work with clear acceptance criteria.
- **Board** — Visual columns (e.g. To Do, In Progress, In Review, Done).
- **Velocity** — Amount of work completed per sprint (often in story points).
- **Cycle time** — Time from “started” to “done” for an item.
- **Burndown / burnup** — Charts showing remaining work over time.

---

## 3. Terms & Concepts You Should Know (5+ Years)

### Delivery & process

- **Agile** — Iterative, incremental delivery with frequent feedback (see your Development Process doc for Scrum/Kanban).
- **Scrum** — Sprints, Scrum Master, Product Owner, backlog, refinement, retrospective.
- **Kanban** — Flow-based; boards, WIP limits, cycle time; no fixed sprints.
- **Waterfall** — Sequential phases (requirements → design → build → test → deploy); when and why it’s still used.
- **SAFe (Scaled Agile Framework) / LeSS (Large-Scale Scrum)** — Scaling Agile to many teams; good to know by name and one-line description.
- **Sprint** — Time-box (e.g. 2 weeks) of committed work.
- **Story points** — Relative estimate of effort (not hours); used for planning and velocity.
- **Velocity** — Average story points (or count) completed per sprint.
- **Capacity** — How much the team can do in a period (accounting for leave, meetings, support).
- **Scope creep** — Uncontrolled growth of requirements; how you push back (e.g. “backlog it,” “reprioritize”).
- **Technical debt** — Shortcuts that slow future work; how you balance with features (e.g. allocation in sprint, dedicated sprints).

### Roles & structure

- **Tech Lead** — Technical ownership: design, quality, unblocking; may or may not do people management.
- **Engineering Manager (EM)** — People management: 1:1s, growth, hiring, performance; may still code or not.
- **Product Manager (PM)** — What to build and why; roadmap, priorities, stakeholders.
- **Product Owner (PO)** — In Scrum: backlog ownership, acceptance criteria, ordering.
- **Scrum Master** — Facilitates process: stand-ups, retros, removing blockers; not the “boss” of the team.
- **Stakeholder** — Anyone with an interest in the outcome (e.g. business, support, other teams).
- **Matrix organization** — People report to one manager but work in another team/project; dual reporting.

### Goals & metrics

- **OKR (Objectives and Key Results)** — Objectives (qualitative) + measurable key results; often quarterly.
- **KPI (Key Performance Indicator)** — Metric used to track success (e.g. uptime, conversion, error rate).
- **SLA (Service Level Agreement)** — Commitment to users/customers (e.g. 99.9% uptime).
- **SLO (Service Level Objective)** — Internal target (e.g. p99 latency < 200 ms).
- **SLI (Service Level Indicator)** — Raw metric that feeds SLOs (e.g. error rate, latency).
- **DORA (DevOps Research and Assessment) metrics** — Deployment frequency, lead time, MTTR (Mean Time to Recovery), change failure rate; used to measure delivery and reliability.
- **MTTR (Mean Time to Recovery)** — Average time to restore service after an incident.
- **Throughput** — Work completed per unit time (e.g. stories per sprint).

### Planning & prioritization

- **Roadmap** — High-level plan of what will be built and when (quarters, themes).
- **Backlog refinement / grooming** — Clarifying and estimating backlog items so they’re sprint-ready.
- **Prioritization frameworks** — RICE (Reach, Impact, Confidence, Effort), MoSCoW (Must/Should/Could/Won’t), value vs effort.
- **MVP (Minimum Viable Product)** — Smallest version that delivers value and validates assumptions.
- **POC (Proof of Concept)** — Small experiment to validate feasibility.
- **Spike** — Time-boxed research or exploration; outcome is learning, not a shippable feature.

### Team health & behavior

- **Psychological safety** — Team can take risks and admit mistakes without fear.
- **1:1 (one-on-one)** — Recurring private meeting between report and manager.
- **Performance review / calibration** — Formal evaluation and often cross-team calibration of ratings.
- **360 feedback** — Input from peers, reports, and manager (not only top-down).
- **Retrospective** — Reflecting on process and behavior to improve.
- **Blameless postmortem** — After an incident: what happened, why, what we’ll change; focus on system, not individuals.
- **Runbook** — Step-by-step instructions for operations (deploy, rollback, incident response).

### Cross-team & org

- **Stakeholder management** — Communicating, setting expectations, and negotiating with people who care about the outcome.
- **Dependency** — Your team needs another team’s work (or vice versa); how you track and escalate.
- **Alignment** — Shared understanding of goals and priorities across teams.
- **RACI (Responsible, Accountable, Consulted, Informed)** — Who is each of these for a decision or task.
- **Escalation** — When and how to raise risks or blockers to leadership.
- **Change management** — How org adopts new process, tool, or behavior.

---

## 4. Using This in Interviews

- **“How is your team structured?”** — You can ask about Tech Lead vs EM, Scrum vs Kanban, and how product and engineering work together.
- **“How do you prioritize work?”** — You can mention backlogs, refinement, and frameworks like RICE or value vs effort.
- **“How do you measure team success?”** — You can reference velocity, cycle time, DORA, SLOs, and OKRs.
- **“What tools do you use?”** — You can say you’ve used Jira/Linear, Slack, Confluence/Notion, GitHub/GitLab and ask how they use them.
- **“Tell me about a time you improved how the team worked.”** — Use a retro, better refinement, clearer acceptance criteria, or reducing WIP.

Keep this doc next to your **teamwork-leadership.md** (stories) and **development-process.md** (SDLC, Agile, quality): stories show *what you did*; this doc gives you the *language and context* of how teams and managers operate.
