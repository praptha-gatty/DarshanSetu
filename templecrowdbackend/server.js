const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());   // required for parse the json ....this is for booking 

const PORT = 3000;


// Connect to SQLite database

const db = new Database("darshan.db");

console.log("Database connected successfully");


// Create temples table

db.prepare(`
    CREATE TABLE IF NOT EXISTS temples (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT,
        image TEXT,
        officialWebsite TEXT,
        mapLink TEXT
    )
`).run();

console.log("Temples table ready");
// Create sessions table

db.prepare(`
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temple_id INTEGER NOT NULL,
        session_name TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        available_slots INTEGER NOT NULL,
        FOREIGN KEY (temple_id) REFERENCES temples(id)
    )
`).run();

console.log("Sessions table ready");
// Create bookings table

db.prepare(`
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temple_id INTEGER NOT NULL,
        session_id INTEGER NOT NULL,
        visitor_name TEXT NOT NULL,
        contact TEXT NOT NULL,
        visitors INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'Booked',
        FOREIGN KEY (temple_id) REFERENCES temples(id),
        FOREIGN KEY (session_id) REFERENCES sessions(id)
    )
`).run();

console.log("Bookings table ready");
// Insert session data

const insertSession = db.prepare(`
    INSERT INTO sessions
    (temple_id, session_name, date, time, capacity, available_slots)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const sessionCount = db
    .prepare("SELECT COUNT(*) AS count FROM sessions")
    .get();

if (sessionCount.count === 0) {

    // Kukke Subrahmanya
    insertSession.run(1, "Morning", "2026-08-20", "6:00 AM - 8:00 AM", 50, 50);
    insertSession.run(1, "Afternoon", "2026-08-20", "12:00 PM - 2:00 PM", 50, 50);
    insertSession.run(1, "Evening", "2026-08-20", "5:00 PM - 7:00 PM", 50, 50);

    // Dharmasthala
    insertSession.run(2, "Morning", "2026-08-20", "6:30 AM - 8:30 AM", 50, 50);
    insertSession.run(2, "Afternoon", "2026-08-20", "12:30 PM - 2:30 PM", 50, 50);
    insertSession.run(2, "Evening", "2026-08-20", "5:30 PM - 7:30 PM", 50, 50);

    // Kateel
    insertSession.run(3, "Morning", "2026-08-20", "6:00 AM - 8:00 AM", 50, 50);
    insertSession.run(3, "Afternoon", "2026-08-20", "12:00 PM - 2:00 PM", 50, 50);
    insertSession.run(3, "Evening", "2026-08-20", "5:00 PM - 7:00 PM", 50, 50);

    // Udupi Krishna Temple
    insertSession.run(4, "Morning", "2026-08-20", "5:30 AM - 7:30 AM", 50, 50);
    insertSession.run(4, "Afternoon", "2026-08-20", "12:00 PM - 2:00 PM", 50, 50);
    insertSession.run(4, "Evening", "2026-08-20", "6:00 PM - 8:00 PM", 50, 50);

    // Gokarna Mahabaleshwar
    insertSession.run(5, "Morning", "2026-08-20", "6:00 AM - 8:00 AM", 50, 50);
    insertSession.run(5, "Afternoon", "2026-08-20", "12:00 PM - 2:00 PM", 50, 50);
    insertSession.run(5, "Evening", "2026-08-20", "5:00 PM - 7:00 PM", 50, 50);

    console.log("15 sessions inserted successfully");
}
// GET all sessions
app.get("/api/sessions", (req, res) => {

    const sessions = db.prepare(`
        SELECT
            sessions.*,
            temples.name AS temple_name
        FROM sessions
        JOIN temples
        ON sessions.temple_id = temples.id
    `).all();

    res.json(sessions);

});




const insertTemple = db.prepare(`
    INSERT INTO temples
    (name, location, description, image, officialWebsite, mapLink)
    VALUES (?, ?, ?, ?, ?, ?)
`);


const templeCount = db
    .prepare("SELECT COUNT(*) AS count FROM temples")
    .get();


if (templeCount.count === 0) {

    insertTemple.run(
        "Kukke Shri Subrahmanya Temple",
        "Subrahmanya, Karnataka",
        "A famous temple dedicated to Lord Subrahmanya.",
        "temple1.jpg",
        "https://www.kukke.org/",
        "https://maps.google.com/?q=Kukke+Subrahmanya+Temple"
    );

    insertTemple.run(
        "Shri Manjunatha Temple",
        "Dharmasthala, Karnataka",
        "A renowned temple dedicated to Lord Manjunatha.",
        "temple2.jpg",
        "https://www.shridharmasthala.org/",
        "https://maps.google.com/?q=Dharmasthala+Manjunatha+Temple"
    );

    insertTemple.run(
        "Sri Durga Parameshwari Temple",
        "Kateel, Karnataka",
        "A famous temple dedicated to Goddess Durga Parameshwari.",
        "temple3.jpg",
        "https://www.kateeldevi.com/",
        "https://maps.google.com/?q=Kateel+Durga+Parameshwari+Temple"
    );

    insertTemple.run(
        "Udupi Shri Krishna Temple",
        "Udupi, Karnataka",
        "A historic temple dedicated to Lord Krishna.",
        "temple4.jpg",
        "https://www.udupikrishnamutt.com/",
        "https://maps.google.com/?q=Udupi+Sri+Krishna+Temple"
    );

    insertTemple.run(
        "Mahabaleshwar Temple",
        "Gokarna, Karnataka",
        "An ancient temple dedicated to Lord Shiva.",
        "temple5.jpg",
        "https://maps.google.com/?q=Mahabaleshwar+Temple+Gokarna",
        "https://maps.google.com/?q=Mahabaleshwar+Temple+Gokarna"
    );

    console.log("5 temples inserted successfully");

}




app.get("/api/temples", (req, res) => {

    const temples = db
        .prepare("SELECT * FROM temples")
        .all();

    res.json(temples);

});


// GET one temple by ID

app.get("/api/temples/:id", (req, res) => {

    const id = req.params.id;

    const temple = db
        .prepare("SELECT * FROM temples WHERE id = ?")
        .get(id);


    if (!temple) {

        return res.status(404).json({
            message: "Temple not found"
        });

    }


    res.json(temple);

});
// Create a new booking

// Create a new booking

app.post("/api/bookings", (req, res) => {

    const {
        temple_id,
        session_id,
        visitor_name,
        contact,
        visitors
    } = req.body;


    // Validate required fields

    if (
        !temple_id ||
        !session_id ||
        !visitor_name ||
        !contact ||
        !visitors
    ) {
        return res.status(400).json({
            message: "All booking fields are required"
        });
    }


    // Convert visitors to number

    const numberOfVisitors = Number(visitors);


    if (!Number.isInteger(numberOfVisitors) || numberOfVisitors <= 0) {

        return res.status(400).json({
            message: "Number of visitors must be a positive integer"
        });

    }


    // Check session

    const session = db
        .prepare(`
            SELECT *
            FROM sessions
            WHERE id = ?
        `)
        .get(session_id);


    if (!session) {

        return res.status(404).json({
            message: "Session not found"
        });

    }


    // Make sure the session belongs to the selected temple

    if (Number(temple_id) !== session.temple_id) {

        return res.status(400).json({
            message: "Session does not belong to this temple"
        });

    }


    // Check available slots

    if (numberOfVisitors > session.available_slots) {

        return res.status(400).json({
            message: `Only ${session.available_slots} slots are available`
        });

    }


    // Create booking and reduce slots together

    const createBooking = db.transaction(() => {

        const result = db.prepare(`
            INSERT INTO bookings
            (temple_id, session_id, visitor_name, contact, visitors)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            temple_id,
            session_id,
            visitor_name,
            contact,
            numberOfVisitors
        );


        db.prepare(`
            UPDATE sessions
            SET available_slots = available_slots - ?
            WHERE id = ?
        `).run(
            numberOfVisitors,
            session_id
        );


        return result.lastInsertRowid;

    });


    const bookingId = createBooking();


    res.status(201).json({
        message: "Booking created successfully",
        bookingId: bookingId,
        remainingSlots: session.available_slots - numberOfVisitors
    });

});
// Get all bookings

app.get("/api/bookings", (req, res) => { // becuause indtaed of getting temple id it wll be called ans its name

    const bookings = db.prepare(`
        SELECT
            bookings.*,
            temples.name AS temple_name,
            sessions.session_name,
            sessions.date,
            sessions.time
        FROM bookings
        JOIN temples
            ON bookings.temple_id = temples.id
        JOIN sessions
            ON bookings.session_id = sessions.id
        ORDER BY bookings.id DESC
    `).all();

    res.json(bookings);

});
// Get one session by ID

app.get("/api/sessions/:id", (req, res) => {

    const id = req.params.id;

    const session = db.prepare(`
        SELECT
            sessions.*,
            temples.name AS temple_name
        FROM sessions
        JOIN temples
        ON sessions.temple_id = temples.id
        WHERE sessions.id = ?
    `).get(id);


    if (!session) {

        return res.status(404).json({
            message: "Session not found"
        });

    }


    res.json(session);

});
// Update a booking

app.put("/api/bookings/:id", (req, res) => {

    const bookingId = req.params.id;

    const {
        visitor_name,
        contact,
        visitors
    } = req.body;


    // Validate input

    if (!visitor_name || !contact || !visitors) {

        return res.status(400).json({
            message: "All booking fields are required"
        });

    }


    const newVisitors = Number(visitors);


    if (
        !Number.isInteger(newVisitors) ||
        newVisitors <= 0
    ) {

        return res.status(400).json({
            message: "Number of visitors must be a positive integer"
        });

    }


    // Find existing booking

    const booking = db
        .prepare(`
            SELECT *
            FROM bookings
            WHERE id = ?
        `)
        .get(bookingId);


    if (!booking) {

        return res.status(404).json({
            message: "Booking not found"
        });

    }


    // Find session

    const session = db
        .prepare(`
            SELECT *
            FROM sessions
            WHERE id = ?
        `)
        .get(booking.session_id);


    if (!session) {

        return res.status(404).json({
            message: "Session not found"
        });

    }


    // Calculate slot difference

    const difference =
        newVisitors - booking.visitors;


    // Check if enough slots are available

    if (
        difference > 0 &&
        difference > session.available_slots
    ) {

        return res.status(400).json({
            message: `Only ${session.available_slots} additional slots are available`
        });

    }


    // Update booking and slots together

    const updateBooking =
        db.transaction(() => {


            db.prepare(`
                UPDATE bookings
                SET
                    visitor_name = ?,
                    contact = ?,
                    visitors = ?
                WHERE id = ?
            `).run(
                visitor_name,
                contact,
                newVisitors,
                bookingId
            );


            db.prepare(`
                UPDATE sessions
                SET available_slots =
                    available_slots - ?
                WHERE id = ?
            `).run(
                difference,
                booking.session_id
            );

        });


    updateBooking();


    res.json({

        message: "Booking updated successfully",

        bookingId: bookingId,

        visitors: newVisitors,

        remainingSlots:
            session.available_slots - difference

    });

});
// ===============================
// DELETE / CANCEL BOOKING
// ===============================

app.delete("/api/bookings/:id", (req, res) => {

    const bookingId = req.params.id;


    // Find the booking

    const booking = db.prepare(`
        SELECT *
        FROM bookings
        WHERE id = ?
    `).get(bookingId);


    if (!booking) {

        return res.status(404).json({
            message: "Booking not found"
        });

    }


    // Delete booking and return slots

    const cancelBooking = db.transaction(() => {

        db.prepare(`
            DELETE FROM bookings
            WHERE id = ?
        `).run(bookingId);


        db.prepare(`
            UPDATE sessions
            SET available_slots =
                available_slots + ?
            WHERE id = ?
        `).run(
            booking.visitors,
            booking.session_id
        );

    });


    cancelBooking();


    res.json({
        message: "Booking cancelled successfully"
    });

});

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});