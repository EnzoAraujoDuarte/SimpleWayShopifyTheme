/**
 * Base component
 * 
 * Base class for all components that need template functionality
 * 
 * @module base-component
 * @version 1.0.0
 * @extends HTMLElement
 */

export class BaseComponent extends HTMLElement {
    
    /**
     * Web component constructor
     * 
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Get template
     * 
     * @param {string} type Template type to get
     * @returns {HTMLTemplateElement} Template element.
     */
    getTemplate(type) {
        const template = window.theme.getTemplate(type);

        if (!template) {
            console.error(`Template ${type} not found`);
            return null;
        }

        return template;
    }

    /**
     * Render component in the DOM
     * 
     * @param {object} variables Variables to replace in the template
     * @returns {undefined}
     */
    render(variables = {}) {
        const template = this.getTemplate(this.tagName.toLowerCase());

        if (!template) {
            return;
        }

        this.innerHTML = template.getHTML(variables);
        this.dataset.ready = true;
    }

    /**
     * Synchronizes data by updating specific elements in the template marked with data-variable attributes.
     * This method allows for partial updates without re-rendering the entire component.
     * 
     * @param {Object} variables - Key-value pairs where keys match data-variable attributes
     * @returns {void}
     * @example
     * this.syncData({
     *   counter: '42',
     *   status: 'active'
     * });
     */
    syncData(variables) {
        Object.entries(variables).forEach(([key, value]) => {
            const element = this.querySelector(`[data-variable="${key}"]`);
            if (element) {
                element.innerHTML = value;
            }
        });
    }
} 