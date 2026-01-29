# React Testing Roadmap Project — Setup Log

## Steps Completed
1. Scaffolded the project with Vite React template.
   - Command: `npm create vite@latest react-testing-roadmap-project -- --template react`
2. Installed project dependencies.
   - Command: `npm install`
3. Added testing dependencies.
   - Command: `npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
4. Configured Vitest and setup file.
   - Files: `vite.config.js`, `src/setupTests.js`
5. Added sample utilities, components, and tests.
   - Files: `src/utils/formatters.js`, `src/utils/formatters.test.js`
   - Files: `src/components/Counter.jsx`, `src/components/Counter.test.jsx`
   - Files: `src/components/UserProfile.jsx`, `src/components/UserProfile.test.jsx`
6. Ran the test suite successfully.
   - Command: `npm test -- --run`

## Next Steps (Planned)
1. Add CI for tests (optional).
2. Expand coverage with more integration tests.
