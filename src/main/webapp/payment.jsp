<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.techfest.Event, com.techfest.EventDAO" %>
<%
    String slug = request.getParameter("slug");
    if (slug == null || slug.trim().isEmpty()) {
        response.sendRedirect("events.jsp");
        return;
    }

    Event event = null;
    try {
        event = new EventDAO().getEventBySlug(slug.trim());
    } catch (Exception ignored) {}

    if (event == null) {
        response.sendRedirect("events.jsp");
        return;
    }

    HttpSession sess = request.getSession(false);
    String userName = (sess != null) ? (String) sess.getAttribute("userName") : null;
    String userEmail = (sess != null) ? (String) sess.getAttribute("userEmail") : null;
    boolean isLoggedIn = (userName != null);

    if (!isLoggedIn) {
        response.sendRedirect("login.html?next=payment.jsp?slug=" + java.net.URLEncoder.encode(slug, "UTF-8"));
        return;
    }

    String regType = request.getParameter("regType");
    if (regType == null || regType.trim().isEmpty()) regType = "INDIVIDUAL";
    String teamName = request.getParameter("teamName");
    if (teamName == null || teamName.trim().isEmpty()) {
        teamName = "TEAM".equalsIgnoreCase(regType) ? "Team Entry" : "Solo Entry";
    }
    String track = request.getParameter("track");
    if (track == null || track.trim().isEmpty()) track = "General Track";
    String members = request.getParameter("members");
    if (members == null) members = "";

    double feeNum = (event.getRegistrationFee() == null) ? 0.0 : event.getRegistrationFee().doubleValue();
    String fee = "₹" + (int) feeNum;

    // Generate random 6-digit transaction id for simulation
    int randomTxn = 100000 + (int)(Math.random() * 900000);
    String txnId = "TXN-" + randomTxn;
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Simulation — <%= event.getEventName() %> — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="css/style.css?v=6">
</head>
<body class="home-frame">
  <!-- Standard Navbar -->
  <header class="home-navbar" id="site-header">
    <div class="home-nav-inner">
      <a href="user-home.jsp" class="home-logo">
        <span class="tech-badge-icon">&lt;/&gt;</span>TECH FEST HUB
      </a>
      <nav aria-label="Primary">
        <a href="user-home.jsp">Home</a>
        <a href="events.jsp">Events</a>
        <a href="my-registrations.jsp">My Registrations</a>
      </nav>
      <div class="home-auth" style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 13px; font-weight: 600; color: #5B3A29;"><%= userName %></span>
        <a href="logout" class="btn btn-secondary btn-size-m is-default"><span>Logout</span></a>
      </div>
      <button type="button" class="home-menu-btn" id="nav-menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <i></i><i></i><i></i>
      </button>
    </div>
  </header>

  <main class="home-container" style="max-width: 720px; padding: 40px 24px 80px;">
    <!-- Breadcrumb -->
    <div style="margin-bottom: 24px;">
      <a href="register.jsp?slug=<%= event.getSlug() %>" style="display: inline-flex; align-items: center; gap: 6px; color: #0B7A70; font-weight: 600; font-size: 14px; text-decoration: none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;"><path d="m15 18-6-6 6-6"/></svg>
        Back to Registration Details
      </a>
    </div>

    <!-- Payment Container Card -->
    <div style="background: white; border: 1px solid #F0DCC0; border-radius: 20px; padding: 36px; box-shadow: 0 6px 24px rgba(91,58,41,0.06);">
      <!-- Header -->
      <div style="border-bottom: 1px solid #F0DCC0; padding-bottom: 20px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="hud-label" style="color: #0B7A70; font-weight: 700;">PAYMENT GATEWAY SIMULATION</span>
          <span class="badge badge-open">SECURE &bull; LOCAL</span>
        </div>
        <h1 style="font-size: 24px; color: #5B3A29; margin: 8px 0 6px; font-weight: 800;">Complete Event Registration</h1>
        <p style="color: #8A5A3C; font-size: 14px; margin: 0;">This is a college project simulated payment step. No real money will be charged.</p>
      </div>

      <!-- Order Summary Card -->
      <div style="background: #FFFDF9; border: 1px solid #F0DCC0; border-radius: 14px; padding: 20px; margin-bottom: 28px;">
        <div style="font-size: 12px; font-family: var(--mono); font-weight: 700; color: #8A5A3C; text-transform: uppercase; margin-bottom: 12px;">ORDER SUMMARY</div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <b style="font-size: 16px; color: #5B3A29;"><%= event.getEventName() %></b>
            <span style="display: block; font-size: 13px; color: #8A5A3C; margin-top: 2px;">
              Type: <b><%= "TEAM".equalsIgnoreCase(regType) ? ("Team (" + teamName + ")") : "Individual (Solo)" %></b>
            </span>
            <span style="display: block; font-size: 12px; color: #8A5A3C; margin-top: 2px;">
              Track: <%= track %> <%= (members != null && !members.trim().isEmpty()) ? (" &bull; Members: " + members) : "" %>
            </span>
          </div>
          <span style="font-size: 20px; font-weight: 800; color: #0B7A70;"><%= fee %></span>
        </div>
        <div style="border-top: 1px dashed #F0DCC0; padding-top: 12px; margin-top: 12px; display: flex; justify-content: space-between; font-size: 14px;">
          <span style="color: #5B3A29; font-weight: 600;">Total Payable:</span>
          <b style="color: #0B7A70; font-size: 18px;"><%= fee %></b>
        </div>
      </div>

      <!-- Payment Simulation Form -->
      <form action="event-register" method="POST">
        <input type="hidden" name="slug" value="<%= event.getSlug() %>">
        <input type="hidden" name="regType" value="<%= regType %>">
        <input type="hidden" name="teamName" value="<%= teamName %>">
        <input type="hidden" name="track" value="<%= track %>">
        <input type="hidden" name="members" value="<%= members %>">
        <input type="hidden" name="paymentStatus" value="SUCCESS">
        <input type="hidden" name="paymentReference" value="<%= txnId %>">

        <div style="margin-bottom: 24px;">
          <label style="display: block; font-size: 12px; font-weight: 700; color: #8A5A3C; margin-bottom: 12px; letter-spacing: 0.5px;">SELECT PAYMENT METHOD</label>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <!-- Option 1: UPI -->
            <label style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border: 1px solid #0B7A70; border-radius: 12px; background: #F2FAF9; cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <input type="radio" name="payMethod" value="UPI" checked style="accent-color: #0B7A70;">
                <div>
                  <b style="color: #5B3A29; font-size: 14px;">UPI / QR Code (GPay, PhonePe, Paytm)</b>
                  <span style="display: block; font-size: 12px; color: #8A5A3C;">Simulated VPA: techfest2026@oksbi</span>
                </div>
              </div>
              <span style="font-family: var(--mono); font-size: 11px; font-weight: 700; color: #0B7A70; background: white; padding: 4px 8px; border-radius: 6px; border: 1px solid #0B7A70;">INSTANT</span>
            </label>

            <!-- Option 2: Card -->
            <label style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border: 1px solid #E0CEB8; border-radius: 12px; background: white; cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <input type="radio" name="payMethod" value="CARD" style="accent-color: #0B7A70;">
                <div>
                  <b style="color: #5B3A29; font-size: 14px;">Debit / Credit Card</b>
                  <span style="display: block; font-size: 12px; color: #8A5A3C;">Visa, Mastercard, RuPay</span>
                </div>
              </div>
              <span style="font-family: var(--mono); font-size: 11px; color: #8A5A3C;">ALL CARDS</span>
            </label>

            <!-- Option 3: Net Banking -->
            <label style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border: 1px solid #E0CEB8; border-radius: 12px; background: white; cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <input type="radio" name="payMethod" value="NET_BANKING" style="accent-color: #0B7A70;">
                <div>
                  <b style="color: #5B3A29; font-size: 14px;">Net Banking &bull; Campus Student Wallet</b>
                  <span style="display: block; font-size: 12px; color: #8A5A3C;">State Bank, HDFC, ICICI, Canara Bank</span>
                </div>
              </div>
              <span style="font-family: var(--mono); font-size: 11px; color: #8A5A3C;">ONLINE</span>
            </label>
          </div>
        </div>

        <!-- Simulated Reference ID Box -->
        <div style="background: #FFFDF9; border: 1px dashed #F0DCC0; border-radius: 10px; padding: 12px 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; color: #8A5A3C;">Generated Simulation Txn ID:</span>
          <b style="font-family: var(--mono); font-size: 13px; color: #0B7A70;"><%= txnId %></b>
        </div>

        <!-- Submit Button -->
        <div style="border-top: 1px solid #F0DCC0; padding-top: 24px; display: flex; justify-content: space-between; align-items: center;">
          <a href="register.jsp?slug=<%= event.getSlug() %>" class="btn btn-secondary btn-size-l" style="text-decoration: none;">Cancel</a>
          <button type="submit" class="btn btn-primary btn-size-l">
            <span>Simulate Payment &amp; Issue Pass &rarr;</span>
          </button>
        </div>
      </form>
    </div>
  </main>

  <!-- Standard Clean Footer -->
  <footer class="home-footer">
    <div class="home-footer-inner home-container">
      <div class="footer-brand">
        <div class="home-logo">
          <span class="tech-badge-icon">&lt;/&gt;</span>TECH FEST HUB
        </div>
        <p>Annual Technical Festival 2026. Explore technical events, compete with your peers and register your digital pass in seconds.</p>
      </div>
      <div class="footer-links">
        <b>Quick Links</b>
        <a href="user-home.jsp">Home</a>
        <a href="events.jsp">Events</a>
        <a href="my-registrations.jsp">My Registrations</a>
        <a href="logout">Logout</a>
      </div>
      <div class="footer-info">
        <b>Contact &amp; Venue</b>
        <p>Main Administrative Block, Campus Arena<br>Email: techfest2026@college.edu<br>Helpline: +91 98765 43210</p>
      </div>
    </div>
    <div class="footer-bottom home-container">
      <p>&copy; 2026 Tech Fest Hub</p>
    </div>
  </footer>

  <script src="js/script.js"></script>
</body>
</html>
