import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export const useSubmissions = (userId, farmId) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !farmId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const submissionsCollection = collection(db, 'users', userId, 'farmLots', farmId, 'submissions');
    const q = query(submissionsCollection, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const submissionsData = [];
      querySnapshot.forEach((doc) => {
        submissionsData.push({ id: doc.id, ...doc.data() });
      });
      setSubmissions(submissionsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching submissions:", err);
      setError(err);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userId, farmId]);

  return { submissions, loading, error };
};
