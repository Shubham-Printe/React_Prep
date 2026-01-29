# Higher-Order Components (HOCs)

**Definition**: A function that takes a component and returns a *new* component.
`const EnhancedComponent = withAuth(ProfilePage);`

**Purpose**: To share logic between components (Cross-Cutting Concerns).
*   Authentication (Redirect if not logged in).
*   Logging (Log every time component mounts).
*   Data Fetching (Inject data as props).

---

## 1. The Standard Pattern

```javascript
// 1. The HOC Function (starts with 'with')
function withAuth(WrappedComponent) {
  
  // 2. Returns a new Component
  return function(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 3. Add the shared logic
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) window.location.href = '/login';
      else setIsLoggedIn(true);
    }, []);

    if (!isLoggedIn) return null; // Or a spinner

    // 4. Render the wrapped component WITH original props
    return <WrappedComponent {...props} user={{ name: 'Admin' }} />;
  };
}

// Usage
const Profile = (props) => <h1>Welcome {props.user.name}</h1>;
const ProtectedProfile = withAuth(Profile);
```

---

## 2. Key Rules
1.  **Don't Mutate the Original**: Don't do `WrappedComponent.prototype.componentDidMount = ...`. Always compose by returning a new wrapper.
2.  **Pass Unrelated Props**: Always do `<WrappedComponent {...props} />`. If you forget this, the inner component loses its props.
3.  **Display Name**: For debugging, set `EnhancedComponent.displayName = 'WithAuth(Profile)'`.

---

## 3. HOC vs Custom Hooks

Since React 16.8 (Hooks), HOCs are less common.

| Feature | HOC (`withAuth`) | Custom Hook (`useAuth`) |
| :--- | :--- | :--- |
| **Structure** | Wrapper Hell (Tree gets deep) | Flat (Inside component) |
| **Data Flow** | Injects Props | Returns Values |
| **Flexibility** | Rigid | Flexible (Can use multiple hooks easily) |

**When to still use HOCs?**
*   When using legacy Class Components.
*   When you need to conditionally **hide** the component (like `withAuth` stopping rendering entirely). Hooks run *inside*, so the component has already started rendering.








