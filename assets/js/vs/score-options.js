export const scoreOptions = (function () {
  var options = {};
  var elements = {};

  function updateElements() {
    for (var key in elements) {
      elements[key].set(options[key]);
    }
  }

  /**
   * Set options from value, including nested objects
   * TODO this currently relies on a default being set for objects
   * @param {object} obj
   * @param {string} [url]
   */
  function setFromObject(obj, url) {
    var value;

    for (var key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        setFromObject(obj[key], url);
      } else {
        value = VS.getQueryString(key, url);

        if (value) {
          obj[key] = value;
        }
      }
    }
  }

  return {
    add: function (key, defaults, element) {
      options[key] = defaults;
      elements[key] = element;
    },
    setFromQueryString: function (url) {
      setFromObject(options, url);
      updateElements();

      return options;
    },
  };
})();
