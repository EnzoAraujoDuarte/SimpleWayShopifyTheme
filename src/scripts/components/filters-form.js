/**
 * Filters Form
 * 
 * @module filters-form
 * @version 1.0.0
 * @extends HTMLElement
 */

// Constants for DOM selectors and configuration
const SELECTORS = {
  PRODUCT_GRID: '#product_grid',
  FILTER_SUBMIT: '[data-filter-submit]',
  FILTER_COUNT: '[data-filter-count]',
  ACTIVE_FACETS: '[data-active-facets]',
  SORT_BY: '#sort-by',
  FILTER_RESET: '[data-filter-reset]'
};

customElements.component = 'filters-form';

if (!customElements.get(customElements.component)) {

  class FiltersForm extends HTMLElement {

      /**
       * Collection filters web component.
       * 
       * @constructor
       */
      constructor() {

          super();

          // This variable is used to store data as cache
          this.filterData = [];
          
          this.initEvents();
      }

      /**
       * Init component events.
       * 
       * @returns {undefined}
       */
      initEvents() {

          try {

              // Bind this to the onActiveFilterClick method
              this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

              // On submit handler
              this.debouncedOnSubmit = window.theme.debounce.apply(event => {
                  this.onSubmitHandler(event);
              }, 500);

              this.filterForm = this.querySelector('form');

              if (this.filterForm) {
                  this.filterForm.addEventListener('input', this.debouncedOnSubmit.bind(this));
              }

              // Close drawer when the filter submit button is clicked
              const filterSubmitBtn = this.querySelector(SELECTORS.FILTER_SUBMIT);

              if (filterSubmitBtn) {
                  filterSubmitBtn.addEventListener('click', event => {
                      event.preventDefault();
                      this.closeDrawer();
                  });
              }

              // Handle filter reset
              const filterResetBtn = this.querySelector(SELECTORS.FILTER_RESET);

              if (filterResetBtn) {
                  filterResetBtn.addEventListener('click', event => {
                      event.preventDefault();
                      console.log('filter reset');
                      this.renderPage(new URLSearchParams().toString());
                  });
              }

              // Handle history change
              window.addEventListener('popstate', this.onHistoryChange.bind(this));

          } catch (error) {

              console.error('Error initializing events:', error);
          }
      }
  
      /**
       * On submit handler event.
       * 
       * @param {object} event Event.
       * @returns {undefined}
       */
      onSubmitHandler(event) {

          event.preventDefault();

          const formData = new FormData(event.target.closest('form'));

          const searchParams = new URLSearchParams(formData).toString();
      
          this.renderPage(searchParams, event);
      }

      /**
       * On active filter click event.
       * 
       * @param {object} event Click event.
       * @returns {undefined}
       */
      onActiveFilterClick(event) {

          event.preventDefault();
          
          this.renderPage(new URL(event.currentTarget.href).searchParams.toString());
      }

      /**
       * Render page content.
       * 
       * @param {string} searchParams URL params.
       * @param {object} event Click event.
       * @param {boolean} updateURLHash update URL hash.
       * @returns {undefined}
       */
      renderPage(searchParams, event, updateURLHash = true) {


          const productGrid = document.querySelector(SELECTORS.PRODUCT_GRID);

          if (productGrid) {
              productGrid.classList.add('loading');
          }
                      
          const url = `${window.location.pathname}?${searchParams}`;
          
          const filterDataUrl = element => element.url === url;
      
          this.filterData.some(filterDataUrl) ?
              this.renderSectionFromCache(filterDataUrl, event) :
              this.renderSectionFromFetch(url, event);
      
          if (updateURLHash) this.updateURLHash(searchParams);
      }

      /**
       * Render section from fetch.
       * 
       * @param {string} url String url.
       * @param {object} event Event.
       * @returns {undefined}
       */
      renderSectionFromFetch(url, event) {
          try {
              fetch(url)
                  .then(response => {
                      if (!response.ok) {
                          throw new Error(`HTTP error! status: ${response.status}`);
                      }
                      return response.text();
                  })
                  .then((responseText) => {
                      const html = responseText;
                      const html_dom = new DOMParser().parseFromString(html, 'text/html');

                      this.filterData = [...this.filterData, { html, url }];
                      
                      this.render(html_dom, event);
                  })
                  .catch(error => {
                      console.error('Error fetching filter data:', error);
                      // TODO: Optionally show user-friendly error message
                  });
          } catch (error) {
              console.error('Error in renderSectionFromFetch:', error);
          }
      }

      /**
       * Render section from catch.
       * 
       * @param {function} filterDataUrl A function.
       * @param {object} event Event.
       * @returns {undefined}
       */
      renderSectionFromCache(filterDataUrl, event) {

          const html = this.filterData.find(filterDataUrl).html;

          const html_dom = new DOMParser().parseFromString(html, 'text/html');

          this.render(html_dom, event);
      }

      /**
       * Render results in the page.
       * 
       * @param {object} html_dom Page html dom.
       * @returns {undefined}
       */
      render(html_dom, event) {

          this.renderProductGrid(html_dom);
          this.renderProductCount(html_dom);
          this.renderActiveFacets(html_dom);
          this.renderFilters(html_dom, event);
          this.renderSortBy(html_dom);
      }

      /**
       * Render product grid.
       * 
       * @param {object} html_dom Page html dom.
       * @returns {undefined}
       */
      renderProductGrid(html_dom) {

          let productGrid = document.querySelector(SELECTORS.PRODUCT_GRID);

          if (productGrid) {

              let newProductGrid = html_dom.querySelector(SELECTORS.PRODUCT_GRID);

              if (newProductGrid) {
                  
                  productGrid.innerHTML = newProductGrid.innerHTML;

                  productGrid.classList.remove('loading');
              }

          } else {

              console.error('Product grid not found. Selector: ', SELECTORS.PRODUCT_GRID);
          }
      }

      /**
       * Render product filtercount.
       * 
       * @param {object} html_dom Page html dom.
       * @returns {undefined}
       */
      renderProductCount(html_dom) {

          const productCount = document.querySelector(SELECTORS.FILTER_COUNT);

          if (productCount) {

              productCount.innerHTML = html_dom.querySelector(SELECTORS.FILTER_COUNT).innerHTML;

          } else {

              console.error('Product count not found. Selector: ', SELECTORS.FILTER_COUNT);
          }
      }

      /**
       * Render filters.
       * 
       * @param {object} html_dom Page html dom.
       * @returns {undefined}
       */
      renderFilters(html_dom, event) {

          const facetDetailsElementsFromFetch = html_dom.querySelectorAll('[data-facet]');

          const facetDetailsElementsFromDom = document.querySelectorAll('[data-facet]');
        
          // Remove facets that are no longer returned from the server
          Array.from(facetDetailsElementsFromDom).forEach((currentElement) => {

              if (!Array.from(facetDetailsElementsFromFetch).some(({ id }) => currentElement.id === id)) {
                  currentElement.remove();
              }
          });

          // Find the facet that is currently being clicked
          const matchesId = (element) => {

              const facet = event ? event.target.closest('[data-facet]') : undefined;
              
              return facet ? element.id === facet.id : false;
          };
      
          // Filter out the facet that is not being clicked
          const facetsToRender = Array.from(facetDetailsElementsFromFetch).filter((element) => !matchesId(element));

          facetsToRender.forEach((elementToRender, index) => {

              const currentElement = document.getElementById(elementToRender.id);

              // Element already rendered in the DOM so just update the innerHTML
              if (currentElement) {

                  // Update the innerHTML of the accordion container
                  currentElement.querySelector('[data-facet-container]').innerHTML = elementToRender.querySelector('[data-facet-container]').innerHTML;
              }
          });
      }

      /**
       * Render active facets.
       * 
       * @param {object} html_dom Page html dom.
       * @returns {undefined}
       */
      renderActiveFacets(html_dom) {

          const facetsToRender = html_dom.querySelector(SELECTORS.ACTIVE_FACETS);

          if (facetsToRender) {

              document.querySelectorAll(SELECTORS.ACTIVE_FACETS).forEach( element => {

                  element.innerHTML = facetsToRender.innerHTML;
              });

          } else {

              console.error('Facets to render not found. Selector: ', SELECTORS.ACTIVE_FACETS);
          }
      }

      /**
       * Render counts.
       * 
       * @returns {undefined}
       */
      renderCounts() {

          document.querySelectorAll('[data-filter-count-label]').forEach(element => {
              element.innerText = `(${count})`;
          });
      }

      /**
       * Render sort by.
       * 
       * @param {object} html_dom Page html dom.
       * @returns {undefined}
       */
      renderSortBy(html_dom) {

          const sortBy = this.querySelector(SELECTORS.SORT_BY);

          if (sortBy) {

              sortBy.innerHTML = html_dom.querySelector(SELECTORS.SORT_BY).innerHTML;

          } else {

              console.error('Sort by not found. Selector: ', SELECTORS.SORT_BY);
          }
      }

      /**
       * On history change.
       * 
       * @param {object} event Event.
       * @returns {undefined}
       */
      onHistoryChange(event) {

          const searchParams = event.state?.searchParams || '';

          this.renderPage(searchParams, null, false);
      }

      /**
       * Update URL hash.
       * 
       * @returns {undefined}
       */
      updateURLHash(searchParams) {
          history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
      }

      /**
       * Close drawer.
       * 
       * @returns {undefined}
       */
      closeDrawer() {

          const drawer = this.querySelector('side-drawer');

          if (drawer) {
              drawer.close();
          }
      }
  }

  customElements.define('filters-form', FiltersForm);
}
