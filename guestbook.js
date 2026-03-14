const repoOwner = "AL3DPrint";
const repoName = "al3dprint-gaestebuch";
const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/issues`;

async function loadGuestbook() {
    const response = await fetch(apiUrl);
    const issues = await response.json();

    const container = document.getElementById("guestbook-entries");
    if (!container) return;

    container.innerHTML = "";

    issues.forEach(issue => {
        const label = issue.labels.find(l => l.name.startsWith("stars-"));
        const stars = label ? parseInt(label.name.replace("stars-", ""), 10) : 5;

        const entry = document.createElement("div");
        entry.className = "entry";

        entry.innerHTML = `
            <div class="name">${issue.title}</div>
            <div class="stars">${"★".repeat(stars)}${"☆".repeat(5 - stars)}</div>
            <div class="date">${new Date(issue.created_at).toLocaleDateString()}</div>
            <div class="message">${issue.body.replace(/\n/g, "<br>")}</div>
        `;

        container.appendChild(entry);
    });
}

document.addEventListener("DOMContentLoaded", loadGuestbook);
