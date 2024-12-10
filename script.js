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
  const headers = data[0];
  const rows = data.slice(1);

  // Parse rows into objects for easier manipulation, and calculate total points dynamically
  const players = rows.map(row => {
    const quizPoints = parseInt(row[1], 10) || 0; // Quiz Points
    const taskPoints = parseInt(row[2], 10) || 0; // Task Points
    const engagementPoints = parseInt(row[3], 10) || 0; // Engagement Points
    const sessionPoints = parseInt(row[4], 10) || 0; // Session Points
    const total = quizPoints + taskPoints + engagementPoints + sessionPoints; // Calculate total dynamically
    const taskLink = row[5]; // Task Link (assuming it's the 6th column in the CSV)

    return {
      name: row[0], // Player's name
      quizPoints,
      taskPoints,
      engagementPoints,
      sessionPoints,
      total,
      taskLink, // Add task link to the player object
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

  // Swap the first and second places if needed
  const swappedTopThree = [topThree[1], topThree[0], topThree[2]]; // Swap 1st and 2nd

  swappedTopThree.forEach((player, index) => {
    const profile = topProfiles[index];
    const imageUrl = `https://via.placeholder.com/100?text=${player.name.charAt(0)}`; // Placeholder image
    profile.querySelector('.profile-image img').src = imageUrl;
    profile.querySelector('.name').innerText = player.name;
    profile.querySelector('.total-score').innerText = player.total; // Total points
    profile.querySelector('.quiz-points-value').innerText = player.quizPoints;
    profile.querySelector('.task-points-value').innerText = player.taskPoints;
    profile.querySelector('.engagement-points-value').innerText = player.engagementPoints;
    profile.querySelector('.session-points-value').innerText = player.sessionPoints;
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
        <td>${player.quizPoints}</td>
        <td>${player.taskPoints}</td>
        <td>${player.engagementPoints}</td>
        <td>${player.sessionPoints}</td>
        <td>${player.total}</td>
        <td><a href="${player.taskLink}" target="_blank">View Portfolio</a></td>  <!-- Use dynamic task link -->
        <td>
          <div class="rating" data-name="${player.name}">
            ${[...Array(5)].map((_, i) => 
              `<i class="fas fa-star star" data-value="${i + 1}"></i>`
            ).join('')}
          </div>
        </td>
      </tr>
    `;
    tbody.innerHTML += tableRow;
  });
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('star')) {
    const stars = Array.from(e.target.parentNode.querySelectorAll('.star'));
    const ratingValue = e.target.dataset.value;

    // Reset all stars
    stars.forEach(star => star.classList.remove('selected'));

    // Highlight selected stars from right to left
    stars.slice(-ratingValue).forEach(star => star.classList.add('selected'));

    // Save rating (example only)
    const playerName = e.target.parentNode.dataset.name;
    console.log(`Rated ${playerName} with ${ratingValue} stars`);
  }
});


