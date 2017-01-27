export default Concert;

import { bindAllFunc, addLeadingNull, monthNum2Name } from './../../../../js-common/utils';

/**
 * Names of DOM-elements classes
 * @constant
 * @type  {Object}
 */
const className = {
  'concertItem': '.future-concert__item',
  'info': '.future-concert__text',
  'day': '.future-concert__day',
  'month': '.future-concert__month',
  'year': '.future-concert__year',
};

/**
 * Render artist card
 * @constructor
 * @param  {ConcertData}  data  Artists information (name, photo...)
 */
function Concert(data, template, container) {
  bindAllFunc(this);
  this.data = data;
  this._createConcertElement(template);
  this._setConcertDataToElement();
  this._renderTo(container);
}

/**
 * Create record of artist list by template
 * @param  {Element}  template  DOM-element, that contains template
 */
Concert.prototype._createConcertElement = function(template) {
  let concertToClone;

  if ('content' in template) {
    concertToClone = template.content.querySelector(className.concertItem);
  } else {
    concertToClone = template.querySelector(className.concertItem);
  }

  this.element = concertToClone.cloneNode(true);
};

/**
 * Set data in card of artist
 */
Concert.prototype._setConcertDataToElement = function() {
  // Set concerts date
  let concertDate = this.data.getConcertDate();
  this.element.querySelector(className.day).textContent = addLeadingNull(concertDate.getDate());
  this.element.querySelector(className.month).textContent = monthNum2Name(concertDate.getMonth());
  this.element.querySelector(className.year).textContent = concertDate.getFullYear();

  // Set other concerts information
  this.element.querySelector(className.info).textContent = this.data.getConcertPlace() + ' // '
                                                      + this.data.getConcertCity();
};

/**
 * Insert record of artists list to the container
 * @param  {Element}  container  DOM-element of container
 */
Concert.prototype._renderTo = function(container) {
  container.appendChild(this.element);
};
