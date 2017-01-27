export {
  bindAllFunc,
  loadingIsProgress,
  endLoading,
  showLoadingError,
  addLeadingNull,
  monthNum2Name
};

/**
 * Names of data-attributes DOM-elements and them values
 * @constant
 * @type  {Object}
 */
const dataAttr = {
  attrName: 'data-state',
  attrValueProcess: 'is-loading',
  attrValueError: 'is-failure'
};

/**
 * Setting the context for all objects methods
 * @param  {Object}  object  The object for which you want to fix context
 */
function bindAllFunc(object) {
  for (var property in object) {
    if (typeof object[property] === 'function') {
      object[property] = object[property].bind(object);
    }
  }
}

/**
 * Show loading indication
 */
function loadingIsProgress(element) {
  element.setAttribute(dataAttr.attrName, dataAttr.attrValueProcess);
}

/**
 * Hide loading indication
 */
function endLoading(element) {
  element.removeAttribute(dataAttr.attrName);
}

/**
 * Show loading errors
 */
function showLoadingError(element) {
  endLoading(element);
  element.setAttribute(dataAttr.attrName, dataAttr.attrValueError);
}

/**
 * Add leading null for date and month, contains only one number
 * @param   {Number}  data  Date or Month without leading null
 * @return  {Number}        Date or Month with leading null
 */
function addLeadingNull(data) {
  return (data < 10) ? '0' + data : data;
}

/**
 * Convert month number to month name
 * @param   {Number}  num  Month number
 * @return  {String}       Month name
 */
function monthNum2Name(num) {
  let month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return month[num];
}
