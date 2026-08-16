// ===============================
// TEMPLE SECTION
// ===============================

const templeContainer =
    document.getElementById("templeContainer");


fetch("http://localhost:3000/api/temples")

    .then(response => response.json())

    .then(temples => {

        templeContainer.innerHTML = "";

        temples.forEach(temple => {

            const card =
                document.createElement("div");

            card.classList.add("temple-card");


            card.innerHTML = `
                <img
                    src="${temple.image}"
                    alt="${temple.name}"
                    class="temple-image"
                >

                <div class="temple-card-content">

                    <h3>${temple.name}</h3>

                    <p>${temple.location}</p>

                    <p>${temple.description}</p>

                    <a
                        href="${temple.officialWebsite}"
                        target="_blank"
                        class="temple-btn"
                    >
                        Official Website
                    </a>

                    <a
                        href="${temple.mapLink}"
                        target="_blank"
                        class="temple-btn"
                    >
                        View on Map
                    </a>

                </div>
            `;


            templeContainer.appendChild(card);

        });

    })

    .catch(error => {

        console.error(
            "Error fetching temples:",
            error
        );

    });



// ===============================
// SESSION SECTION
// ===============================

const sessionContainer =
    document.getElementById("sessionContainer");

const searchInput =
    document.getElementById("searchInput");

const sessionFilter =
    document.getElementById("sessionFilter");


let allSessions = [];



// ===============================
// LOAD SESSIONS
// ===============================

function loadSessions() {

    fetch("http://localhost:3000/api/sessions")

        .then(response => response.json())

        .then(sessions => {

            allSessions = sessions;

            displaySessions(allSessions);

        })

        .catch(error => {

            console.error(
                "Error fetching sessions:",
                error
            );

        });

}


// Load sessions when page opens

loadSessions();



// ===============================
// DISPLAY SESSIONS
// ===============================

function displaySessions(sessions) {

    sessionContainer.innerHTML = "";


    sessions.forEach(session => {

        const card =
            document.createElement("div");

        card.classList.add("session-card");


        card.innerHTML = `
            <h3>${session.temple_name}</h3>

            <h4>${session.session_name}</h4>

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

            <a
                href="booking.html?sessionId=${session.id}"
                class="book-btn"
            >
                Book Now
            </a>
        `;


        sessionContainer.appendChild(card);

    });

}



// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    filterSessions
);



// ===============================
// FILTER
// ===============================

sessionFilter.addEventListener(
    "change",
    filterSessions
);



// ===============================
// SEARCH + FILTER FUNCTION
// ===============================

function filterSessions() {

    const searchText =
        searchInput.value.toLowerCase();


    const selectedFilter =
        sessionFilter.value;


    const filteredSessions =
        allSessions.filter(session => {

            const matchesSearch =
                session.temple_name
                    .toLowerCase()
                    .includes(searchText);


            const matchesFilter =
                selectedFilter === "all" ||
                session.session_name
                    .toLowerCase() === selectedFilter;


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    displaySessions(filteredSessions);

}



// ===============================
// MY BOOKINGS SECTION
// ===============================

const bookingContainer =
    document.getElementById("bookingContainer");



// ===============================
// LOAD BOOKINGS
// ===============================

function loadBookings() {

    fetch("http://localhost:3000/api/bookings")

        .then(response => response.json())

        .then(bookings => {

            bookingContainer.innerHTML = "";


            if (bookings.length === 0) {

                bookingContainer.innerHTML =
                    "<p>No bookings yet.</p>";

                return;

            }


            bookings.forEach(booking => {

                const card =
                    document.createElement("div");

                card.classList.add(
                    "booking-card"
                );


                card.innerHTML = `

                    <h3>
                        ${booking.temple_name}
                    </h3>

                    <p>
                        <strong>Visitor:</strong>
                        ${booking.visitor_name}
                    </p>

                    <p>
                        <strong>Session:</strong>
                        ${booking.session_name}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${booking.date}
                    </p>

                    <p>
                        <strong>Time:</strong>
                        ${booking.time}
                    </p>

                    <p>
                        <strong>Visitors:</strong>
                        ${booking.visitors}
                    </p>

                    <p>
                        <strong>Contact:</strong>
                        ${booking.contact}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${booking.status}
                    </p>


                    <button
                        class="update-booking-btn"
                        data-id="${booking.id}"
                    >
                        Update
                    </button>


                    <button
                        class="cancel-booking-btn"
                        data-id="${booking.id}"
                    >
                        Cancel
                    </button>

                `;


                bookingContainer.appendChild(card);

            });

        })

        .catch(error => {

            console.error(
                "Error fetching bookings:",
                error
            );

        });

}



// Load bookings when page opens

loadBookings();



// ===============================
// UPDATE BOOKING
// ===============================

bookingContainer.addEventListener(
    "click",
    (event) => {

        if (
            !event.target.classList.contains(
                "update-booking-btn"
            )
        ) {
            return;
        }


        const bookingId =
            event.target.dataset.id;


        const visitorName =
            prompt(
                "Enter new visitor name:"
            );


        if (!visitorName) {
            return;
        }


        const contact =
            prompt(
                "Enter new contact number:"
            );


        if (!contact) {
            return;
        }


        const visitors =
            prompt(
                "Enter new number of visitors:"
            );


        if (!visitors) {
            return;
        }


        fetch(
            `http://localhost:3000/api/bookings/${bookingId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    visitor_name:
                        visitorName,

                    contact:
                        contact,

                    visitors:
                        Number(visitors)

                })
            }
        )

        .then(response => response.json())

        .then(data => {

            alert(data.message);

            loadBookings();

            loadSessions();

        })

        .catch(error => {

            console.error(
                "Update error:",
                error
            );

        });

    }
);



// ===============================
// CANCEL BOOKING
// ===============================

bookingContainer.addEventListener(
    "click",
    (event) => {

        if (
            !event.target.classList.contains(
                "cancel-booking-btn"
            )
        ) {
            return;
        }


        const bookingId =
            event.target.dataset.id;


        const confirmCancel =
            confirm(
                "Are you sure you want to cancel this booking?"
            );


        if (!confirmCancel) {
            return;
        }


        fetch(
            `http://localhost:3000/api/bookings/${bookingId}`,
            {
                method: "DELETE"
            }
        )

        .then(response => response.json())

        .then(data => {

            alert(data.message);

            loadBookings();

            loadSessions();

        })

        .catch(error => {

            console.error(
                "Cancel error:",
                error
            );

        });

    }
);



// ===============================
// HERO BUTTONS
// ===============================

const exploreTemplesBtn =
    document.getElementById(
        "exploreTemplesBtn"
    );

const viewSessionsBtn =
    document.getElementById(
        "viewSessionsBtn"
    );


exploreTemplesBtn.addEventListener(
    "click",
    () => {

        document.getElementById("temples")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


viewSessionsBtn.addEventListener(
    "click",
    () => {

        document.getElementById("sessions")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);