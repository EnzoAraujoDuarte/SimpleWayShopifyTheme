/**
 * Product Card Component
 * 
 * @module product-card
 * @version 1.0.0
 * @extends HTMLElement
 */

import { BaseComponent } from './base-component.js';

customElements.component = 'product-card';

if (!customElements.get(customElements.component)) {

    class ProductCard extends BaseComponent {

        /**
         * Product card web component
         * 
         * @constructor 
         */
        constructor() {
            super();

            theme.product.loadProduct(this.dataset.handle).then(product => {

                // Get second image if available
                const secondImage = product.images && product.images.length > 1 ? product.images[1] : null;

                this.render({
                    image: product.featured_image,
                    secondImage: secondImage,
                    title: product.title,
                    vendor: product.vendor,
                    url: product.url,
                    price: window.theme.money.format(product.variants[0].price),
                    firstVariantId: product.variants[0].id
                });

                // Add second image if available
                if (secondImage) {
                    this.addSecondImage(secondImage, product.title);
                }

                this.initEvents();
            });
        }

        addSecondImage(imageUrl, altText) {
            const imageContainer = this.querySelector('.product-image-container');
            if (imageContainer) {
                const secondImage = document.createElement('img');
                secondImage.src = imageUrl;
                secondImage.alt = altText;
                secondImage.className = 'product-image product-image-secondary';
                imageContainer.appendChild(secondImage);
            }
        }

        initEvents() {

            let addToCartButton = this.querySelector('[data-add-to-cart]');

            if (addToCartButton) {
                
                addToCartButton.addEventListener('click', () => {

                    const variantId = this.querySelector('[name="variant-id"]').value;

                    if (variantId) {

                        theme.cart.add(variantId, 1).then(data => {
                            alert('Product added to cart');
                        }).catch(error => {
                            alert('Error adding product to cart');
                        });
                    }
                });
            }
        }
    }

    customElements.define(customElements.component, ProductCard);
}
