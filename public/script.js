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

function fetchCategories() {
    fetch('/categories')
        .then(response => response.json())
        .then(categories => {
            const container = document.getElementById('categories-container');
            container.innerHTML = '';
            categories.forEach(category => {
                const h4 = document.createElement('h4');
                h4.textContent = category;
                h4.style.cursor = 'pointer';
                h4.addEventListener('click', () => {
                    console.log('Category clicked:', category);
                });
                container.appendChild(h4);
            });

            const selectCategory = document.getElementById('category');
            selectCategory.innerHTML = '<option value=""></option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                selectCategory.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
}

// Function to display flashcards as cards
function displayFlashcards() {
    fetch('/flashcards')
        .then(response => response.json())
        .then(cards => {
            const container = document.querySelector('.cards-container');
            container.innerHTML = ''; // Clear existing cards
            
            cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.innerHTML = `
                    <div class="title">
                        <h4>${card.question}</h4>
                        <h5>${card.category}</h5>
                    </div>
                    <div class="description">
                        <p>${card.answer}</p>
                    </div>
                    <div class="bottom">
                        <div class="date">
                            <h6>${new Date(card.date_added).toLocaleDateString()}</h6>
                        </div>
                        <div class="button-group">
                            <button id="edit-btn">Edit</button>
                            <button id="delete-btn">Delete</button>
                        </div>
                    </div>
                `;
                container.appendChild(cardElement);
            });
        });
}

window.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    displayFlashcards();
});

