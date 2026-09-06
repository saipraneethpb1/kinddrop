const form = document.querySelector("#kindForm");
const result = document.querySelector("#result");
const button = document.querySelector("#submitBtn");

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  button.disabled = true;
  button.textContent = "Designing one useful act…";
  result.classList.remove("empty");
  result.innerHTML = `<div class="placeholder"><div class="spark">✦</div><h2>Thinking practically…</h2><p>Looking for something small enough to finish today and meaningful enough to matter.</p></div>`;

  const body = {
    resource: document.querySelector("#resource").value,
    minutes: document.querySelector("#minutes").value,
    cause: document.querySelector("#cause").value,
    location: document.querySelector("#location").value,
    accessibility: document.querySelector("#accessibility").value
  };

  try {
    const response = await fetch("/api/idea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong.");

    const steps = Array.isArray(data.steps)
      ? data.steps.map(step => `<li>${escapeHTML(step)}</li>`).join("")
      : "";

    result.innerHTML = `
      <span class="pill">${escapeHTML(body.minutes)}-minute KindDrop</span>
      <h2>${escapeHTML(data.title)}</h2>
      <p>${escapeHTML(data.why)}</p>

      <h3>Do this</h3>
      <ol>${steps}</ol>

      <h3>Say this</h3>
      <div class="message">“${escapeHTML(data.message)}”</div>

      <h3>Dignity & safety</h3>
      <p>${escapeHTML(data.safety)}</p>

      <h3>Measure without making it performative</h3>
      <p>${escapeHTML(data.impact)}</p>

      <h3>If you want to continue</h3>
      <p>${escapeHTML(data.next)}</p>
    `;
  } catch (error) {
    result.innerHTML = `<div class="error"><h2>That KindDrop didn't land.</h2><p>${escapeHTML(error.message)}</p></div>`;
  } finally {
    button.disabled = false;
    button.textContent = "Turn this into kindness →";
  }
});
