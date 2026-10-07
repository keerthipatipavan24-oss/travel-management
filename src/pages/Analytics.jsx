import { useEffect, useState } from "react";
import "./Analytics.css";

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

export default function Analytics() {
  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  /* load data */

  useEffect(() => {
    const savedBookings = localStorage.getItem("bookings");
    const savedTrips = localStorage.getItem("trips");
    const savedCustomers = localStorage.getItem("customers");
    const savedPayments = localStorage.getItem("payments");

    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      localStorage.setItem("bookings", JSON.stringify(initialBookings));
      setBookings(initialBookings);
    }

    if (savedTrips) {
      setTrips(JSON.parse(savedTrips));
    }

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }

    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    }

    setLoading(false);
  }, []);

  /* main statistics */

  const totalBookings = bookings.length;

  const totalRevenue = bookings.reduce(
    (total, booking) => total + Number(booking.price || 0),
    0
  );

  const totalCustomers = customers.length;

  const totalTrips = trips.length;

  /* booking status */

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  const bookingStatusData = [
    {
      name: "Confirmed",
      value: confirmedBookings,
      className: "analytics-confirmed",
    },
    {
      name: "Pending",
      value: pendingBookings,
      className: "analytics-pending",
    },
    {
      name: "Completed",
      value: completedBookings,
      className: "analytics-completed",
    },
    {
      name: "Cancelled",
      value: cancelledBookings,
      className: "analytics-cancelled",
    },
  ];

  const maxBookingStatus = Math.max(
    ...bookingStatusData.map((item) => item.value),
    1
  );

  /* revenue by destination */

  const destinations = [
    "Goa",
    "Kerala",
    "Manali",
    "Dubai",
    "Bali",
    "Singapore",
  ];

  const revenueByDestination = destinations.map((destination) => {
    const revenue = bookings
      .filter((booking) => booking.destination === destination)
      .reduce(
        (total, booking) => total + Number(booking.price || 0),
        0
      );

    return {
      name: destination,
      value: revenue,
    };
  });

  const maxDestinationRevenue = Math.max(
    ...revenueByDestination.map((item) => item.value),
    1
  );

  /* popular destinations */

  const popularDestinations = destinations.map((destination) => {
    const count = bookings.filter(
      (booking) => booking.destination === destination
    ).length;

    return {
      name: destination,
      value: count,
    };
  });

  const maxPopularDestination = Math.max(
    ...popularDestinations.map((item) => item.value),
    1
  );

  /* payment statistics */

  const paidAmount = payments
    .filter((payment) => payment.status === "Paid")
    .reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

  const pendingAmount = payments
    .filter((payment) => payment.status === "Pending")
    .reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

  const refundedAmount = payments
    .filter((payment) => payment.status === "Refunded")
    .reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

  /* loading state */

  if (loading) {
    return (
      <main className="analytics-page">
        <div className="analytics-loading">
          <p>Loading analytics...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="analytics-page">
      {/* page header */}

      <section className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>Travel business performance overview</p>
        </div>
      </section>

      {/* cards */}

      <section className="analytics-summary">
        <div className="analytics-summary-card">
          <div className="analytics-card-icon">🎫</div>

          <div>
            <p>Total Bookings</p>
            <h2>{totalBookings}</h2>
          </div>
        </div>

        <div className="analytics-summary-card">
          <div className="analytics-card-icon">💰</div>

          <div>
            <p>Total Revenue</p>
            <h2>₹{totalRevenue.toLocaleString("en-IN")}</h2>
          </div>
        </div>

        <div className="analytics-summary-card">
          <div className="analytics-card-icon">👥</div>

          <div>
            <p>Total Customers</p>
            <h2>{totalCustomers}</h2>
          </div>
        </div>

        <div className="analytics-summary-card">
          <div className="analytics-card-icon">✈️</div>

          <div>
            <p>Total Trips</p>
            <h2>{totalTrips}</h2>
          </div>
        </div>
      </section>

      {/* booking status */}

      <section className="analytics-section">
        <div className="analytics-section-header">
          <div>
            <h2>Booking Status</h2>
            <p>Overview of current booking statuses</p>
          </div>
        </div>

        <div className="analytics-bar-chart">
          {bookingStatusData.map((item) => {
            const width =
              item.value === 0
                ? 0
                : (item.value / maxBookingStatus) * 100;

            return (
              <div className="analytics-bar-row" key={item.name}>
                <div className="analytics-bar-label">
                  <span>{item.name}</span>
                  <strong>{item.value}</strong>
                </div>

                <div className="analytics-bar-background">
                  <div
                    className={`analytics-bar-fill ${item.className}`}
                    style={{ width: `${width}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* revenue by destination */}

      <section className="analytics-section">
        <div className="analytics-section-header">
          <div>
            <h2>Revenue by Destination</h2>
            <p>Booking revenue generated from each destination</p>
          </div>
        </div>

        <div className="analytics-bar-chart">
          {revenueByDestination.map((item) => {
            const width =
              item.value === 0
                ? 0
                : (item.value / maxDestinationRevenue) * 100;

            return (
              <div className="analytics-bar-row" key={item.name}>
                <div className="analytics-bar-label">
                  <span>{item.name}</span>
                  <strong>
                    ₹{item.value.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="analytics-bar-background">
                  <div
                    className="analytics-bar-fill analytics-revenue"
                    style={{ width: `${width}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* popular destinations */}

      <section className="analytics-section">
        <div className="analytics-section-header">
          <div>
            <h2>Popular Destinations</h2>
            <p>Destinations based on number of bookings</p>
          </div>
        </div>

        <div className="analytics-bar-chart">
          {popularDestinations.map((item) => {
            const width =
              item.value === 0
                ? 0
                : (item.value / maxPopularDestination) * 100;

            return (
              <div className="analytics-bar-row" key={item.name}>
                <div className="analytics-bar-label">
                  <span>{item.name}</span>
                  <strong>{item.value} bookings</strong>
                </div>

                <div className="analytics-bar-background">
                  <div
                    className="analytics-bar-fill analytics-popular"
                    style={{ width: `${width}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* payment overview */}

      <section className="analytics-section">
        <div className="analytics-section-header">
          <div>
            <h2>Payment Overview</h2>
            <p>Summary of payment amounts</p>
          </div>
        </div>

        <div className="analytics-payment-grid">
          <div className="analytics-payment-card">
            <span>💳</span>
            <p>Paid Amount</p>
            <h3>₹{paidAmount.toLocaleString("en-IN")}</h3>
          </div>

          <div className="analytics-payment-card">
            <span>⏳</span>
            <p>Pending Amount</p>
            <h3>₹{pendingAmount.toLocaleString("en-IN")}</h3>
          </div>

          <div className="analytics-payment-card">
            <span>↩️</span>
            <p>Refunded Amount</p>
            <h3>₹{refundedAmount.toLocaleString("en-IN")}</h3>
          </div>
        </div>
      </section>
    </main>
  );
} 