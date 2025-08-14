import React from 'react';
import { Link } from 'react-router-dom';

const FarmCard = ({ farm }) => {
  const plantingDate = farm.plantingDate ? new Date(farm.plantingDate).toLocaleDateString() : 'N/A';

  return (
    <Link to={`/farm/${farm.id}`} className="block">
      <div className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
        <p className="text-xl font-bold text-gray-800">{farm.farmName}</p>
        <p className="text-md text-gray-600">Variety: {farm.tobaccoVariety || 'N/A'}</p>
        <p className="text-sm text-gray-500">Planted on: {plantingDate}</p>
      </div>
    </Link>
  );
};

export default FarmCard;
