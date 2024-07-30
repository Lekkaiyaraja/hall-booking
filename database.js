const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // For in-memory database. Use a file for persistent storage.

db.serialize(() => {
    // Create rooms table
    db.run(`CREATE TABLE rooms (
        roomId INTEGER PRIMARY KEY AUTOINCREMENT,
        numberOfSeats INTEGER,
        amenities TEXT,
        pricePerHour REAL
    )`);

    // Create bookings table
    db.run(`CREATE TABLE bookings (
        bookingId INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT,
        date TEXT,
        startTime TEXT,
        endTime TEXT,
        roomId INTEGER,
        bookingDate TEXT,
        status TEXT,
        FOREIGN KEY(roomId) REFERENCES rooms(roomId)
    )`);

    // Create customers table
    db.run(`CREATE TABLE customers (
        name TEXT PRIMARY KEY
    )`);

    // Create customer_bookings table (many-to-many relationship)
    db.run(`CREATE TABLE customer_bookings (
        customerName TEXT,
        bookingId INTEGER,
        FOREIGN KEY(customerName) REFERENCES customers(name),
        FOREIGN KEY(bookingId) REFERENCES bookings(bookingId)
    )`);
});

module.exports = db;
