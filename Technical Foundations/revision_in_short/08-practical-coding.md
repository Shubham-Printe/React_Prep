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
- Upload: discuss object URLs, cleanup, and validations.

## Pitfalls
- Not clearing intervals or object URLs.

## Checklist
- [ ] Clean up timers and resources
- [ ] Validate inputs and handle errors

