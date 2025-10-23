// VALIDAÇÃO E MÁSCARA DO FORMULÁRIO DE RESERVA
document.addEventListener('DOMContentLoaded', function() {
    const reservaForm = document.getElementById('reservaForm');
    
    if (reservaForm) {
        reservaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const data = document.getElementById('data').value;
            
            if (!nome || !data) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validação de data (não pode ser no passado)
            const dataReserva = new Date(data + 'T00:00:00');
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            
            if (dataReserva < hoje) {
                alert('A data da reserva não pode ser no passado. Por favor, selecione uma data futura.');
                return;
            }
            
            // Simulação de envio
            const dataFormatada = new Date(dataReserva).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
            alert(`Obrigado, ${nome}! Sua solicitação de reserva para ${dataFormatada} foi enviada com sucesso. Entraremos em contato em breve para confirmação.`);
            reservaForm.reset();
        });

        // Formatação automática do telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.substring(0, 11);
                
                if (value.length > 10) {
                    value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (value.length > 6) {
                    value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else if (value.length > 2) {
                    value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                } else {
                    value = value.replace(/^(\d*)/, '($1');
                }
                e.target.value = value;
            });
        }
        
        // Data mínima selecionável no input date
        const dataInput = document.getElementById('data');
        if (dataInput) {
            const hoje = new Date().toISOString().split('T')[0];
            dataInput.setAttribute('min', hoje);
        }
    }
});
