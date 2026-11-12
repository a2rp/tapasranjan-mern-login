function PrivatePage({ user, onLogout }) {
    return (
        <main className="auth-shell">
            <section className="auth-card account-card" aria-labelledby="account-title">
                <p className="auth-eyebrow">Private space</p>
                <h1 id="account-title">You’re signed in, {user.fullName}.</h1>
                <p className="auth-intro">Your session is protected by an HTTP-only authentication cookie.</p>
                <div className="account-details">
                    <span>Email address</span>
                    <strong>{user.email}</strong>
                </div>
                <button className="primary-button" type="button" onClick={onLogout}>Sign out</button>
            </section>
        </main>
    );
}

export default PrivatePage;
