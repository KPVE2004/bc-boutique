document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // Configuración del menú móvil
    // =============================================
    const menuIcon = document.getElementById('menuIcon');
    const mobileMenu = document.getElementById('mobileMenu');
    const homeIcon = document.querySelector('.fa-home');
    let menuOverlay;

    if (mobileMenu) {
        menuOverlay = document.createElement('div');
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);
    }

    if(menuIcon && mobileMenu) {
        menuIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Ocultar/mostrar icono home
            if (homeIcon) {
                homeIcon.style.opacity = mobileMenu.classList.contains('active') ? '0' : '1';
                homeIcon.style.pointerEvents = mobileMenu.classList.contains('active') ? 'none' : 'auto';
            }
        });

        // Resto del código del menú...
    }

    // =============================================
    // Configuración del buscador
    // =============================================
    const searchIcon = document.getElementById('searchIcon');
    const searchModal = document.getElementById('searchModal');
    
    if(searchIcon && searchModal) {
        searchIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Calcula posición exacta
            const iconRect = searchIcon.getBoundingClientRect();
            const navRightRect = searchIcon.closest('.nav-right').getBoundingClientRect();
            
            // Posiciona el modal correctamente
            searchModal.style.right = `${navRightRect.right - iconRect.right - 15}px`;
            searchModal.style.top = `${iconRect.bottom + window.scrollY}px`;
            
            searchModal.classList.toggle('active');
            
            // Cierra el menú si está abierto
            if(mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                if (menuOverlay) menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', function(e) {
            if(searchModal && !searchModal.contains(e.target)) {
                if(e.target !== searchIcon) {
                    searchModal.classList.remove('active');
                }
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', function(e) {
            if(e.key === 'Escape' && searchModal) {
                searchModal.classList.remove('active');
            }
        });
    }

    // =============================================
    // Configuración de favoritos
    // =============================================
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    if (favoriteButtons.length > 0) {
        favoriteButtons.forEach(btn => {
            // Cargar estado inicial desde localStorage
            const productId = btn.dataset.productId;
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            
            if (productId && favorites.includes(productId)) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i>';
            }

            // Evento click para alternar favoritos
            btn.addEventListener('click', function() {
                if (!productId) return;
                
                this.classList.toggle('active');
                
                // Actualizar localStorage
                let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                
                if (this.classList.contains('active')) {
                    this.innerHTML = '<i class="fas fa-heart"></i>';
                    if (!favorites.includes(productId)) {
                        favorites.push(productId);
                    }
                } else {
                    this.innerHTML = '<i class="far fa-heart"></i>';
                    const index = favorites.indexOf(productId);
                    if (index > -1) {
                        favorites.splice(index, 1);
                    }
                }
                
                localStorage.setItem('favorites', JSON.stringify(favorites));
                
                // Mostrar feedback visual (opcional)
                const productInfo = this.closest('.product-info');
                if (productInfo) {
                    const productTitle = productInfo.querySelector('.product-title');
                    if (productTitle) {
                        console.log(`Producto ${this.classList.contains('active') ? 'añadido a' : 'eliminado de'} favoritos:`, productTitle.textContent.trim());
                    }
                }
            });
        });
    }

    // =============================================
    // Manejo de clics generales para cerrar menús
    // =============================================
    document.addEventListener('click', function(e) {
        // Cerrar menú móvil si está abierto y se hace clic fuera
        if (mobileMenu && menuOverlay && 
            !mobileMenu.contains(e.target) && 
            !menuIcon.contains(e.target) && 
            mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
        
        // Cerrar buscador si está abierto y se hace clic fuera
        if (searchModal && searchIcon &&
            !searchModal.contains(e.target) && 
            !searchIcon.contains(e.target) && 
            searchModal.classList.contains('active')) {
            searchModal.classList.remove('active');
        }
    });
});