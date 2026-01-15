import Navbar from "./components/Navbar.jsx";
import Player from "./components/Player.jsx";
import Signup from "./components/Signup.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <h1 className="text-4xl font-bold text-center pt-20">
        Welcome to GOAT Debate
      </h1>
      <span className="block text-center text-gray-400">
        The Place To Finally End the Discussion
      </span>
      <Navbar />

      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mt-12 gap-8">
        <div className="w-[35%] h-[60vh] bg-slate-950 rounded-md overflow-hidden flex flex-col">
          <div className="flex-1 flex items-center justify-center p-6">
            <Player
              name="Lebron James"
              imageSrc="lebron.jpg"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="w-[35%] h-[60vh] bg-slate-950 rounded-md overflow-hidden flex flex-col">
          <div className="flex-1 flex items-center justify-center p-6">
            <Player
              name="Michael Jordan"
              imageSrc="jordan.jpg"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => navigate("/signup")}
          className="px-10 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-slate-800 to-black-500 text-white
          hover:from-slate-700 hover:to-black-400 transition-colors duration-300"
        >
          End the Debate!
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
