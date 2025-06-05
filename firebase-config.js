import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCh8En67vwKeiQz_WHyksMM07iGp8wv08k",
    authDomain: "translators-84776.firebaseapp.com",
    projectId: "translators-84776",
    storageBucket: "translators-84776.appspot.com",
    messagingSenderId: "669285136395",
    appId: "1:669285136395:web:bd67b6ada5d9ee0bb9ef0e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    if (messageDiv) {
        messageDiv.style.display = "block";
        messageDiv.textContent = message;
        messageDiv.style.opacity = 1;
        setTimeout(() => {
            messageDiv.style.opacity = 0;
        }, 5000);
    }
}

const modal = document.getElementById("jobModal");
const btn = document.getElementById("addNewJob");
const span = document.getElementsByClassName("close")[0];
const cancelBtn = document.querySelector(".cancel-button");

// oткрываем модальное окно
btn.onclick = function() {
    modal.style.display = "block";
}

// закрываем модальное окно
span.onclick = function() {
    modal.style.display = "none";
}

cancelBtn.onclick = function() {
    modal.style.display = "none";
}

// закрываем при клике вне окна
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// обработка формы
document.getElementById("jobForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    alert("Вакансия успешно опубликована!");
    modal.style.display = "none";
    this.reset();
});

const translatorModal = document.getElementById("translatorModal");
const addTranslatorBtn = document.getElementById("addNewJob");
const closeTranslatorModal = translatorModal.querySelector(".close");
const cancelTranslatorBtn = translatorModal.querySelector(".cancel-button");

// Открываем модальное окно
addTranslatorBtn.onclick = function() {
    translatorModal.style.display = "block";
}

// Закрываем модальное окно
closeTranslatorModal.onclick = function() {
    translatorModal.style.display = "none";
}

cancelTranslatorBtn.onclick = function() {
    translatorModal.style.display = "none";
}

// Закрываем при клике вне окна
window.onclick = function(event) {
    if (event.target == translatorModal) {
        translatorModal.style.display = "none";
    }
}

// Превью фотографии
const photoInput = document.getElementById("translatorPhoto");
const photoPreview = document.getElementById("photoPreview");

photoInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            photoPreview.style.backgroundImage = `url(${e.target.result})`;
            photoPreview.classList.add("has-image");
        }
        
        reader.readAsDataURL(file);
    }
});

// Управление тегами специализаций
const specializationsInput = document.getElementById("specializationsInput");
const specializationsList = document.getElementById("specializationsList");
const hiddenSpecializations = document.createElement("input");
hiddenSpecializations.type = "hidden";
hiddenSpecializations.name = "specializations";
document.getElementById("translatorForm").appendChild(hiddenSpecializations);

specializationsInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && this.value.trim() !== "") {
        e.preventDefault();
        
        const tag = document.createElement("div");
        tag.className = "tag";
        tag.innerHTML = `
            ${this.value.trim()}
            <span class="tag-remove">&times;</span>
        `;
        
        specializationsList.appendChild(tag);
        
        // Обновляем скрытое поле с выбранными специализациями
        const tags = Array.from(specializationsList.querySelectorAll(".tag"))
            .map(tag => tag.textContent.replace("×", "").trim());
        hiddenSpecializations.value = tags.join(",");
        
        this.value = "";
    }
});

specializationsList.addEventListener("click", function(e) {
    if (e.target.classList.contains("tag-remove")) {
        e.target.parentElement.remove();
        
        // Обновляем скрытое поле после удаления
        const tags = Array.from(specializationsList.querySelectorAll(".tag"))
            .map(tag => tag.textContent.replace("×", "").trim());
        hiddenSpecializations.value = tags.join(",");
    }
});

// Обработка формы
document.getElementById("translatorForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Здесь код для отправки данных формы
    // Например, через Firebase или AJAX
    
    alert("Ваш профиль переводчика успешно создан!");
    translatorModal.style.display = "none";
    this.reset();
    photoPreview.style.backgroundImage = "";
    photoPreview.classList.remove("has-image");
    specializationsList.innerHTML = "";
    hiddenSpecializations.value = "";
});

function checkAuthState() {
    auth.onAuthStateChanged(user => {
        const authButton = document.getElementById('authButton');
        const authButtonContainer = document.getElementById('authButtonContainer');
        
        if (user) {
            // пользователь вошел в систему
            if (authButton) {
                authButton.textContent = 'Выход';
                authButton.href = '#';
                authButton.id = 'logoutButton'; // меняем ID для обработки выхода
                
                // обработчик для кнопки выхода
                authButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    auth.signOut().then(() => {
                        localStorage.removeItem('loggedInUserId');
                        window.location.href = 'index.html';
                    }).catch(error => {
                        console.error('Ошибка при выходе:', error);
                    });
                });
            }
        } else {
            // пользователь не вошел в систему
            if (authButton) {
                authButton.textContent = 'Вход';
                authButton.href = 'signIn.html';
                authButton.id = 'authButton';
            }
        }
    });
}

// вызываем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    
});

signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('Вход выполнен успешно', 'signInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'index.html';
    })
    
document.addEventListener('DOMContentLoaded', () => {
    // регистрация
    const signUp = document.getElementById('sumbitSignUp');
    if (signUp) {
        signUp.addEventListener('click', (event) => {
            event.preventDefault();
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const userData = {
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        createdAt: new Date()
                    };
                    showMessage('Аккаунт успешно создан', 'signUpMessage');
                    return setDoc(doc(db, "users", user.uid), userData);
                })
                .then(() => {
                    window.location.href = 'signIn.html';
                })
                .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode === 'auth/email-already-in-use') {
                        showMessage('Адрес почты уже существует', 'signUpMessage');
                    } else {
                        showMessage('Ошибка при создании пользователя: ' + error.message, 'signUpMessage');
                    }
                });
        });
    }

    // вход
    const signIn = document.getElementById('submitSignIn');
    if (signIn) {
        signIn.addEventListener('click', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    showMessage('Вход выполнен успешно', 'signInMessage');
                    const user = userCredential.user;
                    localStorage.setItem('loggedInUserId', user.uid);
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password') {
                        showMessage('Неверный email или пароль', 'signInMessage');
                    } else if (errorCode === 'auth/user-not-found') {
                        showMessage('Аккаунт не существует', 'signInMessage');
                    } else {
                        showMessage('Ошибка входа: ' + error.message, 'signInMessage');
                    }
                });
        });
    }
});
