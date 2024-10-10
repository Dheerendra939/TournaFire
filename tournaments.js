// Assuming Firebase is already configured in your project
const db = firebase.firestore();
const auth = firebase.auth();

// Function to join a tournament
function joinTournament(tournamentName, entryFee) {
    const user = auth.currentUser;
    
    if (!user) {
        alert("Please sign in to join a tournament");
        return;
    }

    const userId = user.uid;

    // Fetch the user's current balance from the database
    db.collection('users').doc(userId).get().then(doc => {
        if (doc.exists) {
            let userData = doc.data();
            let currentBalance = userData.balance;

            if (currentBalance >= entryFee) {
                // Deduct the entry fee from the user's balance
                let newBalance = currentBalance - entryFee;

                // Update the user's balance in Firestore
                db.collection('users').doc(userId).update({
                    balance: newBalance
                });

                // Add the user's Free Fire name to the tournament participants table
                addToTournament(tournamentName, userData.freeFireName);

                alert("You have successfully joined the tournament!");
            } else {
                alert("Insufficient balance to join the tournament.");
            }
        }
    }).catch(error => {
        console.error("Error fetching user data: ", error);
    });
}

// Function to add the user to the appropriate tournament group
function addToTournament(tournamentName, freeFireName) {
    const tournamentRef = db.collection('tournaments').doc(tournamentName);

    tournamentRef.get().then(doc => {
        if (doc.exists) {
            let tournamentData = doc.data();
            let players = tournamentData.players || [];
            
            // Check if the last group is full (48 players)
            let currentGroup = players[players.length - 1];

            if (!currentGroup || currentGroup.length >= 48) {
                // Create a new group if the last one is full
                currentGroup = [];
                players.push(currentGroup);
            }

            // Add the user's Free Fire name to the current group
            currentGroup.push(freeFireName);

            // Update the tournament document in Firestore
            tournamentRef.update({
                players: players
            });

        } else {
            // If the tournament doesn't exist, create it and add the player
            tournamentRef.set({
                players: [[freeFireName]]  // Start with the first player in a new group
            });
        }
    }).catch(error => {
        console.error("Error joining the tournament: ", error);
    });
             }
