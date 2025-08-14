import React from 'react';

const SubmissionCard = ({ submission }) => {
  const submissionDate = submission.timestamp?.toDate ? submission.timestamp.toDate() : new Date();
  const dateString = submissionDate.toLocaleDateString();
  const timeString = submissionDate.toLocaleTimeString();

  const thumbnailUrl = (submission.imageDownloadUrls && submission.imageDownloadUrls.length > 0)
    ? submission.imageDownloadUrls[0]
    : 'https://placehold.co/96x96/e2e8f0/334155?text=No+Image';

  return (
    <div className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex">
          <img src={thumbnailUrl} className="w-24 h-24 rounded-md mr-4 object-cover" alt="Submission thumbnail" />
          <div>
            <p className="font-bold">Report from {dateString} at {timeString}</p>
            <p className="text-sm"><strong>Symptoms:</strong> {submission.symptoms.join(', ')}</p>
            <p className="text-sm"><strong>Distribution:</strong> {submission.distribution}</p>
            <p className="text-sm"><strong>Severity:</strong> {submission.severity}</p>
          </div>
        </div>
        <div>
          {/* Edit button can be added later */}
          {/* <button className="bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded">Edit</button> */}
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;
