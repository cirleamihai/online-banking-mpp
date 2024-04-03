
export const sortCards = (localCards) => {
    localCards.sort((a, b) => {
        const nameA = a.placeHolder.toUpperCase(); // ignore upper and lowercase
        const nameB = b.placeHolder.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
            return -1; // a comes first, we sort descending
        }
        if (nameA < nameB) {
            return 1; // b comes first, we sort descending
        }

        // names must be equal
        return 0;
    });
};