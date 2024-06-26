import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Header from "./components/Header";
import CreateArea from "./components/CreateArea";
import Note from "./components/Note";
import Footer from "./components/Footer";
import Sign from "./components/Sign";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


function App() {
  const [notes, setNotes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        if (user) {
          const notesCollection = collection(db, "notes");
          const q = query(notesCollection, where("email", "==", user.email));
          const snapshot = await getDocs(q);
          const notesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setNotes(notesData);
        }
      } catch (error) {
        console.error("Error fetching notes: ", error);
      }
    };
    fetchNotes();
  }, [db, user]);

  const addNote = async (newNote) => {
    if (newNote.title.trim() !== "" && newNote.content.trim() !== "") {
      try {
        const notesCollection = collection(db, "notes");
        const noteData = { ...newNote, email: user.email }; 
        const docRef = await addDoc(notesCollection, noteData);
        setNotes((prevNotes) => [...prevNotes, { ...newNote, id: docRef.id }]);
        setErrorMessage("");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      setErrorMessage("Title and content cannot be empty");
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, "notes", id));
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
  const NotesSection = ({ onAdd, notes, errorMessage, deleteNote }) => {
    return (
      <div>
        {/* Render the CreateArea component */}
        <CreateArea onAdd={onAdd} />
  
        {/* Render the existing notes */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {notes.map((note) => (
          <Note
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            onDelete={deleteNote}
          />
        ))}
      </div>
    );
  };
  return (
    <Router>
      <div className="App">
        <Header onLogout={handleLogout} />
        <Routes>
          {/* Route to render Sign component if user is not authenticated */}
          <Route
            path="/"
            element={loading ? null : user ? <Navigate to="/notes" /> : <Sign setUser={setUser} setLoading={setLoading} />}
          />

          {/* Route to render both CreateArea and NotesSection components */}
          <Route path="/notes" element={<NotesSection onAdd={addNote} notes={notes} errorMessage={errorMessage} deleteNote={deleteNote} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
