// State management
let habits = [];
let currentDate = new Date();

// LocalStorage keys
const STORAGE_KEY = 'habitTrackerData';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
  render();
});

// Load data from localStorage
function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    habits = JSON.parse(stored);
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('addHabitForm').addEventListener('submit', handleAddHabit);
  document.getElementById('prevWeek').addEventListener('click', () => changeWeek(-1));
  document.getElementById('nextWeek').addEventListener('click', () => changeWeek(1));
  document.getElementById('todayBtn').addEventListener('click', goToToday);
}

// Handle adding a new habit
function handleAddHabit(e) {
  e.preventDefault();
  const input = document.getElementById('habitInput');
  const name = input.value.trim();

  if (name === '') return;

  const habit = {
    id: Date.now(),
    name: name,
    createdDate: new Date().toISOString(),
    completions: {} // { 'YYYY-MM-DD': true/false }
  };

  habits.push(habit);
  saveData();
  input.value = '';
  render();
}

// Handle deleting a habit
function deleteHabit(id) {
  if (confirm('Delete this habit?')) {
    habits = habits.filter(h => h.id !== id);
    saveData();
    render();
  }
}

// Handle toggling a completion
function toggleCompletion(habitId, dateStr) {
  const habit = habits.find(h => h.id === habitId);
  if (habit) {
    if (habit.completions[dateStr]) {
      delete habit.completions[dateStr];
    } else {
      habit.completions[dateStr] = true;
    }
    saveData();
    render();
  }
}

// Navigate weeks
function changeWeek(offset) {
  currentDate.setDate(currentDate.getDate() + offset * 7);
  render();
}

// Go back to today
function goToToday() {
  currentDate = new Date();
  render();
}

// Get the start of the week (Monday)
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Format date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get an array of 7 dates starting from Monday
function getWeekDates(startDate) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

// Calculate streak for a habit
function calculateStreak(habit) {
  let streak = 0;
  const today = new Date();
  let checkDate = new Date(today);

  // Check backwards from today
  while (true) {
    const dateStr = formatDate(checkDate);
    if (habit.completions[dateStr]) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// Get display text for the week
function getWeekDisplay() {
  const weekStart = getWeekStart(currentDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const today = new Date();
  const isCurrentWeek =
    formatDate(today) >= formatDate(weekStart) &&
    formatDate(today) <= formatDate(weekEnd);

  if (isCurrentWeek) {
    return 'This Week';
  }

  const diff = Math.floor((weekStart - today) / (1000 * 60 * 60 * 24 * 7));
  if (diff === -1) return 'Last Week';
  if (diff === 1) return 'Next Week';

  const month = weekStart.toLocaleString('en-US', { month: 'short' });
  const day = weekStart.getDate();
  return `${month} ${day}`;
}

// Render the entire app
function render() {
  const emptyState = document.getElementById('emptyState');
  const trackerSection = document.getElementById('trackerSection');

  // Show/hide empty state
  if (habits.length === 0) {
    emptyState.style.display = 'block';
    trackerSection.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    trackerSection.style.display = 'block';
    renderTracker();
  }
}

// Render the tracker grid
function renderTracker() {
  const weekStart = getWeekStart(currentDate);
  const weekDates = getWeekDates(weekStart);
  const today = new Date();
  const todayStr = formatDate(today);

  // Render day headers
  const dayHeadersContainer = document.getElementById('dayHeaders');
  dayHeadersContainer.innerHTML = '';
  
  weekDates.forEach(date => {
    const dateStr = formatDate(date);
    const isToday = dateStr === todayStr;
    const dayName = date.toLocaleString('en-US', { weekday: 'short' });
    const dayDate = date.getDate();

    const headerDiv = document.createElement('div');
    headerDiv.className = `day-header ${isToday ? 'today' : ''}`;
    headerDiv.innerHTML = `
      <span class="day-name">${dayName}</span>
      <span class="date">${dayDate}</span>
    `;
    dayHeadersContainer.appendChild(headerDiv);
  });

  // Update week display
  document.getElementById('weekDisplay').textContent = getWeekDisplay();

  // Render habits
  const habitsList = document.getElementById('habitsList');
  habitsList.innerHTML = '';

  habits.forEach(habit => {
    const row = document.createElement('div');
    row.className = 'habit-row';

    // Habit name with delete button
    const nameCell = document.createElement('div');
    nameCell.className = 'habit-name';
    nameCell.innerHTML = `
      <span class="habit-name-text">${escapeHtml(habit.name)}</span>
      <button class="delete-btn" aria-label="Delete ${habit.name}" onclick="deleteHabit(${habit.id})">×</button>
    `;

    row.appendChild(nameCell);

    // Checkboxes for each day
    weekDates.forEach(date => {
      const dateStr = formatDate(date);
      const isToday = dateStr === todayStr;
      const isCompleted = habit.completions[dateStr] || false;

      const cellDiv = document.createElement('div');
      cellDiv.className = `checkbox-cell ${isToday ? 'today' : ''}`;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isCompleted;
      checkbox.setAttribute('aria-label', `${habit.name} on ${date.toDateString()}`);
      checkbox.addEventListener('change', () => toggleCompletion(habit.id, dateStr));

      cellDiv.appendChild(checkbox);
      row.appendChild(cellDiv);
    });

    // Streak counter
    const streakCell = document.createElement('div');
    const streak = calculateStreak(habit);
    streakCell.className = `streak-display ${streak > 0 ? 'active' : ''}`;
    streakCell.textContent = `${streak}🔥`;
    streakCell.setAttribute('aria-label', `${streak} day streak`);

    row.appendChild(streakCell);
    habitsList.appendChild(row);
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}