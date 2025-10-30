
+( function() {
  const university = "UOC";
  console.log(`Hello, ${university}!`);
} )();


document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener referencias a los elementos clave por sus clases BEM
    const toggleButton = document.querySelector('.main-nav__toggle');
    const navList = document.querySelector('.main-nav__list');
    
    // El Modificador BEM que gestiona el estado abierto/cerrado
    const OPEN_MODIFIER = 'main-nav__list--is-open';

    if (toggleButton && navList) {
        // 2. Añadir el escuchador de eventos al botón de toggle
        toggleButton.addEventListener('click', () => {
            
            // 3. Lógica principal: Alternar la clase modificadora en la lista
            navList.classList.toggle(OPEN_MODIFIER);

            // Opcional pero recomendado: Gestión de Accesibilidad (ARIA)
            const isExpanded = navList.classList.contains(OPEN_MODIFIER);
            toggleButton.setAttribute('aria-expanded', isExpanded);
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener todos los elementos necesarios
    const galleryImages = document.querySelectorAll('.gallery__image');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.lightbox__close-btn');

    // 2. Función para abrir el modal
    const openLightbox = (imageSrc) => {
        lightboxImage.src = imageSrc;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
    };

    // 3. Función para cerrar el modal
    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = ''; // Restaura el scroll del fondo
    };

    // 4. Asignar el evento de clic a cada imagen de la galería
    galleryImages.forEach(image => {
        image.addEventListener('click', () => {
            // Obtenemos la URL de la imagen grande del atributo data-full-url
            const fullUrl = image.getAttribute('src'); // Asumimos que la misma URL sirve para la imagen grande
            if (fullUrl) {
                openLightbox(fullUrl);
            }
        });
    });

    // 5. Asignar eventos para cerrar el modal
    
    // Al hacer clic en el botón de cerrar
    closeBtn.addEventListener('click', closeLightbox);

    // Al hacer clic fuera de la imagen (en el fondo oscuro)
    lightbox.addEventListener('click', (e) => {
        // Solo cerramos si el clic fue directamente en el fondo del lightbox
        if (e.target.classList.contains('lightbox')) {
            closeLightbox();
        }
    });

    // Al presionar la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });
});
//--------------------------//
//Code for Slider section
//-------------------------//
class UOCSlider {
    constructor(sliderElement) {
        this.slider = sliderElement;
        this.sliderTrack = sliderElement.querySelector('.slider__track');
        this.slides = sliderElement.querySelectorAll('.slider__slide');
        this.prevBtn = sliderElement.querySelector('.slider__btn--prev');
        this.nextBtn = sliderElement.querySelector('.slider__btn--next');
        this.dotsContainer = sliderElement.querySelector('.slider__dots');

        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoAdvanceTime = 7000;
        this.autoAdvanceInterval = null;

        // Inicializar el slider
        this.createDots();
        this.addEventListeners();
        this.startAutoAdvance();
        
        // Ejecutar el primer movimiento para centrar el slide activo si es necesario
        // this.moveToSlide(0); 
    }

    // A. Mueve el carrusel al índice especificado.
    moveToSlide(index) {
        if (index < 0) {
            index = this.totalSlides - 1; 
        } else if (index >= this.totalSlides) {
            index = 0; 
        }
        this.currentIndex = index;

        // Calcula el desplazamiento ACUMULATIVO (esto es por el ancho variable de las imagenes)
        let offset = 0;
        for (let i = 0; i < this.currentIndex; i++) {
            offset += this.slides[i].offsetWidth; 
        }
        
        this.sliderTrack.style.transform = `translateX(-${offset}px)`;
        this.updateDots();
    }
    
    // B. Funciones de control
    nextSlide = () => {
        this.moveToSlide(this.currentIndex + 1);
    }
    
    prevSlide = () => {
        this.moveToSlide(this.currentIndex - 1);
    }

    // C. Autoplay
    startAutoAdvance() {
        if (this.totalSlides <= 1) return;
        clearInterval(this.autoAdvanceInterval);
        this.autoAdvanceInterval = setInterval(this.nextSlide, this.autoAdvanceTime);
    }

    stopAutoAdvance() {
        clearInterval(this.autoAdvanceInterval);
    }

    // D. Puntos de Navegación
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('slider__dot');
            dot.classList.toggle('slider__dot--active', index === this.currentIndex);
            dot.addEventListener('click', () => {
                this.stopAutoAdvance();
                this.moveToSlide(index);
                this.startAutoAdvance();
            });
            this.dotsContainer.appendChild(dot);
        });
    }

    updateDots() {
        this.dotsContainer.querySelectorAll('.slider__dot').forEach((dot, index) => {
            dot.classList.toggle('slider__dot--active', index === this.currentIndex);
        });
    }

    // E. Event Listeners
    addEventListeners() {
        this.prevBtn.addEventListener('click', () => {
            this.stopAutoAdvance();
            this.prevSlide();
            this.startAutoAdvance();
        });

        this.nextBtn.addEventListener('click', () => {
            this.stopAutoAdvance();
            this.nextSlide();
            this.startAutoAdvance();
        });

        this.slider.addEventListener('mouseenter', this.stopAutoAdvance);
        this.slider.addEventListener('mouseleave', this.startAutoAdvance);
    }
}

// -----------------------------------------------------------------
// FUNCIÓN DE INICIALIZACIÓN GLOBAL
// -----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // 1. Encontrar *TODOS* los contenedores del slider
    const allSliders = document.querySelectorAll('.slider');

    // 2. Inicializar una nueva instancia de UOCSlider para cada uno
    allSliders.forEach(sliderElement => {
        new UOCSlider(sliderElement);
    });

    initCollapsibleContent();
});

// -----------------------------------------------------------------
// FUNCIÓN TOGGLE CONTAINER
// -----------------------------------------------------------------
const initCollapsibleContent = () => {
    // 1. Encuentra todos los botones de toggle
    const toggleButtons = document.querySelectorAll('.kioto-toggle-btn');
    //console.log( 'NUM toggle buttons found.' + toggleButtons.length);
    toggleButtons.forEach(button => {
        // Obtenemos el contenedor de contenido relacionado (el div que se colapsa)
        const contentId = button.getAttribute('aria-controls');
        const contentElement = document.getElementById(contentId);
        console.log(contentElement);
        if (contentElement) {
            button.addEventListener('click', () => {
                // console.log('Toggling content for button:', button);
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !isExpanded);

                // Alternar la clase CSS para la animación
                contentElement.classList.toggle('kioto-content--collapsed');
                console.log('Content element classes:', contentElement.className);
            });
        }
    });
};
