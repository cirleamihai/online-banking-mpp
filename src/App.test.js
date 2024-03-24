import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import App from './App';
import AddCard from "./Components/AddCard";
import EditCard from "./Components/EditPage";
import ViewCard from "./Components/ViewCard";
import {localCards} from "./LocalData/localCards";
import CreditCard from "./Model/card";
import {NewCardForm} from "./Designs/cardTemplate";
import userEvent from "@testing-library/user-event";

const new_test_card = {
    "id": "811617f1-1f14-4950-ba1e-96561f62106c",
    "title": "TestCard",
    "type": "Visa",
    "placeHolder": "Alex Testing",
    "number": "1111 1111 1111 1111",
    "expiryMo": 11,
    "expiryYr": 11,
    "cvv": "111"
}
localCards.push(new CreditCard(new_test_card));

describe('WholeAPPTests', () => {
    test('Checking the NewCardForm template', async () => {
        const handleSubmit = jest.fn();
        const setCardNumber = jest.fn();
        const setCardHolder = jest.fn();
        const setExpiry = jest.fn();
        const setCvv = jest.fn();
        const setCardType = jest.fn();

        render(NewCardForm(null, handleSubmit, setCardNumber, setCardHolder, setExpiry, setCvv, setCardType));

        await userEvent.type(screen.getByPlaceholderText('1111 2222 3333 4444'), '1234 5678 9012 3456');
        await userEvent.type(screen.getByPlaceholderText('Sam Dingo'), 'John Doe');
        await userEvent.type(screen.getByPlaceholderText('12/24'), '11/26');
        await userEvent.type(screen.getByPlaceholderText('857'), '123');
        await userEvent.type(screen.getByPlaceholderText('Visa'), 'MasterCard');

        fireEvent.click(screen.getByText('Submit'));

        expect(setCardNumber).toHaveBeenCalledWith('1234 5678 9012 3456');
        expect(setCardHolder).toHaveBeenCalledWith('John Doe');
        expect(setExpiry).toHaveBeenCalledWith('11/26');
        expect(setCvv).toHaveBeenCalledWith('123');
        expect(setCardType).toHaveBeenCalledWith('MasterCard');
        expect(handleSubmit).toHaveBeenCalled();
    });

    test('HomePage Test', () => {
        render(<App/>);
        const linkElement = screen.getByText(/Add Card/i);
        const checkCardExistence = screen.getByText(/Alex Testing/i);
        const checkCardExistence2 = screen.getByText(/1111/i);
        const checkCardExistence5 = screen.getByText(/8116/i);
        const checkHeader = screen.getByText(/CardHolder/i);
        const checkHeader2 = screen.getByText(/LastDigits/i);
        const checkHeader3 = screen.getByText(/CardType/i);
        const checkHeader4 = screen.getAllByText(/Edit/i);
        const checkHeader5 = screen.getAllByText(/Delete/i);

        expect(linkElement).toBeInTheDocument();
        expect(checkCardExistence).toBeInTheDocument();
        expect(checkCardExistence2).toBeInTheDocument();
        expect(checkCardExistence5).toBeInTheDocument();
        expect(checkHeader).toBeInTheDocument();
        expect(checkHeader2).toBeInTheDocument();
        expect(checkHeader3).toBeInTheDocument();
        expect(checkHeader4).toHaveLength(6);
        expect(checkHeader5).toHaveLength(6);
    });

    test("cardNotFound Test", () => {
        render(
            <MemoryRouter initialEntries={["/view/card/1234"]}>
                <Routes>
                <Route path="/view/card/:id" element={<ViewCard/>}>
                </Route>
                </Routes>
            </MemoryRouter>
        );
        const checkCardExistence = screen.getByText(/Card Not Found/i);
        expect(checkCardExistence).toBeInTheDocument();
    });

    test("cardFound test", () => {
        render(
            <MemoryRouter initialEntries={["/view/card/811617f1-1f14-4950-ba1e-96561f62106c"]}>
                <Routes>
                    <Route path="/view/card/:cardId" element={<ViewCard />} />
                </Routes>
            </MemoryRouter>
        );

        // write me a test for all the elements in the card. do autocompletion for everything
        const checkCardExistence = screen.getByText(/Alex Testing/i);
        const checkCardExistence2 = screen.getAllByText(/1111/i);
        const checkCardExistence3 = screen.getByText(/11\/11/i);

        expect(checkCardExistence).toBeInTheDocument();
        expect(checkCardExistence2).toHaveLength(4);
        expect(checkCardExistence3).toBeInTheDocument();


    });


    test('AddCard test', () => {
        render(
            <MemoryRouter>
                <AddCard/>
            </MemoryRouter>
        );
        const submitBtnElementTest = screen.getByText(/Submit/i);
        const cardHolderTest = screen.getByPlaceholderText(/Sam Dingo/i);
        const cardNumberTest = screen.getByPlaceholderText(/1111 2222 3333 4444/i);

        expect(submitBtnElementTest).toBeInTheDocument();
        expect(cardHolderTest).toBeInTheDocument();
        expect(cardNumberTest).toBeInTheDocument();
    });
});
