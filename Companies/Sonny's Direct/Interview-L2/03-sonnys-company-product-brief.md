# Sonny’s Enterprises — Company + Product Brief (for EM interview)

This is a short, interview-only briefing: enough context to sound informed, without going deep into company history.

## 30-second summary (say this)
Sonny’s sells car wash equipment and also builds software for car wash operators. The software helps operators run one or many locations better: selling memberships, understanding how the business is doing, and seeing operational issues quickly. A big theme is “many locations, real-world network issues, and systems that must stay reliable”.

## What they build (only what matters for your interview)
### Quivio (software + hardware platform for operators)
- **Membership help**: helps car washes sell memberships, keep customers longer, and fix failed monthly payments (so customers don’t get dropped by accident).
- **Business reports**: helps owners see how each location is doing and compare locations using the same meaning for each metric.
- **Live “what’s happening right now” screen**: shows if a site is running smoothly, how busy it is, and if there are problems that need attention.
- **Day-to-day operations tools (roadmap)**: helps teams track maintenance/tasks, follow checklists, train staff, and manage supplies.

### Sonny’s Direct (B2B ecommerce)
- **What it is**: a self-serve channel to order parts/supplies.
- **Core flows**: find parts fast, see the right price for your company, place orders, track shipments, and reorder common items.

## What this implies (how an EM thinks about priorities)
- **Works in the real world**: some sites will have slow or unstable internet, so the product should degrade gracefully and recover cleanly.
- **Reliability matters**: if the system is down, operators lose money, so stability and quick recovery are important.
- **Numbers must be trusted**: reports are only useful if everyone is calculating metrics the same way.
- **Access control**: different employees can do different things, and important changes should be trackable.
- **Lots of moving parts**: multiple products/systems need to work together, and improvements often happen step-by-step.

## How to position yourself (short talk track)
- “I build frontends that stay dependable under real-world conditions: slow networks, partial failures, and large data.”
- “I’m strong at reusable UI patterns and dashboards, and I’m careful about speed and catching issues early.”
- “I prefer safe releases: small rollouts, measure impact, and expand only when things look healthy.”

## High-signal questions to ask the EM
- “What are the top 2–3 outcomes you care about most right now: growing memberships, keeping systems running, helping operators move faster, or reducing support load?”
- “Where do things break most often today: connectivity at sites, data not matching between systems, or issues in the web/mobile apps?”
- “How do you make sure everyone uses the same meaning for important numbers across locations?”
- “Which system-to-system connections cause the most pain (payments, ordering, customer accounts), and what are you doing to simplify them?”

