import { useState } from "react";
import { useUser } from "../context/userContext";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, errorMessage, createUser } = useUser();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  const [usernameCreate, setUsernameCreate] = useState("");
  const [passwordCreate, setPasswordCreate] = useState("");
  const [emailCreate, setEmailCreate] = useState("");
  const [ageCreate, setAgeCreate] = useState("");

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUserBody = {
      username: usernameCreate.trim(),
      password: passwordCreate,
      email: emailCreate,
      age: parseInt(ageCreate),
    };
    createUser(newUserBody);

    // Clear inputs
    setUsernameCreate("");
    setPasswordCreate("");
    setEmailCreate("");
    setAgeCreate("");

    // Go back to login
    setIsRegistering(false);
  };

  return (
    <main className="login-page">
      <div className="login-container">
        {errorMessage && <div className="error-message">⚠️ {errorMessage}</div>}

        {!isRegistering ? (
          <>
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Login</button>
            </form>
            <button
             className="toggle-button"
              onClick={() => setIsRegistering(true)}
            >
              Register User
            </button>
          </>
        ) : (
          <>
            <form onSubmit={handleCreateUser}>
              <h2>Create Account</h2>
              <input
                type="text"
                placeholder="Username"
                value={usernameCreate}
                onChange={(e) => setUsernameCreate(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={passwordCreate}
                onChange={(e) => setPasswordCreate(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                value={emailCreate}
                onChange={(e) => setEmailCreate(e.target.value)}
              />
              <input
                type="number"
                placeholder="Age"
                value={ageCreate}
                onChange={(e) => setAgeCreate(e.target.value)}
              />
              <button type="submit">Create</button>
            </form>
            <button
              onClick={() => setIsRegistering(false)}
               className="toggle-button"
            >
              ← Back to login
            </button>
          </>
        )}
      </div>
    </main>
  );
}
