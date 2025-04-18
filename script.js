// script.js

// Add this at the start of file
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Function to add entry
function addEntry() {
    const questionCount = document.getElementById('questionCount').value;
    if (!questionCount || questionCount <= 0) return;  // Added validation for positive number input

    const date = new Date();
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    let data = JSON.parse(localStorage.getItem('questionData')) || [];

    const existingEntry = data.find(item => item.date === dateString);
    if (existingEntry) {
        existingEntry.count = questionCount;
    } else {
        data.push({ date: dateString, count: questionCount });
    }

    localStorage.setItem('questionData', JSON.stringify(data));
    document.getElementById('questionCount').value = '';  // Clear input after adding entry
    updateDisplay();
}

// Calendar variables
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function updateCalendar() {
    calculateAverages(); // Add this line to calculate averages before updating the calendar
    const calendarTitle = document.getElementById('calendarTitle');
    const calendarGrid = document.getElementById('calendarGrid');
    
    // Set calendar title
    calendarTitle.textContent = 
        new Date(currentYear, currentMonth).toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });

    // Clear existing calendar
    calendarGrid.innerHTML = '';

    // Add day names header
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    dayNames.forEach(day => {
        const headerCell = document.createElement('div');
        headerCell.className = 'calendar-day-header';
        headerCell.textContent = day;
        calendarGrid.appendChild(headerCell);
    });

    // Get first day of month
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Get last day of month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    // Get stored data
    const data = JSON.parse(localStorage.getItem('questionData'));

    // Adjust first day to Monday
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    // Add empty cells for days before first day of month
    for (let i = 0; i < startDay; i++) {
        calendarGrid.appendChild(createCalendarCell(''));
    }

    // Create cells for each day of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const entry = data ? data.find(item => item.date === dateString) : null;
        const isToday = new Date().toISOString().split('T')[0] === dateString;
        
        const cell = createCalendarCell(day);
        if (isToday) cell.classList.add('current-day');
        if (entry) {
            cell.classList.add('has-entries');
            cell.innerHTML = `
                <div class="day-number">${day}</div>
                <div class="entry-count">${entry.count}</div>
            `;
            if (entry.count == 0) {
                cell.classList.add('no-questions');
            } else if (entry.count == 1 || entry.count == 3) {
                cell.classList.add('few-questions');
            } else if (entry.count == 2) {
                cell.classList.add('medium-questions');
            } else if (entry.count == 4 || entry.count == 5) {
                cell.classList.add('high-questions');
            } else if (entry.count > 5) {
                cell.classList.add('many-questions');
            }
        }
        calendarGrid.appendChild(cell);
    }

    updateQuestionList();
}

function createCalendarCell(day) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    if (day) {
        cell.innerHTML = `<div class="day-number">${day}</div>`;
        const cellDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        cell.setAttribute('data-date', cellDate);
        
        // Single click handler for increasing count
        cell.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const scrollPos = window.scrollY;
            const dateString = cellDate;
            const data = JSON.parse(localStorage.getItem('questionData')) || [];
            const entry = data.find(item => item.date === dateString);

            // Allow modifications for current and past dates
            const clickedDate = new Date(dateString);
            clickedDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (clickedDate <= today) {
                if (entry) {
                    entry.count = parseInt(entry.count) + 1;
                } else {
                    data.push({ date: dateString, count: 1 });
                }
                localStorage.setItem('questionData', JSON.stringify(data));
                updateDisplayAndMaintainScroll(scrollPos);
            }
        };

        // Right-click handler for decreasing count
        cell.oncontextmenu = function(event) {
            event.preventDefault();
            event.stopPropagation();
            const scrollPos = window.scrollY;
            const dateString = cellDate;
            const data = JSON.parse(localStorage.getItem('questionData')) || [];
            const entry = data.find(item => item.date === dateString);

            // Allow modifications for current and past dates
            const clickedDate = new Date(dateString);
            clickedDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (clickedDate <= today && entry) {
                entry.count = Math.max(0, parseInt(entry.count) - 1);
                localStorage.setItem('questionData', JSON.stringify(data));
                updateDisplayAndMaintainScroll(scrollPos);
            }
        };
    }
    return cell;
}

// Add new function to maintain scroll position
function updateDisplayAndMaintainScroll(scrollPos) {
    updateDisplay();
    window.scrollTo(0, scrollPos);
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}

function updateDisplay() {
    document.body.style.display = 'block'; // Ensure body is visible
    updateCalendar();
    calculateAverages();
}

// Function to calculate weekly averages
function calculateAverages() {
    const data = JSON.parse(localStorage.getItem('questionData')) || [];
    const weeklyAverages = document.getElementById('weeklyAverages');
    weeklyAverages.innerHTML = '';

    // Sort data by date
    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Find best day
    const bestDay = data.reduce((max, entry) => 
        parseInt(entry.count) > parseInt(max.count) ? entry : max, 
        { count: 0, date: 'None' }
    );

    // Calculate current streak
    let currentStreak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = data.length - 1; i >= 0; i--) {
        const entryDate = new Date(data[i].date);
        const diffDays = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === currentStreak && data[i].count > 0) {
            currentStreak++;
        } else {
            break;
        }
    }

    // Calculate best streak
    let bestStreak = 0;
    let currentBestStreak = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].count > 0) {
            currentBestStreak++;
            bestStreak = Math.max(bestStreak, currentBestStreak);
        } else {
            currentBestStreak = 0;
        }
    }

    // Calculate total questions solved
    const totalQuestions = data.reduce((sum, entry) => sum + parseInt(entry.count), 0);

    // Calculate average questions per day
    const totalDays = data.length;
    const averagePerDay = totalDays > 0 ? (totalQuestions / totalDays).toFixed(2) : 0;

    // Calculate days with 5+ questions
    const highProductivityDays = data.filter(entry => parseInt(entry.count) >= 5).length;

    // Create statistics HTML
    const statistics = `
        <div class="stats-container">
            <div class="stat-item">
                <h3>Current Streak</h3>
                <p>${currentStreak} days</p>
            </div>
            <div class="stat-item">
                <h3>Best Streak</h3>
                <p>${bestStreak} days</p>
            </div>
            <div class="stat-item">
                <h3>Best Day</h3>
                <p>${bestDay.date}: ${bestDay.count} questions</p>
            </div>
            <div class="stat-item">
                <h3>Total Questions</h3>
                <p>${totalQuestions}</p>
            </div>
            <div class="stat-item">
                <h3>Average Per Day</h3>
                <p>${averagePerDay}</p>
            </div>
            <div class="stat-item">
                <h3>High Productivity Days</h3>
                <p>${highProductivityDays} days with 5+ questions</p>
            </div>
        </div>
    `;

    // Add existing weekly and monthly averages
    const weeks = {};
    data.forEach(entry => {
        const date = new Date(entry.date);
        const weekNumber = getWeekNumber(date);
        if (!weeks[weekNumber]) {
            weeks[weekNumber] = [];
        }
        weeks[weekNumber].push(entry.count);
    });

    // Calculate current week's average
    const currentWeekNumber = getWeekNumber(new Date());
    const currentWeekData = weeks[currentWeekNumber] || [];
    const currentWeekTotal = currentWeekData.reduce((sum, count) => sum + count, 0);
    const currentWeekAverage = currentWeekTotal / currentWeekData.length;
    const weekDiv = document.createElement('div');
    weekDiv.className = 'weekly-average';
    weekDiv.textContent = `Week's Average: ${currentWeekAverage.toFixed(2)} questions/day`;
    weeklyAverages.appendChild(weekDiv);

    // Add total questions for the current week
    const totalWeekDiv = document.createElement('div');
    totalWeekDiv.className = 'total-questions';
    totalWeekDiv.textContent = `Total Questions This Week: ${currentWeekTotal}`;
    weeklyAverages.appendChild(totalWeekDiv);

    // Calculate month average
    const monthData = data.filter(entry => {
        const date = new Date(entry.date);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    });
    const monthTotal = monthData.reduce((sum, entry) => sum + entry.count, 0);
    const monthAverage = monthTotal / monthData.length;
    const monthDiv = document.createElement('div');
    monthDiv.className = 'monthly-average';
    monthDiv.textContent = `Month Average: ${monthAverage.toFixed(2)} question/day`;
    weeklyAverages.appendChild(monthDiv);

    // Add total questions for the month
    const totalMonthDiv = document.createElement('div');
    totalMonthDiv.className = 'total-questions';
    totalMonthDiv.textContent = `Total Questions This Month: ${monthTotal}`;
    weeklyAverages.appendChild(totalMonthDiv);

    // Insert statistics before the averages
    weeklyAverages.innerHTML = statistics + weeklyAverages.innerHTML;
    weeklyAverages.innerHTML = `
        <div class="stats-container">
            <div class="stat-item">
                <h3>Current Streak</h3>
                <p>${currentStreak} days</p>
            </div>
            <div class="stat-item">
                <h3>Best Streak</h3>
                <p>${bestStreak} days</p>
            </div>
            <div class="stat-item">
                <h3>Best Day</h3>
                <p>${bestDay.date}: ${bestDay.count}</p>
            </div>
            <div class="stat-item">
                <h3>Total Questions</h3>
                <p>${totalQuestions}</p>
            </div>
            <div class="stat-item">
                <h3>Week Average</h3>
                <p>${(currentWeekTotal / Math.max(currentWeekData.length, 1)).toFixed(2)}</p>
            </div>
            <div class="stat-item">
                <h3>Month Average</h3>
                <p>${(monthTotal / Math.max(monthData.length, 1)).toFixed(2)}</p>
            </div>
            <div class="stat-item">
                <h3>Week Total</h3>
                <p>${currentWeekTotal}</p>
            </div>
            <div class="stat-item">
                <h3>Month Total</h3>
                <p>${monthTotal}</p>
            </div>
            <div class="stat-item">
                <h3>Productivity Days</h3>
                <p>${highProductivityDays} (5+ solved)</p>
            </div>
        </div>
    `;
}

// Function to get week number of a date
function getWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

// Function to update the question list
// Function to update the question list
// Function to update the question list
function updateQuestionList() {
    const data = JSON.parse(localStorage.getItem('questionData')) || [];
    const questionList = document.getElementById('questionList');
    questionList.innerHTML = '';

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i += 3) {
        const row = document.createElement('div');
        row.className = 'question-row';

        for (let j = 0; j < 3; j++) {
            const day = i + j;
            if (day > daysInMonth) break;

            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const entry = data.find(item => item.date === dateString);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'question-day';
            dayDiv.textContent = `Day ${day}: ${entry ? entry.count : 0} questions`;
            dayDiv.setAttribute('data-date', dateString);
            row.appendChild(dayDiv);
        }

        questionList.appendChild(row);
    }
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    questionList.setAttribute('data-date', todayString);
    updateNotesDivision(todayString);
}
// Function to save notes
function saveNotes() {
    const notesText = document.getElementById('notes-textarea').value;
    const date = document.getElementById('questionList').getAttribute('data-date');
    const notesData = JSON.parse(localStorage.getItem('notesData')) || {};
    notesData[date] = notesText;
    localStorage.setItem('notesData', JSON.stringify(notesData));
    updateNotesList();
}

// Function to update notes list
function updateNotesList() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    const notesData = JSON.parse(localStorage.getItem('notesData')) || {};
    Object.keys(notesData).forEach(date => {
        const notesListItem = document.createElement('div');
        notesListItem.className = 'notes-list-item';
        notesListItem.textContent = `Date: ${date} - Notes: ${notesData[date]}`;
        notesList.appendChild(notesListItem);
    });
}

function updateNotesDivision(date) {
    const notesData = JSON.parse(localStorage.getItem('notesData')) || {};
    const notesText = notesData[date] || '';
    document.getElementById('notes-textarea').value = notesText;
    document.getElementById('questionList').setAttribute('data-date', date);
    document.getElementById('notes-date').textContent = `Notes for: ${date}`;
}

document.getElementById('questionList').addEventListener('click', function(event) {
    if (event.target.tagName === 'DIV') {
        const date = event.target.getAttribute('data-date');
        updateNotesDivision(date);
    }
});

// Add event listener to save notes button
document.getElementById('save-notes-btn').addEventListener('click', saveNotes);

// Function to get previous day notes
function getPreviousDayNotes() {
    const currentDate = document.getElementById('questionList').getAttribute('data-date');
    const dateParts = currentDate.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]) - 1;
    const previousDate = new Date(year, month, day);
    const previousDateString = `${previousDate.getFullYear()}-${String(previousDate.getMonth() + 1).padStart(2, '0')}-${String(previousDate.getDate()).padStart(2, '0')}`;
    updateNotesDivision(previousDateString);
}

// Function to get next day notes
function getNextDayNotes() {
    const currentDate = document.getElementById('questionList').getAttribute('data-date');
    const dateParts = currentDate.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]) + 1;
    const nextDate = new Date(year, month, day);
    const nextDateString = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
    updateNotesDivision(nextDateString);
}

document.getElementById('get-previous-day-notes-btn').addEventListener('click', getPreviousDayNotes);
document.getElementById('get-next-day-notes-btn').addEventListener('click', getNextDayNotes);

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

// Set the theme on initial load based on localStorage
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

document.getElementById('toggle-theme-btn').addEventListener('click', toggleTheme);

// Call to initially render the calendar, averages, and set the theme
setInitialTheme();
updateDisplay();

// Function to export data
function exportData() {
    const questionData = localStorage.getItem('questionData') || '[]';
    const notesData = localStorage.getItem('notesData') || '{}';
    
    const exportData = {
        questionData: JSON.parse(questionData),
        notesData: JSON.parse(notesData)
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    downloadLink.download = `question-tracker-backup-${dateString}.json`;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}

// Function to import data
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (importedData.questionData && importedData.notesData) {
                if (confirm('This will replace your existing data. Are you sure?')) {
                    // Clear existing data first
                    localStorage.clear();
                    
                    // Set new data
                    localStorage.setItem('questionData', JSON.stringify(importedData.questionData));
                    localStorage.setItem('notesData', JSON.stringify(importedData.notesData));
                    
                    // Refresh the display
                    updateDisplay();
                    updateNotesList();
                    updateCalendar();
                    
                    // Clear the file input
                    event.target.value = '';
                    
                    alert('Data imported successfully!');
                }
            } else {
                alert('Invalid data format in the imported file.');
            }
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Add event listeners for import/export
document.getElementById('export-data-btn').addEventListener('click', exportData);
document.getElementById('import-data-btn').addEventListener('click', () => {
    document.getElementById('import-file').click();
});
document.getElementById('import-file').addEventListener('change', importData);