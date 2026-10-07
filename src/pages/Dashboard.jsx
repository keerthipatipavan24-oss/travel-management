import { useState, useEffect } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const [totalDestinations, setTotalDestinations] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [confirmedBookings, setConfirmedBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [cancelledBookings, setCancelledBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);

  const [recentTrips, setRecentTrips] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);

  useEffect(() => {
    const savedDestinations = localStorage.getItem("destinations");
    const savedTrips = localStorage.getItem("trips");
    const savedCustomers = localStorage.getItem("customers");
    const savedBookings = localStorage.getItem("bookings");

    const destinations = savedDestinations
      ? JSON.parse(savedDestinations)
      : [];

    const trips = savedTrips ? JSON.parse(savedTrips) : [];

    const customers = savedCustomers
      ? JSON.parse(savedCustomers)
      : [];

    const bookings = savedBookings
      ? JSON.parse(savedBookings)
      : [];

    // summary statistics
    setTotalDestinations(destinations.length);
    setTotalTrips(trips.length);
    setTotalCustomers(customers.length);
    setTotalBookings(bookings.length);

    // calculate total revenue
    const revenue = bookings.reduce(
      (total, booking) =>
        total + Number(booking.price || 0),
      0
    );

    setTotalRevenue(revenue);

    // booking status counts
    setConfirmedBookings(
      bookings.filter(
        (booking) => booking.status === "Confirmed"
      ).length
    );

    setPendingBookings(
      bookings.filter(
        (booking) => booking.status === "Pending"
      ).length
    );

    setCancelledBookings(
      bookings.filter(
        (booking) => booking.status === "Cancelled"
      ).length
    );

    setCompletedBookings(
      bookings.filter(
        (booking) => booking.status === "Completed"
      ).length
    );

    // recent trips
    const sortedTrips = [...trips].sort(
      (a, b) =>
        new Date(a.startDate) -
        new Date(b.startDate)
    );

    setRecentTrips(sortedTrips.slice(0, 3));

    // popular destinations
    const destinationCounts = {};

    bookings.forEach((booking) => {
      const destination = booking.destination;

      if (destination) {
        destinationCounts[destination] =
          (destinationCounts[destination] || 0) + 1;
      }
    });

    const popularList = Object.entries(
      destinationCounts
    ).map(([destination, count]) => ({
      destination,
      count,
    }));

    popularList.sort(
      (a, b) => b.count - a.count
    );

    setPopularDestinations(
      popularList.slice(0, 6)
    );
  }, []);

  // booking chart data
  const bookingChartData = [
    {
      name: "Confirmed",
      value: confirmedBookings,
      className: "confirmed-bar",
    },
    {
      name: "Pending",
      value: pendingBookings,
      className: "pending-bar",
    },
    {
      name: "Cancelled",
      value: cancelledBookings,
      className: "cancelled-bar",
    },
    {
      name: "Completed",
      value: completedBookings,
      className: "completed-bar",
    },
  ];

  // find highest booking count
  const maxBookingCount = Math.max(
    ...bookingChartData.map((item) => item.value),
    1
  );

  const maxDestinationCount = Math.max(
    ...popularDestinations.map(
      (item) => item.count
    ),
    1
  );

  return (
    <main className="dashboard-page">

      {/* header */}

      <section className="dashboard-header">
        <h1>Welcome back, Pavan</h1>
        <p>
          Here's your travel management overview.
        </p>
      </section>


      {/* summary stats */}

      <section className="dashboard-stats">

        <div className="stat-card">
          <span className="stat-icon">🌍</span>

          <div>
            <p>Total Destinations</p>
            <h2>{totalDestinations}</h2>
          </div>
        </div>


        <div className="stat-card">
          <span className="stat-icon">✈️</span>

          <div>
            <p>Total Trips</p>
            <h2>{totalTrips}</h2>
          </div>
        </div>


        <div className="stat-card">
          <span className="stat-icon">👥</span>

          <div>
            <p>Total Customers</p>
            <h2>{totalCustomers}</h2>
          </div>
        </div>


        <div className="stat-card">
          <span className="stat-icon">🎫</span>

          <div>
            <p>Total Bookings</p>
            <h2>{totalBookings}</h2>
          </div>
        </div>


        <div className="stat-card">
          <span className="stat-icon">💰</span>

          <div>
            <p>Total Revenue</p>

            <h2>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

      </section>


      {/* recent trips */}

      <section className="recent-trips">

        <div className="section-header">
          <h2>Recent Trips</h2>
          <p>Latest trips in the system</p>
        </div>


        <div className="trips-list">

          {recentTrips.length === 0 ? (
            <p>No trips available.</p>
          ) : (
            recentTrips.map((trip) => (

              <div
                className="trip-card"
                key={trip.id}
              >

                <div>

                  <h3>{trip.title}</h3>

                  <p>{trip.destination}</p>

                  <p>
                    📅{" "}
                    {new Date(
                      trip.startDate
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>

                </div>


                <div className="trip-info">

                  <span className="trip-price">
                    ₹
                    {Number(
                      trip.price || 0
                    ).toLocaleString("en-IN")}
                  </span>


                  <span
                    className={`trip-status ${(
                      trip.status || ""
                    ).toLowerCase()}`}
                  >
                    {trip.status}
                  </span>

                </div>

              </div>

            ))
          )}

        </div>

      </section>


      {/* booking overview */}

      <section className="booking-overview">

        <div className="section-header">
          <h2>Booking Overview</h2>
          <p>Current booking status summary</p>
        </div>


        <div className="booking-cards">

          <div className="booking-card">
            <span className="booking-icon">
              🎫
            </span>

            <div>
              <p>Confirmed</p>
              <h3>{confirmedBookings}</h3>
            </div>
          </div>


          <div className="booking-card">
            <span className="booking-icon">
              ⏳
            </span>

            <div>
              <p>Pending</p>
              <h3>{pendingBookings}</h3>
            </div>
          </div>


          <div className="booking-card">
            <span className="booking-icon">
              ❌
            </span>

            <div>
              <p>Cancelled</p>
              <h3>{cancelledBookings}</h3>
            </div>
          </div>


          <div className="booking-card">
            <span className="booking-icon">
              ✅
            </span>

            <div>
              <p>Completed</p>
              <h3>{completedBookings}</h3>
            </div>
          </div>

        </div>

      </section>


      {/* popular destinations */}

      <section className="popular-destinations">

        <div className="section-header">
          <h2>Popular Destinations</h2>
          <p>Most popular travel destinations</p>
        </div>


        <div className="destination-cards">

          {popularDestinations.length === 0 ? (
            <p>No booking data available.</p>
          ) : (
            popularDestinations
              .slice(0, 4)
              .map((item, index) => (

                <div
                  className="destination-card"
                  key={item.destination}
                >

                  <span className="destination-icon">

                    {index === 0
                      ? "🏖️"
                      : index === 1
                      ? "🌴"
                      : index === 2
                      ? "🏔️"
                      : "🏙️"}

                  </span>


                  <div>

                    <h3>
                      {item.destination}
                    </h3>

                    <p>
                      {item.count}{" "}
                      {item.count === 1
                        ? "booking"
                        : "bookings"}
                    </p>

                  </div>

                </div>

              ))
          )}

        </div>

      </section>


      {/* charts */}

      <section className="dashboard-charts">

        {/* booking status chart */}

        <div className="chart-card">

          <div className="chart-header">
            <h2>Booking Status</h2>
            <p>
              Current booking status distribution
            </p>
          </div>


          <div className="bar-chart">

            {bookingChartData.map((item) => {

              const barWidth =
                (item.value /
                  maxBookingCount) *
                100;

              return (
                <div
                  className="chart-row"
                  key={item.name}
                >

                  <div className="chart-label">
                    {item.name}
                  </div>


                  <div className="chart-track">

                    <div
                      className={`chart-bar ${item.className}`}
                      style={{
                        width: `${barWidth}%`,
                      }}
                    ></div>

                  </div>


                  <div className="chart-value">
                    {item.value}
                  </div>

                </div>
              );

            })}

          </div>

        </div>


        {/* popular destinations charts */}

        <div className="chart-card">

          <div className="chart-header">
            <h2>Popular Destinations</h2>
            <p>
              Destinations with the most bookings
            </p>
          </div>


          <div className="bar-chart">

            {popularDestinations.length === 0 ? (

              <p className="chart-empty">
                No booking data available.
              </p>

            ) : (

              popularDestinations.map((item) => {

                const barWidth =
                  (item.count /
                    maxDestinationCount) *
                  100;

                return (
                  <div
                    className="chart-row"
                    key={item.destination}
                  >

                    <div className="chart-label destination-chart-label">
                      {item.destination}
                    </div>


                    <div className="chart-track">

                      <div
                        className="chart-bar destination-bar"
                        style={{
                          width: `${barWidth}%`,
                        }}
                      ></div>

                    </div>


                    <div className="chart-value">
                      {item.count}
                    </div>

                  </div>
                );

              })

            )}

          </div>

        </div>

      </section>

    </main>
  );
} 