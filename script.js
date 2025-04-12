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
  const rows = data.slice(1); // Skip header row

  const players = rows.map(row => {
    const name = row[0] || 'Unnamed';
    const total = parseInt(row[10], 10) || 0; // Take total directly from column K (index 10)
    return { name, total };
  });

  players.sort((a, b) => b.total - a.total);

  const topThree = players.slice(0, 3);
  updateTopThree(topThree);
  populateTable(players.slice(3));
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
