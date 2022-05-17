// HELPER FUNCTIONS
let TODO_LIST = [];
let FUTURE_TODO_LIST = [];
let todo_created_at = [];
let future_todo_date = [];

const GET_TODOS = () => {
  return JSON.parse(localStorage.getItem('TODO_LIST'));
}

const get_todo_created_at = () => {
  return JSON.parse(localStorage.getItem('todo_created_at'));
}

const get_future_todo_date = () => {
  return JSON.parse(localStorage.getItem('future_todo_date'));
}

const GET_FUTURE_TODOS = () => {
  return JSON.parse(localStorage.getItem('FUTURE_TODO_LIST'));
}

const SET_TODOS = () => {
  localStorage.setItem('TODO_LIST', JSON.stringify(TODO_LIST));
}

const set_todo_created_at = () => {
  const filtered_todo_created_at = [...new Set(todo_created_at)]
  localStorage.setItem('todo_created_at', JSON.stringify(filtered_todo_created_at));
}

const set_future_todo_date = () => {
  const filtered_todo_date = [...new Set(future_todo_date)]
  localStorage.setItem('future_todo_date', JSON.stringify(filtered_todo_date));
}

const SET_FUTURE_TODOS = () => {
  localStorage.setItem('FUTURE_TODO_LIST', JSON.stringify(FUTURE_TODO_LIST));
}

const setAll = () => {
  SET_TODOS();
  set_todo_created_at();
  set_future_todo_date();
}

const $ = (selector, name) => {
  let select;
  if(selector === 'id') {
    select = '#';
  } else {
    select = '.'
  }
  return document.querySelector(`${select}${name}`)
}

const docCreate = (element) => {
  return document.createElement(element);
}

const elemAttr = (element, value, attr = 'class') => {
  element.setAttribute(attr, value);
}

const getDate = () => {
  const day = new Date();
  const today = day.getDate();
  return today
}

const getHour = () => {
  const day = new Date();
  const hour = day.getHours();
  
  if(hour < 12) {
    return `GOOD MORNING, SHALYN`
  } else if(hour > 12 && hour < 18) {
    return `GOOD AFTERNOON, SHALYN`
  } else if(hour > 18) {
    return `GOOD EVENING, SHALYN`
  } else {
    return `MAGANDANG TANGHALI, SHALYN`
  }
}


const getId = () => {
  const day = new Date();
  const sec = day.getSeconds();
  const milli = day.getMilliseconds();
  return parseInt(`${sec}${milli}`)
}

function dateFormat(day) {
  let thisDay = new Date();
  let petsa = thisDay.getDate();
  let month = thisDay.getMonth();
  let year = thisDay.getFullYear();
  var months = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July",
    "August",
    "September",
    "October", 
    "November",
    "December"
  ]
  for (let i = 0; i < months.length; i++) {
    document.getElementById("today-date").innerHTML = months[month] + " " + petsa + ", " + year;
    return months[month] + " " + day;
  }
}

function time() {
  let today = new Date();
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let formattedHours = hours < 10 ? "0" + hours : hours;
  let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  document.getElementById("clock").innerHTML = formattedHours + ":" + formattedMinutes;
};

setInterval(() => {
  dateFormat(getDate())
  time()
}, 1000);

// ====================================

$('class', 'message').innerHTML = getHour();

$('id', 'add-trigger').addEventListener('click', (event) => {
  event.preventDefault();
  let dline;
  if($('id', 'todo-input-date').value.length !== 0) {
    dline = parseInt($('id', 'todo-input-date').value)
  } else {
    dline = ''
  }
  const new_task = {
    id: getId(),
    task: $('id', 'todo-input-task').value, 
    deadline: dline,
    date_created: getDate()
  }
  TODO_LIST.push(new_task);
  todo_created_at.push(getDate());
  SET_TODOS();
  set_todo_created_at();
  $('id', 'todo-input-task').value = '';
  $('id', 'todo-input-date').value = '';
  render();
})

$('id', 'add-trigger-future').addEventListener('click', (event) => {
  event.preventDefault();
  let dline;
  if($('id', 'todo-input-deadline-future').value.length !== 0) {
    dline = parseInt($('id', 'todo-input-deadline-future').value)
  } else {
    dline = ''
  }
  const new_task = {
    id: getId(),
    task: $('id', 'todo-input-task-future').value, 
    deadline: dline,
    date_created: parseInt($('id', 'todo-input-date-future').value)
  }
  FUTURE_TODO_LIST.push(new_task);
  future_todo_date.push(parseInt($('id', 'todo-input-date-future').value));
  SET_FUTURE_TODOS();
  set_future_todo_date();
  $('id', 'todo-input-task-future').value = '';
  $('id', 'todo-input-date-future').value = '';
  $('id', 'todo-input-deadline-future').value = '';
})

const delOption = (task) => {
  const filtered_tasks = TODO_LIST.filter(each => each !== task)
  TODO_LIST = filtered_tasks;
  setAll();
  render();
}

const bigDelOption = (date) => {
  const filtered_groups = todo_created_at.filter(each => each !== date)
  todo_created_at = filtered_groups;
  setAll();
  render();
}

const render = () => {
  $('class', 'todo-display').innerHTML = '';
  const specific_wrappers = [];

  TODO_LIST.forEach(task => {
    const wrapper = docCreate('div');
    const bullet = docCreate('input')
    const div = docCreate('div');
    const span = docCreate('span');
    const delButton = docCreate('button');

    elemAttr(wrapper, `todo-wrapper ${task.date_created}`);
    elemAttr(bullet, 'checkbox', 'type')
    elemAttr(bullet, 'checkbox')
    elemAttr(div, `todo-name`);
    elemAttr(delButton, 'todo-del');
    elemAttr(delButton, `${task.id}`, 'id');

    delButton.addEventListener('click', () => {
      delOption(task);
    })
    
    div.innerHTML = task.task;
    delButton.innerHTML = '✖️'

    if(task.deadline !== '') {
      span.innerHTML = ` - deadline is ${task.deadline}`;
    } else {
      span.innerHTML = "";
    }
    
    wrapper.appendChild(bullet);
    wrapper.appendChild(div);
    wrapper.appendChild(span);
    wrapper.appendChild(delButton);
    specific_wrappers.push(wrapper)
  });

  get_todo_created_at().forEach(date => {
    const todo_group = docCreate('div');
    const p = docCreate('p');
    const image = docCreate('img');
    const bigDelButton = docCreate('button');

    elemAttr(todo_group, `g${date}`, 'id');
    elemAttr(image, "./assets/brown.png", 'src');
    elemAttr(image, "brown-tape");
    elemAttr(bigDelButton, 'todo-group-del');

    bigDelButton.innerHTML = '🗑️'


    bigDelButton.addEventListener('click', () => {
      bigDelOption(date);
    })

    todo_group.classList.add('todo-group');

    p.innerHTML = `${dateFormat(date)}`;

    todo_group.appendChild(image);
    todo_group.appendChild(p);
    todo_group.appendChild(bigDelButton)
    $('class', 'todo-display').appendChild(todo_group);

    specific_wrappers.forEach(wrapper => {
      if(wrapper.classList.contains(date)) {
        document.getElementById(`g${date}`).appendChild(wrapper);
      }
    })
  });

  if(document.getElementById(`g${getDate()}`)) {
    document.getElementById(`g${getDate()}`).style.backgroundColor = '#B2AC88';
  }
}

// INITIALIZER
if(getDate() === 1) {
  SET_TODOS();
  set_todo_created_at();
  set_future_todo_date();
  SET_FUTURE_TODOS();
}

if(GET_TODOS() && get_todo_created_at() && GET_FUTURE_TODOS() && get_future_todo_date()) {
  GET_TODOS().forEach(each => TODO_LIST.push(each))
  get_todo_created_at().forEach(each => todo_created_at.push(each))
  get_future_todo_date().forEach(each => future_todo_date.push(each))
  const modify_future_todos = GET_FUTURE_TODOS().filter(task => task.date_created === getDate());
  FUTURE_TODO_LIST = modify_future_todos;
  render();
} else {
  setAll();
}

GET_FUTURE_TODOS()?.forEach(task => {
  if(task.date_created === getDate()) {
    TODO_LIST.push(task);
    SET_TODOS();
  }
})

get_future_todo_date().forEach(date => {
  if(date === getDate()) {
    todo_created_at.push(date);
    const modify_future_todo_date = future_todo_date.filter(each => each !== date);
    future_todo_date = modify_future_todo_date;
    set_todo_created_at();
    set_future_todo_date();
  }
  render();
});
// =============================
