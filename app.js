const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());

/**
 * Book a Room
 * POST /bookings
 */
app.post('/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;

    // Check if room exists
    db.get(`SELECT * FROM rooms WHERE roomId = ?`, [roomId], (err, room) => {
        if (err) return res.status(500).send(err.message);
        if (!room) return res.status(404).send('Room not found');

        // Check for booking conflicts
        db.get(`SELECT * FROM bookings WHERE roomId = ? AND date = ? AND ((startTime >= ? AND startTime < ?) OR (endTime > ? AND endTime <= ?))`,
            [roomId, date, startTime, endTime, startTime, endTime], (err, existingBooking) => {
                if (err) return res.status(500).send(err.message);
                if (existingBooking) return res.status(400).send('Room is already booked for the selected time slot');

                // Add customer if not exists
                db.run(`INSERT OR IGNORE INTO customers (name) VALUES (?)`, [customerName]);

                // Create booking
                const bookingDate = new Date().toISOString();
                db.run(`INSERT INTO bookings (customerName, date, startTime, endTime, roomId, bookingDate, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [customerName, date, startTime, endTime, roomId, bookingDate, 'Booked'],
                    function(err) {
                        if (err) return res.status(500).send(err.message);
                        
                        // Link customer to booking
                        db.run(`INSERT INTO customer_bookings (customerName, bookingId) VALUES (?, ?)`, [customerName, this.lastID]);

                        res.status(201).send({
                            bookingId: this.lastID,
                            customerName,
                            date,
                            startTime,
                            endTime,
                            roomId,
                            bookingDate,
                            status: 'Booked'
                        });
                    });
            });
    });
});

/**
 * List how many times a customer has booked the room
 * GET /customers/:name/bookings
 */
app.get('/customers/:name/bookings', (req, res) => {
    const { name } = req.params;

    // Retrieve customer's bookings
    db.all(`SELECT b.bookingId, b.customerName, b.date, b.startTime, b.endTime, b.roomId, b.bookingDate, b.status, r.numberOfSeats, r.amenities, r.pricePerHour
            FROM bookings b
            JOIN rooms r ON b.roomId = r.roomId
            WHERE b.customerName = ?`,
        [name], (err, rows) => {
            if (err) return res.status(500).send(err.message);
            if (rows.length === 0) return res.status(404).send('Customer not found or no bookings for this customer');

            const bookings = rows.map(row => ({
                bookingId: row.bookingId,
                customerName: row.customerName,
                date: row.date,
                startTime: row.startTime,
                endTime: row.endTime,
                roomId: row.roomId,
                bookingDate: row.bookingDate,
                status: row.status,
                numberOfSeats: row.numberOfSeats,
                amenities: row.amenities.split(', '),
                pricePerHour: row.pricePerHour
            }));

            res.status(200).send(bookings);
        });
});

/**
 * Initialize the server
 */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
