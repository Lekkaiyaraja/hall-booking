# hall-booking

This is a Node.js-based API for managing hall bookings. The API allows users to create rooms, book them, and retrieve information about bookings and customers. It is built using Express.js and provides various endpoints to handle the necessary operations.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Room Management**: Create rooms with specific amenities, seat capacity, and hourly pricing.
- **Booking Management**: Book rooms for specific dates and times, ensuring no double bookings.
- **Customer and Booking Data**: Retrieve detailed information about all rooms, bookings, and customers.
- **Customer Booking History**: Track how many times a customer has booked rooms and view the details of each booking.

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- Git installed on your machine.

### Steps

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Lekkaiyaraja/hall-booking.git
    cd hall-booking
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the server:**
    ```bash
    node src/index.js
    ```
   The server will start on `http://localhost:3000`.

## Usage

### Running the Server

After completing the installation, run the following command to start the server:

```bash
node src/index.js
