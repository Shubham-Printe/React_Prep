# Practical Coding

## Summary
Hands-on snippets for common UI tasks.

## Digital Clock
```jsx
function DigitalClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <h2>{time.toLocaleTimeString('en-US', { hour12: false })}</h2>;
}
```

## Buggy Counter/Timer (Stale Closure Fix)
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(prev => prev + 1); // ✅ Correct
      // setCount(count + 1);     // ❌ Wrong (stale closure)
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <div>{count}</div>;
}
```

## Fetch Data & Search/Filter
```jsx
function UserSearch() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://...").then(res => res.json()).then(setData);
  }, []);

  const filtered = data.filter(u => u.name.includes(search));

  return (
    <>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.map(u => <div key={u.id}>{u.name}</div>)}
    </>
  );
}
```

## File/Image Upload with Preview
```jsx
function ImageUploader() {
  const [preview, setPreview] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };
  return (
    <>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" width="200" />}
    </>
  );
}
```

## Situational Scenarios
- Clock: interview warm-up; discuss cleanup and intervals.
- Counter: show why functional updates avoid stale closures.
- Fetch/filter: derive data in render, not separate state.
- Upload: discuss object URLs, cleanup, and validations.

## Pitfalls
- Not clearing intervals or object URLs.

## Checklist
- [ ] Clean up timers and resources
- [ ] Validate inputs and handle errors

