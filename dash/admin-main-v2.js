/**
 * admin-main-v2.js - barbina cms
 * com upload de imagens do computador
 */

// ==================== banco de dados ====================
const DB = {
    reservations: [
        { id: 1, name: "João Silva", phone: "(14) 99999-1234", date: "2025-03-27", time: "19:30", people: 4, table: "Mesa 04", status: "confirmed", notes: "" },
        { id: 2, name: "Maria Oliveira", phone: "(14) 98888-5678", date: "2025-03-28", time: "20:00", people: 2, table: "Mesa 02", status: "pending", notes: "" },
        { id: 3, name: "Carlos Santos", phone: "(14) 97777-9012", date: "2025-03-29", time: "19:00", people: 6, table: "Mesa 08", status: "confirmed", notes: "" }
    ],
    
    menu: [
        { id: 1, name: "Filé Mignon à Parmegiana", category: "Pratos Principais", price: 68.90, description: "filé mignon grelhado, molho especial e queijo muçarela" },
        { id: 2, name: "Porção de Bolinho de Linguiça", category: "Porções", price: 42.90, description: "10 unidades de bolinho caseiro" },
        { id: 3, name: "Caipirinha Premium", category: "Bebidas", price: 22.90, description: "limão, gelo, açúcar e cachaça artesanal" }
    ],
    
    environments: [
        { id: 1, title: "Salão Principal", description: "ambiente aconchegante e familiar", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600", isCarousel: true },
        { id: 2, title: "Área de Balcão", description: "espaço para drinks e porções", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600", isCarousel: true },
        { id: 3, title: "Espaço Privativo", description: "ambiente reservado para eventos", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600", isCarousel: false },
        { id: 4, title: "Cozinha Show", description: "acompanhe o preparo dos pratos", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600", isCarousel: false }
    ],
    
    tables: [
        { id: 1, name: "Mesa 01", capacity: 2 }, { id: 2, name: "Mesa 02", capacity: 2 },
        { id: 3, name: "Mesa 03", capacity: 4 }, { id: 4, name: "Mesa 04", capacity: 4 },
        { id: 5, name: "Mesa 05", capacity: 4 }, { id: 6, name: "Mesa 06", capacity: 6 },
        { id: 7, name: "Mesa 07", capacity: 6 }, { id: 8, name: "Mesa 08", capacity: 8 }
    ],
    
    activities: [
        { id: 1, action: "nova reserva", user: "admin", time: "10:32", icon: "fa-calendar-check" },
        { id: 2, action: "item adicionado", user: "admin", time: "09:15", icon: "fa-plus-circle" }
    ]
};

let currentModule = "overview";

// ==================== helpers ====================
function formatCurrency(v) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v); }
function formatDate(d) { return new Date(d).toLocaleDateString('pt-BR'); }
function addActivity(a) { DB.activities.unshift({ id: DB.activities.length+1, action: a, user: "admin", time: new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}), icon: "fa-bell" }); }

// ==================== upload de imagem ====================
function uploadImageToBase64(file) {
    return new Promise((resolve) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

// ==================== modal ambiente com upload ====================
function openEnvironmentModal(forCarousel = false, envId = null) {
    const editing = envId ? DB.environments.find(e => e.id === envId) : null;
    const modal = document.getElementById('globalModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2 style="margin-bottom:24px; font-family:'Playfair Display';">${editing ? 'editar ambiente' : (forCarousel ? 'adicionar ao carrossel' : 'novo ambiente')}</h2>
        <form id="envForm">
            <div class="form-group">
                <label>título *</label>
                <input type="text" id="envTitle" value="${editing ? editing.title : ''}" required>
            </div>
            <div class="form-group">
                <label>descrição criativa (história do ambiente) *</label>
                <textarea id="envDesc" rows="4" required>${editing ? editing.description : ''}</textarea>
            </div>
            <div class="form-group">
                <label>imagem</label>
                <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom:12px;">
                    <button type="button" class="btn-secondary" id="uploadImageBtn" style="padding:12px 24px; background:var(--dark-bg); border:1px solid var(--border-light);">
                        <i class="fas fa-cloud-upload-alt"></i> escolher imagem do computador
                    </button>
                    <input type="file" id="imageFileInput" accept="image/*" style="display:none;">
                </div>
                <div style="position:relative; margin:10px 0;">
                    <span style="position:absolute; left:15px; top:50%; transform:translateY(-50%); color:var(--gray-text);">🔗</span>
                    <input type="text" id="imageUrlInput" placeholder="https://... ou cole uma url" style="width:100%; padding:12px 12px 12px 35px;" value="${editing ? editing.image : ''}">
                </div>
                <div id="imagePreviewArea" style="margin-top:15px; ${editing ? '' : 'display:none'}">
                    <img id="previewImg" src="${editing ? editing.image : ''}" style="max-width:100%; max-height:200px; border-radius:12px; object-fit:cover;">
                </div>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="envCarousel" ${(editing ? editing.isCarousel : forCarousel) ? 'checked' : ''}>
                    exibir no carrossel do site
                </label>
            </div>
            <div style="display:flex; gap:16px; justify-content:flex-end; margin-top:24px">
                <button type="button" class="btn-secondary" onclick="closeModal()">cancelar</button>
                <button type="submit" class="btn-primary">salvar</button>
            </div>
        </form>
    `;
    
    modal.classList.add('active');
    
    const fileInput = document.getElementById('imageFileInput');
    const uploadBtn = document.getElementById('uploadImageBtn');
    const urlInput = document.getElementById('imageUrlInput');
    const previewArea = document.getElementById('imagePreviewArea');
    const previewImg = document.getElementById('previewImg');
    
    // botão de upload
    uploadBtn.onclick = () => fileInput.click();
    
    // quando selecionar arquivo
    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await uploadImageToBase64(file);
            urlInput.value = base64;
            previewImg.src = base64;
            previewArea.style.display = 'block';
        }
    };
    
    // quando digitar url
    urlInput.oninput = () => {
        if (urlInput.value) {
            previewImg.src = urlInput.value;
            previewArea.style.display = 'block';
        } else {
            previewArea.style.display = 'none';
        }
    };
    
    document.getElementById('envForm').onsubmit = async (e) => {
        e.preventDefault();
        let imageUrl = urlInput.value;
        
        if (!imageUrl && fileInput.files[0]) {
            imageUrl = await uploadImageToBase64(fileInput.files[0]);
        }
        
        if (!imageUrl) {
            alert('adicione uma imagem (clique em "escolher imagem" ou cole uma url)');
            return;
        }
        
        if (editing) {
            editing.title = document.getElementById('envTitle').value;
            editing.description = document.getElementById('envDesc').value;
            editing.image = imageUrl;
            editing.isCarousel = document.getElementById('envCarousel').checked;
            addActivity(`ambiente "${editing.title}" atualizado`);
        } else {
            DB.environments.push({
                id: DB.environments.length + 1,
                title: document.getElementById('envTitle').value,
                description: document.getElementById('envDesc').value,
                image: imageUrl,
                isCarousel: document.getElementById('envCarousel').checked
            });
            addActivity(`novo ambiente adicionado`);
        }
        closeModal();
        loadModule(currentModule);
    };
}

// ==================== modal reserva ====================
let editingReservation = null;

function isTableAvailable(name, date, time, excludeId) {
    return !DB.reservations.some(r => r.table === name && r.date === date && r.time === time && r.status !== 'cancelled' && r.id !== excludeId);
}

function getAvailableTables(date, time, people, excludeId) {
    return DB.tables.filter(t => t.capacity >= people && isTableAvailable(t.name, date, time, excludeId));
}

function isRestaurantOpen(date, time) {
    const day = new Date(date).getDay();
    if (day === 1 || day === 2) return { open: false, reason: "fechado segundas e terças" };
    const h = parseInt(time.split(":")[0]);
    if (day === 0) {
        if (h < 11) return { open: false, reason: "domingo abre 11h" };
        if (h >= 15) return { open: false, reason: "domingo fecha 15h" };
        return { open: true };
    }
    if (h < 17) return { open: false, reason: "abre 17h" };
    if (h > 23 || (h === 23 && parseInt(time.split(":")[1]) > 30)) return { open: false, reason: "último horário 23:30" };
    return { open: true };
}

function openReservationModal(id = null) {
    editingReservation = id ? DB.reservations.find(r => r.id === id) : null;
    const modal = document.getElementById('globalModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2 style="margin-bottom:24px; font-family:'Playfair Display';">${editingReservation ? 'editar reserva' : 'nova reserva'}</h2>
        <form id="resForm">
            <div class="form-group"><label>nome completo *</label><input type="text" id="resName" value="${editingReservation ? editingReservation.name : ''}" required></div>
            <div class="form-group"><label>telefone *</label><input type="tel" id="resPhone" value="${editingReservation ? editingReservation.phone : ''}" required></div>
            <div class="form-group"><label>data *</label><input type="date" id="resDate" value="${editingReservation ? editingReservation.date : ''}" required></div>
            <div class="form-group"><label>horário *</label><input type="time" id="resTime" value="${editingReservation ? editingReservation.time : ''}" required></div>
            <div class="form-group"><label>número de pessoas *</label><input type="number" id="resPeople" min="1" max="20" value="${editingReservation ? editingReservation.people : ''}" required></div>
            <div class="form-group"><label>mesa</label><select id="resTable" required></select></div>
            <div class="form-group"><label>status</label><select id="resStatus"><option value="confirmed">confirmada</option><option value="pending">pendente</option></select></div>
            <div class="info-hours"><i class="fas fa-clock"></i> horário: qua-sáb 17h-23:30 | dom 11h-15h | fechado seg/ter</div>
            <div style="display:flex; gap:16px; justify-content:flex-end; margin-top:24px">
                <button type="button" class="btn-secondary" onclick="closeModal()">cancelar</button>
                <button type="submit" class="btn-primary">salvar</button>
            </div>
        </form>
    `;
    
    modal.classList.add('active');
    
    const dateInp = document.getElementById('resDate');
    const timeInp = document.getElementById('resTime');
    const peopleInp = document.getElementById('resPeople');
    const tableSel = document.getElementById('resTable');
    
    function updateTables() {
        const date = dateInp.value;
        const time = timeInp.value;
        const people = parseInt(peopleInp.value) || 1;
        if (date && time) {
            const available = getAvailableTables(date, time, people, editingReservation?.id);
            tableSel.innerHTML = available.map(t => `<option value="${t.name}" ${editingReservation && editingReservation.table === t.name ? 'selected' : ''}>${t.name} (${t.capacity} pessoas)</option>`).join('');
            if (!available.length) tableSel.innerHTML = '<option disabled>nenhuma mesa disponível neste horário</option>';
        }
    }
    
    dateInp.onchange = updateTables;
    timeInp.onchange = updateTables;
    peopleInp.oninput = updateTables;
    updateTables();
    
    document.getElementById('resForm').onsubmit = (e) => {
        e.preventDefault();
        const date = dateInp.value;
        const time = timeInp.value;
        const check = isRestaurantOpen(date, time);
        if (!check.open) { alert(check.reason); return; }
        const table = tableSel.value;
        if (!table || table.includes('nenhuma')) { alert('mesa indisponível'); return; }
        
        if (editingReservation) {
            editingReservation.name = document.getElementById('resName').value;
            editingReservation.phone = document.getElementById('resPhone').value;
            editingReservation.date = date;
            editingReservation.time = time;
            editingReservation.people = parseInt(peopleInp.value);
            editingReservation.table = table;
            editingReservation.status = document.getElementById('resStatus').value;
            addActivity(`reserva editada: ${editingReservation.name}`);
        } else {
            DB.reservations.push({
                id: DB.reservations.length + 1,
                name: document.getElementById('resName').value,
                phone: document.getElementById('resPhone').value,
                date: date,
                time: time,
                people: parseInt(peopleInp.value),
                table: table,
                status: document.getElementById('resStatus').value,
                notes: ''
            });
            addActivity(`nova reserva adicionada`);
        }
        closeModal();
        loadModule(currentModule);
    };
}

// ==================== modal cardápio ====================
function openMenuItemModal() {
    const modal = document.getElementById('globalModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2 style="margin-bottom:24px; font-family:'Playfair Display';">adicionar item ao cardápio</h2>
        <form id="menuForm">
            <div class="form-group"><label>nome do item *</label><input type="text" id="itemName" required></div>
            <div class="form-group"><label>categoria *</label><select id="itemCat"><option>Pratos Principais</option><option>Porções</option><option>Bebidas</option><option>Sobremesas</option><option>Entradas</option></select></div>
            <div class="form-group"><label>preço (r$) *</label><input type="number" id="itemPrice" step="0.01" required></div>
            <div class="form-group"><label>descrição *</label><textarea id="itemDesc" rows="3" placeholder="descreva o prato, ingredientes, acompanhamentos..." required></textarea></div>
            <div style="display:flex; gap:16px; justify-content:flex-end; margin-top:24px">
                <button type="button" class="btn-secondary" onclick="closeModal()">cancelar</button>
                <button type="submit" class="btn-primary">adicionar</button>
            </div>
        </form>
    `;
    
    modal.classList.add('active');
    
    document.getElementById('menuForm').onsubmit = (e) => {
        e.preventDefault();
        DB.menu.push({
            id: DB.menu.length + 1,
            name: document.getElementById('itemName').value,
            category: document.getElementById('itemCat').value,
            price: parseFloat(document.getElementById('itemPrice').value),
            description: document.getElementById('itemDesc').value
        });
        addActivity(`item adicionado ao cardápio`);
        closeModal();
        loadModule(currentModule);
    };
}

// ==================== funções globais ====================
function closeModal() { document.getElementById('globalModal').classList.remove('active'); editingReservation = null; }
function editReservation(id) { openReservationModal(id); }
function cancelReservation(id) { if(confirm('cancelar esta reserva?')){ const i=DB.reservations.findIndex(r=>r.id===id); if(i!==-1) DB.reservations.splice(i,1); addActivity('reserva cancelada'); loadModule(currentModule); } }
function deleteMenuItem(id) { if(confirm('remover este item do cardápio?')){ const i=DB.menu.findIndex(m=>m.id===id); if(i!==-1) DB.menu.splice(i,1); addActivity('item removido'); loadModule(currentModule); } }
function editEnvironment(id) { openEnvironmentModal(false, id); }
function deleteEnvironment(id) { if(confirm('excluir este ambiente?')){ const i=DB.environments.findIndex(e=>e.id===id); if(i!==-1) DB.environments.splice(i,1); addActivity('ambiente removido'); loadModule(currentModule); } }
function removeFromCarousel(id) { const e=DB.environments.find(e=>e.id===id); if(e){ e.isCarousel=false; addActivity('ambiente removido do carrossel'); loadModule(currentModule); } }

// ==================== renderização ====================
function renderOverview() {
    return `
        <div class="kpi-grid">
            <div class="kpi-card"><div class="kpi-icon"><i class="fas fa-calendar-alt"></i></div><div class="kpi-value">${DB.reservations.length}</div><div class="kpi-label">reservas</div></div>
            <div class="kpi-card"><div class="kpi-icon"><i class="fas fa-utensils"></i></div><div class="kpi-value">${DB.menu.length}</div><div class="kpi-label">cardápio</div></div>
            <div class="kpi-card"><div class="kpi-icon"><i class="fas fa-images"></i></div><div class="kpi-value">${DB.environments.length}</div><div class="kpi-label">ambientes</div></div>
            <div class="kpi-card"><div class="kpi-icon"><i class="fas fa-star"></i></div><div class="kpi-value">4.9</div><div class="kpi-label">avaliação</div></div>
        </div>
        <div class="two-col-grid">
            <div class="card"><div class="card-header"><h3>próximas reservas</h3></div><div class="card-body"><div class="table-responsive"><table class="table"><thead> <th>cliente</th><th>data</th><th>horário</th><th>status</th> </thead><tbody>${DB.reservations.slice(0,5).map(r => `<tr><td>${r.name}</td><td>${formatDate(r.date)}</td><td>${r.time}</td><td><span class="status-badge status-${r.status}">${r.status}</span></td></tr>`).join('')}</tbody></table></div></div></div>
            <div class="card"><div class="card-header"><h3>atividades</h3></div><div class="card-body">${DB.activities.slice(0,8).map(a => `<div class="activity-item"><div class="activity-icon"><i class="fas ${a.icon}"></i></div><div class="activity-text"><p>${a.action}</p><span class="activity-time">${a.user} • ${a.time}</span></div></div>`).join('')}</div></div>
        </div>
    `;
}

function renderReservations() {
    return `
        <div class="card" style="margin-bottom:32px"><div class="card-header"><h3>nova reserva</h3><button class="btn-primary" id="openReservationBtn">+ nova</button></div></div>
        <div class="card"><div class="card-header"><h3>lista de reservas</h3></div><div class="card-body"><div class="table-responsive"><table class="table"><thead><th>cliente</th><th>contato</th><th>data/hora</th><th>pessoas</th><th>mesa</th><th>status</th><th>ações</th></thead><tbody>${DB.reservations.map(r => `<tr><td>${r.name}</td><td>${r.phone}</td><td>${formatDate(r.date)} ${r.time}h</td><td>${r.people}</td><td>${r.table}</td><td><span class="status-badge status-${r.status}">${r.status}</span></td><td><button class="btn-icon" onclick="editReservation(${r.id})"><i class="fas fa-edit"></i></button><button class="btn-icon danger" onclick="cancelReservation(${r.id})"><i class="fas fa-times"></i></button></td></tr>`).join('')}</tbody></table></div></div></div>
    `;
}

function renderMenu() {
    const cats = [...new Set(DB.menu.map(i => i.category))];
    return `
        <div class="card" style="margin-bottom:32px"><div class="card-header"><h3>adicionar item</h3><button class="btn-primary" id="openMenuItemBtn">+ novo</button></div></div>
        ${cats.map(cat => `<div class="card" style="margin-bottom:24px"><div class="card-header"><h3>${cat}</h3></div><div class="card-body"><div class="table-responsive"><table class="table"><thead><th>item</th><th>descrição</th><th>preço</th><th>ações</th></thead><tbody>${DB.menu.filter(i => i.category === cat).map(i => `<tr><td><strong>${i.name}</strong></td><td>${i.description}</td><td>${formatCurrency(i.price)}</td><td><button class="btn-icon danger" onclick="deleteMenuItem(${i.id})"><i class="fas fa-trash"></i></button></td></tr>`).join('')}</tbody></table></div></div></div>`).join('')}
    `;
}

function renderEnvironments() {
    const carousel = DB.environments.filter(e => e.isCarousel);
    const gallery = DB.environments.filter(e => !e.isCarousel);
    return `
        <div class="card" style="margin-bottom:32px"><div class="card-header"><h3>carrossel (slides do topo)</h3><button class="btn-primary" id="openCarouselBtn">+ adicionar</button></div><div class="card-body"><div class="slots-container">${carousel.map(e => `<div class="slot-item carousel-active"><img class="slot-image" src="${e.image}"><div class="slot-info"><div class="slot-title">${e.title}</div><div class="slot-actions"><button class="btn-secondary" onclick="editEnvironment(${e.id})">editar</button><button class="btn-danger" onclick="removeFromCarousel(${e.id})">remover</button></div></div></div>`).join('')}${carousel.length === 0 ? '<p style="color:var(--gray-text)">nenhum slide no carrossel</p>' : ''}</div></div></div>
        <div class="card"><div class="card-header"><h3>galeria de ambientes</h3><button class="btn-primary" id="openGalleryBtn">+ novo</button></div><div class="card-body"><div class="gallery-grid">${gallery.map(e => `<div class="gallery-item"><img class="gallery-image" src="${e.image}"><div class="gallery-info"><div class="gallery-title">${e.title}</div><div class="gallery-desc">${e.description.substring(0,80)}...</div><div class="slot-actions"><button class="btn-secondary" onclick="editEnvironment(${e.id})">editar</button><button class="btn-danger" onclick="deleteEnvironment(${e.id})">excluir</button></div></div></div>`).join('')}</div></div></div>
    `;
}

// ==================== navegação ====================
function loadModule(module) {
    currentModule = module;
    const area = document.getElementById('contentArea');
    const title = document.getElementById('pageTitle');
    const titles = { overview:'visão geral', reservations:'reservas', menu:'cardápio', environments:'ambientes' };
    title.textContent = titles[module];
    
    switch(module) {
        case 'overview': area.innerHTML = renderOverview(); break;
        case 'reservations': area.innerHTML = renderReservations(); setTimeout(() => document.getElementById('openReservationBtn')?.addEventListener('click', () => openReservationModal()), 100); break;
        case 'menu': area.innerHTML = renderMenu(); setTimeout(() => document.getElementById('openMenuItemBtn')?.addEventListener('click', openMenuItemModal), 100); break;
        case 'environments': area.innerHTML = renderEnvironments(); setTimeout(() => { document.getElementById('openCarouselBtn')?.addEventListener('click', () => openEnvironmentModal(true)); document.getElementById('openGalleryBtn')?.addEventListener('click', () => openEnvironmentModal(false)); }, 100); break;
    }
}

function updateDateTime() {
    const el = document.getElementById('currentDateTime');
    if(el) el.textContent = new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
}

// ==================== inicialização ====================
document.addEventListener('DOMContentLoaded', () => {
    loadModule('overview');
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            loadModule(item.getAttribute('data-module'));
        });
    });
    
    document.getElementById('refreshBtn')?.addEventListener('click', () => loadModule(currentModule));
    document.getElementById('logoutBtn')?.addEventListener('click', () => alert('sessão encerrada'));
    
    const modal = document.getElementById('globalModal');
    document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
});

// exportar
window.closeModal = closeModal;
window.editReservation = editReservation;
window.cancelReservation = cancelReservation;
window.deleteMenuItem = deleteMenuItem;
window.editEnvironment = editEnvironment;
window.deleteEnvironment = deleteEnvironment;
window.removeFromCarousel = removeFromCarousel;