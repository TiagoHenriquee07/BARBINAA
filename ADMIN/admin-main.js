// admin-main.js · barbina os · gestao profissional completa

document.addEventListener('DOMContentLoaded', function() {
    // ---------- configuracao de mesas ----------
    const MESAS = [
        { numero: 1, capacidade: 2, disponivel: true },
        { numero: 2, capacidade: 2, disponivel: true },
        { numero: 3, capacidade: 4, disponivel: true },
        { numero: 4, capacidade: 4, disponivel: true },
        { numero: 5, capacidade: 6, disponivel: true },
        { numero: 6, capacidade: 6, disponivel: true },
        { numero: 7, capacidade: 2, disponivel: true },
        { numero: 8, capacidade: 2, disponivel: true },
        { numero: 9, capacidade: 4, disponivel: true },
        { numero: 10, capacidade: 4, disponivel: true },
        { numero: 11, capacidade: 8, disponivel: true },
        { numero: 12, capacidade: 8, disponivel: true }
    ];

    // ---------- dados mock ----------
    const dados = {
        financeiro: [
            { data: '20/02/2026', descricao: 'vendas almoco', tipo: 'entrada', valor: 4850.00, forma: 'dinheiro' },
            { data: '20/02/2026', descricao: 'fornecedor insumos', tipo: 'saida', valor: 1230.50, forma: 'pix' },
            { data: '19/02/2026', descricao: 'evento corporativo', tipo: 'entrada', valor: 7200.00, forma: 'transferencia' },
            { data: '19/02/2026', descricao: 'taxas de cartao', tipo: 'saida', valor: 215.90, forma: 'debito' },
            { data: '18/02/2026', descricao: 'vendas jantar', tipo: 'entrada', valor: 6320.00, forma: 'credito' },
            { data: '18/02/2026', descricao: 'compra de vinhos', tipo: 'saida', valor: 3450.00, forma: 'pix' },
        ],
        reservas: [
            { id: 1, cliente: 'alfredo bianchi', mesa: 7, data: '2026-02-20T20:00', pessoas: 4, status: 'confirmada', obs: 'aniversario' },
            { id: 2, cliente: 'carla moretti', mesa: 12, data: '2026-02-21T21:30', pessoas: 2, status: 'confirmada', obs: '' },
            { id: 3, cliente: 'jonathan gold', mesa: 5, data: '2026-02-22T19:45', pessoas: 6, status: 'pendente', obs: 'sem gluten' },
            { id: 4, cliente: 'isabela serrano', mesa: 3, data: '2026-02-23T13:00', pessoas: 3, status: 'confirmada', obs: '' },
            { id: 5, cliente: 'roberto campos', mesa: 9, data: '2026-02-24T20:30', pessoas: 8, status: 'cancelada', obs: '' },
        ],
        cardapio: [
            { foto: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100', nome: 'risotto de funghi', descricao: 'arroz cremoso com cogumelos porcini', categoria: 'principais', preco: 98.50 },
            { foto: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100', nome: 'file mignon ao molho', descricao: 'com reducao de vinho tinto', categoria: 'principais', preco: 149.90 },
            { foto: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100', nome: 'salmao selado', descricao: 'com pure de batata trufado', categoria: 'principais', preco: 127.00 },
            { foto: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100', nome: 'tiramisu', descricao: 'sobremesa italiana', categoria: 'sobremesas', preco: 42.00 },
        ],
        estoque: [
            { id: 1, item: 'camarao rosa', quantidade: '2,3 kg', minimo: '3 kg', status: 'critico', fornecedor: 'mar & cia' },
            { id: 2, item: 'trufa negra', quantidade: '120 g', minimo: '200 g', status: 'critico', fornecedor: 'importadora trufas' },
            { id: 3, item: 'queijo parmesao', quantidade: '5,2 kg', minimo: '4 kg', status: 'ok', fornecedor: 'laticinios gold' },
            { id: 4, item: 'vinho tinto', quantidade: '34 un', minimo: '30 un', status: 'ok', fornecedor: 'vinheria' },
            { id: 5, item: 'manteiga', quantidade: '3,8 kg', minimo: '2 kg', status: 'ok', fornecedor: 'laticinios gold' },
            { id: 6, item: 'farinha', quantidade: '12 kg', minimo: '5 kg', status: 'ok', fornecedor: 'distribuidora' },
        ],
        equipe: [
            { id: 1, nome: 'clara mendes', cargo: 'chef de cozinha', turno: 'noturno', status: 'ativo', salario: 8500, admissao: '10/01/2023', telefone: '(11) 99999-1234', email: 'clara@barbina.com' },
            { id: 2, nome: 'roberto nunes', cargo: 'sommelier', turno: 'vespertino', status: 'ativo', salario: 6200, admissao: '15/03/2024', telefone: '(11) 98888-5678', email: 'roberto@barbina.com' },
            { id: 3, nome: 'luciana braga', cargo: 'maitre', turno: 'noturno', status: 'ferias', salario: 5800, admissao: '22/06/2022', telefone: '(11) 97777-9012', email: 'luciana@barbina.com' },
            { id: 4, nome: 'fernando luz', cargo: 'cozinheiro', turno: 'matutino', status: 'ativo', salario: 3800, admissao: '02/09/2025', telefone: '(11) 96666-3456', email: 'fernando@barbina.com' },
            { id: 5, nome: 'gisele azevedo', cargo: 'garconete', turno: 'noturno', status: 'afastado', salario: 2500, admissao: '11/11/2024', telefone: '(11) 95555-7890', email: 'gisele@barbina.com' },
        ]
    };

    // ---------- sistema de notificacoes ----------
    function showNotification(mensagem, tipo = 'sucesso') {
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao notificacao-${tipo}`;
        notificacao.innerHTML = `
            <div class="notificacao-conteudo">
                <span class="notificacao-icon">${tipo === 'sucesso' ? '✓' : tipo === 'erro' ? '✕' : 'ℹ'}</span>
                <span class="notificacao-mensagem">${mensagem}</span>
            </div>
        `;
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            notificacao.classList.add('notificacao-mostrar');
        }, 10);
        
        setTimeout(() => {
            notificacao.classList.remove('notificacao-mostrar');
            setTimeout(() => {
                if (document.body.contains(notificacao)) {
                    document.body.removeChild(notificacao);
                }
            }, 300);
        }, 3000);
    }

    // ---------- modal de confirmacao ----------
    function showConfirmModal(titulo, mensagem, callbackConfirmar, callbackCancelar = null) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.display = 'flex';
        
        const modal = document.createElement('div');
        modal.className = 'modal confirm-modal';
        modal.style.maxWidth = '400px';
        
        modal.innerHTML = `
            <div class="modal-header">
                <h2>${titulo}</h2>
                <button class="modal-close confirm-close">&times;</button>
            </div>
            <div class="modal-body">
                <p style="font-size:1rem; color:var(--gray-700);">${mensagem}</p>
            </div>
            <div class="modal-footer" style="justify-content:center;">
                <button class="btn-secondary confirm-cancelar">cancelar</button>
                <button class="btn-primary confirm-confirmar">confirmar</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        const closeModal = () => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        };
        
        modal.querySelector('.confirm-close').addEventListener('click', () => {
            if (callbackCancelar) callbackCancelar();
            closeModal();
        });
        
        modal.querySelector('.confirm-cancelar').addEventListener('click', () => {
            if (callbackCancelar) callbackCancelar();
            closeModal();
        });
        
        modal.querySelector('.confirm-confirmar').addEventListener('click', () => {
            callbackConfirmar();
            closeModal();
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (callbackCancelar) callbackCancelar();
                closeModal();
            }
        });
    }

    // ---------- modal de detalhes ----------
    function showDetailsModal(titulo, conteudo) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.display = 'flex';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.maxWidth = '450px';
        
        modal.innerHTML = `
            <div class="modal-header">
                <h2>${titulo}</h2>
                <button class="modal-close details-close">&times;</button>
            </div>
            <div class="modal-body">
                ${conteudo}
            </div>
            <div class="modal-footer">
                <button class="btn-primary details-close">fechar</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        const closeModal = () => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        };
        
        modal.querySelectorAll('.details-close').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }

    // ---------- modal de edicao de funcionario ----------
    function showEditarFuncionarioModal(funcionario) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.display = 'flex';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.maxWidth = '500px';
        
        modal.innerHTML = `
            <div class="modal-header">
                <h2>editar funcionario</h2>
                <button class="modal-close editar-close">&times;</button>
            </div>
            <form id="formEditarFuncionario">
                <div class="modal-body">
                    <div class="field">
                        <label>nome completo</label>
                        <input type="text" id="editNome" value="${funcionario.nome}" required>
                    </div>
                    <div class="field">
                        <label>cargo</label>
                        <input type="text" id="editCargo" value="${funcionario.cargo}" required>
                    </div>
                    <div class="field">
                        <label>turno</label>
                        <select id="editTurno">
                            <option ${funcionario.turno === 'matutino' ? 'selected' : ''}>matutino</option>
                            <option ${funcionario.turno === 'vespertino' ? 'selected' : ''}>vespertino</option>
                            <option ${funcionario.turno === 'noturno' ? 'selected' : ''}>noturno</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>status</label>
                        <select id="editStatus">
                            <option ${funcionario.status === 'ativo' ? 'selected' : ''}>ativo</option>
                            <option ${funcionario.status === 'ferias' ? 'selected' : ''}>ferias</option>
                            <option ${funcionario.status === 'afastado' ? 'selected' : ''}>afastado</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>salario (r$)</label>
                        <input type="number" id="editSalario" value="${funcionario.salario}" step="100" required>
                    </div>
                    <div class="field">
                        <label>telefone</label>
                        <input type="text" id="editTelefone" value="${funcionario.telefone || ''}">
                    </div>
                    <div class="field">
                        <label>e-mail</label>
                        <input type="email" id="editEmail" value="${funcionario.email || ''}">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary editar-close">cancelar</button>
                    <button type="submit" class="btn-primary">salvar alteracoes</button>
                </div>
            </form>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        const closeModal = () => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        };
        
        modal.querySelectorAll('.editar-close').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        
        document.getElementById('formEditarFuncionario').addEventListener('submit', (e) => {
            e.preventDefault();
            
            funcionario.nome = document.getElementById('editNome').value;
            funcionario.cargo = document.getElementById('editCargo').value;
            funcionario.turno = document.getElementById('editTurno').value;
            funcionario.status = document.getElementById('editStatus').value;
            funcionario.salario = parseFloat(document.getElementById('editSalario').value);
            funcionario.telefone = document.getElementById('editTelefone').value;
            funcionario.email = document.getElementById('editEmail').value;
            
            renderTab('tab6');
            closeModal();
            showNotification('dados do funcionario atualizados', 'sucesso');
        });
    }

    // ---------- funcoes de disponibilidade de mesas ----------
    function getMesasDisponiveis(data, pessoas) {
        const dataObj = new Date(data);
        const dataStr = dataObj.toISOString().split('T')[0];
        
        const reservasNoDia = dados.reservas.filter(r => {
            if (r.status === 'cancelada') return false;
            const rData = new Date(r.data);
            const rDataStr = rData.toISOString().split('T')[0];
            return rDataStr === dataStr;
        });

        const mesasOcupadas = reservasNoDia.map(r => r.mesa);
        
        return MESAS.filter(m => {
            if (mesasOcupadas.includes(m.numero)) return false;
            if (pessoas && m.capacidade < parseInt(pessoas)) return false;
            return true;
        });
    }

    function atualizarSelectMesas(selectElement, data, pessoas) {
        selectElement.innerHTML = '';
        const disponiveis = getMesasDisponiveis(data, pessoas);
        
        if (disponiveis.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'nenhuma mesa disponivel';
            option.disabled = true;
            selectElement.appendChild(option);
        } else {
            disponiveis.forEach(m => {
                const option = document.createElement('option');
                option.value = m.numero;
                option.textContent = `mesa ${m.numero} (${m.capacidade} pessoas)`;
                selectElement.appendChild(option);
            });
        }
    }

    // ---------- elementos ----------
    const navItems = document.querySelectorAll('.nav-item');
    const content = document.getElementById('mainContent');
    const modalPrato = document.getElementById('modalPrato');
    const modalFunc = document.getElementById('modalFuncionario');
    const modalReserva = document.getElementById('modalReserva');
    const modalPerfil = document.getElementById('modalPerfil');
    const modalEstoqueMov = document.getElementById('modalEstoqueMov');
    const userTrigger = document.getElementById('userMenuTrigger');
    const userDropdown = document.getElementById('userDropdown');

    // ---------- funcoes auxiliares ----------
    function formatarDataISO(datetime) {
        if (!datetime) return '';
        const d = new Date(datetime);
        return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    }

    // ---------- renderizar aba ----------
    function renderTab(tabId) {
        navItems.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.nav-item[data-tab="${tabId}"]`).classList.add('active');

        let html = '';

        if (tabId === 'tab1') { // dashboard
            html = `
                <div class="section-header">
                    <h2>dashboard</h2>
                    <div class="action-bar">
                        <div class="search-box">
                            <input type="text" placeholder="buscar...">
                            <button>ir</button>
                        </div>
                    </div>
                </div>

                <div class="kpi-grid">
                    <div class="kpi-card"><h4>faturamento (hoje)</h4><div class="kpi-value">R$ 23.450</div><span class="kpi-trend">↑ 12% vs ontem</span></div>
                    <div class="kpi-card"><h4>meta mensal</h4><div class="kpi-value">78%</div><span class="kpi-trend">R$ 312k / R$ 400k</span></div>
                    <div class="kpi-card"><h4>ticket medio</h4><div class="kpi-value">R$ 189,70</div><span class="kpi-trend">↑ 5%</span></div>
                    <div class="kpi-card"><h4>ocupacao</h4><div class="kpi-value">74%</div><span class="kpi-trend">58 lugares ocupados</span></div>
                </div>

                <div class="chart-container">
                    <h3 style="margin-bottom:1rem;">movimento ultimos 7 dias</h3>
                    <div class="chart-bars">
                        <div class="bar" style="height:60px;" data-label="seg"></div>
                        <div class="bar" style="height:85px;" data-label="ter"></div>
                        <div class="bar" style="height:70px;" data-label="qua"></div>
                        <div class="bar" style="height:110px;" data-label="qui"></div>
                        <div class="bar" style="height:95px;" data-label="sex"></div>
                        <div class="bar" style="height:130px;" data-label="sab"></div>
                        <div class="bar" style="height:80px;" data-label="dom"></div>
                    </div>
                </div>

                <div class="progress-card">
                    <div class="progress-header"><span>progresso da meta</span><span>78%</span></div>
                    <div class="progress-bg"><div class="progress-fill" style="width:78%"></div></div>
                </div>

                <div class="alert-card">
                    <strong>⚠️ alertas ativos:</strong> 3 insumos com estoque critico · 2 reservas pendentes · 1 funcionario afastado
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:2rem;">
                    <div class="table-container" style="margin:0;">
                        <table>
                            <thead><tr><th>prato mais vendido</th><th>qtd</th></tr></thead>
                            <tbody>
                                <tr><td>risotto de funghi</td><td>142</td></tr>
                                <tr><td>file mignon</td><td>98</td></tr>
                                <tr><td>salmao</td><td>87</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="table-container" style="margin:0;">
                        <table>
                            <thead><tr><th>proximas reservas</th><th>mesa</th></tr></thead>
                            <tbody>
                                <tr><td>alfredo b. 20:00</td><td>7</td></tr>
                                <tr><td>carla m. 21:30</td><td>12</td></tr>
                                <tr><td>jonathan g. 19:45</td><td>5</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
        else if (tabId === 'tab2') { // financeiro
            let totalEntradas = dados.financeiro.filter(f => f.tipo === 'entrada').reduce((acc, f) => acc + f.valor, 0);
            let totalSaidas = dados.financeiro.filter(f => f.tipo === 'saida').reduce((acc, f) => acc + f.valor, 0);
            
            let linhas = '';
            dados.financeiro.forEach(f => {
                const classe = f.tipo === 'entrada' ? 'valor-positivo' : 'valor-negativo';
                const sinal = f.tipo === 'entrada' ? '+' : '-';
                linhas += `<tr><td>${f.data}</td><td>${f.descricao}</td><td>${f.forma}</td><td class="${classe}">${sinal} R$ ${f.valor.toFixed(2)}</td></tr>`;
            });

            html = `
                <div class="section-header">
                    <h2>financeiro</h2>
                    <div class="action-bar">
                        <select class="filter-select">
                            <option>ultimos 7 dias</option>
                            <option>este mes</option>
                            <option>mes passado</option>
                        </select>
                        <button class="btn-outline">exportar</button>
                    </div>
                </div>

                <div class="kpi-grid">
                    <div class="kpi-card"><h4>entradas (mes)</h4><div class="kpi-value">R$ 32.450</div></div>
                    <div class="kpi-card"><h4>saidas (mes)</h4><div class="kpi-value">R$ 18.230</div></div>
                    <div class="kpi-card"><h4>saldo</h4><div class="kpi-value">R$ 14.220</div></div>
                    <div class="kpi-card"><h4>receita prevista</h4><div class="kpi-value">R$ 45.000</div></div>
                </div>

                <div class="table-container">
                    <table>
                        <thead><tr><th>data</th><th>descricao</th><th>forma</th><th>valor</th></tr></thead>
                        <tbody>${linhas}</tbody>
                    </table>
                </div>
            `;
        }
        else if (tabId === 'tab3') { // reservas
            let linhas = '';
            dados.reservas.sort((a, b) => new Date(a.data) - new Date(b.data)).forEach((r, idx) => {
                const dataFormat = formatarDataISO(r.data);
                const statusClass = r.status === 'confirmada' ? 'status-ok' : (r.status === 'pendente' ? 'status-warning' : 'status-critico');
                linhas += `<tr>
                    <td>${r.cliente}</td>
                    <td>mesa ${r.mesa}</td>
                    <td>${dataFormat}</td>
                    <td>${r.pessoas}</td>
                    <td><span class="status-badge ${statusClass}">${r.status}</span></td>
                    <td>
                        <button class="btn-icon detalhe-reserva" data-index="${idx}">ver</button>
                        <button class="btn-icon cancelar-reserva" data-id="${r.id}">cancelar</button>
                    </td>
                </tr>`;
            });

            html = `
                <div class="section-header">
                    <h2>reservas</h2>
                    <div class="action-bar">
                        <button class="btn-outline" id="btnNovaReserva">+ nova reserva</button>
                    </div>
                </div>

                <div class="filters-bar">
                    <span>filtrar:</span>
                    <select class="filter-select" id="filtroStatusReserva">
                        <option value="todas">todas</option>
                        <option value="confirmada">confirmadas</option>
                        <option value="pendente">pendentes</option>
                        <option value="cancelada">canceladas</option>
                    </select>
                    <input type="date" class="filter-select" id="filtroDataReserva">
                    <button class="btn-icon" id="aplicarFiltros">aplicar</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead><tr><th>cliente</th><th>mesa</th><th>horario</th><th>pessoas</th><th>status</th><th>acoes</th></tr></thead>
                        <tbody id="tabela-reservas">${linhas}</tbody>
                    </table>
                </div>

                <div style="margin-top:2rem; background:var(--white); padding:1.5rem; border-radius:20px;">
                    <h3 style="margin-bottom:1rem;">disponibilidade de mesas</h3>
                    <div style="display:grid; grid-template-columns:repeat(6,1fr); gap:0.5rem;">
                        ${MESAS.map(m => {
                            const ocupada = dados.reservas.some(r => r.mesa === m.numero && r.status !== 'cancelada' && new Date(r.data).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]);
                            return `
                                <div style="padding:0.5rem; text-align:center; background:${!ocupada ? 'var(--gold-light)' : '#fee9e9'}; border-radius:8px;">
                                    mesa ${m.numero}<br>
                                    <small>${m.capacidade} pessoas</small>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        else if (tabId === 'tab4') { // cardapio
            let linhas = '';
            dados.cardapio.forEach(p => {
                linhas += `<tr>
                    <td><img src="${p.foto}" class="prato-thumb"></td>
                    <td>${p.nome}</td>
                    <td>${p.descricao}</td>
                    <td>${p.categoria}</td>
                    <td>R$ ${p.preco.toFixed(2)}</td>
                </tr>`;
            });

            html = `
                <div class="section-header">
                    <h2>cardapio</h2>
                    <div class="action-bar">
                        <button class="btn-outline" id="btnNovoPrato">+ novo prato</button>
                    </div>
                </div>

                <div class="filters-bar">
                    <select class="filter-select" id="filtroCategoria">
                        <option value="todas">todas categorias</option>
                        <option value="entradas">entradas</option>
                        <option value="principais">principais</option>
                        <option value="sobremesas">sobremesas</option>
                    </select>
                </div>

                <div class="table-container">
                    <table>
                        <thead><tr><th>foto</th><th>prato</th><th>descricao</th><th>categoria</th><th>preco</th></tr></thead>
                        <tbody id="tabela-cardapio">${linhas}</tbody>
                    </table>
                </div>
            `;
        }
        else if (tabId === 'tab5') { // estoque
            let linhas = '';
            dados.estoque.forEach(e => {
                const classe = e.status === 'ok' ? 'status-ok' : 'status-critico';
                const rotulo = e.status === 'ok' ? 'ok' : 'critico';
                linhas += `<tr>
                    <td>${e.item}</td>
                    <td>${e.quantidade}</td>
                    <td>${e.minimo}</td>
                    <td><span class="status-badge ${classe}">${rotulo}</span></td>
                    <td>${e.fornecedor}</td>
                    <td><button class="btn-icon mov-estoque" data-id="${e.id}">mov.</button></td>
                </tr>`;
            });

            html = `
                <div class="section-header">
                    <h2>estoque</h2>
                    <div class="action-bar">
                        <button class="btn-outline" id="btnMovEstoque">+ movimentar</button>
                    </div>
                </div>

                <div class="table-container">
                    <table>
                        <thead><tr><th>insumo</th><th>quantidade</th><th>minimo</th><th>status</th><th>fornecedor</th><th></th></tr></thead>
                        <tbody>${linhas}</tbody>
                    </table>
                </div>
            `;
        }
        else if (tabId === 'tab6') { // equipe
            let linhas = '';
            dados.equipe.forEach((f, index) => {
                const classeStatus = f.status === 'ativo' ? 'status-ativo' : (f.status === 'ferias' ? 'status-ferias' : 'status-afastado');
                linhas += `<tr>
                    <td>${f.nome}</td>
                    <td>${f.cargo}</td>
                    <td>${f.turno}</td>
                    <td><span class="status-badge ${classeStatus}">${f.status}</span></td>
                    <td>R$ ${f.salario}</td>
                    <td>${f.admissao}</td>
                    <td>
                        <button class="btn-icon editar-equipe" data-id="${f.id}">editar</button>
                        <button class="btn-icon demitir-equipe" data-id="${f.id}">desligar</button>
                    </td>
                </tr>`;
            });

            html = `
                <div class="section-header">
                    <h2>equipe</h2>
                    <div class="action-bar">
                        <button class="btn-outline" id="btnNovoFuncionario">+ novo funcionario</button>
                    </div>
                </div>

                <div class="filters-bar">
                    <select class="filter-select" id="filtroTurno">
                        <option value="todos">todos turnos</option>
                        <option value="matutino">matutino</option>
                        <option value="vespertino">vespertino</option>
                        <option value="noturno">noturno</option>
                    </select>
                    <select class="filter-select" id="filtroStatusEquipe">
                        <option value="todos">todos status</option>
                        <option value="ativo">ativo</option>
                        <option value="ferias">ferias</option>
                        <option value="afastado">afastado</option>
                    </select>
                </div>

                <div class="table-container">
                    <table>
                        <thead><tr><th>nome</th><th>cargo</th><th>turno</th><th>status</th><th>salario</th><th>admissao</th><th>acoes</th></tr></thead>
                        <tbody id="tabela-equipe">${linhas}</tbody>
                    </table>
                </div>
            `;
        }

        content.innerHTML = html;
        content.style.animation = 'none';
        content.offsetHeight;
        content.style.animation = 'fadeIn 0.3s ease';

        // reanexar eventos
        if (tabId === 'tab3') {
            document.getElementById('btnNovaReserva')?.addEventListener('click', () => {
                const selectMesa = document.getElementById('reservaMesa');
                if (selectMesa) selectMesa.innerHTML = '<option>selecione data primeiro</option>';
                modalReserva.classList.add('show');
            });

            const dataInput = document.getElementById('reservaData');
            const pessoasInput = document.getElementById('reservaPessoas');
            const selectMesa = document.getElementById('reservaMesa');

            if (dataInput) {
                dataInput.addEventListener('change', () => {
                    if (dataInput.value && pessoasInput.value) {
                        atualizarSelectMesas(selectMesa, dataInput.value, pessoasInput.value);
                    }
                });
            }

            if (pessoasInput) {
                pessoasInput.addEventListener('input', () => {
                    if (dataInput.value && pessoasInput.value) {
                        atualizarSelectMesas(selectMesa, dataInput.value, pessoasInput.value);
                    }
                });
            }

            document.querySelectorAll('.detalhe-reserva').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.target.dataset.index;
                    const r = dados.reservas[idx];
                    
                    const conteudo = `
                        <div style="display:flex; flex-direction:column; gap:1rem;">
                            <p><strong>cliente:</strong> ${r.cliente}</p>
                            <p><strong>mesa:</strong> ${r.mesa}</p>
                            <p><strong>horario:</strong> ${formatarDataISO(r.data)}</p>
                            <p><strong>pessoas:</strong> ${r.pessoas}</p>
                            <p><strong>status:</strong> <span class="status-badge ${r.status === 'confirmada' ? 'status-ok' : (r.status === 'pendente' ? 'status-warning' : 'status-critico')}">${r.status}</span></p>
                            <p><strong>observacoes:</strong> ${r.obs || 'sem observacoes'}</p>
                        </div>
                    `;
                    
                    showDetailsModal('detalhes da reserva', conteudo);
                });
            });

            document.querySelectorAll('.cancelar-reserva').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const reserva = dados.reservas.find(r => r.id == id);
                    
                    showConfirmModal(
                        'cancelar reserva',
                        `deseja realmente cancelar a reserva de ${reserva.cliente}?`,
                        () => {
                            reserva.status = 'cancelada';
                            renderTab('tab3');
                            showNotification('reserva cancelada com sucesso', 'sucesso');
                        }
                    );
                });
            });

            document.getElementById('aplicarFiltros')?.addEventListener('click', () => {
                const statusFiltro = document.getElementById('filtroStatusReserva').value;
                const dataFiltro = document.getElementById('filtroDataReserva').value;
                
                let reservasFiltradas = dados.reservas;
                
                if (statusFiltro !== 'todas') {
                    reservasFiltradas = reservasFiltradas.filter(r => r.status === statusFiltro);
                }
                
                if (dataFiltro) {
                    reservasFiltradas = reservasFiltradas.filter(r => {
                        const rData = new Date(r.data).toISOString().split('T')[0];
                        return rData === dataFiltro;
                    });
                }
                
                const tbody = document.getElementById('tabela-reservas');
                if (tbody) {
                    tbody.innerHTML = reservasFiltradas.map(r => {
                        const dataFormat = formatarDataISO(r.data);
                        const statusClass = r.status === 'confirmada' ? 'status-ok' : (r.status === 'pendente' ? 'status-warning' : 'status-critico');
                        return `<tr>
                            <td>${r.cliente}</td>
                            <td>mesa ${r.mesa}</td>
                            <td>${dataFormat}</td>
                            <td>${r.pessoas}</td>
                            <td><span class="status-badge ${statusClass}">${r.status}</span></td>
                            <td>
                                <button class="btn-icon detalhe-reserva" data-index="${dados.reservas.indexOf(r)}">ver</button>
                                <button class="btn-icon cancelar-reserva" data-id="${r.id}">cancelar</button>
                            </td>
                        </tr>`;
                    }).join('');
                    
                    showNotification('filtros aplicados', 'sucesso');
                }
            });
        }
        if (tabId === 'tab4') {
            document.getElementById('btnNovoPrato')?.addEventListener('click', () => modalPrato.classList.add('show'));
            
            document.getElementById('filtroCategoria')?.addEventListener('change', (e) => {
                const categoria = e.target.value;
                const linhas = dados.cardapio
                    .filter(p => categoria === 'todas' || p.categoria === categoria)
                    .map(p => `<tr>
                        <td><img src="${p.foto}" class="prato-thumb"></td>
                        <td>${p.nome}</td>
                        <td>${p.descricao}</td>
                        <td>${p.categoria}</td>
                        <td>R$ ${p.preco.toFixed(2)}</td>
                    </tr>`).join('');
                document.getElementById('tabela-cardapio').innerHTML = linhas;
                showNotification('filtro aplicado', 'sucesso');
            });
        }
        if (tabId === 'tab5') {
            document.getElementById('btnMovEstoque')?.addEventListener('click', () => modalEstoqueMov.classList.add('show'));
            document.querySelectorAll('.mov-estoque').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    modalEstoqueMov.classList.add('show');
                });
            });
        }
        if (tabId === 'tab6') {
            document.getElementById('btnNovoFuncionario')?.addEventListener('click', () => modalFunc.classList.add('show'));
            
            document.querySelectorAll('.editar-equipe').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const funcionario = dados.equipe.find(f => f.id == id);
                    if (funcionario) {
                        showEditarFuncionarioModal(funcionario);
                    }
                });
            });
            
            document.querySelectorAll('.demitir-equipe').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const funcionario = dados.equipe.find(f => f.id == id);
                    
                    showConfirmModal(
                        'desligar funcionario',
                        `deseja realmente remover ${funcionario.nome} da equipe?`,
                        () => {
                            dados.equipe = dados.equipe.filter(f => f.id != id);
                            renderTab('tab6');
                            showNotification('funcionario removido', 'sucesso');
                        }
                    );
                });
            });
            
            const filtroTurno = document.getElementById('filtroTurno');
            const filtroStatus = document.getElementById('filtroStatusEquipe');
            
            if (filtroTurno && filtroStatus) {
                [filtroTurno, filtroStatus].forEach(f => {
                    f.addEventListener('change', () => {
                        const turno = filtroTurno.value;
                        const status = filtroStatus.value;
                        
                        const linhas = dados.equipe
                            .filter(f => (turno === 'todos' || f.turno === turno) && (status === 'todos' || f.status === status))
                            .map((f) => {
                                const classeStatus = f.status === 'ativo' ? 'status-ativo' : (f.status === 'ferias' ? 'status-ferias' : 'status-afastado');
                                return `<tr>
                                    <td>${f.nome}</td><td>${f.cargo}</td><td>${f.turno}</td>
                                    <td><span class="status-badge ${classeStatus}">${f.status}</span></td>
                                    <td>R$ ${f.salario}</td>
                                    <td>${f.admissao}</td>
                                    <td>
                                        <button class="btn-icon editar-equipe" data-id="${f.id}">editar</button>
                                        <button class="btn-icon demitir-equipe" data-id="${f.id}">desligar</button>
                                    </td>
                                </tr>`;
                            }).join('');
                        document.getElementById('tabela-equipe').innerHTML = linhas;
                        showNotification('filtros aplicados', 'sucesso');
                    });
                });
            }
        }
    }

    // ---------- trocar abas ----------
    navItems.forEach(item => {
        item.addEventListener('click', () => renderTab(item.getAttribute('data-tab')));
    });

    // ---------- avatar / dropdown ----------
    userTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', (e) => {
        if (!userTrigger.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
    
    document.getElementById('btnPerfil').addEventListener('click', () => {
        userDropdown.classList.remove('show');
        modalPerfil.classList.add('show');
    });
    
    document.getElementById('btnConfig').addEventListener('click', () => {
        userDropdown.classList.remove('show');
        showNotification('configuracoes em desenvolvimento', 'info');
    });
    
    // botao site principal
    document.getElementById('btnSite').addEventListener('click', () => {
        // volta para o site principal (index.html na raiz)
        window.location.href = '../index.html';
    });
    
    // botao sair - volta para o login
    document.getElementById('btnLogout').addEventListener('click', () => {
        // volta para a tela de login
        window.location.href = 'login.html';
    });

    // ---------- modais (fechar) ----------
    document.querySelectorAll('.modal-close, .btn-secondary[data-modal]').forEach(el => {
        el.addEventListener('click', (e) => {
            const modalId = el.getAttribute('data-modal');
            document.getElementById(modalId).classList.remove('show');
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('show');
        }
    });

    // ---------- form prato ----------
    document.getElementById('formPrato').addEventListener('submit', (e) => {
        e.preventDefault();
        const foto = document.getElementById('pratoFoto').value || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100';
        const nome = document.getElementById('pratoNome').value;
        const desc = document.getElementById('pratoDesc').value;
        const categoria = document.getElementById('pratoCategoria').value;
        const preco = parseFloat(document.getElementById('pratoPreco').value);
        
        if (!nome || !desc || isNaN(preco)) {
            showNotification('preencha todos os campos obrigatorios', 'erro');
            return;
        }
        
        dados.cardapio.push({ foto, nome, descricao: desc, categoria, preco });
        renderTab('tab4');
        modalPrato.classList.remove('show');
        e.target.reset();
        showNotification('prato adicionado com sucesso', 'sucesso');
    });

    // ---------- form funcionario ----------
    document.getElementById('formFuncionario').addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('funcNome').value;
        const cargo = document.getElementById('funcCargo').value;
        const turno = document.getElementById('funcTurno').value;
        const status = document.getElementById('funcStatus').value;
        
        if (!nome || !cargo) {
            showNotification('preencha nome e cargo', 'erro');
            return;
        }
        
        const novoId = Math.max(...dados.equipe.map(f => f.id), 0) + 1;
        
        dados.equipe.push({ 
            id: novoId,
            nome, 
            cargo, 
            turno, 
            status, 
            salario: 3000, 
            admissao: new Date().toLocaleDateString('pt-BR'),
            telefone: '',
            email: ''
        });
        
        renderTab('tab6');
        modalFunc.classList.remove('show');
        e.target.reset();
        showNotification('funcionario contratado com sucesso', 'sucesso');
    });

    // ---------- form reserva ----------
    document.getElementById('formReserva')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const cliente = document.getElementById('reservaCliente').value;
        const mesa = document.getElementById('reservaMesa').value;
        const data = document.getElementById('reservaData').value;
        const pessoas = document.getElementById('reservaPessoas').value;
        const obs = document.getElementById('reservaObs').value;
        
        if (!cliente || !mesa || !data || !pessoas) {
            showNotification('preencha todos os campos obrigatorios', 'erro');
            return;
        }

        const disponiveis = getMesasDisponiveis(data, pessoas);
        if (!disponiveis.some(m => m.numero == mesa)) {
            showNotification('esta mesa nao esta mais disponivel', 'erro');
            return;
        }

        const novaReserva = {
            id: Date.now(),
            cliente,
            mesa: parseInt(mesa),
            data,
            pessoas: parseInt(pessoas),
            status: 'confirmada',
            obs
        };

        dados.reservas.push(novaReserva);
        renderTab('tab3');
        modalReserva.classList.remove('show');
        e.target.reset();
        showNotification('reserva criada com sucesso', 'sucesso');
    });

    // ---------- form mov estoque ----------
    document.getElementById('formMovEstoque')?.addEventListener('submit', (e) => {
        e.preventDefault();
        modalEstoqueMov.classList.remove('show');
        e.target.reset();
        showNotification('movimentacao registrada', 'sucesso');
    });

    // ---------- inicio ----------
    renderTab('tab1');
});