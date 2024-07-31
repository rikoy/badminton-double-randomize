document.addEventListener("DOMContentLoaded", () => {
    const playerForm = document.getElementById("playerForm");
    const playerList = document.getElementById("playerList");
    const randomizeButton = document.getElementById("randomizeButton");
    const resultModal = document.getElementById("resultModal");
    const result = document.getElementById("result");
    const closeModal = document.getElementById("closeModal");

    function updatePlayerList() {
        const players = JSON.parse(localStorage.getItem("players")) || [];
        playerList.innerHTML = "";
        players.forEach((player, index) => {
            const playerItem = document.createElement("li");
            playerItem.className = "flex justify-between items-center mb-2 p-2 bg-gray-200 rounded-lg";
            playerItem.innerHTML = `
                ${player.nickname} (${player.gender}, ${player.level})
                <button class="removePlayer bg-red-500 text-white px-2 py-1 rounded-lg" data-index="${index}">Remove</button>
            `;
            playerList.appendChild(playerItem);
        });
    }

    playerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const nickname = document.getElementById("nickname").value;
        const gender = document.getElementById("gender").value;
        const level = document.getElementById("level").value;

        if (nickname && gender && level) {
            const players = JSON.parse(localStorage.getItem("players")) || [];
            players.push({ nickname, gender, level });
            localStorage.setItem("players", JSON.stringify(players));
            updatePlayerList();
            playerForm.reset();
        }
    });

    playerList.addEventListener("click", (event) => {
        if (event.target.classList.contains("removePlayer")) {
            const index = event.target.dataset.index;
            const players = JSON.parse(localStorage.getItem("players")) || [];
            players.splice(index, 1);
            localStorage.setItem("players", JSON.stringify(players));
            updatePlayerList();
        }
    });

    randomizeButton.addEventListener("click", () => {
        const players = JSON.parse(localStorage.getItem("players")) || [];
        if (players.length < 4) { // Need at least 4 players to form two pairs
            result.innerHTML = "<tr><td colspan='4'>Not enough players to form two pairs.</td></tr>";
            resultModal.classList.remove("hidden");
            return;
        }

        // Shuffle players
        for (let i = players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [players[i], players[j]] = [players[j], players[i]];
        }

        const pairs = [];
        const playedPairs = new Set();

        while (players.length >= 2) {
            let player1 = players.shift();
            let player2 = players.shift();

            // Ensure the pair is unique
            let pairKey = [player1.nickname, player2.nickname].sort().join('-');
            if (playedPairs.has(pairKey)) {
                players.push(player2); // Put back the second player and continue
                continue;
            }

            pairs.push([player1, player2]);
            playedPairs.add(pairKey); // Add the new pair to the set
        }

        let resultText = "";
        pairs.forEach((pair, index) => {
            if (index % 2 === 0 && index + 1 < pairs.length) {
                const opponentPair = pairs[index + 1];
                resultText += `
                    <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
                        <td class="px-2 py-2 border">${index / 2 + 1}</td>
                        <td class="px-2 py-2 border">${pair[0].nickname} & ${pair[1].nickname}</td>
                        <td class="px-2 py-2 border">VS</td>
                        <td class="px-2 py-2 border">${opponentPair[0].nickname} & ${opponentPair[1].nickname}</td>
                    </tr>
                `;
            }
        });

        result.innerHTML = resultText;
        resultModal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", () => {
        resultModal.classList.add("hidden");
    });

    updatePlayerList();
});