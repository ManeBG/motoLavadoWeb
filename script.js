/* ====================================================
   MOTOLAVADO FRAGA — script.js
   ==================================================== */

/* ── 1. Bloquear fechas pasadas ────────────────────── */
(function setMinDate() {
    const dateInput = document.getElementById('appointmentDate');
    if (!dateInput) return;
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
})();


/* ── 2. Galería Lightbox ───────────────────────────── */
(function initGallery() {
    // Recopilar todas las imágenes del grid de galería
    const thumbs = document.querySelectorAll('.gallery-thumb');
    const carouselInner = document.getElementById('galleryCarouselInner');
    const galleryModalEl = document.getElementById('galleryModal');

    if (!thumbs.length || !carouselInner || !galleryModalEl) return;

    // Construir los slides del carousel dinámicamente
    const galleryCarouselBS = new bootstrap.Carousel('#galleryCarousel', {
        interval: false,
        wrap: true
    });

    thumbs.forEach(function (thumb, index) {
        const imgEl = thumb.querySelector('img');
        const src = imgEl ? imgEl.src : '';
        const alt = imgEl ? imgEl.alt : ('Foto galería ' + (index + 1));

        const item = document.createElement('div');
        item.className = 'carousel-item' + (index === 0 ? ' active' : '');
        item.innerHTML = `<img src="${src}" class="d-block w-100" alt="${alt}" loading="lazy">`;
        carouselInner.appendChild(item);

        // Click → abrir modal en el slide correspondiente
        thumb.addEventListener('click', function () {
            galleryCarouselBS.to(index);
            const modal = new bootstrap.Modal(galleryModalEl);
            modal.show();
        });
    });
})();


/* ── 3. Botón "Reservar este servicio" ─────────────── */
(function initServiceButtons() {
    const serviceSelect = document.getElementById('service');
    const reservarSection = document.getElementById('reservar');

    document.querySelectorAll('.book-service-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const serviceValue = btn.dataset.service;

            // Preseleccionar en el <select>
            if (serviceSelect) {
                for (let i = 0; i < serviceSelect.options.length; i++) {
                    if (serviceSelect.options[i].value === serviceValue) {
                        serviceSelect.selectedIndex = i;
                        break;
                    }
                }
            }

            // Scroll suave al formulario
            if (reservarSection) {
                reservarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();


/* ── 4. Formulario: validación Bootstrap + WhatsApp ── */
(function initForm() {
    const form = document.getElementById('reservationForm');
    const successAlert = document.getElementById('successAlert');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Activar validación visual Bootstrap
        form.classList.add('was-validated');

        if (!form.checkValidity()) {
            // Scroll al primer campo inválido
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
            return;
        }

        // Leer valores
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('service').value;
        const appointmentDate = document.getElementById('appointmentDate').value;
        const appointmentTime = document.getElementById('appointmentTime').value;

        // Formatear fecha legible
        const [year, month, day] = appointmentDate.split('-');
        const dateFormatted = `${day}/${month}/${year}`;

        // Mensaje WhatsApp prellenado
        const message = [
            `¡Hola! Quisiera reservar una cita:`,
            `👤 Nombre: ${name}`,
            `📞 Teléfono: ${phone}`,
            `🏍️ Servicio: ${service}`,
            `📅 Fecha: ${dateFormatted}`,
            `🕐 Hora: ${appointmentTime}`,
            `\n¿Está disponible ese horario? ¡Gracias! 😊`
        ].join('\n');

        const whatsappUrl = `https://wa.me/5217421064808?text=${encodeURIComponent(message)}`;

        // Mostrar alerta de éxito inline (sin alert nativo)
        if (successAlert) {
            successAlert.classList.remove('d-none');
            successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Abrir WhatsApp en nueva pestaña
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        // Reset del formulario
        form.reset();
        form.classList.remove('was-validated');

        // Ocultar alerta después de 8 segundos
        if (successAlert) {
            setTimeout(function () {
                successAlert.classList.add('d-none');
            }, 8000);
        }
    });
})();


/* ── 5. Inicializar carousel de Testimonios ─────────── */
(function initTestimonialsCarousel() {
    const el = document.querySelector('#carouselTestimonios');
    if (el) {
        new bootstrap.Carousel(el, {
            interval: 5000,
            pause: 'hover'
        });
    }
})();
