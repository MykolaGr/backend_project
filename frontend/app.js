// Base URLs
const USER_SERVICE_URL = "http://127.0.0.1:5000/users";
const NOTE_SERVICE_URL = "http://127.0.0.1:5001/notes";

// Register
const registerBtn = document.getElementById("registerBtn");
registerBtn.addEventListener("click", async () => {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    const res = await fetch(`${USER_SERVICE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.message || data.error);
});

// Login
const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(`${USER_SERVICE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        document.getElementById("auth").style.display = "none";
        document.getElementById("notes").style.display = "block";
        loadNotes();
    } else {
        alert(data.error || "Login failed");
    }
});

// Create Note
const createNoteBtn = document.getElementById("createNoteBtn");
createNoteBtn.addEventListener("click", async () => {
    const title = document.getElementById("noteTitle").value;
    const content = document.getElementById("noteContent").value;
    const token = localStorage.getItem("token");

    const res = await fetch(`${NOTE_SERVICE_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
    });

    const data = await res.json();
    alert(data.message || data.error);
    loadNotes();
});

// Load Notes
async function loadNotes() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${NOTE_SERVICE_URL}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const notes = await res.json();
    const notesList = document.getElementById("notesList");
    notesList.innerHTML = "";
    notes.forEach(note => {
        const li = document.createElement("li");
        li.innerText = `${note.title}: ${note.content}`;
        notesList.appendChild(li);
    });
} 
