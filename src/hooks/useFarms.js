import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase';

export const useFarms = (userId) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const farmLotsCollection = collection(db, 'users', userId, 'farmLots');
    const q = query(farmLotsCollection);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const farmsData = [];
      querySnapshot.forEach((doc) => {
        farmsData.push({ id: doc.id, ...doc.data() });
      });
      setFarms(farmsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching farms:", err);
      setError(err);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userId]);

  return { farms, loading, error };
};
