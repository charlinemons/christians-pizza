// Christian's Pizza - Fonctionnalités JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== NAVIGATION STICKY ====================
    const stickyNav = document.getElementById('stickyNav');
    const header = document.querySelector('header');
    
    function handleScroll() {
        if (window.scrollY > header.offsetHeight) {
            stickyNav.classList.add('visible');
        } else {
            stickyNav.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // ==================== BOUTON RETOUR EN HAUT ====================
    const backToTopBtn = document.getElementById('backToTop');
    
    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    }
    
    window.addEventListener('scroll', handleBackToTop);
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ==================== HORAIRES TEMPS RÉEL ====================
    function updateOpenStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 60 + minute; // Convertir en minutes
        
        // Horaires : 17h30-21h15 (17h30-21h45 vendredi/samedi)
        const openTime = 17 * 60 + 30; // 17h30 en minutes
        let closeTime;
        
        if (day === 5 || day === 6) { // Vendredi ou Samedi
            closeTime = 21 * 60 + 45; // 21h45
        } else {
            closeTime = 21 * 60 + 15; // 21h15
        }
        
        const isOpen = currentTime >= openTime && currentTime <= closeTime;
        
        // Mise à jour du badge de statut
        const statusBadge = document.getElementById('statusBadge');
        const headerStatus = document.getElementById('headerStatus');
        
        if (isOpen) {
            const statusText = '🟢 OUVERT';
            const statusClass = 'status-open';
            
            if (statusBadge) {
                statusBadge.textContent = statusText;
                statusBadge.className = `status-badge ${statusClass}`;
            }
            
            if (headerStatus) {
                headerStatus.textContent = statusText;
                headerStatus.className = `hours-status ${statusClass}`;
            }
        } else {
            const statusText = '🔴 FERMÉ';
            const statusClass = 'status-closed';
            
            // Calculer l'heure de prochaine ouverture
            let nextOpen = '';
            if (currentTime < openTime) {
                nextOpen = ' - Ouvre à 17h30';
            } else {
                nextOpen = ' - Ouvre demain 17h30';
            }
            
            if (statusBadge) {
                statusBadge.textContent = statusText + nextOpen;
                statusBadge.className = `status-badge ${statusClass}`;
            }
            
            if (headerStatus) {
                headerStatus.textContent = statusText + nextOpen;
                headerStatus.className = `hours-status ${statusClass}`;
            }
        }
    }
    
    // Mettre à jour le statut au chargement et toutes les minutes
    updateOpenStatus();
    setInterval(updateOpenStatus, 60000); // Actualiser toutes les minutes
    
    // ==================== SMOOTH SCROLL POUR NAVIGATION ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Compensation pour la nav sticky
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==================== OPTIMISATIONS PERFORMANCE ====================
    
    // Lazy loading pour les images (si il y en avait)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ==================== ANALYTICS / TRACKING ====================
    
    // Tracking des clics sur téléphone
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Ici vous pourriez ajouter Google Analytics tracking
            console.log('Clic téléphone tracké');
        });
    });
    
    // Tracking des clics vers Google Maps
    document.querySelectorAll('a[href*="maps.app.goo.gl"]').forEach(link => {
        link.addEventListener('click', function() {
            console.log('Clic Maps tracké');
        });
    });
    
    // ==================== AMÉLIORATION UX ====================
    
    // Préchargement de la police au survol du menu (si applicable)
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.content')) {
            // Précharger les éléments si nécessaire
        }
    });
    
    // Affichage du numéro de téléphone en gras au focus
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('focus', function() {
            this.style.fontWeight = 'bold';
        });
        
        link.addEventListener('blur', function() {
            this.style.fontWeight = '';
        });
    });
    
    console.log('🍕 Christian\'s Pizza - Site optimisé et prêt !');
});

// ==================== FONCTIONS UTILITAIRES ====================

// Fonction pour formater le téléphone au format français
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
}

// Fonction pour détecter si l'utilisateur est sur mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Fonction pour débouncer les événements de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}