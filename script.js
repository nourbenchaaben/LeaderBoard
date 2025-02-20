const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXcmFbYq8WmF100l42JQqDh7tiTeEiMzRpIFlffC54lKRPWi1wC7YP-Z83e7fH4yqOupi20bosuj4X/pub?output=csv';

// Fetch data from the Google Sheet
fetch(sheetURL)
  .then(response => response.text())
  .then(csvData => {
    const rows = csvData.split('\n').map(row => row.split(','));
    processLeaderboard(rows);
  })
  .catch(error => console.error('Error fetching the Google Sheet:', error));

// Process leaderboard data
function processLeaderboard(data) {
  // Extract headers and rows
  const rows = data.slice(1); // Skip the header row

  // Parse rows into objects for easier manipulation, and calculate total points dynamically
  const players = rows.map(row => {
    const ocTeamPoints = parseInt(row[1], 10) || 0; // OC Team :30pts (index 1)
    const bestTaskPoints = parseInt(row[2], 10) || 0; // Best task :20pts (index 2)
    const completeTaskPoints = parseInt(row[3], 10) || 0; // Complete Task 2Opts (index 3)
    const clubEventPoints = parseInt(row[4], 10) || 0; // club event15pts (index 4)
    const assistTeammatePoints = parseInt(row[5], 10) || 0; // Assist a teammate 20pts (index 5)
    const attendMeetPoints = parseInt(row[6], 10) || 0; // attend meet10pts (index 6)
    const sharePostPoints = parseInt(row[7], 10) || 0; // share post 10pts (index 7)
    const activePoints = parseInt(row[8], 10) || 0; // Active 5pts (index 8)
    const likeAndCommentPoints = parseInt(row[9], 10) || 0; // like & comment2pts (index 9)
    
    const total = ocTeamPoints + bestTaskPoints + completeTaskPoints + clubEventPoints + 
                  assistTeammatePoints + attendMeetPoints + sharePostPoints + activePoints + 
                  likeAndCommentPoints; // Calculate total dynamically

    return {
      name: row[0], // Player's name (index 0)
      total
    };
  });

  // Sort players by total points in descending order
  players.sort((a, b) => b.total - a.total);

  // Extract top 3 players and update their profiles
  const topThree = players.slice(0, 3); // Get top 3 players
  updateTopThree(topThree);

  // Populate the leaderboard table with remaining players
  populateTable(players.slice(3)); // Skip the top 3 players for the table
}

// Update the top 3 profiles
function updateTopThree(topThree) {
  const topProfiles = document.querySelectorAll('.profile');

  topThree.forEach((player, index) => {
    const profile = topProfiles[index];
    const imageUrl = `https://via.placeholder.com/100?text=${player.name.charAt(0)}`; // Placeholder image
    profile.querySelector('.profile-image img').src = imageUrl;
    profile.querySelector('.name').innerText = player.name;
    profile.querySelector('.total-score').innerText = player.total; // Total points
  });
}

// Populate the leaderboard table with remaining players
function populateTable(players) {
  const tbody = document.getElementById('leaderboard-data');
  tbody.innerHTML = ''; // Clear existing table rows

  players.forEach((player, index) => {
    const tableRow = `
      <tr>
        <td>${index + 4}</td> <!-- Rank starts after top 3 -->
        <td>${player.name}</td>
        <td>${player.total}</td>
      </tr>
    `;
    tbody.innerHTML += tableRow;
  });
}
