$(document).ready(function() {

    // Progress bar
    let containerA = document.getElementById('circleA');

    let circleA = new ProgressBar.Circle(containerA, {
        color: '#64daf9',
        strokeWidth: 8,
        duration: 1400,
        from: { color: '#AAA' },
        to: { color: '#64daf9' },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            let value = Math.round(circle.value() * 60);
            circle.setText(value);
        }
    });

    let containerB = document.getElementById('circleB');

    let circleB = new ProgressBar.Circle(containerB, {
        color: '#64daf9',
        strokeWidth: 8,
        duration: 1600,
        from: { color: '#AAA' },
        to: { color: '#64daf9' },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            let value = Math.round(circle.value() * 254);
            circle.setText(value);
        }
    });

    let containerC = document.getElementById('circleC');

    let circleC = new ProgressBar.Circle(containerC, {
        color: '#64daf9',
        strokeWidth: 8,
        duration: 2000,
        from: { color: '#AAA' },
        to: { color: '#64daf9' },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            let value = Math.round(circle.value() * 32);
            circle.setText(value);
        }
    });

    let containerD = document.getElementById('circleD');

    let circleD = new ProgressBar.Circle(containerD, {
        color: '#64daf9',
        strokeWidth: 8,
        duration: 2200,
        from: { color: '#AAA' },
        to: { color: '#64daf9' },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            let value = Math.round(circle.value() * 60);
            circle.setText(value);
        }
    });

    // Iniciando o loader quando o usuário chega no elemento

    let dataAreaOffset = $('#data-area').offset();
    let stop = 0;

    $(window).scroll(function() {
        let scroll = $(window).scrollTop();

        if (scroll > (dataAreaOffset.top - 500) && stop === 0) {
            circleA.animate(1.0);
            circleB.animate(1.0);
            circleC.animate(1.0);
            circleD.animate(1.0);

            stop = 1;
        }
    });

    // Parallax
    setTimeout(function() {
        $('#data-area').parallax({ imageSrc: 'img/cidadeparallax.png' });
        $('#apply-area').parallax({ imageSrc: 'img/pattern.png' });
    }, 250);

    // Filtro do Portfolio

    $('.filter-btn').on('click', function() {
        let type = $(this).attr('id');
        let boxes = $('.project-box');

        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        if (type === 'dsg-btn') {
            eachBoxes('dsg', boxes);
        } else if (type === 'dev-btn') {
            eachBoxes('dev', boxes);
        } else if (type === 'seo-btn') {
            eachBoxes('seo', boxes);
        } else {
            eachBoxes('all', boxes);
        }
    });

    function eachBoxes(type, boxes) {
        if (type === 'all') {
            $(boxes).fadeIn();
        } else {
            $(boxes).each(function() {
                if (!$(this).hasClass(type)) {
                    $(this).fadeOut('slow');
                } else {
                    $(this).fadeIn();
                }
            });
        }
    }

    // Cadastro de clientes

    const clientForm = document.getElementById('client-form');
    const feedback = document.getElementById('client-feedback');
    const clientList = document.getElementById('client-list');

    function setFeedback(message, type = 'success') {
        feedback.textContent = message;
        feedback.classList.remove('success', 'error');
        feedback.classList.add(type);
    }

    function clientItemTemplate(client) {
        const budget = client.budget ? `R$ ${Number(client.budget).toLocaleString('pt-BR')}` : 'A combinar';
        return `
            <li class="list-group-item">
                <div class="client-line">
                    <strong>${client.name}</strong>
                    <span class="client-company">${client.company}</span>
                </div>
                <small>${client.email} · ${client.service} · ${budget}</small>
            </li>
        `;
    }

    async function loadClients() {
        try {
            const response = await fetch('/api/clients?limit=6');
            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.error || 'Falha ao carregar os clientes.');
            }

            const clients = payload.data || [];
            if (!clients.length) {
                clientList.innerHTML = '<li class="list-group-item text-muted">Nenhum cliente cadastrado ainda.</li>';
                return;
            }

            clientList.innerHTML = clients.map(clientItemTemplate).join('');
        } catch (error) {
            clientList.innerHTML = `<li class="list-group-item text-danger">${error.message}</li>`;
        }
    }

    if (clientForm) {
        loadClients();

        clientForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            setFeedback('Enviando cadastro...', 'success');

            const formData = new FormData(clientForm);
            const payload = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/clients', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Não foi possível cadastrar o cliente.');
                }

                setFeedback(result.message, 'success');
                clientForm.reset();
                loadClients();
            } catch (error) {
                setFeedback(error.message, 'error');
            }
        });
    }

});
