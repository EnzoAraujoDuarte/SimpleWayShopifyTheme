const debounce = {
	/**
	 * Init component
	 */
	init: () => {
		/**
		 * Debounce module api
		 *
		 * @global
		 */
		window.theme.debounce = debounce;
	},

	/**
	 * Apply debounce.
	 *
	 * @param {function} fn A function.
	 * @param {int} waint A time to wait.
	 * @returns {function} A function.
	 */
	apply: (fn, wait) => {
		let t;

		return (...args) => {
			clearTimeout(t);

			t = setTimeout(() => fn.apply(this, args), wait);
		};
	},
};

export default debounce;