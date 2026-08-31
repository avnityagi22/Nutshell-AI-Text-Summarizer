import { useState } from "react";
import "./Signup.css";

function Signup({ onBackToLogin, onSignup }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = (e) => {

        e.preventDefault();

        setError("");

        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Check if account already exists
        const existingUser =
            localStorage.getItem("nutshell-user");

        if (existingUser) {

            const user = JSON.parse(existingUser);

            if (user.email === email) {
                setError(
                    "An account with this email already exists."
                );
                return;
            }
        }

        // Save user locally
        const newUser = {
            email: email,
            password: password
        };

        localStorage.setItem(
            "nutshell-user",
            JSON.stringify(newUser)
        );

        // Tell App signup was successful
        onSignup({
            email: email
        });
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    ✦
                </div>

                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Join Nutshell and start summarizing smarter.
                </p>

                <form onSubmit={handleSignup}>

                    <label>Email Address</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <label>Confirm Password</label>

                    <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                    />

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Create Account
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        className="auth-link"
                        onClick={onBackToLogin}
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Signup;