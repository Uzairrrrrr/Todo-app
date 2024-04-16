import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AuthComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [signInActive] = useState(false);
  const auth = getAuth();

  const handleAuthentication = async () => {
    if (!isValidEmail(email)) {
      setEmailFormatError(true);
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
    } catch (signInError) {
      try {
        const signUpUserCredential = await createUserWithEmailAndPassword(auth, email, password);
        const signUpUser = signUpUserCredential.user;
        document.cookie = `userEmail=${email}; expires=Thu, 01 Jan 2030 00:00:00 GMT; path=/`;
      } catch (signUpError) {
        setError(signUpError.message);
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  return (
    <div className="container">
      <h2>Authentication</h2>
      {emailFormatError && <p className="error-message">Invalid email format</p>}
      <div className="input-group">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="input-group">
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className={`button ${signInActive ? 'active' : ''}`} onClick={handleAuthentication}>
        Sign {signInActive ? 'In' : 'Up'}
      </button>
    </div>
  );
};

export default AuthComponent;
