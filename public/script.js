const modal1 = document.getElementById('modal-parent');
const modal2 = document.getElementById('edit-modal-parent');
const createBtn = document.getElementById('create-btn');
const closeBtn = document.getElementById('close-btn');
const confirmBtn = document.getElementById('confirm-btn');
const editCloseBtn = document.getElementById('edit-close-btn');
const editConfirmBtn = document.getElementById('edit-confirm-btn');

let currentCardId = null;

window.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    displayFlashcards();
});

createBtn.addEventListener('click', () => modal1.classList.add('show'));
closeBtn.addEventListener('click', () => modal1.classList.remove('show'));
editCloseBtn.addEventListener('click', () => modal2.classList.remove('show'));

function fetchCategories() {
    fetch('/categories')
        .then(response => response.json())
        .then(categories => {
            const container = document.getElementById('categories-container');
            container.innerHTML = '';
            
            // Add "All" category option
            const allCategory = document.createElement('h4');
            allCategory.textContent = 'All';
            allCategory.style.cursor = 'pointer';
            allCategory.addEventListener('click', () => displayFlashcards());
            container.appendChild(allCategory);

            categories.forEach(category => {
                const h4 = document.createElement('h4');
                h4.textContent = category;
                h4.style.cursor = 'pointer';
                h4.addEventListener('click', () => {
                    displayFlashcards(category); // Pass the category to filter
                });
                container.appendChild(h4);
            });

            // Update category selects (keep your existing code)
            const selects = [document.getElementById('category'), document.getElementById('edit-category')];
            selects.forEach(select => {
                select.innerHTML = '<option value=""></option>';
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    select.appendChild(option);
                });
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function displayFlashcards(category = null) {
    let url = '/flashcards';
    if (category) {
        url = `/flashcards?category=${encodeURIComponent(category)}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(cards => {
            const container = document.querySelector('.cards-container');
            container.innerHTML = '';
            
            if (cards.length === 0) {
                container.innerHTML = '<p>No flashcards found</p>';
                return;
            }

            cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.setAttribute('data-id', card.id);
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
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                    </div>
                `;
                container.appendChild(cardElement);
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const cardElement = e.target.closest('.card');
                    currentCardId = cardElement.getAttribute('data-id');
                    document.getElementById('edit-title').value = cardElement.querySelector('h4').textContent;
                    document.getElementById('edit-note').value = cardElement.querySelector('p').textContent;
                    document.getElementById('edit-category').value = cardElement.querySelector('h5').textContent;
                    modal2.classList.add('show');
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const cardId = e.target.closest('.card').getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this flashcard?')) {
                        await fetch(`/flashcards/${cardId}`, { method: 'DELETE' });
                        displayFlashcards(category);
                    }
                });
            });
        });
}

confirmBtn.addEventListener('click', async () => {
    const question = document.getElementById('title').value;
    const answer = document.getElementById('note').value;
    const category = document.getElementById('category').value;
    
    try {
        const response = await fetch('/flashcards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question, answer, category })
        });
        
        if (!response.ok) throw new Error('Failed to create flashcard');
        
        modal1.classList.remove('show');
        displayFlashcards();
    } catch (error) {
        console.error('Error:', error);
    }
});

editConfirmBtn.addEventListener('click', async () => {
    const question = document.getElementById('edit-title').value;
    const answer = document.getElementById('edit-note').value;
    const category = document.getElementById('edit-category').value;
    
    try {
        const response = await fetch(`/flashcards/${currentCardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question, answer, category })
        });
        
        if (!response.ok) throw new Error('Failed to update flashcard');
        
        modal2.classList.remove('show');
        displayFlashcards();
    } catch (error) {
        console.error('Error:', error);
    }
});