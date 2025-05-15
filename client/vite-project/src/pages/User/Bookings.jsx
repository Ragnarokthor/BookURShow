import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { getAllBookings } from "../../apiCalls/bookings";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";
import QRCode from "qrcode";
import "./Bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllBookings();
      if (response.success) {
        setBookings(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDownload = async (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId);
    if (!booking) return;

    try {
      const qrData = await QRCode.toDataURL(
        `https://bookurshow.com/ticket/${booking.transactionId}`
      );

      const seatsList = booking.seats.join(", ");

      const printElement = document.createElement("div");
      printElement.className = "ticket-pdf";

      printElement.innerHTML = `
        <div class="ticket-container">
          <div class="ticket-header">
            <h1>BookURShow</h1>
            <h2>Movie Ticket</h2>
          </div>
          <div class="ticket-content">
            <div class="ticket-movie-title">${booking.show.movie.title}</div>
            <div class="ticket-info">
              <div class="ticket-info-item">
                <span class="ticket-label">Theatre:</span>
                <span class="ticket-value">${booking.show.theatre.name}</span>
              </div>
              <div class="ticket-info-item">
                <span class="ticket-label">Date & Time:</span>
                <span class="ticket-value">${moment(booking.show.date).format("MMM Do YYYY")} ${moment(booking.show.time, "HH:mm").format("hh:mm A")}</span>
              </div>
              <div class="ticket-info-item">
                <span class="ticket-label">Seats:</span>
                <span class="ticket-value">${seatsList}</span>
              </div>
              <div class="ticket-info-item">
                <span class="ticket-label">Amount:</span>
                <span class="ticket-value">
                  Rs. ${booking.seats.length * booking.show.ticketPrice}
                </span>
              </div>
            </div>
            <div class="ticket-stamp">CONFIRMED</div>
            <div class="ticket-qr">
              <img src="${qrData}" alt="QR Code" />
              <div class="ticket-id">${booking.transactionId}</div>
            </div>
          </div>
          <div class="ticket-footer">
            <p>Thank you for choosing BookURShow! Enjoy your show.</p>
            <p class="ticket-terms">This ticket is non-refundable and non-transferable.</p>
          </div>
        </div>
      `;

      document.body.appendChild(printElement);

      setTimeout(() => {
        const opt = {
          margin: 0.5,
          filename: `BookURShow-Ticket-${booking.transactionId}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        html2pdf()
          .set(opt)
          .from(printElement)
          .save()
          .then(() => {
            document.body.removeChild(printElement);
          })
          .catch((err) => {
            message.error("PDF generation failed");
            document.body.removeChild(printElement);
          });
      }, 300);
    } catch (err) {
      message.error("Error generating ticket: " + err.message);
    }
  };

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>My Bookings</h1>
      </div>

      {bookings && bookings.length > 0 ? (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-poster">
                <img
                  src={booking.show.movie.poster}
                  alt={`${booking.show.movie.title} Poster`}
                />
              </div>
              <div className="booking-details">
                <h2 className="booking-title">{booking.show.movie.title}</h2>
                <div className="booking-info">
                  <div className="booking-info-item">
                    <span className="info-label">Theatre:</span>
                    <span className="info-value">{booking.show.theatre.name}</span>
                  </div>
                  <div className="booking-info-item">
                    <span className="info-label">Seats:</span>
                    <span className="info-value">{booking.seats.join(", ")}</span>
                  </div>
                  <div className="booking-info-item">
                    <span className="info-label">Date & Time:</span>
                    <span className="info-value">
                      {moment(booking.show.date).format("MMM Do YYYY")}{" "}
                      {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                    </span>
                  </div>
                  <div className="booking-info-item">
                    <span className="info-label">Amount:</span>
                    <span className="info-value">
                      Rs. {booking.seats.length * booking.show.ticketPrice}
                    </span>
                  </div>
                  <div className="booking-info-item">
                    <span className="info-label">Booking ID:</span>
                    <span className="info-value booking-id">
                      {booking.transactionId}
                    </span>
                  </div>
                </div>
                <div className="booking-actions">
                  <Button
                    type="primary"
                    className="btn-download"
                    onClick={() => handleDownload(booking._id)}
                  >
                    Download Ticket
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-bookings">
          <div className="no-bookings-content">
            <h2>You've not booked any show yet!</h2>
            <p>Discover amazing shows and book your tickets now</p>
            <Link to="/">
              <Button type="primary" className="btn-book-now">
                Start Booking
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;