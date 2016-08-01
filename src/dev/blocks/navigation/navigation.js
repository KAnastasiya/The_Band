/**
 * Scroll-animation duration
 * @constant
 * @type  {Number}
 */
const ANIMATE_DURATION = 900;

/**
 * Position, when need collapsed navigation
 * @constant
 * @type  {Number}
 */
const NAV_COLLAPSE = 250;

/**
 * Names of DOM-elements classes
 * @constant
 * @type  {Object}
 */
const dataAttr = {
  'state': 'data-state',
  'transition': 'in-transition',
  'mode': 'data-mode',
  'list': 'list',
  'navState': 'data-state',
  'open': 'open',
  'style': 'data-style',
  'collapse': 'is-collapsed'
};

/**
 * Names of DOM-elements classes
 * @constant
 * @type  {Object}
 */
const className = {
  'nav': '.page-navigation',
  'navIcon': '.page-navigation__icon',
  'navList': '.page-navigation__list',
  'navLink': '.page-navigation__link',
  'header': '.page-header ',
  'footer': '.page-footer '
};

/**
 * Navigation elements list
 * @constant
 * @type  {Element}
 */
const topMenu = document.querySelector(className.header + className.navList),
  bottomMenu = document.querySelector(className.footer + className.navList);

/**
 * Navigation links
 * @constant
 * @return  {Array}
 */
const topMenuItemLinks = _getNavLinks(topMenu),
  bottomMenuItemLinks = _getNavLinks(bottomMenu);

/**
 * Indication that menu item has been clicked
 * @type  {Boolean}
 */
let navItemIsCLicked = false;

/**
 * Get DOM-elements of navigation links
 * @param   {Element}  nav  DOM-elements, that contains page navigation
 * @return  {Array}         DOM-elements, that contains page navigation links
 */
function _getNavLinks(nav) {
  let menuItemsElement = nav.querySelectorAll(className.navLink),
    links = [];
  for(let i = 0; i < menuItemsElement.length; i++) {
    links[i] = menuItemsElement[i];
  }
  return links;
}

/**
 * Set chosen navigation item
 * @param  {Array}    navLinks  Navigation links
 * @param  {Element}  element   DOM-element, that contains chosen item
 */
let _chooseNavItem = (navLinks, element) => {
  for(let i = 0; i < navLinks.length; i++) {
    navLinks[i].removeAttribute('disabled');
  }
  element.setAttribute('disabled', 'disabled');
};

/**
 * Get current scroll position
 * @return  {Number}
 */
let _getCurrentScrollPosition = () => {
  let yScroll;

  if (window.pageYOffset) {
    yScroll = window.pageYOffset;
  } else if (document.documentElement && document.documentElement.scrollTop) {
    yScroll = document.documentElement.scrollTop;
  } else if (document.body) {
    yScroll = document.body.scrollTop;
  }
  return yScroll;
};

/**
 * Clicking on navigation item handler
 * @param  {Object}  event  Event
 */
let _onNavItemClick = (event) => {
  let element = event.target,
    body = document.body;

  if( element.hasAttribute('href') ) {
    let href = element.getAttribute('href'),
      targetOffset = (href !== '#') ? document.querySelector(href).offsetTop : 0,
      currentPosition = _getCurrentScrollPosition(),
      scrollTranslate;

    // Get scroll offset
    if(targetOffset > currentPosition) {
      // Scroll to bottom
      scrollTranslate = '-' + (targetOffset - currentPosition);
    } else {
      // Scroll to top
      scrollTranslate = (currentPosition - targetOffset);
    }

    // Set scroll animation
    body.setAttribute(dataAttr.state, dataAttr.transition);
    body.style.WebkitTransform = 'translate(0, ' + scrollTranslate + 'px)';
    body.style.MozTransform = 'translate(0, ' + scrollTranslate + 'px)';
    body.style.transform = 'translate(0, ' + scrollTranslate + 'px)';

    window.setTimeout(function() {
      body.removeAttribute(dataAttr.state);
      body.style.cssText = '';
      window.scrollTo(0, targetOffset);
    }, ANIMATE_DURATION);

    // Choose navigation item
    _chooseNavItem(topMenuItemLinks, element);
    _chooseNavItem(bottomMenuItemLinks, element);

    _onNavIconClick();

    navItemIsCLicked = true;

    event.preventDefault();
  }
};

/**
 * Collapsing navigation handler
 */
let _setCollapseNav = () => {
  let nav = document.querySelector(className.nav);

  if (_getCurrentScrollPosition() > NAV_COLLAPSE) {
    nav.setAttribute(dataAttr.style, dataAttr.collapse);
  } else {
    nav.removeAttribute(dataAttr.style);
  }
};

/**
 * Scrolling pages handler
 */
let _onPageScroll = () => {
  _setCollapseNav();

  if(!navItemIsCLicked) {
    // Get current position
    let currentPosition = _getCurrentScrollPosition();

    // Get scroll-items
    let scrollItemsList = topMenuItemLinks.map(function(link) {
      let item = link.getAttribute('href'),
        scrollItem;
      if(item !== '#') {
        scrollItem = item;
      }
      return scrollItem;
    });

    // Get scroll-items state (if 'undefined' - item was not scrolled)
    let currentScrollItems = scrollItemsList.map(function(item) {
      let temp;
      if( item && (document.querySelector(item).offsetTop < currentPosition) ) {
        temp = item;
      }
      return temp;
    });

    // Get only scroll-items, that yet was scrolled
    let onlyScrolledItems = currentScrollItems.filter(function(item) {
      let temp;
      if(item) {
        temp = item;
      }
      return temp;
    });

    // Get id of the current scroll-items
    let currentItemId = onlyScrolledItems[onlyScrolledItems.length - 1] || '#';

    // Choose current scroll-item
    for(let i = 0; i < topMenuItemLinks.length; i++) {
      if( topMenuItemLinks[i].getAttribute('href') === currentItemId ) {
        _chooseNavItem(topMenuItemLinks, topMenuItemLinks[i]);
        _chooseNavItem(bottomMenuItemLinks, bottomMenuItemLinks[i]);
      }
    }
  } else {
    navItemIsCLicked = false;
  }
};

/**
 * Resize page handler
 */
function _onResize() {
  if ((window.matchMedia('(max-width: 525px)').matches)) {
    document.querySelector(className.nav).setAttribute(dataAttr.mode, dataAttr.list);
  } else {
    document.querySelector(className.nav).removeAttribute(dataAttr.mode);
  }
}

/**
 * Clicking on navigation icon handler
 */
function _onNavIconClick() {
  let navList = document.querySelector(className.navList);

  if (navList.getAttribute(dataAttr.navState) === dataAttr.open) {
    navList.removeAttribute(dataAttr.navState);
  } else {
    navList.setAttribute(dataAttr.navState, dataAttr.open);
  }
}

/**
 * Clicking on document handler
 * @param  {Object}  event  Event
 */
function _onDocClick(event) {
  event.stopPropagation();
  document.querySelector(className.navList).removeAttribute(dataAttr.navState);
}

// Navigation initialization
(function() {
  // Set first navigation item as default chosen
  _chooseNavItem(topMenuItemLinks, topMenuItemLinks[0]);
  _chooseNavItem(bottomMenuItemLinks, bottomMenuItemLinks[0]);

  _onResize();

  // Set event handlers
  topMenu.addEventListener('click', _onNavItemClick);
  bottomMenu.addEventListener('click', _onNavItemClick);
  document.querySelector(className.navIcon).addEventListener('click', _onNavIconClick);
  document.onclick = _onDocClick;
  window.onscroll = _onPageScroll;
  window.onresize = _onResize;
})();
