import React from 'react'

interface CategoryFilterProps {
  categories: Record<string, string>
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="category-filter">
      {Object.entries(categories).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onSelectCategory(key)}
          className={`category-filter__pill ${selectedCategory === key ? 'category-filter__pill--active' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
