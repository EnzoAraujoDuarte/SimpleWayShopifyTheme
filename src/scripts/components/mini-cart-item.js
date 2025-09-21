/**
 * Mini cart item component
 * 
 * @module mini-cart-item
 * @version 1.0.0
 * @extends BaseComponent
 */

import { BaseComponent } from './base-component.js';

customElements.component = 'mini-cart-item';

if (!customElements.get(customElements.component)) {

    class MiniCartItem extends BaseComponent {
        
        constructor() {
            super();
            this.variantId = this.dataset.variantId;
            this.quantity = parseInt(this.dataset.quantity);
        }

        connectedCallback() {

            let quantitySelector = this.querySelector('quantity-selector');

            if (quantitySelector) {

                this.quantitySelector = quantitySelector;
                
                quantitySelector.addEventListener('quantity:remove', this.handleRemove.bind(this));
                
                quantitySelector.addEventListener('quantity:change', this.handleQuantityChange.bind(this));
                
            } else {

                console.error('Quantity selector not found');
            }
        }

        /**
         * Handle remove event
         * 
         * @param {*} event 
         */
        async handleRemove(event) {
            event.preventDefault();
            await window.theme.cart.remove(this.variantId);
        }

        /**
         * Handle quantity change event
         * 
         * @param {*} event 
         */
        async handleQuantityChange(event) {
            await window.theme.cart.update(this.variantId, this.quantitySelector.getValue());
        }
    }

    customElements.define(customElements.component, MiniCartItem);
} 