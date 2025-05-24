Please generate a comprehensive, professional README.md (or Features.md) for this codebase.

For each **feature or module implemented so far** (e.g., Auth, Products, Cart, Orders, Dashboard, Profile, Reviews, Content, Notifications, Admin, UI Primitives, Utilities, etc):

1. **Feature Overview**  
   - Briefly describe what this feature does and why it’s important in a real-world app.

2. **Architecture & Optimization**  
   - Explain how this feature is architected (Redux Toolkit slice, RTK Query endpoints, strict TypeScript types, UI components).
   - List any advanced patterns, optimization techniques, or best practices applied (memoization, virtualization, debounced search, error boundaries, responsive UI, code splitting, normalized state, etc).

3. **Files & Folders**  
   - List the main files/folders relevant to this feature, including:
     - Redux slice file(s)
     - RTK Query API service (if any)
     - Key UI components (with file paths)
     - Any custom hooks, utilities, or test files
   - Specify how this feature is “plugged into” the main app (e.g., registered in store, routed in App.tsx, uses global UI providers).

4. **Usage & Debugging Tips**  
   - Give a quick guide on how to test/use this feature in the UI.
   - List any important debugging/inspection steps (Redux DevTools, React DevTools, logging).

---

At the top, include:

- **Project Overview** (tech stack, integration philosophy: single Redux store, global UI, barrels, absolute imports, etc.)
- **Global Folder Structure** with a short description of each main folder
- **How to clone, run, and test the project** (npm scripts, config, etc.)
- **Dev best practices/standards followed** (e.g., TypeScript strict, E2E coverage, lint/prettier, accessibility)

---

**Format this as a deeply detailed README.md or Features.md suitable for onboarding new devs, interviews, or learning module-by-module.**

**Make sure each feature explanation is detailed enough that I could pick any part of the app, study its files, and fully understand what’s going on and why it’s built this way.**

