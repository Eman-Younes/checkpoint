// Show date
let dateEl = document.getElementById('currentDate');
if(dateEl){
    let today = new Date();
    let options = {weekday:'long', day:'numeric', month:'long'};
    dateEl.textContent = today.toLocaleDateString('en-US', options);
}

// Modal buttons
let openBtn = document.getElementById('openBtn');
let cancelBtn = document.getElementById('cancel');
let closeBtn = document.getElementById('close');
let modal = document.getElementById('taskModal');

if(openBtn){
    openBtn.onclick = function(){
        modal.style.display = 'block';
    }
}

if(cancelBtn){
    cancelBtn.onclick = function(){
        modal.style.display = 'none';
    }
}

if(closeBtn){
    closeBtn.onclick = function(){
        modal.style.display = 'none';
    }
}

// Priority buttons
let priorityBtns = document.querySelectorAll('.priority-btn');
priorityBtns.forEach(function(btn){
    btn.onclick = function(){
        priorityBtns.forEach(function(b){
            b.classList.remove('active');
        });
        btn.classList.add('active');
    }
});

// Reset form
function resetForm(){
    let form = document.getElementById('taskForm');
    if(form){
        form.reset();
        priorityBtns.forEach(function(b){
            b.classList.remove('active');
        });
        let mediumBtn = document.querySelector('.priority-btn[data-priority="medium"]');
        if(mediumBtn){
            mediumBtn.classList.add('active');
        }
    }
}

// Add new task
let addBtn = document.getElementById('add');
if(addBtn){
    addBtn.onclick = function(e){
        e.preventDefault();
        
        let title = document.getElementById('taskTitle').value.trim();
        if(title == ''){
            alert('Please enter a task title.');
            return;
        }
        
        let desc = document.getElementById('taskDesc').value.trim();
        let date = document.getElementById('taskDate').value;
        let tag = document.getElementById('taskTags').value.trim();
        let status = document.getElementById('taskStatus').value;
        let category = document.getElementById('taskCategory').value;
        
        let activeBtn = document.querySelector('.priority-btn.active');
        let priority = activeBtn ? activeBtn.dataset.priority : 'medium';
        
        let task = {
            id: Date.now(),
            title: title,
            description: desc,
            date: date,
            priority: priority,
            tag: tag,
            status: status,
            done: false,
            starred: false,
            category: category
        };
        
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        modal.style.display = 'none';
        resetForm();
        
        if(document.getElementById('todayTasks')){
            showTodayTasks();
            updateProgress();
        } else if(document.getElementById('importantTasks')){
            showImportantTasks();
        } else if(document.getElementById('allTasksContainer')){
            showAllTasks();
        } else if(document.getElementById('plannedContainer')){
            showPlannedTasks();
        }
    }
}

// Create task card
function makeCard(task){
    let card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = task.id;
    
    let starIcon = task.starred ? 'fa-solid' : 'fa-regular';
    let starColor = task.starred ? '#f4b400' : '#737373';
    let titleClass = task.done ? 'done' : '';
    let checked = task.done ? 'checked' : '';
    let dateText = task.date || 'Today';
    
    card.innerHTML = `
        <div class="card-header">
            <input type="checkbox" ${checked}>
            <h3 class="${titleClass}">${task.title}</h3>
            <div style="display: flex; gap: 8px; align-items: center;">
                <button class="btn-starred">
                    <i class="${starIcon} fa-star" style="color: ${starColor};"></i>
                </button>
                <button class="btn-delete" title="Delete task">
                    <i class="fa-solid fa-trash" style="color: #ef4444;"></i>
                </button>
            </div>
        </div>
        <div class="card-details">
            <p class="category">${task.category}</p>
            <span class="deadline">
                <i class="fa-solid fa-calendar"></i>
                ${dateText}
            </span>
        </div>
    `;
    
    return card;
}

// Show today tasks
function showTodayTasks(){
    let container = document.getElementById('todayTasks');
    if(!container) return;
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let today = new Date().toISOString().split('T')[0];
    
    let todayTasks = [];
    for(let i = 0; i < tasks.length; i++){
        if(tasks[i].date == today || tasks[i].date == ''){
            todayTasks.push(tasks[i]);
        }
    }
    
    container.innerHTML = '';
    
    if(todayTasks.length == 0){
        container.innerHTML = '<p style="text-align: center; color: #737373; padding: 40px;">No tasks for today</p>';
        return;
    }
    
    for(let i = 0; i < todayTasks.length; i++){
        let card = makeCard(todayTasks[i]);
        container.appendChild(card);
    }
}

// Update progress bar
function updateProgress(){
    let progressText = document.getElementById('progressText');
    let progressBar = document.getElementById('task-done');
    
    if(!progressText || !progressBar) return;
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let today = new Date().toISOString().split('T')[0];
    
    let todayTasks = [];
    for(let i = 0; i < tasks.length; i++){
        if(tasks[i].date == today || tasks[i].date == ''){
            todayTasks.push(tasks[i]);
        }
    }
    
    let total = todayTasks.length;
    let completed = 0;
    for(let i = 0; i < todayTasks.length; i++){
        if(todayTasks[i].done){
            completed++;
        }
    }
    
    if(total == 0){
        progressText.textContent = '0 of 0 completed';
        progressBar.value = 0;
    } else {
        let percent = (completed / total) * 100;
        progressText.textContent = completed + ' of ' + total + ' completed';
        progressBar.value = percent;
    }
}

// Show important tasks
function showImportantTasks(){
    let container = document.getElementById('importantTasks');
    if(!container) return;
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    let importantTasks = [];
    for(let i = 0; i < tasks.length; i++){
        if(tasks[i].starred){
            importantTasks.push(tasks[i]);
        }
    }
    
    container.innerHTML = '';
    
    if(importantTasks.length == 0){
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #737373;">
                <i class="fa-regular fa-star" style="font-size: 64px; opacity: 0.3; margin-bottom: 20px;"></i>
                <h3 style="font-size: 18px; margin-bottom: 8px;">No important tasks yet</h3>
                <p style="font-size: 14px;">Star tasks to see them here</p>
            </div>
        `;
        return;
    }
    
    for(let i = 0; i < importantTasks.length; i++){
        let card = makeCard(importantTasks[i]);
        container.appendChild(card);
    }
}

// Show all tasks
let currentFilter = 'all';

function showAllTasks(){
    let container = document.getElementById('allTasksContainer');
    if(!container) return;
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    let filteredTasks = [];
    if(currentFilter == 'all'){
        filteredTasks = tasks;
    } else {
        for(let i = 0; i < tasks.length; i++){
            if(tasks[i].category == currentFilter){
                filteredTasks.push(tasks[i]);
            }
        }
    }
    
    let total = filteredTasks.length;
    let completed = 0;
    for(let i = 0; i < filteredTasks.length; i++){
        if(filteredTasks[i].done){
            completed++;
        }
    }
    
    let countEl = document.getElementById('taskCount');
    if(countEl){
        countEl.textContent = total + ' total • ' + completed + ' completed';
    }
    
    container.innerHTML = '';
    
    if(filteredTasks.length == 0){
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #737373;">
                <i class="fa-regular fa-circle-check" style="font-size: 64px; opacity: 0.3;"></i>
                <p>No tasks found</p>
            </div>
        `;
        return;
    }
    
    let groups = {};
    for(let i = 0; i < filteredTasks.length; i++){
        let cat = filteredTasks[i].category;
        if(!groups[cat]){
            groups[cat] = [];
        }
        groups[cat].push(filteredTasks[i]);
    }
    
    let categories = Object.keys(groups);
    for(let i = 0; i < categories.length; i++){
        let cat = categories[i];
        
        let section = document.createElement('div');
        section.className = 'category-section';
        
        let header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <span>${cat}</span>
            <span class="category-count">${groups[cat].length}</span>
        `;
        section.appendChild(header);
        
        for(let j = 0; j < groups[cat].length; j++){
            let card = makeCard(groups[cat][j]);
            section.appendChild(card);
        }
        
        container.appendChild(section);
    }
}

// Show planned tasks
function showPlannedTasks(){
    let container = document.getElementById('plannedContainer');
    if(!container) return;
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayStr = today.toISOString().split('T')[0];
    
    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    let nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    let overdue = [];
    let todayTasks = [];
    let tomorrowTasks = [];
    let weekTasks = [];
    let laterTasks = [];
    
    for(let i = 0; i < tasks.length; i++){
        let task = tasks[i];
        
        if(!task.date || task.date == ''){
            todayTasks.push(task);
            continue;
        }
        
        let taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0);
        
        if(taskDate < today){
            overdue.push(task);
        } else if(task.date == todayStr){
            todayTasks.push(task);
        } else if(task.date == tomorrowStr){
            tomorrowTasks.push(task);
        } else if(taskDate <= nextWeek){
            weekTasks.push(task);
        } else {
            laterTasks.push(task);
        }
    }
    
    container.innerHTML = '';
    
    if(tasks.length == 0){
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #737373;">
                <i class="fa-regular fa-calendar" style="font-size: 64px; opacity: 0.3;"></i>
                <h3>No planned tasks yet</h3>
            </div>
        `;
        return;
    }
    
    if(overdue.length > 0){
        let section = makeSection('Overdue', overdue, '#ef4444');
        container.appendChild(section);
    }
    
    if(todayTasks.length > 0){
        let section = makeSection('Today', todayTasks, '#f59e0b');
        container.appendChild(section);
    }
    
    if(tomorrowTasks.length > 0){
        let section = makeSection('Tomorrow', tomorrowTasks, '#3b82f6');
        container.appendChild(section);
    }
    
    if(weekTasks.length > 0){
        let section = makeSection('This Week', weekTasks, '#8b5cf6');
        container.appendChild(section);
    }
    
    if(laterTasks.length > 0){
        let section = makeSection('Later', laterTasks, '#6b7280');
        container.appendChild(section);
    }
}

function makeSection(title, tasks, color){
    let section = document.createElement('div');
    section.className = 'planned-section';
    section.style.marginBottom = '30px';
    
    let header = document.createElement('div');
    header.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-bottom: 15px; font-size: 16px; font-weight: 600;';
    header.style.color = color;
    header.innerHTML = `
        <i class="fa-solid fa-circle" style="font-size: 8px;"></i>
        <span>${title}</span>
        <span style="background: ${color}20; color: ${color}; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${tasks.length}</span>
    `;
    section.appendChild(header);
    
    for(let i = 0; i < tasks.length; i++){
        let card = makeCard(tasks[i]);
        section.appendChild(card);
    }
    
    return section;
}

// Handle clicks
function handleClick(e){
    let card = e.target.closest('.card');
    if(!card) return;
    
    let id = Number(card.dataset.id);
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    let taskIndex = -1;
    for(let i = 0; i < tasks.length; i++){
        if(tasks[i].id == id){
            taskIndex = i;
            break;
        }
    }
    
    if(taskIndex == -1) return;
    
    let task = tasks[taskIndex];
    
    // Checkbox
    if(e.target.type == 'checkbox'){
        task.done = e.target.checked;
        let title = card.querySelector('h3');
        if(task.done){
            title.classList.add('done');
        } else {
            title.classList.remove('done');
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        if(document.getElementById('todayTasks')){
            updateProgress();
        }
    }
    
    // Star button
    if(e.target.closest('.btn-starred')){
        task.starred = !task.starred;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        if(document.getElementById('todayTasks')){
            showTodayTasks();
            updateProgress();
        } else if(document.getElementById('importantTasks')){
            showImportantTasks();
        } else if(document.getElementById('allTasksContainer')){
            showAllTasks();
        } else if(document.getElementById('plannedContainer')){
            showPlannedTasks();
        }
    }
    
    // Delete button
    if(e.target.closest('.btn-delete')){
        let confirmed = confirm('Are you sure you want to delete "' + task.title + '"?');
        
        if(confirmed){
            tasks.splice(taskIndex, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            if(document.getElementById('todayTasks')){
                showTodayTasks();
                updateProgress();
            } else if(document.getElementById('importantTasks')){
                showImportantTasks();
            } else if(document.getElementById('allTasksContainer')){
                showAllTasks();
            } else if(document.getElementById('plannedContainer')){
                showPlannedTasks();
            }
        }
    }
}

// Add click events
let todayContainer = document.getElementById('todayTasks');
let importantContainer = document.getElementById('importantTasks');
let allTasksContainer = document.getElementById('allTasksContainer');
let plannedContainer = document.getElementById('plannedContainer');

if(todayContainer){
    todayContainer.onclick = handleClick;
}

if(importantContainer){
    importantContainer.onclick = handleClick;
}

if(allTasksContainer){
    allTasksContainer.onclick = handleClick;
}

if(plannedContainer){
    plannedContainer.onclick = handleClick;
}

// Filter tabs
let filterTabs = document.querySelectorAll('.filter-tab');
for(let i = 0; i < filterTabs.length; i++){
    filterTabs[i].onclick = function(){
        for(let j = 0; j < filterTabs.length; j++){
            filterTabs[j].classList.remove('active');
        }
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        showAllTasks();
    }
}

// Start when page loads
window.onload = function(){
    if(document.getElementById('todayTasks')){
        showTodayTasks();
        updateProgress();
    } else if(document.getElementById('importantTasks')){
        showImportantTasks();
    } else if(document.getElementById('allTasksContainer')){
        showAllTasks();
    } else if(document.getElementById('plannedContainer')){
        showPlannedTasks();
    }
}