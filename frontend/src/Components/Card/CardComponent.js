import {useState} from "react";
import Cards from "react-credit-cards-2";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import CreditCard from "../../Model/card";

const validateCVV = (cvv) => {
    // Remove non-digit characters
    const sanitizedCVV = cvv.replace(/\D/g, '');

    // Check if the CVV length is either 3 or 4 digits
    return /^\d{3,4}$/.test(sanitizedCVV);
};

const validateExpiry = (expiry) => {
    // Check if the expiry date is in the format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return false;
    }

    const [month, year] = expiry.split('/').map(Number);

    // Check if the month is between 1 and 12
    if (month < 1 || month > 12) {
        return false;
    }

    // Get the current month and year
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-11
    const currentYear = now.getFullYear() % 100; // Get last two digits of the year

    // Check if the expiry date is in the future
    return !(year < currentYear || (year === currentYear && month < currentMonth));

};

const validateCardNumber = (number) => {
    return number.length === 19;
}

export const CardComponent = ({onSaveClick, myCard, editable = true}) => {
    let creditCard = myCard || new CreditCard();
    const [number, setNumber] = useState(creditCard.number);
    const [name, setName] = useState(creditCard.placeHolder);
    const [focused, setFocused] = useState("");
    const [expiry, setExpiry] = useState(creditCard.expiryDate());
    const [expiryDisplay, setExpiryDisplay] = useState(creditCard.stringifyExpirationDate());
    const [cvc, setCvc] = useState(creditCard.cvv);
    const [title, setTitle] = useState(creditCard.title);
    const [errors, setErrors] = useState({});
    const [issuer, setIssuer] = useState('Default');


    const handleNumberChange = (e) => {
        const input = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
        const formattedNumber = input.match(/.{1,4}/g)?.join(' ') || ''; // Add space after every 4 digits
        setNumber(formattedNumber);

        setErrors((prevErrors) => ({
            ...prevErrors,
            number: input && !validateCardNumber(formattedNumber) && 'Invalid card number',
        }));
    };


    const handleCVCChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setCvc(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            cvc: value && !validateCVV(value) && 'Invalid CVV',
        }));
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value;console.log(value);
        value = value.replace(/\D/g, '');

        if (value.length === 4) {
            // expiry =
        }
        if (expiry.length === 0) {
            value = value.slice(4);
        }
        else if (expiry.length === 1) {
            if (value.length !== 3) {
                value = value.slice(1, 2) + value.slice(4);
            } else {
                value = '';
            }
        }
        else if (expiry.length === 2) {
            if (value.length !== 3) {
                value = value.slice(0, 2) + value.slice(4);
            } else {
                value = value.slice(0, 1);
            }
        }
        else if (expiry.length === 3) {
            value = value.slice(0, 2) + value.slice(3);
        }

        let formattedValue;
        if (value.length === 0) {
            formattedValue = '00/00'
        } else if (value.length === 1) {
            formattedValue = `0${value}/00`
        } else if (value.length === 2) {
            formattedValue = `${value}/00`
        } else if (value.length === 3) {
            formattedValue = `${value.slice(0, 2)}/0${value.slice(2)}`
        } else {
            formattedValue = `${value.slice(0, 2)}/${value.slice(2)}`
        }
        setExpiryDisplay(formattedValue);
        setExpiry(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            expiry: !validateExpiry(formattedValue) && 'Invalid expiry date',
        }));
    };

    const handlePlaceHolderChange = (e) => {
        const value = e.target.value;
        setName(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            placeHolder: !value && 'Invalid PlaceHolder',
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        if (!form.checkValidity()) {
            e.stopPropagation();
            alert('Please fill in all the required fields');
        } else {
            onSaveClick(e, {
                number, placeHolder: name, cvv: cvc, expiryDate: expiryDisplay, type: issuer, title
            }, errors);
        }
    };

    return (<div>
            <div className="container">
                <div className="cardBox" >
                    <div className="box" >
                        <h5>Title: {title}</h5>
                    </div>
                    <Cards
                        cvc={cvc}
                        name={name}
                        number={number}
                        expiry={expiry}
                        focused={focused}
                        callback={(type) => setIssuer(type['issuer'])}
                    />
                </div>

                <Form className="form" onSubmit={handleSubmit} noValidate>
                    <Row className="mb-3">
                        <Form.Group as={Col} >
                            <Form.Control
                                required
                                readOnly={!editable}
                                type="tel"
                                id="number"
                                name="number"
                                placeholder="Card Number"
                                value={number}
                                onChange={handleNumberChange}
                                onFocus={(e) => setFocused(e.target.name)}
                                maxLength={19} // 16 digits + 3 spaces
                                isInvalid={errors.number && focused !== 'number'}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group  as={Col} >
                            <Form.Control
                                required
                                readOnly={!editable}
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Place Holder"
                                value={name}
                                onChange={handlePlaceHolderChange}
                                onFocus={(e) => setFocused(e.target.name)}
                                maxLength={45}
                            />
                        </Form.Group>

                        <Form.Group as={Col} >
                            <Form.Control
                                required
                                readOnly={!editable}
                                type="text"
                                id="title"
                                name="cardTitle"
                                placeholder="Card Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onFocus={(e) => setFocused(e.target.name)}
                                maxLength={45}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Control
                                required
                                readOnly={!editable}
                                type="tel"
                                id="expiry"
                                name="expiry"
                                placeholder="MM/YY"
                                value={expiryDisplay}
                                onChange={handleExpiryChange}
                                onFocus={(e) => setFocused(e.target.name)}
                                maxLength={expiryDisplay.length === 4 ? 5 : 6} // MM/YY
                                isInvalid={errors.expiry && focused !== 'expiry'}
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Control
                                required
                                readOnly={!editable}
                                type="tel"
                                id="cvc"
                                name="cvc"
                                placeholder="CVC"
                                value={cvc}
                                onChange={handleCVCChange}
                                onFocus={(e) => setFocused(e.target.name)}
                                maxLength={4}
                                isInvalid={errors.cvc && focused !== 'cvc'}
                            />
                        </Form.Group>
                    </Row>
                    {editable ? (
                        <Button variant="primary" type="submit" >
                            Save
                        </Button>
                    ): null}
                </Form>
            </div>

            <div className="box">
            </div>
        </div>
    );
}