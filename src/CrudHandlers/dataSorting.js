import {localCards} from "../LocalData/localCards.tsx";

export const sortCards = () => {
    localCards.sort((a, b) => {
        const nameA = a.cardPlaceHolder.toUpperCase(); // ignore upper and lowercase
        const nameB = b.cardPlaceHolder.toUpperCase(); // ignore upper and lowercase
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