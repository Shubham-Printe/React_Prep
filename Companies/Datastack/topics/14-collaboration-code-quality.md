# Collaboration and Code Quality
- Code review checklist and standards
- Refactoring techniques
- Documentation and onboarding clarity

## Code Review Checklist - Q&A
1. What are the top things you check in a code review?
   - Correctness, edge cases, error handling, performance regressions, security/privacy, readability,
     and tests (added/updated).
2. What are common code review red flags?
   - Missing tests, silent failures, large unreviewable changes, unclear naming, duplicated logic, and
     ignoring existing patterns.
3. How do you give constructive feedback in reviews?
   - Be specific, propose alternatives, and separate must-fix from nice-to-have. Ask questions rather
     than impose when uncertain.

## Refactoring - Q&A
1. What is refactoring, and when should you do it?
   - Refactoring improves structure without changing behavior. Do it when code is hard to read, hard to
     test, or repeatedly changed.
2. How do you refactor safely?
   - Make small changes, keep tests passing, use commits/PRs to isolate steps, and avoid mixing features
     with refactors.
3. What are examples of high-value refactors in React?
   - Extract reusable components/hooks, simplify props/state, reduce re-renders, and split monolith
     components by responsibility.

## Documentation and Onboarding - Q&A
1. What should good project documentation include?
   - Setup steps, scripts, environment variables, architecture overview, and common workflows.
2. How do you document decisions?
   - Use decision notes with context, options considered, and the chosen path.
3. How do you help new team members ramp up quickly?
   - Give a small starter task with exact steps, explain the folder structure, and point to the most
     important files and tests they should run.
