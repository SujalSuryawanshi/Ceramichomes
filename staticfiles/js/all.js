// all.js - Complete JavaScript file with proper error handling

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize all components
    initializeMobileMenu();
    initializeDesktopDropdowns();
    initializeHeroCarousel();
    initializeCategoryCarousel();
    initializeContactForm();
    initializeScrollEffects();
    initializeObserver();
    initializeClientsCarousel();
    initializeCart();
    initializeUserDropdown();
});

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    if (mobileMenuBtn && mobileMenu && menuIcon && closeIcon) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }
}

// Desktop dropdown functionality
function initializeDesktopDropdowns() {
    const dropdownButtons = document.querySelectorAll('.nav-dropdown');
    let activeDropdown = null;

    dropdownButtons.forEach(button => {
        const dropdownName = button.getAttribute('data-dropdown');
        const dropdown = document.getElementById(dropdownName + '-dropdown');

        if (dropdown) {
            button.addEventListener('mouseenter', function() {
                // Close any open dropdown
                if (activeDropdown && activeDropdown !== dropdown) {
                    activeDropdown.classList.remove('show');
                }
                dropdown.classList.add('show');
                activeDropdown = dropdown;
            });

            button.addEventListener('mouseleave', function() {
                setTimeout(() => {
                    if (!dropdown.matches(':hover') && !button.matches(':hover')) {
                        dropdown.classList.remove('show');
                        activeDropdown = null;
                    }
                }, 100);
            });

            dropdown.addEventListener('mouseenter', function() {
                dropdown.classList.add('show');
            });

            dropdown.addEventListener('mouseleave', function() {
                dropdown.classList.remove('show');
                activeDropdown = null;
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (activeDropdown && !e.target.closest('.relative')) {
            activeDropdown.classList.remove('show');
            activeDropdown = null;
        }
    });
}

// Hero carousel functionality
function initializeHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    
    if (slides.length === 0 || indicators.length === 0) return;

    let currentHeroSlide = 0;
    const heroSlides = slides.length;

    function updateHeroSlide() {
        slides.forEach((slide, index) => {
            if (index === currentHeroSlide) {
                slide.style.opacity = '1';
            } else {
                slide.style.opacity = '0';
            }
        });

        indicators.forEach((indicator, index) => {
            if (index === currentHeroSlide) {
                indicator.classList.remove('bg-opacity-50');
                indicator.classList.add('active');
            } else {
                indicator.classList.add('bg-opacity-50');
                indicator.classList.remove('active');
            }
        });
    }

    function nextHeroSlide() {
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides;
        updateHeroSlide();
    }

    // Auto-advance hero carousel
    setInterval(nextHeroSlide, 5000);

    // Hero carousel indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentHeroSlide = index;
            updateHeroSlide();
        });
    });

    // Initialize
    updateHeroSlide();
}

// Category carousel functionality
function initializeCategoryCarousel() {
    const carousel = document.getElementById('category-carousel');
    const nextBtn = document.getElementById('category-next');
    const prevBtn = document.getElementById('category-prev');

    if (!carousel) return;

    let currentCategorySlide = 0;
    const categorySlides = 7; // Adjust based on your actual number
    const maxCategorySlide = Math.max(0, categorySlides - 5);

    function updateCategoryCarousel() {
        const translateX = currentCategorySlide * 20;
        carousel.style.transform = `translateX(-${translateX}%)`;
    }

    function nextCategorySlide() {
        if (currentCategorySlide < maxCategorySlide) {
            currentCategorySlide++;
            updateCategoryCarousel();
        }
    }

    function prevCategorySlide() {
        if (currentCategorySlide > 0) {
            currentCategorySlide--;
            updateCategoryCarousel();
        }
    }

    // Auto-advance category carousel
    setInterval(function() {
        currentCategorySlide = (currentCategorySlide + 1) % (maxCategorySlide + 1);
        updateCategoryCarousel();
    }, 3000);

    // Category carousel controls
    if (nextBtn) nextBtn.addEventListener('click', nextCategorySlide);
    if (prevBtn) prevBtn.addEventListener('click', prevCategorySlide);

    // Initialize
    updateCategoryCarousel();
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show success message (in a real application, you would send this to a server)
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Scroll effects
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect for navbar
    const navbar = document.querySelector('nav');
    if (navbar) {
        let lastScrollTop = 0;

        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Intersection Observer for animations
function initializeObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Prestigious Clients Carousel - Continuous Loop
function initializeClientsCarousel() {
    const carousel = document.querySelector('.clients-carousel');
    
    if (carousel) {
        let offset = 0;
        const speed = 1; // px per frame
        const resetAt = carousel.scrollWidth / 2;

        function animateClientsCarousel() {
            offset += speed;
            if (offset >= resetAt) {
                offset = 0;
            }
            carousel.style.transform = `translateX(-${offset}px)`;
            requestAnimationFrame(animateClientsCarousel);
        }

        animateClientsCarousel();
    }
}

// User dropdown functionality
function initializeUserDropdown() {
    const userBtn = document.getElementById('userDropdownButton');
    const dropdown = document.getElementById('userDropdownMenu');

    if (userBtn && dropdown) {
        userBtn.addEventListener('click', () => {
            dropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', (e) => {
            if (!userBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    }
}

// ===== CART FUNCTIONALITY =====

// Cart variables
let cartOpen = false;

function initializeCart() {
    // Initialize cart count on page load
    loadInitialCartData();

    // Close cart with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartOpen) {
            closeCart();
        }
    });
}

function toggleCart() {
    if (cartOpen) {
        closeCart();
    } else {
        openCart();
    }
}

function openCart() {
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBackdrop = document.getElementById('cart-backdrop');
    
    if (cartOverlay && cartBackdrop) {
        cartOpen = true;
        cartOverlay.classList.add('open');
        cartBackdrop.classList.add('open');
        loadCartItems();
    }
}

function closeCart() {
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBackdrop = document.getElementById('cart-backdrop');
    
    if (cartOverlay && cartBackdrop) {
        cartOpen = false;
        cartOverlay.classList.remove('open');
        cartBackdrop.classList.remove('open');
    }
}

// Quantity controls
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput && parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
}

// Add to cart functionality
function addToCart() {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;

    const quantity = quantityInput.value;
    const tileId = getTileIdFromPage(); // This function needs to be implemented based on your page structure
    
    if (!tileId) {
        showMessage('Error: Tile ID not found', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('quantity', quantity);
    
    // Get CSRF token
    const csrfToken = getCsrfToken();
    if (csrfToken) {
        formData.append('csrfmiddlewaretoken', csrfToken);
    }

    fetch(`/cart/add/${tileId}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateCartCount(data.cart_count);
            showMessage(data.message, 'success');
        } else {
            showMessage('Error adding item to cart', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Error adding item to cart', 'error');
    });
}

// Load cart items
function loadCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    fetch('/cart/data/')
    .then(response => response.json())
    .then(data => {
        container.innerHTML = '';

        if (data.cart_items.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center">Your cart is empty</p>';
        } else {
            data.cart_items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'border border-gray-200 p-3 mb-3';
                itemDiv.innerHTML = `
                    <div class="flex items-start space-x-3">
                        ${item.tile_image ? `<img src="${item.tile_image}" alt="${item.tile_name}" class="w-16 h-16 object-cover">` : '<div class="w-16 h-16 bg-gray-200 flex items-center justify-center"><i data-lucide="image" class="w-6 h-6 text-gray-400"></i></div>'}
                        <div class="flex-1">
                            <h4 class="font-medium text-sm">${item.tile_name}</h4>
                            <p class="text-gray-600 text-xs">₹${item.price_per_sqft.toFixed(2)} per sq ft</p>
                            <div class="flex items-center space-x-2 mt-2">
                                <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})" class="w-6 h-6 border border-gray-300 flex items-center justify-center text-xs">-</button>
                                <span class="text-sm">${item.quantity}</span>
                                <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})" class="w-6 h-6 border border-gray-300 flex items-center justify-center text-xs">+</button>
                                <button onclick="removeFromCart(${item.id})" class="ml-2 text-red-500 hover:text-red-700">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-medium text-sm">₹${item.subtotal.toFixed(2)}</p>
                        </div>
                    </div>
                `;
                container.appendChild(itemDiv);
            });
        }

        const cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            cartTotal.textContent = `₹${data.cart_total.toFixed(2)}`;
        }
        
        updateCartCount(data.cart_count);
        
        // Re-initialize icons for new elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    })
    .catch(error => {
        console.error('Error loading cart:', error);
    });
}

// Update cart quantity
function updateCartQuantity(itemId, newQuantity) {
    const formData = new FormData();
    formData.append('quantity', newQuantity);
    
    const csrfToken = getCsrfToken();
    if (csrfToken) {
        formData.append('csrfmiddlewaretoken', csrfToken);
    }

    fetch(`/cart/update/${itemId}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadCartItems();
            showMessage(data.message, 'success');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Remove from cart
function removeFromCart(itemId) {
    const formData = new FormData();
    
    const csrfToken = getCsrfToken();
    if (csrfToken) {
        formData.append('csrfmiddlewaretoken', csrfToken);
    }

    fetch(`/cart/remove/${itemId}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadCartItems();
            showMessage(data.message, 'success');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Update cart count badge
function updateCartCount(count) {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        if (count > 0) {
            cartCount.textContent = count;
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// Show message notification
function showMessage(message, type) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Load initial cart data
function loadInitialCartData() {
    fetch('/cart/data/')
    .then(response => response.json())
    .then(data => {
        updateCartCount(data.cart_count);
    })
    .catch(error => {
        console.error('Error loading initial cart data:', error);
    });
}

// Helper functions
function getCsrfToken() {
    // Try to get CSRF token from cookie
    const csrfCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
    if (csrfCookie) {
        return csrfCookie.split('=')[1];
    }
    
    // Try to get CSRF token from meta tag
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    if (csrfMeta) {
        return csrfMeta.getAttribute('content');
    }
    
    // Try to get CSRF token from hidden input (for forms)
    const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
    if (csrfInput) {
        return csrfInput.value;
    }
    
    return null;
}

function getTileIdFromPage() {
    // This function should extract the tile ID from the current page
    // You can implement this based on your page structure
    // For example, if you have a data attribute on the page:
    const tileElement = document.querySelector('[data-tile-id]');
    if (tileElement) {
        return tileElement.getAttribute('data-tile-id');
    }
    
    // Or extract from URL if the URL contains the tile ID
    const urlParts = window.location.pathname.split('/');
    const tileIndex = urlParts.indexOf('tile');
    if (tileIndex !== -1 && urlParts[tileIndex + 1]) {
        return urlParts[tileIndex + 1];
    }
    
    return null;
}

let slideIndex = 1;
showSlide(slideIndex);

// Auto-play carousel
setInterval(function () {
    slideIndex++;
    if (slideIndex > 3) {
        slideIndex = 1;
    }
    showSlide(slideIndex);
}, 5000);

// Next/previous controls
function changeSlide(n) {
    slideIndex += n;
    if (slideIndex > 3) {
        slideIndex = 1;
    }
    if (slideIndex < 1) {
        slideIndex = 3;
    }
    showSlide(slideIndex);
}

// Thumbnail image controls
function currentSlide(n) {
    slideIndex = n;
    showSlide(slideIndex);
}

function showSlide(n) {
    let slides = document.querySelectorAll('.carousel-slide');
    let dots = document.querySelectorAll('.dot');

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (slides[n - 1]) {
        slides[n - 1].classList.add('active');
    }
    if (dots[n - 1]) {
        dots[n - 1].classList.add('active');
    }
}

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animation for tile boxes
function animateOnScroll() {
    const tileBoxes = document.querySelectorAll('.tile-box');
    const windowHeight = window.innerHeight;

    tileBoxes.forEach(box => {
        const boxTop = box.getBoundingClientRect().top;

        if (boxTop < windowHeight * 0.8) {
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function () {
    const tileBoxes = document.querySelectorAll('.tile-box');

    tileBoxes.forEach(box => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        box.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});

// Mobile menu functionality
function toggleMobileMenu() {
    const navigation = document.querySelector('.navigation');
    if (navigation) {
        navigation.classList.toggle('mobile-open');
    }
}

// Handle dropdown clicks on mobile
document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.nav-button');
        const content = dropdown.querySelector('.dropdown-content');

        if (button && content) {
            button.addEventListener('click', function (e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();

                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            const otherContent = otherDropdown.querySelector('.dropdown-content');
                            if (otherContent) {
                                otherContent.style.display = 'none';
                            }
                        }
                    });

                    content.style.display = (content.style.display === 'block') ? 'none' : 'block';
                }
            });
        }
    });
});

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add performance optimization for carousel
let isCarouselTransitioning = false;

function optimizedChangeSlide(n) {
    if (isCarouselTransitioning) return;

    isCarouselTransitioning = true;
    changeSlide(n);

    setTimeout(() => {
        isCarouselTransitioning = false;
    }, 500);
}

// ✅ Fix for carousel buttons
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

if (prevBtn) {
    prevBtn.onclick = () => optimizedChangeSlide(-1);
}
if (nextBtn) {
    nextBtn.onclick = () => optimizedChangeSlide(1);
}

// ✅ Fix for touch/swipe support
let startX, startY, endX, endY;
const carouselContainer = document.querySelector('.carousel-container');

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    carouselContainer.addEventListener('touchend', function (e) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;

        const deltaX = startX - endX;
        const deltaY = startY - endY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                optimizedChangeSlide(1);
            } else {
                optimizedChangeSlide(-1);
            }
        }
    });
}

// Keyboard navigation for carousel
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
        optimizedChangeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        optimizedChangeSlide(1);
    }
});

// ✅ Animated number counter (on scroll into view)
document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll(".count");
    let animated = false;

    const animateNumbers = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute("data-count"));
            let current = 0;
            const speed = 90;
            const increment = Math.ceil(target / speed);

            const update = () => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + "+";
                } else {
                    counter.textContent = current + "+";
                    requestAnimationFrame(update);
                }
            };

            update();
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateNumbers();
                animated = true;
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => observer.observe(counter));
});

console.log("all.js loaded");
console.log(document.getElementById('cartCount'));
console.log(document.getElementById('categoryCarousel'));

