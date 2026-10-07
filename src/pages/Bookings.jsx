import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import "./Bookings.css";

const initialBookings = [
  {
    id: 1001,
    customer: "Rahul Sharma",
    destination: "Goa",
    bookingDate: "2026-09-10",
    price: 12000,
    status: "Completed",
    paymentStatus: "Paid",
  },
  {
    id: 1002,
    customer: "Priya Reddy",
    destination: "Kerala",
    bookingDate: "2026-09-15",
    price: 15000,
    status: "Completed",
    paymentStatus: "Paid",
  },
  {
    id: 1003,
    customer: "Arjun Kumar",
    destination: "Manali",
    bookingDate: "2026-09-25",
    price: 18000,
    status: "Confirmed",
    paymentStatus: "Paid",
  },
  {
    id: 1004,
    customer: "Sneha Patel",
    destination: "Dubai",
    bookingDate: "2026-09-28",
    price: 45000,
    status: "Confirmed",
    paymentStatus: "Paid",
  },
  {
    id: 1005,
    customer: "Kiran Reddy",
    destination: "Bali",
    bookingDate: "2026-10-01",
    price: 35000,
    status: "Pending",
    paymentStatus: "Pending",
  },
  {
    id: 1006,
    customer: "Anjali Rao",
    destination: "Singapore",
    bookingDate: "2026-10-02",
    price: 40000,
    status: "Confirmed",
    paymentStatus: "Paid",
  },
  {
    id: 1007,
    customer: "Vikram Singh",
    destination: "Goa",
    bookingDate: "2026-10-03",
    price: 12000,
    status: "Cancelled",
    paymentStatus: "Refunded",
  },
  {
    id: 1008,
    customer: "Neha Verma",
    destination: "Kerala",
    bookingDate: "2026-10-04",
    price: 15000,
    status: "Confirmed",
    paymentStatus: "Paid",
  },
  {
    id: 1009,
    customer: "Suresh Kumar",
    destination: "Manali",
    bookingDate: "2026-10-05",
    price: 18000,
    status: "Pending",
    paymentStatus: "Pending",
  },
  {
    id: 1010,
    customer: "Meera Nair",
    destination: "Dubai",
    bookingDate: "2026-10-06",
    price: 45000,
    status: "Confirmed",
    paymentStatus: "Paid",
  },
];

export default function Bookings() {
  /* bookings state */

  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem("bookings");

    return savedBookings ? JSON.parse(savedBookings) : initialBookings;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  /* search, filter & sort */

  const [searchTerm, setSearchTerm] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);

  const bookingsPerPage = 6;

  /* modal states */

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [deleteBooking, setDeleteBooking] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  /* toast */

  const [toast, setToast] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /* form data */

  const [formData, setFormData] = useState({
    customer: "",
    destination: "",
    startDate: "",
    endDate: "",
    price: "",
    status: "Pending",
    paymentStatus: "Pending",
  });

  /* search, filter */

  const filteredBookings = bookings.filter((booking) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      booking.customer.toLowerCase().includes(search) ||
      booking.destination.toLowerCase().includes(search) ||
      booking.id.toString().includes(search);

    const matchesDestination =
      destinationFilter === "All" || booking.destination === destinationFilter;

    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;

    const matchesPayment =
      paymentFilter === "All" || booking.paymentStatus === paymentFilter;

    const matchesDate =
      dateFilter === "" ||
      (booking.startDate <= dateFilter && booking.endDate >= dateFilter);

    const matchesPrice =
      priceFilter === "All" ||
      (priceFilter === "low" && booking.price < 15000) ||
      (priceFilter === "medium" &&
        booking.price >= 15000 &&
        booking.price <= 30000) ||
      (priceFilter === "high" && booking.price > 30000);

    return (
      matchesSearch &&
      matchesDestination &&
      matchesStatus &&
      matchesPayment &&
      matchesDate &&
      matchesPrice
    );
  });

  /* sort */

  const sortedBookings = [...filteredBookings].sort((a, b) => {
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

  /* pagination */

  const totalPages = Math.ceil(sortedBookings.length / bookingsPerPage);

  const startIndex = (currentPage - 1) * bookingsPerPage;

  const currentBookings = sortedBookings.slice(
    startIndex,
    startIndex + bookingsPerPage,
  );

  /* reset page when search filter sort changes */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    destinationFilter,
    statusFilter,
    paymentFilter,
    priceFilter,
    dateFilter,
    sortBy,
  ]);

  /* claer search / filters */

  const handleClearFilters = () => {
    setSearchTerm("");
    setDestinationFilter("All");
    setStatusFilter("All");
    setPaymentFilter("All");
    setPriceFilter("All");
    setDateFilter("");
    setSortBy("default");
  };

  /* add booking */

  const handleAddBooking = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.customer.trim()) {
      newErrors.customer = "Customer is required";
    }

    if (!formData.destination) {
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

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.status) {
      newErrors.status = "Booking status is required";
    }

    if (!formData.paymentStatus) {
      newErrors.paymentStatus = "Payment status is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newBooking = {
      id:
        bookings.length > 0
          ? Math.max(...bookings.map((booking) => booking.id)) + 1
          : 1001,

      ...formData,

      price: Number(formData.price),
    };

    setBookings([...bookings, newBooking]);

    setToast({
      message: "Booking added successfully",
      type: "success",
    });

    setFormData({
      customer: "",
      destination: "",
      startDate: "",
      endDate: "",
      price: "",
      status: "Pending",
      paymentStatus: "Pending",
    });

    setErrors({});

    setShowAddModal(false);
  };

  /* edit booking */

  const handleEditBooking = (booking) => {
    setEditBooking(booking);

    setFormData({
      customer: booking.customer,
      destination: booking.destination,
      startDate: booking.startDate,
      endDate: booking.endDate,
      price: booking.price,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });

    setErrors({});
  };

  /* save edit */

  const handleSaveEdit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.customer.trim()) {
      newErrors.customer = "Customer is required";
    }

    if (!formData.destination) {
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

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.status) {
      newErrors.status = "Booking status is required";
    }

    if (!formData.paymentStatus) {
      newErrors.paymentStatus = "Payment status is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedBookings = bookings.map((booking) =>
      booking.id === editBooking.id
        ? {
            ...booking,
            ...formData,
            price: Number(formData.price),
          }
        : booking,
    );

    setBookings(updatedBookings);

    setToast({
      message: "Booking updated successfully",
      type: "success",
    });

    setEditBooking(null);

    setFormData({
      customer: "",
      destination: "",
      startDate: "",
      endDate: "",
      price: "",
      status: "Pending",
      paymentStatus: "Pending",
    });

    setErrors({});
  };

  /* delete booking */

  const handleDeleteBooking = () => {
    const updatedBookings = bookings.filter(
      (booking) => booking.id !== deleteBooking.id,
    );

    setBookings(updatedBookings);

    setToast({
      message: "Booking deleted successfully",
      type: "success",
    });

    setDeleteBooking(null);
  };

  /* pending amount */

  const pendingAmount = bookings
    .filter((booking) => booking.paymentStatus === "Pending")
    .reduce((total, booking) => total + booking.price, 0);

  if (loading) {
    return (
      <main className="bookings-page">
        <div className="bookings-loading">
          <p>Loading bookings...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bookings-page">
      {/* page header */}

      <section className="bookings-header">
        <div>
          <h1>Bookings</h1>
          <p>Manage all travel bookings</p>
        </div>

        <button
          className="add-booking-btn"
          onClick={() => {
            setErrors({});
            setFormData({
              customer: "",
              destination: "",
              startDate: "",
              endDate: "",
              price: "",
              status: "Pending",
              paymentStatus: "Pending",
            });
            setShowAddModal(true);
          }}
        >
          Add Booking
        </button>
      </section>

      {/* summary cards */}

      <section className="booking-summary">
        <div className="booking-summary-card">
          <span>🎫</span>

          <div>
            <p>Total Bookings</p>
            <h2>{bookings.length}</h2>
          </div>
        </div>

        <div className="booking-summary-card">
          <span>✅</span>

          <div>
            <p>Confirmed</p>

            <h2>
              {
                bookings.filter((booking) => booking.status === "Confirmed")
                  .length
              }
            </h2>
          </div>
        </div>

        <div className="booking-summary-card">
          <span>⏳</span>

          <div>
            <p>Pending</p>

            <h2>
              {
                bookings.filter((booking) => booking.status === "Pending")
                  .length
              }
            </h2>
          </div>
        </div>

        <div className="booking-summary-card">
          <span>💰</span>

          <div>
            <p>Total Revenue</p>

            <h2>
              ₹
              {bookings
                .reduce((total, booking) => total + booking.price, 0)
                .toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        <div className="booking-summary-card">
          <span>💳</span>

          <div>
            <p>Pending Amount</p>

            <h2>₹{pendingAmount.toLocaleString("en-IN")}</h2>
          </div>
        </div>
      </section>

      {/* booking list */}

      <section className="booking-list-section">
        {/* search +fFilters */}

        <section className="booking-filter-section">
          {/* search */}

          <div className="booking-search-box">
            <input
              type="text"
              placeholder="Search by booking ID, customer or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* filters */}

          <div className="booking-filters">
            {/* destination */}

            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
            >
              <option value="All">All Destinations</option>

              <option value="Goa">Goa</option>
              <option value="Kerala">Kerala</option>
              <option value="Manali">Manali</option>
              <option value="Dubai">Dubai</option>
              <option value="Bali">Bali</option>
              <option value="Singapore">Singapore</option>
            </select>

            {/* booking status */}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>

              <option value="Pending">Pending</option>

              <option value="Confirmed">Confirmed</option>

              <option value="Completed">Completed</option>

              <option value="Cancelled">Cancelled</option>
            </select>

            {/* payment status */}

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="All">All Payments</option>

              <option value="Pending">Pending</option>

              <option value="Paid">Paid</option>

              <option value="Refunded">Refunded</option>

              <option value="Failed">Failed</option>
            </select>

            {/* date */}

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            {/* price */}

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="All">All Prices</option>

              <option value="low">Below ₹15,000</option>

              <option value="medium">₹15,000 - ₹30,000</option>

              <option value="high">Above ₹30,000</option>
            </select>

            {/* sort */}

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Sort By</option>

              <option value="price-low">Price: Low to High</option>

              <option value="price-high">Price: High to Low</option>

              <option value="date-earliest">Date: Earliest</option>

              <option value="date-latest">Date: Latest</option>
            </select>

            {/* clear */}

            {(searchTerm ||
              destinationFilter !== "All" ||
              statusFilter !== "All" ||
              paymentFilter !== "All" ||
              priceFilter !== "All" ||
              dateFilter ||
              sortBy !== "default") && (
              <button
                className="booking-clear-btn"
                onClick={handleClearFilters}
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* booking list header */}

        <div className="section-header">
          <div>
            <h2>Booking List</h2>

            <p>All travel bookings in the system</p>
          </div>
        </div>

        {/* booking table */}

        <div className="booking-table-wrapper">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Dates</th>
                <th>Price</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentBookings.length > 0 ? (
                currentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>#{booking.id}</strong>
                    </td>

                    <td>{booking.customer}</td>

                    <td>{booking.destination}</td>

                    <td>
                      {booking.startDate} → {booking.endDate}
                    </td>

                    <td>₹{booking.price.toLocaleString("en-IN")}</td>

                    <td>
                      <span
                        className={`booking-status booking-status-${booking.status.toLowerCase()}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`payment-status payment-status-${booking.paymentStatus.toLowerCase()}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <div className="booking-actions">
                        <button
                          className="booking-action-btn"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          View
                        </button>

                        <button
                          className="booking-action-btn"
                          onClick={() => handleEditBooking(booking)}
                        >
                          Edit
                        </button>

                        <button
                          className="booking-action-btn"
                          onClick={() => setDeleteBooking(booking)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="booking-no-results">
                      <p>No results found</p>

                      <button
                        className="booking-clear-btn"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}

        {totalPages > 0 && (
          <div className="booking-pagination">
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
        )}
      </section>

      {/* add booking modal */}

      {showAddModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <div className="booking-modal-header">
              <div>
                <h2>Add Booking</h2>
                <p>Enter booking details</p>
              </div>

              <button
                className="modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setErrors({});
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddBooking}>
              <div className="booking-form-group">
                <label>Customer</label>

                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      customer: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      customer: "",
                    });
                  }}
                  placeholder="Enter customer name"
                />

                {errors.customer && (
                  <small className="form-error">{errors.customer}</small>
                )}
              </div>

              <div className="booking-form-group">
                <label>Destination</label>

                <select
                  value={formData.destination}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      destination: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      destination: "",
                    });
                  }}
                >
                  <option value="">Select destination</option>

                  <option value="Goa">Goa</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Manali">Manali</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Bali">Bali</option>
                  <option value="Singapore">Singapore</option>
                </select>

                {errors.destination && (
                  <small className="form-error">{errors.destination}</small>
                )}
              </div>

              <div className="booking-form-row">
                <div className="booking-form-group">
                  <label>Start Date</label>

                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        startDate: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        startDate: "",
                      });
                    }}
                  />

                  {errors.startDate && (
                    <small className="form-error">{errors.startDate}</small>
                  )}
                </div>

                <div className="booking-form-group">
                  <label>End Date</label>

                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        endDate: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        endDate: "",
                      });
                    }}
                  />

                  {errors.endDate && (
                    <small className="form-error">{errors.endDate}</small>
                  )}
                </div>
              </div>

              <div className="booking-form-group">
                <label>Price</label>

                <input
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      price: "",
                    });
                  }}
                  placeholder="Enter booking price"
                />

                {errors.price && (
                  <small className="form-error">{errors.price}</small>
                )}
              </div>

              <div className="booking-form-group">
                <label>Booking Status</label>

                <select
                  value={formData.status}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      status: "",
                    });
                  }}
                >
                  <option value="Pending">Pending</option>

                  <option value="Confirmed">Confirmed</option>

                  <option value="Completed">Completed</option>

                  <option value="Cancelled">Cancelled</option>
                </select>

                {errors.status && (
                  <small className="form-error">{errors.status}</small>
                )}
              </div>

              <div className="booking-form-group">
                <label>Payment Status</label>

                <select
                  value={formData.paymentStatus}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      paymentStatus: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      paymentStatus: "",
                    });
                  }}
                >
                  <option value="Pending">Pending</option>

                  <option value="Paid">Paid</option>

                  <option value="Failed">Failed</option>

                  <option value="Refunded">Refunded</option>
                </select>

                {errors.paymentStatus && (
                  <small className="form-error">
                    {errors.paymentStatus}
                  </small>
                )}
              </div>

              <div className="booking-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setErrors({});
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="save-booking-btn">
                  Add Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* view booking modal */}

      {selectedBooking && (
        <div className="booking-modal-overlay">
          <div className="booking-modal view-booking-modal">
            <div className="booking-modal-header">
              <div>
                <h2>Booking Details</h2>
                <p>View booking information</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedBooking(null)}
              >
                ×
              </button>
            </div>

            <div className="view-booking-details">
              <div>
                <span>Booking ID</span>
                <strong>#{selectedBooking.id}</strong>
              </div>

              <div>
                <span>Customer</span>
                <strong>{selectedBooking.customer}</strong>
              </div>

              <div>
                <span>Destination</span>
                <strong>{selectedBooking.destination}</strong>
              </div>

              <div>
                <span>Start Date</span>
                <strong>{selectedBooking.startDate}</strong>
              </div>

              <div>
                <span>End Date</span>
                <strong>{selectedBooking.endDate}</strong>
              </div>

              <div>
                <span>Price</span>
                <strong>
                  ₹{selectedBooking.price.toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                <span>Booking Status</span>
                <strong>{selectedBooking.status}</strong>
              </div>

              <div>
                <span>Payment Status</span>
                <strong>{selectedBooking.paymentStatus}</strong>
              </div>
            </div>

            <div className="booking-modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* edit booking modal */}

      {editBooking && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <div className="booking-modal-header">
              <div>
                <h2>Edit Booking</h2>
                <p>Update booking details</p>
              </div>

              <button
                className="modal-close"
                onClick={() => {
                  setEditBooking(null);
                  setErrors({});
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="booking-form-group">
                <label>Customer</label>

                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      customer: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      customer: "",
                    });
                  }}
                />

                {errors.customer && (
                  <small className="form-error">{errors.customer}</small>
                )}
              </div>

              <div className="booking-form-group">
                <label>Destination</label>

                <select
                  value={formData.destination}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      destination: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      destination: "",
                    });
                  }}
                >
                  <option value="">Select destination</option>

                  <option value="Goa">Goa</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Manali">Manali</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Bali">Bali</option>
                  <option value="Singapore">Singapore</option>
                </select>

                {errors.destination && (
                  <small className="form-error">{errors.destination}</small>
                )}
              </div>

              <div className="booking-form-row">
                <div className="booking-form-group">
                  <label>Start Date</label>

                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        startDate: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        startDate: "",
                      });
                    }}
                  />

                  {errors.startDate && (
                    <small className="form-error">{errors.startDate}</small>
                  )}
                </div>

                <div className="booking-form-group">
                  <label>End Date</label>

                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        endDate: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        endDate: "",
                      });
                    }}
                  />

                  {errors.endDate && (
                    <small className="form-error">{errors.endDate}</small>
                  )}
                </div>
              </div>

              <div className="booking-form-group">
                <label>Price</label>

                <input
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      price: "",
                    });
                  }}
                />

                {errors.price && (
                  <small className="form-error">{errors.price}</small>
                )}
              </div>

              <div className="booking-form-group">
                <label>Booking Status</label>

                <select
                  value={formData.status}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      status: "",
                    });
                  }}
                >
                  <option value="Pending">Pending</option>

                  <option value="Confirmed">Confirmed</option>

                  <option value="Completed">Completed</option>

                  <option value="Cancelled">Cancelled</option>
                </select>

                {errors.status && (
                  <small className="form-error">{errors.status}</small>
                )}
              </div>

              <div className="booking-form-group">
                <label>Payment Status</label>

                <select
                  value={formData.paymentStatus}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      paymentStatus: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      paymentStatus: "",
                    });
                  }}
                >
                  <option value="Pending">Pending</option>

                  <option value="Paid">Paid</option>

                  <option value="Failed">Failed</option>

                  <option value="Refunded">Refunded</option>
                </select>

                {errors.paymentStatus && (
                  <small className="form-error">
                    {errors.paymentStatus}
                  </small>
                )}
              </div>

              <div className="booking-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditBooking(null);
                    setErrors({});
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="save-booking-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete confirmation */}

      {deleteBooking && (
        <div className="booking-modal-overlay">
          <div className="booking-modal confirmation-modal">
            <div className="confirmation-icon">⚠️</div>

            <h2>Delete Booking?</h2>

            <p>
              Are you sure you want to delete booking{" "}
              <strong>#{deleteBooking.id}</strong>?
            </p>

            <p className="confirmation-warning">
              This action cannot be undone.
            </p>

            <div className="booking-modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setDeleteBooking(null)}
              >
                Cancel
              </button>

              <button
                className="delete-confirm-btn"
                onClick={handleDeleteBooking}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* toast */}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
} 