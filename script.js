
// ==================================
// SISTEM LOGIN DAN REGISTER DEMO
// ==================================

// Fungsi mengambil data akun demo
function getUsers() {
    return JSON.parse(localStorage.getItem("digismart_users")) || [];
}

// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;

        const users = getUsers();

        if (users.some(user => user.email === email)) {
            document.getElementById("registerMessage").textContent =
                "Email sudah terdaftar!";
            return;
        }

        users.push({
            name: name,
            email: email,
            password: password,
            score: 0,
            quizCount: 0,
            materialCount: 0
        });

        localStorage.setItem("digismart_users", JSON.stringify(users));

        document.getElementById("registerMessage").textContent =
            "Pendaftaran berhasil! Silakan masuk.";

        registerForm.reset();
    });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const users = getUsers();

        const user = users.find(u =>
            u.email === email && u.password === password
        );

        if (user) {
            sessionStorage.setItem("digismart_user", email);
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("loginMessage").textContent =
                "Email atau kata sandi salah!";
        }
    });
}

// CEK LOGIN
function getCurrentUser() {
    const email = sessionStorage.getItem("digismart_user");

    if (!email) return null;

    return getUsers().find(user => user.email === email) || null;
}

// PROTEKSI HALAMAN
const protectedPages = [
    "dashboard.html",
    "materi.html",
    "kuis.html"
];

if (protectedPages.includes(location.pathname.split("/").pop())) {
    if (!getCurrentUser()) {
        window.location.href = "login.html";
    }
}

// LOGOUT
function logout() {
    sessionStorage.removeItem("digismart_user");
    window.location.href = "login.html";
}

// DASHBOARD
const currentUser = getCurrentUser();

if (currentUser) {

    const nameElement = document.getElementById("userName");
    const materialElement = document.getElementById("materialCount");
    const quizElement = document.getElementById("quizCount");
    const scoreElement = document.getElementById("totalScore");

    if (nameElement) nameElement.textContent = currentUser.name;
    if (materialElement) materialElement.textContent = currentUser.materialCount;
    if (quizElement) quizElement.textContent = currentUser.quizCount;
    if (scoreElement) scoreElement.textContent = currentUser.score;
}

// SIMPAN PERUBAHAN DATA
function updateUser(updatedUser) {
    const users = getUsers();

    const index = users.findIndex(u => u.email === updatedUser.email);

    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem("digismart_users", JSON.stringify(users));
    }
}

// MATERI SELESAI
function completeMaterial() {
    const user = getCurrentUser();

    if (!user) return;

    user.materialCount++;
    updateUser(user);

    alert("Selamat! Materi berhasil diselesaikan.");

    location.reload();
}

// ==================================
// KUIS LITERASI DIGITAL
// ==================================

const questions = [
    {
        question: "Apa yang dimaksud dengan hoaks?",
        options: [
            "Informasi yang selalu benar",
            "Informasi palsu atau menyesatkan",
            "Informasi resmi pemerintah",
            "Informasi pendidikan"
        ],
        answer: 1
    },
    {
        question: "Apa yang harus dilakukan ketika menerima berita mencurigakan?",
        options: [
            "Langsung menyebarkannya",
            "Memercayainya begitu saja",
            "Memeriksa sumber dan kebenarannya",
            "Mengabaikannya tanpa memeriksa"
        ],
        answer: 2
    },
    {
        question: "Bagaimana cara menjaga keamanan akun?",
        options: [
            "Membagikan password",
            "Menggunakan password yang kuat",
            "Menggunakan password yang sama di semua akun",
            "Memberikan kode OTP kepada orang lain"
        ],
        answer: 1
    },
    {
        question: "Apa yang dimaksud jejak digital?",
        options: [
            "Rekaman aktivitas di internet",
            "Jenis perangkat komputer",
            "Aplikasi pengolah gambar",
            "Jaringan internet"
        ],
        answer: 0
    },
    {
        question: "Bagaimana menggunakan AI secara bijak?",
        options: [
            "Memercayai semua jawabannya",
            "Menggunakan AI untuk menyontek",
            "Memeriksa kembali hasil AI",
            "Memasukkan semua data pribadi"
        ],
        answer: 2
    }
];

let currentQuestion = 0;
let answers = [];

function showQuestion() {

    const area = document.getElementById("quizArea");

    if (!area) return;

    const q = questions[currentQuestion];

    area.innerHTML = `
        <h3>Pertanyaan ${currentQuestion + 1} dari ${questions.length}</h3>
        <h3>${q.question}</h3>

        ${q.options.map((option, index) => `
            <label>
                <input type="radio" name="answer" value="${index}">
                ${option}
            </label>
        `).join("")}
    `;

    document.getElementById("nextButton").textContent =
        currentQuestion === questions.length - 1
        ? "Selesaikan Kuis"
        : "Pertanyaan Selanjutnya";
}

function nextQuestion() {

    const selected = document.querySelector(
        'input[name="answer"]:checked'
    );

    if (!selected) {
        alert("Silakan pilih jawaban terlebih dahulu!");
        return;
    }

    answers.push(Number(selected.value));

    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {

    const correct = questions.filter((q, index) =>
        q.answer === answers[index]
    ).length;

    const score = correct * 20;

    const user = getCurrentUser();

    if (user) {
        user.score += score;
        user.quizCount++;
        updateUser(user);
    }

    document.getElementById("quizArea").innerHTML = "";

    document.getElementById("nextButton").style.display = "none";

    document.getElementById("quizResult").innerHTML = `
        <h2>Kuis Selesai!</h2>
        <p>Jawaban benar: ${correct} dari ${questions.length}</p>
        <h2>Nilai kamu: ${score}</h2>
        <p>Terus tingkatkan pengetahuan literasi digitalmu!</p>
        <button onclick="location.reload()" class="btn-primary">
            Ulangi Kuis
        </button>
        <a href="dashboard.html">Kembali ke Dashboard</a>
    `;
}

if (document.getElementById("quizArea")) {
    showQuestion();
}
