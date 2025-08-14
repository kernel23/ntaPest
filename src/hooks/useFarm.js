import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const useFarm = (userId, farmId) => {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !farmId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const farmDocRef = doc(db, 'users', userId, 'farmLots', farmId);

    const unsubscribe = onSnapshot(farmDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setFarm({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError(new Error("Farm not found"));
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching farm:", err);
      setError(err);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userId, farmId]);

  return { farm, loading, error };
};
