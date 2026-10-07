import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  // page titles
  const pageTitles = {
    "/": "Dashboard",
    "/destinations": "Destinations",
    "/trips": "Trips",
    "/customers": "Customers",
    "/bookings": "Bookings",
    "/payments": "Payments",
    "/calendar": "Calendar",
    "/analytics": "Analytics",
  };

  const currentTitle =
    pageTitles[location.pathname] || "Dashboard";

  // search placeholder
  const searchPlaceholders = {
    "/": "Search dashboard...",
    "/destinations": "Search destinations...",
    "/trips": "Search trips...",
    "/customers": "Search customers...",
    "/bookings": "Search bookings...",
    "/payments": "Search payments...",
    "/calendar": "Search calendar...",
    "/analytics": "Search analytics...",
  };

  const placeholder =
    searchPlaceholders[location.pathname] ||
    "Search...";

  return (
    <header className="top-header">

      {/* page title */}
      <div className="header-title">
        <h2>{currentTitle}</h2>
      </div>


      {/* search */}
      <div className="header-search">

        <span className="search-icon">
          🔍
        </span>

        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm("")}
          >
            ×
          </button>
        )}

      </div>


      {/* profile */}
      <div className="header-profile">

        <button
          className="profile-button"
          onClick={() =>
            setShowProfile(!showProfile)
          }
        >

          <span className="profile-icon">
            👤
          </span>

          <span className="profile-name">
            Pavan
          </span>

          <span className="profile-arrow">
            {showProfile ? "▲" : "▼"}
          </span>

        </button>


        {/* profile dropdown */}
        {showProfile && (
          <div className="profile-dropdown">

            <div className="profile-info">

              <div className="profile-large-icon">
                👤
              </div>

              <div>
                <h3>Pavan</h3>
                <p>Frontend Developer</p>
              </div>

            </div>

          </div>
        )}

      </div>

    </header>
  );
} 