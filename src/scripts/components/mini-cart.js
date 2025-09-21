/**
 * Mini cart component
 * 
 * A web component that implements a sliding mini cart functionality.
 * It uses the side-drawer component for the sliding panel and displays cart contents.
 * 
 * Features:
 * - Automatic opening when items are added to cart
 * - Real-time updates when cart changes
 * - Displays cart items, subtotal, shipping, tax, and total
 * - Quantity controls for each item
 * - Remove item functionality
 * 
 * Global Access:
 * The component exposes a global 'minicart' object with the following methods:
 * - window.minicart.open() - Opens the mini cart
 * - window.minicart.close() - Closes the mini cart
 * 
 * Events Handled:
 * - 'addtocart': Opens mini cart and updates contents
 * - 'update': Updates cart contents
 * - 'remove': Updates cart contents
 * 
 * @module mini-cart
 * @version 1.0.0
 * @extends BaseComponent
 * 
 * @example
 * // In theme.liquid
 * {% render 'mini-cart-template' %}
 * <mini-cart></mini-cart>
 * 
 * // Opening mini cart from anywhere
 * window.minicart.open();
 */

import { BaseComponent } from './base-component.js';

customElements.component = 'mini-cart';

if (!customElements.get(customElements.component)) {

    class MiniCart extends BaseComponent {

        /**
         * Creates an instance of MiniCart.
         * Initializes the drawer reference and event listeners.
         * Exposes the global minicart object.
         */
        constructor() {
            super();
            this.drawer = null;
        }

        /**
         * Lifecycle callback when element is connected to DOM.
         * Initializes the template and cart data.
         */
        connectedCallback() {

            const variables = this.prepareCartData();

            this.render(variables);

            this.drawer = this.querySelector('side-drawer');

            if (!this.drawer) {
                console.error('Mini-cart template must contain a side-drawer element');
                return;
            }

            this.initEvents();
            this.exposeComponent();
            this.init();
        }

        /**
         * Initializes the cart by fetching and rendering current cart data.
         * @async
         */
        async init() {

            // Get cart data from Shopify
            const cartData = await window.theme.cart.get();

            // Prepare cart data for template rendering
            const variables = this.prepareCartData(cartData);

            // Sync data with new cart data
            this.syncData(variables);
        }

        /**
         * Prepares cart data for template rendering.
         * @param {Object} cartData - Cart data from API
         * @returns {Object} Formatted data for template
         */
        prepareCartData(cartData = null) {

            // Default empty cart data
            const emptyCart = {
                item_count: 0,
                items: [],
                items_subtotal_price: 0,
                shipping_price: 0, 
                tax_price: 0,
                total_price: 0
            };

            // Use empty cart if no data provided
            const cart = cartData || emptyCart;
            const itemCount = cart.item_count || 0;
            const hasItems = itemCount > 0;

            return {
                itemCountText: hasItems ? `${itemCount}` : '',
                itemsHtml: this.buildItemsHtml(cart.items),
                subtotal: theme.money.format(cart.items_subtotal_price),
                shipping: theme.money.format(cart.shipping_price || 0),
                tax: theme.money.format(cart.tax_price || 0),
                total: theme.money.format(cart.total_price)
            };
        }

        /**
         * Binds event listeners for cart updates.
         * 
         * @private
         */
        initEvents() {
            window.addEventListener('addtocart', this.handleAddToCart.bind(this));
            window.addEventListener('update', this.handleCartUpdate.bind(this));
            window.addEventListener('remove', this.handleCartUpdate.bind(this));

            document.querySelectorAll('[data-mini-cart-trigger]').forEach(trigger => {
                trigger.addEventListener('click', event => {
                    event.preventDefault();
                    this.open();
                });
            });
        }

        /**
         * Exposes the global minicart object.
         * 
         * @private
         */
        exposeComponent() {

            // Check if minicart object already exists
            if (window.minicart) {
                return;
            }

            // Expose global minicart object
            window.minicart = {
                open: this.open.bind(this),
                close: this.close.bind(this)
            };
        }

        /**
         * Handles the addtocart event.
         * Updates cart contents and opens the mini cart.
         * @async
         */
        async handleAddToCart() {
            const cartData = await window.theme.cart.get();
            this.syncData(this.prepareCartData(cartData));
            this.open();
        }

        /**
         * Handles cart update events.
         * Updates the cart contents.
         * @async
         */
        async handleCartUpdate() {
            const cartData = await window.theme.cart.get();
            this.syncData(this.prepareCartData(cartData));
        }

        /**
         * Builds HTML for cart items.
         * @param {Array} items - Array of cart items
         * @returns {string} HTML string of cart items
         */
        buildItemsHtml(items) {

            if (!items || items.length === 0) {
                return '<div class="p-5 text-center text-primary-300">Your bag is empty</div>';
            }

            return items.map(item => {
                const itemElement = document.createElement('mini-cart-item');
                itemElement.dataset.variantId = item.variant_id;
                itemElement.dataset.productId = item.product_id;
                itemElement.dataset.key = item.key;
                itemElement.dataset.quantity = item.quantity;

                let options = '';

                // Add SKU into options
                if (item.sku) {
                    options += `<li>STYLE# ${item.sku}</li>`;
                }

                // Add cart item options into options
                if (!item.product_has_only_default_variant) {
                    item.options_with_values.forEach(option => {
                        options += `<li>${option.name}: ${option.value}</li>`;
                    });
                }

                // Add properties into options
                Object.entries(item.properties).forEach(([key, value]) => {
                    options += `<li>${key}: ${value}</li>`;
                });

                // Pre-render the item with its data
                const template = this.getTemplate('mini-cart-item');
                const itemHtml = template.getHTML({
                    // image: item.image || window.theme.productImagePlaceholder,
                    image: item.featured_image.url || window.theme.productImagePlaceholder,
                    title: item.product_title,
                    price: theme.money.format(item.price),
                    url: item.url,
                    quantity: item.quantity,
                    options: options
                });
                
                itemElement.innerHTML = itemHtml;
                return itemElement.outerHTML;
            }).join('');
        }

        /**
         * Opens the mini cart.
         * @public
         */
        open() {
            if (this.drawer) {
                this.drawer.open();
            }
        }

        /**
         * Closes the mini cart.
         * @public
         */
        close() {
            if (this.drawer) {
                this.drawer.close();
            }
        }
    }

    customElements.define(customElements.component, MiniCart);
} 