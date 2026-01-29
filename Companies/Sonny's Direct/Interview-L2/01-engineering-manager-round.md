# Engineering Manager Round - Prep (Sonny's Direct)

Use this as your script + checklist. Keep answers crisp and structured.

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Coverage Checklist
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
- [x] Your Intro (2-3 min pitch)
- [x] Challenge story 1 (5-7 min) — MVP rescue
- [x] Challenge story 2 (5-7 min) — legacy debugging
- [x] Role fit (why you / why this role)
- [x] Execution & ownership
- [x] Collaboration & communication
- [x] Conflict & stakeholder management
- [x] Technical decision-making (tradeoffs)
- [x] Quality mindset (testing, reviews, reliability)
- [x] Performance & debugging mindset
- [x] Leadership & mentorship
- [x] Failures, learnings, and feedback
- [x] Career goals & motivation
- [x] Questions to ask the manager (prepared list)

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Your Intro (2-3 min pitch)
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
**Template**
- Present: role, domain, what you build
- Core strengths: 2-3 bullets (React, performance, architecture, quality)
- Proof: 1 quantified impact
- What you want next: why this role/team

**Intro script (aim ~60–90s)**
“Hi, I’m Shubham. I have 4+ years of experience building modern web applications with React and TypeScript, and I’m currently a Senior Frontend Engineer / frontend lead at Digitalpha. I work end-to-end, turning requirements into shipped features—while also owning the frontend foundations that keep the product scalable.

In my day-to-day, I lead frontend architecture and state-management decisions, collaborate closely with backend, design, and stakeholders, and mentor junior developers. My core strengths are designing maintainable React patterns, debugging performance issues with a measurement-first approach.

What I’m excited about in Sonny’s Direct is the product impact: it’s **B2B ecommerce + customer self-serve**, where performance, reliability, and clear UX directly affect revenue and day-to-day operations. I’m looking for a role where I can own complex UI experiences and work cross-functionally” 

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Challenges (Pick 2)
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
**Template (5-7 min)**
- Problem: what was broken / needed
- Context: constraints (time, legacy, scale, stakeholders)
- Your ownership: what you personally drove
- Design: options considered + tradeoff
- Execution: milestones, risks, how you shipped
- Results: metrics + user/business impact
- Reflection: what you’d improve next time

**Sample prompts to fill**
- Challenges 1:
  - Script: “
    One project I’m proud of was an MVP rescue. The initial contractor delivery wasn’t meeting expectations and the engagement was at risk. We needed a working MVP quickly to demo and regain stakeholder confidence. The constraints were a tight timeline, incomplete handoff context, and requirements that were still evolving.

    I took ownership, agreed on a clear MVP scope, and drove delivery with backend and design while keeping lightweight quality checks. 
    The key call was: do we patch the existing code quickly, or rebuild a clean, minimal end-to-end core flow? 
    I chose the rebuild and pushed non-critical features out.
    We shipped the MVP in **[6 weeks]**, the demo **retained the client**, and we secured continued development. 
    My main learnings were: define success upfront with simple metrics, and after shipping, do a short cleanup pass so you can keep improving safely.”

- Challenges 2:
  - Script: “
    Early in my career, I had to debug an issue in a legacy PHP + jQuery codebase where a data-table’s headers weren’t resizing correctly. On the surface it looked like a library bug, but once I traced how the table was being generated, I noticed a pattern: across hundreds of tables, the markup was using `<td>` cells in the header instead of `<th>`.

    Rather than trying to ‘fix’ it table by table, I updated the relevant library/helper method to handle `<td>` in header rows safely, so the existing pages would behave correctly without a massive manual rewrite. That solved the resizing issue across the codebase and saved days of rework. 
    The key lesson for me was to step back, verify assumptions, and look for the smallest change that fixes the root cause at scale.”

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Role Fit (Why you / why this role)
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
**Why you? (script)**
“
I’m a strong fit because I bring strong ownership, clear communication, a quality mindset and I’m comfortable balancing speed with maintainability.

I’ve also worked closely with product managers to deeply understand the core user workflows. 
In a few cases, I’ve proactively driven decisions that improved the user experience. 
For example, when our sales managers’ relationships with subcontractors were influencing assignments and hurting outcomes across profit centers, I proposed a bidding mechanism that automatically selects the most suitable subcontractor based on relevant metrics—making the process more objective, fair, and efficient.

Overall, I bring a mix of execution + leadership habits. Strong React fundamentals, pragmatic decision-making, and cross-functional alignment that helps teams deliver reliably under pressure.”

**Why this role? (script)**
“
What I’m looking for next is a role where I can own outcomes end-to-end, not just complete tasks. 
As an engineer, I don’t want to be a tool that executes tickets; I prefer working collaboratively with product, design, and backend to achieve a clear goal and ship the right thing.

Right now I’m a senior frontend engineer building scalable React systems and driving delivery. What I want next is to go deeper on product-focused frontend engineering. I’m also intentionally strengthening my backend understanding so I can collaborate better on API contracts and make smarter tradeoffs.

This role fits because it’s exactly that: meaningful ownership of high-impact UI for a real business that directly affects revenue and operations.”

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Execution & Ownership
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
**What this section is**
- Use this when they ask things like: “How do you deliver?”, “How do you handle ambiguity?”, “How do you estimate/prioritize?”, “How do you de-risk work?”

**Script (20–30s)**
- “I start by clarifying the goal and how we’ll measure success. 
Then I plan a small end-to-end core flow, something we can ship and validate quickly and break the rest into milestones. 
Throughout, I communicate progress and tradeoffs so stakeholders can choose between speed and completeness.”

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Collaboration & Communication
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
**What this section is**
- Use this when they ask: “How do you work with others?”, “How do you collaborate with PM/design/backend?”, “How do you keep everyone aligned?”

**Script (20–30s)**
- “I align early on goals, keep interfaces explicit and share small frequent updates so there are no surprises. 
I also prefer short async updates over long meetings, and I confirm decisions in writing so the team stays aligned.”

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Conflict & Stakeholder Management
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
**What this section is**
- Use this when they ask: “Tell me about a conflict,” “How do you handle disagreement?”, “How do you manage stakeholders with different priorities?”

**Script (20–30s)**
- “When there’s disagreement, I restate the shared goal, make it objective with a quick prototype or comparison. 
Then I align on the tradeoff, and confirm the decision and next steps in writing. 
After we ship, I close the loop by sharing what we learned and whether we’d make the same choice again.”

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Technical Decision-Making (Tradeoffs)
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
**What this section is**
- Use this when they ask: “How do you make technical decisions?”, “How do you evaluate tradeoffs?”, “Tell me about a decision you made and why.”

**Script (20–30s)**
- “I clarify the goal, compare 2–3 options, pick based on impact vs complexity, and make the tradeoff explicit. 
If we choose speed, I track the follow-up work so it doesn’t become permanent debt.”

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Quality Mindset (Testing, Reviews, Reliability)
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
**What this section is**
- Use this when they ask: “How do you ensure quality?”, “What’s your approach to testing?”, “How do you prevent regressions?”

**30–45 second script (say this)**
- “In my current team, we are a small group shipping a product that was still finding its market fit. 
In that phase, we made a conscious tradeoff: prioritize delivery speed while managing risk through lightweight quality gates, and production safety measures like staged rollouts.”
- “I’m very intentional about where automation gives the most ROI. 
I typically start by adding tests around the most critical paths and the most brittle logic, then expand coverage as the product stabilizes and the pace becomes sustainable.”
- “If I join a product team with higher reliability requirements, I’m very comfortable operating in a stricter environment and clearer quality standards.”

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Performance & Debugging Mindset
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
**What this section is**
- Use this when they ask: “How do you debug performance?”, “How do you approach tricky issues?”, “What’s your debugging process?”

**Script (10s)**
- “I start with measurement (Chrome DevTools: Performance + Network, React Profiler), isolate the bottleneck (rendering/network/bundle), apply the smallest fix, then validate with before/after metrics.”

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Leadership & Mentorship (Even Informal)
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
**What this section is**
- Use this when they ask: “How do you lead without a title?”, “How do you mentor?”, “How do you raise team standards?”

**Script (10s)**
- “I lead by helping others move faster: I give clear, kind reviews, jump in quickly when someone is stuck, share concrete next steps, and keep communication simple so the team stays focused and calm.”

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Failures, Learnings, Feedback
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
**What this section is**
- Use this when they ask: “Tell me about a failure,” “What feedback did you get?”, “What did you learn and change?”

**Script (10s)**
- “Recently I missed calling out a deprecated component in our routine call, and it slowed the team during a feature. I fixed it by going back to a simple habit: writing down key call-outs/tasks daily and explicitly sharing deprecations in team updates, not just in commits.”

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Career Goals & Motivation
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
**What this section is**
- Use this when they ask: “Where do you want to grow?”, “What motivates you?”, “What’s next for you?”

**Script (10s)**
- “I want to grow as a product-focused senior frontend engineer, owning frontend architecture, performance, and delivery quality and also mentoring others to raise the bar across the team.”

---
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
## Questions to Ask the Engineering Manager
★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
- “What does success look like in the first 30/60/90 days?”
- “What are the biggest technical pain points in the frontend today?”
- “How do you handle tech debt vs delivery pressure?”
- “How are code reviews and quality standards enforced here?”
- “What’s the team’s roadmap for performance, testing, and architecture improvements?”

