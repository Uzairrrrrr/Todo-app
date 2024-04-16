import React from "react";
import HighlightIcon from "@mui/icons-material/Highlight";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth"; 

const Header = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header>
      <h1>
        <HighlightIcon />
        ToDoList
      </h1>
      <IconButton onClick={handleLogout} className="logout-button" >Logout</IconButton>
    </header>
  );
}

export default Header;

