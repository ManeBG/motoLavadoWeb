/* ====================================================
   MOTOLAVADO FRAGA — script.js
   ==================================================== */

/* ── 1. Fecha mínima = HOY (hora local, no UTC) ──────── */
(function setMinDate() {
    const dateInput = document.getElementById('appointmentDate');
    if (!dateInput) return;

    // Usar fecha LOCAL para evitar desfase UTC-6
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
})();


/* ── 1b. Validación de hora si la cita es HOY ───────── */
function validateTimeIfToday() {
    const dateInput = document.getElementById('appointmentDate');
    const timeInput = document.getElementById('appointmentTime');
    if (!dateInput || !timeInput) return;

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    if (dateInput.value !== todayStr) {
        // No es hoy — limpiar cualquier error previo
        timeInput.setCustomValidity('');
        return;
    }

    if (!timeInput.value) return;  // campo vacío, Bootstrap lo maneja

    // Calcular el mínimo permitido: now + 60 min
    const minTime = new Date(now.getTime() + 60 * 60 * 1000);
    const [hh, mi] = timeInput.value.split(':').map(Number);
    const chosen = new Date();
    chosen.setHours(hh, mi, 0, 0);

    if (chosen < minTime) {
        const minH = String(minTime.getHours()).padStart(2, '0');
        const minM = String(minTime.getMinutes()).padStart(2, '0');
        timeInput.setCustomValidity(
            `Para citas de hoy, elige a partir de ${minH}:${minM} (mín. 60 min de anticipación).`
        );
    } else {
        timeInput.setCustomValidity('');
    }
}

// Disparar en vivo cuando cambian fecha u hora
(function initTimeValidation() {
    const dateInput = document.getElementById('appointmentDate');
    const timeInput = document.getElementById('appointmentTime');
    if (!dateInput || !timeInput) return;
    dateInput.addEventListener('change', validateTimeIfToday);
    timeInput.addEventListener('change', validateTimeIfToday);
    timeInput.addEventListener('input', validateTimeIfToday);
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

        // Ejecutar validación de hora antes de checkValidity
        validateTimeIfToday();

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
