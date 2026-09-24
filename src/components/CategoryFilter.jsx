import React from 'react';

const CATEGORIES = ['All', 'Clothing', 'Electronics', 'Footwear', 'Books'];

export default function CategoryFilter({ activeCategory = 'All', onSelectCategory }) {
  return (
    <div className="category-filter-group d-flex flex-wrap gap-2 align-items-center">
      {CATEGORIES.map(category => {
        const isActive = activeCategory.toLowerCase() === category.toLowerCase();
        return (
          <button
            key={category}
            type="button"
            className={`cat-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
