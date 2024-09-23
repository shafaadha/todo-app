const body = document.querySelector("body");
const darkLight = document.querySelector("#darkLight");
const sidebar = document.querySelector(".sidebar");
const submenuItems = document.querySelectorAll(".submenu_item");
const sidebarOpen = document.querySelector("#sidebarOpen");
const sidebarClose = document.querySelector(".collapse_sidebar");
const sidebarExpand = document.querySelector(".expand_sidebar");
sidebarOpen.addEventListener("click", () => sidebar.classList.toggle("close"));

sidebarClose.addEventListener("click", () => {
  sidebar.classList.add("close", "hoverable");
});
sidebarExpand.addEventListener("click", () => {
  sidebar.classList.remove("close", "hoverable");
});

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

// Get elements
const addButton = document.getElementById('add-btn');
const todoInput = document.getElementById('todo-input');
const notesContainer = document.getElementById('notes-container');

// Function to add a new sticky note
function addStickyNote() {
    const taskText = todoInput.value.trim();
    
    if (taskText !== '') {
        // Create a new sticky note div
        const stickyNote = document.createElement('div');
        stickyNote.classList.add('sticky-note');
        
        // Add the task text
        stickyNote.innerHTML = `
            ${taskText}
            <button class="delete-btn">&times;</button>
        `;
        
        // Add delete functionality
        stickyNote.querySelector('.delete-btn').addEventListener('click', function() {
            notesContainer.removeChild(stickyNote);
        });

        // Append the sticky note to the container
        notesContainer.appendChild(stickyNote);
        
        // Clear the input field
        todoInput.value = '';
    }
}

// Add event listener to the "Add" button
addButton.addEventListener('click', addStickyNote);

// Optionally, allow pressing "Enter" to add task
todoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addStickyNote();
    }
});

// Array warna yang tersedia untuk sticky notes
const colors = ['#FFEB3B', '#FFCDD2', '#C8E6C9', '#BBDEFB', '#FFAB91', '#FFF59D', '#D1C4E9', '#B2DFDB'];

// Fungsi untuk mendapatkan warna acak dari array
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

// Setelah dokumen dimuat, berikan setiap sticky note warna acak
document.addEventListener('DOMContentLoaded', () => {
  const stickyNotes = document.querySelectorAll('.sticky-note');

  stickyNotes.forEach(note => {
    note.style.backgroundColor = getRandomColor();
  });
});
