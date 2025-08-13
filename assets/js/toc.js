document.addEventListener('DOMContentLoaded', function () {
  // Select either post-content (blog/project) or page-content (normal page)
  const content = document.querySelector('.post-content') || document.querySelector('.page-content');
  if (!content) return; // no content found, do nothing

  const tocContainer = document.createElement('nav');
  tocContainer.className = 'toc-wrap';
  const tocTitle = document.createElement('h3');
  tocTitle.textContent = 'On This Page';
  const tocList = document.createElement('ul');
  tocList.className = 'toc-list';

  // Grab all headings inside the content
  const headings = content.querySelectorAll('h2, h3, h4');
  if (!headings.length) return;

  headings.forEach((heading, index) => {
    // Ensure each heading has an ID
    if (!heading.id) {
      heading.id = 'section-' + index;
    }

    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.textContent;
    li.appendChild(link);
    tocList.appendChild(li);
  });

  tocContainer.appendChild(tocTitle);
  tocContainer.appendChild(tocList);

  // Insert TOC before content
  content.parentNode.insertBefore(tocContainer, content);

  // Active section highlighting on scroll
  const tocLinks = tocList.querySelectorAll('a');
  window.addEventListener('scroll', () => {
    let fromTop = window.scrollY + 85; // adjust for navbar height
    headings.forEach((heading, i) => {
      if (
        heading.offsetTop <= fromTop &&
        (i + 1 === headings.length || headings[i + 1].offsetTop > fromTop)
      ) {
        tocLinks.forEach(link => link.classList.remove('active-toc'));
        tocLinks[i].classList.add('active-toc');
      }
    });
  });
});
