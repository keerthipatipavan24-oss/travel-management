import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import "./Payments.css";

const initialPayments = [
  {
    id: 5001,
    bookingId: 1001,
    customer: "Rahul Sharma",
    amount: 12000,
    method: "UPI",
    status: "Paid",
    paymentDate: "2026-09-10",
  },
  {
    id: 5002,
    bookingId: 1002,
    customer: "Priya Reddy",
    amount: 15000,
    method: "Credit Card",
    status: "Paid",
    paymentDate: "2026-09-15",
  },
  {
    id: 5003,
    bookingId: 1003,
    customer: "Arjun Kumar",
    amount: 18000,
    method: "Debit Card",
    status: "Paid",
    paymentDate: "2026-09-25",
  },
  {
    id: 5004,
    bookingId: 1004,
    customer: "Sneha Patel",
    amount: 45000,
    method: "Net Banking",
    status: "Paid",
    paymentDate: "2026-09-28",
  },
  {
    id: 5005,
    bookingId: 1005,
    customer: "Kiran Reddy",
    amount: 35000,
    method: "UPI",
    status: "Pending",
    paymentDate: "",
  },
  {
    id: 5006,
    bookingId: 1006,
    customer: "Anjali Rao",
    amount: 40000,
    method: "Credit Card",
    status: "Paid",
    paymentDate: "2026-10-02",
  },
  {
    id: 5007,
    bookingId: 1007,
    customer: "Vikram Singh",
    amount: 12000,
    method: "Debit Card",
    status: "Refunded",
    paymentDate: "2026-10-03",
  },
  {
    id: 5008,
    bookingId: 1008,
    customer: "Neha Verma",
    amount: 15000,
    method: "UPI",
    status: "Paid",
    paymentDate: "2026-10-04",
  },
  {
    id: 5009,
    bookingId: 1009,
    customer: "Suresh Kumar",
    amount: 18000,
    method: "Cash",
    status: "Pending",
    paymentDate: "",
  },
  {
    id: 5010,
    bookingId: 1010,
    customer: "Meera Nair",
    amount: 45000,
    method: "Net Banking",
    status: "Paid",
    paymentDate: "2026-10-06",
  },
];

export default function Payments() {
  const [payments, setPayments] = useState(() => {
    const savedPayments = localStorage.getItem("payments");

    return savedPayments ? JSON.parse(savedPayments) : initialPayments;
  });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editPayment, setEditPayment] = useState(null);
  const [deletePayment, setDeletePayment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);
  
  // search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [amountFilter, setAmountFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("");
    
    const [currentPage, setCurrentPage] = useState(1);

  const paymentsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, methodFilter, amountFilter, dateFilter]);


  const [formData, setFormData] = useState({
    bookingId: "",
    customer: "",
    amount: "",
    method: "",
    status: "Paid",
    paymentDate: "",
  });

  const [errors, setErrors] = useState({});

  // save payments to localStorage
  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  // toast auto close
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  // search and filter logic
  const filteredPayments = payments.filter((payment) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      payment.id.toString().includes(search) ||
      payment.bookingId.toString().includes(search) ||
      payment.customer.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || payment.status === statusFilter;

    const matchesMethod =
      methodFilter === "All" || payment.method === methodFilter;

    let matchesAmount = true;

    if (amountFilter === "Low") {
      matchesAmount = payment.amount < 15000;
    }

    if (amountFilter === "Medium") {
      matchesAmount = payment.amount >= 15000 && payment.amount <= 30000;
    }

    if (amountFilter === "High") {
      matchesAmount = payment.amount > 30000;
    }

    const matchesDate = !dateFilter || payment.paymentDate === dateFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMethod &&
      matchesAmount &&
      matchesDate
    );
  });

  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const startIndex = (currentPage - 1) * paymentsPerPage;

  const currentPayments = filteredPayments.slice(
    startIndex,
    startIndex + paymentsPerPage,
  );

  // clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setMethodFilter("All");
    setAmountFilter("All");
    setDateFilter("");
  };

  // open add payment modal
  const handleAddPayment = () => {
    setFormData({
      bookingId: "",
      customer: "",
      amount: "",
      method: "",
      status: "Paid",
      paymentDate: "",
    });

    setErrors({});
    setShowAddModal(true);
  };

  // open edit payment modal
  const handleEditPayment = (payment) => {
    setEditPayment(payment);

    setFormData({
      bookingId: payment.bookingId,
      customer: payment.customer,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      paymentDate: payment.paymentDate,
    });

    setErrors({});
  };

  // form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // add or Update payment
  const handleSavePayment = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.bookingId) {
      newErrors.bookingId = "Booking ID is required";
    }

    if (!formData.customer.trim()) {
      newErrors.customer = "Customer is required";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Enter a valid amount";
    }

    if (!formData.method) {
      newErrors.method = "Payment method is required";
    }

    if (!formData.status) {
      newErrors.status = "Payment status is required";
    }

    if (formData.status !== "Pending" && !formData.paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const paymentDate =
      formData.status === "Pending" ? "" : formData.paymentDate;

    // update payment
    if (editPayment) {
      const updatedPayments = payments.map((payment) =>
        payment.id === editPayment.id
          ? {
              ...payment,
              bookingId: Number(formData.bookingId),
              customer: formData.customer,
              amount: Number(formData.amount),
              method: formData.method,
              status: formData.status,
              paymentDate,
            }
          : payment,
      );

      setPayments(updatedPayments);
      setEditPayment(null);

      setToast({
        message: "Payment updated successfully",
        type: "success",
      });
    }

    // add payment
    else {
      const newId =
        payments.length > 0
          ? Math.max(...payments.map((payment) => payment.id)) + 1
          : 5001;

      const newPayment = {
        id: newId,
        bookingId: Number(formData.bookingId),
        customer: formData.customer,
        amount: Number(formData.amount),
        method: formData.method,
        status: formData.status,
        paymentDate,
      };

      setPayments([...payments, newPayment]);
      setShowAddModal(false);

      setToast({
        message: "Payment added successfully",
        type: "success",
      });
    }

    setFormData({
      bookingId: "",
      customer: "",
      amount: "",
      method: "",
      status: "Paid",
      paymentDate: "",
    });

    setErrors({});
  };

  // delete payment
  const handleDeletePayment = () => {
    const updatedPayments = payments.filter(
      (payment) => payment.id !== deletePayment.id,
    );

    setPayments(updatedPayments);
    setDeletePayment(null);

    setToast({
      message: "Payment deleted successfully",
      type: "success",
    });
  };

  return (
    <div className="payments-page">
      {/* header */}

      <section className="payment-header-section">
        <div className="payments-header">
          <div>
            <h1>Payments</h1>
            <p>Manage and track travel payments</p>
          </div>

          <button className="add-payment-btn" onClick={handleAddPayment}>
             Add Payment
          </button>
        </div>
      </section>

      {/* summary cards */}

      <section className="payment-summary-section">
        <div className="payment-summary">
          <div className="payment-summary-card">
            <h3>Total Payments</h3>
            <p>{payments.length}</p>
          </div>

          <div className="payment-summary-card">
            <h3>Paid Amount</h3>

            <p>
              ₹
              {payments
                .filter((payment) => payment.status === "Paid")
                .reduce((total, payment) => total + payment.amount, 0)
                .toLocaleString("en-IN")}
            </p>
          </div>

          <div className="payment-summary-card">
            <h3>Pending Amount</h3>

            <p>
              ₹
              {payments
                .filter((payment) => payment.status === "Pending")
                .reduce((total, payment) => total + payment.amount, 0)
                .toLocaleString("en-IN")}
            </p>
          </div>

          <div className="payment-summary-card">
            <h3>Refunded Amount</h3>

            <p>
              ₹
              {payments
                .filter((payment) => payment.status === "Refunded")
                .reduce((total, payment) => total + payment.amount, 0)
                .toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </section>

      {/* search & filter */}

      <section className="payment-filter-section">
        <div className="payment-search-box">
          <input
            type="text"
            placeholder="Search by payment ID, booking ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="payment-filters">
          {/* status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>

            <option value="Paid">Paid</option>

            <option value="Pending">Pending</option>

            <option value="Failed">Failed</option>

            <option value="Refunded">Refunded</option>
          </select>

          {/* payment method */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="All">All Methods</option>

            <option value="UPI">UPI</option>

            <option value="Credit Card">Credit Card</option>

            <option value="Debit Card">Debit Card</option>

            <option value="Net Banking">Net Banking</option>

            <option value="Cash">Cash</option>
          </select>

          {/* amount */}
          <select
            value={amountFilter}
            onChange={(e) => setAmountFilter(e.target.value)}
          >
            <option value="All">All Amounts</option>

            <option value="Low">Below ₹15,000</option>

            <option value="Medium">₹15,000 - ₹30,000</option>

            <option value="High">Above ₹30,000</option>
          </select>

          {/* payment date */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

          {/* clear */}
          <button className="payment-clear-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      </section>

      {/* payment records */}

      <section className="payment-records-section">
        <div className="payment-records-header">
          <div>
            <h2>Payment Records</h2>

            <p>View all payment transactions</p>
          </div>
        </div> 
        <div className="payment-records-list">
          {filteredPayments.length === 0 ? (
            <div className="payment-no-results">
              <p>No payments found matching your search or filters.</p>

              <button onClick={handleClearFilters}>Clear Filters</button>
            </div>
          ) : (
            currentPayments.map((payment) => (
              <div className="payment-card" key={payment.id}>
                <div className="payment-card-header">
                  <div>
                    <h3>Payment #{payment.id}</h3>

                    <p>Booking #{payment.bookingId}</p>
                  </div>

                  <span
                    className={`payment-status payment-status-${payment.status.toLowerCase()}`}
                  >
                    {payment.status}
                  </span>
                </div>

                <div className="payment-card-details">
                  <div className="payment-detail">
                    <span>Customer</span>
                    <strong>{payment.customer}</strong>
                  </div>

                  <div className="payment-detail">
                    <span>Amount</span>

                    <strong>₹{payment.amount.toLocaleString("en-IN")}</strong>
                  </div>

                  <div className="payment-detail">
                    <span>Payment Method</span>

                    <strong>{payment.method}</strong>
                  </div>

                  <div className="payment-detail">
                    <span>Payment Date</span>

                    <strong>{payment.paymentDate || "—"}</strong>
                  </div>
                </div>

                <div className="payment-card-actions">
                  <button
                    className="payment-view-btn"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    View
                  </button>

                  <button
                    className="payment-edit-btn"
                    onClick={() => handleEditPayment(payment)}
                  >
                    Edit
                  </button>

                  <button
                    className="payment-delete-btn"
                    onClick={() => setDeletePayment(payment)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="payment-pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section> 
      {/* view modal */}

      {selectedPayment && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <h3>Payment Details</h3>

              <button
                className="payment-modal-close"
                onClick={() => setSelectedPayment(null)}
              >
                ×
              </button>
            </div>

            <div className="view-payment-details">
              <div className="view-payment-item">
                <strong>Payment ID:</strong>
                <span>#{selectedPayment.id}</span>
              </div>

              <div className="view-payment-item">
                <strong>Booking ID:</strong>
                <span>#{selectedPayment.bookingId}</span>
              </div>

              <div className="view-payment-item">
                <strong>Customer:</strong>
                <span>{selectedPayment.customer}</span>
              </div>

              <div className="view-payment-item">
                <strong>Amount:</strong>
                <span>₹{selectedPayment.amount.toLocaleString("en-IN")}</span>
              </div>

              <div className="view-payment-item">
                <strong>Payment Method:</strong>
                <span>{selectedPayment.method}</span>
              </div>

              <div className="view-payment-item">
                <strong>Payment Status:</strong>
                <span>{selectedPayment.status}</span>
              </div>

              <div className="view-payment-item">
                <strong>Payment Date:</strong>
                <span>{selectedPayment.paymentDate || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* add/edit modal */}

      {(showAddModal || editPayment) && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <h3>{editPayment ? "Edit Payment" : "Add Payment"}</h3>

              <button
                className="payment-modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setEditPayment(null);
                  setErrors({});
                }}
              >
                ×
              </button>
            </div>

            <form className="payment-form" onSubmit={handleSavePayment}>
              {/* booking ID */}
              <div className="payment-form-group">
                <label>Booking ID</label>

                <input
                  type="number"
                  name="bookingId"
                  value={formData.bookingId}
                  onChange={handleFormChange}
                  placeholder="Enter booking ID"
                />

                {errors.bookingId && (
                  <small className="payment-form-error">
                    {errors.bookingId}
                  </small>
                )}
              </div>

              {/* customer */}
              <div className="payment-form-group">
                <label>Customer</label>

                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleFormChange}
                  placeholder="Enter customer name"
                />

                {errors.customer && (
                  <small className="payment-form-error">
                    {errors.customer}
                  </small>
                )}
              </div>

              {/* amount */}
              <div className="payment-form-group">
                <label>Amount</label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleFormChange}
                  placeholder="Enter amount"
                />

                {errors.amount && (
                  <small className="payment-form-error">
                    {errors.amount}
                  </small>
                )}
              </div>

              {/* method */}
              <div className="payment-form-group">
                <label>Payment Method</label>

                <select
                  name="method"
                  value={formData.method}
                  onChange={handleFormChange}
                >
                  <option value="">Select method</option>

                  <option value="UPI">UPI</option>

                  <option value="Credit Card">Credit Card</option>

                  <option value="Debit Card">Debit Card</option>

                  <option value="Net Banking">Net Banking</option>

                  <option value="Cash">Cash</option>
                </select>

                {errors.method && (
                  <small className="payment-form-error">
                    {errors.method}
                  </small>
                )}
              </div>

              {/* status */}
              <div className="payment-form-group">
                <label>Payment Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Pending">Pending</option>

                  <option value="Paid">Paid</option>

                  <option value="Failed">Failed</option>

                  <option value="Refunded">Refunded</option>
                </select>

                {errors.status && (
                  <small className="payment-form-error">
                    {errors.status}
                  </small>
                )}
              </div>

              {/* payment date */}
              <div className="payment-form-group">
                <label>Payment Date</label>

                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleFormChange}
                  disabled={formData.status === "Pending"}
                />

                {formData.status === "Pending" && (
                  <small>
                    Payment date is not available for pending payments.
                  </small>
                )}

                {errors.paymentDate && (
                  <small className="payment-form-error">
                    {errors.paymentDate}
                  </small>
                )}
              </div>

              {/* form actions */}
              <div className="payment-modal-actions">
                <button
                  type="button"
                  className="cancel-payment-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditPayment(null);
                    setErrors({});
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="save-payment-btn">
                  {editPayment ? "Update Payment" : "Save Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete confirmation */}

      {deletePayment && (
        <div className="payment-modal-overlay">
          <div className="confirmation-modal">
            <div className="confirmation-icon">⚠️</div>

            <h3>Delete Payment?</h3>

            <p>Are you sure you want to delete payment #{deletePayment.id}?</p>

            <p className="confirmation-warning">
              This action cannot be undone.
            </p>

            <div className="payment-modal-actions">
              <button
                className="cancel-payment-btn"
                onClick={() => setDeletePayment(null)}
              >
                Cancel
              </button>

              <button
                className="delete-confirm-btn"
                onClick={handleDeletePayment}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* toast */}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
} 