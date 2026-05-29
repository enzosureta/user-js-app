const userGrid = document.getElementById('userGrid');
const savedGrid = document.getElementById('savedGrid');
const searchInput = document.getElementById('searchInput');

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');
const modalOverlay = document.getElementById('modalOverlay');

let users = [];
let savedUsers = JSON.parse(localStorage.getItem('savedUsers')) || [];

async function fetchUsers() {
  try {
    const response = await fetch('https://randomuser.me/api/?results=12');
    const data = await response.json();

    users = data.results;

    renderUsers(users);
    renderSavedUsers();

  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}

function createUserCard(user, isSaved = false) {

  const card = document.createElement('article');
  card.classList.add('card');

  card.innerHTML = `
    <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}">

    <h3>${user.name.first} ${user.name.last}</h3>

    <p>${user.email}</p>

    <button class="details-btn">
      View Details
    </button>

    <button class="save-btn">
      ${isSaved ? 'Remove' : 'Save'}
    </button>
  `;

  const detailsBtn = card.querySelector('.details-btn');
  const saveBtn = card.querySelector('.save-btn');

  detailsBtn.addEventListener('click', () => {
    openModal(user);
  });

  saveBtn.addEventListener('click', () => {
    toggleSaveUser(user);
  });

  return card;
}

function renderUsers(userList) {

  userGrid.innerHTML = '';

  userList.forEach(user => {

    const isSaved = savedUsers.some(saved => saved.email === user.email);

    const card = createUserCard(user, isSaved);

    userGrid.appendChild(card);
  });
}

function renderSavedUsers() {

  savedGrid.innerHTML = '';

  savedUsers.forEach(user => {

    const card = createUserCard(user, true);

    savedGrid.appendChild(card);
  });
}

function toggleSaveUser(user) {

  const exists = savedUsers.some(saved => saved.email === user.email);

  if (exists) {

    savedUsers = savedUsers.filter(saved => saved.email !== user.email);

  } else {

    savedUsers.push(user);
  }

  localStorage.setItem('savedUsers', JSON.stringify(savedUsers));

  renderUsers(users);
  renderSavedUsers();
}


function openModal(user) {

  modal.classList.remove('hidden');

  modalBody.innerHTML = `
    <h2 id="modalTitle">
      ${user.name.first} ${user.name.last}
    </h2>

    <br>

    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Phone:</strong> ${user.phone}</p>
    <p><strong>Location:</strong> ${user.location.country}</p>
  `;
}

function closeModal() {
  modal.classList.add('hidden');
}

closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

searchInput.addEventListener('input', (event) => {

  const value = event.target.value.toLowerCase();

  const filteredUsers = users.filter(user => {

    const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();

    return fullName.includes(value);
  });

  renderUsers(filteredUsers);
});



const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {

  tab.addEventListener('click', () => {

    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    tab.classList.add('active');

    const target = document.getElementById(tab.dataset.tab);

    target.classList.add('active');
  });
});


const accordions = document.querySelectorAll('.accordion');

accordions.forEach(accordion => {

  const header = accordion.querySelector('.accordion-header');

  header.addEventListener('click', () => {
    accordion.classList.toggle('active');
  });
});

fetchUsers();