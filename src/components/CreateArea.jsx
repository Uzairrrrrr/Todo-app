import { useState } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: "",
  });
  function handleChange(event) {
    const { name, value } = event.target;
    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }
  function submitNote(event) {
    props.onAdd(note);
    setNote({ title: "", content: "" });
    event.preventDefault();
  }
  const [isExpended, setExpende] = useState(false);
  function expend(){
    setExpende(true);
  }
  return (
    <div>
      <form className="create-note">
        {isExpended && (
          <input
          type="text"
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />
        )}
        <textarea
          name="content"
          rows={isExpended ? 3 : 1}
          onClick={expend}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note .."
        />
        <Fab onClick={submitNote}>
          <AddIcon />
        </Fab>
      </form>
    </div>
  );
}
export default CreateArea;
