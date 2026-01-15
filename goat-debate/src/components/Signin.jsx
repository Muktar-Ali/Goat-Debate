import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";

export default function Signin() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <h1 className="text-4xl font-bold text-center pt-20">
        Sign In to GOAT Debate
      </h1>
      <span className="block text-center text-gray-400">
        Join to cast your vote!
      </span>
      <div className="flex justify-center mt-12">
        <form className="bg-slate-900/70 backdrop-blur-md p-8 rounded-lg w-full max-w-md space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              type="text" required
              id="username"
              className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
           <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password" required
              id="password"
              className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email" required
              id="email"
              className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
         
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition-colors duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
