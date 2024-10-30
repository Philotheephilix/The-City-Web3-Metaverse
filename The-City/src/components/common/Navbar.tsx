import React ,{ useState, useEffect }from 'react';
import { Link ,useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const storedData = localStorage.getItem('anonAadhaar');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.status === 'logged-in') {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };
  useEffect(() => {
    checkLoginStatus();window.addEventListener('storage', checkLoginStatus);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    // Remove the login data from local storage
    localStorage.removeItem('anonAadhaar');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home or any other page after logout
  };
  return (
  
    <nav className="bg-[#D7C5A8] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/" className="hover:text-gray-200">De-Code</Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link to="/pages/Courses" className="hover:text-gray-200">Courses</Link>
          <Link to="/pages/Events" className="hover:text-gray-200">Events</Link>
          <Link to="/pages/Hackathons" className="hover:text-gray-200">Hackathons</Link>
          <Link to="/pages/Leaderboard" className="hover:text-gray-200">Leaderboard</Link>
          <Link to="/pages/Profile" className="hover:text-gray-200">Profile</Link>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hover:text-gray-200"
              style={{
                backgroundColor: "white",
                color: "#5B5B5B",
                padding: "0% 2%",
                borderRadius: "80px"
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/pages/Login"
              className="hover:text-gray-200"
              style={{
                backgroundColor: "white",
                color: "#5B5B5B",
                padding: "0% 2%",
                borderRadius: "80px"
              }}
            >
              Login
            </Link>
          )}        
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
