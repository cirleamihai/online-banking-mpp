const API_DELETE_URL = 'http://localhost:8000/api/v1/credit-cards';

export function handleDelete(cardId, fetchAllCards, path="/") {
    // Delete card from localCards only if popup is confirmed
    if (!confirmDelete()) {
        return;
    }

    fetch(`${API_DELETE_URL}/${cardId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        if (response.ok) {
            console.log('Card deleted successfully');
            fetchAllCards();
        } else {
            console.error('Failed to delete card');
        }
    }).catch(error => {
        console.error('Failed to delete card', error);
    });
}

function confirmDelete() {
    return window.confirm("Are you sure you want to delete this card?");
}