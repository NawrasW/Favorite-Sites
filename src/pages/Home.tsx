import React, { useState, useEffect } from 'react';
import Card from '../components/Card.tsx';
interface Bookmark {
  id: number;
  name: string;
  link: string;
  image?: string;
}

const Home: React.FC = () => {
  const [list, setList] = useState<Bookmark[]>([]);
  const [inputTask, setInputTask] = useState<string>('');
  const [inputLink, setInputLink] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  const [confirmation, setConfirmation] = useState<{ id: number | null; visible: boolean }>({
    id: null,
    visible: false
  });

  useEffect(() => {
    const storedList = localStorage.getItem('bookmarks');
    if (storedList) {
      setList(JSON.parse(storedList));
    }
  }, []);

  useEffect(() => {
    if (list.length > 0) {
      localStorage.setItem('bookmarks', JSON.stringify(list));
    }
  }, [list]);

  const fetchImageFromUrl = async (url: string) => {
    try {
      const response = await fetch(`https://api.linkpreview.net/?key=${process.env.REACT_APP_API_KEY}&q=${url}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.image; // Adjust based on API response structure
    } catch (error) {
      console.error('Error fetching image:', error);
      return ''; // Return empty string if error occurs
    }
  };

  const handleAddOrEditTodo = async () => {
    if (!inputTask || !inputLink) {
      alert('Both name and link are required');
      return;
    }

    const imageUrl = await fetchImageFromUrl(inputLink);

    if (editId !== null) {
      setList(
        list.map((item) =>
          item.id === editId
            ? { ...item, name: inputTask, link: inputLink, image: imageUrl }
            : item
        )
      );
      setEditId(null);
    } else {
      const newTask: Bookmark = {
        id: Math.random(),
        name: inputTask,
        link: inputLink,
        image: imageUrl,
      };
      setList([...list, newTask]);
    }

    setInputTask('');
    setInputLink('');
  };

  const handleEdit = (id: number) => {
    const taskToEdit = list.find((item) => item.id === id);
    if (taskToEdit) {
      setInputTask(taskToEdit.name);
      setInputLink(taskToEdit.link);
      setEditId(id);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmation({ id, visible: true });
  };

  const confirmDelete = () => {
    if (confirmation.id !== null) {
      setList(list.filter((item) => item.id !== confirmation.id));
      setConfirmation({ id: null, visible: false });
    }
  };

  const cancelDelete = () => {
    setConfirmation({ id: null, visible: false });
  };

  const totalPages = Math.ceil(list.length / itemsPerPage);
  const currentItems = list.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h1 className="text-3xl font-bold text-cyan-500 mt-4 mb-4">My Favorite Websites</h1>
      <div className="max-w-sm mx-auto bg-white overflow-hidden">
        <div className="p-4">
          <input
            type="text"
            placeholder="Website Name"
            value={inputTask}
            onChange={(e) => setInputTask(e.target.value)}
            className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Website Link"
            value={inputLink}
            onChange={(e) => setInputLink(e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddOrEditTodo}
            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {editId !== null ? 'Edit' : 'Add'}
          </button>
        </div>
      </div>
      <Card items={currentItems} onEdit={handleEdit} onDelete={handleDelete} />
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
        >
          Prev
        </button>
        <span className="flex items-center">{`${currentPage} / ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
      {confirmation.visible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Are you sure you wish to delete this item?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;