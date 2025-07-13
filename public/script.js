const modal = document.getElementById('modal-parent');
const createBtn = document.getElementById('create-btn');
const closeBtn = document.getElementById('close-btn');
const confirmBtn = document.getElementById('confirm-btn');

createBtn.addEventListener('click', () => {
    modal.classList.add('show');
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});

// confirmBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     modal.classList.remove('show');
// });

