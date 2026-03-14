/* ============================================================
   AL 3D PRINT – GUESTBOOK SYSTEM
   Automatische Issue-Erstellung + Kundenmeinungen laden
   ============================================================ */

/* -----------------------------
   1. Kundenmeinungen laden
------------------------------ */

const repoOwner = "AL3DPrint";
const repoName = "al3dprint-gaestebuch";
const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/issues`;

async function loadGuestbook() {
    console.log("Lade Kundenmeinungen...");

    const container = document.getElementById("guestbook-entries");
    if (!container) {
        console.warn("Kein #guestbook-entries Container auf dieser Seite.");
        return;
    }

    try {
        const response = await fetch(apiUrl);
        const issues = await response.json();

        console.log("API Antwort:", issues);

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

    } catch (error) {
        console.error("Fehler beim Laden der Kundenmeinungen:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadGuestbook);


/* -----------------------------
   2. Eintrag absenden (Action)
------------------------------ */

async function submitGuestbookEntry() {
    const name = document.getElementById("gb-name").value.trim();
    const message = document.getElementById("gb-message").value.trim();
    const stars = document.getElementById("gb-stars").value;

    if (!name || !message) {
        alert("Bitte Name und Nachricht ausfüllen.");
        return;
    }

    const workflowUrl =
        "https://api.github.com/repos/AL3DPrint/al3dprint-gaestebuch/actions/workflows/create-issue.yml/dispatches";

    const payload = {
        ref: "main",
        inputs: {
            name: name,
            message: message,
            stars: stars
        }
    };

    console.log("Sende an GitHub Action:", payload);

    const response = await fetch(workflowUrl, {
        method: "POST",
        headers: {
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json"
            // KEIN TOKEN – alles läuft über GitHub Secrets
        },
        body: JSON.stringify(payload)
    });

    if (response.status === 204) {
        alert("Danke! Dein Eintrag wurde erfolgreich gesendet.");
        document.getElementById("guestbook-form").reset();
    } else {
        alert("Fehler beim Senden. Bitte später erneut versuchen.");
        console.error("Fehler:", await response.text());
    }
}
