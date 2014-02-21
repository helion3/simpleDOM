/**
 * A super-simple DOM helper lib.
 *
 * @author Mike Botsko
 *
 * Contains methods useful for basic DOM manipulation, built to
 * mimic jQuery - developers who are familiar with jQuery will
 * have no trouble adapting to this.
 *
 * Works with all browser versions of the past few years.
 */
(function (window,undefined){

  var _$ = window.$;

  var simpleDOM = function(selector){
    return new simpleDOMEngine(selector);
  };

  /**
   * Returns $ to its original value in case
   * we're trampling the variable
   *
   * Returns a clean instance of our application
   * for your own variable.
   *
   * @return {object}
   */
  simpleDOM.noConflict = function(){
    if ( window.$ === window.simpleDOM ){
      window.$ = _$;
    }
    return window.simpleDOM;
  };

  // Wrapping object of any passed selector
  var simpleDOMEngine = function(selector){

    this._raw_selector = selector;

    var _matches = [];

    (function(engine){

      // Object
      if( typeof selector === "object" ){
        _matches = [selector];
        return;
      }
      // Doc.Ready closure
      if( typeof selector === "function" ){
        engine.ready(selector);
        return;
      }
      // String
      if( typeof selector === "string" ){

        // New HTML element
        if( selector.indexOf("<") === 0 ){
          var elemName = selector.replace(/[<|>]/g, '');
          var elem = document.createElement(elemName);
          _matches = [elem];
          return;
        }

        // Selector
        if( 'querySelectorAll' in document ){
          _matches = document.querySelectorAll(engine._raw_selector);
          return;
        }
        // For IE7. Won't actually use css selectors but this is better than
        // falling over and dying.
        if( selector.indexOf("#") === 0 ){
          _matches = [ document.getElementById( selector.replace('#','') ) ];
        } else {
          _matches = document.getElementsByTagName( selector );
        }
      }
    })(this);

    this.length = _matches.length;
    for (var i = 0; i < _matches.length; i++){
        this[i] = _matches[i];
    }

    return this;

  };

  simpleDOMEngine.prototype = {

    // store selector
    _raw_selector: false,

    /**
     * Returns a wrapper instance of a single
     * element.
     * @param k
     * @returns {*}
     */
    get: function(k){
        return new simpleDOMEngine(this[k]);
    },

    /**
     * Navigate DOM to parent element of current
     * @return {simpleDOMEngine}
     */
    parent: function(){
      return new simpleDOMEngine(this[0].parentNode);
    },

    /**
     * Iterates every matching element and applies
     * a function
     * @param  {[type]} closure [description]
     * @return {[type]}         [description]
     */
    each: function( closure ){
      if( typeof closure !== "function" ) return false;
      for( var n = 0, l = this.length; n < l; n++ ){
        closure.call(this[n],n);
      }
      return this;
    },

    /**
     * Execute function when the document has loaded
     * @param  {[type]} closure [description]
     * @return {[type]}         [description]
     */
    ready: function( closure ){
      if( typeof closure !== "function" ) return;
      window.document.onreadystatechange = function(){
        if (window.document.readyState == "complete" || window.document.readyState == "loaded"){
          closure();
        }
      };
    },

    /**
     * Returns an array of existing classes for an element
     * @param  {[type]} elem [description]
     * @return {[type]}      [description]
     */
    getClasses: function( elem ){
      return (elem.className !== "" ? elem.className.split(' ') : []);
    },
    /**
     * Adds a new CSS class to each element
     *
     * @param className
     * @returns simpleDOM
     */
    addClass: function( className ){
      for( var n = 0, l = this.length; n < l; n++ ){
        var classes = this.getClasses(this[n]);
        classes.push(className);
        this[n].className = classes.join(' ');
      }
      return this;
    },
    /**
     * Removes a CSS class name from an element
     * @param className
     * @returns simpleDOM
     */
    removeClass: function( className ){
      var regex = new RegExp('(?:^|\\s)'+className+'(?!\\S)');
      for( var n = 0, l = this.length; n < l; n++ ){
        this[n].className = this[n].className.replace( regex , '' );
      }
      return this;
    },
    /**
     * Determine if an element has a CSS class name.
     *
     * @todo Only works for the first element matched by
     * the selector. Will not currently work on subsequent
     * elements
     *
     * @param className
     * @returns boolean
     */
    hasClass: function( className ){
      var regex = new RegExp('(?:^|\\s)'+className+'(?!\\S)');
      if( this.length >= 1 ){
        return this[0].className.match( regex ) || false;
      }
      return false;
    },

    /**
     * Binds eventHandler of eventType to all elements
     * matching selector.
     *
     * @param eventType
     * @param eventHandler
     * @returns simpleDOM
     */
    bind: function( eventType, eventHandler ){
      for( var n = 0, l = this.length; n < l; n++ ){
        var eventElem = this[n];
        if(eventElem.addEventListener){
          eventElem.addEventListener(eventType, eventHandler, false);
        } else {
          eventElem.attachEvent('on'+eventType, eventHandler);
        }
      }
      return this;
    },
    /**
     * Unbinds an event from all elements matching selector.
     *
     * @param eventType
     * @param eventHandler
     * @returns {*}
     */
    unbind: function( eventType, eventHandler ){

      for( var n = 0, l = this.length; n < l; n++ ){
        var eventElem = this[n];
        if(eventElem.removeEventListener){
          eventElem.removeEventListener(eventType, eventHandler, false);
        } else {
          eventElem.detachEvent('on'+eventType, eventHandler);
        }
      }
      return this;
    },

    /**
     * Set css attribute values
     *
     * @param att
     * @param val
     * @returns simpleDOM
     */
    css: function( att, val ){
      for( var n = 0, l = this.length; n < l; n++ ){
        this[n].style[att] = val;
      }
      return this;
    },
    /**
     * Short-cut for hiding an element
     *
     * @returns simpleDOM
     */
    hide: function(){
      this.css('display', 'none');
      return this;
    },
    /**
     * Short-cut for showing a hidden element
     *
     * @returns simpleDOM
     */
    show: function(){
      this.css('display', 'block');
      return this;
    },

    /**
     * Returns the current value of an HTML attribute
     * If second argument provided, it will set the value
     * or remove the attribute if the value is empty.
     *
     * @param attr
     * @returns {string}
     */
    attr: function( attribute, newValue ){
      for( var n = 0, l = this.length; n < l; n++ ){
        if( newValue === undefined && typeof attribute === "string" ){
          return this[n].getAttribute(attribute);
        }

        // Build an array of attributes if not already set
        var attrObj = {};
        if( typeof attribute === "string" ){
          attrObj[attribute] = newValue;
        } else {
          attrObj = attr;
        }

        for( var a in attrObj ){

          var attr = a;
          var value = attrObj[a];

          // Has attribute already?
          var hasAttr = false;
          if( 'hasAttribute' in this[n] ){
            hasAttr = this[n].hasAttribute(attr);
          } else {
            hasAttr = (this[n][attr] !== undefined);
          }
          // Amend/Remove attribute
          if( hasAttr ){
            if( value === '' ){
              this[n].removeAttribute(attr);
            } else {
              this[n].setAttribute(attr,value);
            }
          }
          // Add new attribute
          else {
            var newAttr = document.createAttribute(attr);
            newAttr.value = value;
            this[n].setAttributeNode(newAttr);
          }
        }
      }
      return this;
    },


    /**
     * Append an element to an existing DOM element
     * @param  {Node|simpleDOMEngine} element
     * @return {object}
     */
    append: function( element ){
      var self = this;
      var appendFunc = function(){
        self[n].appendChild( this );
      };
      for( var n = 0, l = this.length; n < l; n++ ){
        if( element instanceof simpleDOMEngine ){
          element.each(appendFunc);
        } else {
          this[n].appendChild( element );
        }
      }
    }
  };

  // map!
  window.simpleDOM = simpleDOM;
  window.$ = window.simpleDOM;

})(this);