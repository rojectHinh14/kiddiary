# KidDiary – Frontend

KidDiary is a web application that helps parents record their child’s development journey:  
moment diary, weight – height – BMI, vaccination schedule, sleep tracking, milk log, etc.

This project is the **frontend** built with **React + Vite**.

---

## Table of Contents

- [Main Features](#-main-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Environment Requirements](#-environment-requirements)
- [Install & Run](#-install--run)
- [Environment Configuration (env)](#-environment-configuration-env)
- [Scripts](#-scripts)
- [Conventions & Notes](#-conventions--notes)

---

## Main Features

### Children Management

- Children list (Children Panel):
  - Display child avatar + name.
  - **Select mode**: select multiple children and delete in bulk.
  - **Add child** button to add a new child.
- Create/update child form (`ChildForm`).
- View child details (`ChildViewDialog`).

### Moments (Diary of Moments)

- **Moments** page:
  - Show photo + description for each post.
  - Sorted by **newest date first**.
- Create new moment (upload image + description + date).
- Edit moment (change caption, change image).
- Delete moment (with confirmation dialog).
- View moments by day in `DayMomentsModal`:
  - Show list of moments for a specific day (image + description).
  - Used to quickly scan the timeline for that day.

### Health

- **Baby Overview Panel**
  - Child information: name, date of birth, age, weeks old.
  - Latest health metrics:
    - Weight (kg)
    - Height (cm)
    - BMI (calculated from weight & height history).
- **Daily Milk Log**
  - `MilkOverviewPage`:
    - Total milk intake per day.
    - List of each feeding (time, source, ml).
    - Chart of the last 7 days (using `recharts`).
    - Reference line: 1 liter/day (1000 ml).
- **Growth / Weight – Height**
  - Navigate to the child growth tracking page.
- **Vaccination**
  - Navigate to the vaccination schedule page.
- **Sleep**
  - Navigate to the sleep tracking page.

### Support Chat (ChatBox)

- Floating chat button at the bottom-right corner:
  - Small fixed chat box.
  - **Expand** button: open a large modal in the center with dimmed overlay.
  - Minimize / close chat.
- Render markdown using `react-markdown`.

---

## Tech Stack

**Build & framework**

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/) 19
- [React Router DOM](https://reactrouter.com/) v7

**UI & styling**

- [MUI](https://mui.com/) (`@mui/material`, `@mui/icons-material`)
- [Tailwind CSS](https://tailwindcss.com/)
- `@fontsource/roboto`
- `lucide-react`, `react-icons`

**State & data**

- [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit`)
- `react-redux`
- `redux-thunk`, `redux-logger`, `redux-persist`, `redux-state-sync`

**Others**

- `axios` – API calls
- `date-fns` – date & time utilities
- `lodash`
- `react-markdown`
- `recharts` – charts

**Dev tools**

- `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- `tailwindcss`, `postcss`, `autoprefixer`

---

## Folder Structure

```text
Frontend/
└─ kiddiary/
   ├─ public/
   ├─ src/
   │  ├─ components/        # Shared components (ChatBox, MomentCard, etc.)
   │  ├─ pages/             # Main pages (Moment, Health, Sleep, etc.)
   │  ├─ services/          # API calls (childService, mediaService, etc.)
   │  ├─ store/             # Redux store & slices
   │  └─ utils/             # Utility functions (buildMonthMatrix, frame, etc.)
   │
   ├─ App.jsx
   ├─ main.jsx
   ├─ axios.js
   ├─ redux.js
   ├─ App.css / index.css
   ├─ .env                  # environment config (local only, do not commit)
   ├─ .env.example          # sample env file
   ├─ vite.config.js
   ├─ package.json
   └─ ...
```
