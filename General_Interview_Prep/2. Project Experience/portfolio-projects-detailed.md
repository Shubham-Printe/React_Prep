# Portfolio projects — detailed blurbs

Reference copy for CV, applications, and walkthrough prep.

---

## 1. Hello Chapter — Internal Operations Platform (React SPA)

Multi-module web app for back office, sales, project management, design management, and finance—with JWT-secured REST integration, module + permission routing, lazy-loaded pages, and Redux-driven global state aligned to a separate backend API.

**Technologies:**

- React 18, TypeScript
- Redux Toolkit, Axios, Material UI v5 & MUI X (date pickers)
- Create React App (Webpack), React Router v6
- Formik & Yup, SCSS & styled-components & Emotion
- Draft.js / rich text, document preview (incl. 3D via Model Viewer)
- Jest & React Testing Library, env-cmd (dev / testing / staging builds)

---

## 2. Subcontractor Portal (Hello Chapter)

Subcontractor-facing web portal for onboarding, RFQ bids, purchase order review and e-sign, job execution (tasks, progress photos, notes, payments), and invoice submission—aligned with Hello Chapter HUB so approvals, RFQ/PO creation, and payment processing stay on the platform backend while subcontractors complete their side in the browser.

**Technologies:**

- Next.js 14, TypeScript
- REST API integration (Hello Chapter backend), Axios
- Redux Toolkit, RTK Query, Redux Persist
- Material-UI v6, Formik, Yup
- JWT + cookie-based auth, i18n
- Draft.js / rich text, document preview (incl. 3D via Model Viewer)
- SASS, standalone Next.js output (Docker-friendly)

---

## 3. 3D Solar System Explorer (React + Three.js + WebGL)

Interactive 3D solar system simulation with realistic physics, PWA capabilities, and immersive educational experience featuring real-time planetary orbits and advanced controls.

**Technologies:**

- React, Next.js, TypeScript
- Three.js, React Three Fiber, WebGL
- Material-UI, Tailwind CSS, Framer Motion
- PWA, Service Workers

**Demo:** https://react-galaxy.vercel.app/  
**Code:** https://github.com/Shubham-Printe/React-Galaxy

---

## 4. Smart PDF Document Analyzer (Full-Stack + NLP)

Full-stack document processing platform with intelligent NLP categorization, hybrid extraction system, and enterprise-grade analytics evolved from external API dependencies to cost-effective local processing.

**Technologies:**

- Next.js 15, TypeScript
- MongoDB Atlas, PDF.co API
- Compromise.js (NLP), Recharts
- Material-UI v7, React Context API
- Vercel

**Demo:** https://smart-analyser-steel.vercel.app/  
**Code:** https://github.com/Shubham-Printe/smart-analyser

---

## 5. NoteHive — Offline-First PWA (React + IndexedDB)

Modern Progressive Web App for managing markdown notes with offline-first architecture, featuring IndexedDB storage, background sync, and intelligent search capabilities.

**Technologies:**

- Next.js 15, React, TypeScript
- IndexedDB, Service Workers, Workbox
- Material UI, React Markdown
- PWA architecture

**Demo:** https://note-hive-mu.vercel.app/  
**Code:** https://github.com/Shubham-Printe/NoteHive
