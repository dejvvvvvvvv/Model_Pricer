import React from 'react';

const LoadingSkeleton = ({ viewMode = 'grid' }) => {
  const skeletonCount = 12;

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
            <div className="flex gap-6">
              {/* Image Skeleton */}
              <div className="w-48 h-32 bg-muted rounded-lg flex-shrink-0" />
              
              {/* Content Skeleton */}
              <div className="flex-1 space-y-4">
                {/* Header */}
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
                
                {/* Specs Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }, (_, j) => (
                    <div key={j} className="space-y-1">
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  ))}
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded-full w-20" />
                    <div className="h-6 bg-muted rounded-full w-16" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-muted rounded w-16" />
                    <div className="h-8 bg-muted rounded w-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: skeletonCount }, (_, i) => (
        <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="h-48 bg-muted" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
            
            {/* Specs */}
            <div className="space-y-2">
              {Array.from({ length: 3 }, (_, j) => (
                <div key={j} className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </div>
              ))}
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, k) => (
                  <div key={k} className="w-4 h-4 bg-muted rounded" />
                ))}
              </div>
              <div className="h-4 bg-muted rounded w-12" />
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-6 bg-muted rounded w-16" />
                <div className="h-3 bg-muted rounded w-12" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-muted rounded" />
                <div className="h-8 bg-muted rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;