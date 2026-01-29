import { useState } from 'react';
import './App.css';

// -----------------------------------------------------------------------------
// BAD PRACTICE (Uncomment to see the huge bundle size in stats.html)
// -----------------------------------------------------------------------------
// Problem: Importing the default export pulls in the ENTIRE library.
// Result: Your bundle grows by ~70kb (gzipped) just for one function.
// import _ from 'lodash';

// Problem: Moment.js is a "monolith" - you can't import just one part.
// It includes all locales and legacy code.
// Result: Adds ~300kb+ (minified) to your bundle.
// import moment from 'moment';


// -----------------------------------------------------------------------------
// GOOD PRACTICE (Tree-Shakeable & Modular)
// -----------------------------------------------------------------------------
// Solution: 'lodash-es' is built as ES Modules.
// Bundlers (Vite/Webpack) can "Tree-Shake" (remove) the parts you don't use.
import { capitalize } from 'lodash-es';

// Solution: 'date-fns' is modular by default. importing 'format' only pulls in that code.
import { format } from 'date-fns';

function App() {
  const [count, setCount] = useState(0);

  // --- BAD USAGE ---
  // const title = _.capitalize('bundle analysis laboratory');
  // const now = moment().format('MMMM Do YYYY, h:mm:ss a');

  // --- GOOD USAGE ---
  // Only the code for 'capitalize' is included in the final bundle.
  const title = capitalize('bundle analysis laboratory');

  // Only the code for 'format' is included.
  const now = format(new Date(), 'MMMM do yyyy, h:mm:ss a');

  return (
    <div className="card">
      <h1>{title}</h1>
      <p>Current Time: {now}</p>
      
      <div className="control-panel">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      <p className="read-the-docs">
        <b>Experiment Instructions:</b><br/>
        1. Current State: Optimized. Run `npm run build` &rarr; check `stats.html`.<br/>
        2. To see the difference: Uncomment the "BAD PRACTICE" lines in `App.tsx` and comment out the "GOOD" ones.<br/>
        3. Run `npm run build` again &rarr; Watch the bundle explode in size!
      </p>
    </div>
  );
}

export default App;
