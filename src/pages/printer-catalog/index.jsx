import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase'; // Import Firestore instance
import FilterPanel from './components/FilterPanel';
import SortControls from './components/SortControls';
import PrinterCard from './components/PrinterCard';
import PrinterModal from './components/PrinterModal';
import LoadingSkeleton from './components/LoadingSkeleton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PrinterCatalog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [printers, setPrinters] = useState([]);
  const [filteredPrinters, setFilteredPrinters] = useState([]);
  const [filters, setFilters] = useState({
    materials: [],
    priceMin: '',
    priceMax: '',
    quality: [],
    location: [],
    multicolor: false,
    expressAvailable: false,
    availableNow: false
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch printers from Firestore
  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "printers"));
        const printersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrinters(printersData);
        setFilteredPrinters(printersData);
      } catch (error) {
        console.error("Error fetching printers: ", error);
        // You might want to set an error state here
      } finally {
        setLoading(false);
      }
    };

    fetchPrinters();
  }, []);

  // Apply filters and sorting (front-end filtering for now)
   useEffect(() => {
    let filtered = [...printers];

    // Apply filters
    if (filters?.materials?.length > 0) {
      filtered = filtered?.filter(printer => 
        filters?.materials?.some(material => printer?.materials?.includes(material))
      );
    }

    if (filters?.priceMin) {
      filtered = filtered?.filter(printer => printer?.pricePerHour >= parseInt(filters?.priceMin));
    }

    if (filters?.priceMax) {
      filtered = filtered?.filter(printer => printer?.pricePerHour <= parseInt(filters?.priceMax));
    }

    if (filters?.quality?.length > 0) {
      filtered = filtered?.filter(printer => {
        const rating = Math.floor(printer?.rating);
        return filters?.quality?.some(q => rating >= parseInt(q));
      });
    }

    if (filters?.location?.length > 0) {
      filtered = filtered?.filter(printer => 
        filters?.location?.some(loc => printer?.location?.toLowerCase().includes(loc))
      );
    }

    if (filters?.multicolor) {
      filtered = filtered?.filter(printer => printer?.features?.multicolor);
    }

    if (filters?.expressAvailable) {
      filtered = filtered?.filter(printer => printer?.features?.express);
    }

    if (filters?.availableNow) {
      filtered = filtered?.filter(printer => printer?.availability === 'available');
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'price': aValue = a.pricePerHour; bValue = b.pricePerHour; break;
        case 'rating': aValue = a.rating; bValue = b.rating; break;
        default: aValue = (a.rating || 0) * (a.reviewCount || 0); bValue = (b.rating || 0) * (b.reviewCount || 0); break; // Relevance
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredPrinters(filtered);
  }, [printers, filters, sortBy, sortOrder]);


  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handlePrinterSelect = (printer) => {
    navigate('/model-upload', { state: { selectedPrinter: printer } });
  };

  const handleViewDetails = (printer) => {
    setSelectedPrinter(printer);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPrinter(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
             <h1 className="text-3xl font-bold text-foreground mb-2">Katalog 3D tiskáren</h1>
            <p className="text-muted-foreground">
              Najděte perfektní tiskárnu pro váš projekt. Filtrujte podle materiálu, velikosti a dalších parametrů.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FilterPanel filters={filters} onFiltersChange={handleFiltersChange} resultCount={filteredPrinters.length} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
                <FilterPanel filters={filters} onFiltersChange={handleFiltersChange} isOpen={isFilterOpen} onToggle={() => setIsFilterOpen(!isFilterOpen)} resultCount={filteredPrinters.length} isMobile />
                <SortControls sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} viewMode={viewMode} onViewModeChange={setViewMode} />

              {loading ? (
                <LoadingSkeleton viewMode={viewMode} />
              ) : filteredPrinters.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Search" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Žádné tiskárny nenalezeny</h3>
                  <p className="text-muted-foreground mb-6">
                    Zkuste upravit filtry. V databázi zatím nemusí být žádná data.
                  </p>
                  <Button variant="outline" onClick={() => setFilters({ materials: [], priceMin: '', priceMax: '', quality: [], location: [], multicolor: false, expressAvailable: false, availableNow: false })}>
                    Vymazat filtry
                  </Button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                  {filteredPrinters.map(printer => (
                    <PrinterCard key={printer.id} printer={printer} viewMode={viewMode} onSelect={handlePrinterSelect} onViewDetails={handleViewDetails} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <PrinterModal printer={selectedPrinter} isOpen={isModalOpen} onClose={handleModalClose} onSelect={handlePrinterSelect} />
    </div>
  );
};

export default PrinterCatalog;
