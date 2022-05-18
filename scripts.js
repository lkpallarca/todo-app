// HELPER FUNCTIONS
let TODO_LIST = [];
let todo_created_at = [];
let bg_images = [];
let font_color = false;

const GET_TODOS = () => {
  return JSON.parse(localStorage.getItem('TODO_LIST'));
}

const get_todo_created_at = () => {
  return JSON.parse(localStorage.getItem('todo_created_at'));
}

const get_bg_images = () => {
  return JSON.parse(localStorage.getItem('background_images'));
}

const SET_TODOS = () => {
  localStorage.setItem('TODO_LIST', JSON.stringify(TODO_LIST));
}

const set_todo_created_at = () => {
  const filtered_todo_created_at = [...new Set(todo_created_at)]
  localStorage.setItem('todo_created_at', JSON.stringify(filtered_todo_created_at));
}

const set_bg_image = () => {
  localStorage.setItem('background_images', JSON.stringify(bg_images));
}

const setAll = () => {
  SET_TODOS();
  set_todo_created_at();
  set_bg_image();
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

const randomize = (array) => {
  return Math.floor(Math.random() * array.length)
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

const reset = () => {
  $('id', 'todo-input-task').value = '';
  $('id', 'todo-input-date').value = '';
  $('id', 'todo-input-task-future').value = '';
  $('id', 'todo-input-date-future').value = '';
  $('id', 'todo-input-deadline-future').value = '';
}

// ====================================

$('class', 'message').innerHTML = getHour();

$('id', 'font-btn').addEventListener('click', () => {
  if(font_color === false) {
    font_color = true
    $('class', 'message').style.color = 'black'
    $('id', 'clock').style.color = 'black'
    $('id', 'today-date').style.color = 'black'
  } else {
    font_color = false
    $('class', 'message').style.color = 'white'
    $('id', 'clock').style.color = 'white'
    $('id', 'today-date').style.color = 'white'
  }
})

$('id', 'add-trigger').addEventListener('click', (event) => {
  event.preventDefault();
  let dline;
  if($('id', 'todo-input-date').value.length !== 0) {
    dline = parseInt($('id', 'todo-input-date').value)
  } else {
    dline = ''
  }
  if($('id', 'todo-input-task').value.length === 0) {
    return
  }
  const new_task = {
    id: getId(),
    task: $('id', 'todo-input-task').value, 
    deadline: dline,
    date_created: getDate()
  }
  TODO_LIST.push(new_task);
  todo_created_at.push(getDate());
  setAll();
  reset();
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
  if($('id', 'todo-input-task-future').value.length === 0 || $('id', 'todo-input-date-future').value.length === 0) {
    return
  }
  const new_task = {
    id: getId(),
    task: $('id', 'todo-input-task-future').value, 
    deadline: dline,
    date_created: parseInt($('id', 'todo-input-date-future').value)
  }
  TODO_LIST.push(new_task);
  todo_created_at.push(parseInt($('id', 'todo-input-date-future').value));
  const sortedDates = todo_created_at.slice().sort((a,b)=> a - b);
  todo_created_at = sortedDates;
  setAll();
  reset();
  render();
})

const delOption = (task) => {
  const filtered_tasks = TODO_LIST.filter(each => each !== task)
  TODO_LIST = filtered_tasks;
  setAll();
  render();
}

const bigDelOption = (date) => {
  const filtered_tasks = TODO_LIST.filter(each => each.date_created !== date)
  const filtered_groups = todo_created_at.filter(each => each !== date)
  TODO_LIST = filtered_tasks;
  todo_created_at = filtered_groups;
  setAll();
  render();
}

$('id', 'img-button').addEventListener('click', (event) => {
  event.preventDefault();
  $('class', 'greeting').style.backgroundImage = `url(${$('class', 'bg-input').value})`
  bg_images.push($('class', 'bg-input').value)
  set_bg_image();
  $('class', 'bg-input').value = '';
})

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
    document.getElementById(`g${getDate()}`).style.backgroundColor = '#c35c5a';
  }
}

// INITIALIZER
if(getDate() === 1) {
  setAll();
}

if(GET_TODOS() && get_todo_created_at() && get_bg_images()) {
  GET_TODOS().forEach(each => TODO_LIST.push(each));
  get_todo_created_at().forEach(each => todo_created_at.push(each));
  get_bg_images().forEach(each => bg_images.push(each));
  render();
} else {
  setAll();
}

$('class', 'greeting').style.backgroundImage = `url(${bg_images[randomize(bg_images)]})`;
// =============================
