/**
 * Menu component
 * 
 * @module component-menu
 * @version 1.0.0
 * @extends HTMLElement
 */

customElements.component = 'component-menu';

if (!customElements.get(customElements.component)) {

   class ComponentMenu extends HTMLElement {
        
        /**
         * Constructor
         */
        constructor() {
            super();
            this.initEvents();
            this.previousActiveElement = null;
            this.dataset.activeLevel = 1;
            this.submenuTraps = new Map();
        }

        initEvents() {

            // Open submenu
            this.querySelectorAll('[data-open-submenu]').forEach(button => {
                button.addEventListener('click', () => {
                    this.openSubmenu(button.dataset.openSubmenu);
                });
            });

            // Close submenu
            this.querySelectorAll('[data-close-submenu]').forEach(button => {
                button.addEventListener('click', () => {
                    this.closeSubmenu(button.dataset.closeSubmenu);
                });
            });

            // Toggle submenu (for third level)
            this.querySelectorAll('[data-toggle-submenu]').forEach(button => {
                button.addEventListener('click', () => {
                    this.toggleSubmenu(button.dataset.toggleSubmenu);
                });
            });

            // Handle escape key for submenus
            this.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const activeSubmenu = this.querySelector('.submenu.active');
                    if (activeSubmenu) {
                        const submenuId = activeSubmenu.dataset.submenu;
                        // Only handle escape for level 2 submenus (those with data-open-submenu)
                        if (this.querySelector(`[data-open-submenu="${submenuId}"]`)) {
                            this.closeSubmenu(submenuId);
                            e.preventDefault();
                        }
                    }
                }
            });
        }

        /**
         * Get all focusable elements within a container
         * @param {HTMLElement} container - The container to search within
         * @returns {Array} Array of focusable elements
         */
        getFocusableElements(container = this) {
            return Array.from(container.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
        }

        /**
         * Create a focus trap for a submenu
         * @param {HTMLElement} submenu - The submenu element
         * @param {string} submenuId - The submenu ID
         * @returns {Object} The focus trap instance
         */
        createSubmenuTrap(submenu, submenuId) {
            // Create a new focus trap for the submenu
            const submenuTrap = focusTrap.createFocusTrap(submenu, {
                escapeDeactivates: false, // We handle escape key ourselves
                allowOutsideClick: true,
                returnFocusOnDeactivate: true,
                fallbackFocus: submenu,
                onDeactivate: () => {
                    // Clean up when deactivated
                    this.submenuTraps.delete(submenuId);
                }
            });

            this.submenuTraps.set(submenuId, submenuTrap);
            return submenuTrap;
        }

        enable() {
            this.classList.add('active');
        }

        disable() {
            // Deactivate any active submenu traps
            this.submenuTraps.forEach(trap => trap.deactivate());
            this.submenuTraps.clear();
            
            this.classList.remove('active');

            // Remove all aria-hidden attributes
            this.querySelectorAll('[aria-hidden]').forEach(el => {
                el.removeAttribute('aria-hidden');
            });
        }

        openSubmenu(submenuId) {
            const submenu = this.querySelector(`[data-submenu="${submenuId}"]`);

            if (submenu) {
                this.classList.add('loading');

                setTimeout(() => {
                    submenu.classList.add('active');
                    this.dataset.activeLevel++;
                    this.classList.remove('loading');
                    
                    // Create and activate focus trap for this submenu
                    const submenuTrap = this.createSubmenuTrap(submenu, submenuId);
                    submenuTrap.activate();

                    // Focus the first focusable element in submenu
                    const firstFocusable = submenu.querySelector('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
                    if (firstFocusable) {
                        firstFocusable.focus();
                    }
                }, 300);
            }
        }

        closeSubmenu(submenuId) {
            const submenu = document.querySelector(`[data-submenu="${submenuId}"]`);

            if (submenu) {
                this.classList.add('loading');

                // Deactivate the focus trap for this submenu
                const submenuTrap = this.submenuTraps.get(submenuId);
                if (submenuTrap) {
                    submenuTrap.deactivate();
                }

                setTimeout(() => {
                    this.classList.remove('loading');
                    submenu.classList.remove('active');
                    this.dataset.activeLevel--;
                    
                    // Focus back to the parent menu item
                    const parentButton = this.querySelector(`[data-open-submenu="${submenuId}"]`);
                    if (parentButton) {
                        parentButton.focus();
                    }
                }, 300);
            }
        }

        toggleSubmenu(submenuId) {
            const submenu = this.querySelector(`[data-submenu="${submenuId}"]`);

            if (submenu) {
                // Simple toggle for third level - no focus trap needed
                submenu.classList.toggle('active');
            }
        }
    }

    customElements.define(customElements.component, ComponentMenu);
}