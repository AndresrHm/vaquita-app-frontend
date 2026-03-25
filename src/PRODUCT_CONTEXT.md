# Vaquita — Product Context & Development Guidelines

This document provides **product direction, constraints, and backlog context** for AI-assisted development (Cursor) and contributors.

---

# 🧠 Product Vision

Vaquita is **not just a Splitwise clone**.

> Vaquita is an app that eliminates the friction of tracking shared expenses and provides clarity through automation and insights.

## Core Value
- Reduce manual input
- Avoid social friction ("who owes what")
- Provide useful financial insights

## What Vaquita is NOT
- Not a social network
- Not a banking app
- Not a complex fintech platform

---

# 🎯 Target Users

- Young adults (18–35)
- Roommates
- Travel groups
- Couples
- Friends sharing expenses

---

# ⚙️ Tech Stack Constraints

Always assume:

- React + Vite
- TailwindCSS
- shadcn/ui
- Mobile-first design

## UI Rules
- Use shadcn components whenever possible
- Prefer composition over custom components
- Keep UI clean, minimal, rounded
- Avoid overengineering layouts

---

# 🎨 Design System (MANDATORY)

## Style Direction
- Soft, modern, minimal
- Rounded UI (large radius)
- Calm color palette

## Color Tokens (DO NOT CHANGE RANDOMLY)

- Background: Cream (warm neutral)
- Primary: Soft brown (can evolve to green/blue later)
- Secondary: Soft peach
- Cards: White

## Design Principles
- High readability
- Clear hierarchy
- Avoid visual clutter
- Consistency over creativity

---

# 🧩 Core Features (Product Scope)

## 1. Authentication
- Login
- Register
- Session persistence

## 2. Groups (CORE)
- Create group
- Join group
- View groups list
- View group detail
- Balance calculation (who owes what)

## 3. Expenses (CORE)
- Add expense manually
- Split equally
- Split custom amounts
- Edit/delete expense

## 4. AI Scan (DIFFERENTIAL)
- Upload/scan receipt
- Extract:
  - total amount
  - date
  - items
- Autofill expense form

⚠️ Can be mocked if needed

## 5. Friends
- Add friend
- List friends
- View basic profile

## 6. Activity Feed
- Show recent actions
  - expenses added
  - payments made

## 7. Analytics (VALUE ADD)
- Monthly spending
- Category breakdown
- "Who you spend most with"

## 8. Monetization
- Freemium model
- Limit AI scans (free tier)
- Premium = unlimited scans + analytics

---

# 🧭 Routing Guidelines

Current routes:

- /login
- /register
- /groups
- /groups/scan
- /friends
- /activity
- /account

## Required Additions

- /groups/:groupId
- /groups/:groupId/add-expense
- /friends/:friendId

---

# 🧱 Development Principles

## 1. Build MVP First
Focus on:
- Groups
- Expenses
- Balances

## 2. Avoid Premature Complexity
- No advanced state management unless needed
- No microservices mindset
- Keep logic simple

## 3. Prioritize UX
- Fewer clicks > more features
- Autofill where possible
- Clear feedback to user

## 4. AI Usage Guidelines
- Must reduce friction
- Must feel useful
- Avoid "AI for the sake of AI"

---

# 📋 Backlog Priorities

## MUST HAVE (MVP)
- Auth
- Groups
- Add expense
- Balance calculation

## SHOULD HAVE
- Expense history
- Friends

## NICE TO HAVE
- AI scan
- Analytics
- Ads

---

# 🚫 Anti-Patterns (DO NOT DO)

- Overcomplicated UI
- Too many features early
- Inconsistent styling
- Ignoring mobile design
- Adding features without product value

---

# ✅ Definition of Done

A feature is complete when:

- Works end-to-end
- Has consistent UI
- Matches design system
- Is simple to use

---

# 💡 Guiding Principle

> If a feature does not reduce friction or add clarity, do not build it.

---

# 📌 Notes for AI (Cursor)

When generating code:

- Use shadcn/ui components
- Follow existing design tokens
- Keep components small and reusable
- Prefer clarity over cleverness
- Respect routing structure

---

End of file.
