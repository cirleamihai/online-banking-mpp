import React, {useContext, useState} from "react";
import {AuthContext} from "../../Context/AuthContext";
import {useNavigate} from "react-router-dom";
function SignInForm() {
    const [state, setState] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState('');
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = evt => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
    };

    const handleOnSubmit = async evt => {
        evt.preventDefault();

        const { email, password } = state;

        try {
            await login(email, password);
            navigate('/'); // Redirect to home or any other protected route after login
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleOnSubmit}>
                <h1>Sign in</h1>
                <span>#bankWithUs</span>
                <div className="social-container">
                    {/*<a href="#" className="social">*/}
                    {/*    <i className="fab fa-facebook-f" />*/}
                    {/*</a>*/}
                </div>
                <input
                    type="text"
                    placeholder="Email/ Username"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={state.password}
                    onChange={handleChange}
                />
                <a href="#">Forgot your password?</a>
                <button>Sign In</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default SignInForm;