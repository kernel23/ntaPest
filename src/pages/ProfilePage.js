import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useAddress } from '../hooks/useAddress';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const ProfilePage = () => {
  const { user } = useAuthContext();
  const { provinces, loading: addressLoading } = useAddress();

  const [profileData, setProfileData] = useState({
    fullName: '',
    province: '',
    municipality: '',
    barangay: '',
    birthdate: '',
    civilStatus: 'Single',
    religion: '',
    yearsFarming: '',
    familyMembers: '',
    education: 'No formal education',
    isFarmer: false,
    rsbsaNumber: '',
    role: 'Farmer',
  });
  const [loading, setLoading] = useState(true);
  const [municipalities, setMunicipalities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setLoading(true);
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setProfileData(prev => ({ ...prev, ...docSnap.data() }));
        } else {
          setProfileData(prev => ({ ...prev, fullName: user.displayName || '', email: user.email || '' }));
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profileData.province && provinces.length > 0) {
      const selectedProvince = provinces.find(p => p.name === profileData.province);
      setMunicipalities(selectedProvince?.municipalities || []);
      if(profileData.municipality){
          const selectedMunicipality = selectedProvince?.municipalities.find(m => m.name === profileData.municipality);
          setBarangays(selectedMunicipality?.barangays || []);
      }
    }
  }, [profileData.province, profileData.municipality, provinces]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProvinceChange = (e) => {
    const { value } = e.target;
    setProfileData(prev => ({ ...prev, province: value, municipality: '', barangay: '' }));
    const selectedProvince = provinces.find(p => p.name === value);
    setMunicipalities(selectedProvince?.municipalities || []);
    setBarangays([]);
  };

  const handleMunicipalityChange = (e) => {
    const { value } = e.target;
    setProfileData(prev => ({ ...prev, municipality: value, barangay: '' }));
    const selectedMunicipality = municipalities.find(m => m.name === value);
    setBarangays(selectedMunicipality?.barangays || []);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in.");
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        ...profileData,
        yearsFarming: Number(profileData.yearsFarming) || 0,
        familyMembers: Number(profileData.familyMembers) || 0,
        updatedAt: serverTimestamp(),
        createdAt: profileData.createdAt || serverTimestamp(),
      }, { merge: true });
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || addressLoading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6 bg-green-50">
      <form onSubmit={handleSaveProfile} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="fullName" value={profileData.fullName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"/>
          </div>

          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700">Province</label>
            <select id="province" value={profileData.province} onChange={handleProvinceChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
              <option value="">{addressLoading ? 'Loading...' : 'Select Province'}</option>
              {provinces.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">Municipality</label>
            <select id="municipality" value={profileData.municipality} onChange={handleMunicipalityChange} disabled={!profileData.province} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
              <option value="">Select Municipality</option>
              {municipalities.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="barangay" className="block text-sm font-medium text-gray-700">Barangay</label>
            <select id="barangay" value={profileData.barangay} onChange={handleChange} disabled={!profileData.municipality} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
              <option value="">Select Barangay</option>
              {barangays.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">Birthdate</label>
            <input type="date" id="birthdate" value={profileData.birthdate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"/>
          </div>

          <div>
            <label htmlFor="civilStatus" className="block text-sm font-medium text-gray-700">Civil Status</label>
            <select id="civilStatus" value={profileData.civilStatus} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
              <option>Single</option>
              <option>Married</option>
              <option>Widowed</option>
              <option>Divorced</option>
            </select>
          </div>

          <div>
            <label htmlFor="religion" className="block text-sm font-medium text-gray-700">Religion</label>
            <input type="text" id="religion" value={profileData.religion} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"/>
          </div>

          <div>
            <label htmlFor="yearsFarming" className="block text-sm font-medium text-gray-700">Years in Tobacco Farming</label>
            <input type="number" id="yearsFarming" value={profileData.yearsFarming} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"/>
          </div>

          <div>
            <label htmlFor="familyMembers" className="block text-sm font-medium text-gray-700">Number of Family Members</label>
            <input type="number" id="familyMembers" value={profileData.familyMembers} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"/>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="education" className="block text-sm font-medium text-gray-700">Highest Educational Attainment</label>
            <select id="education" value={profileData.education} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
              <option>No formal education</option>
              <option>Elementary</option>
              <option>High School</option>
              <option>Vocational</option>
              <option>College</option>
              <option>Post-graduate</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="isFarmer" className="flex items-center">
              <input type="checkbox" id="isFarmer" checked={profileData.isFarmer} onChange={handleChange} className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"/>
              <span className="ml-2 text-sm font-medium text-gray-700">I am a farmer</span>
            </label>
          </div>

          {profileData.isFarmer && (
            <div className="md:col-span-2">
              <label htmlFor="rsbsaNumber" className="block text-sm font-medium text-gray-700">RSBSA Number (Optional)</label>
              <input type="text" id="rsbsaNumber" value={profileData.rsbsaNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"/>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
