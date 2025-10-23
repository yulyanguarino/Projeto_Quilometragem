
// Global variables
let registros = [];
let editandoId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    carregarRegistros();
    setupEventListeners();
});

function setupEventListeners() {
    // Novo registro
    document.getElementById('novoRegistroBtn').addEventListener('click', () => {
        editandoId = null;
        document.getElementById('modalTitle').textContent = 'Novo Registro';
        document.getElementById('formRegistro').reset();
        document.getElementById('registroId').value = '';
        document.getElementById('modalRegistro').style.display = 'block';
    });

    // Export buttons
    document.getElementById('exportarCSV').addEventListener('click', () => exportar('csv'));
    document.getElementById('exportarExcel').addEventListener('click', () => exportar('excel'));
    document.getElementById('exportarPDF').addEventListener('click', () => exportar('pdf'));

    // QR Code
    document.getElementById('qrCodeBtn').addEventListener('click', mostrarQRCode);

    // Filters
    document.getElementById('aplicarFiltros').addEventListener('click', aplicarFiltros);
    document.getElementById('limparFiltros').addEventListener('click', limparFiltros);

    // Form submit
    document.getElementById('formRegistro').addEventListener('submit', salvarRegistro);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    document.getElementById('cancelarBtn').addEventListener('click', () => {
        document.getElementById('modalRegistro').style.display = 'none';
    });

    // Close modal on outside click
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

async function carregarRegistros(filtros = {}) {
    try {
        const params = new URLSearchParams(filtros);
        const response = await fetch(`/api/registros?${params}`);
        registros = await response.json();
        renderizarTabela();
    } catch (error) {
        mostrarAlerta('Erro ao carregar registros: ' + error.message, 'error');
    }
}

function renderizarTabela() {
    const tbody = document.getElementById('registrosBody');
    tbody.innerHTML = '';

    if (registros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Nenhum registro encontrado</td></tr>';
        return;
    }

    registros.forEach(reg => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span style="background: #0084ff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${reg.condutor}</span></td>
            <td><span style="background: #0084ff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${reg.placa_veiculo}</span></td>
            <td><span style="background: #0084ff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${formatarDataHora(reg.data_saida)}</span></td>
            <td><span style="background: #0084ff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${formatarDataHora(reg.data_chegada)}</span></td>
            <td><span style="background: #0084ff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${reg.distancia_percorrida} km</span></td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-success" onclick="editarRegistro(${reg.id})" title="Editar">✏️</button>
                <button class="btn btn-sm btn-success" onclick="verHistorico(${reg.id})" title="Histórico">📋</button>
                <button class="btn btn-sm btn-danger" onclick="deletarRegistro(${reg.id})" title="Deletar">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function formatarDataHora(dataStr) {
    const data = new Date(dataStr);
    return data.toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

async function salvarRegistro(e) {
    e.preventDefault();
    
    const dados = {
        condutor: document.getElementById('condutor').value,
        placa_veiculo: document.getElementById('placaVeiculo').value.toUpperCase(),
        data_saida: document.getElementById('dataSaida').value,
        data_chegada: document.getElementById('dataChegada').value,
        km_inicial: parseFloat(document.getElementById('kmInicial').value),
        km_final: parseFloat(document.getElementById('kmFinal').value),
        observacoes: document.getElementById('observacoes').value
    };

    try {
        const id = document.getElementById('registroId').value;
        const url = id ? `/api/registros/${id}` : '/api/registros';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const result = await response.json();

        if (response.ok) {
            mostrarAlerta(`Registro ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success');
            document.getElementById('modalRegistro').style.display = 'none';
            carregarRegistros();
        } else {
            mostrarAlerta('Erro: ' + result.error, 'error');
        }
    } catch (error) {
        mostrarAlerta('Erro ao salvar registro: ' + error.message, 'error');
    }
}

async function editarRegistro(id) {
    try {
        const response = await fetch(`/api/registros/${id}`);
        const registro = await response.json();

        document.getElementById('modalTitle').textContent = 'Editar Registro';
        document.getElementById('registroId').value = registro.id;
        document.getElementById('condutor').value = registro.condutor;
        document.getElementById('placaVeiculo').value = registro.placa_veiculo;
        document.getElementById('dataSaida').value = registro.data_saida;
        document.getElementById('dataChegada').value = registro.data_chegada;
        document.getElementById('kmInicial').value = registro.km_inicial;
        document.getElementById('kmFinal').value = registro.km_final;
        document.getElementById('observacoes').value = registro.observacoes || '';

        document.getElementById('modalRegistro').style.display = 'block';
    } catch (error) {
        mostrarAlerta('Erro ao carregar registro: ' + error.message, 'error');
    }
}

async function deletarRegistro(id) {
    if (!confirm('Tem certeza que deseja deletar este registro?')) return;

    try {
        const response = await fetch(`/api/registros/${id}`, { method: 'DELETE' });
        const result = await response.json();

        if (response.ok) {
            mostrarAlerta('Registro deletado com sucesso!', 'success');
            carregarRegistros();
        } else {
            mostrarAlerta('Erro ao deletar: ' + result.error, 'error');
        }
    } catch (error) {
        mostrarAlerta('Erro ao deletar registro: ' + error.message, 'error');
    }
}

async function verHistorico(id) {
    try {
        const response = await fetch(`/api/registros/${id}/historico`);
        const historico = await response.json();

        if (historico.length === 0) {
            alert('Nenhuma alteração registrada para este item.');
            return;
        }

        let mensagem = 'Histórico de Alterações:\n\n';
        historico.forEach(h => {
            mensagem += `${formatarDataHora(h.data_alteracao)} - ${h.campo_alterado}\n`;
            mensagem += `De: ${h.valor_anterior} → Para: ${h.valor_novo}\n`;
            mensagem += `Usuário: ${h.usuario_alteracao}\n\n`;
        });

        alert(mensagem);
    } catch (error) {
        mostrarAlerta('Erro ao carregar histórico: ' + error.message, 'error');
    }
}

function aplicarFiltros() {
    const filtros = {
        condutor: document.getElementById('filtroCondutor').value,
        placa: document.getElementById('filtroPlaca').value,
        data_inicio: document.getElementById('filtroDataInicio').value,
        data_fim: document.getElementById('filtroDataFim').value
    };

    carregarRegistros(filtros);
}

function limparFiltros() {
    document.getElementById('filtroCondutor').value = '';
    document.getElementById('filtroPlaca').value = '';
    document.getElementById('filtroDataInicio').value = '';
    document.getElementById('filtroDataFim').value = '';
    carregarRegistros();
}

function exportar(formato) {
    window.open(`/api/exportar/${formato}`, '_blank');
}

function mostrarQRCode() {
    const url = window.location.origin;
    document.getElementById('qrImage').src = `/api/qrcode?url=${encodeURIComponent(url)}`;
    document.getElementById('modalQR').style.display = 'block';
}

function mostrarAlerta(mensagem, tipo) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo}`;
    alertDiv.textContent = mensagem;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
