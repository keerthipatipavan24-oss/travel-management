import { useEffect, useState } from "react";
import "./Calendar.css";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [trips, setTrips] = useState([]);

  // load trips from localStorage
  useEffect(() => {
    const savedTrips = localStorage.getItem("trips");

    if (savedTrips) {
      setTrips(JSON.parse(savedTrips));
    }
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  // first day of current month
  const firstDay = new Date(year, month, 1).getDay();

  // total days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();


  // previous month
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };


  // next month
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };


  // go to today's date
  const goToToday = () => {
    const today = new Date();

    setCurrentDate(today);

    setSelectedDate(
      `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(
        today.getDate()
      ).padStart(2, "0")}`
    );
  };


  // format calendar date
  const formatDate = (day) => {
    return `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
  };


  // check whether a trip is active on selected date
  const getTripsForDate = (date) => {
    return trips.filter((trip) => {
      if (!trip.startDate || !trip.endDate) {
        return false;
      }

      return (
        date >= trip.startDate &&
        date <= trip.endDate
      );
    });
  };


  // check today's date
  const isToday = (day) => {
    const today = new Date();

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };


  // create calendar days
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }


  // trips for selected date
  const selectedTrips = selectedDate
    ? getTripsForDate(selectedDate)
    : [];


  return (
    <div className="calendar-page">

      {/* page header */}

      <div className="calendar-header">

        <div>
          <h1>Travel Calendar</h1>
          <p>
            View scheduled trips by date
          </p>
        </div>

        <button
          className="today-btn"
          onClick={goToToday}
        >
          Today
        </button>

      </div>


      {/* calendar */}

      <div className="calendar-main">

        {/* month navigation */}

        <div className="calendar-navigation">

          <button
            className="calendar-nav-btn"
            onClick={previousMonth}
          >
            ‹
          </button>

          <h2>
            {monthName} {year}
          </h2>

          <button
            className="calendar-nav-btn"
            onClick={nextMonth}
          >
            ›
          </button>

        </div>


        {/* calendar grid */}

        <div className="calendar-grid">

          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].map((day) => (
            <div
              key={day}
              className="calendar-weekday"
            >
              {day}
            </div>
          ))}


          {calendarDays.map((day, index) => {

            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="calendar-day empty"
                />
              );
            }

            const date = formatDate(day);

            const dayTrips =
              getTripsForDate(date);


            return (
              <div
                key={day}
                className={`calendar-day ${
                  isToday(day)
                    ? "today"
                    : ""
                } ${
                  selectedDate === date
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedDate(date)
                }
              >

                <span className="calendar-date">
                  {day}
                </span>


                {dayTrips.length > 0 && (

                  <div className="calendar-events">

                    {dayTrips
                      .slice(0, 2)
                      .map((trip) => (

                        <div
                          key={trip.id}
                          className={`calendar-event ${
                            trip.status
                              ? trip.status.toLowerCase()
                              : ""
                          }`}
                        >
                          {trip.destination}
                        </div>

                      ))}


                    {dayTrips.length > 2 && (
                      <span className="more-events">
                        +{dayTrips.length - 2} more
                      </span>
                    )}

                  </div>

                )}

              </div>
            );
          })}

        </div>


        {/* legend */}

        <div className="calendar-legend">

          <div>
            <span className="legend-dot confirmed"></span>
            Confirmed
          </div>

          <div>
            <span className="legend-dot pending"></span>
            Pending
          </div>

          <div>
            <span className="legend-dot cancelled"></span>
            Cancelled
          </div>

          <div>
            <span className="legend-dot completed"></span>
            Completed
          </div>

        </div>

      </div>


      {/* selected date details */}

      <div className="selected-date-section">

        <div className="selected-date-header">

          <div>

            <h2>
              {selectedDate
                ? new Date(
                    `${selectedDate}T00:00:00`
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )
                : "Select a date"}
            </h2>

            <p>
              {selectedDate
                ? `${selectedTrips.length} trip${
                    selectedTrips.length !== 1
                      ? "s"
                      : ""
                  } scheduled`
                : "Click a date to view scheduled trips"}
            </p>

          </div>

        </div>


        {/* no date selected */}

        {!selectedDate && (

          <div className="calendar-empty">

            <div className="empty-icon">
              📅
            </div>

            <h3>Select a date</h3>

            <p>
              Select a date from the calendar
              to view scheduled trips.
            </p>

          </div>

        )}


        {/* date selected but no trips */}

        {selectedDate &&
          selectedTrips.length === 0 && (

            <div className="calendar-empty">

              <div className="empty-icon">
                📅
              </div>

              <h3>No trips scheduled</h3>

              <p>
                There are no trips scheduled
                for this date.
              </p>

            </div>

          )}


        {/* selected Trips */}

        {selectedDate &&
          selectedTrips.length > 0 && (

            <div className="selected-bookings">

              {selectedTrips.map((trip) => (

                <div
                  key={trip.id}
                  className="calendar-booking-card"
                >

                  <div className="calendar-booking-info">

                    <div className="booking-id">
                      Trip #{trip.id}
                    </div>

                    <h3>
                      {trip.title}
                    </h3>

                    <p>
                      📍 {trip.destination}
                    </p>

                    <p>
                      📅 {trip.startDate} →{" "}
                      {trip.endDate}
                    </p>

                    <p>
                      💰 ₹
                      {Number(
                        trip.price || 0
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>


                  <div className="calendar-booking-status">

                    <span
                      className={`booking-status ${
                        trip.status
                          ? trip.status.toLowerCase()
                          : ""
                      }`}
                    >
                      {trip.status}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

      </div>

    </div>
  );
} 