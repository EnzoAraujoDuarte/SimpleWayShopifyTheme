/**
 * Quantity selector component
 * 
 * @module quantity-selector
 * @version 1.1.0
 * @extends HTMLElement
 */

const COMPONENT_NAME = 'quantity-selector';

if(!customElements.get(COMPONENT_NAME)) {
 
    class QuantitySelector extends HTMLElement {

        static get observedAttributes() {
            return ['name', 'value', 'min', 'max', 'remove-button'];
        }

        /**
         * Quantity selector web component
         * 
         * @constructor
         */
        constructor() {
            super();

            // Add default values
            this.minValue = parseInt(this.getAttribute('min') || 0, 10);
            this.maxValue = parseInt(this.getAttribute('max') || Number.MAX_SAFE_INTEGER, 10);
        }

        /**
         * Connected callback lifecycle method
         */
        connectedCallback() {

            this.render();
            this.initEvents();
            this.updateButtonStates();
            
            // Initially hide the remove button if value is not 1
            const value = this.getValue();
            const removeBtn = this.getRemoveButton();
            
            if (value !== 1) {
                removeBtn.style.display = 'none';
            }
        }

        /**
         * Render the component
         */
        render() {

            let id = `quantity-${Math.random().toString(36).substring(2, 9)}`;
            
            // Create the input element
            const input = document.createElement('input');
            input.type = 'number';
            input.min = this.minValue;
            input.max = this.maxValue;
            input.size = 4;
            input.autocomplete = 'off';
            input.pattern = '[0-9]*';
            input.name = this.getAttribute('name') || '';
            input.id = id;
            this.dataset.id = id;
            input.setAttribute('aria-label', 'Quantity');
            input.setAttribute('inputmode', 'numeric');

            // Set the initial value
            input.value = this.getAttribute('value') ? parseInt(this.getAttribute('value'), 10) : this.minValue;

            // Check if remove button should be rendered
            const shouldShowRemoveButton = this.getAttribute('remove-button') !== 'false';

            // Create the decrease button
            const decreaseBtn = document.createElement('button');
            decreaseBtn.setAttribute('aria-label', 'Decrease quantity');
            decreaseBtn.dataset.action = 'decrease';
            decreaseBtn.type = "button";
            decreaseBtn.innerHTML = '<span class="visually-hidden">Decrease quantity</span>';
            decreaseBtn.setAttribute('aria-controls', input.id);

            // Create the increase button
            const increaseBtn = document.createElement('button');
            increaseBtn.setAttribute('aria-label', 'Increase quantity');
            increaseBtn.dataset.action = 'increase';
            increaseBtn.type = "button";
            increaseBtn.innerHTML = '<span class="visually-hidden">Increase quantity</span>';
            increaseBtn.setAttribute('aria-controls', input.id);

            // Create the remove button if not disabled
            if (shouldShowRemoveButton) {
                const removeBtn = document.createElement('button');
                removeBtn.setAttribute('aria-label', 'Remove');
                removeBtn.dataset.action = 'remove';
                removeBtn.type = "button";
                removeBtn.innerHTML = '<span class="visually-hidden">Remove quantity</span>';
                removeBtn.setAttribute('aria-controls', input.id);
                
                // Add the remove button to the component
                this.append(removeBtn);
            }
            
            // Add the elements to the component
            this.append(decreaseBtn);
            this.append(input);
            this.append(increaseBtn);
        }

        /**
         * Initialize event listeners
         */
        initEvents() {

            // Add input change event
            this.getInput().addEventListener('change', this.handleInputChange.bind(this));
            this.getInput().addEventListener('input', this.handleInputChange.bind(this));
            
            // Add button click events
            const decreaseBtn = this.getDecreaseButton();
            const removeBtn = this.getRemoveButton();
            const increaseBtn = this.getIncreaseButton();

            if (decreaseBtn) {
                decreaseBtn.addEventListener('click', this.decrease.bind(this));
            }

            if (increaseBtn) {
                increaseBtn.addEventListener('click', this.increase.bind(this));
            }

            if (removeBtn) {
                removeBtn.addEventListener('click', this.remove.bind(this));
            }
        }

        /**
         * Get the input element
         * 
         * @returns {HTMLInputElement} The input element
         */
        getInput() {

            if(!this.input) {
                this.input = this.querySelector('input');
            }

            return this.input;
        }

        /**
         * Get the decrease button element
         * 
         * @returns {HTMLButtonElement} The decrease button element
         */
        getDecreaseButton() {

            if(!this.decreaseButton) {
                this.decreaseButton = this.querySelector('[data-action="decrease"]');
            }

            return this.decreaseButton;
        }

        /**
         * Get the increase button element
         * 
         * @returns {HTMLButtonElement} The increase button element
         */
        getIncreaseButton() {

            if(!this.increaseButton) {
                this.increaseButton = this.querySelector('[data-action="increase"]');
            }

            return this.increaseButton;
        }

        /**
         * Get the remove button element
         * 
         * @returns {HTMLButtonElement|null} The remove button element or null if not present
         */
        getRemoveButton() {
            if (!this.hasAttribute('remove-button') || this.getAttribute('remove-button') !== 'false') {
                if(!this.removeButton) {
                    this.removeButton = this.querySelector('[data-action="remove"]');
                }
                return this.removeButton;
            }
            return null;
        }

        /**
         * Get the value of the input element
         * 
         * @returns {number} The value of the input element
         */
        getValue() {
            return parseInt(this.getInput().value, 10);
        }

        /**
         * Set quantity value
         * @param {number} value - New quantity value
         */
        setValue(value) {

            const newValue = parseInt(value, 10);
            
            if (!isNaN(newValue)) {
                this.getInput().value = Math.max(this.minValue, Math.min(newValue, this.maxValue));
                this.updateButtonStates();
            }
        }

        /**
         * Dispatch custom event
         * 
         * @param {string} eventName - The name of the event to dispatch
         */
        dispatchCustomEvent(eventName) {
            const event = new CustomEvent(eventName, {
                bubbles: true,
                detail: {
                    input: this.getInput(),
                    value: this.getValue()
                }
            });
            
            this.dispatchEvent(event);
        }

        /**
         * Handle input changes
         * @param {Event} event - Input event
         */
        handleInputChange(event) {

            const value = this.getValue();
            
            // Handle invalid input (NaN)
            if (isNaN(value)) {

                this.setValue(this.minValue);

            } else {

                // Check if value is 0, trigger remove event
                if (value === 0) {
                    this.updateButtonStates();
                    this.dispatchCustomEvent('quantity:remove');
                    return;
                }
                
                // Ensure value is within min/max bounds
                if (value < this.minValue) {

                    this.setValue(this.minValue);

                } else if (value > this.maxValue) {

                    this.setValue(this.maxValue);
                }
            }
            
            this.updateButtonStates();
            this.dispatchCustomEvent('quantity:change');
        }

        /**
         * Decrease quantity
         */
        decrease() {
            
            const value = this.getValue();
            
            if (value > this.minValue) {
                this.setValue(value - 1);
                this.updateButtonStates();
                this.dispatchCustomEvent('quantity:change');
            }
        }

        /**
         * Increase quantity
         */
        increase() {

            const value = this.getValue();
            
            if (value < this.maxValue) {
                this.setValue(value + 1);
                this.updateButtonStates();
                this.dispatchCustomEvent('quantity:change');
            }
        }

        /**
         * Update button states based on current value
         */
        updateButtonStates() {
            const value = this.getValue();
            const decreaseBtn = this.getDecreaseButton();
            const increaseBtn = this.getIncreaseButton();
            const removeBtn = this.getRemoveButton();
            
            // Check if remove button should be shown
            const shouldShowRemoveButton = this.getAttribute('remove-button') !== 'false';
            
            // Show/hide decrease and remove buttons based on value
            if (value === 1 && shouldShowRemoveButton && removeBtn) {
                // When value is 1, show remove button and hide decrease button
                removeBtn.style.display = 'block';
                decreaseBtn.style.display = 'none';
            } else {
                // Otherwise, hide remove button (if it exists) and show decrease button
                if (removeBtn) {
                    removeBtn.style.display = 'none';
                }
                decreaseBtn.style.display = 'block';
                
                // Disable decrease button if at min value (other than 1)
                decreaseBtn.disabled = value <= this.minValue;
            }
            
            // Disable increase button if at max value
            increaseBtn.disabled = value >= this.maxValue;
        }

        /**
         * Handle remove button click
         */
        remove() {
            this.dispatchCustomEvent('quantity:remove');
        }
    }
 
    customElements.define(COMPONENT_NAME, QuantitySelector);
}
 
 