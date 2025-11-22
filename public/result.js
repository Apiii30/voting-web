console.log("result.js loaded");
function loadLiveResults() {
    const db = window.db;
    const dbRef = window.dbRef;

    // Dengarkan data secara realtime
    window.onValue(window.dbRef(db, "votes"), (snapshot) => {
        const data = snapshot.val() || { A: 0, B: 0 };
        updateChart(data.A, data.B);
    });
}

let chartInstance = null;

function updateChart(a, b) {
    const ctx = document.getElementById("chartCanvas").getContext("2d");

    // Hancurkan chart lama agar tidak duplikat
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Kandidat A", "Kandidat B"],
            datasets: [{
                data: [a, b],
                backgroundColor: ["#4da6ff", "#0059b3"],
                hoverOffset: 12
            }]
        },
        options: {
            responsive: true,
            animation: false // agar refresh cepat & realtime
        }
    });
}

loadLiveResults();
