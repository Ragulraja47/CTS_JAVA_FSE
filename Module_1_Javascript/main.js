// welcome message in console
console.log("Welcome to the Community Portal");

// Alert when the page is fully loaded
window.addEventListener('DOMContentLoaded', function () {
    alert("Page fully loaded! Welcome to the Community Portal.");
});

// Add category to sample event data
const events = [
    { name: "Community Workshop", date: "2025-06-10", seats: 10, category: "workshop" },
    { name: "Tech Conference", date: "2025-05-10", seats: 0, category: "workshop" }, // past and full
    { name: "Networking Event", date: "2025-07-01", seats: 5, category: "cultural" },
    { name: "Music Night", date: "2025-05-20", seats: 0, category: "music" }, // full
    { name: "Art Expo", date: "2025-08-15", seats: 20, category: "cultural" }
];

// State for filtering and searching
let currentCategory = 'all';
let currentSearch = '';

// Utility to check if event is upcoming and has seats
function isValidEvent(event) {
    const today = new Date();
    const eventDate = new Date(event.date);
    return eventDate >= today && event.seats > 0;
}

// Add new event using .push()
function addEvent(eventObj) {
    events.push(eventObj);
    renderEvents();
}

// Filter events by category and search
function getFilteredEvents() {
    let filtered = events.filter(isValidEvent);
    if (currentCategory !== 'all') {
        filtered = filtered.filter(ev => ev.category === currentCategory);
    }
    if (currentSearch.trim() !== '') {
        filtered = filtered.filter(ev => ev.name.toLowerCase().includes(currentSearch.trim().toLowerCase()));
    }
    return filtered;
}

// Use .map() to format display cards
function formatEventCard(ev) {
    return `
        <h3>${ev.name}</h3>
        <p>Date: ${ev.date}</p>
        <p>Category: ${ev.category.charAt(0).toUpperCase() + ev.category.slice(1)}</p>
        <p>Seats: <span class="seats">${ev.seats}</span></p>
        <button class="register-btn">Register</button>
    `;
}

// Display only valid events
function displayValidEvents() {
    const validEvents = events.filter(isValidEvent);
    console.log("Upcoming Events with Seats:");
    validEvents.forEach(ev => {
        console.log(`${ev.name} on ${ev.date} | Seats: ${ev.seats}`);
    });
}
displayValidEvents();

// Registration logic with error handling
function registerUserForEvent(eventName) {
    try {
        const event = events.find(ev => ev.name === eventName);
        if (!event) throw new Error("Event not found");
        if (!isValidEvent(event)) throw new Error("Event is full or in the past");
        event.seats--;
        console.log(`Registration successful for ${event.name}. Remaining seats: ${event.seats}`);
    } catch (err) {
        console.error("Registration failed:", err.message);
    }
}

// Dynamically render valid events in the HTML
function renderEvents() {
    const eventList = document.getElementById('eventList');
    if (!eventList) return;
    eventList.innerHTML = "";
    const validEvents = getFilteredEvents();
    if (validEvents.length === 0) {
        eventList.innerHTML = "<p>No upcoming events with available seats.</p>";
        return;
    }
    validEvents.map(ev => {
        const card = document.createElement('div');
        card.className = "eventCard";
        card.innerHTML = formatEventCard(ev);
        card.querySelector('.register-btn').onclick = function() {
            // Scroll to registration form and pre-fill event name
            const regFormSection = document.getElementById('registration-form');
            if (regFormSection) regFormSection.scrollIntoView({ behavior: 'smooth' });
            const eventTypeSelect = document.getElementById('eventType');
            if (eventTypeSelect) {
                // Try to select the event in the dropdown if it exists
                let found = false;
                for (let i = 0; i < eventTypeSelect.options.length; i++) {
                    if (eventTypeSelect.options[i].text === ev.name) {
                        eventTypeSelect.selectedIndex = i;
                        eventTypeSelect.value = eventTypeSelect.options[i].value;
                        found = true;
                        break;
                    }
                }
                // If not found, add a temporary option and select it
                if (!found) {
                    let tempOption = document.createElement('option');
                    tempOption.value = ev.name;
                    tempOption.text = ev.name + ' (Auto-selected)';
                    tempOption.selected = true;
                    tempOption.setAttribute('data-temp', 'true');
                    eventTypeSelect.appendChild(tempOption);
                    eventTypeSelect.value = ev.name;
                } else {
                    // Remove any previous temp options
                    for (let i = eventTypeSelect.options.length - 1; i >= 0; i--) {
                        if (eventTypeSelect.options[i].getAttribute('data-temp') === 'true') {
                            eventTypeSelect.remove(i);
                        }
                    }
                }
            }
            // Store selected event in a variable for registration
            window.selectedEventForRegistration = ev.name;
        };
        eventList.appendChild(card);
    });
}

// Add event form handler
window.addEventListener('DOMContentLoaded', function() {
    const addForm = document.getElementById('addEventForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('newEventName').value.trim();
            const date = document.getElementById('newEventDate').value;
            const category = document.getElementById('newEventCategory').value;
            const seats = parseInt(document.getElementById('newEventSeats').value, 10);
            if (!name || !date || !category || isNaN(seats) || seats < 1) {
                alert('Please fill out all fields correctly.');
                return;
            }
            addEvent({ name, date, category, seats });
            addForm.reset();
        });
    }
    // Category filter
    const catFilter = document.getElementById('categoryFilter');
    if (catFilter) {
        catFilter.addEventListener('change', function() {
            currentCategory = this.value;
            renderEvents();
        });
    }
    // Search by name
    const searchInput = document.getElementById('searchEvent');
    if (searchInput) {
        searchInput.addEventListener('keydown', function() {
            setTimeout(() => {
                currentSearch = this.value;
                renderEvents();
            }, 0);
        });
    }
    // Intercept registration form submit to reduce seat count for selected event
    const regForm = document.getElementById('eventForm');
    if (regForm) {
        regForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const date = document.getElementById("date").value;
            const eventType = document.getElementById("eventType").value;
            const message = document.getElementById("message").value;
            var isvalid = true;
            if (!name.length > 2) {
                alert("Please enter a valid name");
                isvalid = false;
            }
            const emailpattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if (!email.match(emailpattern)) {
                alert("Please enter a valid email address");
                isvalid = false;
            }
            if (!date) {
                alert("Please select a date");
                isvalid = false;
            }
            if (eventType === "") {
                alert("Please select an event type");
                isvalid = false;
            }
            if (!message || message.length < 10) {
                alert("Please enter a valid message");
                isvalid = false;
            }
            if (isvalid) {
                // Reduce seat count for the selected event
                let eventName = window.selectedEventForRegistration || eventType;
                let eventObj = events.find(ev => ev.name === eventName);
                if (eventObj && eventObj.seats > 0) {
                    eventObj.seats--;
                    alert("Registration successful!");
                } else {
                    alert("Sorry, this event is full or not found.");
                }
                // Reset the form
                regForm.reset();
                renderEvents();
            } else {
                alert("Please fill out the form correctly.");
            }
        });
    }
});

window.addEventListener('DOMContentLoaded', renderEvents);