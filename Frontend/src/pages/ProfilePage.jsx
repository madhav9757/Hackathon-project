import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed
import { getUserProfile } from '../app/api/auth'; // To potentially refresh/get full profile

const ProfilePage = () => {
  // Get the user object from AuthContext
  const { user, loading: authLoading } = useAuth();
  
  // State to hold potentially more detailed profile data if needed,
  // or just use the user from context
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      // If authLoading is true, AuthContext is still trying to load user, so wait.
      if (authLoading) return;

      // If user is null after authLoading is false, it means no user is logged in
      // (though ProtectedRoute should ideally handle this before this component renders)
      if (!user) {
        setLoading(false);
        setError("You are not logged in.");
        return;
      }

      // If user data from context is available, use it initially.
      // Then, you can optionally fetch the full profile if AuthContext's `user`
      // doesn't contain `coordinates`, `trustCertificate`, `points` (as per our last discussion
      // where we removed them from login/register responses).
      // If you are confident AuthContext `user` state always has full data (e.g., from getUserProfile on load),
      // you might not need this second fetch.
      setProfileData(user); // Use data from context initially

      try {
        setLoading(true);
        const fullProfile = await getUserProfile(); // Fetch the full profile from backend
        setProfileData(fullProfile); // Update with full profile data
      } catch (err) {
        console.error("Failed to fetch full user profile:", err);
        setError(err.response?.data?.message || "Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]); // Re-run when user or authLoading state changes

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-indigo-700">Loading user profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <p className="text-xl text-red-700">{error}</p>
      </div>
    );
  }

  // If no profileData (e.g., user logged out after initial load)
  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">No profile data available. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden md:flex">
        {/* Profile Header */}
        <div className="md:flex-shrink-0 p-6 md:w-1/3 bg-indigo-600 text-white flex flex-col justify-center items-center">
          <div className="rounded-full h-24 w-24 bg-white flex items-center justify-center text-indigo-600 text-5xl font-bold mb-4">
            {profileData.name ? profileData.name[0].toUpperCase() : '?'}
          </div>
          <h1 className="text-3xl font-bold mb-1">{profileData.name}</h1>
          <p className="text-indigo-200">{profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}</p>
          <p className="text-indigo-200 text-sm mt-2">Points: {profileData.points}</p>
        </div>

        {/* Profile Details */}
        <div className="p-8 md:flex-grow md:w-2/3">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">User Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700">
            <div>
              <p className="font-medium text-gray-600">Email:</p>
              <p className="text-lg break-words">{profileData.email}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Phone:</p>
              <p className="text-lg">{profileData.phone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium text-gray-600">Address:</p>
              <p className="text-lg">{profileData.address}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Coordinates:</p>
              <p className="text-lg">
                {profileData.coordinates && Array.isArray(profileData.coordinates) && profileData.coordinates.length === 2
                  ? `Lat: ${profileData.coordinates[0]}, Lng: ${profileData.coordinates[1]}`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Trust Certificates:</p>
              <p className="text-lg">
                {profileData.trustCertificate && profileData.trustCertificate.length > 0
                  ? profileData.trustCertificate.join(', ')
                  : 'None'}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => alert("Edit Profile functionality coming soon!")} // Placeholder
            >
              Edit Profile
            </button>
            {/* You might add other buttons here like "Change Password" */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;