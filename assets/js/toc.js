/* assets/js/toc.js
 * Builds a floating Table of Contents for pages with `toc: true`
 * - Targets the `.page-content` wrapper you added in _layouts/page.html
 * - Generates IDs for headings missing one
 * - Smooth scrolls with navbar offset
 * - Highlights the active section link
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1) Find the content wrapper (added in _layouts/page.html)
  const content = document.querySelector('.page-content');
  if (!content) return;

  // 2) Collect headings to include in the TOC
  const headings = Array.from(content.querySelectorAll('h2, h3, h4'))
    // Optional: skip headings inside admonitions/callouts if your theme uses them
    .filter(h => !h.closest('.no-toc'));
  if (!headings.length) return;

  // 3) Create the TOC container & list
  const tocContainer = document.createElement('nav');
  tocContainer.className = 'toc-wrap';

  const tocTitle = document.createElement('h3');
  tocTitle.textContent = 'On This Page';

  const tocList = document.createElement('ul');
  tocList.className = 'toc-list';

  // 4) Ensure each heading has an ID; build list items
  const idCounts = Object.create(null);
  headings.forEach((heading, idx) => {
    // Prefer existing id; otherwise generate one from text
    let baseId = heading.id || heading.textContent.trim().toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Ensure uniqueness
    if (!baseId) baseId = `section-${idx}`;
    if (idCounts[baseId] != null) {
      idCounts[baseId] += 1;
      baseId = `${baseId}-${idCounts[baseId]}`;
    } else {
      idCounts[baseId] = 0;
    }
    heading.id = baseId;

    // Build link
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;

    // Optional: indent by level (h2 left, h3 slightly indented, h4 more)
    if (heading.tagName === 'H3') li.style.paddingLeft = '12px';
    if (heading.tagName === 'H4') li.style.paddingLeft = '24px';

    li.appendChild(a);
    tocList.appendChild(li);
  });

  tocContainer.appendChild(tocTitle);
  tocContainer.appendChild(tocList);

  // 5) Insert TOC before the content wrapper
  content.parentNode.insertBefore(tocContainer, content);

  // 6) Smooth scrolling with navbar offset
  //    Adjust this if your navbar height changes
  const NAV_OFFSET = 85;

  function smoothScrollTo(target) {
    const el = document.getElementById(target);
    if (!el) return;

    // Compute final top position minus navbar offset
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.top + scrollTop - NAV_OFFSET;

    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Intercept clicks on TOC links
  tocList.addEventListener('click', function (e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();

    const id = a.getAttribute('href').slice(1);
    smoothScrollTo(id);

    // Update active link immediately on click
    tocList.querySelectorAll('a').forEach(link => link.classList.remove('active-toc'));
    a.classList.add('active-toc');
    history.replaceState(null, '', `#${id}`); // update URL hash without jumping
  });

  // 7) Highlight active section on scroll (scrollspy)
  const links = Array.from(tocList.querySelectorAll('a'));
  const highlightOnScroll = () => {
    const fromTop = window.scrollY + NAV_OFFSET + 1; // +1 to avoid boundary overlap

    // Find the last heading above the current scroll position
    let activeIndex = -1;
    for (let i = 0; i < headings.length; i++) {
      const hTop = headings[i].offsetTop;
      if (hTop <= fromTop) activeIndex = i; else break;
    }

    // Update classes
    links.forEach(link => link.classList.remove('active-toc'));
    if (activeIndex >= 0) {
      links[activeIndex].classList.add('active-toc');
    }
  };

  // Run on load and on scroll/resize
  highlightOnScroll();
  window.addEventListener('scroll', highlightOnScroll, { passive: true });
  window.addEventListener('resize', highlightOnScroll);
});
