import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';

const Eshop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'PLA Filament Black',
        price: 599,
        image: '/assets/images/no_image.png',
        category: 'Filaments',
        inStock: true,
      },
      {
        id: 2,
        name: 'PETG Filament White',
        price: 649,
        image: '/assets/images/no_image.png',
        category: 'Filaments',
        inStock: true,
      },
      {
        id: 3,
        name: '3D Printer Cleaning Kit',
        price: 399,
        image: '/assets/images/no_image.png',
        category: 'Accessories',
        inStock: false,
      },
      {
        id: 4,
        name: 'Hardened Steel Nozzle 0.4mm',
        price: 250,
        image: '/assets/images/no_image.png',
        category: 'Parts',
        inStock: true,
      },
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">E-shop</h1>
            <p className="text-muted-foreground">
              Browse our selection of 3D printing products.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              {/* Filters will go here */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Filters</h3>
                {/* Search Bar */}
                <div className="relative mb-4">
                    <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="text" placeholder="Search products..." className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-primary focus:border-primary" />
                </div>
                {/* Categories */}
                <div>
                    <h4 className="font-medium text-foreground mb-2">Category</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <label className="flex items-center space-x-2 hover:text-foreground cursor-pointer"><input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-muted-foreground focus:ring-primary" /> <span>Filaments</span></label>
                        <label className="flex items-center space-x-2 hover:text-foreground cursor-pointer"><input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-muted-foreground focus:ring-primary" /> <span>Accessories</span></label>
                        <label className="flex items-center space-x-2 hover:text-foreground cursor-pointer"><input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-muted-foreground focus:ring-primary" /> <span>Parts</span></label>
                    </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {/* Product Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-card border border-border rounded-lg">
                            <div className="w-full h-48 bg-muted rounded-t-lg"></div>
                            <div className="p-4">
                                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                        <p className="text-primary font-bold">{product.price} Kč</p>
                        <button className={`w-full mt-4 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${product.inStock ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
                {/* Pagination will go here */}
                <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground"><Icon name="ChevronLeft" size={16} /></button>
                        <button className="px-3 py-1 rounded-lg bg-primary text-primary-foreground">1</button>
                        <button className="px-3 py-1 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground">2</button>
                        <button className="px-3 py-1 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground"><Icon name="ChevronRight" size={16} /></button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eshop;
