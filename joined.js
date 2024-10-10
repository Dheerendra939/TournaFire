// Assuming Firebase is already configured in your project
const db = firebase.firestore();
const auth = firebase.auth();

// On page load, get the tournaments the user has joined
auth.onAuthStateChanged(user => {
    if (user) {
        const userId = user.uid;

        // Fetch the user's Free Fire name
        db.collection('users').doc(userId).get().then(doc => {
            if (doc.exists) {
                const freeFireName = doc.data().freeFireName;
                fetchJoinedTournaments(freeFireName);
            }
        }).catch(error => {
            console.error("Error fetching user data: ", error);
        });
    } else {
        alert("Please sign in to view your joined tournaments.");
    }
});

// Fetch tournaments where the user is present in the participant list
function fetchJoinedTournaments(freeFireName) {
    const joinedSection = document.getElementById('joined-tournaments');

    db.collection('tournaments').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const tournamentData = doc.data();
            const players = tournamentData.players || [];

            // Loop through all groups of 48 players
            players.forEach((group, index) => {
                if (group.includes(freeFireName)) {
                    // Create a new table for the group where the user is present
                    const tableDiv = document.createElement('div');
                    tableDiv.classList.add('tournament-group');

                    const title = document.createElement('h2');
                    title.textContent = `${doc.id} - Group ${index + 1}`;
                    tableDiv.appendChild(title);

                    const table = document.createElement('table');
                    table.classList.add('players-table');
                    const tableBody = document.createElement('tbody');

                    // Add each player in the group to the table
                    group.forEach(playerName => {
                        const row = document.createElement('tr');
                        const cell = document.createElement('td');
                        cell.textContent = playerName;
                        row.appendChild(cell);
                        tableBody.appendChild(row);
                    });

                    table.appendChild(tableBody);
                    tableDiv.appendChild(table);
                    joinedSection.appendChild(tableDiv);
                }
            });
        });

        if (joinedSection.innerHTML === '') {
            // If no tournaments were joined, display a message
            joinedSection.innerHTML = '<p>You have not joined any tournaments yet.</p>';
        }
    }).catch(error => {
        console.error("Error fetching tournaments: ", error);
    });
}
