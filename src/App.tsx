import React, { useState, useEffect } from 'react';
import './App.scss';

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
}

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<Note>({
    id: 0,
    title: '',
    content: '',
    tags: [],
  });
  const [filterTag, setFilterTag] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const tags = value.split(',').map((tag) => tag.trim());
    setNewNote((prevNote) => ({ ...prevNote, tags }));
  };

  const handleNoteSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newNote.title && newNote.content) {
      if (selectedNote) {
        // Редакт сущ заметки
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === selectedNote.id ? { ...newNote, id: note.id } : note
          )
        );
        setSelectedNote(null);
      } else {
        // Добавление новой заметки
        setNotes((prevNotes) => [...prevNotes, { ...newNote, id: Date.now() }]);
      }

      setNewNote({
        id: 0,
        title: '',
        content: '',
        tags: [],
      });
    }
  };

  const handleNoteDelete = (id: number) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const handleNoteEdit = (note: Note) => {
    setSelectedNote(note);
    setNewNote({
      id: note.id,
      title: note.title,
      content: note.content,
      tags: note.tags,
    });
  };

  const handleTagFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setFilterTag(value);
  };

  const uniqueTags = Array.from(new Set(notes.flatMap((note) => note.tags)));

  const filteredNotes = filterTag
    ? notes.filter((note) => note.tags.includes(filterTag))
    : notes;

  return (
    <div className="app">
      <h1>Заметки</h1>

      <form onSubmit={handleNoteSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Заголовок"
          value={newNote.title}
          onChange={handleInputChange}
        />
        <textarea
          name="content"
          placeholder="Содержание"
          value={newNote.content}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="tags"
          placeholder="Тэги (ввод через запятую)"
          value={newNote.tags.join(', ')}
          onChange={handleTagInputChange}
        />
        <button type="submit">{selectedNote ? 'Обновить заметку' : 'Сохранить заметку'}</button>
      </form>

      <select value={filterTag} onChange={handleTagFilterChange}>
        <option value="">Все</option>
        {uniqueTags.map((tag) => (
          <option key={tag}>{tag}</option>
        ))}
      </select>

      <ul>
        {filteredNotes.map((note) => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <p>Tags: {note.tags.join(', ')}</p>
            <button onClick={() => handleNoteEdit(note)}>Изменить</button>
            <button onClick={() => handleNoteDelete(note.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;