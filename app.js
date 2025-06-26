document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const mainEvent = document.getElementById("mainEvent").value.trim();
  const subEventsInput = document.getElementById("subEvents").value.trim();
  const eventDetailsInput = document.getElementById("eventDetails").value.trim();

  if (!mainEvent || !subEventsInput || !eventDetailsInput) {
    alert("Please fill in all fields.");
    return;
  }

  const subEvents = subEventsInput.split(",").map(sub => sub.trim());
  const eventLines = eventDetailsInput.split("\n").map(line => line.trim());

  const eventStructure = subEvents.map((sub, i) => ({
    subEvent: sub,
    events: eventLines[i] ? eventLines[i].split(",").map(e => e.trim()) : []
  }));

  try {
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mainEvent, eventStructure })
    });

    if (!response.ok) {
      throw new Error(`Failed to save event (Status ${response.status})`);
    }

    alert("Event Created!");
    window.location.href = "register.html";
  } catch (error) {
    console.error("Error saving event:", error);
    alert("There was an error creating the event. Please try again.");
  }
});
