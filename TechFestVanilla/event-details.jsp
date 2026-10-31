<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.techfest.model.Event, com.techfest.dao.EventDAO" %>
<%
    String slug = request.getParameter("slug");
    Event event = (Event) request.getAttribute("event");
    if (event == null && slug != null) {
        try {
            event = new EventDAO().getEventBySlug(slug);
        } catch (Exception e) {}
    }
    if (event == null) {
        response.sendRedirect("events.jsp");
        return;
    }
    String status = event.getStatus();
    boolean isOpen = "OPEN".equalsIgnoreCase(status) || "Open".equalsIgnoreCase(status);
    String fee = (event.getRegistrationFee() == null || event.getRegistrationFee().doubleValue() == 0) ? "Free" : "₹" + event.getRegistrationFee().intValue();
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= event.getEventName() %> — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="css/style.css?v=6">
</head>
<body class="home-frame event-detail-frame" data-layer="03-event-details">
  <div class="page-wash" aria-hidden="true"></div>

  <!-- Navbar Mount -->
  <div id="navbar-mount"></div>

  <main class="home-container detail-main" id="event-detail-mount">
    <!-- Breadcrumb & Back -->
    <nav class="detail-nav" aria-label="Breadcrumb">
      <a href="events.jsp" class="detail-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m15 18-6-6 6-6"/></svg>
        Back to all events
      </a>
      <span class="detail-sep">/</span>
      <span><%= event.getCategory() %></span>
      <span class="detail-sep">/</span>
      <span class="detail-curr"><%= event.getEventName() %></span>
    </nav>

    <!-- Event Hero Header -->
    <header class="detail-head">
      <div class="detail-tags">
        <span class="chip-category chip-<%= event.getCategory().toLowerCase() %>">
          <i></i><%= event.getCategory() %>
        </span>
        <span class="badge badge-<%= isOpen ? "open" : "closed" %>">
          <i></i><%= status.toUpperCase() %>
        </span>
      </div>
      <div class="detail-title" role="heading" aria-level="1"><%= event.getEventName() %></div>
      <div class="detail-meta-row">
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          <%= event.getCardDate() != null ? event.getCardDate() : event.getEventDate() %>
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <%= event.getVenue() %>
        </span>
      </div>
    </header>

    <!-- Two-Column Grid: 792px left content + 384px sticky Ticket Booth -->
    <section class="event-body detail-grid">
      <div class="detail-content">
        <article class="detail-section">
          <div class="detail-h2" role="heading" aria-level="2">About this event</div>
          <p class="detail-lead"><%= event.getDescription() %></p>
        </article>

        <!-- Timeline / Important Dates -->
        <article class="important-dates" style="margin-top: 32px;">
          <div class="dates-head">
            <div>
              <span class="hud-label">KEY MILESTONES</span>
              <div class="detail-h2" role="heading" aria-level="2">Timeline & Checkpoints</div>
            </div>
          </div>
          <ol class="dates-track">
            <li class="date-node is-done">
              <span class="date-index">01</span>
              <span class="date-dot"></span>
              <div>
                <b>Registrations Open</b>
                <time>Mon, 2 Nov 2026</time>
                <p>Register your team or solo entry before slots close.</p>
              </div>
            </li>
            <li class="date-node <%= isOpen ? "is-live" : "is-done" %>">
              <span class="date-index">02</span>
              <span class="date-dot"></span>
              <div>
                <b>Registration Deadline</b>
                <time><%= event.getRegistrationDeadline() != null ? event.getRegistrationDeadline() : "48h before event" %></time>
                <p>Last moment to confirm entries.</p>
              </div>
            </li>
            <li class="date-node">
              <span class="date-index">03</span>
              <span class="date-dot"></span>
              <div>
                <b>Main Event Day</b>
                <time><%= event.getCardDate() %></time>
                <p>Report to <%= event.getVenue() %> with your digital pass.</p>
              </div>
            </li>
          </ol>
        </article>
      </div>

      <!-- Sticky Ticket Booth Column (384px) -->
      <aside class="detail-booth">
        <div class="booth-ds" data-layer="ticket-booth">
          <div class="booth-top">
            <span class="booth-tag">OFFICIAL PASS</span>
            <div class="booth-fee"><strong><%= fee %></strong><span>/ participant</span></div>
          </div>

          <div class="booth-countdown">
            <div class="hud-label">STARTS IN</div>
            <div class="countdown-digits">
              <div><b>18</b><small>DAYS</small></div>:
              <div><b>04</b><small>HOURS</small></div>:
              <div><b>32</b><small>MINS</small></div>
            </div>
          </div>

          <div class="capacity-ds" style="margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #8A5A3C; margin-bottom: 6px;">
              <span>Capacity</span>
              <b><%= event.getMaxParticipants() != null ? event.getMaxParticipants() : 100 %> seats</b>
            </div>
            <div style="height: 6px; border-radius: 999px; background: #F0DCC0; overflow: hidden;">
              <div style="width: 65%; height: 100%; background: linear-gradient(90deg, #FFC83D, #FF9933);"></div>
            </div>
          </div>

          <div class="booth-stub">
            <% if (isOpen) { %>
              <a href="register.html?slug=<%= event.getSlug() %>" class="btn btn-primary btn-size-l" style="width: 100%; text-decoration: none;">
                <span>Claim Your Pass &rarr;</span>
              </a>
            <% } else { %>
              <button class="btn btn-secondary btn-size-l" disabled style="width: 100%;">
                <span><%= status %></span>
              </button>
            <% } %>
          </div>
        </div>
      </aside>
    </section>
  </main>

  <!-- Footer Mount -->
  <div class="home-footer" id="footer-mount"></div>

  <script type="module" src="js/event-detail.js"></script>
</body>
</html>
