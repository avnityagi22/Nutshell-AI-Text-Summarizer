import { useState } from "react";

function Login({ onLogin, onShowSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        // Get saved user from localStorage
        const savedUser = localStorage.getItem("nutshell-user");

        if (!savedUser) {
            setError("No account found. Please sign up first.");
            return;
        }

        const user = JSON.parse(savedUser);

        // Check credentials
        if (
            user.email !== email.trim() ||
            user.password !== password
        ) {
            setError("Invalid email or password.");
            return;
        }

        // Login successful
        localStorage.setItem(
            "nutshell-logged-in",
            "true"
        );

        onLogin({
            email: user.email
        });
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <div className="brand-icon">
                    ✦
                </div>

                <h1>Welcome to Nutshell</h1>

                <p className="auth-subtitle">
                    Login to continue
                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                    <button type="submit">
                        Login
                    </button>

                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={onShowSignup}
                    >
                        Sign up
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Login;