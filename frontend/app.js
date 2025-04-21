const userServiceURL = "http://127.0.0.1:5000/users";
const noteServiceURL = "http://127.0.0.1:5001/notes";

let token = "";

function register() {
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;

    fetch(`${userServiceURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })
        .then(res => res.json())
        .then(data => alert(data.message || data.error));
}

function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    fetch(`${userServiceURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })
        .then(res => res.json())
        .then(data => {
            if (data.access_token) {
                token = data.access_token;
                document.getElementById("auth").style.display = "none";
                document.getElementById("notes-section").style.display = "block";
                loadNotes();
            } else {
                alert(data.error || "Login failed");
            }
        });
}

function loadNotes() {
    fetch(`${noteServiceURL}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then(res => res.json())
        .then(data => {
            const notesDiv = document.getElementById("notes");
            notesDiv.innerHTML = "";
            data.forEach(note => {
                notesDiv.innerHTML += `
          <div>
            <h4>${note.title}</h4>
            <p>${note.content}</p>
            <button onclick="deleteNote(${note.id})">Delete</button>
            <button onclick="editNotePrompt(${note.id}, '${note.title}', '${note.content}')">Edit</button>
          </div>
        `;
            });
        });
}

function createNote() {
    const title = document.getElementById("new-title").value;
    const content = document.getElementById("new-content").value;

    fetch(`${noteServiceURL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
    })
        .then(res => res.json())
        .then(() => {
            loadNotes();
            document.getElementById("new-title").value = "";
            document.getElementById("new-content").value = "";
        });
}

function deleteNote(id) {
    fetch(`${noteServiceURL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    }).then(() => loadNotes());
}

function editNotePrompt(id, currentTitle, currentContent) {
    const newTitle = prompt("New title:", currentTitle);
    const newContent = prompt("New content:", currentContent);

    if (newTitle && newContent) {
        fetch(`${noteServiceURL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title: newTitle, content: newContent }),
        }).then(() => loadNotes());
    }
}
