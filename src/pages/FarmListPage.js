import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useFarms } from '../hooks/useFarms';
import FarmCard from '../components/FarmCard';
import { Plus } from 'lucide-react';

const FarmListPage = () => {
  const { user } = useAuthContext();
  const { farms, loading, error } = useFarms(user?.uid);

  const handleAddFarm = () => {
    // Logic to navigate to an "add farm" page will go here
    console.log('Add farm clicked');
  };

  return (
    <div className="flex flex-col h-full bg-green-50 text-gray-800">
      <header className="bg-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">My Farm Plots</h2>
            <p className="text-sm text-gray-600">Welcome, {user?.displayName || 'Farmer'}</p>
          </div>
          {/* Connection status can be a future enhancement */}
        </div>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        {loading && <p>Loading farms...</p>}
        {error && <p className="text-red-500">Error loading farms: {error.message}</p>}
        {!loading && !error && farms.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p>No farm plots found.</p>
            <p>Add your first plot to start monitoring.</p>
          </div>
        )}
        {!loading && !error && farms.map((farm) => (
          <FarmCard key={farm.id} farm={farm} />
        ))}
      </main>
      <button
        onClick={handleAddFarm}
        className="absolute bottom-6 right-6 bg-green-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

export default FarmListPage;
