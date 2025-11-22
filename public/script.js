/********************************************
 *  GENERATE DEVICE ID (Dilakukan sekali)
 ********************************************/
let deviceId = localStorage.getItem("deviceId");
if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
}

/********************************************
 *  Disabled tombol jika user sudah vote
 ********************************************/
document.addEventListener("DOMContentLoaded", async () => {
    if (!window.db) return;

    const db = window.db;
    const voterRef = window.dbRef(db, "voters/" + deviceId);
    const voterSnap = await window.dbGet(voterRef);

    if (voterSnap.exists()) {
        disableButtons();
    }
});

/********************************************
 *  SUBMIT VOTE (cek 100% di Firebase)
 ********************************************/
async function submitVote(option) {
    const db = window.db;

    if (!db) {
        alert("Firebase belum siap, coba refresh halaman.");
        return;
    }

    // REFERENSI UNTUK VOTER INI
    const voterRef = window.dbRef(db, "voters/" + deviceId);
    const voterSnap = await window.dbGet(voterRef);

    // CEK APAKAH SUDAH PERNAH VOTE
    if (voterSnap.exists()) {
        alert("Kamu sudah pernah vote!");
        disableButtons();
        return;
    }

    // AMBIL DATA TOTAL VOTE
    const votesRef = window.dbRef(db, "votes");
    const votesSnap = await window.dbGet(votesRef);
    let totalVotes = votesSnap.val() || { A: 0, B: 0 };

    // TAMBAH VOTE
    totalVotes[option] = (totalVotes[option] || 0) + 1;

    // UPDATE KE FIREBASE
    await window.dbSet(votesRef, totalVotes);

    // TANDAI USER INI SUDAH VOTE
    await window.dbSet(voterRef, true);

    disableButtons();
    alert("Vote berhasil!");
}

/********************************************
 *  FUNGSI UNTUK HTML BUTTON
 ********************************************/
function vote(option) {
    submitVote(option);
}

/********************************************
 *  DISABLE TOMBOL VOTE
 ********************************************/
function disableButtons() {
    document.querySelectorAll(".vote-btn").forEach(btn => {
        btn.disabled = true;
    });
}



/********************************************
 *  SWIPE SLIDER (original code)
 ********************************************/
document.querySelectorAll('.slider').forEach(slider => {
    const slides = slider.querySelector('.slides');
    let startX = 0;
    let currentIndex = 0;

    slider.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });

    slider.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (diff > 50) {
            currentIndex = Math.min(currentIndex + 1, slides.children.length - 1);
        } else if (diff < -50) {
            currentIndex = Math.max(currentIndex - 1, 0);
        }

        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
});
