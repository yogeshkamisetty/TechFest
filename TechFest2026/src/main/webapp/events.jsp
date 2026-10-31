<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List, com.techfest.model.Event, com.techfest.dao.EventDAO" %>
<%
    List<Event> events = (List<Event>) request.getAttribute("events");
    if (events == null) {
        try {
            events = new EventDAO().getAllEvents();
        } catch (Exception e) {
            events = java.util.Collections.emptyList();
        }
    }
    String categoryFilter = request.getParameter("category");
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Events Programme — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="css/style.css?v=6">
</head>
<body class="home-frame events-page-frame" data-layer="02-events-catalog">
  <div class="page-wash" aria-hidden="true"></div>

  <!-- Navbar Mount -->
  <div id="navbar-mount"></div>

  <main class="home-container events-main">
    <header class="events-header" data-layer="page-header">
      <span class="hud-label">DISCOVER // COMPETE // INNOVATE</span>
      <div class="events-title" role="heading" aria-level="1">
        All <em>Festival</em> Events
      </div>
      <p class="events-sub">
        Explore 9 competitions spanning hackathons, robotics, competitive coding, game jams and design sprints.
      </p>
    </header>

    <!-- Filter Bar -->
    <div class="filterbar-ds" data-layer="filter-toolbar">
      <div class="filter-top">
        <div class="filter-search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input type="search" id="event-search-input" placeholder="Search by title, category, or venue..." aria-label="Search events" />
        </div>
        <div class="filter-select-wrap">
          <label for="event-sort-select">SORT BY</label>
          <select id="event-sort-select" aria-label="Sort events">
            <option value="date-asc">Date (Earliest first)</option>
            <option value="date-desc">Date (Latest first)</option>
            <option value="title-asc">Title (A &rarr; Z)</option>
            <option value="fee-asc">Fee (Free first)</option>
          </select>
        </div>
        <label class="filter-toggle">
          <input type="checkbox" id="open-only-toggle" />
          <span>Open only</span>
        </label>
      </div>

      <div class="filter-chips" role="tablist" aria-label="Filter events by category">
        <button class="chip-filter is-active" data-cat="all" role="tab" aria-selected="true">All (9)</button>
        <button class="chip-filter" data-cat="Hackathon" role="tab">Hackathon (2)</button>
        <button class="chip-filter" data-cat="Quiz" role="tab">Quiz (1)</button>
        <button class="chip-filter" data-cat="Robotics" role="tab">Robotics (2)</button>
        <button class="chip-filter" data-cat="Gaming" role="tab">Gaming (1)</button>
        <button class="chip-filter" data-cat="Design" role="tab">Design (1)</button>
        <button class="chip-filter" data-cat="Coding" role="tab">Coding (1)</button>
        <button class="chip-filter" data-cat="AI-ML" role="tab">AI-ML (1)</button>
      </div>
    </div>

    <!-- Events Grid -->
    <section class="events-grid" id="events-grid-mount" data-layer="catalog-grid" aria-label="Events catalog">
      <% for (Event e : events) {
          String status = e.getStatus();
          boolean isOpen = "OPEN".equalsIgnoreCase(status) || "Open".equalsIgnoreCase(status);
          String fee = (e.getRegistrationFee() == null || e.getRegistrationFee().doubleValue() == 0) ? "Free" : "₹" + e.getRegistrationFee().intValue();
      %>
        <article class="ds-event-card" data-slug="<%= e.getSlug() %>" data-category="<%= e.getCategory() %>" data-status="<%= status %>">
          <div class="event-glow" aria-hidden="true"></div>
          <div class="event-body">
            <div class="event-head">
              <span class="chip-category chip-<%= e.getCategory().toLowerCase() %>">
                <i></i><%= e.getCategory() %>
              </span>
              <span class="badge badge-<%= isOpen ? "open" : (status.equalsIgnoreCase("COMPLETED") ? "completed" : "closed") %>">
                <i></i><%= status.toUpperCase() %>
              </span>
            </div>
            <div class="event-title" role="heading" aria-level="3"><%= e.getEventName() %></div>
            <div class="event-meta">
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                <%= e.getCardDate() != null ? e.getCardDate() : e.getEventDate() %>
              </span>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <%= e.getVenue() %>
              </span>
            </div>
            <div class="event-foot">
              <span class="event-fee"><b><%= fee %></b> / entry</span>
              <a href="event-details.jsp?slug=<%= e.getSlug() %>" class="btn btn-primary btn-size-m">
                <span><%= isOpen ? "Register" : "View Details" %></span>
              </a>
            </div>
          </div>
        </article>
      <% } %>
    </section>
  </main>

  <!-- Footer Mount -->
  <div class="home-footer" id="footer-mount"></div>

  <script type="module" src="js/events.js"></script>
</body>
</html>
