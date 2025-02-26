/**
 * DijiHanem 2025 - Profilim JavaScript Dosyası
 * Bu dosya, Profilim sayfasındaki kullanıcı yönetimi fonksiyonlarını içerir
 */

// DOM elementlerini seçelim
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const profileInfo = document.getElementById('profile-info');
const profileUsername = document.getElementById('profile-username');
const profileEmail = document.getElementById('profile-email');
const profileTreeCount = document.getElementById('profile-tree-count');
const profileTotalTime = document.getElementById('profile-total-time');
const profileStudyDays = document.getElementById('profile-study-days');
const profileNoteCount = document.getElementById('profile-note-count');
const profileForest = document.getElementById('profile-forest');
const logoutBtn = document.getElementById('logout-btn');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

// Kullanıcı verileri
let currentUser = null;
let users = [];

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // AOS Animasyon kütüphanesini başlat
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });
    
    // Kullanıcı verilerini yükle
    loadUsers();
    
    // Mevcut kullanıcıyı kontrol et
    checkCurrentUser();
    
    // Sayfa geçiş efektini kaldır
    setTimeout(() => {
        document.body.classList.remove('page-transitioning');
    }, 300);
    
    // Kart parıltı efektlerini ekle
    addCardGlowEffects();
});

/**
 * LocalStorage'dan kullanıcı verilerini yükle
 */
function loadUsers() {
    const savedUsers = localStorage.getItem('users');
    
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
}

/**
 * Kullanıcı verilerini LocalStorage'a kaydet
 */
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * Mevcut kullanıcıyı kontrol et
 */
function checkCurrentUser() {
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showProfileInfo();
    }
}

/**
 * Kullanıcı kaydı oluştur
 * @param {Object} userData - Kullanıcı verileri
 */
function registerUser(userData) {
    // Kullanıcı adının benzersiz olup olmadığını kontrol et
    const userExists = users.some(user => user.username === userData.username);
    
    if (userExists) {
        showNotification('Bu kullanıcı adı zaten kullanılıyor.', 'error');
        return false;
    }
    
    // Yeni kullanıcı oluştur
    const newUser = {
        id: generateId(),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        treeCount: 0,
        totalTime: 0,
        studyDays: 0,
        noteCount: 0,
        registrationDate: new Date().toISOString()
    };
    
    // Kullanıcıyı ekle
    users.push(newUser);
    saveUsers();
    
    return true;
}

/**
 * Kullanıcı girişi yap
 * @param {string} username - Kullanıcı adı
 * @param {string} password - Parola
 */
function loginUser(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        currentUser = user;
        
        // Mevcut ağaç ve süre verilerini kullanıcıya aktar
        const treeCount = localStorage.getItem('treeCount');
        const totalTime = localStorage.getItem('totalTime');
        
        if (treeCount && !user.treeCount) {
            user.treeCount = parseInt(treeCount);
        }
        
        if (totalTime && !user.totalTime) {
            user.totalTime = parseInt(totalTime);
        }
        
        // Kullanıcı verilerini güncelle
        updateUserData();
        
        // Kullanıcıyı LocalStorage'a kaydet
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        return true;
    }
    
    return false;
}

/**
 * Kullanıcı çıkışı yap
 */
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    hideProfileInfo();
}

/**
 * Kullanıcı verilerini güncelle
 */
function updateUserData() {
    // Not sayısını güncelle
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    currentUser.noteCount = notes.length;
    
    // Kullanıcı verilerini kaydet
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        saveUsers();
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

/**
 * Profil bilgilerini göster
 */
function showProfileInfo() {
    // Giriş ve kayıt formlarını gizle
    loginForm.closest('.col-md-6').classList.add('d-none');
    registerForm.closest('.col-md-6').classList.add('d-none');
    
    // Profil bilgilerini göster
    profileInfo.classList.remove('d-none');
    
    // Profil bilgilerini doldur
    profileUsername.textContent = currentUser.username;
    profileEmail.textContent = currentUser.email;
    profileTreeCount.textContent = currentUser.treeCount;
    profileTotalTime.textContent = `${currentUser.totalTime} dakika`;
    profileStudyDays.textContent = `${currentUser.studyDays} gün`;
    profileNoteCount.textContent = `${currentUser.noteCount} not`;
    
    // Ormanı oluştur
    renderForest();
}

/**
 * Profil bilgilerini gizle
 */
function hideProfileInfo() {
    // Giriş ve kayıt formlarını göster
    loginForm.closest('.col-md-6').classList.remove('d-none');
    registerForm.closest('.col-md-6').classList.remove('d-none');
    
    // Profil bilgilerini gizle
    profileInfo.classList.add('d-none');
}

/**
 * Ormanı oluştur
 */
function renderForest() {
    profileForest.innerHTML = '';
    
    const treeTypes = ['tree-normal', 'tree-autumn', 'tree-spring', 'tree-winter'];
    
    for (let i = 0; i < currentUser.treeCount; i++) {
        const treeType = treeTypes[Math.floor(Math.random() * treeTypes.length)];
        
        const tree = document.createElement('div');
        tree.className = `tree ${treeType} grow`;
        
        profileForest.appendChild(tree);
    }
}

/**
 * Benzersiz ID oluştur
 * @returns {string} Benzersiz ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Bildirim göster
 * @param {string} message - Bildirim mesajı
 * @param {string} type - Bildirim türü (success, warning, error)
 */
function showNotification(message, type = 'success') {
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    // 3 saniye sonra bildirimi gizle
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Kart parıltı efektlerini ekle
 */
function addCardGlowEffects() {
    const cards = document.querySelectorAll('.neo-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const glow = card.querySelector('.card-glow');
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            glow.style.top = `${y}px`;
            glow.style.left = `${x}px`;
            glow.style.opacity = '0.2';
        });
        
        card.addEventListener('mouseleave', () => {
            const glow = card.querySelector('.card-glow');
            glow.style.opacity = '0.1';
        });
    });
}

/**
 * Sayfa geçişi
 * @param {string} url - Hedef sayfa URL'si
 */
function navigateTo(url) {
    document.body.classList.add('page-transitioning');
    
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Giriş formu gönderme olayı
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (loginUser(username, password)) {
        showNotification('Başarıyla giriş yapıldı!');
        showProfileInfo();
    } else {
        showNotification('Kullanıcı adı veya parola hatalı.', 'error');
    }
});

// Kayıt formu gönderme olayı
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userData = {
        username: document.getElementById('register-username').value,
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value
    };
    
    if (registerUser(userData)) {
        showNotification('Hesabınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.');
        registerForm.reset();
    }
});

// Çıkış butonu olayı
logoutBtn.addEventListener('click', () => {
    logoutUser();
    showNotification('Başarıyla çıkış yapıldı.');
});

// Sayfa bağlantıları için olay dinleyicileri
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (!link.classList.contains('active')) {
            e.preventDefault();
            navigateTo(link.getAttribute('href'));
        }
    });
});