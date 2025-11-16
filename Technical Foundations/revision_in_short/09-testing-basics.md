# Testing Basics

## Summary
Unit testing React components with Jest and React Testing Library, plus async and reducers.

## Key Concepts
- Render components, query DOM, assert behavior.
- Mock fetch/async actions.
- Test reducers as pure functions.

## Code Examples
```jsx
import { render, screen } from '@testing-library/react';
import DigitalClock from './DigitalClock';

test('renders clock', () => {
  render(<DigitalClock />);
  expect(screen.getByText(/:/)).toBeInTheDocument();
});
```

## Situational Scenarios
- Async UI: use findBy*, waitFor, and MSW for network.
- Redux: test reducers and selectors.

## Pitfalls
- Over-mocking implementation details; prefer user-centric tests.

## Checklist
- [ ] Tests assert observable behavior
- [ ] Async handled with proper RTL utilities

