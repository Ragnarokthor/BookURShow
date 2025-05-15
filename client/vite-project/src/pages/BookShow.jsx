import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { getShowById } from "../apiCalls/shows";
import { useNavigate, useParams } from "react-router-dom";
import { message, Card, Row, Col, Button } from "antd";
import moment from "moment";
import { bookShow, makePayment } from "../apiCalls/bookings";
import "./BookShow.css"; // Create this CSS file for component styles

// Modern Stripe imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51RLiByBBCmYxHXb4BVArAdapWm5qGfODhgDQ7FyLKgVdOZHAYB2XLKs1SFMTlbPT4rbeNhYxxOLFGWsBnx9EowNl00spFhagpw");

// Checkout form component that uses modern Stripe Elements
const CheckoutForm = ({ onPaymentSuccess, amount, selectedSeats, show }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [paymentError, setPaymentError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        // Create payment intent on component mount
        if (selectedSeats.length > 0) {
            createPaymentIntent();
        }
    }, [selectedSeats, amount]);

    const createPaymentIntent = async () => {
        try {
            dispatch(showLoading());
            // You'll need to create a new API endpoint for this
            const response = await makePayment(
                null, // No token needed for modern API
                amount,
                "create_intent" // Add this flag to your backend to differentiate between old and new API
            );
            
            if (response.success) {
                setClientSecret(response.clientSecret);
            } else {
                message.error(response.message || "Failed to initialize payment");
            }
            dispatch(hideLoading());
        } catch (err) {
            message.error(err.message);
            dispatch(hideLoading());
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setLoading(true);
        setPaymentError(null);

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: "Customer",
                },
            },
        });

        if (error) {
            setPaymentError(error.message);
            setLoading(false);
        } else if (paymentIntent.status === "succeeded") {
            message.success("Payment successful!");
            // Call the onPaymentSuccess with the payment intent ID as transaction ID
            onPaymentSuccess(paymentIntent.id);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="premium-stripe-form">
            <div className="premium-card-element-container">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#424770",
                                "::placeholder": {
                                    color: "#aab7c4",
                                },
                            },
                            invalid: {
                                color: "#9e2146",
                            },
                        },
                    }}
                />
            </div>
            
            {paymentError && (
                <div className="premium-payment-error">
                    {paymentError}
                </div>
            )}
            
            <div className="premium-payment-button-container">
                <Button 
                    type="primary" 
                    shape="round" 
                    size="large" 
                    block
                    htmlType="submit"
                    disabled={!stripe || loading}
                    className="premium-payment-btn"
                >
                    {loading ? "Processing..." : "Pay Now"}
                </Button>
            </div>
        </form>
    );
};

const BookShow = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [show, setShow] = useState();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    const getData = async () => {
        try {
            dispatch(showLoading());
            const response = await getShowById({ showId: params.id });
            if (response.success) {
                setShow(response.data);
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        } catch (err) {
            message.error(err.message);
            dispatch(hideLoading());
        }
    };

    // Function to Book
    const book = async (transactionId) => {
        try {
            dispatch(showLoading());
            const response = await bookShow({
                show: params.id,
                transactionId,
                seats: selectedSeats,
                user: user._id,
            });
            if (response.success) {
                message.success("Show Booking done!");
                navigate("/profile");
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        } catch (err) {
            message.error(err.message);
            dispatch(hideLoading());
        }
    };

    // Payment success handler for the new Stripe integration
    const handlePaymentSuccess = (paymentIntentId) => {
        // Use the payment intent ID as the transaction ID
        book(paymentIntentId);
    };

    const getSeats = () => {
        if (!show) return null;

        const columns = 12;
        const totalSeats = show.totalSeats; // 200
        const rows = Math.ceil(totalSeats / columns); // 17

        // Generate rows and seats using regular loops
        const seatRows = [];

        for (let row = 0; row < rows; row++) {
            const seats = [];

            for (let column = 0; column < columns; column++) {
                const seatNumber = row * columns + column + 1;

                if (seatNumber <= totalSeats) {
                    let seatClass = "premium-seat-btn";

                    if (selectedSeats.includes(seatNumber)) {
                        seatClass += " selected";
                    }
                    if (show.bookedSeats.includes(seatNumber)) {
                        seatClass += " booked";
                    }

                    seats.push(
                        <li key={`seat-${seatNumber}`}>
                            <button
                                onClick={() => {
                                    if (selectedSeats.includes(seatNumber)) {
                                        setSelectedSeats(
                                            selectedSeats.filter(
                                                (curSeatNumber) => curSeatNumber !== seatNumber
                                            )
                                        );
                                    } else {
                                        setSelectedSeats([...selectedSeats, seatNumber]);
                                    }
                                }}
                                className={seatClass}
                                disabled={show.bookedSeats.includes(seatNumber)}
                            >
                                {seatNumber}
                            </button>
                        </li>
                    );
                }
            }

            seatRows.push(
                <div key={`row-${row}`} className="premium-seat-row">
                    {seats}
                </div>
            );
        }

        return (
            <div className="premium-seat-container">
                <div className="premium-screen-container">
                    <p className="premium-screen-text">
                        Screen this side, you will be watching in this direction
                    </p>
                    <div className="premium-screen-div"></div>
                </div>

                <div className="premium-seats-wrapper">
                    <ul className="premium-seat-grid">{seatRows}</ul>
                </div>

                <div className="premium-booking-summary">
                    <div className="premium-summary-item selected-seats">
                        <span className="premium-summary-label">Selected Seats:</span>
                        <span className="premium-summary-value">{selectedSeats.join(", ")}</span>
                    </div>
                    <div className="premium-summary-item total-price">
                        <span className="premium-summary-label">Total Price:</span>
                        <span className="premium-summary-value">
                            Rs. {selectedSeats.length * show.ticketPrice}
                        </span>
                    </div>
                </div>

                <div className="premium-legend">
                    <div className="premium-legend-item">
                        <div className="premium-legend-box available"></div>
                        <span>Available</span>
                    </div>
                    <div className="premium-legend-item">
                        <div className="premium-legend-box selected"></div>
                        <span>Selected</span>
                    </div>
                    <div className="premium-legend-item">
                        <div className="premium-legend-box booked"></div>
                        <span>Booked</span>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="premium-book-show">
            {show && (
                <div className="premium-show-container">
                    <div className="premium-show-header">
                        <div className="premium-movie-details">
                            <h1 className="premium-movie-title">{show.movie.title}</h1>
                            <p className="premium-theatre-info">
                                {show.theatre.name}, {show.theatre.address}
                            </p>
                        </div>
                        <div className="premium-show-info">
                            <div className="premium-show-info-item">
                                <span className="premium-info-label">Show Name:</span>
                                <span className="premium-info-value">{show.name}</span>
                            </div>
                            <div className="premium-show-info-item">
                                <span className="premium-info-label">Date & Time:</span>
                                <span className="premium-info-value">
                                    {moment(show.date).format("MMM Do YYYY")} at{" "}
                                    {moment(show.time, "HH:mm").format("hh:mm A ")}
                                </span>
                            </div>
                            <div className="premium-show-info-item">
                                <span className="premium-info-label">Ticket Price:</span>
                                <span className="premium-info-value">Rs. {show.ticketPrice}/-</span>
                            </div>
                            <div className="premium-show-info-item">
                                <span className="premium-info-label">Available Seats:</span>
                                <span className="premium-info-value">
                                    {show.totalSeats - show.bookedSeats.length} / {show.totalSeats}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="premium-booking-content">
                        {getSeats()}

                        {selectedSeats.length > 0 && (
                            <div className="premium-payment-section">
                                <h2 className="premium-section-title">Complete Payment</h2>
                                <Elements stripe={stripePromise}>
                                    <CheckoutForm 
                                        onPaymentSuccess={handlePaymentSuccess} 
                                        amount={selectedSeats.length * show.ticketPrice * 100}
                                        selectedSeats={selectedSeats}
                                        show={show}
                                    />
                                </Elements>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookShow;