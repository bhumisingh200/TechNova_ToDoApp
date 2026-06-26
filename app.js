/**
 * TechNova To-Do App & Productivity Dashboard
 * Complete state, CRUD, themes, Kanban, calendar, Pomodoro, and achievements systems.
 */

// ==========================================
// 1. STATE INITIALIZATION & LOCALSTORAGE
// ==========================================
let state = {
  tasks: [],
  settings: {
    darkMode: true,
    theme: 'blue'
  },
  currentUser: null,
  achievements: {
    'first-task': { id: 'first-task', title: 'First Steps', desc: 'Complete your first task', icon: '🏆', unlocked: false },
    'five-tasks': { id: 'five-tasks', title: 'High Five', desc: 'Complete 5 tasks', icon: '⚡', unlocked: false },
    'ten-tasks': { id: 'ten-tasks', title: 'Productivity Titan', desc: 'Complete 10 tasks', icon: '👑', unlocked: false },
    'first-pomo': { id: 'first-pomo', title: 'Focus Initiate', desc: 'Link and finish 1 Pomodoro', icon: '🍅', unlocked: false },
    'five-pomos': { id: 'five-pomos', title: 'Flow State Master', desc: 'Finish 5 Pomodoro sessions', icon: '🧘', unlocked: false },
    'theme-customized': { id: 'theme-customized', title: 'Interior Designer', desc: 'Try a different color theme', icon: '🎨', unlocked: false },
    'pinned-task': { id: 'pinned-task', title: 'High Priority', desc: 'Pin a task to keep it visible', icon: '📌', unlocked: false },
    'backup-data': { id: 'backup-data', title: 'Safe & Sound', desc: 'Export tasks backup JSON', icon: '💾', unlocked: false }
  },
  stats: {
    totalPomodoros: 0,
    dailyCompletionLog: {} // Maps 'YYYY-MM-DD' to number of completed tasks
  }
};

// Seed Starter Data if LocalStorage is empty
const defaultTasks = [
  {
    id: 'starter-1',
    title: 'Design TechNova landing page interface',
    description: 'Work on UI wireframes, gradient structures, typography, and dark mode assets.',
    priority: 'high',
    dueDate: getRelativeDateString(0),
    category: 'Work',
    tags: ['design', 'technova', 'ui'],
    status: 'doing',
    pinned: true,
    favorite: true,
    completed: false,
    pomodorosCompleted: 2
  },
  {
    id: 'starter-2',
    title: 'Prepare final presentation slides',
    description: 'Collect slides from team members and format the analytics graphs.',
    priority: 'medium',
    dueDate: getRelativeDateString(1),
    category: 'Work',
    tags: ['presentation', 'meeting'],
    status: 'todo',
    pinned: false,
    favorite: false,
    completed: false,
    pomodorosCompleted: 0
  },
  {
    id: 'starter-3',
    title: 'Review JavaScript algorithms',
    description: 'Practice array operations, data structuring, and local storage bindings.',
    priority: 'low',
    dueDate: getRelativeDateString(-1), // Overdue
    category: 'Study',
    tags: ['js', 'learning'],
    status: 'todo',
    pinned: false,
    favorite: false,
    completed: false,
    pomodorosCompleted: 0
  },
  {
    id: 'starter-4',
    title: 'Evening jog and stretching routine',
    description: '30-minute outdoor jog followed by core exercises.',
    priority: 'low',
    dueDate: getRelativeDateString(0),
    category: 'Health',
    tags: ['fitness', 'workout'],
    status: 'done',
    pinned: false,
    favorite: false,
    completed: true,
    pomodorosCompleted: 1
  }
];

// Helper: relative dates for starter tasks
function getRelativeDateString(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

// Load state from LocalStorage
function loadState() {
  const savedState = localStorage.getItem('technova_state');
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      // Merge keys to preserve missing default values
      state.tasks = parsed.tasks || [];
      state.settings = { ...state.settings, ...parsed.settings };
      state.stats = { ...state.stats, ...parsed.stats };
      if (parsed.achievements) {
        Object.keys(parsed.achievements).forEach(key => {
          if (state.achievements[key]) {
            state.achievements[key].unlocked = parsed.achievements[key].unlocked;
          }
        });
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
      state.tasks = defaultTasks;
    }
  } else {
    state.tasks = defaultTasks;
    // Log previous completion counts for demonstration graph
    const today = new Date().toISOString().split('T')[0];
    const yesterday = getRelativeDateString(-1);
    const twoDaysAgo = getRelativeDateString(-2);
    state.stats.dailyCompletionLog[today] = 1;
    state.stats.dailyCompletionLog[yesterday] = 3;
    state.stats.dailyCompletionLog[twoDaysAgo] = 2;
    saveState();
  }
}

// Save state to LocalStorage
function saveState() {
  localStorage.setItem('technova_state', JSON.stringify(state));
}

// ==========================================
// 2. AUDIO SYNTHESIZER (WEB AUDIO API)
// ==========================================
function playAudioTone(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'completion') {
      // Crisp high chime
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'achievement') {
      // Arpeggio chime
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const playTime = ctx.currentTime + index * 0.1;
        osc.frequency.setValueAtTime(freq, playTime);
        gain.gain.setValueAtTime(0.12, playTime);
      });
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } else if (type === 'pomo-end') {
      // Double alarm beep
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    console.warn('AudioContext blocked or unsupported by browser:', e);
  }
}

// ==========================================
// 3. TOAST NOTIFICATION CONTAINER
// ==========================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-message">${message}</span>`;
  
  container.appendChild(toast);

  // Auto remove toast
  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

// ==========================================
// 4. THEME & MODE CUSTOMIZER
// ==========================================
function initTheme() {
  // Apply data-theme & data-mode to <html>
  document.documentElement.setAttribute('data-theme', state.settings.theme);
  document.documentElement.setAttribute('data-mode', state.settings.darkMode ? 'dark' : 'light');

  // Set active class on dots
  document.querySelectorAll('.theme-dot').forEach(dot => {
    if (dot.getAttribute('data-theme') === state.settings.theme) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Toggle Sun/Moon icons
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  if (state.settings.darkMode) {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  } else {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  }
}

function handleThemeChange(e) {
  const clickedTheme = e.target.getAttribute('data-theme');
  if (!clickedTheme) return;

  state.settings.theme = clickedTheme;
  saveState();
  initTheme();
  
  // Refresh chart themes dynamically
  renderCharts();
  
  // Achievement evaluation
  triggerAchievementCheck('theme-customized');
  showToast(`Theme changed to ${clickedTheme.toUpperCase()}`, 'success');
}

function handleModeToggle() {
  state.settings.darkMode = !state.settings.darkMode;
  saveState();
  initTheme();
  
  // Refresh charts
  renderCharts();
  showToast(`Switch to ${state.settings.darkMode ? 'Dark' : 'Light'} Mode`, 'info');
}

// ==========================================
// 5. VIEW NAVIGATION & PANEL TOGGLERS
// ==========================================
let activeView = 'dashboard';
let activeCategory = null;
let activeTag = null;
let activeSearchQuery = '';

function switchView(targetView) {
  activeView = targetView;
  
  // Update sidebar buttons
  document.querySelectorAll('.sidebar-menu .nav-item').forEach(btn => {
    if (btn.getAttribute('data-view') === targetView) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update sections
  document.querySelectorAll('.view-panel').forEach(panel => {
    if (panel.id === `view-${targetView}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  // Render content depending on active pane
  refreshActiveViewContent();
}

function refreshActiveViewContent() {
  if (activeView === 'dashboard') {
    renderDashboard();
  } else if (activeView === 'list') {
    renderTaskList();
  } else if (activeView === 'kanban') {
    renderKanbanBoard();
  } else if (activeView === 'calendar') {
    renderCalendar();
  } else if (activeView === 'achievements') {
    renderAchievements();
  }
  
  // Update overall header task stats and dropdown items
  updateHeaderWidgets();
}

// Update counters in sidebar categories, tags cloud and linked task selectors
function updateHeaderWidgets() {
  // Update categories badge count
  const categories = ['Work', 'Personal', 'Study', 'Health'];
  const categoryContainer = document.getElementById('sidebar-categories');
  if (categoryContainer) {
    categoryContainer.innerHTML = categories.map(cat => {
      const count = state.tasks.filter(t => t.category === cat && !t.completed).length;
      const isActive = activeCategory === cat ? 'active' : '';
      let emoji = '🏢';
      if (cat === 'Personal') emoji = '🏠';
      if (cat === 'Study') emoji = '📚';
      if (cat === 'Health') emoji = '💪';

      return `
        <button class="category-btn ${isActive}" data-category="${cat}">
          <span class="category-name-wrap">${emoji} ${cat}</span>
          <span class="category-count">${count}</span>
        </button>
      `;
    }).join('');
  }

  // Update popular tags cloud
  const tagCounts = {};
  state.tasks.forEach(t => {
    if (t.tags && Array.isArray(t.tags)) {
      t.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  const tagsContainer = document.getElementById('sidebar-tags');
  if (tagsContainer) {
    const sortedTags = Object.keys(tagCounts).sort((a,b) => tagCounts[b] - tagCounts[a]).slice(0, 8);
    if (sortedTags.length === 0) {
      tagsContainer.innerHTML = `<span class="empty-state" style="padding: 10px 0; font-size: 11px;">No tags yet</span>`;
    } else {
      tagsContainer.innerHTML = sortedTags.map(tag => {
        const isActive = activeTag === tag ? 'active' : '';
        return `<button class="tag-badge ${isActive}" data-tag="${tag}">#${tag}</button>`;
      }).join('');
    }
  }

  // Populate linked Pomodoro task select options
  const pomoLinkSelect = document.getElementById('pomo-task-link');
  if (pomoLinkSelect) {
    const activeTasks = state.tasks.filter(t => !t.completed);
    const prevVal = pomoLinkSelect.value;
    
    let optionsHTML = '<option value="">No linked task</option>';
    optionsHTML += activeTasks.map(t => `<option value="${t.id}">${t.title}</option>`).join('');
    pomoLinkSelect.innerHTML = optionsHTML;
    
    // Maintain selection if still active
    if (activeTasks.some(t => t.id === prevVal)) {
      pomoLinkSelect.value = prevVal;
    } else {
      pomoLinkSelect.value = '';
    }
  }

  // Update notification panel indicators
  updateNotificationsPanel();
}

// ==========================================
// 6. SEARCH & FILTER CONTROLS
// ==========================================
function filterTasksArray(tasksList) {
  return tasksList.filter(task => {
    // 1. Search Query Match
    let queryMatch = true;
    if (activeSearchQuery) {
      const q = activeSearchQuery.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(q);
      const descMatch = task.description.toLowerCase().includes(q);
      const tagsMatch = task.tags.some(tag => tag.toLowerCase().includes(q.replace('#', '')));
      queryMatch = titleMatch || descMatch || tagsMatch;
    }

    // 2. Category Match
    let categoryMatch = true;
    if (activeCategory) {
      categoryMatch = task.category === activeCategory;
    }

    // 3. Tag Match
    let tagMatch = true;
    if (activeTag) {
      tagMatch = task.tags.includes(activeTag);
    }

    return queryMatch && categoryMatch && tagMatch;
  });
}

function handleSidebarCategoryClick(e) {
  const btn = e.target.closest('.category-btn');
  if (!btn) return;

  const clickedCat = btn.getAttribute('data-category');
  if (activeCategory === clickedCat) {
    activeCategory = null; // Toggle off
  } else {
    activeCategory = clickedCat;
    activeTag = null; // Mutually exclusive filtering to avoid dead states
  }

  updateFilterBarDisplay();
  switchView('list'); // Jump to task list for filtering results
}

function handleSidebarTagClick(e) {
  const btn = e.target.closest('.tag-badge');
  if (!btn) return;

  const clickedTag = btn.getAttribute('data-tag');
  if (activeTag === clickedTag) {
    activeTag = null;
  } else {
    activeTag = clickedTag;
    activeCategory = null;
  }

  updateFilterBarDisplay();
  switchView('list');
}

function updateFilterBarDisplay() {
  const filterBar = document.getElementById('active-filters-bar');
  const filterDesc = document.getElementById('filter-description');
  if (!filterBar || !filterDesc) return;

  if (activeCategory || activeTag) {
    filterBar.classList.remove('hidden');
    filterDesc.innerText = activeCategory ? `Category: ${activeCategory}` : `Tag: #${activeTag}`;
  } else {
    filterBar.classList.add('hidden');
  }
}

function clearFilters() {
  activeCategory = null;
  activeTag = null;
  updateFilterBarDisplay();
  refreshActiveViewContent();
}

// ==========================================
// 7. CRUDS OPERATIONS ENGINE
// ==========================================
let editTaskId = null;

function handleTaskFormSubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('task-title').value.trim();
  const desc = document.getElementById('task-desc').value.trim();
  const priority = document.getElementById('task-priority').value;
  const dueDate = document.getElementById('task-due-date').value;
  const category = document.getElementById('task-category').value;
  const tagsStr = document.getElementById('task-tags').value;

  // Process Tags
  const tags = tagsStr
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 0);

  if (editTaskId) {
    // Modify existing
    const idx = state.tasks.findIndex(t => t.id === editTaskId);
    if (idx !== -1) {
      state.tasks[idx] = {
        ...state.tasks[idx],
        title,
        description: desc,
        priority,
        dueDate,
        category,
        tags
      };
      showToast('Task updated successfully', 'success');
    }
  } else {
    // Add new
    const newTask = {
      id: 'task_' + Date.now(),
      title,
      description: desc,
      priority,
      dueDate,
      category,
      tags,
      status: 'todo',
      pinned: false,
      favorite: false,
      completed: false,
      pomodorosCompleted: 0
    };
    state.tasks.push(newTask);
    showToast('Task created successfully', 'success');
  }

  saveState();
  closeTaskModal();
  refreshActiveViewContent();
}

function editTask(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  editTaskId = taskId;
  document.getElementById('modal-title').innerText = 'Edit Task Details';
  
  // Fill inputs
  document.getElementById('task-title').value = task.title;
  document.getElementById('task-desc').value = task.description || '';
  document.getElementById('task-priority').value = task.priority;
  document.getElementById('task-due-date').value = task.dueDate || '';
  document.getElementById('task-category').value = task.category;
  document.getElementById('task-tags').value = task.tags ? task.tags.join(', ') : '';

  openTaskModal();
}

function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    state.tasks = state.tasks.filter(t => t.id !== taskId);
    saveState();
    showToast('Task deleted', 'warning');
    refreshActiveViewContent();
  }
}

function toggleTaskComplete(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  // Sync status
  task.status = task.completed ? 'done' : 'todo';
  
  // Completion logs for analytics trends
  if (task.completed) {
    const todayStr = new Date().toISOString().split('T')[0];
    state.stats.dailyCompletionLog[todayStr] = (state.stats.dailyCompletionLog[todayStr] || 0) + 1;
    playAudioTone('completion');
    showToast('Task completed! Keep it up!', 'success');
    
    // Check achievements
    triggerAchievementCheck('first-task');
    triggerAchievementCheck('five-tasks');
    triggerAchievementCheck('ten-tasks');
  } else {
    showToast('Task marked incomplete', 'info');
  }

  saveState();
  refreshActiveViewContent();
}

function togglePinTask(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.pinned = !task.pinned;
  saveState();
  if (task.pinned) {
    showToast('Task pinned to top', 'success');
    triggerAchievementCheck('pinned-task');
  } else {
    showToast('Task unpinned', 'info');
  }
  refreshActiveViewContent();
}

function toggleFavoriteTask(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.favorite = !task.favorite;
  saveState();
  showToast(task.favorite ? 'Added to favorites' : 'Removed from favorites', 'info');
  refreshActiveViewContent();
}

// Modal Toggle Handlers
function openTaskModal(columnStatus = 'todo') {
  document.getElementById('task-modal').classList.remove('hidden');
  
  // Set default column target if quick add from Kanban
  if (!editTaskId) {
    document.getElementById('modal-title').innerText = 'Create New Task';
    document.getElementById('task-form').reset();
    document.getElementById('task-edit-id').value = '';
    // Focus title
    setTimeout(() => document.getElementById('task-title').focus(), 100);
  }
}

function closeTaskModal() {
  document.getElementById('task-modal').classList.add('hidden');
  editTaskId = null;
}

// ==========================================
// 8. RENDERER: DASHBOARD VIEW
// ==========================================
let productivityChartInstance = null;

function renderDashboard() {
  // 1. Calculate and render metrics
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Set counters
  animateCounter('stat-total', total);
  animateCounter('stat-completed', completed);
  animateCounter('stat-pending', pending);
  animateCounter('stat-rate', rate, '%');

  // Ring Progress Ring
  const circle = document.getElementById('dashboard-progress-ring');
  const text = document.getElementById('dashboard-progress-text');
  if (circle && text) {
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    
    const offset = circumference - (rate / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    text.innerText = `${rate}%`;
  }

  // 2. Render Pinned & High priority column
  const dashboardFocusList = document.getElementById('dashboard-urgent-tasks');
  if (dashboardFocusList) {
    const focusTasks = state.tasks.filter(t => !t.completed && (t.pinned || t.priority === 'high'));
    
    // Sort pinned tasks first
    focusTasks.sort((a,b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    if (focusTasks.length === 0) {
      dashboardFocusList.innerHTML = `<div class="empty-state" style="padding: 30px 0;">No pinned or urgent tasks remaining. Awesome!</div>`;
    } else {
      dashboardFocusList.innerHTML = focusTasks.map(t => {
        const dateFormatted = t.dueDate ? formatStringDate(t.dueDate) : 'No due date';
        const isOverdue = t.dueDate && isDateBeforeToday(t.dueDate);
        const pinActive = t.pinned ? 'active' : '';

        return `
          <div class="task-card ${t.pinned ? 'pinned' : ''}" style="padding: 14px;">
            <div class="task-header" style="gap: 8px; margin-bottom: 0;">
              <div class="task-checkbox-container">
                <input type="checkbox" class="task-checkbox" onclick="toggleTaskComplete('${t.id}')">
                <div class="task-content-text">
                  <span class="task-title" style="font-size: 13px;">${t.title}</span>
                  <div style="display:flex; gap: 8px; align-items:center; margin-top:4px;">
                    <span class="task-category-badge" style="font-size: 9px; padding: 1px 6px;">${t.category}</span>
                    <span class="due-date-badge ${isOverdue ? 'overdue' : ''}" style="font-size: 9px;">
                      📅 ${dateFormatted}
                    </span>
                  </div>
                </div>
              </div>
              <button class="action-btn pin-btn ${pinActive}" onclick="togglePinTask('${t.id}')" title="Pin task">
                📌
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 3. Render Trend Charts
  renderCharts();
}

function animateCounter(id, targetVal, suffix = '') {
  const el = document.getElementById(id);
  if (!el) return;

  const duration = 800; // ms
  const start = parseInt(el.innerText) || 0;
  if (start === targetVal) {
    el.innerText = targetVal + suffix;
    return;
  }
  
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quad
    const ease = progress * (2 - progress);
    const currentVal = Math.round(start + ease * (targetVal - start));
    el.innerText = currentVal + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.innerText = targetVal + suffix;
    }
  }
  
  requestAnimationFrame(update);
}

// Render Weekly trend graph using Chart.js
function renderCharts() {
  const canvas = document.getElementById('productivityChart');
  if (!canvas) return;

  // Generate date keys for the last 7 days
  const labels = [];
  const completedData = [];
  const pendingData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Display labels as "Jun 25"
    labels.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
    
    // Completed count on that day
    completedData.push(state.stats.dailyCompletionLog[dateStr] || 0);
    
    // Pending count on that day
    const tasksDueOnDay = state.tasks.filter(t => t.dueDate === dateStr && !t.completed).length;
    pendingData.push(tasksDueOnDay);
  }

  // Handle dark mode variations
  const isDark = state.settings.darkMode;
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const labelColor = isDark ? '#9ca3af' : '#4b5563';
  
  let primaryColor = 'hsl(217, 91%, 60%)';
  if (state.settings.theme === 'purple') primaryColor = 'hsl(271, 91%, 65%)';
  if (state.settings.theme === 'green') primaryColor = 'hsl(142, 72%, 45%)';

  if (productivityChartInstance) {
    productivityChartInstance.destroy();
  }

  const ctx = canvas.getContext('2d');
  productivityChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Completed Tasks',
          data: completedData,
          borderColor: primaryColor,
          backgroundColor: 'rgba(59,130,246,0.04)',
          borderWidth: 3,
          tension: 0.35,
          fill: true
        },
        {
          label: 'Pending Tasks',
          data: pendingData,
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: labelColor,
            font: { family: 'Outfit', weight: 600 }
          }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: labelColor, font: { family: 'Outfit' } }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: labelColor, font: { family: 'Outfit' }, stepSize: 1 }
        }
      }
    }
  });
}

// ==========================================
// 9. RENDERER: TASK LIST VIEW (CRUD UI)
// ==========================================
let currentSortOption = 'pinned';
let currentFilterOption = 'all';

function renderTaskList() {
  const container = document.getElementById('tasks-grid-list');
  if (!container) return;

  // Filter tasks
  let filtered = filterTasksArray(state.tasks);

  // Tab Filtering (All, Active, Completed, Pinned, Favorites)
  if (currentFilterOption === 'active') {
    filtered = filtered.filter(t => !t.completed);
  } else if (currentFilterOption === 'completed') {
    filtered = filtered.filter(t => t.completed);
  } else if (currentFilterOption === 'pinned') {
    filtered = filtered.filter(t => t.pinned);
  } else if (currentFilterOption === 'favorites') {
    filtered = filtered.filter(t => t.favorite);
  }

  // Sort Tasks
  sortTasksArray(filtered);

  // Update List Progress Counter
  const totalTasks = filtered.length;
  const completedTasks = filtered.filter(t => t.completed).length;
  const progressText = document.getElementById('list-progress-counter');
  if (progressText) {
    progressText.innerHTML = `Tasks: <span class="highlight">${completedTasks}/${totalTasks}</span>`;
  }

  // Render HTML
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h3>No tasks matched the filters.</h3>
        <p>Try clearing tags, searching something else, or create a new task!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(t => {
    const isOverdue = t.dueDate && isDateBeforeToday(t.dueDate) && !t.completed;
    const pinActive = t.pinned ? 'active' : '';
    const favActive = t.favorite ? 'active' : '';
    const completedClass = t.completed ? 'completed' : '';
    const dateStr = t.dueDate ? formatStringDate(t.dueDate) : 'No due date';

    // Tags Chips
    const tagsHTML = t.tags && t.tags.length > 0 
      ? `<div class="task-tags-row">${t.tags.map(tag => `<span class="task-card-tag">#${tag}</span>`).join('')}</div>`
      : '';

    return `
      <div class="task-card ${completedClass} ${t.pinned ? 'pinned' : ''}" 
           draggable="true" 
           data-task-id="${t.id}"
           id="card-${t.id}">
        
        <div class="task-header">
          <div class="task-checkbox-container">
            <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} onclick="toggleTaskComplete('${t.id}')">
            <div class="task-content-text">
              <span class="task-title">${t.title}</span>
              <p class="task-desc">${t.description || 'No description provided.'}</p>
            </div>
          </div>
          
          <div class="task-actions">
            <button class="action-btn pin-btn ${pinActive}" onclick="togglePinTask('${t.id}')" title="Pin task">
              📌
            </button>
            <button class="action-btn fav-btn ${favActive}" onclick="toggleFavoriteTask('${t.id}')" title="Favorite task">
              ★
            </button>
            <button class="action-btn edit-btn" onclick="editTask('${t.id}')" title="Edit task">
              ✏️
            </button>
            <button class="action-btn delete-btn" onclick="deleteTask('${t.id}')" title="Delete task">
              🗑️
            </button>
          </div>
        </div>

        ${tagsHTML}

        <div class="task-footer">
          <div class="task-meta-left">
            <span class="task-category-badge">${t.category}</span>
            <span class="due-date-badge ${isOverdue ? 'overdue' : ''}">
              📅 ${dateStr} ${isOverdue ? '(Overdue!)' : ''}
            </span>
          </div>
          
          <div class="task-meta-right">
            ${t.pomodorosCompleted > 0 ? `<span class="task-pomo-counter">🍅 ${t.pomodorosCompleted}</span>` : ''}
            <span class="task-priority-dot ${t.priority}"></span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Add Drag listeners inside Task List (enables dragging cards directly to Kanban tabs/sidebar etc)
  bindCardDragEvents();
}

function sortTasksArray(arr) {
  arr.sort((a, b) => {
    // Pinned tasks always floating on top by default
    if (currentSortOption === 'pinned') {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
    }

    if (currentSortOption === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    
    if (currentSortOption === 'priority') {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }

    if (currentSortOption === 'name') {
      return a.title.localeCompare(b.title);
    }

    if (currentSortOption === 'completed') {
      return (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
    }

    return 0;
  });
}

// ==========================================
// 10. KANBAN BOARD DRAG & DROP LOGIC
// ==========================================
function renderKanbanBoard() {
  const todoList = document.getElementById('kanban-todo-list');
  const doingList = document.getElementById('kanban-doing-list');
  const doneList = document.getElementById('kanban-done-list');
  
  if (!todoList || !doingList || !doneList) return;

  // Clear lists
  todoList.innerHTML = '';
  doingList.innerHTML = '';
  doneList.innerHTML = '';

  // Filter and populate columns
  const filtered = filterTasksArray(state.tasks);
  
  let counts = { todo: 0, doing: 0, done: 0 };

  filtered.forEach(task => {
    const dateFormatted = task.dueDate ? formatStringDate(task.dueDate) : 'No due date';
    const isOverdue = task.dueDate && isDateBeforeToday(task.dueDate) && !task.completed;
    const completedClass = task.completed ? 'completed' : '';

    const cardHTML = `
      <div class="task-card ${completedClass}" 
           draggable="true" 
           data-task-id="${task.id}" 
           id="kanbancard-${task.id}">
        <div class="task-header" style="margin-bottom: 0;">
          <div class="task-checkbox-container">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTaskComplete('${task.id}')">
            <div class="task-content-text">
              <span class="task-title" style="font-size: 13px;">${task.title}</span>
              <p class="task-desc" style="font-size: 11px; margin-top: 4px;">${task.description || ''}</p>
            </div>
          </div>
          <div class="task-actions" style="margin-left: 8px;">
            <button class="action-btn delete-btn" style="width:20px; height:20px;" onclick="deleteTask('${task.id}')" title="Delete task">
              🗑️
            </button>
          </div>
        </div>
        <div class="task-footer" style="padding-top: 8px; margin-top: 8px;">
          <div class="due-date-badge ${isOverdue ? 'overdue' : ''}" style="font-size: 10px;">
            📅 ${dateFormatted}
          </div>
          <span class="task-priority-dot ${task.priority}"></span>
        </div>
      </div>
    `;

    if (task.status === 'done' || task.completed) {
      doneList.innerHTML += cardHTML;
      counts.done++;
    } else if (task.status === 'doing') {
      doingList.innerHTML += cardHTML;
      counts.doing++;
    } else {
      todoList.innerHTML += cardHTML;
      counts.todo++;
    }
  });

  // Update counts
  document.getElementById('count-todo').innerText = counts.todo;
  document.getElementById('count-doing').innerText = counts.doing;
  document.getElementById('count-done').innerText = counts.done;

  // Bind drag listeners to newly created cards
  bindCardDragEvents();
}

function bindCardDragEvents() {
  const cards = document.querySelectorAll('.task-card[draggable="true"]');
  cards.forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
  });
}

let draggedCardId = null;

function handleDragStart(e) {
  draggedCardId = this.getAttribute('data-task-id');
  this.classList.add('dragging');
  e.dataTransfer.setData('text/plain', draggedCardId);
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd() {
  this.classList.remove('dragging');
  draggedCardId = null;
}

// Bind Dropzones on Columns
function initKanbanDropzones() {
  const containers = document.querySelectorAll('.kanban-cards-container');
  containers.forEach(container => {
    container.addEventListener('dragover', e => {
      e.preventDefault();
      container.classList.add('drag-over');
    });

    container.addEventListener('dragleave', () => {
      container.classList.remove('drag-over');
    });

    container.addEventListener('drop', e => {
      e.preventDefault();
      container.classList.remove('drag-over');
      
      const id = e.dataTransfer.getData('text/plain');
      const targetStatus = container.getAttribute('data-status');
      
      if (id && targetStatus) {
        const task = state.tasks.find(t => t.id === id);
        if (task) {
          task.status = targetStatus;
          // Synchronize completions
          if (targetStatus === 'done') {
            if (!task.completed) {
              task.completed = true;
              const todayStr = new Date().toISOString().split('T')[0];
              state.stats.dailyCompletionLog[todayStr] = (state.stats.dailyCompletionLog[todayStr] || 0) + 1;
              playAudioTone('completion');
              showToast('Task marked complete!', 'success');
              
              triggerAchievementCheck('first-task');
              triggerAchievementCheck('five-tasks');
              triggerAchievementCheck('ten-tasks');
            }
          } else {
            task.completed = false;
          }
          saveState();
          refreshActiveViewContent();
        }
      }
    });
  });
}

// ==========================================
// 11. CALENDAR VIEW ENGINE
// ==========================================
let currentCalendarDate = new Date();
let selectedCalendarDateStr = null;

function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  const monthYearLabel = document.getElementById('calendar-month-year');
  if (!grid || !monthYearLabel) return;

  grid.innerHTML = '';

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  monthYearLabel.innerText = currentCalendarDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  // Get index day of first day (e.g. 0 = Sunday)
  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  // Empty slots for previous month bleed
  for (let i = 0; i < firstDayIndex; i++) {
    grid.innerHTML += `<div class="calendar-day empty"></div>`;
  }

  // Calendar cells
  for (let day = 1; day <= lastDay; day++) {
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = (month + 1) < 10 ? '0' + (month + 1) : (month + 1);
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    // Find tasks matching due date
    const tasksDue = state.tasks.filter(t => t.dueDate === dateStr);
    
    // Sort tasks (high priority dot first)
    const indicatorsHTML = tasksDue.map(t => {
      return `<span class="day-indicator-dot ${t.priority}" title="${t.title}"></span>`;
    }).join('');

    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = dateStr === todayStr ? 'today' : '';
    const isSelected = dateStr === selectedCalendarDateStr ? 'selected' : '';

    grid.innerHTML += `
      <div class="calendar-day ${isToday} ${isSelected}" data-date="${dateStr}">
        <span class="day-number">${day}</span>
        <div class="day-indicators">${indicatorsHTML}</div>
      </div>
    `;
  }

  // Click handler on cells
  document.querySelectorAll('.calendar-day:not(.empty)').forEach(cell => {
    cell.addEventListener('click', () => {
      const clickedDate = cell.getAttribute('data-date');
      showCalendarDayTasks(clickedDate);
    });
  });

  // Re-render list detail drawer if a date is actively chosen
  if (selectedCalendarDateStr) {
    showCalendarDayTasks(selectedCalendarDateStr);
  }
}

function showCalendarDayTasks(dateStr) {
  selectedCalendarDateStr = dateStr;
  
  // Re-render cells select state
  document.querySelectorAll('.calendar-day').forEach(cell => {
    if (cell.getAttribute('data-date') === dateStr) {
      cell.classList.add('selected');
    } else {
      cell.classList.remove('selected');
    }
  });

  const detailsPane = document.getElementById('calendar-day-details');
  const detailsDateStr = document.getElementById('calendar-selected-date-str');
  const detailsList = document.getElementById('calendar-day-tasks');

  if (!detailsPane || !detailsDateStr || !detailsList) return;

  detailsPane.classList.remove('hidden');
  detailsDateStr.innerText = formatStringDate(dateStr);

  const dayTasks = state.tasks.filter(t => t.dueDate === dateStr);

  if (dayTasks.length === 0) {
    detailsList.innerHTML = `<p class="empty-state" style="padding: 10px 0;">No tasks due on this date.</p>`;
  } else {
    detailsList.innerHTML = dayTasks.map(t => {
      return `
        <div class="task-card ${t.completed ? 'completed' : ''}" style="padding: 12px; margin-bottom: 0;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} onclick="toggleTaskComplete('${t.id}')">
              <span class="task-title" style="font-size:13px;">${t.title}</span>
            </div>
            <span class="task-priority-dot ${t.priority}"></span>
          </div>
        </div>
      `;
    }).join('');
  }
}

// ==========================================
// 12. POMODORO TIMER MODULE
// ==========================================
let pomoMinutes = 25;
let pomoSeconds = 0;
let pomoInterval = null;
let pomoIsRunning = false;
let pomoMode = 'work'; // 'work' or 'break'

function togglePomoTimer() {
  if (pomoIsRunning) {
    pausePomoTimer();
  } else {
    startPomoTimer();
  }
}

function startPomoTimer() {
  pomoIsRunning = true;
  document.getElementById('pomo-play-icon').classList.add('hidden');
  document.getElementById('pomo-pause-icon').classList.remove('hidden');
  document.getElementById('pomodoro-widget').classList.add('active-ticking');

  pomoInterval = setInterval(() => {
    if (pomoSeconds === 0) {
      if (pomoMinutes === 0) {
        handlePomoCompletion();
        return;
      }
      pomoMinutes--;
      pomoSeconds = 59;
    } else {
      pomoSeconds--;
    }
    updatePomoUI();
  }, 1000);

  showToast('Focus session started!', 'info');
}

function pausePomoTimer() {
  pomoIsRunning = false;
  clearInterval(pomoInterval);
  document.getElementById('pomo-play-icon').classList.remove('hidden');
  document.getElementById('pomo-pause-icon').classList.add('hidden');
  document.getElementById('pomodoro-widget').classList.remove('active-ticking');
  showToast('Timer paused', 'info');
}

function resetPomoTimer() {
  pausePomoTimer();
  pomoMode = 'work';
  pomoMinutes = 25;
  pomoSeconds = 0;
  document.getElementById('pomo-status').innerText = 'Focus Session';
  updatePomoUI();
}

function handlePomoCompletion() {
  pausePomoTimer();
  playAudioTone('pomo-end');

  if (pomoMode === 'work') {
    state.stats.totalPomodoros++;
    
    // Link completed pomo counts to active task
    const linkedTaskId = document.getElementById('pomo-task-link').value;
    if (linkedTaskId) {
      const task = state.tasks.find(t => t.id === linkedTaskId);
      if (task) {
        task.pomodorosCompleted = (task.pomodorosCompleted || 0) + 1;
        showToast(`Pomodoro completed for task: ${task.title}!`, 'success');
      }
    } else {
      showToast('Pomodoro session completed! Take a break.', 'success');
    }

    // Evaluate Achievements
    triggerAchievementCheck('first-pomo');
    triggerAchievementCheck('five-pomos');
    
    saveState();
    
    // Switch to break
    pomoMode = 'break';
    pomoMinutes = 5;
    pomoSeconds = 0;
    document.getElementById('pomo-status').innerText = 'Short Break';
    
    // Auto start break alert
    if (confirm('Focus session completed! Start your 5 minute break?')) {
      startPomoTimer();
    }
  } else {
    // Break finished
    showToast('Break finished! Back to focus.', 'info');
    pomoMode = 'work';
    pomoMinutes = 25;
    pomoSeconds = 0;
    document.getElementById('pomo-status').innerText = 'Focus Session';
  }
  
  updatePomoUI();
  refreshActiveViewContent();
}

function updatePomoUI() {
  const display = document.getElementById('pomo-time');
  if (display) {
    const minsStr = pomoMinutes < 10 ? '0' + pomoMinutes : pomoMinutes;
    const secsStr = pomoSeconds < 10 ? '0' + pomoSeconds : pomoSeconds;
    display.innerText = `${minsStr}:${secsStr}`;
  }
}

// ==========================================
// 13. ACHIEVEMENTS ENGINE (GAMIFICATION)
// ==========================================
function renderAchievements() {
  const container = document.getElementById('achievements-grid');
  if (!container) return;

  container.innerHTML = Object.values(state.achievements).map(ach => {
    const unlockedClass = ach.unlocked ? 'unlocked' : '';
    const statusText = ach.unlocked ? 'Unlocked' : 'Locked';

    return `
      <div class="achievement-card ${unlockedClass}">
        <span class="achievement-status-tag">${statusText}</span>
        <div class="achievement-badge-icon">${ach.icon}</div>
        <div class="achievement-details">
          <h4 class="achievement-title">${ach.title}</h4>
          <p class="achievement-desc">${ach.desc}</p>
        </div>
      </div>
    `;
  }).join('');
}

function triggerAchievementCheck(achievementId) {
  let isUnlockable = false;

  const completedCount = state.tasks.filter(t => t.completed).length;

  if (achievementId === 'first-task' && completedCount >= 1) isUnlockable = true;
  if (achievementId === 'five-tasks' && completedCount >= 5) isUnlockable = true;
  if (achievementId === 'ten-tasks' && completedCount >= 10) isUnlockable = true;
  if (achievementId === 'pinned-task' && state.tasks.some(t => t.pinned)) isUnlockable = true;
  if (achievementId === 'theme-customized') isUnlockable = true;
  if (achievementId === 'backup-data') isUnlockable = true;
  if (achievementId === 'first-pomo' && state.stats.totalPomodoros >= 1) isUnlockable = true;
  if (achievementId === 'five-pomos' && state.stats.totalPomodoros >= 5) isUnlockable = true;

  if (isUnlockable && state.achievements[achievementId] && !state.achievements[achievementId].unlocked) {
    state.achievements[achievementId].unlocked = true;
    saveState();
    
    // Play sound and show toast
    playAudioTone('achievement');
    showToast(`🏆 ACHIEVEMENT UNLOCKED: ${state.achievements[achievementId].title}!`, 'success');
  }
}

// ==========================================
// 14. EXPORT, IMPORT, AND RESET SYSTEMS
// ==========================================
function handleDataExportJSON() {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `technova_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
  showToast('Workspace exported to JSON backup', 'success');
  
  // Achievement log
  triggerAchievementCheck('backup-data');
}

function handleDataExportCSV() {
  let csvContent = 'ID,Title,Description,Priority,Due Date,Category,Status,Pinned,Favorite,Completed,Pomodoros\n';
  
  state.tasks.forEach(t => {
    const row = [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.priority,
      t.dueDate || '',
      t.category,
      t.status,
      t.pinned ? 'YES' : 'NO',
      t.favorite ? 'YES' : 'NO',
      t.completed ? 'YES' : 'NO',
      t.pomodorosCompleted || 0
    ].join(',');
    csvContent += row + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `technova_tasks_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  
  URL.revokeObjectURL(url);
  showToast('Tasks table exported to CSV', 'success');
}

function handleDataImport(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      
      // Basic validation checks
      if (Array.isArray(imported.tasks)) {
        state.tasks = imported.tasks;
        if (imported.settings) state.settings = { ...state.settings, ...imported.settings };
        if (imported.stats) state.stats = { ...state.stats, ...imported.stats };
        if (imported.achievements) {
          Object.keys(imported.achievements).forEach(key => {
            if (state.achievements[key]) {
              state.achievements[key].unlocked = imported.achievements[key].unlocked;
            }
          });
        }

        saveState();
        initTheme();
        refreshActiveViewContent();
        showToast('Backup restored successfully!', 'success');
      } else {
        showToast('Invalid backup file schema: tasks array missing', 'error');
      }
    } catch (err) {
      showToast('Error parsing JSON backup file', 'error');
      console.error(err);
    }
  };
  reader.readAsText(file);
}

function resetEntireWorkspace() {
  if (confirm('WARNING: This will permanently erase all tasks, custom themes, and achievements. Continue?')) {
    localStorage.removeItem('technova_state');
    state.tasks = defaultTasks;
    state.settings.theme = 'blue';
    state.settings.darkMode = true;
    state.stats.totalPomodoros = 0;
    state.stats.dailyCompletionLog = {};
    Object.keys(state.achievements).forEach(key => {
      state.achievements[key].unlocked = false;
    });

    saveState();
    initTheme();
    refreshActiveViewContent();
    showToast('All app data has been reset to defaults.', 'warning');
  }
}

// ==========================================
// 15. NOTIFICATIONS / REMINDERS PANEL
// ==========================================
function updateNotificationsPanel() {
  const list = document.getElementById('notification-list');
  const badge = document.getElementById('notification-badge');
  if (!list || !badge) return;

  const todayStr = new Date().toISOString().split('T')[0];
  
  // Find active tasks due today or overdue
  const dueTodayTasks = state.tasks.filter(t => !t.completed && t.dueDate === todayStr);
  const overdueTasks = state.tasks.filter(t => !t.completed && t.dueDate && isDateBeforeToday(t.dueDate));

  const totalAlerts = dueTodayTasks.length + overdueTasks.length;
  
  if (totalAlerts > 0) {
    badge.innerText = totalAlerts;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }

  // Populate list
  let itemsHTML = '';
  
  dueTodayTasks.forEach(t => {
    itemsHTML += `
      <li class="notification-item">
        <div class="notification-item-text">
          <div class="notification-item-title">⚠️ Task Due Today!</div>
          <div>${t.title}</div>
          <div class="notification-item-time">Priority: ${t.priority.toUpperCase()}</div>
        </div>
      </li>
    `;
  });

  overdueTasks.forEach(t => {
    itemsHTML += `
      <li class="notification-item" style="border-left: 3px solid var(--priority-high);">
        <div class="notification-item-text">
          <div class="notification-item-title" style="color:var(--priority-high)">🚨 Overdue Task!</div>
          <div>${t.title}</div>
          <div class="notification-item-time">Was due: ${formatStringDate(t.dueDate)}</div>
        </div>
      </li>
    `;
  });

  if (totalAlerts === 0) {
    list.innerHTML = `<li class="empty-state">No reminders or alerts for today</li>`;
  } else {
    list.innerHTML = itemsHTML;
  }
}

// ==========================================
// 15B. USER AUTHENTICATION HANDLERS
// ==========================================
function checkAuthSession() {
  const authOverlay = document.getElementById('auth-overlay');
  const welcomeUser = document.getElementById('welcome-username');

  // Initialize users database in localStorage if missing
  let usersDB = localStorage.getItem('technova_users_db');
  if (!usersDB) {
    usersDB = { 'admin': 'password' };
    localStorage.setItem('technova_users_db', JSON.stringify(usersDB));
  } else {
    try {
      usersDB = JSON.parse(usersDB);
    } catch(e) {
      usersDB = { 'admin': 'password' };
      localStorage.setItem('technova_users_db', JSON.stringify(usersDB));
    }
  }

  const storedUser = localStorage.getItem('technova_current_user');
  if (storedUser) {
    state.currentUser = storedUser;
    if (authOverlay) authOverlay.classList.add('hidden');
    if (welcomeUser) welcomeUser.innerText = storedUser;
  } else {
    state.currentUser = null;
    if (authOverlay) authOverlay.classList.remove('hidden');
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const userVal = document.getElementById('login-username').value.trim();
  const passVal = document.getElementById('login-password').value;

  if (!userVal || !passVal) {
    showToast('Username and password are required', 'error');
    return;
  }

  let usersDB = {};
  try {
    usersDB = JSON.parse(localStorage.getItem('technova_users_db')) || { 'admin': 'password' };
  } catch(err) {
    usersDB = { 'admin': 'password' };
  }

  if (usersDB[userVal] && usersDB[userVal] === passVal) {
    localStorage.setItem('technova_current_user', userVal);
    state.currentUser = userVal;
    
    const authOverlay = document.getElementById('auth-overlay');
    if (authOverlay) authOverlay.classList.add('hidden');
    
    const welcomeUser = document.getElementById('welcome-username');
    if (welcomeUser) welcomeUser.innerText = userVal;

    showToast(`Welcome back, ${userVal}!`, 'success');
    refreshActiveViewContent();
  } else {
    showToast('Invalid username or password', 'error');
  }
}

function handleRegisterSubmit(e) {
  e.preventDefault();
  const userVal = document.getElementById('register-username').value.trim();
  const passVal = document.getElementById('register-password').value;
  const confirmVal = document.getElementById('register-confirm-password').value;

  if (!userVal || !passVal) {
    showToast('All fields are required', 'error');
    return;
  }

  if (passVal !== confirmVal) {
    showToast('Passwords do not match', 'error');
    return;
  }

  let usersDB = {};
  try {
    usersDB = JSON.parse(localStorage.getItem('technova_users_db')) || { 'admin': 'password' };
  } catch(err) {
    usersDB = { 'admin': 'password' };
  }

  if (usersDB[userVal]) {
    showToast('Username already exists', 'error');
    return;
  }

  usersDB[userVal] = passVal;
  localStorage.setItem('technova_users_db', JSON.stringify(usersDB));
  
  localStorage.setItem('technova_current_user', userVal);
  state.currentUser = userVal;

  const authOverlay = document.getElementById('auth-overlay');
  if (authOverlay) authOverlay.classList.add('hidden');

  const welcomeUser = document.getElementById('welcome-username');
  if (welcomeUser) welcomeUser.innerText = userVal;

  showToast('Registration successful! Welcome.', 'success');
  
  e.target.reset();
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');

  refreshActiveViewContent();
}

function handleLogout() {
  if (confirm('Are you sure you want to log out of this workspace?')) {
    if (pomoIsRunning) {
      pausePomoTimer();
    }
    
    localStorage.removeItem('technova_current_user');
    state.currentUser = null;
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.reset();
    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.reset();
    
    const authOverlay = document.getElementById('auth-overlay');
    if (authOverlay) authOverlay.classList.remove('hidden');

    showToast('Successfully logged out', 'info');
  }
}

// ==========================================
// 16. BIND EVENT LISTENERS & INITS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State Sync
  loadState();
  initTheme();
  checkAuthSession();
  refreshActiveViewContent();
  initKanbanDropzones();

  // 2. Tab view events
  document.querySelectorAll('.sidebar-menu .nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.getAttribute('data-view'));
      
      // Close mobile sidebar if open
      document.getElementById('sidebar').classList.remove('active');
    });
  });

  // 3. Category filtering in sidebar
  const catWrap = document.getElementById('sidebar-categories');
  if (catWrap) {
    catWrap.addEventListener('click', handleSidebarCategoryClick);
  }

  // 4. Tag filtering in sidebar
  const tagsWrap = document.getElementById('sidebar-tags');
  if (tagsWrap) {
    tagsWrap.addEventListener('click', handleSidebarTagClick);
  }

  // Clear filters
  const clearFilterBtn = document.getElementById('btn-clear-filters');
  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', clearFilters);
  }

  // 5. Modal actions
  const openModalBtn = document.getElementById('btn-add-task-modal');
  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => openTaskModal('todo'));
  }
  
  const closeModalBtn = document.getElementById('btn-close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeTaskModal);
  }

  const cancelModalBtn = document.getElementById('btn-cancel-modal');
  if (cancelModalBtn) {
    cancelModalBtn.addEventListener('click', closeTaskModal);
  }

  const taskForm = document.getElementById('task-form');
  if (taskForm) {
    taskForm.addEventListener('submit', handleTaskFormSubmit);
  }

  // 6. Header Theme / Light / Dark modes clicks
  const themeBox = document.querySelector('.theme-customizer');
  if (themeBox) {
    themeBox.addEventListener('click', handleThemeChange);
  }

  const modeBtn = document.getElementById('mode-toggle');
  if (modeBtn) {
    modeBtn.addEventListener('click', handleModeToggle);
  }

  // 7. Search Input
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value;
      refreshActiveViewContent();
    });
  }

  // 8. Sorting Dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSortOption = e.target.value;
      renderTaskList();
    });
  }

  // Filter Tabs row in Task List View
  document.querySelectorAll('.filter-tabs .filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tabs .filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilterOption = tab.getAttribute('data-filter');
      renderTaskList();
    });
  });

  // 9. Quick Add Column button triggers in Kanban board
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.kanban-add-btn');
    if (addBtn) {
      const status = addBtn.getAttribute('data-status');
      openTaskModal(status);
    }
  });

  // 10. Calendar monthly navs
  const prevMonthBtn = document.getElementById('calendar-prev-month');
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
      renderCalendar();
    });
  }

  const nextMonthBtn = document.getElementById('calendar-next-month');
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
      renderCalendar();
    });
  }

  // 11. Pomodoro Controls
  const pomoPlayPauseBtn = document.getElementById('pomo-play-pause');
  if (pomoPlayPauseBtn) {
    pomoPlayPauseBtn.addEventListener('click', togglePomoTimer);
  }

  const pomoResetBtn = document.getElementById('pomo-reset');
  if (pomoResetBtn) {
    pomoResetBtn.addEventListener('click', resetPomoTimer);
  }

  // 12. Backup tool triggers
  const btnExportJSON = document.getElementById('btn-export-json');
  if (btnExportJSON) {
    btnExportJSON.addEventListener('click', handleDataExportJSON);
  }

  const btnExportCSV = document.getElementById('btn-export-csv');
  if (btnExportCSV) {
    btnExportCSV.addEventListener('click', handleDataExportCSV);
  }

  const btnTriggerImport = document.getElementById('btn-trigger-import');
  const importFileInput = document.getElementById('import-file-input');
  if (btnTriggerImport && importFileInput) {
    btnTriggerImport.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', handleDataImport);
  }

  const btnResetData = document.getElementById('btn-reset-data');
  if (btnResetData) {
    btnResetData.addEventListener('click', resetEntireWorkspace);
  }

  // 13. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  // 14. Notification Bell dropdown toggle
  const notifBtn = document.getElementById('notification-btn');
  const notifDropdown = document.getElementById('notification-dropdown');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      notifDropdown.classList.add('hidden');
    });

    notifDropdown.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop closing when clicking inside
    });
  }

  const clearNotifBtn = document.getElementById('clear-notifications-btn');
  if (clearNotifBtn) {
    clearNotifBtn.addEventListener('click', () => {
      // Complete all warning/overdue tasks to clear notifications
      const todayStr = new Date().toISOString().split('T')[0];
      state.tasks.forEach(t => {
        if (!t.completed && (t.dueDate === todayStr || (t.dueDate && isDateBeforeToday(t.dueDate)))) {
          t.completed = true;
          t.status = 'done';
        }
      });
      saveState();
      refreshActiveViewContent();
      showToast('All overdue/today notifications completed and cleared!', 'success');
    });
  }

  // 15. Authentication Forms
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegisterSubmit);
  }

  const goToRegister = document.getElementById('go-to-register');
  if (goToRegister) {
    goToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-form').classList.add('hidden');
      document.getElementById('register-form').classList.remove('hidden');
    });
  }

  const goToLogin = document.getElementById('go-to-login');
  if (goToLogin) {
    goToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('register-form').classList.add('hidden');
      document.getElementById('login-form').classList.remove('hidden');
    });
  }

  const logoutBtn = document.getElementById('sidebar-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
});

// ==========================================
// 17. REUSABLE UTILITIES
// ==========================================
function isDateBeforeToday(dateStr) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const checkDate = new Date(dateStr + 'T00:00:00'); // Keep timezone neutral
  return checkDate < today;
}

function formatStringDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
