async function searchCandidate() {
    const query = document.getElementById("searchInput").value.toLowerCase();
  
    const [regRes, eventRes] = await Promise.all([
      fetch("http://localhost:3000/registrations"),
      fetch("http://localhost:3000/events")
    ]);
  
    const registrations = await regRes.json();
    const eventData = await eventRes.json();
  
    const results = registrations.filter(r => r.name.toLowerCase().includes(query));
    const resultContainer = document.getElementById("results");
    resultContainer.innerHTML = "";
  
    if (results.length === 0) {
      resultContainer.innerHTML = "<p>No matching candidates found.</p>";
      return;
    }
  
    results.forEach(candidate => {
      const wrapper = document.createElement("div");
  
      const header = document.createElement("h3");
      header.textContent = candidate.name;
      wrapper.appendChild(header);
  
      const info = document.createElement("p");
      info.innerHTML = `
        <strong>Phone:</strong> ${candidate.phone || ''}<br>
        <strong>Email:</strong> ${candidate.email || ''}<br>
        <strong>College:</strong> ${candidate.college || ''}
      `;
      wrapper.appendChild(info);
  
      // Map to hold sub-events as keys and registered events as values
      const subEventMap = {};
  
      eventData.forEach(mainEvent => {
        mainEvent.eventStructure.forEach(sub => {
          const filtered = sub.events.filter(evt => candidate.events.includes(evt));
          subEventMap[sub.subEvent] = filtered;
        });
      });
  
      const subEventNames = Object.keys(subEventMap);
      const maxRows = Math.max(...subEventNames.map(sub => subEventMap[sub].length));
  
      const table = document.createElement("table");
      table.border = "1";
      table.style.borderCollapse = "collapse";
      table.cellPadding = "10";
      table.style.marginTop = "10px";
      table.style.width = "100%";
  
      // Header row
      const headerRow = document.createElement("tr");
      subEventNames.forEach(sub => {
        const th = document.createElement("th");
        th.textContent = sub;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);
  
      // Rows
      for (let i = 0; i < maxRows; i++) {
        const row = document.createElement("tr");
        subEventNames.forEach(sub => {
          const td = document.createElement("td");
          td.textContent = subEventMap[sub][i] || "";
          row.appendChild(td);
        });
        table.appendChild(row);
      }
  
      wrapper.appendChild(table);
  
      const actions = document.createElement("div");
      actions.innerHTML = `
        <button onclick="editCandidate(${candidate.id})">Edit</button>
        <button onclick="deleteCandidate(${candidate.id})">Delete</button>
      `;
      actions.style.marginTop = "10px";
      wrapper.appendChild(actions);
  
      wrapper.style.border = "1px solid #ccc";
      wrapper.style.padding = "15px";
      wrapper.style.marginBottom = "20px";
  
      resultContainer.appendChild(wrapper);
    });
  }
  
  async function deleteCandidate(id) {
    await fetch(`http://localhost:3000/registrations/${id}`, {
      method: "DELETE"
    });
    alert("Deleted");
    searchCandidate();
  }
  
  async function editCandidate(id) {
    const newName = prompt("Enter new name:");
    const newPhone = prompt("Enter new phone number:");
    const newEmail = prompt("Enter new email:");
    const newCollege = prompt("Enter new college name:");
    const newEventsRaw = prompt("Enter new events (comma-separated):");
    const newEvents = newEventsRaw.split(",").map(e => e.trim());
  
    await fetch(`http://localhost:3000/registrations/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newName,
        phone: newPhone,
        email: newEmail,
        college: newCollege,
        events: newEvents
      })
    });
  
    alert("Updated");
    searchCandidate();
  }
  