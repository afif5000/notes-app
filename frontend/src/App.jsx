import { use, useEffect } from "react";
import { useState } from "react";

function App() {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:3000/notes");

      const result = await res.json();

      setNotes(result.data);

      console.log(result);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (newTitle, newContent) => {
    {
      try {
        const res = await fetch("http://localhost:3000/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        });

        const result = await res.json();

        if (res.ok) {
          setNotes([...notes, result.data]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleupdateNote = async (id, newTitle, newContent) => {
    try {
      const res = await fetch(`http://localhost:3000/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updateTitle, content: updateContent }),
      });

      const result = await res.json();

      setNotes((prevNotes) => {
        return prevNotes.map((note) => (note.id === id ? result.data : note));
      });

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/notes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotes((notes) => notes.filter((note) => note.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getNoteById = (id) => {
    console.log(id);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col mt-24 items-center">
        <NoteForm onAddNote={addNote} />
        <NoteList
          notes={notes}
          onDelete={handleDelete}
          onUpdate={handleupdateNote}
          onGetById={getNoteById}
        />
      </main>
    </>
  );
}

export default App;

// ================== Komponen ==================

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 flex justify-center bg-white shadow">
      <div className="flex justify-between px-1 py-1 container">
        <img src="/logo.svg" alt="Logo" className="w-30 h-10" />
      </div>
    </nav>
  );
};

const NoteForm = ({ onAddNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddNote(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <section className="container max-w-xl px-5 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          className="rounded-sm outline outline-gray-400 p-3"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          className="resize-y min-h-14 rounded-sm outline outline-gray-400 p-3"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold rounded-lg py-3"
        >
          Add note
        </button>
      </form>
    </section>
  );
};

const NoteItem = ({ note, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleEdit, setTitleEdit] = useState(note.title);
  const [contenEdit, setTContentEdit] = useState(note.content);

  const handleCancel = () => {
    setTitleEdit(note.title);
    setTContentEdit(note.content);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg shadow-md bg-white w-[300px] p-5">
      {isEditing ? (
        <>
          <input
            value={titleEdit}
            type="text"
            className="w-full rounded-sm outline outline-gray-400 p-2"
            onChange={(e) => setTitleEdit(e.target.value)}
          />

          <textarea
            value={contenEdit}
            type="text"
            className="w-full rounded-sm outline outline-gray-400 p-2 mt-2"
            onChange={(e) => setTContentEdit(e.target.value)}
          />

          <div className="mt-4 flex gap-2">
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded"
              onClick={handleCancel}
            >
              cancel
            </button>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => {
                onUpdate(note.id, titleEdit, contenEdit);
                setIsEditing(false);
              }}
            >
              save
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="font-medium text-xl">{note.title}</p>
          <p className="text-sm text-gray-500">
            ~{showFormattedDate(note.created_at)}
          </p>
          <p className="mt-2">{note.content}</p>
          <div className="mt-4 flex gap-2">
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => onDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const NoteList = ({ notes, onUpdate, onDelete }) => {
  return (
    <section className="container py-8">
      <h2 className="inline-flex items-center gap-2 text-2xl font-medium mb-6">
        <img src="/note.svg" alt="note icon" className="w-8 h-8" />
        Notes
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        ) : (
          <h1>Data Kosong</h1>
        )}
      </div>
    </section>
  );
};

// helper
const showFormattedDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    weekday: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("id-ID", options);
};
