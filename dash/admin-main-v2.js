document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('mainContent');
    const navItems = document.querySelectorAll('.nav-item');

    // --- CONFIGURAÇÃO BARBINA ---
    const CONFIG = {
        diasFechado: [1], // Segunda-feira
        horario: {
            abre: "18:00",
            fecha: "23:30"
        },
        mesas: [
            { id: "01", cap: 2 },
            { id: "02", cap: 2 },
            { id: "03", cap: 4 },
            { id: "04", cap: 4 },
            { id: "05", cap: 6 },
            { id: "Varanda", cap: 10 }
        ]
    };

    let DB = {
        reservas: [
            { id: 1, cliente: 'Carlos Alberto', mesa: '02', data: '2026-03-14', hora: '20:30', pessoas: 4, status: 'confirmada' },
            { id: 2, cliente: 'Mariana Silva', mesa: '05', data: '2026-03-15', hora: '19:00', pessoas: 2, status: 'pendente' }
        ],
        cardapio: [
            { id: 1, url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200', nome: 'Risoto de Funghi', categoria: 'Principais', preco: 89.90 }
        ],
        biblioteca: [
            { id: 1, url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', titulo: 'Salão Principal', secao: 'ambientes' }
        ],
        logs: [
            { acao: 'Sistema iniciado', tempo: 'Agora' }
        ]
    };

    // --- DISPONIBILIDADE EM TEMPO REAL ---
    window.atualizarMesasDisponiveis = () => {
        const dataSel = document.getElementById('resData').value;
        const horaSel = document.getElementById('resHora').value;
        const pessoasSel = parseInt(document.getElementById('resPessoas').value) || 0;
        const selectMesa = document.getElementById('resMesa');
        const idEdit = document.getElementById('editReservaId').value;

        if (!dataSel || !horaSel) return;

        selectMesa.innerHTML = '<option value="">Escolha uma mesa livre...</option>';

        CONFIG.mesas.forEach(mesa => {
            const ocupada = DB.reservas.find(r => 
                r.id != idEdit && 
                r.data === dataSel && 
                r.hora === horaSel && 
                r.mesa === mesa.id && 
                r.status !== 'cancelada'
            );

            if (!ocupada && mesa.cap >= pessoasSel) {
                const opt = document.createElement('option');
                opt.value = mesa.id;
                opt.textContent = `Mesa ${mesa.id} (${mesa.cap} pessoas)`;
                selectMesa.appendChild(opt);
            }
        });
    };

    // --- NAVEGAÇÃO ---
    function navigate(tabId) {
        navItems.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        if (tabId === 'visao-geral') renderVisaoGeral();
        else if (tabId === 'reservas') renderReservas();
        else if (tabId === 'cardapio') renderCardapio();
        else if (tabId === 'biblioteca') renderBiblioteca();
    }

    // --- RENDERIZADORES ---
    function renderVisaoGeral() {
        const totalPessoas = DB.reservas.reduce((acc, r) => acc + parseInt(r.pessoas), 0);
        
        content.innerHTML = `
            <div class="section-header"><h1>Visão Geral</h1></div>
            <div class="kpi-grid">
                <div class="kpi-card"><h4>Reservas</h4><div class="kpi-value">${DB.reservas.length}</div></div>
                <div class="kpi-card"><h4>Previstos</h4><div class="kpi-value">${totalPessoas}</div></div>
                <div class="kpi-card"><h4>Pratos</h4><div class="kpi-value">${DB.cardapio.length}</div></div>
            </div>
            <div class="dashboard-grid">
                <div class="content-card">
                    <h3>Check-in</h3>
                    <table>
                        ${DB.reservas.map(r => `
                            <tr>
                                <td><strong>${r.cliente}</strong></td>
                                <td>Mesa ${r.mesa}</td>
                                <td><span class="status-badge ${r.status}">${r.status}</span></td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                <div class="content-card">
                    <h3>Logs</h3>
                    <ul class="log-list">
                        ${DB.logs.slice(0, 5).map(l => `
                            <li class="log-item">${l.acao} <span class="time">${l.tempo}</span></li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    function renderReservas() {
        content.innerHTML = `
            <div class="section-header">
                <h1>Reservas</h1>
                <button class="btn-primary" style="width:auto" onclick="openModalReserva()">+ Nova Reserva</button>
            </div>
            <div class="content-card">
                <table>
                    <thead>
                        <tr><th>Cliente</th><th>Pessoas</th><th>Mesa</th><th>Status</th><th>Ações</th></tr>
                    </thead>
                    <tbody>
                        ${DB.reservas.map(r => `
                            <tr>
                                <td><strong>${r.cliente}</strong></td>
                                <td>${r.pessoas} <i class="fas fa-user"></i></td>
                                <td>Mesa ${r.mesa}</td>
                                <td><span class="status-badge ${r.status}">${r.status}</span></td>
                                <td>
                                    <button class="btn-action" onclick="editReserva(${r.id})">✎</button>
                                    <button class="btn-action del" onclick="deleteItem('reservas', ${r.id})">✕</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderCardapio() {
        content.innerHTML = `
            <div class="section-header">
                <h1>Cardápio</h1>
                <button class="btn-primary" style="width:auto" onclick="openModalPrato()">+ Novo Prato</button>
            </div>
            <div class="content-card">
                <table>
                    <thead>
                        <tr><th>Foto</th><th>Nome</th><th>Preço</th><th>Ações</th></tr>
                    </thead>
                    <tbody>
                        ${DB.cardapio.map(p => `
                            <tr>
                                <td><img src="${p.url}" class="thumb-img"></td>
                                <td><strong>${p.nome}</strong></td>
                                <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
                                <td>
                                    <button class="btn-action" onclick="editPrato(${p.id})">✎</button>
                                    <button class="btn-action del" onclick="deleteItem('cardapio', ${p.id})">✕</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderBiblioteca() {
        content.innerHTML = `
            <div class="section-header">
                <h1>Biblioteca</h1>
                <button class="btn-primary" style="width:auto" onclick="openModal('modalBiblioteca')">+ Adicionar Foto</button>
            </div>
            <div class="photo-grid">
                ${DB.biblioteca.map(f => `
                    <div class="photo-card">
                        <div class="photo-img"><img src="${f.url}"></div>
                        <div class="photo-info">
                            <span class="section-tag">${f.secao}</span>
                            <strong>${f.titulo}</strong>
                            <button class="btn-delete-card" onclick="deleteItem('biblioteca', ${f.id})">✕</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // --- UPLOAD DE ARQUIVO ---
    async function getImageUrl(urlId, fileId) {
        const url = document.getElementById(urlId).value;
        const file = document.getElementById(fileId).files[0];
        if (file) {
            return new Promise(res => {
                const reader = new FileReader();
                reader.onload = e => res(e.target.result);
                reader.readAsDataURL(file);
            });
        }
        return url;
    }

    // --- SUBMITS ---
    document.getElementById('formReserva').onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('editReservaId').value;
        const data = document.getElementById('resData').value;
        const hora = document.getElementById('resHora').value;

        if (new Date(data + 'T00:00:00').getDay() === 1) return alert("Fechado às segundas!");
        if (hora < CONFIG.horario.abre || hora > CONFIG.horario.fecha) return alert("Horário fora do funcionamento!");

        const dados = {
            id: id || Date.now(),
            cliente: document.getElementById('resNome').value,
            data,
            hora,
            pessoas: document.getElementById('resPessoas').value,
            mesa: document.getElementById('resMesa').value,
            status: document.getElementById('resStatus').value
        };

        if (id) {
            const idx = DB.reservas.findIndex(r => r.id == id);
            DB.reservas[idx] = dados;
        } else {
            DB.reservas.push(dados);
        }
        closeModal('modalReserva');
        renderReservas();
    };

    document.getElementById('formPrato').onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('editPratoId').value;
        const img = await getImageUrl('pratoImg', 'pratoFile');
        
        const dados = {
            id: id || Date.now(),
            url: img || 'https://via.placeholder.com/200',
            nome: document.getElementById('pratoNome').value,
            categoria: document.getElementById('pratoCat').value,
            preco: document.getElementById('pratoPreco').value
        };

        if (id) {
            const idx = DB.cardapio.findIndex(p => p.id == id);
            DB.cardapio[idx] = dados;
        } else {
            DB.cardapio.push(dados);
        }
        closeModal('modalPrato');
        renderCardapio();
    };

    document.getElementById('formBiblioteca').onsubmit = async (e) => {
        e.preventDefault();
        const img = await getImageUrl('fotoUrl', 'fotoFile');
        const area = document.getElementById('fotoArea').value;
        
        DB.biblioteca.push({
            id: Date.now(),
            url: img,
            secao: area,
            titulo: area === 'home' ? document.getElementById('homeTitulo').value : 'Nova Foto'
        });
        closeModal('modalBiblioteca');
        renderBiblioteca();
    };

    // --- UTILITÁRIOS ---
    window.openModal = (id) => document.getElementById(id).classList.add('show');
    
    window.closeModal = (id) => {
        document.getElementById(id).classList.remove('show');
        document.querySelector(`#${id} form`).reset();
    };

    window.openModalPrato = () => {
        document.getElementById('modalPratoTitulo').innerText = "Novo Prato";
        document.getElementById('editPratoId').value = "";
        openModal('modalPrato');
    };

    window.openModalReserva = () => {
        document.getElementById('modalReservaTitulo').innerText = "Nova Reserva";
        document.getElementById('editReservaId').value = "";
        document.getElementById('resMesa').innerHTML = '<option value="">Defina data/hora...</option>';
        openModal('modalReserva');
    };

    window.editPrato = (id) => {
        const p = DB.cardapio.find(i => i.id == id);
        document.getElementById('editPratoId').value = p.id;
        document.getElementById('pratoNome').value = p.nome;
        document.getElementById('pratoPreco').value = p.preco;
        openModal('modalPrato');
    };

    window.editReserva = (id) => {
        const r = DB.reservas.find(i => i.id == id);
        document.getElementById('editReservaId').value = r.id;
        document.getElementById('resNome').value = r.cliente;
        document.getElementById('resData').value = r.data;
        document.getElementById('resHora').value = r.hora;
        document.getElementById('resPessoas').value = r.pessoas;
        atualizarMesasDisponiveis();
        document.getElementById('resMesa').value = r.mesa;
        openModal('modalReserva');
    };

    window.deleteItem = (type, id) => {
        if (confirm("Excluir?")) {
            DB[type] = DB[type].filter(i => i.id != id);
            navigate(type === 'visao-geral' ? 'visao-geral' : type);
        }
    };

    window.toggleSmartFields = () => {
        const area = document.getElementById('fotoArea').value;
        document.querySelectorAll('.smart-group').forEach(g => g.style.display = 'none');
        if (area && document.getElementById(`smart-${area}`)) {
            document.getElementById(`smart-${area}`).style.display = 'block';
        }
    };

    // EVENT LISTENERS
    document.getElementById('resData').addEventListener('change', atualizarMesasDisponiveis);
    document.getElementById('resHora').addEventListener('change', atualizarMesasDisponiveis);
    document.getElementById('resPessoas').addEventListener('input', atualizarMesasDisponiveis);

    navItems.forEach(item => item.onclick = () => navigate(item.dataset.tab));
    navigate('visao-geral');
});