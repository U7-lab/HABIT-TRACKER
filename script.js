// State Management
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let currentWeekOffset = 0; // 0 means current week, -1 previous week, etc.

// DOM Elements
const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-input');
const tableHeader = document.getElementById('table-header');
const tableBody = document.getElementById('table-body');
const emptyState = document.getElementById('empty-state');
const prevWeekBtn = document.getElementById('prev-week');
const nextWeekBtn = document.getElementById('next-week');
const thisWeekBtn = document.getElementById('this-week');

// Helper: Get dates of the week based on offset (Starts on Monday)
function getWeekDates(offset = 0) {
  const dates = [];
  const today = new Date();
  
  // Calculate current Monday
  const dayOfWeek = today.getDay(); 
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Handle Sunday (0)
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + distanceToMonday + (offset * 7));
  
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    dates.push(nextDay);
  }
  return dates;
}

// Format date to YYYY-MM-DD string for storage key consistency
function formatDateKey(date) {
  return date.toISOString().split('T')[0];
}

// Calculate Current Consecutive Streak
function calculateStreak(habit) {
  const today = new Date();
  let streak = 0;
  let checkDate = new Date(today);

  // Check if today is completed
  const todayKey = formatDateKey(checkDate);
  const completedToday = habit.history && habit.history[todayKey];

  // If today isn't checked, see if yesterday was checked to preserve ongoing streak
  if (!completedToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Count backwards
  while (true) {
    const key = formatDateKey(checkDate);
    if (habit.history && habit.history[key]) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// Save to LocalStorage
function saveState() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

// Render the UI Grid
function render() {
  const weekDates = getWeekDates(currentWeekOffset);
  const todayKey = formatDateKey(new Date());

  // 1. Render Table Header
  let headerHtml = '<th>Habit Name</th>';
  weekDates.forEach(date => {
    const isToday = formatDateKey(date) === todayKey;
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    headerHtml += `<th class="${isToday ? 'today-col' : ''}">${dayName} ${dayNum}</th>`;
  });
  headerHtml += '<th>Actions</th>';
  tableHeader.innerHTML = headerHtml;

  // 2. Render Table Body / Empty State Check
  if (habits.length === 0) {
    emptyState.classList.remove('hidden');
    tableBody.innerHTML = '';
    return;
  } else {
    emptyState.classList.add('hidden');
  }

  let bodyHtml = '';
  habits.forEach((habit, habitIndex) => {
    const streak = calculateStreak(habit);
    bodyHtml += `<tr>`;
    bodyHtml += `<td class="habit-name-cell">${habit.name} <span class="streak-badge">🔥 ${streak}</span></td>`;
    
    // Render 7 day checkboxes
    weekDates.forEach(date => {
      const dateKey = formatDateKey(date);
      const isChecked = habit.history && habit.history[dateKey] ? 'checked' : '';
      const isToday = dateKey === todayKey;
      
      bodyHtml += `
        <td class="${isToday ? 'today-col' : ''}">
          <label class="checkbox-container">
            <input type="checkbox" data-habit="${habitIndex}" data-date="${dateKey}" ${isChecked}>
            <span class="checkmark"></span>
          </label>
        </td>
      `;
    });

    bodyHtml += `<td><button class="btn-delete" data-index="${habitIndex}">Delete</button></td>`;
    bodyHtml += `</tr>`;
  });
  
  tableBody.innerHTML = bodyHtml;
}

// Event Listeners
habitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = habitInput.value.trim();
  if (!name) return;

  habits.push({
    name: name,
    history: {} // Store format: { "2026-05-21": true }
  });

  habitInput.value = '';
  saveState();
  render();
});

tableBody.addEventListener('change', (e) => {
  if (e.target.matches('input[type="checkbox"]')) {
    const habitIndex = e.target.dataset.habit;
    const dateKey = e.target.dataset.date;
    
    if (!habits[habitIndex].history) {
      habits[habitIndex].history = {};
    }
    
    if (e.target.checked) {
      habits[habitIndex].history[dateKey] = true;
    } else {
      delete habits[habitIndex].history[dateKey];
    }
    
    saveState();
    render(); // Rerender to instantly update streak badges smoothly
  }
});

tableBody.addEventListener('click', (e) => {
  if (e.target.matches('.btn-delete')) {
    const index = e.target.dataset.index;
    if (confirm('Are you sure you want to delete this habit?')) {
      habits.splice(index, 1);
      saveState();
      render();
    }
  }
});

// Week Navigation Setup
prevWeekBtn.addEventListener('click', () => { currentWeekOffset--; render(); updateWeekHighlight(); });
nextWeekBtn.addEventListener('click', () => { currentWeekOffset++; render(); updateWeekHighlight(); });
thisWeekBtn.addEventListener('click', () => { currentWeekOffset = 0; render(); updateWeekHighlight(); });

function updateWeekHighlight() {
  if (currentWeekOffset === 0) {
    thisWeekBtn.classList.add('active-week');
  } else {
    thisWeekBtn.classList.remove('active-week');
  }
}

// Initial Kickoff
render();