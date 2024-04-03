import './cardTemplate.css';
import CreditCard from "../Model/card.js";
// @ts-ignore
import visaLogo from '../Files/Media/visa_logo.png';
// @ts-ignore
import masterCardLogo from '../Files/Media/mastercard_logo.png';

export const viewCard = (card: CreditCard) => {
    return (<div className="d-flex justify-content-center container text-white mt-5">
        <div className="myCreditCard p-2 px-3 py-3">
            <div className="d-flex justify-content-between align-items-center"><img
                src="https://i.imgur.com/8ANWXql.png" alt="Check" width="20" height="20"/><img alt="Provider" src={
                card.type === "Visa" ? visaLogo : masterCardLogo} width="40"/></div>
            <div className="mt-3"><span className="mr-3">{card.number.slice(0, 4)}</span><span
                className="mr-3">{card.number.slice(5, 9)}</span><span
                className="mr-3">{card.number.slice(10, 14)}</span><span
                className="mr-2">{card.number.slice(15, 19)}</span></div>
            <div className="d-flex justify-content-between card-details mt-3 mb-3">
                <div className="d-flex flex-column"><span
                    className="light">Card Holder</span><span>{card.placeHolder}</span>
                </div>
                <div className="d-flex flex-row">
                    <div className="d-flex flex-column mr-3"><span className="light">Expired</span><span>{
                        card.stringifyExpirationDate()
                    }</span>
                    </div>
                    <div className="d-flex flex-column"><span
                        className="light">CVV</span><span>{card.cvv.toString()}</span></div>
                </div>
            </div>
        </div>
    </div>);
}

export const NewCardForm = (card: CreditCard, handleSubmit, ...setters) => {
    const [setCardNumber, setCardHolder, setExpiry, setCvv, setCardType] = setters


    return (
        <form className="card-form">
            <div className="myCreditCard myCreditCard-add">
                <div className="card-top">
                    <img src="https://i.imgur.com/8ANWXql.png" alt="Card Icon" className="card-icon"/>
                    {card ?
                        <img src={card.type === "Visa" ? visaLogo : masterCardLogo} alt="Card Logo"
                             className="card-logo"/> :
                        <div className="card-type">
                            <input id="cardType" type="text"
                                   onChange={e => setCardType(e.target.value ? e.target.value : e.target.placeholder)}
                                   placeholder={card ? card.type : "Visa"}/>
                        </div>
                    }
                </div>
                <input type="text" className="card-number-input" id="cardNumber"
                       onChange={e => setCardNumber(e.target.value ? e.target.value : e.target.placeholder)}
                       placeholder={card ? card.number : "1111 2222 3333 4444"}/>
                <div className="card-bottom">
                    <div className="">
                        <div className="card-holder">
                            <label htmlFor="cardHolder" className="light">Card Holder</label>
                            <input id="cardHolder" type="text"
                                   onChange={e => setCardHolder(e.target.value ? e.target.value : e.target.placeholder)}
                                   placeholder={card ? card.placeHolder : "Sam Dingo"}/>
                        </div>
                        <div className="card-expiry">
                            <label htmlFor="expiry" className="light">Expires</label>
                            <input id="expiry" type="text"
                                   onChange={e => setExpiry(e.target.value ? e.target.value : e.target.placeholder)}
                                   placeholder={card ? card.stringifyExpirationDate() : "12/24"}/>
                        </div>
                    </div>
                    <div className="card-cvv">
                        <label htmlFor="cvv" className="light">CVV</label>
                        <input id="cvv" type="text"
                               onChange={e => setCvv(e.target.value ? e.target.value : e.target.placeholder)}
                               placeholder={card ? card.cvv : "857"}/>
                    </div>
                </div>
                <button type="submit" className="submit-btn" onClick={(e) => {
                    handleSubmit(e)
                }}>Submit
                </button>
            </div>
        </form>
    );
}