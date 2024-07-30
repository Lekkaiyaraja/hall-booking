const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let rooms = [];
let bookings = [];

// Utility function to generate unique IDs
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

// 1. Create a Room
app.post('/rooms', (req, res) => {
    const { numberOfSeats, amenities, pricePerHour } = req.body;
    const room = {
        id: generateId(),
        numberOfSeats,
        amenities,
        pricePerHour,
        name: `Room_${rooms.length + 1}`
    };
    rooms.push(room);
    res.status(201).json(room);
});

// 2. Book a Room
app.post('/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;

    // Check if the room is already booked for the given date and time
    const isBooked = bookings.some(booking =>
        booking.roomId === roomId &&
        booking.date === date &&
        ((startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime))
    );

    if (isBooked) {
        return res.status(400).json({ message: 'Room is already booked for the given date and time.' });
    }

    const booking = {
        id: generateId(),
        customerName,
        date,
        startTime,
        endTime,
        roomId,
        bookingDate: new Date().toISOString(),
        bookingStatus: 'Confirmed'
    };
    bookings.push(booking);

    // Print confirmation message
    console.log(`Booking confirmed for ${customerName} on ${date} from ${startTime} to ${endTime} in room ${roomId}`);

    res.status(201).json(booking);
});

// 3. List all Rooms with Booked Data
app.get('/rooms', (req, res) => {
    const roomsWithBookings = rooms.map(room => {
        const roomBookings = bookings.filter(booking => booking.roomId === room.id);
        return {
            ...room,
            bookings: roomBookings
        };
    });
    res.json(roomsWithBookings);
});

// 4. List all Customers with Booked Data
app.get('/customers', (req, res) => {
    const customers = bookings.map(booking => {
        const room = rooms.find(room => room.id === booking.roomId);
        return {
            customerName: booking.customerName,
            roomName: room ? room.name : 'Unknown Room',
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime
        };
    });
    res.json(customers);
});

// 5. List how many times a Customer has booked the Room
app.get('/customer-bookings/:customerName', (req, res) => {
    const { customerName } = req.params;
    const customerBookings = bookings.filter(booking => booking.customerName === customerName);
    const detailedBookings = customerBookings.map(booking => {
        const room = rooms.find(room => room.id === booking.roomId);
        return {
            customerName: booking.customerName,
            roomName: room ? room.name : 'Unknown Room',
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            bookingId: booking.id,
            bookingDate: booking.bookingDate,
            bookingStatus: booking.bookingStatus
        };
    });
    res.json(detailedBookings);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
