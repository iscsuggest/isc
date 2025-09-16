const firebaseConfig = {
  apiKey: "AIzaSyCGkF5OkclTr8Xjxe5XW3rjrP3vh4Dr2Ws",
  authDomain: "ibn-e-sina-school.firebaseapp.com",
  projectId: "ibn-e-sina-school",
  storageBucket: "ibn-e-sina-school.appspot.com",
  messagingSenderId: "897865466373",
  appId: "1:897865466373:web:107271a0b6b9e7fd36126c"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById('login-btn');
const emailLoginBtn = document.getElementById('email-login-btn');
const voteBtn = document.getElementById('vote-btn');
const voteCount = document.getElementById('vote-count');
const modalBg = document.getElementById('modal-bg');
const modalTitle = document.getElementById('modal-title');
const toast = document.getElementById('toast');
let currentType = '';
let user = null;

loginBtn.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => showToast(err.message, 'error'));
});

emailLoginBtn.addEventListener('click', () => {
  const email = prompt("Enter your email");
  const password = prompt("Enter your password");
  if (email && password) {
    auth.signInWithEmailAndPassword(email, password).catch(err => showToast(err.message, 'error'));
  }
});

auth.onAuthStateChanged(u => {
  user = u;
  if (user) {
    loginBtn.textContent = "Signed in";
    loginBtn.disabled = true;
    emailLoginBtn.style.display = "none";
  }
});

voteBtn.addEventListener('click', () => {
  if (!user) {
    showToast("Please sign in first!", 'warning');
    return;
  }
  showLoading();
  const voteRef = db.collection('votes').doc('headboy');
  db.runTransaction(async transaction => {
    const doc = await transaction.get(voteRef);
    if (!doc.exists) {
      transaction.set(voteRef, { count: 1, upvoters: [user.uid] });
    } else {
      const data = doc.data();
      if (data.upvoters.includes(user.uid)) {
        showToast("You have already voted!", 'warning');
        hideLoading();
        throw "already voted";
      }
      transaction.update(voteRef, {
        count: firebase.firestore.FieldValue.increment(1),
        upvoters: firebase.firestore.FieldValue.arrayUnion(user.uid)
      });
    }
  }).then(() => {
    showToast("Vote submitted!", 'success');
    confetti();
  }).catch(err => {
    if (err !== "already voted") showToast("Error submitting vote", 'error');
  }).finally(() => hideLoading());
});

db.collection('votes').doc('headboy').onSnapshot(doc => {
  if (doc.exists) {
    voteCount.textContent = doc.data().count;
  }
});

function openModal(type) {
  if (!user) {
    showToast("Please sign in first!", 'warning');
    return;
  }
  currentType = type;
  modalTitle.innerHTML = type === 'suggestion'
    ? '<i class="fas fa-lightbulb"></i> Submit Suggestion'
    : '<i class="fas fa-exclamation-circle"></i> Submit Complaint';
  modalBg.classList.add('show');
  setTimeout(() => document.getElementById('name').focus(), 100);
}

function closeModal() {
  modalBg.classList.remove('show');
  document.getElementById('suggestionForm').reset();
}

document.getElementById('suggestionForm').addEventListener('submit', e => {
  e.preventDefault();
  if (!user) {
    showToast("Please sign in first!", 'warning');
    return;
  }
  showLoading();
  db.collection(currentType + 's').add({
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    userId: user.uid
  }).then(() => {
    showToast(currentType + " submitted!", 'success');
    closeModal();
  }).catch(() => {
    showToast("Error submitting " + currentType, 'error');
  }).finally(() => hideLoading());
});

const form = document.getElementById('suggestionForm');
const inputs = form.querySelectorAll('#name, #email, #subject, #message');

inputs.forEach((input, index) => {
  input.addEventListener('keydown', e => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      } else {
        form.requestSubmit();
      }
    }
  });
});

function showLoading() {
  document.getElementById('loading-overlay').classList.add('show');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.remove('show');
}

function showToast(message, type) {
  toast.textContent = message;
  toast.className = "toast " + type + " show";
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}
