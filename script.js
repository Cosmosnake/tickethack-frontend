const searchBtn = document.getElementById("search");
const imageHolder = document.querySelector("#trains-list img");
const textHolder = document.querySelector("#trains-list p");
const trainsList = document.getElementById("trains-list");
const errorMessage = document.createElement("div");
const searchTrainsForm = document.querySelector("#search-trains form");
errorMessage.id = "errors";
errorMessage.innerHTML = "";
let bookItems = 0;
const cartAmount = document.querySelector("#cart-button span");

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  errorMessage.innerHTML = "";

  const arrival = document.getElementById("arrival").value;
  const departure = document.getElementById("departure").value;
  const date = document.getElementById("date").value;
  try {
    const response = await fetch("http://localhost:3000/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ departure, arrival, date }),
    });
    // if (!response.ok) {
    //   return;
    // }
    const responseData = await response.json();
    if (responseData.errorMessage) {
      errorMessage.textContent = responseData.errorMessage;
      searchTrainsForm.parentNode.insertBefore(errorMessage, searchTrainsForm);
      return;
    }
    console.log(responseData.trips);
    if (!responseData.trips || responseData.trips.length === 0) {
      imageHolder.src = `./images/notfound.png`;
      imageHolder.alt = `Magnifying glass`;
      textHolder.textContent = "No trip found.";
      return;
    }

    const trips = responseData.trips;
    trainsList.innerHTML = "";
    const tripElements = trips.map((trip) => {
      const extractedHours = new Date(trip.date)
        .getHours()
        .toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
      const extractedMinutes = new Date(trip.date)
        .getMinutes()
        .toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
      return `
    <div class="trip">
      <div class="destination">${trip.departure} > ${trip.arrival}</div>
      <div class="time">${extractedHours}:${extractedMinutes}</div>
      <div class="price">${trip.price}€</div>
      <button class="book">Book</button>
    </div>
  `;
    });
    trainsList.innerHTML = tripElements.join("");

    addBooking();
  } catch (error) {
    console.log(error);
  }

  // console.log(trips);
});

const arrivalElement = document.getElementById("arrival");
const departureElement = document.getElementById("departure");
const dateElement = document.getElementById("date");

arrivalElement.addEventListener("input", () => {
  errorMessage.remove();
});
departureElement.addEventListener("input", () => {
  errorMessage.remove();
});
dateElement.addEventListener("input", () => {
  errorMessage.remove();
});

const addBooking = () => {
  const bookBtns = document.querySelectorAll(".book");
  for (const bookBtn of bookBtns) {
    bookBtn.addEventListener("click", async () => {
      bookItems++;
      cartAmount.textContent = bookItems;
      // imageHolder.src = `./images/train.png`;
      // imageHolder.alt = `Train`;
      // textHolder.textContent = "It's time to book your future trip.";
      // window.location.assign("cart.html");
      const tripElement = bookBtn.closest(".trip");
      const destination = tripElement.querySelector(".destination").textContent;
      const time = tripElement.querySelector(".time").textContent;
      const price = tripElement.querySelector(".price").textContent;

      const tripInfo = {
        destination,
        time,
        price,
      };

      const response = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripInfo),
      });
    });
  }
};
