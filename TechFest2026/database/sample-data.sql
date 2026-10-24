-- Admin account: password is 'admin123'
INSERT INTO USERS (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT)
VALUES ('System Admin', 'admin@techfest.local', 'pbkdf2$65536$fkiRh+a6SmiL7VqwOWOfHw==$OOlo+FXFNWivj+I/LhLy+aaZjiGV0mkHri6BE/IVqms=', 'ADMIN', 'Administration');

-- Demo Student: password is 'student123'
INSERT INTO USERS (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT)
VALUES ('Demo Student', 'student1@college.edu', 'pbkdf2$65536$nvzb78jKCVFsK1ULag4u6A==$ifSgIZ81hWLJbM8TYjRTiXUSoGsowzI2zFrtUJ4Lnao=', 'STUDENT', 'Computer Science');

INSERT INTO EVENTS (
    EVENT_NAME,
    CATEGORY,
    DESCRIPTION,
    EVENT_DATE,
    VENUE,
    REGISTRATION_FEE,
    MAX_PARTICIPANTS,
    REGISTRATION_DEADLINE,
    STATUS
) VALUES (
    'Code Sprint 2026',
    'Coding',
    'Competitive coding challenge with algorithmic problems.',
    TO_TIMESTAMP('2026-11-12 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'Lab A',
    0,
    120,
    TO_TIMESTAMP('2026-11-10 23:59:59', 'YYYY-MM-DD HH24:MI:SS'),
    'OPEN'
);

INSERT INTO EVENTS (
    EVENT_NAME,
    CATEGORY,
    DESCRIPTION,
    EVENT_DATE,
    VENUE,
    REGISTRATION_FEE,
    MAX_PARTICIPANTS,
    REGISTRATION_DEADLINE,
    STATUS
) VALUES (
    'Robo Maze',
    'Robotics',
    'Autonomous bot maze navigation contest.',
    TO_TIMESTAMP('2026-11-13 14:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'Mechanical Arena',
    200,
    40,
    TO_TIMESTAMP('2026-11-12 18:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'OPEN'
);

INSERT INTO EVENTS (
    EVENT_NAME,
    CATEGORY,
    DESCRIPTION,
    EVENT_DATE,
    VENUE,
    REGISTRATION_FEE,
    MAX_PARTICIPANTS,
    REGISTRATION_DEADLINE,
    STATUS
) VALUES (
    'Tech Quiz Bowl',
    'Quiz',
    'Inter-department rapid-fire technology quiz.',
    TO_TIMESTAMP('2026-11-14 11:30:00', 'YYYY-MM-DD HH24:MI:SS'),
    'Main Auditorium',
    50,
    200,
    TO_TIMESTAMP('2026-11-13 20:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'OPEN'
);

COMMIT;
