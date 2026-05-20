# Assessment Answers — Habit Tracker

### 1. How to run
This project runs entirely on vanilla HTML, CSS, and JavaScript. There are no external dependencies, bundlers, or servers to install.

*   **To run locally:** Simply double-click the `index.html` file to open it in any modern desktop browser. Alternatively, you can use an extension like "Live Server" in VS Code to view it over a local host.
*   **Deployment:** (If you throw this onto Vercel or GitHub Pages, put the link here! Otherwise, delete this line).

---

### 2. Stack & design choices
*   **Frontend Stack:** I chose a clean **Vanilla HTML5/CSS3/JavaScript (ES6)** stack. As a clean, lightweight option, this architecture skips heavy framework footprints (like node_modules) and guarantees instantaneous loading times. Data persistence is handled directly via browser `localStorage`.
*   **Choice of Week Day Start:** The tracker starts the week on **Monday**. Psychologically, most professional and academic "weekly cycles" begin on Monday morning. Designing the grid this way matches the mental load of starting a fresh calendar week, making weekend checkmarks feel like a rewarding completion step.
*   **Streak Calculation Logic:** The consecutive-day streak counts up to *today* if today is checked. However, if today is currently *unchecked*, the algorithm checks if *yesterday* was completed. If yesterday was checked, the current streak remains alive and visible. This prevents the streak counter from looking like a discouraging "0" the second a user wakes up in the morning before checking off their tasks.
*   **Visual Decision 1 (The Habit Row Layout):** I utilized a standard tabular horizontal row layout instead of fragmented vertical visual cards. When a user tracks up to 15 habits, stacked cards take up too much vertical space. The grid enables quick, sequential horizontal glances.
*   **Visual Decision 2 (Quiet UI & Targeted Accent Pop):** The general application interface uses silent, structural slate grays (`#e2e8f0` and `#64748b`) so it does not distract the eye. Active, completed states immediately pop out using an energetic emerald green accent (`#10b981`), giving an instant psychological dopamine hit upon completion.

---

### 3. Responsive & accessibility
*   **Responsiveness (Mobile vs. Laptop):** On a wide 1440px viewport, the grid stretches comfortably into a spacious dashboard wrapper. On a small 360px screen, the outer shell smoothly scales margins down, forms adapt vertically, and the main calendar grid utilizes an elegant `overflow-x: auto` mechanism. This lets mobile users swipe cleanly left-to-right across the week without breaking the site layout.
*   **Accessibility Handled:** The custom form input utilizes clear native placeholders alongside explicit `aria-label="New habit name"` attributes to ensure accessibility for screen readers navigating raw interactive forms.
*   **Accessibility Skipped:** Keyboard-accessible column traversal via Tab keys for individual checkboxes was intentionally bypassed. Creating custom grid cell focus trap indexing requires heavy JavaScript keyboard event listeners, which would significantly increase code complexity for this iteration.

---

### 4. AI usage
*   **Tool Used:** Gemini
*   **Prompt Given:** "Help me doing this assignment as I am a beginner and don't know much about frontend."
*   **What it provided:** It built a solid initial HTML/CSS foundation alongside clean vanilla state tracking functions utilizing JavaScript.
*   **What I modified:** The initial AI output provided a standard, generic HTML `<input type="checkbox">` which looked small and old-fashioned. I entirely rewrote the CSS logic to hide the native input element and replaced it with a custom `.checkmark` boundary box. I added smooth hover scaling (`transform: scale(1.05)`) and a custom CSS checkmark vector element (`:after`) to give the completion interaction a polished feel.

---

### 5. Honest gap
The historical storage logic is slightly fragile. Currently, if a user changes their system timezone or edits past habits, the historical keys mapped strictly to static strings like `"YYYY-MM-DD"` might visually shift out of alignment inside past week loops. 

With an extra day, I would rewrite the data layer to tie records to normalized Unix millisecond timestamps, mapping habit checkmarks to absolute UTC values instead of local string variants.