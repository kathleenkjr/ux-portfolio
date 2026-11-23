const grid=document.querySelector('#project-grid');const dialog=document.querySelector('#case-dialog');const content=document.querySelector('#case-content');const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function group(p) {
  return p.slug === 'xr-product' ? 'strategy' : p.slug === 'school-lunch' ? 'design' : 'research';
}

function render(filter = 'all') {
  grid.innerHTML = '';
  PROJECTS.filter(p => filter === 'all' || (p.filters ?? [group(p)]).includes(filter)).forEach(p => {
    const card = document.createElement(p.page ? 'a' : 'button');
    const imageAlt = p.imageAlt ?? `Preview of ${p.name} project documentation`;
    card.className = 'project';
    card.setAttribute('aria-label', 'Read ' + p.name + ' case study');
    card.innerHTML = `
      <div class="thumb ${p.image ? '' : 'noimage'}">
        ${p.image
          ? `<img loading="lazy" src="${esc(p.image)}" alt="${esc(imageAlt)}">`
          : '<div class="graphic">Teamworks<br>Scheduling</div>'}
        <span class="view" aria-hidden="true">↗</span>
      </div>
      <div class="project-top"><h3>${esc(p.name)}</h3><span class="project-year">${esc(p.year)}</span></div>
      <p class="project-sub">${esc(p.category)}</p>`;

    if (p.page) {
      card.href = p.page;
    } else {
      card.addEventListener('click', () => openCase(p));
    }
    grid.appendChild(card);
  });
}

function openCase(p){content.innerHTML=`<article class="case"><div class="eyebrow">${esc(p.type.toUpperCase())} / ${esc(p.year)}</div><h2 id="case-title">${esc(p.name)}</h2><p class="case-lead">${esc(p.lead)}</p>${p.image?`<img class="case-cover" src="${esc(p.image)}" alt="Document preview for ${esc(p.name)}">`:''}<div class="case-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><h3>Project overview</h3><p>${esc(p.method)}</p><h3>Findings & design direction</h3><p>${esc(p.result)}</p><h3>Explore the work</h3><p>Read the original project material for supporting evidence, process details, and recommendations.</p><a class="source-link" href="${esc(p.source)}" target="_blank" rel="noopener">View original project document ↗</a><p class="disclaimer">Academic or concept project. The documented recommendations are not claims of implementation or measured business impact.</p></article>`;dialog.showModal();history.replaceState(null,'','#project-'+p.slug)}document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>{if(location.hash.startsWith('#project-'))history.replaceState(null,'','#work')});document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});btn.classList.add('active');btn.setAttribute('aria-pressed','true');render(btn.dataset.filter)}));document.querySelector('#year').textContent=new Date().getFullYear();render();if(location.hash.startsWith('#project-')){const p=PROJECTS.find(x=>'#project-'+x.slug===location.hash);if(p?.page)location.replace(p.page);else if(p)openCase(p)}