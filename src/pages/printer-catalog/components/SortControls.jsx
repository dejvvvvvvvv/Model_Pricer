import React from 'react';
import Icon from '../../../components/AppIcon';

const SortControls = ({ sortBy, sortOrder, onSortChange, viewMode, onViewModeChange }) => {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price', label: 'Cena' },
    { value: 'rating', label: 'Hodnocení' },
    { value: 'availability', label: 'Dostupnost' },
    { value: 'distance', label: 'Vzdálenost' }
  ];

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      // Toggle order if same sort field
      onSortChange(newSortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to desc for new sort field
      onSortChange(newSortBy, 'desc');
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Sort Options */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground hidden sm:block">Řadit podle:</span>
        <div className="flex items-center gap-1">
          {sortOptions?.map(option => (
            <button
              key={option?.value}
              onClick={() => handleSortChange(option?.value)}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-micro
                ${sortBy === option?.value 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              {option?.label}
              {sortBy === option?.value && (
                <Icon 
                  name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
                  size={14} 
                />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`
            p-2 rounded-md transition-micro
            ${viewMode === 'grid' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }
          `}
          title="Mřížka"
        >
          <Icon name="Grid3X3" size={16} />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`
            p-2 rounded-md transition-micro
            ${viewMode === 'list' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }
          `}
          title="Seznam"
        >
          <Icon name="List" size={16} />
        </button>
      </div>
    </div>
  );
};

export default SortControls;