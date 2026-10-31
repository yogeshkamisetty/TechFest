-- ====================================================================
-- TechFest2026 FullStack Oracle XE Seed Data
-- ====================================================================

-- 1. USERS
-- Aarav Sharma (Student): password is 'Utsav@2026'
INSERT INTO USERS (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT)
VALUES ('Aarav Sharma', 'aarav@college.edu', 'pbkdf2$65536$KXCXN4VmZ/gTtrJO/W0NFA==$0MANblHIVDzi6YsAEfWHg6tlrGchxU1mO9hY+akwIPo=', 'STUDENT', 'Computer Science');

-- Festival Admin: password is 'ArenaAdmin@2026'
INSERT INTO USERS (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT)
VALUES ('Festival Admin', 'admin@techfesthub.demo', 'pbkdf2$65536$zaA5+82lGn8LllHwbsrCuw==$rd0c2Zsydyv0ZSkC28d7bgPEYLG/0/jll4K1DXAsWWU=', 'ADMIN', 'Festival Office');

-- System Admin: password is 'admin123'
INSERT INTO USERS (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT)
VALUES ('System Admin', 'admin@techfest.local', 'pbkdf2$65536$3yPKFvJPRdScpysysjfeCg==$sM86aopGCA+ZUCmpb3jaquu6GAIX2TBWJFbTKq2XFEs=', 'ADMIN', 'Administration');


-- 2. EVENTS (All 9 Tech Fest Hub Events)

INSERT INTO EVENTS (SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS)
VALUES (
    'codestorm',
    'CodeStorm — 24-Hour Hackathon',
    'Hackathon',
    'CodeStorm is a 24-hour build marathon where teams of up to four turn an idea into a working product. Mentors from the department will be on call through the night.',
    TO_TIMESTAMP('2026-11-14 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'Sat 14 Nov · 10:00 AM',
    'Main Auditorium',
    250,
    120,
    TO_TIMESTAMP('2026-11-12 18:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'OPEN'
);

INSERT INTO EVENTS (SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS)
VALUES (
    'brainwave-quiz-league',
    'BrainWave Quiz League',
    'Quiz',
    'BrainWave is a fast-paced quiz league covering technology, science and Indian innovation. Teams of two battle through a written prelim before six teams reach the live stage final.',
    TO_TIMESTAMP('2026-11-16 14:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'Mon 16 Nov · 2:00 PM',
    'Seminar Hall 2',
    0,
    80,
    TO_TIMESTAMP('2026-11-14 18:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'OPEN'
);

INSERT INTO EVENTS (SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS)
VALUES (
    'roborumble',
    'RoboRumble',
    'Robotics',
    'RoboRumble pits manually controlled bots against an obstacle arena and each other. Bots must fit a 30 × 30 cm footprint and weigh under 5 kg.',
    TO_TIMESTAMP('2026-11-21 09:30:00', 'YYYY-MM-DD HH24:MI:SS'),
    'Sat 21 Nov · 9:30 AM',
    'Mech Block Arena',
    150,
    40,
    TO_TIMESTAMP('2026-11-19 18:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'OPEN'
);

INSERT INTO EVENTS (SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS)
VALUES (
    'pixelpulse-game-jam',
    'PixelPulse Game Jam',
    'Gaming',
    'PixelPulse is a 10-hour game jam with a theme revealed at the opening bell. Any engine is welcome.',
    TO_TIMESTAMP('2026-11-22 11:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'Sun 22 Nov · 11:00 AM',
    'Computer Lab 3',
    100,
    60,
    TO_TIMESTAMP('2026-11-20 18:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'OPEN'
);

INSERT INTO EVENTS (SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS)
VALUES (
    'figma-frenzy',
    'Figma Frenzy',
    'Design',
    'Figma Frenzy is a three-hour product design sprint on a real campus problem. Solo designers present a clickable prototype to a panel.',
    TO_TIMESTAMP('2026-11-24 13:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'Tue 24 Nov · 1:00 PM',
    'Design Studio',
    0,
    50,
    TO_TIMESTAMP('2026-11-22 18:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'OPEN'
);

INSERT INTO EVENTS (SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS)
VALUES (
    'codesprint',
    'CodeSprint',
    'Coding',
    'CodeSprint is a two-hour competitive programming contest with eight problems of rising difficulty. Solve in C++, Java or Python.',
    TO_TIMESTAMP('2026-11-25 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'Wed 25 Nov · 10:00 AM',
    'CS Lab 1',
    50,
    100,
    TO_TIMESTAMP('2026-11-23 18:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'OPEN'
);

INSERT INTO EVENTS (SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS)
VALUES (
    'ai-spark-summit',
    'AI Spark Summit',
    'AI-ML',
    'AI Spark Summit brings together student researchers to demo machine-learning projects. Registration has closed, but the demo hall opens to visitors.',
    TO_TIMESTAMP('2026-11-27 15:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'Fri 27 Nov · 3:00 PM',
    'Auditorium Annex',
    0,
    150,
    TO_TIMESTAMP('2026-11-10 18:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'CLOSED'
);

INSERT INTO EVENTS (SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS)
VALUES (
    'hack-the-hustle',
    'Hack the Hustle',
    'Hackathon',
    'Hack the Hustle was a 12-hour hackathon focused on tools for student entrepreneurs.',
    TO_TIMESTAMP('2026-10-03 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'Sat 3 Oct · 10:00 AM',
    'Main Auditorium',
    200,
    100,
    TO_TIMESTAMP('2026-10-01 18:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'COMPLETED'
);

INSERT INTO EVENTS (SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS)
VALUES (
    'circuit-quest',
    'Circuit Quest',
    'Robotics',
    'Circuit Quest was a hands-on electronics challenge of debugging and building circuits against the clock.',
    TO_TIMESTAMP('2026-10-04 09:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'Sun 4 Oct · 9:00 AM',
    'ECE Block',
    0,
    60,
    TO_TIMESTAMP('2026-10-02 18:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'COMPLETED'
);

-- 3. INITIAL SEED REGISTRATIONS FOR AARAV SHARMA
INSERT INTO REGISTRATIONS (REG_NUMBER, USER_ID, EVENT_ID, STATUS, TEAM_NAME, TRACK_SELECTED)
SELECT 'REG-000124', u.USER_ID, e.EVENT_ID, 'CONFIRMED', 'CodeCraft', 'Open Innovation'
FROM USERS u, EVENTS e WHERE u.EMAIL = 'aarav@college.edu' AND e.SLUG = 'codestorm';

INSERT INTO REGISTRATIONS (REG_NUMBER, USER_ID, EVENT_ID, STATUS, TEAM_NAME, TRACK_SELECTED)
SELECT 'REG-000131', u.USER_ID, e.EVENT_ID, 'CONFIRMED', 'QuizMasters', 'Tech & Science'
FROM USERS u, EVENTS e WHERE u.EMAIL = 'aarav@college.edu' AND e.SLUG = 'brainwave-quiz-league';

INSERT INTO REGISTRATIONS (REG_NUMBER, USER_ID, EVENT_ID, STATUS, TEAM_NAME, TRACK_SELECTED)
SELECT 'REG-000148', u.USER_ID, e.EVENT_ID, 'CONFIRMED', 'BotWarriors', 'Bot Combat'
FROM USERS u, EVENTS e WHERE u.EMAIL = 'aarav@college.edu' AND e.SLUG = 'roborumble';

INSERT INTO REGISTRATIONS (REG_NUMBER, USER_ID, EVENT_ID, STATUS, TEAM_NAME, TRACK_SELECTED)
SELECT 'REG-000152', u.USER_ID, e.EVENT_ID, 'CANCELLED', 'DesignSprint', 'Campus Services'
FROM USERS u, EVENTS e WHERE u.EMAIL = 'aarav@college.edu' AND e.SLUG = 'figma-frenzy';

COMMIT;
