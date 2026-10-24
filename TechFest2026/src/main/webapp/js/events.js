import { renderNavbar, renderFooter } from './nav.js';
import { State } from './state.js';
import { renderEventCard, CategoryChip } from './components.js';

renderNavbar('Events');
renderFooter('footer-mount');

const chips = ['All', 'Coding', 'Quiz', 'Robotics', 'Hackathon', 'Gaming', 'Design'];
const feeValue = (fee) => (fee === 'Free' ? 0 : Number(fee.replace('₹', '')));
const statusOrder = { Open: 0, Closed: 1, Completed: 2 };

// Read Initial URL Search Params
const urlParams = new URLSearchParams(window.location.search);
let selectedCategory = chips.includes(urlParams.get('category')) ? urlParams.get('category') : 'All';
let searchQuery = urlParams.get('q') || '';
let selectedSort = urlParams.get('sort') || 'date';
let openOnly = urlParams.get('open') === '1';

// DOM elements
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const openToggle = document.getElementById('open-only-toggle');
const countLabel = document.getElementById('filter-count');
const chipsRow = document.getElementById('category-chips-row');
const gridMount = document.getElementById('events-grid-mount');

// Initialize input values
if (searchInput) searchInput.value = searchQuery;
if (sortSelect) sortSelect.value = selectedSort;
if (openToggle) {
  openToggle.classList.toggle('on', openOnly);
  openToggle.setAttribute('aria-checked', String(openOnly));
}

function updateUrlParams() {
  const p = new URLSearchParams();
  if (selectedCategory && selectedCategory !== 'All') p.set('category', selectedCategory);
  if (searchQuery.trim()) p.set('q', searchQuery.trim());
  if (selectedSort && selectedSort !== 'date') p.set('sort', selectedSort);
  if (openOnly) p.set('open', '1');

  const newUrl = window.location.pathname + (p.toString() ? '?' + p.toString() : '');
  window.history.replaceState({}, '', newUrl);
}

function renderChips() {
  if (!chipsRow) return;
  chipsRow.innerHTML = chips
    .map(
      (c) => `
    <button type="button" class="chip-button" data-cat="${c}" aria-pressed="${selectedCategory === c}">
      ${CategoryChip(c === 'All' ? 'Default' : c, selectedCategory === c, c)}
    </button>
  `
    )
    .join('');

  chipsRow.querySelectorAll('.chip-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.getAttribute('data-cat');
      updateUrlParams();
      renderChips();
      renderEvents();
    });
  });
}

function renderEvents() {
  if (!gridMount) return;

  const allEvents = State.getEvents();
  const q = searchQuery.trim().toLowerCase();

  const filtered = allEvents
    .filter((e) => {
      const matchesSearch = e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
      const matchesOpen = !openOnly || e.status === 'Open';
      return matchesSearch && matchesCategory && matchesOpen;
    })
    .sort((a, b) => {
      if (selectedSort === 'fee') {
        return feeValue(a.fee) - feeValue(b.fee);
      }
      if (selectedSort === 'name') {
        return a.title.localeCompare(b.title);
      }
      return statusOrder[a.status] - statusOrder[b.status];
    });

  if (countLabel) {
    countLabel.textContent = `${filtered.length} ${filtered.length === 1 ? 'EVENT' : 'EVENTS'}`;
  }

  if (filtered.length === 0) {
    gridMount.innerHTML = `
      <div class="events-empty">
        <div class="empty-magnifier"><i></i><b></b></div>
        <div role="heading" aria-level="2">No events match your search</div>
        <p>Try a different keyword or clear your filters.</p>
        <button type="button" class="btn btn-secondary btn-size-l is-default" id="clear-filters-btn"><span>Clear filters</span></button>
      </div>
    `;
    const clearBtn = document.getElementById('clear-filters-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        selectedCategory = 'All';
        searchQuery = '';
        selectedSort = 'date';
        openOnly = false;
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'date';
        if (openToggle) {
          openToggle.classList.remove('on');
          openToggle.setAttribute('aria-checked', 'false');
        }
        updateUrlParams();
        renderChips();
        renderEvents();
      });
    }
  } else {
    gridMount.innerHTML = filtered.map((e) => renderEventCard(e, State.isRegistered(e.slug))).join('');
  }
}

// Event Listeners
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    updateUrlParams();
    renderEvents();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    selectedSort = e.target.value;
    updateUrlParams();
    renderEvents();
  });
}

if (openToggle) {
  openToggle.addEventListener('click', () => {
    openOnly = !openOnly;
    openToggle.classList.toggle('on', openOnly);
    openToggle.setAttribute('aria-checked', String(openOnly));
    updateUrlParams();
    renderEvents();
  });
}

// Initial render
renderChips();
renderEvents();
