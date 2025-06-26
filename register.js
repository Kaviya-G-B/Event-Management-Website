async function loadEvents() {
    const res = await fetch("http://localhost:3000/events");
    const data = await res.json();
    const container = document.getElementById("eventCheckboxes");
    container.innerHTML = "";
  
    data.forEach(e => {
      e.eventStructure.forEach(sub => {
        const section = document.createElement("div");
        section.className = "event-column";
  
        const header = document.createElement("h3");
        header.textContent = sub.subEvent;
        section.appendChild(header);
  
        const list = document.createElement("ul");
        list.classList.add("checkbox-list");
  
        sub.events.forEach(evt => {
          const li = document.createElement("li");
          li.innerHTML = `
            <label>
              <input type="checkbox" name="events" value="${evt}"> ${evt}
            </label>
          `;
          list.appendChild(li);
        });
  
        section.appendChild(list);
        container.appendChild(section);
      });
    });
  }
  
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const name = document.getElementById("candidateName").value;
    const phone = document.getElementById("phoneNumber").value;
    const email = document.getElementById("email").value;
    const college = document.getElementById("collegeName").value;
    const events = Array.from(document.querySelectorAll("input[name='events']:checked")).map(cb => cb.value);
  
    await fetch("http://localhost:3000/registrations", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, college, events })
    });
  
    alert("Registered Successfully!");
    document.getElementById("registerForm").reset();
  });
  
  loadEvents();
  