import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../Context/AuthContext";
function SignUpForm() {
    const { register } = useContext(AuthContext);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [state, setState] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = evt => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
    };

    const handleOnSubmit = async evt => {
        evt.preventDefault();

        const { username, email, password } = state;


        try {
            await register(username, email, password);
            navigate('/'); // Redirect to login page after successful registration
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="form-container sign-up-container">
            <form onSubmit={handleOnSubmit}>
                <h1>Create an Account</h1>
                <div className="social-container">
                    {/*<a href="#" className="social">*/}
                    {/*    <i className="fab fa-facebook-f" />*/}
                    {/*</a>*/}
                </div>
                {/*<span>or use your email for registration</span>*/}
                <input
                    type="text"
                    name="username"
                    value={state.username}
                    onChange={handleChange}
                    placeholder="Username"
                />
                <input
                    type="email"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <input
                    type="password"
                    name="password"
                    value={state.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                <br></br>
                <button>Sign Up</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default SignUpForm;
