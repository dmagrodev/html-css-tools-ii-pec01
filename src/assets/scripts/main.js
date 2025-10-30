/**
 * Import dependencies from node_modules
 * see commented examples below
 */

// import 'some-node-module';
// import SomeModule from 'some-node-module';

// -----------------------------------------------------------------//
// UOC TEST FUNCTION
// -----------------------------------------------------------------//
+( function() {
    const university = "UOC";
    console.log(`Hello, ${university}!`);
} )();


// -----------------------------------------------------------------//
// CLASE: UOCSlider
// -----------------------------------------------------------------//
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
        this.moveToSlide(0);
    }

    
    // Mover slider a una posicion
    // calculo del desplazamiento es acumulativo, se toma en cuenta el tamaño de la imagen
    moveToSlide(index) {
        if (index < 0) {
            index = this.totalSlides - 1; 
        } else if (index >= this.totalSlides) {
            index = 0; 
        }
        this.currentIndex = index;

        
        let offset = 0; 
        for (let i = 0; i < this.currentIndex; i++) 
        {
            offset += this.slides[i].offsetWidth; 
        }
        
        this.sliderTrack.style.transform = `translateX(-${offset}px)`;
        this.updateDots();
    }
    
    nextSlide = () => {
        this.moveToSlide(this.currentIndex + 1);
    }
    
    prevSlide = () => {
        this.moveToSlide(this.currentIndex - 1);
    }

    startAutoAdvance() {
        if (this.totalSlides <= 1) return;
        clearInterval(this.autoAdvanceInterval);
        this.autoAdvanceInterval = setInterval(this.nextSlide, this.autoAdvanceTime);
    }

    stopAutoAdvance() {
        clearInterval(this.autoAdvanceInterval);
    }

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

    addEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.stopAutoAdvance();
                this.prevSlide();
                this.startAutoAdvance();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.stopAutoAdvance();
                this.nextSlide();
                this.startAutoAdvance();
            });
        }
        
        this.slider.addEventListener('mouseenter', this.stopAutoAdvance);
        this.slider.addEventListener('mouseleave', this.startAutoAdvance);
    }
}


// -----------------------------------------------------------------//
// TOGGLE MENÚ for mobile
// -----------------------------------------------------------------//
const initMobileMenuToggle = () => {
    const toggleButton = document.querySelector('.main-nav__toggle');
    const navList = document.querySelector('.main-nav__list');
    const toggleIcon = toggleButton ? toggleButton.querySelector('.fas') : null; 
    const OPEN_MOD = 'main-nav__list--is-open';

    if (toggleButton && navList && toggleIcon) {
        toggleButton.addEventListener('click', () => {

            navList.classList.toggle(OPEN_MOD);
            
            const isExpanded = navList.classList.contains(OPEN_MOD);
            toggleButton.setAttribute('aria-expanded', isExpanded); 
            
            if (isExpanded) {
                toggleIcon.classList.remove('fa-bars');// HAMBURGUESA
                toggleIcon.classList.add('fa-times'); // X
            } else {
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars'); 
            }
        });
    }
};


// -----------------------------------------------------------------//
// LIGHTBOX para Galeria
// -----------------------------------------------------------------//
const initLightboxGallery = () => {
    const galleryImages = document.querySelectorAll('.gallery__image');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.lightbox__close-btn');
    
    const openLightbox = (imageSrc) => {
        lightboxImage.src = imageSrc;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = ''; 
    };

    galleryImages.forEach(image => {
        image.addEventListener('click', () => {
            const fullUrl = image.getAttribute('src'); 
            if (fullUrl) {
                openLightbox(fullUrl);
            }
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });
};


// -----------------------------------------------------------------//
// TOGGLE para los containers
// -----------------------------------------------------------------//
const initCollapsibleContent = () => {
    const toggleButtons = document.querySelectorAll('.kioto-toggle-btn');
    
    toggleButtons.forEach(button => {
        const contentId = button.getAttribute('aria-controls');
        const contentElement = document.getElementById(contentId);
        
        if (contentElement) {
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !isExpanded);
                contentElement.classList.toggle('kioto-content--collapsed');
            });
        }
    });
};


// -----------------------------------------------------------------//
// INICIALIZACIÓN COMPONENTES
// -----------------------------------------------------------------//
const initApp = () => {

    initMobileMenuToggle();
    initLightboxGallery(); 

    const allSliders = document.querySelectorAll('.slider'); //Collect de todos los sliders de la pagina
    allSliders.forEach(sliderElement => {
        new UOCSlider(sliderElement);
    });

    initCollapsibleContent();
};


// -----------------------------------------------------------------//
// LISTENER General
// -----------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', initApp);