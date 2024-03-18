import {localCards} from '../LocalData/localCards.tsx';

export function handleDelete(cardId, navigator, path="/") {
    // Delete card from localCards only if popup is confirmed
    if (!confirmDelete()) {
        return;
    }

    let list_index = localCards.findIndex(card => card.objectId === cardId);
    localCards.splice(list_index, 1);

    navigator(path);
}

function confirmDelete() {
    return window.confirm("Are you sure you want to delete this card?");
}