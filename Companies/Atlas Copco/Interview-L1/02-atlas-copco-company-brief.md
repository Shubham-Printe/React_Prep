# Atlas Copco — Company / Product Brief (simple)

Use this file to capture quick notes about Atlas Copco before/during interviews. The goal: explain what they do in plain English and ask good questions.

## Company
- **Name**: Atlas Copco
- **What they make**: industrial equipment (compressors, vacuum systems, power tools, assembly systems)
- **Where software fits**: connected machines (Industrial IoT), monitoring/analytics, fleet/asset tracking, operator screens for factories (HMI)
- **Examples of software products**
  - Integrated Software Suite: production + quality + tracking
  - Asset Management Software: “digital twin”-style tracking + maintenance planning + cloud services
  - ALTURE®: data analysis to improve production and tool performance
  - FleetLink: tracking + maintenance alerts for equipment in the field
- **Tech keywords you may hear**: embedded/edge devices, IoT platforms, and industrial protocols like **ModbusTCP** and **MQTT**

## Business areas (high level)
- **Compressor Technique**: compressed air/gas equipment + monitoring + service software.
- **Vacuum Technique**: vacuum solutions (semiconductor/industrial) where reliability and monitoring matter a lot.
- **Industrial Technique**: assembly tools/systems where connected tools, quality checks, and traceability matter.
- **Power Technique**: portable power/flow solutions, often tracked/monitored in field conditions.

## What tends to differentiate them (talking points)
- **It’s not just hardware**: they sell uptime and efficiency too (service + data + software).
- **Long lifecycles**: customers expect years of support; compatibility and stability are big.
- **More connectivity over time**: connect machines so performance can be measured and improved (on-site + cloud).

## What Atlas Copco “does” in one line (interview phrasing)
- Builds industrial equipment and the software around it to help factories run **safer, more reliably, and more efficiently** (monitoring, insights, maintenance, operator tools).

## Where software shows up (mental model)
- **Machine/line operations**: operator screens to view status/alarms and change settings (setup, tuning, calibration).
- **Connectivity layer**: PLCs/sensors talk to a gateway; the gateway sends data to backend systems (cloud or on-site) using protocols like **ModbusTCP** or **MQTT**.
- **Data + analytics**: store readings over time, show dashboards, track efficiency metrics (like OEE), and catch issues early (predictive maintenance).
- **Asset & fleet management**: list machines, monitor health, send alerts, troubleshoot remotely, and roll out software updates.
- **Quality & traceability**: keep trustworthy logs so you can answer “what happened when” and trace a specific batch/unit if there’s a problem.

## Typical constraints for industrial UI/HMI work (talking points)
- **Reliability**: production can’t stop; the UI must work even with weak/offline networks.
- **Low-latency feel**: frequent updates; avoid UI lag/jank.
- **Safety and correctness**: strong validation and confirmation for risky actions.
- **Long-lived systems**: older hardware must keep working; changes are gradual.
- **Security**: roles/permissions, secure communication, secure updates, audit logs.

## Role context
- **Position**: Full-Stack Web Developer (UI/HMI)
- **Stack**: React (frontend) + Python (backend APIs)
- **Your fit**: strong React + Node.js background + ready to ramp on Python; good full-stack growth path.
- **Targets**: web apps that may run alongside embedded/industrial hardware
- **Protocols mentioned**: ModbusTCP, MQTT
- **Tooling**: Git, Docker, Azure DevOps, CI/CD

## What you can emphasize (talking points for - what the team should focus on?)
- **Operator-first UI**: clear flows, robust error states, accessibility, and predictable behavior.
- **Data-heavy UIs**: realtime updates, tables/charts, filters, pagination, caching.
- **Reliability habits**: retries/backoff where appropriate, good loading/empty/error states, graceful degradation.
- **Integration mindset**: clear API contracts, validation, logging/telemetry, good debugging workflows.
- **Security basics**: authentication/authorization, safe storage, audit logging, safe defaults.

## Why this role / team
- **Why Atlas Copco (ready-to-say)**
  - I like software that affects real operations (manufacturing), not just “nice-to-have” UI.
  - React UI/HMI + Python APIs + device connectivity is a strong full-stack path while still valuing frontend quality.
  - I’m comfortable building for reliability, clarity, and uptime where mistakes are costly.
- **Why this team/role**
  - I can contribute quickly on React architecture/performance and ramp on Python + protocol-driven integrations.
  - I enjoy cross-functional work (embedded/QA/product) and delivering end-to-end outcomes.

## “Why now” / impact statements (swap in metrics later)
- Reduce operator friction: “fewer clicks,” “fewer mistakes,” “faster troubleshooting.”
- Improve reliability: “fewer crashes,” “clearer alarms,” “better recovery from errors.”
- Improve performance: “stays responsive under frequent updates,” “runs well on low-power devices.”
- Improve delivery: “safer releases,” “better CI checks,” “feature flags,” “better observability.”

## Questions to ask (company-specific)
- How does the web/UI team work with embedded engineers?
- What does the end-to-end flow look like from design → build → test → deploy for an HMI feature?
- How do you test web UIs that run on/near embedded targets?
- Which protocols/data sources matter most right now (ModbusTCP, MQTT, others)?
- How do you keep up with IoT/Industry 4.0 practices across teams?

## Higher-signal questions (pick 4–6 per round)
- **Product + users**
  - Who are the main users (operators, maintenance, supervisors)? Where do they struggle today?
  - Which flows are most critical (alarms, configuration, diagnostics, calibration)? Any safety-critical UI rules?
- **Architecture**
  - What’s the usual data path from PLC/sensors to the UI? Where do you handle buffering and offline cases?
  - How do you version device capabilities/config across different machine generations?
- **Frontend**
  - How do you do “realtime” updates in React (polling vs push)? What’s the performance strategy?
  - What does “done” mean for UI quality here (performance budgets, accessibility, error handling, localization)?
- **Backend (Python)**
  - What kind of APIs are you building (REST/WebSockets/gRPC)? How do you validate and contract-test them?
  - How do you handle permissions and audit logs for operator actions?
- **Testing & release**
  - What’s your unit/integration/e2e split? Do you use simulators or protocol stubs?
  - How do you deploy updates to on-site/edge devices (rollouts, rollbacks)? How do you detect field issues quickly?
- **Team & growth**
  - What does success look like in the first 90 days?
  - How do you balance new features vs stability/tech debt?

## Quick glossary (useful for interviews)
- **HMI**: Human–Machine Interface (the operator screen for a machine/line)
- **PLC**: Programmable Logic Controller (industrial control computer)
- **ModbusTCP**: common industrial protocol over TCP (read/write registers)
- **MQTT**: lightweight “publish/subscribe” messaging for device data/events
