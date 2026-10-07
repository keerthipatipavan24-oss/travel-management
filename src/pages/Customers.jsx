import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import "./Customers.css";

// initial customer data

const initialCustomers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "9876543210",
    city: "Hyderabad",
    totalBookings: 3,
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Reddy",
    email: "priya@gmail.com",
    phone: "9876543211",
    city: "Bangalore",
    totalBookings: 2,
    status: "Active",
  },
  {
    id: 3,
    name: "Arjun Kumar",
    email: "arjun@gmail.com",
    phone: "9876543212",
    city: "Chennai",
    totalBookings: 4,
    status: "Active",
  },
  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha@gmail.com",
    phone: "9876543213",
    city: "Mumbai",
    totalBookings: 1,
    status: "Active",
  },
  {
    id: 5,
    name: "Kiran Reddy",
    email: "kiran@gmail.com",
    phone: "9876543214",
    city: "Vijayawada",
    totalBookings: 2,
    status: "Active",
  },
  {
    id: 6,
    name: "Anjali Rao",
    email: "anjali@gmail.com",
    phone: "9876543215",
    city: "Hyderabad",
    totalBookings: 5,
    status: "Active",
  },
  {
    id: 7,
    name: "Vikram Singh",
    email: "vikram@gmail.com",
    phone: "9876543216",
    city: "Delhi",
    totalBookings: 2,
    status: "Inactive",
  },
  {
    id: 8,
    name: "Neha Verma",
    email: "neha@gmail.com",
    phone: "9876543217",
    city: "Pune",
    totalBookings: 3,
    status: "Active",
  },
  {
    id: 9,
    name: "Suresh Kumar",
    email: "suresh@gmail.com",
    phone: "9876543218",
    city: "Chennai",
    totalBookings: 1,
    status: "Active",
  },
  {
    id: 10,
    name: "Meera Nair",
    email: "meera@gmail.com",
    phone: "9876543219",
    city: "Kochi",
    totalBookings: 4,
    status: "Active",
  },
];

export default function Customers() {
  /* customer states */

  const [customers, setCustomers] = useState(() => {
    const savedCustomers = localStorage.getItem("customers");

    return savedCustomers ? JSON.parse(savedCustomers) : initialCustomers;
  });

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  /* modal states= */

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteCustomer, setDeleteCustomer] = useState(null);

  /* search, filter & sort */

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const customersPerPage = 6;

  /* toast */

  const [toast, setToast] = useState(null);

  /*form data */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    status: "Active",
  });

  /* form validation */

  const [errors, setErrors] = useState({});

  /* save customers */

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  /* load bookings
     IMPORTANT:
     we only READ bookings here.
     we do NOT modify bookings.*/
 
  useEffect(() => {
    const savedBookings = localStorage.getItem("bookings");

    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  /* loading */

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /* toast and hide */

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  /* =========================
     customer booking count
     
     Calculate bookings from
     actual booking records.
  ========================= */

  const getCustomerBookingCount = (customerName) => {
    return bookings.filter(
      (booking) => booking.customer === customerName
    ).length;
  };

  /* =========================
     DISPLAY CUSTOMERS
     
     We create a new array only
     for displaying calculated
     booking counts.
     
     Original customer data
     remains unchanged.
  ========================= */

  const customersWithBookings = customers.map((customer) => ({
    ...customer,
    totalBookings: getCustomerBookingCount(customer.name),
  }));

  /* search, filter */

  const filteredCustomers = customersWithBookings.filter((customer) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.phone.includes(search) ||
      customer.city.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* sort customers */

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === "name-az") {
      return a.name.localeCompare(b.name);
    }

    if (sortBy === "name-za") {
      return b.name.localeCompare(a.name);
    }

    if (sortBy === "bookings-high") {
      return b.totalBookings - a.totalBookings;
    }

    if (sortBy === "bookings-low") {
      return a.totalBookings - b.totalBookings;
    }

    return 0;
  });

  /* reset page */

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  /* pagination */

  const totalPages = Math.ceil(
    sortedCustomers.length / customersPerPage
  );

  const startIndex = (currentPage - 1) * customersPerPage;

  const currentCustomers = sortedCustomers.slice(
    startIndex,
    startIndex + customersPerPage
  );

  /* summary calculations */

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "Inactive"
  ).length;

  // actual number of booking records
  const totalBookings = bookings.length;

  /* add customer */

  const handleAddCustomer = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newCustomer = {
      id:
        customers.length > 0
          ? Math.max(...customers.map((customer) => customer.id)) + 1
          : 1,

      ...formData,

      // new customer starts with 0 actual bookings
      totalBookings: 0,
    };

    setCustomers([...customers, newCustomer]);

    setToast({
      message: "Customer added successfully",
      type: "success",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      status: "Active",
    });

    setErrors({});

    setShowAddModal(false);
  };

  /* view customer */

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  /* edit customer */

  const handleEditCustomer = (customer) => {
    setEditCustomer(customer);

    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      status: customer.status,
    });

    setErrors({});
  };

  /* save edit */

  const handleSaveEdit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedCustomers = customers.map((customer) =>
      customer.id === editCustomer.id
        ? {
            ...customer,
            ...formData,

            // Keep existing field only for stored
            // customer data. Actual display count
            // comes from bookings.
            totalBookings: customer.totalBookings || 0,
          }
        : customer
    );

    setCustomers(updatedCustomers);

    setToast({
      message: "Customer updated successfully",
      type: "success",
    });

    setEditCustomer(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      status: "Active",
    });

    setErrors({});
  };

  /* delete customer */

  const handleDeleteCustomer = () => {
    const updatedCustomers = customers.filter(
      (customer) => customer.id !== deleteCustomer.id
    );

    setCustomers(updatedCustomers);

    setToast({
      message: "Customer deleted successfully",
      type: "success",
    });

    setDeleteCustomer(null);
  };

  if (loading) {
    return (
      <main className="customers-page">
        <div className="customers-loading">
          <p>Loading customers...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="customers-page">
      {/* page header */}

      <section className="customers-header">
        <div>
          <h1>Customers</h1>
          <p>Manage your travel customers</p>
        </div>

        <button
          className="add-customer-btn"
          onClick={() => {
            setErrors({});
            setShowAddModal(true);
          }}
        >
           Add Customer
        </button>
      </section>

      {/* summary cards */}

      <section className="customer-summary">
        <div className="customer-summary-card">
          <span>👥</span>

          <div>
            <p>Total Customers</p>
            <h2>{totalCustomers}</h2>
          </div>
        </div>

        <div className="customer-summary-card">
          <span>✅</span>

          <div>
            <p>Active Customers</p>
            <h2>{activeCustomers}</h2>
          </div>
        </div>

        <div className="customer-summary-card">
          <span>⏸️</span>

          <div>
            <p>Inactive Customers</p>
            <h2>{inactiveCustomers}</h2>
          </div>
        </div>

        <div className="customer-summary-card">
          <span>🎫</span>

          <div>
            <p>Total Bookings</p>
            <h2>{totalBookings}</h2>
          </div>
        </div>
      </section>

      {/* customer list */}

      <section className="customer-list-section">
        {/* search */}

        <div className="customer-search">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort By</option>
            <option value="name-az">Name A to Z</option>
            <option value="name-za">Name Z to A</option>
            <option value="bookings-high">
              Bookings High to Low
            </option>
            <option value="bookings-low">
              Bookings Low to High
            </option>
          </select>
        </div>

        {/* section header */}

        <div className="section-header">
          <div>
            <h2>Customer List</h2>
            <p>All customers in the system</p>
          </div>
        </div>

        {/* customer cards */}

        <div className="customer-list">
          {currentCustomers.length > 0 ? (
            currentCustomers.map((customer) => (
              <div className="customer-card" key={customer.id}>
                {/* customer basic information */}

                <div className="customer-info">
                  <div className="customer-avatar">
                    {customer.name.charAt(0)}
                  </div>

                  <div>
                    <h3>{customer.name}</h3>
                    <p>{customer.email}</p>
                  </div>
                </div>

                {/* customer details */}

                <div className="customer-details">
                  <p>
                    <strong>📞</strong> {customer.phone}
                  </p>

                  <p>
                    <strong>📍</strong> {customer.city}
                  </p>

                  <p>
                    <strong>🎫</strong> {customer.totalBookings} bookings
                  </p>
                </div>

                {/* customer status */}

                <div className="customer-status">
                  <span
                    className={
                      customer.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {customer.status}
                  </span>
                </div>

                {/* customer actions */}

                <div className="customer-actions">
                  <button
                    onClick={() => handleViewCustomer(customer)}
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleEditCustomer(customer)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteCustomer(customer)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="customer-no-results">
              <p>No results found</p>

              <button
                className="customer-clear-btn"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* pagination */}

        {totalPages > 0 && (
          <div className="customer-pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={
                  currentPage === index + 1 ? "active" : ""
                }
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={
                currentPage === totalPages || totalPages === 0
              }
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* add customer modal */}

      {showAddModal && (
        <div className="customer-modal-overlay">
          <div className="customer-modal">
            <div className="customer-modal-header">
              <div>
                <h2>Add Customer</h2>
                <p>Enter customer details</p>
              </div>

              <button
                className="modal-close"
                onClick={() => {
                  setErrors({});
                  setShowAddModal(false);
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCustomer}>
              <div className="customer-form-group">
                <label>Name</label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      name: "",
                    });
                  }}
                  placeholder="Enter customer name"
                />

                {errors.name && (
                  <small className="form-error">
                    {errors.name}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      email: "",
                    });
                  }}
                  placeholder="Enter email"
                />

                {errors.email && (
                  <small className="form-error">
                    {errors.email}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>Phone</label>

                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      phone: "",
                    });
                  }}
                  placeholder="Enter phone number"
                />

                {errors.phone && (
                  <small className="form-error">
                    {errors.phone}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>City</label>

                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      city: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      city: "",
                    });
                  }}
                  placeholder="Enter city"
                />

                {errors.city && (
                  <small className="form-error">
                    {errors.city}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>Status</label>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="customer-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setErrors({});
                    setShowAddModal(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-customer-btn"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* view customer */}

      {selectedCustomer && (
        <div className="customer-modal-overlay">
          <div className="customer-modal view-customer-modal">
            <div className="customer-modal-header">
              <div>
                <h2>Customer Details</h2>
                <p>Customer information</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedCustomer(null)}
              >
                ×
              </button>
            </div>

            <div className="view-customer-details">
              <div className="view-customer-avatar">
                {selectedCustomer.name.charAt(0)}
              </div>

              <h3>{selectedCustomer.name}</h3>

              <p>
                <strong>Email:</strong>{" "}
                {selectedCustomer.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {selectedCustomer.phone}
              </p>

              <p>
                <strong>City:</strong>{" "}
                {selectedCustomer.city}
              </p>

              <p>
                <strong>Total Bookings:</strong>{" "}
                {selectedCustomer.totalBookings}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    selectedCustomer.status === "Active"
                      ? "status-active"
                      : "status-inactive"
                  }
                >
                  {selectedCustomer.status}
                </span>
              </p>
            </div>

            <div className="customer-modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setSelectedCustomer(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* edit customer */}

      {editCustomer && (
        <div className="customer-modal-overlay">
          <div className="customer-modal">
            <div className="customer-modal-header">
              <div>
                <h2>Edit Customer</h2>
                <p>Update customer details</p>
              </div>

              <button
                className="modal-close"
                onClick={() => {
                  setErrors({});
                  setEditCustomer(null);
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="customer-form-group">
                <label>Name</label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      name: "",
                    });
                  }}
                />

                {errors.name && (
                  <small className="form-error">
                    {errors.name}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      email: "",
                    });
                  }}
                />

                {errors.email && (
                  <small className="form-error">
                    {errors.email}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>Phone</label>

                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      phone: "",
                    });
                  }}
                />

                {errors.phone && (
                  <small className="form-error">
                    {errors.phone}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>City</label>

                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      city: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      city: "",
                    });
                  }}
                />

                {errors.city && (
                  <small className="form-error">
                    {errors.city}
                  </small>
                )}
              </div>

              <div className="customer-form-group">
                <label>Status</label>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="customer-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setErrors({});
                    setEditCustomer(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-customer-btn"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete confirmation */}

      {deleteCustomer && (
        <div className="customer-modal-overlay">
          <div className="customer-modal confirmation-modal">
            <div className="confirmation-icon">⚠️</div>

            <h2>Delete Customer?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteCustomer.name}</strong>?
            </p>

            <p className="confirmation-warning">
              This action cannot be undone.
            </p>

            <div className="customer-modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setDeleteCustomer(null)}
              >
                Cancel
              </button>

              <button
                className="delete-confirm-btn"
                onClick={handleDeleteCustomer}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* toast */}

      {toast && (
        <Toast message={toast.message} type={toast.type} />
      )}
    </main>
  );
} 