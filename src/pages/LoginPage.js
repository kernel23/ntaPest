import React from 'react';
import { Leaf } from 'lucide-react';

const LoginPage = () => {
  const handleGoogleSignIn = () => {
    console.log('Google Sign In Clicked');
    // Firebase Google Sign-in logic will go here
  };

  const handleFacebookSignIn = () => {
    console.log('Facebook Sign In Clicked');
    // Firebase Facebook Sign-in logic will go here
  };

  const handleGuestSignIn = () => {
    console.log('Guest Sign In Clicked');
    // Firebase Guest Sign-in logic will go here
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-green-50 text-gray-800">
      <div className="text-center mb-10">
        <Leaf className="w-16 h-16 text-green-600 mx-auto" />
        <h1 className="text-4xl font-bold text-green-900 mt-4">Agri-Guard</h1>
        <p className="text-lg text-green-700">Tobacco Pest Monitoring</p>
        <p className="text-sm text-gray-500 mt-1">Ilocos Region, Philippines</p>
      </div>

      <div id="offline-message-container" className="w-full max-w-sm text-center mb-4"></div>

      <div className="w-full max-w-sm">
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm flex items-center justify-center mb-3 hover:bg-gray-50 transition-colors"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="mr-3 h-6 w-6" />
          Sign in with Google
        </button>
        <button
          onClick={handleFacebookSignIn}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-sm flex items-center justify-center mb-4 hover:bg-blue-700 transition-colors"
        >
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
          Sign in with Facebook
        </button>
        <button
          onClick={handleGuestSignIn}
          className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
        >
          Continue as Guest
        </button>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        By signing in, you agree to our{' '}
        <a href="#" className="underline hover:text-green-700">
          Privacy Policy
        </a>
        . All personal data is encrypted in transit.
      </div>
    </div>
  );
};

export default LoginPage;
