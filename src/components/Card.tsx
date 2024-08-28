import React from 'react';

interface Bookmark {
  id: number;
  name: string;
  link: string;
  image?: string;
}

interface CardProps {
  items: Bookmark[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const Card: React.FC<CardProps> = ({ items, onEdit, onDelete }) => {
  return (
    <div className="mt-4 flex justify-center alignitems-center">
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl w-full">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-neutral-800 shadow-lg rounded-lg overflow-hidden flex flex-col"
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4 flex flex-col flex-grow">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:underline"
            >
              {item.name}
            </a>
            <div className="flex space-x-4 mt-2">
              <button
                onClick={() => onEdit(item.id)}
                className="text-sm bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
    
  );
};

export default Card;
