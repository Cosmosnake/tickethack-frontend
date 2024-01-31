const searchBtn = document.getElementById("search");
const imageHolder = document.querySelector("#trains-list img");
const textHolder = document.querySelector("#trains-list p");
const trainsList = document.getElementById("trains-list");

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const arrival = document.getElementById("arrival").value;
  const departure = document.getElementById("departure").value;
  const date = document.getElementById("date").value;
  const response = await fetch("http://localhost:3000/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ departure, arrival, date }),
  });

  const responseData = await response.json();
  if (!responseData.trips) {
    imageHolder.src = `./images/train.png`;
    imageHolder.alt = `Magnifying glass`;
    textHolder.textContent = "No trip found";
    return;
  }

  const trips = responseData.trips;
  trainsList.innerHTML = "";
  const tripElements = trips.map((trip) => {
    const extractedHours = new Date(trip.date).getHours();
    const extractedMinutes = new Date(trip.date).getMinutes();
    return `
    <div class="trip">
      <div class="destination">${trip.departure} > ${trip.arrival}</div>
      <div class="time">${extractedHours}:${extractedMinutes}</div>
      <div class="price">${trip.price}</div>
      <button class="book">Book</button>
    </div>
  `;
  });

  trainsList.innerHTML = tripElements.join("");

  // console.log(trips);
});
