'use client'
import { useState, useEffect, useRef } from "react";

export default function OptimizedSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchValue(query), 1000);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    fetch(`/api/search?q=${debouncedSearchValue}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setError(null);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Request was aborted");
        } else {
          setError(err);
          setResults([]);
        }
      });
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [debouncedSearchValue]);

  return (
    <div>
      <input value={query} className="border border-solid border-black mt-10" onChange={(e) => setQuery(e.target.value)} />
      {error && <p> {error.message}</p>}
      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

//   **Required Fixes:**

//   1. **Debounce Search Input** - Prevent API spamming
//   2. **Race Condition Handling** - Cancel outdated requests
//   3. **Memory Leak Prevention** - Cleanup abandoned requests
//   4. **Error Boundaries** - Add error handling
//   5. **Performance Optimization** - Memoize/cache results

//   **Evaluation Criteria:**

//   - Understanding of React hooks lifecycle
//   - Asynchronous state management
//   - Optimization techniques
//   - Error handling strategies

//   ---
