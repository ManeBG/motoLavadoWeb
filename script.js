// Validar y mostrar el modal al enviar el formulario
document.getElementById('reservationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtener los datos del formulario
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;

    // Verificar si todos los campos están llenos
    if (name.trim() === "" || phone.trim() === "" || service === "" || appointmentDate === "" || appointmentTime === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Generar el mensaje para WhatsApp
    const message = `Hola, soy ${name}. Quisiera reservar el servicio de ${service}. Mi número de teléfono es ${phone}. Llegaré el ${appointmentDate} a las ${appointmentTime}. Si llego puntual, ¿obtendré mi descuento? 😉`;
    const whatsappUrl = `https://wa.me/5217421064808?text=${encodeURIComponent(message)}`;

    // Redirigir al usuario a WhatsApp
    window.open(whatsappUrl, '_blank');

    // Mostrar confirmación y limpiar el formulario
    alert('¡Reserva enviada! Te contactaremos pronto.');
    this.reset();
});



// Inicializar el carrusel
if (document.querySelector('#carouselExample')) {
    const myCarousel = new bootstrap.Carousel('#carouselExample', {
        interval: 5000, // Cambia cada 5 segundos
        pause: 'hover'  // Pausa al pasar el mouse
    });
}

// Inicializar Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'TU-ID-DE-GA');
