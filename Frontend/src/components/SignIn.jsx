import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      toast.success("Signed in Successfully!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error("Error during Google Sign-In!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error during Google Sign-In:', error.message);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      toast.success("Signed in Successfully!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setError('');
      let errorMessage;
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        default:
          errorMessage = 'Error during email sign-in';
          break;
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
        <img 
          src="https://moneyview.in/images/blog/wp-content/uploads/2017/10/Blog-11-reasonsfeature-min.jpg" 
          alt="img" 
          className="w-full h-40 object-cover md:h-auto md:w-1/2 hidden md:block" 
        />
        <div className="flex flex-col w-full md:w-1/2 p-6 sm:p-8">
          <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-2">Sign In</h1>
          <p className="text-center text-gray-600 mb-4">Welcome back! Please log in to continue.</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleEmailSignIn} className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3 p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="relative mb-3">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa fa-eye${showPassword ? '-slash' : ''}`} aria-hidden="true"></i>
              </span>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-lg text-base font-semibold hover:bg-blue-600 transition duration-300"
            >
              Sign In with Email
            </button>
          </form>
          <button
            onClick={handleGoogleSignIn}
            className="w-full p-3 mt-4 bg-red-500 text-white rounded-lg text-base font-semibold hover:bg-red-600 transition duration-300"
          >
            Continue with Google
          </button>
          <div className="flex flex-col items-center mt-4">
            <p className="text-center text-sm sm:text-base">Are you a new user? 
              <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/signup')}> Sign Up here</span>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
