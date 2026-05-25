# Habit Tracker — Assessment Answers

## 1. How to Run

Locally:
- Open `index.html` in any browser
- No installation needed

**Live URL:** https://habit-tracker-gvd8.vercel.app

## 2. Stack & Design Choices

**Stack:** HTML, CSS, JavaScript - no frameworks

### Two Design Decisions:

**A. Grid layout (habits as rows, days as columns)**
- Easy to see whole week pattern at once
- Streak visibility is better
- Works on both mobile and desktop

**B. Today's column highlighted**
- Helps you know "where am I now?" even in past/future weeks
- Soft blue background, not too flashy

## 3. Responsive & Accessibility

### Phone vs Laptop

**Phone (360px):**
- Day columns shrink to 36px
- Date numbers hide, only weekday shows
- Add habit form becomes vertical

**Laptop (1440px):**
- Day columns 60px
- All info fully visible
- Form is horizontal

### Accessibility

**Done well:** Keyboard navigation - every button and checkbox works with Tab, Space, Enter. Clear focus outline visible.

**Skipped:** Loading spinner - localStorage saves instantly (< 1ms), so no need.

## 4. AI Usage

I am a beginner, so I used **Claude AI** to help me build this project.

## 5. Honest Gap & How to Fix

### What's missing:

**Empty state and checkbox feedback** - currently very basic:
- Empty state just has static emoji
- Checkbox has no celebration animation

### What I would add with one more day:

1. **Empty state** - add fade-in animation, better motivating copy
2. **Checkbox feedback** - green glow when checked, streak counter pulse
3. **Micro-interactions** - grid fade effect when changing weeks
4. **Delete button** - hide until hover (less clutter)

---

## Summary

I built a habit tracker using vanilla HTML/CSS/JS with help from Claude AI. As a beginner, I learned how to make responsive design, localStorage, and accessibility features. The app works fully but needs more polish on animations and empty state to make it delightful.