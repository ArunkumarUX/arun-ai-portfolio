(() => {
  const { person, categories, featured, projects, experience } = window.PORTFOLIO;
  const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
  const $ = (s) => document.querySelector(s);
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const liveCount = projects.filter((p) => p.status === "Live").length;
  const counts = { projects: `${projects.length}`, live: `${liveCount}` };
  document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = counts[el.dataset.count]));

  const tones = ["#9fd7c8", "#f3b7c4", "#b9c7f5", "#f6d59a", "#c8e7a0", "#e7c4f2"];
  const linksEl = (p) => {
    const out = [];
    if (p.live) {
      const label = p.status === "Prototype" || p.status === "POC" ? "Prototype" : "Live";
      out.push(`<a class="cta live" href="${esc(p.live)}" target="_blank" rel="noopener">${label}</a>`);
    }
    if (p.repo) out.push(`<a class="cta code" href="${esc(p.repo)}" target="_blank" rel="noopener">GitHub</a>`);
    return out.join("");
  };

  const beats = (p) => [
    ["Problem", p.problem],
    ["My contribution", p.contribution || "I designed the experience and built the prototype."],
    ["Solution", p.solution || p.summary],
    ["Outcome", p.outcome],
    ["Learning", p.learning || "The work was finished when the next step was obvious."],
  ];
  const beatsEl = (p) =>
    `<dl class="beats">${beats(p).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;

  const selected = featured.map((id) => byId[id]).filter(Boolean);
  let lastYear = null;
  $("#years").innerHTML = selected
    .map((p, i) => {
      const showYear = p.year !== lastYear;
      lastYear = p.year;
      const visual = p.image
        ? `<img class="shot" src="${esc(p.image)}" alt="" />`
        : `<div class="frame" style="--tone:${tones[i % tones.length]}"><b>${esc(p.title)}</b><span>${esc(p.client)}</span></div>`;
      return `<article class="case" id="p-${p.id}">
        <div class="year">${showYear ? esc(p.year) : ""}</div>
        <div>
          <h3>${esc(p.title)}</h3>
          <p class="summary">${esc(p.client)} · ${esc(p.status)}</p>
          <div class="case-links">${linksEl(p)}</div>
          ${visual}
          ${beatsEl(p)}
        </div>
      </article>`;
    })
    .join("");

  const state = { q: "", cat: "All", status: "" };
  const catCount = (c) => (c === "All" ? projects.length : projects.filter((p) => p.category === c).length);
  $("#chips").innerHTML = ["All", ...categories]
    .map((c) => `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="${c === "All"}">${esc(c)}<small>${catCount(c)}</small></button>`)
    .join("");

  const haystack = (p) => [p.title, p.client, p.category, p.summary, p.status, ...(p.tags || []), ...(p.stack || [])].join(" ").toLowerCase();

  function render() {
    const q = state.q.trim().toLowerCase();
    const list = projects.filter(
      (p) =>
        (state.cat === "All" || p.category === state.cat) &&
        (!state.status || p.status === state.status) &&
        (!q || q.split(/\s+/).every((t) => haystack(p).includes(t)))
    );
    $("#count").textContent = list.length === projects.length
      ? `${projects.length} projects`
      : `Showing ${list.length} of ${projects.length} projects`;
    $("#grid").innerHTML = list.length
      ? list
          .map(
            (p) => `<article class="card" id="card-${p.id}">
              ${p.image ? `<img class="shot" src="${esc(p.image)}" alt="" />` : ""}
              <div class="meta">${esc(p.category)} · ${p.year} · <span class="status ${p.status === "Live" ? "live" : ""}">${esc(p.status)}</span></div>
              <h3>${esc(p.title)}</h3>
              <span class="client">${esc(p.client)}</span>
              ${beatsEl(p)}
              <div class="foot">${(p.stack || []).slice(0, 3).map((s) => `<span class="tag">${esc(s)}</span>`).join(" ")}</div>
              <div class="links-row">${linksEl(p)}</div>
            </article>`
          )
          .join("")
      : `<div class="empty">No projects match that search. Try another word, or set the filters back to All.</div>`;
  }

  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    state.cat = b.dataset.cat;
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
    render();
  });
  $("#q").addEventListener("input", (e) => { state.q = e.target.value; render(); });
  $("#status").addEventListener("change", (e) => { state.status = e.target.value; render(); });
  render();

  $("#timeline").innerHTML = experience
    .map(
      (x) => `<li>
        <span class="period">${esc(x.period)}</span>
        <div>
          <h3>${esc(x.role)}</h3>
          <p class="org">${esc(x.org)}</p>
          <ul>${x.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>
          ${x.projects.length ? `<div class="proof">${x.projects.map((id) => byId[id] ? `<a href="#card-${id}" data-jump="${id}">${esc(byId[id].title)}</a>` : "").join("")}</div>` : ""}
        </div>
      </li>`
    )
    .join("");

  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-jump]");
    if (!a) return;
    state.q = ""; state.cat = "All"; state.status = "";
    $("#q").value = ""; $("#status").value = "";
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.cat === "All"));
    render();
  });

  const links = [
    ["#linkedin", person.linkedin],
    ["#github", person.github],
    ["#foot-li", person.linkedin],
    ["#foot-gh", person.github],
    ["#foot-site", person.site],
    ["#story-li", person.linkedin],
    ["#story-gh", person.github],
  ];
  links.forEach(([sel, url]) => { const el = $(sel); if (el) el.href = url; });
  $("#location").textContent = person.location;
  $("#yr").textContent = new Date().getFullYear();

  $("#copy-email").addEventListener("click", async () => {
    const btn = $("#copy-email");
    try {
      await navigator.clipboard.writeText(person.email);
      btn.textContent = "Copied";
    } catch {
      btn.textContent = person.email;
    }
    setTimeout(() => { btn.textContent = "Copy email"; }, 1600);
  });

  const navLinks = [...document.querySelectorAll(".pill a")];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));
  }
})();
