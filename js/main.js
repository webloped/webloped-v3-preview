/* Webloped v4 — minimal progressive enhancement (Stage 3) */
(function () {
  "use strict";

  // ---- Mobile navigation: toggle, Escape to close, focus management ----
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  if (toggle && nav) {
    var navLinks = nav.querySelectorAll("a");

    function setOpen(open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open && navLinks.length) {
        navLinks[0].focus();
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("open"));
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        setOpen(false);
      }
    });
  }

  // ---- Contact form: honest mailto compose (real endpoint = owner-provisioned).
  // Nothing is sent silently — the visitor reviews the email before sending.
  var form = document.getElementById("quoteForm");
  if (form) {
    var errorsBox = document.getElementById("formErrors");
    var statusBox = document.getElementById("formStatus");

    function field(id) { return document.getElementById(id); }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = field("fName");
      var email = field("fEmail");
      var company = field("fCompany");
      var type = field("fType");
      var msg = field("fMsg");

      // Accessible error summary: list missing/invalid fields, focus it.
      var problems = [];
      if (!name.value.trim()) { problems.push({ el: name, label: "Your name" }); }
      if (!email.value.trim()) {
        problems.push({ el: email, label: "Email" });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        problems.push({ el: email, label: "Email (must look like name@example.com)" });
      }
      if (!msg.value.trim()) { problems.push({ el: msg, label: "About your project" }); }

      if (errorsBox) { errorsBox.hidden = true; errorsBox.innerHTML = ""; }
      if (problems.length) {
        if (errorsBox) {
          var list = document.createElement("ul");
          problems.forEach(function (p) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = "#" + p.el.id;
            a.textContent = "Enter " + p.label;
            a.addEventListener("click", function (ev) {
              ev.preventDefault();
              p.el.focus();
            });
            li.appendChild(a);
            list.appendChild(li);
          });
          var heading = document.createElement("strong");
          heading.textContent = "Please fix " + problems.length + " field" +
            (problems.length > 1 ? "s" : "") + ":";
          errorsBox.appendChild(heading);
          errorsBox.appendChild(list);
          errorsBox.hidden = false;
          errorsBox.setAttribute("tabindex", "-1");
          errorsBox.focus();
        }
        return;
      }

      var subject = "Project enquiry from " + name.value.trim();
      var body = "Name: " + name.value.trim() + "\n" +
        "Email: " + email.value.trim() + "\n" +
        "Company: " + (company.value.trim() || "—") + "\n" +
        "Project type: " + (type ? type.value : "Not specified") + "\n\n" +
        "About the project:\n" + msg.value.trim();

      if (statusBox) {
        statusBox.textContent = "Opening your email app — review and send the message yourself. " +
          "Nothing is sent automatically.";
      }
      window.location.href = "mailto:contact@webloped.ca" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }
})();
