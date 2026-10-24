import { DEFAULT_EVENTS } from './data.js';

export const DEMO_CREDENTIALS = { email: 'aarav@college.edu', password: 'Utsav@2026' };
export const ADMIN_CREDENTIALS = { email: 'admin@techfesthub.demo', password: 'ArenaAdmin@2026' };

const ADMIN_USER = { name: 'Festival Admin', department: 'Festival Office', role: 'admin', ...ADMIN_CREDENTIALS };
const DEMO_USER = { name: 'Aarav Sharma', department: 'Computer Science', role: 'student', ...DEMO_CREDENTIALS };

const DEMO_REGISTRATIONS = [
  { slug: 'codestorm', regId: 'REG-000124', registeredOn: '12 Oct 2026', status: 'Confirmed' },
  { slug: 'brainwave-quiz-league', regId: 'REG-000131', registeredOn: '14 Oct 2026', status: 'Confirmed' },
  { slug: 'roborumble', regId: 'REG-000148', registeredOn: '15 Oct 2026', status: 'Confirmed' },
  { slug: 'figma-frenzy', regId: 'REG-000152', registeredOn: '16 Oct 2026', status: 'Cancelled' },
];

const KEYS = {
  users: 'tfh.users',
  session: 'tfh.session',
  registrations: 'tfh.registrations',
  overrides: 'tfh.event-overrides',
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write failed', e);
  }
}

function initStorage() {
  const users = readStorage(KEYS.users, []);
  if (!users.some((u) => u.email === DEMO_USER.email)) users.unshift(DEMO_USER);
  if (!users.some((u) => u.email === ADMIN_USER.email)) users.push(ADMIN_USER);
  writeStorage(KEYS.users, users);

  const regs = readStorage(KEYS.registrations, {});
  if (!regs[DEMO_USER.email]) {
    regs[DEMO_USER.email] = DEMO_REGISTRATIONS;
    writeStorage(KEYS.registrations, regs);
  }
}

initStorage();

export const State = {
  getEvents() {
    const overrides = readStorage(KEYS.overrides, {});
    return DEFAULT_EVENTS.map((event) => {
      const mod = overrides[event.slug] ?? {};
      return { ...event, ...mod };
    });
  },

  getEvent(slug) {
    return this.getEvents().find((e) => e.slug === slug);
  },

  updateEvent(slug, changes) {
    const overrides = readStorage(KEYS.overrides, {});
    overrides[slug] = { ...overrides[slug], ...changes };
    writeStorage(KEYS.overrides, overrides);
  },

  getUser() {
    const email = readStorage(KEYS.session, null);
    if (!email) return null;
    const users = readStorage(KEYS.users, []);
    const found = users.find((u) => u.email === email);
    if (!found) return null;
    const { password: _, ...safeUser } = found;
    return safeUser;
  },

  login(email, password) {
    const norm = email.trim().toLowerCase();
    const users = readStorage(KEYS.users, []);
    const found = users.find((u) => u.email.toLowerCase() === norm && u.password === password);
    if (found) {
      writeStorage(KEYS.session, found.email);
      return true;
    }
    return false;
  },

  signup(data) {
    const norm = data.email.trim().toLowerCase();
    const users = readStorage(KEYS.users, []);
    if (users.some((u) => u.email.toLowerCase() === norm)) {
      return 'exists';
    }
    const newUser = {
      name: data.name.trim(),
      email: norm,
      department: data.department.trim(),
      password: data.password,
      role: 'student',
    };
    users.push(newUser);
    writeStorage(KEYS.users, users);
    writeStorage(KEYS.session, norm);
    return 'ok';
  },

  logout() {
    localStorage.removeItem(KEYS.session);
  },

  isRegistered(slug) {
    const user = this.getUser();
    if (!user) return false;
    const regs = this.getRegistrations();
    return regs.some((r) => r.slug === slug && r.status === 'Confirmed');
  },

  getRegistrations() {
    const user = this.getUser();
    if (!user) return [];
    const all = readStorage(KEYS.registrations, {});
    return all[user.email] || [];
  },

  register(slug, extra = {}) {
    const user = this.getUser();
    if (!user) return 'auth';
    if (this.isRegistered(slug)) return 'exists';

    const all = readStorage(KEYS.registrations, {});
    const userRegs = all[user.email] || [];
    const totalCount = Object.values(all).flat().length;

    const newReg = {
      slug,
      regId: `REG-${String(200 + totalCount).padStart(6, '0')}`,
      registeredOn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Confirmed',
      ...extra,
    };

    all[user.email] = [newReg, ...userRegs.filter((r) => r.slug !== slug)];
    writeStorage(KEYS.registrations, all);
    return 'ok';
  },

  cancelRegistration(regId) {
    const user = this.getUser();
    if (!user) return false;
    const all = readStorage(KEYS.registrations, {});
    const userRegs = all[user.email] || [];
    const target = userRegs.find((r) => r.regId === regId);
    if (!target) return false;
    target.status = 'Cancelled';
    all[user.email] = userRegs;
    writeStorage(KEYS.registrations, all);
    return true;
  },

  getAllStudents() {
    const users = readStorage(KEYS.users, []);
    return users.filter((u) => u.role !== 'admin').map(({ password: _, ...safe }) => safe);
  },

  getAllRegistrations() {
    const all = readStorage(KEYS.registrations, {});
    const users = readStorage(KEYS.users, []);
    const result = [];
    for (const [email, regs] of Object.entries(all)) {
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      const name = user ? user.name : email;
      for (const r of regs) {
        result.push({ ...r, email, name });
      }
    }
    return result;
  },
};
