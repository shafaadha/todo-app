const body = document.querySelector("body");
const darkLight = document.querySelector("#darkLight");
const sidebar = document.querySelector(".sidebar");
const submenuItems = document.querySelectorAll(".submenu_item");


sidebar.addEventListener("mouseenter", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.remove("close");
  }
});
sidebar.addEventListener("mouseleave", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.add("close");
  }
});

darkLight.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    document.setI
    darkLight.classList.replace("bx-sun", "bx-moon");
  } else {
    darkLight.classList.replace("bx-moon", "bx-sun");
  }
});

submenuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    item.classList.toggle("show_submenu");
    submenuItems.forEach((item2, index2) => {
      if (index !== index2) {
        item2.classList.remove("show_submenu");
      }
    });
  });
});

if (window.innerWidth < 768) {
  sidebar.classList.add("close");
} else {
  sidebar.classList.remove("close");
}

const addButton = document.getElementById('add-btn');
const todoInput = document.getElementById('todo-input');
const notesContainer = document.getElementById('notes-container');

function addStickyNote() {
    const taskText = todoInput.value.trim();
    
    if (taskText !== '') {
        const stickyNote = document.createElement('div');
        stickyNote.classList.add('sticky-note');
        
        stickyNote.innerHTML = `
            ${taskText}
            <button class="delete-btn">&times;</button>
        `;
        
        stickyNote.querySelector('.delete-btn').addEventListener('click', function() {
            notesContainer.removeChild(stickyNote);
        });

        notesContainer.appendChild(stickyNote);

        todoInput.value = '';
    }
}

addButton.addEventListener('click', addStickyNote);


todoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addStickyNote();
    }
});

const colors = ['#FFEB3B', '#FFCDD2', '#C8E6C9', '#BBDEFB', '#FFAB91', '#FFF59D', '#D1C4E9', '#B2DFDB'];

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

document.addEventListener('DOMContentLoaded', () => {
  const stickyNotes = document.querySelectorAll('.sticky-note');

  stickyNotes.forEach(note => {
    note.style.backgroundColor = getRandomColor();
  });
});

document.addEventListener("DOMContentLoaded", function(){
  const stickyNotes = document.querySelectorAll('.sticky-note');

  stickyNotes.forEach(note=>{
    const category = note.querySelector('.todo-category').innerText.trim().toLowerCase();
    if(category === 'work'){
      note.classList.add('work')
    } else if(category === 'personal'){
      note.classList.add('personal')
    } else{
      note.classList.add('other');
    }
  });
});