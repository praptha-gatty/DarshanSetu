// Get session ID from URL

const params =
    new URLSearchParams(window.location.search);

const sessionId =
    params.get("sessionId");


// Get HTML elements

const selectedSession =
    document.getElementById("selectedSession");

const bookingForm =
    document.getElementById("bookingForm");

const bookingMessage =
    document.getElementById("bookingMessage");


// Check session ID

if (!sessionId) {

    selectedSession.innerHTML =
        "<p>Session not selected.</p>";

    bookingForm.style.display = "none";

}


// Get selected session

fetch(`http://localhost:3000/api/sessions/${sessionId}`)

    .then(response => {

        if (!response.ok) {
            throw new Error("Session not found");
        }

        return response.json();

    })

    .then(session => {

        selectedSession.innerHTML = `

            <h3>${session.temple_name}</h3>

            <p>
                <strong>Session:</strong>
                ${session.session_name}
            </p>

            <p>
                <strong>Date:</strong>
                ${session.date}
            </p>

            <p>
                <strong>Time:</strong>
                ${session.time}
            </p>

            <p>
                <strong>Available Slots:</strong>
                ${session.available_slots}
            </p>

        `;

        bookingForm.dataset.templeId =
            session.temple_id;

    })

    .catch(error => {

        selectedSession.innerHTML =
            `<p>${error.message}</p>`;

    });


// Submit booking

bookingForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const visitorName =
        document.getElementById("visitorName").value;

    const visitorContact =
        document.getElementById("visitorContact").value;

    const visitorCount =
        document.getElementById("visitorCount").value;


    const templeId =
        bookingForm.dataset.templeId;


    fetch("http://localhost:3000/api/bookings", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            temple_id: Number(templeId),

            session_id: Number(sessionId),

            visitor_name: visitorName,

            contact: visitorContact,

            visitors: Number(visitorCount)

        })

    })

    .then(response => response.json())

    .then(data => {

        bookingMessage.textContent =
            data.message;

        if (data.bookingId) {

            bookingMessage.textContent =
                `Booking successful! Booking ID: ${data.bookingId}`;

            bookingForm.reset();

        }

    })

    .catch(error => {

        console.error(
            "Booking error:",
            error
        );

        bookingMessage.textContent =
            "Something went wrong. Please try again.";

    });

});