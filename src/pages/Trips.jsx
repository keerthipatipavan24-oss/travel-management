import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import "./Trips.css";

export default function Trips() {
  // initial trip data

  const initialTrips = [
    {
      id: 1001,
      name: "Goa Beach Escape",
      destination: "Goa",
      startDate: "2026-09-28",
      endDate: "2026-10-01",
      duration: "4 Days / 3 Nights",
      price: 12000,
      status: "Completed",
    },
    {
      id: 1002,
      name: "Kerala Backwater Tour",
      destination: "Kerala",
      startDate: "2026-10-20",
      endDate: "2026-10-24",
      duration: "5 Days / 4 Nights",
      price: 15000,
      status: "Confirmed",
    },
    {
      id: 1003,
      name: "Manali Adventure",
      destination: "Manali",
      startDate: "2026-11-05",
      endDate: "2026-11-09",
      duration: "5 Days / 4 Nights",
      price: 18000,
      status: "Pending",
    },
    {
      id: 1004,
      name: "Dubai City Tour",
      destination: "Dubai",
      startDate: "2026-11-15",
      endDate: "2026-11-19",
      duration: "5 Days / 4 Nights",
      price: 45000,
      status: "Confirmed",
    },
    {
      id: 1005,
      name: "Bali Island Escape",
      destination: "Bali",
      startDate: "2026-12-02",
      endDate: "2026-12-07",
      duration: "6 Days / 5 Nights",
      price: 35000,
      status: "Pending",
    },
    {
      id: 1006,
      name: "Singapore Explorer",
      destination: "Singapore",
      startDate: "2026-12-15",
      endDate: "2026-12-19",
      duration: "5 Days / 4 Nights",
      price: 40000,
      status: "Confirmed",
    },
  ];

  // states

  const [trips, setTrips] = useState(() => {
    const savedTrips = localStorage.getItem("trips");

    return savedTrips ? JSON.parse(savedTrips) : initialTrips;
  });

  const [selectedTrip, setSelectedTrip] = useState(null);

  const [editTrip, setEditTrip] = useState(null);

  const [deleteTrip, setDeleteTrip] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [destinationFilter, setDestinationFilter] = useState("All");

  const [sortBy, setSortBy] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({});

  const tripsPerPage = 6;

  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    duration: "",
    price: "",
    status: "Pending",
  });

  // destinations

  const destinations = [...new Set(trips.map((trip) => trip.destination))];

  // filter trips

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || trip.status === statusFilter;

    const matchesDestination =
      destinationFilter === "All" || trip.destination === destinationFilter;

    return matchesSearch && matchesStatus && matchesDestination;
  });

  // sort trips

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price;
    }

    if (sortBy === "price-high") {
      return b.price - a.price;
    }

    if (sortBy === "date-earliest") {
      return new Date(a.startDate) - new Date(b.startDate);
    }

    if (sortBy === "date-latest") {
      return new Date(b.startDate) - new Date(a.startDate);
    }

    return 0;
  });

  // pagination

  const totalPages = Math.ceil(sortedTrips.length / tripsPerPage);

  const startIndex = (currentPage - 1) * tripsPerPage;

  const currentTrips = sortedTrips.slice(startIndex, startIndex + tripsPerPage);

  // trip summary counts

  const totalTrips = trips.length;

  const confirmedTrips = trips.filter(
    (trip) => trip.status === "Confirmed",
  ).length;

  const pendingTrips = trips.filter((trip) => trip.status === "Pending").length;

  const completedTrips = trips.filter(
    (trip) => trip.status === "Completed",
  ).length;

  // reset page when search, filter or sort changes

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, destinationFilter, sortBy]);

  // loading

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // form input

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // add / edit trip

  const handleAddTrip = (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Trip name is required";
    }

    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      newErrors.endDate = "End date cannot be before start date";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // edit trip

    if (editTrip) {
      const updatedTrips = trips.map((trip) =>
        trip.id === editTrip.id
          ? {
              ...trip,
              name: formData.name,
              destination: formData.destination,
              startDate: formData.startDate,
              endDate: formData.endDate,
              duration: formData.duration,
              price: Number(formData.price),
              status: formData.status,
            }
          : trip,
      );

      setTrips(updatedTrips);

      setToast({
        message: "Trip updated successfully",
        type: "success",
      });

      setEditTrip(null);
    }

    // add new trip
    else {
      const newTrip = {
        id:
          trips.length > 0
            ? Math.max(...trips.map((trip) => trip.id)) + 1
            : 1001,

        name: formData.name,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: formData.duration,
        price: Number(formData.price),
        status: formData.status,
      };

      setTrips([...trips, newTrip]);

      setToast({
        message: "Trip added successfully",
        type: "success",
      });
    }

    // reset form

    setFormData({
      name: "",
      destination: "",
      startDate: "",
      endDate: "",
      duration: "",
      price: "",
      status: "Pending",
    });

    setErrors({});

    setShowModal(false);
  };

  // delete trip

  const handleDeleteTrip = () => {
    const updatedTrips = trips.filter((trip) => trip.id !== deleteTrip.id);

    setTrips(updatedTrips);

    setDeleteTrip(null);

    setToast({
      message: "Trip deleted successfully",
      type: "success",
    });
  };

  // local storage

  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
  }, [trips]);

  // toast

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [toast]);

  if (loading) {
    return (
      <div className="trips-page">
        <div className="trips-loading">
          <p>Loading trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trips-page">
      {/* toast */}

      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* page header */}

      <div className="trips-header">
        <div>
          <h1>Trips</h1>

          <p>Manage and organize all your trips</p>
        </div>

        <button
          className="add-trip-btn"
          onClick={() => {
            setEditTrip(null);

            setFormData({
              name: "",
              destination: "",
              startDate: "",
              endDate: "",
              duration: "",
              price: "",
              status: "Pending",
            });

            setErrors({});

            setShowModal(true);
          }}
        >
           Add Trip
        </button>
      </div>

      {/* trip summary cards */}

      <div className="trip-summary">
        <div className="trip-summary-card">
          <h3>Total Trips</h3>
          <p>{totalTrips}</p>
        </div>

        <div className="trip-summary-card">
          <h3>Confirmed</h3>
          <p>{confirmedTrips}</p>
        </div>

        <div className="trip-summary-card">
          <h3>Pending</h3>
          <p>{pendingTrips}</p>
        </div>

        <div className="trip-summary-card">
          <h3>Completed</h3>
          <p>{completedTrips}</p>
        </div>
      </div>

      {/* trips list */}

      <div className="trips-list">
        <div className="section-header">
          <h2>All Trips</h2>

          <p>Manage your travel packages and schedules</p>
        </div>

        {/* search, filter and sort */}

        <div className="trip-search">
          {/* search */}

          <input
            type="text"
            placeholder="Search trips by name or destination..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {/* status filter */}

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Status</option>

            <option value="Pending">Pending</option>

            <option value="Confirmed">Confirmed</option>

            <option value="Completed">Completed</option>
          </select>

          {/* destination filter */}

          <select
            value={destinationFilter}
            onChange={(event) => setDestinationFilter(event.target.value)}
          >
            <option value="All">All Destinations</option>

            {destinations.map((destination) => (
              <option key={destination} value={destination}>
                {destination}
              </option>
            ))}
          </select>

          {/* sort */}

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="default">Sort By</option>

            <option value="price-low">Price: Low to High</option>

            <option value="price-high">Price: High to Low</option>

            <option value="date-earliest">Start Date: Earliest</option>

            <option value="date-latest">Start Date: Latest</option>
          </select>

          {/* clear */}

          {(searchTerm ||
            statusFilter !== "All" ||
            destinationFilter !== "All" ||
            sortBy !== "default") && (
            <button
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setDestinationFilter("All");
                setSortBy("default");
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* trip cards */}

        <div className="trip-grid">
          {currentTrips.length > 0 ? (
            currentTrips.map((trip) => (
              <div className="trip-card" key={trip.id}>
                <div className="trip-content">
                  <h3>{trip.name}</h3>

                  <p>
                    <strong>Destination:</strong> {trip.destination}
                  </p>

                  <p>
                    <strong>Dates:</strong> {trip.startDate} - {trip.endDate}
                  </p>

                  <p>
                    <strong>Duration:</strong> {trip.duration}
                  </p>

                  <p>
                    <strong>Price:</strong> ₹
                    {trip.price.toLocaleString("en-IN")}
                  </p>

                  <span className={`trip-status ${trip.status.toLowerCase()}`}>
                    {trip.status}
                  </span>

                  {/* trip actions */}

                  <div className="trip-actions">
                    {/* view */}

                    <button onClick={() => setSelectedTrip(trip)}>View</button>

                    {/* edit */}

                    <button
                      onClick={() => {
                        setEditTrip(trip);

                        setFormData({
                          name: trip.name,
                          destination: trip.destination,
                          startDate: trip.startDate,
                          endDate: trip.endDate,
                          duration: trip.duration,
                          price: trip.price,
                          status: trip.status,
                        });

                        setErrors({});

                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>

                    {/* delete */}

                    <button onClick={() => setDeleteTrip(trip)}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-trips-found">No trips found.</div>
          )}
        </div>

        {/* pagination */}

        <div className="trip-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* view modal */}

      {selectedTrip && (
        <div className="trip-modal-overlay">
          <div className="trip-modal">
            <div className="trip-modal-header">
              <h2>Trip Details</h2>

              <button onClick={() => setSelectedTrip(null)}>×</button>
            </div>

            <div className="trip-view">
              <h3>{selectedTrip.name}</h3>

              <p>
                <strong>Destination:</strong> {selectedTrip.destination}
              </p>

              <p>
                <strong>Start Date:</strong> {selectedTrip.startDate}
              </p>

              <p>
                <strong>End Date:</strong> {selectedTrip.endDate}
              </p>

              <p>
                <strong>Duration:</strong> {selectedTrip.duration}
              </p>

              <p>
                <strong>Price:</strong> ₹
                {selectedTrip.price.toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Status:</strong> {selectedTrip.status}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* delete confirmation modal */}

      {deleteTrip && (
        <div className="trip-modal-overlay">
          <div className="trip-modal">
            <div className="trip-modal-header">
              <h2>Delete Trip</h2>

              <button onClick={() => setDeleteTrip(null)}>×</button>
            </div>

            <div className="trip-view">
              <p>
                Are you sure you want to delete{" "}
                <strong>{deleteTrip.name}</strong>?
              </p>
            </div>

            <div className="trip-form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setDeleteTrip(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="save-trip-btn"
                onClick={handleDeleteTrip}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* add / edit trip modal */}

      {showModal && (
        <div className="trip-modal-overlay">
          <div className="trip-modal">
            <div className="trip-modal-header">
              <h2>{editTrip ? "Edit Trip" : "Add Trip"}</h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditTrip(null);
                  setErrors({});
                }}
              >
                ×
              </button>
            </div>

            {/* trip form */}

            <form className="trip-form" onSubmit={handleAddTrip}>
              {/* trip name */}

              <div className="form-group">
                <label>Trip Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter trip name"
                />

                {errors.name && (
                  <small className="form-error">{errors.name}</small>
                )}
              </div>

              {/* destination */}

              <div className="form-group">
                <label>Destination</label>

                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="Enter destination"
                />

                {errors.destination && (
                  <small className="form-error">{errors.destination}</small>
                )}
              </div>

              {/* start date */}

              <div className="form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />

                {errors.startDate && (
                  <small className="form-error">{errors.startDate}</small>
                )}
              </div>

              {/* end date */}

              <div className="form-group">
                <label>End Date</label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />

                {errors.endDate && (
                  <small className="form-error">{errors.endDate}</small>
                )}
              </div>

              {/* duration */}

              <div className="form-group">
                <label>Duration</label>

                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Example: 5 Days / 4 Nights"
                />

                {errors.duration && (
                  <small className="form-error">{errors.duration}</small>
                )}
              </div>

              {/* price */}

              <div className="form-group">
                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="1"
                />

                {errors.price && (
                  <small className="form-error">{errors.price}</small>
                )}
              </div>

              {/* status */}

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Pending">Pending</option>

                  <option value="Confirmed">Confirmed</option>

                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* form actions */}

              <div className="trip-form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditTrip(null);
                    setErrors({});
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="save-trip-btn">
                  {editTrip ? "Save Changes" : "Add Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}