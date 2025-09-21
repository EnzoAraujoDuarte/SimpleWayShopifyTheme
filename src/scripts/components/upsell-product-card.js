/**
 * Product Card Component
 * 
 * @module product-card
 * @version 1.0.0
 * @extends HTMLElement
 */

import { BaseComponent } from './base-component.js';

customElements.component = 'upsell-product-card';

if (!customElements.get(customElements.component)) {

    class UpsellProductCard extends BaseComponent {

        /**
         * Upsell product card web component
         * 
         * @constructor 
         */
        constructor() {
            super();

            theme.product.getProduct(this.dataset.handle).then(product => {

                this.render({
                    image: product.product.image.src,
                    title: product.product.title,
                    vendor: product.product.vendor
                });
            });
        }
    }

    customElements.define(customElements.component, UpsellProductCard);
}
