import React from "react";

interface CategoryProps {
  onFilter: (criteria: string) => void;
}

const Category: React.FC<CategoryProps> = ({ onFilter }) => {
  const categories = ["All", "Movies", "Tv Shows", "Coding"];

  const handleClick = (criteria: string) => {
    onFilter(criteria); // parent filter function
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center px-6 py-4">
      {categories.map((cat) => (
        <button
          key={cat}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
          onClick={() => handleClick(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default Category;
