// Saat halaman dibuka, cek apakah user sudah vote
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("hasVoted")) {
        disableButtons();
    }
});

// Fungsi kirim vote ke Firebase
async function submitVote(option) {
    // Cegah vote ganda
    if (localStorage.getItem("hasVoted")) {
        alert("Kamu sudah vote!");
        return;
    }

    // Pastikan Firebase sudah ter-load
    if (!window.db || !window.dbRef) {
        alert("Firebase belum siap. Coba refresh halaman.");
        return;
    }

    const db = window.db;

    try {
        // Ambil data vote
        const snapshot = await window.dbGet(window.dbRef(db, "votes"));
        let data = snapshot.val() || { A: 0, B: 0 };

        // Tambah vote
        data[option] = (data[option] || 0) + 1;

        // Simpan data ke Firebase
        await window.dbSet(window.dbRef(db, "votes"), data);

        // Tandai sudah vote
        localStorage.setItem("hasVoted", "true");
        disableButtons();

        alert("Vote kamu berhasil!");
    } catch (err) {
        console.error(err);
        alert("Gagal mengirim vote. Coba lagi.");
    }
}

// Fungsi wrapper untuk HTML
function vote(option) {
    submitVote(option);
}

// Nonaktifkan tombol
function disableButtons() {
    document.querySelectorAll(".vote-btn").forEach(btn => {
        btn.disabled = true;
    });
}


// SWIPE SLIDER
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
