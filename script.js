import React, { useState, useRef } from "react";
import { Music, Home, Search, ListMusic, Upload, LogOut } from "lucide-react";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const audioRef = useRef(null);

  // Dummy login credentials
  const adminUser = { username: "admin", password: "1234" };

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === adminUser.username && password === adminUser.password) {
      setIsAdmin(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newSong = { name: file.name, url };
      setSongs([...songs, newSong]);
      setCurrentSong(newSong);
    }
  };

  const playSong = (song) => {
    setCurrentSong(song);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 shadow">
        <h1 className="text-xl font-bold">🎶 Mayur Player</h1>
        <div className="flex space-x-6">
          <button className="flex items-center space-x-1 hover:text-blue-600">
            <Home size={18} /> <span>Home</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-600">
            <Search size={18} /> <span>Search</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-600">
            <ListMusic size={18} /> <span>All Songs</span>
          </button>
        </div>
        <Music className="w-6 h-6 text-blue-600" />
      </nav>

      {/* Admin Panel Section */}
      {!isAdmin ? (
        <div className="p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full border rounded p-2"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border rounded p-2"
            />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Upload Section */}
          <div className="p-4 flex justify-between items-center">
            <label className="cursor-pointer flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
              <Upload size={18} /> <span>Upload Song</span>
              <input type="file" accept="audio/*" hidden onChange={handleFileUpload} />
            </label>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            >
              <LogOut size={18} /> <span>Logout</span>
            </button>
          </div>

          {/* Songs List */}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">All Songs</h2>
            {songs.length === 0 ? (
              <p className="text-gray-500">No songs uploaded yet.</p>
            ) : (
              <ul className="space-y-2">
                {songs.map((song, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded hover:bg-gray-200 cursor-pointer"
                    onClick={() => playSong(song)}
                  >
                    {song.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* Audio Player */}
      {currentSong && (
        <div className="fixed bottom-0 w-full bg-gray-900 text-white p-4 flex justify-between items-center">
          <p className="truncate">{currentSong.name}</p>
          <audio ref={audioRef} controls autoPlay className="w-1/2">
            <source src={currentSong.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}