/**
 * Detektif Lingkungan: Misi Sungai Bersih
 * Logika Media Pembelajaran Interaktif Berbasis AI (Fase C / Kelas VI SD)
 */

// ================= GLOBAL STATE =================
const appState = {
  detectiveName: "Detektif Cilik",
  detectiveAvatar: "🕵️‍♂️",
  currentTeam: "Tim Elang Air",
  serialId: "DT-2026-" + Math.floor(100 + Math.random() * 900),
  currentTab: "tab-dashboard",
  checklist: {
    obs: false,
    clue: false,
    ai: false,
    sol: false,
    prod: false
  },
  quiz: {
    currentIndex: 0,
    score: 0,
    timer: null,
    timeLeft: 45,
    selectedOption: null,
    isAnswered: false
  },
  poster: {
    theme: "theme-emerald",
    title: "SELAMATKAN SUNGAI KITA!",
    slogan: "Satu Sampah yang Kau Buang, Merenggut Kehidupan Air",
    action: "Aksi Kita: Bawa Tumbler ke Sekolah, Jangan Buang Minyak ke Selokan, Rawat Tepian Sungai!"
  }
};

// ================= QUIZ DATA (5 SOAL FASE C) =================
const QUIZ_QUESTIONS = [
  {
    category: "IPAS: Dampak Ekosistem",
    question: "Mengapa tumpukan botol plastik di sungai dapat menyebabkan kematian pada ikan-ikan kecil dan burung pemakan ikan?",
    options: [
      { text: "A. Plastik membuat air menjadi manis sehingga ikan kekenyangan", isCorrect: false },
      { text: "B. Plastik terurai menjadi mikroplastik beracun yang tertelan dan merusak organ ikan", isCorrect: true },
      { text: "C. Plastik menyerap seluruh air sungai hingga sungai menjadi kering seketika", isCorrect: false },
      { text: "D. Ikan menyukai plastik untuk membuat sarang bertelur", isCorrect: false }
    ],
    explanation: "Plastik tidak mudah hancur, namun terfragmentasi menjadi partikel sangat kecil (mikroplastik). Mikroplastik diserap plankton dan dimakan ikan, menyebabkan racun kimiawi menumpuk di rantai makanan (biomagnifikasi)."
  },
  {
    category: "IPAS: Rantai Makanan Air Tawar",
    question: "Jika populasi ikan kecil di sungai punah akibat air sungai berbusa detergen, apa dampak langsung yang akan dialami oleh Burung Raja Udang (pemangsa ikan)?",
    options: [
      { text: "A. Jumlah Burung Raja Udang akan bertambah semakin banyak", isCorrect: false },
      { text: "B. Burung Raja Udang akan bermutasi memakan batu kerikil", isCorrect: false },
      { text: "C. Populasi Burung Raja Udang menurun drastis karena kekurangan sumber makanan", isCorrect: true },
      { text: "D. Burung Raja Udang tidak terpengaruh sama sekali oleh ekosistem air", isCorrect: false }
    ],
    explanation: "Dalam rantai makanan, setiap makhluk hidup saling bergantung. Ketika produsen atau konsumen primer/sekunder hilang, predator puncak (seperti burung pemakan ikan) akan kelaparan dan populasinya terancam punah."
  },
  {
    category: "Bahasa Indonesia: Teks Eksplanasi & Fakta",
    question: "Manakah di antara kalimat berikut yang merupakan FAKTA ILMIAH yang dapat dibuktikan dari hasil penyelidikan sungai?",
    options: [
      { text: "A. Sungai yang kotor menurut saya terlihat lebih keren dan misterius", isCorrect: false },
      { text: "B. Ikan di sungai mungkin merasa sedih jika diajak berbicara oleh manusia", isCorrect: false },
      { text: "C. Busa detergen mengandung zat fosfat yang memicu ledakan eceng gondok liar", isCorrect: true },
      { text: "D. Membuang sampah ke selokan adalah hal yang sangat seru untuk dilakukan", isCorrect: false }
    ],
    explanation: "Fakta adalah informasi yang dapat diuji kebenarannya secara ilmiah dan objektif. Pilihan C memuat data kimiawi (zat fosfat dan eutrofikasi eceng gondok), sedangkan pilihan lainnya adalah opini subjektif."
  },
  {
    category: "Nalar Kritis & Penggunaan AI",
    question: "Ketika kamu bertanya kepada AI tentang solusi membersihkan sungai, AI menjawab: 'Gunakan cairan kimia pemutih sebanyak-banyaknya ke dalam sungai'. Sikap detektif yang paling tepat adalah...",
    options: [
      { text: "A. Langsung mempraktikkannya ke sungai karena AI selalu 100% benar", isCorrect: false },
      { text: "B. Memeriksa ulang fakta dengan buku IPAS dan menolaknya karena cairan pemutih meracuni air", isCorrect: true },
      { text: "C. Menyuruh seluruh teman sekelas membeli cairan pemutih tanpa bertanya ke guru", isCorrect: false },
      { text: "D. Mengabaikan semua tugas dan tidur di kelas", isCorrect: false }
    ],
    explanation: "AI adalah mitra berpikir, bukan penentu mutlak! Siswa yang cerdas wajib menggunakan nalar kritis untuk memverifikasi kebenaran dan keselamatan saran AI dengan bimbingan guru dan buku sumber."
  },
  {
    category: "Bahasa Indonesia & Solusi Kreatif",
    question: "Manakah kalimat slogan persuasif yang paling efektif dan menggugah untuk poster kampanye kebersihan sungai anak SD?",
    options: [
      { text: "A. Sungai adalah tempat air mengalir dari hulu ke hilir.", isCorrect: false },
      { text: "B. 'Sungai Kita, Sumber Hayat Kita: Tolak Plastik Sekali Pakai, Selamatkan Kehidupan!'", isCorrect: true },
      { text: "C. Barang siapa yang buang sampah di sini akan saya laporkan polisi.", isCorrect: false },
      { text: "D. Ikan berenang di air menggunakan sirip.", isCorrect: false }
    ],
    explanation: "Slogan kampanye harus bersifat persuasif (mengajak), ringkas, berima/bermakna mendalam, dan menumbuhkan kepedulian pembaca tanpa nada mengancam yang kasar."
  }
];

// ================= AI PRESET KNOWLEDGE =================
const AI_KNOWLEDGE_BASE = {
  "bagaimana_plastik_jadi_mikroplastik": {
    q: "Bagaimana plastik berubah jadi mikroplastik?",
    a: "Detektif Tirta menjelaskan: Botol dan kantong plastik yang dibuang ke sungai terkena panas sinar matahari, gesekan batu, dan arus air selama berbulan-bulan hingga bertahun-tahun. Proses ini disebut *fotodegradasi*. Plastik pecah menjadi serpihan berukuran kurang dari 5 milimeter yang disebut **mikroplastik**. Serpihan ini tak kasat mata namun sangat beracun bagi lambung ikan!"
  },
  "dampak_detergen_ikan": {
    q: "Apa dampak busa detergen bagi insang ikan?",
    a: "Detektif Tirta menjelaskan: Busa sabun dan detergen rumah tangga mengandung surfaktan dan fosfat. Lapisan busa merusak lendir pelindung insang ikan sehingga insang meradang dan ikan megap-megap kekurangan oksigen. Selain itu, fosfat menyebabkan *algae bloom* (ledakan ganggang) yang menghabiskan oksigen terlarut di air saat malam hari."
  },
  "kenapa_capung_hilang": {
    q: "Mengapa capung lenyap saat air tercemar?",
    a: "Detektif Tirta menjelaskan: Capung betina bertelur di air bersih. Larva capung (nimfa) bernapas dengan insang internal di dalam air tawar. Nimfa capung sangat sensitif terhadap zat beracun dan minimnya oksigen. Jika air sungai keruh beracun, nimfa mati dan capung dewasa punah dari ekosistem tersebut. Capung adalah **bioindikator alami** kesehatan air!"
  },
  "ide_daur_ulang": {
    q: "Bagaimana cara mencegah sampah masuk sungai?",
    a: "Detektif Tirta memberikan 3 langkah taktis detektif:\n1. Terapkan prinsip 3R di sekolah: Bawa botol minum isi ulang (Tumbler) & wadah makan sendiri.\n2. Pasang jaring penyaring sampah sederhana di parit/selokan depan sekolah.\n3. Kampanyekan pemilahan sampah organik dan anorganik melalui poster kreatif!"
  }
};

// ================= DOM ELEMENTS & INIT =================
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initTeamSelection();
  initChecklist();
  initAudioNarration();
  initPosterPreview();
  initRubricCalculator();
});

// ================= TAB NAVIGATION =================
function initTabs() {
  const navBtns = document.querySelectorAll(".nav-btn");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });
}

function switchTab(tabId) {
  // Update nav buttons
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  // Update tab panes
  document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
  const targetPane = document.getElementById(tabId);
  if (targetPane) {
    targetPane.classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  appState.currentTab = tabId;
}

// ================= DETECTIVE IDENTITY & TEAM SELECTION =================
function initTeamSelection() {
  const confirmBtn = document.getElementById("btn-confirm-team");
  const nameInput = document.getElementById("input-detective-name");
  const selectElem = document.getElementById("select-team");
  const avatarButtons = document.querySelectorAll(".avatar-opt-btn");

  // Avatar picker listener
  avatarButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      avatarButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      appState.detectiveAvatar = btn.getAttribute("data-avatar") || "🕵️‍♂️";
    });
  });

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      let customName = nameInput ? nameInput.value.trim() : "";
      if (!customName) {
        customName = "Detektif Cilik";
        if (nameInput) nameInput.value = customName;
      }
      appState.detectiveName = customName;

      const selectedTeam = selectElem ? selectElem.value : "Tim Elang Air";
      appState.currentTeam = selectedTeam;

      // Update Top Nav Pill
      const pillElem = document.getElementById("active-team-name");
      if (pillElem) {
        pillElem.textContent = `${appState.detectiveAvatar} ${appState.detectiveName} • ${appState.currentTeam}`;
      }

      // Update Detective Badge Card
      const badgeName = document.getElementById("badge-display-name");
      const badgeTeam = document.getElementById("badge-display-team");
      const badgeAvatar = document.getElementById("badge-display-avatar");
      const badgeSerial = document.getElementById("badge-display-serial");

      if (badgeName) badgeName.textContent = appState.detectiveName;
      if (badgeTeam) badgeTeam.textContent = appState.currentTeam;
      if (badgeAvatar) badgeAvatar.textContent = appState.detectiveAvatar;
      if (badgeSerial) badgeSerial.textContent = `ID: ${appState.serialId}`;

      // Update Mascot Speech Bubble Greeting
      const mascotGreetingTitle = document.getElementById("mascot-greeting-title");
      const mascotGreetingDesc = document.getElementById("mascot-greeting-desc");
      if (mascotGreetingTitle) {
        mascotGreetingTitle.textContent = `Halo ${appState.detectiveName}!`;
      }
      if (mascotGreetingDesc) {
        mascotGreetingDesc.innerHTML = `"Senang sekali bisa bermitra dengan <strong>${appState.detectiveName}</strong> dari <strong>${appState.currentTeam}</strong>! Ingat semboyan kita: <em>Teliti buktinya, tanya AI dengan cerdas, lalu uji kebenarannya bersama tim!</em>"`;
      }

      // Update Poster Preview Author Signature
      const previewTeam = document.getElementById("preview-team");
      if (previewTeam) {
        previewTeam.textContent = `Karya: ${appState.detectiveAvatar} ${appState.detectiveName} (${appState.currentTeam}) • SD Negeri Harapan`;
      }

      // Update LKPD Printable Preview Info
      const lkpdName = document.getElementById("lkpd-detective-name");
      const lkpdTeam = document.getElementById("lkpd-detective-team");
      if (lkpdName) lkpdName.textContent = `${appState.detectiveAvatar} ${appState.detectiveName}`;
      if (lkpdTeam) lkpdTeam.textContent = appState.currentTeam;

      // Toggle views: hide builder, show badge card
      const builderBox = document.getElementById("detective-builder-box");
      const badgeBox = document.getElementById("detective-badge-display");
      if (builderBox) builderBox.style.display = "none";
      if (badgeBox) badgeBox.style.display = "block";

      alert(`🎖️ LENCANA RESMI DIAKTIFKAN!\n\nSelamat bertugas, ${appState.detectiveAvatar} ${appState.detectiveName} dari ${appState.currentTeam}!\nLencana detektifmu telah aktif di Markas Misi.`);
      updateChecklistProgress();
    });
  }
}

function editDetectiveIdentity() {
  const builderBox = document.getElementById("detective-builder-box");
  const badgeBox = document.getElementById("detective-badge-display");
  if (builderBox) builderBox.style.display = "block";
  if (badgeBox) badgeBox.style.display = "none";
  const nameInput = document.getElementById("input-detective-name");
  if (nameInput) {
    nameInput.focus();
    nameInput.select();
  }
}

// ================= CHECKLIST & PROGRESS =================
function initChecklist() {
  const checkboxes = document.querySelectorAll(".checklist-items input[type='checkbox']");
  checkboxes.forEach(chk => {
    chk.addEventListener("change", updateChecklistProgress);
  });
}

function updateChecklistProgress() {
  const c1 = document.getElementById("chk-obs")?.checked || false;
  const c2 = document.getElementById("chk-clue")?.checked || false;
  const c3 = document.getElementById("chk-ai")?.checked || false;
  const c4 = document.getElementById("chk-sol")?.checked || false;
  const c5 = document.getElementById("chk-prod")?.checked || false;

  const total = 5;
  let count = (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0) + (c4 ? 1 : 0) + (c5 ? 1 : 0);
  let pct = Math.round((count / total) * 100);

  const fillBar = document.getElementById("overall-progress-bar");
  const fillText = document.getElementById("overall-progress-text");
  if (fillBar) fillBar.style.width = `${Math.max(5, pct)}%`;
  if (fillText) fillText.textContent = `Progres: ${pct}% Selesai`;

  // Update Mission Status Tags
  const s1 = document.getElementById("status-m1");
  const s2 = document.getElementById("status-m2");
  const s3 = document.getElementById("status-m3");

  if (s1) {
    if (c1 && c2 && c3) {
      s1.textContent = "✅ Tuntas";
      s1.className = "status-tag completed";
    } else {
      s1.textContent = "Sedang Berjalan";
      s1.className = "status-tag";
    }
  }

  if (s2) {
    if (c4) {
      s2.textContent = "✅ Tuntas";
      s2.className = "status-tag completed";
    } else if (c1 && c2) {
      s2.textContent = "Siap Dikerjakan";
      s2.className = "status-tag";
    } else {
      s2.textContent = "Terkunci";
    }
  }

  if (s3) {
    if (c5) {
      s3.textContent = "✅ Tuntas";
      s3.className = "status-tag completed";
    } else if (c4) {
      s3.textContent = "Siap Dikerjakan";
      s3.className = "status-tag";
    } else {
      s3.textContent = "Terkunci";
    }
  }
}

// ================= MISI 1: HOTSPOTS & CARDS =================
function showHotspotInfo(type) {
  const titleElem = document.getElementById("detail-title");
  const descElem = document.getElementById("detail-desc");

  if (type === 'polluted') {
    titleElem.innerHTML = "⚠️ Temuan Detektif: Zona Sungai Tercemar";
    descElem.innerHTML = "<strong>Ciri-Ciri Lapangan:</strong> Air berwarna cokelat pekat kehitaman, tercium bau busuk limbah, tumpukan sampah plastik menyumbat aliran. Terlihat ikan-ikan kecil mengapung di permukaan karena <strong>kandungan oksigen terlarut (Dissolved Oxygen)</strong> turun drastis di bawah 3 mg/L. Tanaman dasar sungai mati karena sinar matahari tidak tembus ke dasar air.";
  } else {
    titleElem.innerHTML = "🌿 Temuan Detektif: Zona Alami & Bersih";
    descElem.innerHTML = "<strong>Ciri-Ciri Lapangan:</strong> Air jernih tembus pandang hingga dasar berkerikil. Ikan berenang aktif dan lincah. Bunga teratai mekar dan rumput air berfotosintesis menghasilkan gelembung oksigen segar. Ditemukan capung dan larva serangga air yang menandakan lingkungan air sehat tanpa racun berbahaya.";
  }

  // Mark observation check
  const chkObs = document.getElementById("chk-obs");
  if (chkObs) {
    chkObs.checked = true;
    updateChecklistProgress();
  }
}

function toggleCard(cardElem) {
  cardElem.classList.toggle("flipped");
  const chkClue = document.getElementById("chk-clue");
  if (chkClue) {
    chkClue.checked = true;
    updateChecklistProgress();
  }
}

// ================= AUDIO NARRATION (WEB SPEECH API) =================
function initAudioNarration() {
  // Preload speech synthesis voices if available
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }
}

function playAudioNarration(type) {
  const btn = document.getElementById("btn-audio-m1");
  const text = "Halo Detektif Cilik! Detektif Tirta di sini. Perhatikan gambar sungai di depanmu. Di sisi kiri, sampah plastik dan busa detergen merusak rumah bagi ribuan ikan. Di sisi kanan, air jernih mengalir memberikan kehidupan. Mengapa ini bisa terjadi? Ayo selidiki berkas kartu petunjuk dan uji jawaban AI bersama timmu!";

  if (!('speechSynthesis' in window)) {
    alert("Audio Narasi: " + text);
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    if (btn) btn.innerHTML = "🔊 Dengarkan Penjelasan Detektif Tirta";
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  if (btn) btn.innerHTML = "⏸️ Hentikan Audio";

  utterance.onend = () => {
    if (btn) btn.innerHTML = "🔊 Dengarkan Penjelasan Detektif Tirta";
  };

  utterance.onerror = () => {
    if (btn) btn.innerHTML = "🔊 Dengarkan Penjelasan Detektif Tirta";
  };

  window.speechSynthesis.speak(utterance);
}

// ================= AI ASISTEN PENELITI =================
function askAiPreset(key) {
  const data = AI_KNOWLEDGE_BASE[key];
  if (!data) return;

  renderAiDialogue(data.q, data.a);
  showVerificationPanel();
}

function submitCustomAiQuery() {
  const input = document.getElementById("ai-user-query");
  const query = input?.value.trim();
  if (!query) {
    alert("Silakan ketik pertanyaan penyelidikan kelompok terlebih dahulu!");
    return;
  }

  let answer = "";
  const lower = query.toLowerCase();

  if (lower.includes("ikan") || lower.includes("mati") || lower.includes("racun")) {
    answer = `Detektif Tirta AI menjawab: Pertanyaan yang hebat tentang ${query}! Limbah kimia dan plastik merusak insang ikan dan menurunkan oksigen air. Akibatnya ikan tidak bisa bernapas dan mengalami kematian massal. Coba kalian cek buku IPAS: zat apa saja yang biasa mencemari air sungai?`;
  } else if (lower.includes("sampah") || lower.includes("plastik") || lower.includes("botol")) {
    answer = `Detektif Tirta AI menjawab: Masalah sampah plastik sangat krusial! Plastik tidak membusuk, tapi terurai jadi mikroplastik yang tertelan hewan air. Menurut dataku, 80% sampah laut berasal dari sungai yang tidak dirawat warga.`;
  } else if (lower.includes("solusi") || lower.includes("cara") || lower.includes("bersih")) {
    answer = `Detektif Tirta AI menjawab: Solusi terbaik dimulai dari sekolah kita: 1) Jangan buang sampah ke parit, 2) Buat poster kampanye untuk mengedukasi warga sekitar, 3) Adakan kerja bakti sungai berkala bersama guru dan orang tua.`;
  } else {
    answer = `Detektif Tirta AI menjawab: Pertanyaan penyelidikanmu "${query}" sangat menarik untuk dibahas! Menurut prinsip sains lingkungan, setiap perubahan pada sungai akan berdampak langsung pada siklus air dan kesehatan manusia di sekitarnya. Ayo diskusikan dengan guru dan buktikan dengan membaca buku referensi kelas 6!`;
  }

  renderAiDialogue(query, answer);
  if (input) input.value = "";
  showVerificationPanel();
}

function renderAiDialogue(userQuestion, aiAnswer) {
  const chatBox = document.getElementById("ai-chat-box");
  if (!chatBox) return;

  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble bubble-user";
  userBubble.innerHTML = `<strong>${appState.detectiveAvatar} ${escapeHtml(appState.detectiveName)} (${escapeHtml(appState.currentTeam)}):</strong><p>${escapeHtml(userQuestion)}</p>`;
  chatBox.appendChild(userBubble);

  const aiBubble = document.createElement("div");
  aiBubble.className = "chat-bubble bubble-assistant";
  aiBubble.innerHTML = `<strong>Detektif Tirta AI:</strong><p>${formatMarkdownText(aiAnswer)}</p>`;
  chatBox.appendChild(aiBubble);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function showVerificationPanel() {
  const panel = document.getElementById("verification-panel");
  if (panel) {
    panel.style.display = "block";
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function completeVerification() {
  const chk1 = document.getElementById("vchk-1")?.checked;
  const chk2 = document.getElementById("vchk-2")?.checked;
  const chk3 = document.getElementById("vchk-3")?.checked;

  if (!chk1 || !chk2) {
    alert("🔍 Detektif yang teliti harus mencentang minimal fakta ilmiah dan kesesuaian bahasa sebelum konfirmasi!");
    return;
  }

  alert("🌟 Hebat! Kelompokmu berhasil memverifikasi jawaban AI dengan nalar kritis tingkat tinggi. +100 Poin Nalar Ilmiah!");
  const chkAi = document.getElementById("chk-ai");
  if (chkAi) {
    chkAi.checked = true;
    updateChecklistProgress();
  }
}

// ================= MISI 2: FISHBONE & BRAINSTORMING =================
const FISHBONE_DETAILS = {
  "manusia": {
    title: "Akar Masalah: Kebiasaan Manusia (Perilaku)",
    content: "Banyak warga terbiasa menganggap sungai sebagai tempat sampah raksasa yang 'gratis'. Hal ini terjadi karena minimnya rasa memiliki terhadap lingkungan dan rendahnya pemahaman bahwa selokan mengalir langsung ke sumber air minum bersama.<br><br><strong>Arah Solusi:</strong> Edukasi persuasif, teladan teman sebaya, dan kampanye duta lingkungan sekolah."
  },
  "limbah": {
    title: "Akar Masalah: Limbah Domestik & Rumah Tangga",
    content: "Air cucian piring berlemak, sisa minyak jelantah, dan detergen pakaian dialirkan tanpa penyaringan ke selokan. Lemak menggumpal menyumbat pipa, sementara detergen berbusa membunuh mikroorganisme baik pengurai air.<br><br><strong>Arah Solusi:</strong> Pembuatan bak kontrol penyaring sabun sederhana dan tidak membuang minyak jelantah ke saluran air."
  },
  "fasilitas": {
    title: "Akar Masalah: Fasilitas Tempat Sampah Minim",
    content: "Di sekitar tepian sungai atau jembatan sering kali tidak ada tempat sampah terpilah yang memadai, sehingga pejalan kaki atau pengendara motor melemparkan kantong sampah begitu saja saat melintas.<br><br><strong>Arah Solusi:</strong> Mengusulkan penempatan tong sampah terpilah (organik & anorganik) serta papan peringatan persuasif."
  },
  "aliran": {
    title: "Akar Masalah: Pendangkalan Sungai (Sedimentasi)",
    content: "Lumpur dan sampah yang mengendap di dasar sungai mengurangi kedalaman sungai dari semula 3 meter menjadi hanya 1 meter. Akibatnya saat hujan deras turun, sungai tidak mampu menampung volume air sehingga meluap dan membanjiri sekolah serta pemukiman warga.<br><br><strong>Arah Solusi:</strong> Normalisasi pengerukan sampah berkala dan penanaman pohon akar kuat (bambu/vetiver) di bantaran sungai."
  }
};

function openBoneModal(boneKey) {
  const modal = document.getElementById("bone-modal");
  const title = document.getElementById("modal-bone-title");
  const content = document.getElementById("modal-bone-content");
  const data = FISHBONE_DETAILS[boneKey];

  if (modal && data) {
    title.textContent = data.title;
    content.innerHTML = data.content;
    modal.classList.add("active");
  }
}

function closeBoneModal() {
  const modal = document.getElementById("bone-modal");
  if (modal) modal.classList.remove("active");
}

function generateCampaignIdeas() {
  const container = document.getElementById("ideas-container");
  const summaryBox = document.getElementById("solution-summary");
  if (!container) return;

  const ideas = [
    {
      id: 1,
      title: "🥤 Gerakan 'Tumbler Hero' Sekolah",
      desc: "Setiap siswa kelas 6 membawa botol minum sendiri dan menolak membeli minuman kemasan plastik sekali pakai di kantin selama 30 hari penuh."
    },
    {
      id: 2,
      title: "🪱 Sedekah Minyak Jelantah",
      desc: "Mengumpulkan sisa minyak goreng bekas dari dapur rumah warga untuk disetor ke bank daur ulang menjadi lilin aromaterapi / biodiesel, tidak dibuang ke got."
    },
    {
      id: 3,
      title: "🎨 Lomba Poster Digital & Orasi Sungai",
      desc: "Menempelkan poster infografik di mading sekolah dan merekam orasi ajakan 60 detik untuk dibagikan di media sosial sekolah atau grup WhatsApp wali murid."
    },
    {
      id: 4,
      title: "🕸️ Operasi Jaring Penangkap Sampah Parit",
      desc: "Memasang jaring kawat sederhana di saluran air sekolah bersama penjaga sekolah untuk menyaring plastik sebelum air mengalir ke sungai utama."
    },
    {
      id: 5,
      title: "🌱 Adopsi Pohon Tepian Sungai",
      desc: "Menanam tanaman berakar penyerap air di sepanjang selokan/sungai dekat sekolah agar air tidak longsor dan air tetap jernih alami."
    }
  ];

  let html = "";
  ideas.forEach(item => {
    html += `
      <div class="idea-card">
        <span class="idea-num">IDE #${item.id}</span>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
        <div class="idea-actions">
          <button class="btn btn-outline btn-select-idea" onclick="selectIdea('${item.title}', '${item.desc}')">
            🎯 Pilih Ide Ini
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (summaryBox) summaryBox.style.display = "block";
}

function selectIdea(title, desc) {
  const inputTitle = document.getElementById("chosen-idea-title");
  const inputDesc = document.getElementById("chosen-idea-desc");

  if (inputTitle) inputTitle.value = title;
  if (inputDesc) inputDesc.value = `Kami memilih ide ini karena: ${desc}\n\nLangkah nyata yang akan tim kami lakukan di kelas 6: `;
  
  alert(`✅ Ide "${title}" dipilih! Silakan lengkapi alasan dan langkah modifikasinya di kotak di bawah.`);
  inputDesc?.focus();
}

function saveSolutionDraft() {
  const title = document.getElementById("chosen-idea-title")?.value.trim();
  const desc = document.getElementById("chosen-idea-desc")?.value.trim();

  if (!title || !desc) {
    alert("Silakan lengkapi judul inovasi dan alasan modifikasinya terlebih dahulu!");
    return;
  }

  alert("🎉 Luar biasa! Rancangan Solusi Misi 2 tersimpan di Buku Detektif. Sekarang mari kita buat Posternya di Misi 3!");
  const chkSol = document.getElementById("chk-sol");
  if (chkSol) {
    chkSol.checked = true;
    updateChecklistProgress();
  }
}

// ================= MISI 3: POSTER STUDIO & RUBRIC =================
function initPosterPreview() {
  updatePosterPreview();
}

function setPosterTheme(themeClass) {
  const canvas = document.getElementById("poster-preview-box");
  const buttons = document.querySelectorAll(".color-btn");
  
  buttons.forEach(b => b.classList.remove("active"));
  const clicked = document.querySelector(`.color-btn.${themeClass}`);
  if (clicked) clicked.classList.add("active");

  if (canvas) {
    canvas.className = `poster-canvas ${themeClass}`;
    if (themeClass === 'theme-ocean') {
      canvas.style.borderColor = '#0284c7';
    } else if (themeClass === 'theme-sunset') {
      canvas.style.borderColor = '#f59e0b';
    } else if (themeClass === 'theme-dark') {
      canvas.style.borderColor = '#0f172a';
    } else {
      canvas.style.borderColor = '#0f766e';
    }
  }
  appState.poster.theme = themeClass;
}

function updatePosterPreview() {
  const titleVal = document.getElementById("input-poster-title")?.value || "SELAMATKAN SUNGAI KITA!";
  const sloganVal = document.getElementById("input-poster-slogan")?.value || "Satu Sampah yang Kau Buang, Merenggut Kehidupan Air";
  const actionVal = document.getElementById("input-poster-action")?.value || "Aksi Kita: Bawa Tumbler, Tolak Plastik, Rawat Tepian Sungai!";

  const pTitle = document.getElementById("preview-title");
  const pSlogan = document.getElementById("preview-slogan");
  const pAction = document.getElementById("preview-action");

  if (pTitle) pTitle.textContent = titleVal;
  if (pSlogan) pSlogan.textContent = `"${sloganVal}"`;
  if (pAction) pAction.textContent = actionVal;
}

function generateAiSlogan() {
  const slogans = [
    "Sungai Bersih, Hidup Sehat: Jangan Biarkan Ikan Mati Menangis!",
    "Bumi Butuh Sungai Mengalir, Bukan Sampah Plastik yang Membanjir!",
    "Keren Itu Bawa Tumbler, Bukan Buang Sedotan Sembarangan!",
    "Dari Selokan Sekolah Hingga Samudra: Jaga Alirannya Tetap Jernih!",
    "Satu Aksi Detektif Cilik, Menyelamatkan Sejuta Kehidupan Air!"
  ];
  const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
  const inputSlogan = document.getElementById("input-poster-slogan");
  if (inputSlogan) {
    inputSlogan.value = randomSlogan;
    updatePosterPreview();
  }
}

function printPosterOnly() {
  window.print();
  const chkProd = document.getElementById("chk-prod");
  if (chkProd) {
    chkProd.checked = true;
    updateChecklistProgress();
  }
}

function initRubricCalculator() {
  const selects = document.querySelectorAll(".score-dropdown");
  selects.forEach(s => {
    s.addEventListener("change", calculatePeerScore);
  });
}

function calculatePeerScore() {
  const k = parseInt(document.getElementById("score-konsep")?.value || "4");
  const r = parseInt(document.getElementById("score-kreatif")?.value || "4");
  const m = parseInt(document.getElementById("score-media")?.value || "4");
  const c = parseInt(document.getElementById("score-kritis")?.value || "4");
  const g = parseInt(document.getElementById("score-kolab")?.value || "4");

  const total = k + r + m + c + g;
  const grade = Math.round((total / 20) * 100);

  const display = document.getElementById("calculated-total-score");
  if (display) {
    display.textContent = `${total} / 20 (Nilai Akhir: ${grade})`;
  }
}

function savePeerScore() {
  const target = document.getElementById("eval-target-team")?.value || "Kelompok Lain";
  const display = document.getElementById("calculated-total-score")?.textContent || "";
  alert(`📨 Penilaian sejawat untuk ${target} dengan ${display} berhasil disimpan ke Lembar Guru!`);
  
  const chkProd = document.getElementById("chk-prod");
  if (chkProd) {
    chkProd.checked = true;
    updateChecklistProgress();
  }
}

// ================= KUIS DETEKTIF (WORDWALL STYLE) =================
function startQuiz() {
  appState.quiz.currentIndex = 0;
  appState.quiz.score = 0;
  appState.quiz.isAnswered = false;

  showQuizScreen("quiz-question-screen");
  renderQuizQuestion();
}

function showQuizScreen(screenId) {
  document.querySelectorAll(".quiz-screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(screenId);
  if (target) target.classList.add("active");
}

function renderQuizQuestion() {
  const qData = QUIZ_QUESTIONS[appState.quiz.currentIndex];
  if (!qData) {
    finishQuiz();
    return;
  }

  appState.quiz.isAnswered = false;
  appState.quiz.timeLeft = 45;

  // UI labels
  const numLabel = document.getElementById("quiz-num-label");
  const catTag = document.getElementById("q-category-tag");
  const qText = document.getElementById("q-text");
  const scoreBadge = document.getElementById("quiz-current-score");
  const expBox = document.getElementById("q-explanation-box");
  const container = document.getElementById("q-options-container");

  if (numLabel) numLabel.textContent = `Soal ${appState.quiz.currentIndex + 1} dari ${QUIZ_QUESTIONS.length}`;
  if (catTag) catTag.textContent = qData.category;
  if (qText) qText.textContent = qData.question;
  if (scoreBadge) scoreBadge.textContent = appState.quiz.score;
  if (expBox) expBox.style.display = "none";

  // Render Options
  if (container) {
    container.innerHTML = "";
    qData.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `<span>${opt.text}</span>`;
      btn.onclick = () => handleQuizAnswer(opt, btn);
      container.appendChild(btn);
    });
  }

  // Timer
  clearInterval(appState.quiz.timer);
  const timerBadge = document.getElementById("quiz-time-left");
  if (timerBadge) timerBadge.textContent = appState.quiz.timeLeft;

  appState.quiz.timer = setInterval(() => {
    appState.quiz.timeLeft--;
    if (timerBadge) timerBadge.textContent = appState.quiz.timeLeft;

    if (appState.quiz.timeLeft <= 0) {
      clearInterval(appState.quiz.timer);
      if (!appState.quiz.isAnswered) {
        handleTimeoutAnswer();
      }
    }
  }, 1000);
}

function handleQuizAnswer(selectedOpt, btnElem) {
  if (appState.quiz.isAnswered) return;
  appState.quiz.isAnswered = true;
  clearInterval(appState.quiz.timer);

  const qData = QUIZ_QUESTIONS[appState.quiz.currentIndex];
  const allBtns = document.querySelectorAll(".option-btn");

  allBtns.forEach(b => b.disabled = true);

  if (selectedOpt.isCorrect) {
    btnElem.classList.add("correct");
    appState.quiz.score += 20;
    playTone(true);
  } else {
    btnElem.classList.add("wrong");
    playTone(false);
    // Highlight the correct one
    allBtns.forEach((b, i) => {
      if (qData.options[i].isCorrect) {
        b.classList.add("correct");
      }
    });
  }

  // Update current score
  const scoreBadge = document.getElementById("quiz-current-score");
  if (scoreBadge) scoreBadge.textContent = appState.quiz.score;

  // Show explanation
  const expBox = document.getElementById("q-explanation-box");
  const expDesc = document.getElementById("exp-desc-text");
  if (expBox && expDesc) {
    expDesc.textContent = qData.explanation;
    expBox.style.display = "block";
    expBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function handleTimeoutAnswer() {
  appState.quiz.isAnswered = true;
  const qData = QUIZ_QUESTIONS[appState.quiz.currentIndex];
  const allBtns = document.querySelectorAll(".option-btn");
  allBtns.forEach((b, i) => {
    b.disabled = true;
    if (qData.options[i].isCorrect) {
      b.classList.add("correct");
    }
  });

  const expBox = document.getElementById("q-explanation-box");
  const expDesc = document.getElementById("exp-desc-text");
  if (expBox && expDesc) {
    expDesc.textContent = "Waktu habis! " + qData.explanation;
    expBox.style.display = "block";
  }
}

function nextQuestion() {
  appState.quiz.currentIndex++;
  if (appState.quiz.currentIndex < QUIZ_QUESTIONS.length) {
    renderQuizQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  clearInterval(appState.quiz.timer);
  showQuizScreen("quiz-result-screen");

  const finalScoreElem = document.getElementById("result-final-score");
  const feedbackElem = document.getElementById("result-feedback-text");
  const emojiElem = document.getElementById("result-emoji");

  const score = appState.quiz.score;
  if (finalScoreElem) finalScoreElem.textContent = `${score} / 100`;

  if (score >= 80) {
    if (emojiElem) emojiElem.textContent = "🏆";
    if (feedbackElem) feedbackElem.textContent = `Luar Biasa, ${appState.detectiveAvatar} ${appState.detectiveName}! Kamu dan ${appState.currentTeam} membuktikan nalar kritis seorang Detektif Lingkungan sejati!`;
  } else if (score >= 60) {
    if (emojiElem) emojiElem.textContent = "⭐";
    if (feedbackElem) feedbackElem.textContent = `Bagus sekali, ${appState.detectiveAvatar} ${appState.detectiveName}! Kamu sudah memahami konsep dasar ekosistem sungai dan memverifikasi informasi dengan baik.`;
  } else {
    if (emojiElem) emojiElem.textContent = "🌱";
    if (feedbackElem) feedbackElem.textContent = `Semangat terus, ${appState.detectiveAvatar} ${appState.detectiveName}! Ulangi membaca berkas kasus dan tanyakan hal yang meragukan kepada Detektif Tirta.`;
  }
}

// Simple Web Audio API beeps
function playTone(isSuccess) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isSuccess) {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
    } else {
      osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
      osc.frequency.setValueAtTime(196, ctx.currentTime + 0.12); // G3
    }
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Audio context may be blocked by autoplay policies
  }
}

// ================= UTILITIES =================
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function formatMarkdownText(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}
