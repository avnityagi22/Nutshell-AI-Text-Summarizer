import { useState, useEffect, useRef } from "react";

import Login from "./components/Login";
import Signup from "./components/Signup";
import TextInput from "./components/TextInput";
import Buttons from "./components/Buttons";
import Summarybox from "./components/Summarybox";

import "./styles/App.css";

function App() {

    // =========================
    // USER AUTHENTICATION
    // =========================

    const [user, setUser] = useState(() => {
        const savedUser =
            localStorage.getItem("nutshell-logged-user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    const [showSignup, setShowSignup] = useState(false);


    // =========================
    // SUMMARIZER STATES
    // =========================

    const [text, setText] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    const [summaryLength, setSummaryLength] =
        useState("medium");
        const [summaryLanguage, setSummaryLanguage] =
    useState("English");

    const [darkMode, setDarkMode] =
        useState(false);


    // =========================
    // PDF STATES
    // =========================

    const [pdfFile, setPdfFile] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);

    const fileInputRef = useRef(null);


    // =========================
    // HISTORY
    // =========================

    const [history, setHistory] = useState(() => {

        const savedHistory =
            localStorage.getItem("nutshell-history");

        return savedHistory
            ? JSON.parse(savedHistory)
            : [];
    });


    // =========================
    // DARK MODE
    // =========================

    useEffect(() => {

        document.body.classList.toggle(
            "dark-mode",
            darkMode
        );

    }, [darkMode]);


    // =========================
    // LOGIN
    // =========================

    const handleLogin = (userData) => {

        const loggedInUser = {
            name: userData.name || "User",
            email: userData.email
        };

        localStorage.setItem(
            "nutshell-logged-user",
            JSON.stringify(loggedInUser)
        );

        setUser(loggedInUser);
        setShowSignup(false);
    };


    // =========================
    // SIGNUP
    // =========================

    const handleSignup = (userData) => {

        const newUser = {
            name: userData.name || "User",
            email: userData.email
        };

        localStorage.setItem(
            "nutshell-logged-user",
            JSON.stringify(newUser)
        );

        setUser(newUser);
        setShowSignup(false);
    };


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem(
            "nutshell-logged-user"
        );

        setUser(null);
        setText("");
        setSummary("");
    };


    // =========================
    // SAVE HISTORY
    // =========================

    const saveToHistory = (
        newSummary,
        title = "Text Summary",
        type = "text"
    ) => {

        const newItem = {

            id: Date.now(),

            title: title,

            preview:
                newSummary.substring(0, 120),

            summary: newSummary,

            length: summaryLength,

            type: type,

            date:
                new Date().toLocaleString(),

            userEmail:
                user?.email || "guest"
        };


        setHistory((previousHistory) => {

            const updatedHistory = [
                newItem,
                ...previousHistory
            ];

            localStorage.setItem(
                "nutshell-history",
                JSON.stringify(updatedHistory)
            );

            return updatedHistory;
        });
    };


    // =========================
    // PDF UPLOAD
    // =========================

    const handlePdfUpload = async (event) => {

        const file =
            event.target.files[0];

        if (!file) return;


        if (
            file.type !==
            "application/pdf"
        ) {

            alert(
                "Please select a PDF file."
            );

            return;
        }


        setPdfFile(file);
        setPdfLoading(true);
        setSummary("");


        try {

            console.log(
                "Sending PDF to backend..."
            );


            const formData = new FormData();

formData.append("file", file);

formData.append(
    "language",
    summaryLanguage
);

formData.append(
    "length",
    summaryLength
);
            const response =
                await fetch(
                    "http://localhost:5000/summarize-pdf",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            console.log(
                "PDF response:",
                response.status
            );


            const data =
                await response.json();


            console.log(
                "PDF data:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "PDF summarization failed"
                );
            }


            setSummary(
                data.summary
            );


            saveToHistory(
                data.summary,
                file.name,
                "pdf"
            );


        } catch (error) {

            console.error(
                "PDF ERROR:",
                error
            );

            alert(
                "Unable to summarize the PDF."
            );

        } finally {

            setPdfLoading(false);
        }
    };


    // =========================
    // TEXT SUMMARIZATION
    // =========================

    const handleSummarize = async () => {

        if (!text.trim()) {

            alert(
                "Please enter some text first!"
            );

            return;
        }


        setLoading(true);
        setSummary("");


        try {

            console.log(
                "Sending text to backend..."
            );


            const response =
                await fetch(
                    "http://localhost:5000/summarize",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

    text: text,

    length: summaryLength,

    language: summaryLanguage
})
                    }
                );


            console.log(
                "Response received:",
                response.status
            );


            const data =
                await response.json();


            console.log(
                "Data received:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Something went wrong"
                );
            }


            setSummary(
                data.summary
            );


            saveToHistory(
                data.summary,
                "Text Summary",
                "text"
            );


        } catch (error) {

            console.error(
                "FETCH ERROR:",
                error
            );

            alert(
                "Unable to connect to the backend."
            );

        } finally {

            console.log(
                "Finished"
            );

            setLoading(false);
        }
    };


    // =========================
    // CLEAR
    // =========================

    const handleClear = () => {

        setText("");
        setSummary("");
        setPdfFile(null);

        console.log(
            "Text and summary cleared"
        );
    };


    // =========================
    // LOGIN / SIGNUP SCREEN
    // =========================

    if (!user) {

        if (showSignup) {

            return (
                <Signup
                    onSignup={handleSignup}
                    onBackToLogin={() =>
                        setShowSignup(false)
                    }
                />
            );
        }


        return (
            <Login
                onLogin={handleLogin}
                onShowSignup={() =>
                    setShowSignup(true)
                }
            />
        );
    }


    // =========================
    // MAIN APPLICATION
    // =========================

    return (

        <div className="app">

            {/* ================= HEADER ================= */}

            <header className="app-header">

                <div className="brand">

                    <div className="brand-icon">
                        ✦
                    </div>

                    <div>

                        <h1>
                            Nutshell
                        </h1>

                        <p>
                            Smart. Simple. Summarized.
                        </p>

                    </div>

                </div>


                <div className="header-actions">

                    <div className="header-badge">
                        ✨ AI Powered
                    </div>


                    <div className="user-email">
                        👤 {user.email}
                    </div>


                    <button
                        className="theme-toggle"
                        onClick={() =>
                            setDarkMode(!darkMode)
                        }
                        aria-label="Toggle dark mode"
                    >
                        {darkMode
                            ? "☀️"
                            : "🌙"}
                    </button>


                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ================= WELCOME ================= */}

            <div className="welcome-message">

                👋 Welcome,{" "}

                <strong>
                    {user.name}
                </strong>

            </div>


            {/* ================= TEXT INPUT ================= */}

            <TextInput
                text={text}
                setText={setText}
            />


            {/* ================= PDF UPLOAD ================= */}

            <div className="pdf-upload-card">

                <div className="pdf-upload-icon">
                    📄
                </div>


                <div className="pdf-upload-content">

                    <h2>
                        Summarize a PDF
                    </h2>


                    <p>
                        Upload a PDF and let
                        Nutshell extract and
                        summarize its content.
                    </p>


                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfUpload}
                        hidden
                    />


                    <button
                        className="pdf-upload-button"
                        onClick={() =>
                            fileInputRef.current.click()
                        }
                        disabled={pdfLoading}
                    >

                        {pdfLoading
                            ? "⏳ Summarizing PDF..."
                            : "📄 Choose PDF"}

                    </button>


                    {pdfFile &&
                        !pdfLoading && (

                            <p className="selected-file">

                                ✓ {pdfFile.name}

                            </p>

                        )}

                </div>

            </div>


            {/* ================= SUMMARY LENGTH ================= */}

            <div className="length-selector">

                <span className="length-label">
                    Summary Length:
                </span>


                <div className="length-options">

                    <button
                        className={
                            summaryLength === "short"
                                ? "selected"
                                : ""
                        }
                        onClick={() =>
                            setSummaryLength("short")
                        }
                    >
                        ⚡ Short
                    </button>


                    <button
                        className={
                            summaryLength === "medium"
                                ? "selected"
                                : ""
                        }
                        onClick={() =>
                            setSummaryLength("medium")
                        }
                    >
                        ✦ Medium
                    </button>


                    <button
                        className={
                            summaryLength === "detailed"
                                ? "selected"
                                : ""
                        }
                        onClick={() =>
                            setSummaryLength("detailed")
                        }
                    >
                        📖 Detailed
                    </button>

                </div>

            </div>
{/* SUMMARY LANGUAGE */}

<div className="language-selector">

    <span className="language-label">
        🌐 Summary Language:
    </span>

    <select
        value={summaryLanguage}
        onChange={(e) =>
            setSummaryLanguage(e.target.value)
        }
    >

        <option value="English">
            🇬🇧 English
        </option>

        <option value="Hindi">
            🇮🇳 Hindi
        </option>

        <option value="Hinglish">
            🇮🇳 Hinglish
        </option>

        <option value="Spanish">
            🇪🇸 Spanish
        </option>

        <option value="French">
            🇫🇷 French
        </option>

        <option value="German">
            🇩🇪 German
        </option>

        <option value="Japanese">
            🇯🇵 Japanese
        </option>

        <option value="Chinese">
            🇨🇳 Chinese
        </option>

    </select>

</div>

            {/* ================= BUTTONS ================= */}

            <Buttons
                onSummarize={handleSummarize}
                onClear={handleClear}
                loading={loading}
            />


            {/* ================= SUMMARY ================= */}

            <Summarybox
                summary={summary}
                loading={loading}
            />


            {/* ================= FOOTER ================= */}

            <footer className="app-footer">

                <div className="footer-brand">
                    ✦ Nutshell
                </div>

                <p>
                    Smart. Simple. Summarized.
                </p>

                <span>
                    AI-powered text summarization
                </span>

            </footer>

        </div>
    );
}

export default App;