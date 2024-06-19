import React, { useState } from "react";
import '../../Designs/authDesign.css';
import SignUpForm from "./SignUp";
import SignInForm from "./SignIn";

export default function AuthenticationForm() {
    const [type, setType] = useState("signIn");
    const handleOnClick = text => {
        if (text !== type) {
            setType(text);
        }
    };
    const containerClass =
        "auth-container " + (type === "signUp" ? "right-panel-active" : "");
    return (
        <div className="auth-app custom-bg">
            <div className={containerClass} id="container">
                <SignUpForm />
                <SignInForm />
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>How do you bank?</h1>
                            <p>
                                Join your account and enjoy the best banking experience. #welovebanking
                            </p>
                            <button
                                className="ghost"
                                id="signIn"
                                onClick={() => handleOnClick("signIn")}
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Glad to see you!</h1>
                            <p>We love banking in your style! Come and join us! #howdoyoubank</p>
                            <button
                                className="ghost"
                                id="signUp"
                                onClick={() => handleOnClick("signUp")}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
