import React, { useState, useEffect } from "react";
import Card from "../components/Card.tsx";
import Category from "../components/Category.tsx";
import { ToastContainer, toast } from 'react-toastify';

interface Bookmark {
  id: number;
  name: string;
  link: string;
  image?: string;
  category: string;
}

const Home: React.FC = () => {
  const [list, setList] = useState<Bookmark[]>([]);
  const [inputTask, setInputTask] = useState("");
  const [inputLink, setInputLink] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedValue, setSelectedValue] = useState("All");
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

const notify = () => toast("Wow so easy!");

  const [confirmation, setConfirmation] = useState<{
    id: number | null;
    visible: boolean;
  }>({ id: null, visible: false });

  // Load from localStorage
  useEffect(() => {
    const storedList = localStorage.getItem("bookmarks");
    if (storedList) {
      const parsed: Bookmark[] = JSON.parse(storedList).map(
        (item: Bookmark) => ({
          ...item,
          category: item.category || "All",
        })
      );
      setList((prevList) => {
        // Merge old storage with any existing state (avoid duplicates by id)
        const merged = [
          ...parsed,
          ...prevList.filter((item) => !parsed.some((p) => p.id === item.id)),
        ];
        return merged;
      });
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(list));
  }, [list]);

  const options = [
    { label: "All", value: "All" },
    { label: "Movies", value: "Movies" },
    { label: "TV Shows", value: "Tv Shows" },
    { label: "Coding", value: "Coding" },
  ];

  const fetchImageFromUrl = async (url: string) => {
  const apiKey = process.env.REACT_APP_API_KEY; // use env variable
  if (!apiKey) {
    console.warn("⚠️ No API key found in environment variables.");
    return "";
  }

  try {
    const response = await fetch(
      `https://api.linkpreview.net/?key=${apiKey}&q=${url}`
    );
    const data = await response.json();

    if (data.error) {
      console.error("API Error:", data.error);
      return "";
    }

    return data.image || "";
  } catch (error) {
    console.error("Fetch failed:", error);
    return "";
  }
};



  const handleAddOrEdit = async () => {
    if (!inputTask || !inputLink || !selectedValue) {
      toast.warn("Name, Link and Category are required!");
      //alert("Name, Link and Category are required!");
      return;
    }

    const imageUrl = await fetchImageFromUrl(inputLink);

    if (editId !== null) {
      setList(
        list.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: inputTask,
                link: inputLink,
                image: imageUrl,
                category: selectedValue,
              }
            : item
        )
      );
      setEditId(null);
      toast.success("Bookmarked Updated");
    } else {
      const newBookmark: Bookmark = {
        id: Math.random(),
        name: inputTask,
        link: inputLink,
        image: imageUrl,
        category: selectedValue,
      };
      setList([...list, newBookmark]);
      toast.success("Bookmarked Added");
    }

    setInputTask("");
    setInputLink("");
  };

  const handleEdit = (id: number) => {
    const taskToEdit = list.find((item) => item.id === id);
    if (taskToEdit) {
      setInputTask(taskToEdit.name);
      setInputLink(taskToEdit.link);
      setSelectedValue(taskToEdit.category || "All");
      setEditId(id);
    }
    
  };

  const handleDelete = (id: number) => setConfirmation({ id, visible: true });
  const confirmDelete = () => {
    if (confirmation.id !== null) {
      setList(list.filter((item) => item.id !== confirmation.id));
      toast.error("Bookmarked Deleted");
    }
    setConfirmation({ id: null, visible: false });
  };
  const cancelDelete = () => setConfirmation({ id: null, visible: false });

  const handleFilter = (criteria: string) => {
    setFilter(criteria);
    setCurrentPage(1); // reset page when filter changes
  };

  const getFilteredAndSearchedItems = () => {
  return list.filter((item) => {
    const matchesCategory =
      filter === "All"
        ? true
        : (item.category ?? "").toLowerCase() === filter.toLowerCase();

    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });
};

const filteredAndSearchedItems = getFilteredAndSearchedItems();
const totalPages = Math.ceil(filteredAndSearchedItems.length / itemsPerPage);

const currentItems = filteredAndSearchedItems.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-extrabold text-cyan-600 text-center mb-8">
        🌐 My Favorite Websites
      </h1>

      {/* Form */}
      <div className="bg-white rounded-2xl p-6 mb-8">
        <div className="flex flex-col space-y-4 justify-center items-center ">
          <input
            type="text"
            placeholder="Website Name"
            value={inputTask}
            onChange={(e) => setInputTask(e.target.value)}
            className="w-80 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="Website Link"
            value={inputLink}
            onChange={(e) => setInputLink(e.target.value)}
            className="w-80 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500"
          />
          <select
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            className="w-80 px-4 py-3 border rounded-xl focus:ring-2 bg-cyan-600 focus:ring-cyan-500"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-white">
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddOrEdit}
            className="w-80 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 transition"
          >
            {editId !== null ? "Update Bookmark" : "Add Bookmark"}
          </button>
          <ToastContainer position="bottom-left" theme="dark" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Categories */}
      <Category onFilter={handleFilter} />

      {/* Cards */}
      <Card items={currentItems} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 disabled:bg-gray-300"
          >
            Prev
          </button>
          <span className="font-medium">{`${currentPage} / ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmation.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80">
            <h2 className="text-lg font-bold mb-6 text-center">
              Delete this bookmark?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
              >
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
