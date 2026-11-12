import { useEffect, useState } from "react";
import api from "./api";
import PrivatePage from "./pages/PrivatePage";
import "./App.css";

function App() {
    const [user, setUser] = useState(null);
    const [checkingSession, setCheckingSession] = useState(true);
    const [mode, setMode] = useState("login");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let mounted = true;
        api.get("/user/me")
            .then(({ data }) => {
                if (mounted) setUser(data.user);
            })
            .catch(() => {
                if (mounted) setUser(null);
            })
            .finally(() => {
                if (mounted) setCheckingSession(false);
            });

        return () => { mounted = false; };
    }, []);

    function changeMode(nextMode) {
        setMode(nextMode);
        setMessage("");
        setPassword("");
        setPasswordVerify("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setSubmitting(true);

        try {
            const endpoint = mode === "register" ? "/user/register" : "/user/login";
            const payload = mode === "register"
                ? { fullName, email, password, passwordVerify }
                : { email, password };
            const { data } = await api.post(endpoint, payload);
            setUser(data.user);
            setPassword("");
            setPasswordVerify("");
        } catch (error) {
            setMessage(error.response?.data?.message || "Could not reach the sign-in service. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleLogout() {
        try {
            await api.post("/user/logout");
        } catch {
            // Clear the local view even if the API is temporarily unavailable.
        } finally {
            setUser(null);
            setMode("login");
            setPassword("");
        }
    }

    if (checkingSession) {
        return <main className="auth-shell"><p className="loading-message" role="status">Checking your session…</p></main>;
    }

    if (user) return <PrivatePage user={user} onLogout={handleLogout} />;

    const isRegistering = mode === "register";

    return (
        <main className="auth-shell">
            <section className="auth-card" aria-labelledby="auth-title">
                <p className="auth-eyebrow">A2RP · MERN authentication</p>
                <h1 id="auth-title">{isRegistering ? "Create your account" : "Welcome back"}</h1>
                <p className="auth-intro">
                    {isRegistering
                        ? "Set up an account to access your private space."
                        : "Sign in securely to continue to your private space."}
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {isRegistering && <label>
                        Full name
                        <input
                            type="text"
                            name="fullName"
                            autoComplete="name"
                            minLength="2"
                            maxLength="60"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            required
                        />
                    </label>}
                    <label>
                        Email address
                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            maxLength="254"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            autoComplete={isRegistering ? "new-password" : "current-password"}
                            minLength="8"
                            maxLength="72"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </label>
                    {isRegistering && <label>
                        Confirm password
                        <input
                            type="password"
                            name="passwordVerify"
                            autoComplete="new-password"
                            minLength="8"
                            maxLength="72"
                            value={passwordVerify}
                            onChange={(event) => setPasswordVerify(event.target.value)}
                            required
                        />
                    </label>}

                    {message && <p className="form-message" role="alert">{message}</p>}
                    <button className="primary-button" type="submit" disabled={submitting}>
                        {submitting ? "Please wait…" : isRegistering ? "Create account" : "Sign in"}
                    </button>
                </form>

                <p className="auth-switch">
                    {isRegistering ? "Already have an account?" : "New here?"}{" "}
                    <button type="button" onClick={() => changeMode(isRegistering ? "login" : "register")}>
                        {isRegistering ? "Sign in" : "Create an account"}
                    </button>
                </p>
            </section>
        </main>
    );
}

export default App;
