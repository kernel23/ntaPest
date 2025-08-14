import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useFarm } from '../hooks/useFarm';
import { useSubmissions } from '../hooks/useSubmissions';
import SubmissionCard from '../components/SubmissionCard';
import { ArrowLeft } from 'lucide-react';

const DashboardPage = () => {
  const { farmId } = useParams();
  const { user } = useAuthContext();
  const { farm, loading: farmLoading, error: farmError } = useFarm(user?.uid, farmId);
  const { submissions, loading: submissionsLoading, error: submissionsError } = useSubmissions(user?.uid, farmId);

  if (farmLoading || submissionsLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (farmError || submissionsError) {
    return <div className="p-6 text-red-500">Error: {farmError?.message || submissionsError?.message}</div>;
  }

  if (!farm) {
      return <div className="p-6">Farm not found.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white p-4 shadow-md">
        <div className="flex items-center mb-2">
          <Link to="/" className="p-2 rounded-full hover:bg-gray-100 mr-2">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div className="text-sm text-gray-500">
             <Link to="/" className="hover:underline">My Farms</Link>
             <span className="mx-2">/</span>
             <span className="font-semibold text-gray-700">{farm.farmName}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">{farm.farmName} Health Log</h2>
            <p className="text-sm text-gray-600 ml-4">Variety: {farm.tobaccoVariety}</p>
          </div>
          <div>
            <button className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md">
              New Report
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 overflow-y-auto bg-green-50">
        {submissions.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p>Submission history will appear here.</p>
          </div>
        ) : (
          submissions.map(submission => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
