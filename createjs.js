var createjs = (this.createjs = (this.createjs || {}));
/*!
* PreloadJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/


//##############################################################################
// version.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	/**
	 * Static class holding library specific information such as the version and buildDate of the library.
	 * @class PreloadJS
	 **/
	var s = createjs.PreloadJS = createjs.PreloadJS || {};

	/**
	 * The version string for this release.
	 * @property version
	 * @type {String}
	 * @static
	 **/
	s.version = /*=version*/"1.0.0"; // injected by build process

	/**
	 * The build date for this release in UTC format.
	 * @property buildDate
	 * @type {String}
	 * @static
	 **/
	s.buildDate = /*=date*/"Thu, 14 Sep 2017 19:47:47 GMT"; // injected by build process

})();

//##############################################################################
// extend.js
//##############################################################################

this.createjs = this.createjs||{};

/**
 * @class Utility Methods
 */

/**
 * Sets up the prototype chain and constructor property for a new class.
 *
 * This should be called right after creating the class constructor.
 *
 * 	function MySubClass() {}
 * 	createjs.extend(MySubClass, MySuperClass);
 * 	MySubClass.prototype.doSomething = function() { }
 *
 * 	var foo = new MySubClass();
 * 	console.log(foo instanceof MySuperClass); // true
 * 	console.log(foo.prototype.constructor === MySubClass); // true
 *
 * @method extend
 * @param {Function} subclass The subclass.
 * @param {Function} superclass The superclass to extend.
 * @return {Function} Returns the subclass's new prototype.
 */
createjs.extend = function(subclass, superclass) {
	"use strict";

	function o() { this.constructor = subclass; }
	o.prototype = superclass.prototype;
	return (subclass.prototype = new o());
};

//##############################################################################
// promote.js
//##############################################################################

this.createjs = this.createjs||{};

/**
 * @class Utility Methods
 */

/**
 * Promotes any methods on the super class that were overridden, by creating an alias in the format `prefix_methodName`.
 * It is recommended to use the super class's name as the prefix.
 * An alias to the super class's constructor is always added in the format `prefix_constructor`.
 * This allows the subclass to call super class methods without using `function.call`, providing better performance.
 *
 * For example, if `MySubClass` extends `MySuperClass`, and both define a `draw` method, then calling `promote(MySubClass, "MySuperClass")`
 * would add a `MySuperClass_constructor` method to MySubClass and promote the `draw` method on `MySuperClass` to the
 * prototype of `MySubClass` as `MySuperClass_draw`.
 *
 * This should be called after the class's prototype is fully defined.
 *
 * 	function ClassA(name) {
 * 		this.name = name;
 * 	}
 * 	ClassA.prototype.greet = function() {
 * 		return "Hello "+this.name;
 * 	}
 *
 * 	function ClassB(name, punctuation) {
 * 		this.ClassA_constructor(name);
 * 		this.punctuation = punctuation;
 * 	}
 * 	createjs.extend(ClassB, ClassA);
 * 	ClassB.prototype.greet = function() {
 * 		return this.ClassA_greet()+this.punctuation;
 * 	}
 * 	createjs.promote(ClassB, "ClassA");
 *
 * 	var foo = new ClassB("World", "!?!");
 * 	console.log(foo.greet()); // Hello World!?!
 *
 * @method promote
 * @param {Function} subclass The class to promote super class methods on.
 * @param {String} prefix The prefix to add to the promoted method names. Usually the name of the superclass.
 * @return {Function} Returns the subclass.
 */
createjs.promote = function(subclass, prefix) {
	"use strict";

	var subP = subclass.prototype, supP = (Object.getPrototypeOf&&Object.getPrototypeOf(subP))||subP.__proto__;
	if (supP) {
		subP[(prefix+="_") + "constructor"] = supP.constructor; // constructor is not always innumerable
		for (var n in supP) {
			if (subP.hasOwnProperty(n) && (typeof supP[n] == "function")) { subP[prefix + n] = supP[n]; }
		}
	}
	return subclass;
};

//##############################################################################
// deprecate.js
//##############################################################################

this.createjs = this.createjs||{};

/**
 * @class Utility Methods
 */

/**
 * Wraps deprecated methods so they still be used, but throw warnings to developers.
 *
 *	obj.deprecatedMethod = createjs.deprecate("Old Method Name", obj._fallbackMethod);
 *
 * The recommended approach for deprecated properties is:
 *
 *	try {
 *		Obj	ect.defineProperties(object, {
 *			readyOnlyProp: { get: createjs.deprecate("readOnlyProp", function() { return this.alternateProp; }) },
 *			readWriteProp: {
 *				get: createjs.deprecate("readOnlyProp", function() { return this.alternateProp; }),
 *				set: createjs.deprecate("readOnlyProp", function(val) { this.alternateProp = val; })
 *		});
 *	} catch (e) {}
 *
 * @method deprecate
 * @param {Function} [fallbackMethod=null] A method to call when the deprecated method is used. See the example for how
 * @param {String} [name=null] The name of the method or property to display in the console warning.
 * to deprecate properties.
 * @return {Function} If a fallbackMethod is supplied, returns a closure that will call the fallback method after
 * logging the warning in the console.
 */
createjs.deprecate = function(fallbackMethod, name) {
	"use strict";
	return function() {
		var msg = "Deprecated property or method '"+name+"'. See docs for info.";
		console && (console.warn ? console.warn(msg) : console.log(msg));
		return fallbackMethod && fallbackMethod.apply(this, arguments);
	}
};

//##############################################################################
// proxy.js
//##############################################################################

this.createjs = this.createjs||{};

/**
 * Various utilities that the CreateJS Suite uses. Utilities are created as separate files, and will be available on the
 * createjs namespace directly.
 *
 * <h4>Example</h4>
 *
 *      myObject.addEventListener("change", createjs.proxy(myMethod, scope));
 *
 * @class Utility Methods
 * @main Utility Methods
 */

(function() {
	"use strict";

	/**
	 * A function proxy for methods. By default, JavaScript methods do not maintain scope, so passing a method as a
	 * callback will result in the method getting called in the scope of the caller. Using a proxy ensures that the
	 * method gets called in the correct scope.
	 *
	 * Additional arguments can be passed that will be applied to the function when it is called.
	 *
	 * <h4>Example</h4>
	 *
	 *      myObject.addEventListener("event", createjs.proxy(myHandler, this, arg1, arg2));
	 *
	 *      function myHandler(arg1, arg2) {
	 *           // This gets called when myObject.myCallback is executed.
	 *      }
	 *
	 * @method proxy
	 * @param {Function} method The function to call
	 * @param {Object} scope The scope to call the method name on
	 * @param {mixed} [arg] * Arguments that are appended to the callback for additional params.
	 * @public
	 * @static
	 */
	createjs.proxy = function (method, scope) {
		var aArgs = Array.prototype.slice.call(arguments, 2);
		return function () {
			return method.apply(scope, Array.prototype.slice.call(arguments, 0).concat(aArgs));
		};
	}

}());

//##############################################################################
// indexOf.js
//##############################################################################

this.createjs = this.createjs||{};

/**
 * @class Utility Methods
 */

/**
 * Finds the first occurrence of a specified value searchElement in the passed in array, and returns the index of
 * that value.  Returns -1 if value is not found.
 *
 *      var i = createjs.indexOf(myArray, myElementToFind);
 *
 * @method indexOf
 * @param {Array} array Array to search for searchElement
 * @param searchElement Element to find in array.
 * @return {Number} The first index of searchElement in array.
 */
createjs.indexOf = function (array, searchElement){
	"use strict";

	for (var i = 0,l=array.length; i < l; i++) {
		if (searchElement === array[i]) {
			return i;
		}
	}
	return -1;
};

//##############################################################################
// Event.js
//##############################################################################

this.createjs = this.createjs||{};

(function() {
	"use strict";

// constructor:
	/**
	 * Contains properties and methods shared by all events for use with
	 * {{#crossLink "EventDispatcher"}}{{/crossLink}}.
	 *
	 * Note that Event objects are often reused, so you should never
	 * rely on an event object's state outside of the call stack it was received in.
	 * @class Event
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/
	function Event(type, bubbles, cancelable) {


	// public properties:
		/**
		 * The type of event.
		 * @property type
		 * @type String
		 **/
		this.type = type;

		/**
		 * The object that generated an event.
		 * @property target
		 * @type Object
		 * @default null
		 * @readonly
		*/
		this.target = null;

		/**
		 * The current target that a bubbling event is being dispatched from. For non-bubbling events, this will
		 * always be the same as target. For example, if childObj.parent = parentObj, and a bubbling event
		 * is generated from childObj, then a listener on parentObj would receive the event with
		 * target=childObj (the original target) and currentTarget=parentObj (where the listener was added).
		 * @property currentTarget
		 * @type Object
		 * @default null
		 * @readonly
		*/
		this.currentTarget = null;

		/**
		 * For bubbling events, this indicates the current event phase:<OL>
		 * 	<LI> capture phase: starting from the top parent to the target</LI>
		 * 	<LI> at target phase: currently being dispatched from the target</LI>
		 * 	<LI> bubbling phase: from the target to the top parent</LI>
		 * </OL>
		 * @property eventPhase
		 * @type Number
		 * @default 0
		 * @readonly
		*/
		this.eventPhase = 0;

		/**
		 * Indicates whether the event will bubble through the display list.
		 * @property bubbles
		 * @type Boolean
		 * @default false
		 * @readonly
		*/
		this.bubbles = !!bubbles;

		/**
		 * Indicates whether the default behaviour of this event can be cancelled via
		 * {{#crossLink "Event/preventDefault"}}{{/crossLink}}. This is set via the Event constructor.
		 * @property cancelable
		 * @type Boolean
		 * @default false
		 * @readonly
		*/
		this.cancelable = !!cancelable;

		/**
		 * The epoch time at which this event was created.
		 * @property timeStamp
		 * @type Number
		 * @default 0
		 * @readonly
		*/
		this.timeStamp = (new Date()).getTime();

		/**
		 * Indicates if {{#crossLink "Event/preventDefault"}}{{/crossLink}} has been called
		 * on this event.
		 * @property defaultPrevented
		 * @type Boolean
		 * @default false
		 * @readonly
		*/
		this.defaultPrevented = false;

		/**
		 * Indicates if {{#crossLink "Event/stopPropagation"}}{{/crossLink}} or
		 * {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called on this event.
		 * @property propagationStopped
		 * @type Boolean
		 * @default false
		 * @readonly
		*/
		this.propagationStopped = false;

		/**
		 * Indicates if {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called
		 * on this event.
		 * @property immediatePropagationStopped
		 * @type Boolean
		 * @default false
		 * @readonly
		*/
		this.immediatePropagationStopped = false;

		/**
		 * Indicates if {{#crossLink "Event/remove"}}{{/crossLink}} has been called on this event.
		 * @property removed
		 * @type Boolean
		 * @default false
		 * @readonly
		*/
		this.removed = false;
	}
	var p = Event.prototype;

// public methods:
	/**
	 * Sets {{#crossLink "Event/defaultPrevented"}}{{/crossLink}} to true if the event is cancelable.
	 * Mirrors the DOM level 2 event standard. In general, cancelable events that have `preventDefault()` called will
	 * cancel the default behaviour associated with the event.
	 * @method preventDefault
	 **/
	p.preventDefault = function() {
		this.defaultPrevented = this.cancelable&&true;
	};

	/**
	 * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} to true.
	 * Mirrors the DOM event standard.
	 * @method stopPropagation
	 **/
	p.stopPropagation = function() {
		this.propagationStopped = true;
	};

	/**
	 * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} and
	 * {{#crossLink "Event/immediatePropagationStopped"}}{{/crossLink}} to true.
	 * Mirrors the DOM event standard.
	 * @method stopImmediatePropagation
	 **/
	p.stopImmediatePropagation = function() {
		this.immediatePropagationStopped = this.propagationStopped = true;
	};

	/**
	 * Causes the active listener to be removed via removeEventListener();
	 *
	 * 		myBtn.addEventListener("click", function(evt) {
	 * 			// do stuff...
	 * 			evt.remove(); // removes this listener.
	 * 		});
	 *
	 * @method remove
	 **/
	p.remove = function() {
		this.removed = true;
	};

	/**
	 * Returns a clone of the Event instance.
	 * @method clone
	 * @return {Event} a clone of the Event instance.
	 **/
	p.clone = function() {
		return new Event(this.type, this.bubbles, this.cancelable);
	};

	/**
	 * Provides a chainable shortcut method for setting a number of properties on the instance.
	 *
	 * @method set
	 * @param {Object} props A generic object containing properties to copy to the instance.
	 * @return {Event} Returns the instance the method is called on (useful for chaining calls.)
	 * @chainable
	*/
	p.set = function(props) {
		for (var n in props) { this[n] = props[n]; }
		return this;
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Event (type="+this.type+")]";
	};

	createjs.Event = Event;
}());

//##############################################################################
// ErrorEvent.js
//##############################################################################

this.createjs = this.createjs||{};

(function() {
	"use strict";

	/**
	 * A general error {{#crossLink "Event"}}{{/crossLink}}, that describes an error that occurred, as well as any details.
	 * @class ErrorEvent
	 * @param {String} [title] The error title
	 * @param {String} [message] The error description
	 * @param {Object} [data] Additional error data
	 * @constructor
	 */
	function ErrorEvent(title, message, data) {
		this.Event_constructor("error");

		/**
		 * The short error title, which indicates the type of error that occurred.
		 * @property title
		 * @type String
		 */
		this.title = title;

		/**
		 * The verbose error message, containing details about the error.
		 * @property message
		 * @type String
		 */
		this.message = message;

		/**
		 * Additional data attached to an error.
		 * @property data
		 * @type {Object}
		 */
		this.data = data;
	}

	var p = createjs.extend(ErrorEvent, createjs.Event);

	p.clone = function() {
		return new createjs.ErrorEvent(this.title, this.message, this.data);
	};

	createjs.ErrorEvent = createjs.promote(ErrorEvent, "Event");

}());

//##############################################################################
// EventDispatcher.js
//##############################################################################

this.createjs = this.createjs||{};

(function() {
	"use strict";


// constructor:
	/**
	 * EventDispatcher provides methods for managing queues of event listeners and dispatching events.
	 *
	 * You can either extend EventDispatcher or mix its methods into an existing prototype or instance by using the
	 * EventDispatcher {{#crossLink "EventDispatcher/initialize"}}{{/crossLink}} method.
	 *
	 * Together with the CreateJS Event class, EventDispatcher provides an extended event model that is based on the
	 * DOM Level 2 event model, including addEventListener, removeEventListener, and dispatchEvent. It supports
	 * bubbling / capture, preventDefault, stopPropagation, stopImmediatePropagation, and handleEvent.
	 *
	 * EventDispatcher also exposes a {{#crossLink "EventDispatcher/on"}}{{/crossLink}} method, which makes it easier
	 * to create scoped listeners, listeners that only run once, and listeners with associated arbitrary data. The
	 * {{#crossLink "EventDispatcher/off"}}{{/crossLink}} method is merely an alias to
	 * {{#crossLink "EventDispatcher/removeEventListener"}}{{/crossLink}}.
	 *
	 * Another addition to the DOM Level 2 model is the {{#crossLink "EventDispatcher/removeAllEventListeners"}}{{/crossLink}}
	 * method, which can be used to listeners for all events, or listeners for a specific event. The Event object also
	 * includes a {{#crossLink "Event/remove"}}{{/crossLink}} method which removes the active listener.
	 *
	 * <h4>Example</h4>
	 * Add EventDispatcher capabilities to the "MyClass" class.
	 *
	 *      EventDispatcher.initialize(MyClass.prototype);
	 *
	 * Add an event (see {{#crossLink "EventDispatcher/addEventListener"}}{{/crossLink}}).
	 *
	 *      instance.addEventListener("eventName", handlerMethod);
	 *      function handlerMethod(event) {
	 *          console.log(event.target + " Was Clicked");
	 *      }
	 *
	 * <b>Maintaining proper scope</b><br />
	 * Scope (ie. "this") can be be a challenge with events. Using the {{#crossLink "EventDispatcher/on"}}{{/crossLink}}
	 * method to subscribe to events simplifies this.
	 *
	 *      instance.addEventListener("click", function(event) {
	 *          console.log(instance == this); // false, scope is ambiguous.
	 *      });
	 *
	 *      instance.on("click", function(event) {
	 *          console.log(instance == this); // true, "on" uses dispatcher scope by default.
	 *      });
	 *
	 * If you want to use addEventListener instead, you may want to use function.bind() or a similar proxy to manage
	 * scope.
	 *
	 * <b>Browser support</b>
	 * The event model in CreateJS can be used separately from the suite in any project, however the inheritance model
	 * requires modern browsers (IE9+).
	 *
	 *
	 * @class EventDispatcher
	 * @constructor
	 **/
	function EventDispatcher() {


	// private properties:
		/**
		 * @protected
		 * @property _listeners
		 * @type Object
		 **/
		this._listeners = null;

		/**
		 * @protected
		 * @property _captureListeners
		 * @type Object
		 **/
		this._captureListeners = null;
	}
	var p = EventDispatcher.prototype;

// static public methods:
	/**
	 * Static initializer to mix EventDispatcher methods into a target object or prototype.
	 *
	 * 		EventDispatcher.initialize(MyClass.prototype); // add to the prototype of the class
	 * 		EventDispatcher.initialize(myObject); // add to a specific instance
	 *
	 * @method initialize
	 * @static
	 * @param {Object} target The target object to inject EventDispatcher methods into. This can be an instance or a
	 * prototype.
	 **/
	EventDispatcher.initialize = function(target) {
		target.addEventListener = p.addEventListener;
		target.on = p.on;
		target.removeEventListener = target.off =  p.removeEventListener;
		target.removeAllEventListeners = p.removeAllEventListeners;
		target.hasEventListener = p.hasEventListener;
		target.dispatchEvent = p.dispatchEvent;
		target._dispatchEvent = p._dispatchEvent;
		target.willTrigger = p.willTrigger;
	};


// public methods:
	/**
	 * Adds the specified event listener. Note that adding multiple listeners to the same function will result in
	 * multiple callbacks getting fired.
	 *
	 * <h4>Example</h4>
	 *
	 *      displayObject.addEventListener("click", handleClick);
	 *      function handleClick(event) {
	 *         // Click happened.
	 *      }
	 *
	 * @method addEventListener
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when
	 * the event is dispatched.
	 * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 * @return {Function | Object} Returns the listener for chaining or assignment.
	 **/
	p.addEventListener = function(type, listener, useCapture) {
		var listeners;
		if (useCapture) {
			listeners = this._captureListeners = this._captureListeners||{};
		} else {
			listeners = this._listeners = this._listeners||{};
		}
		var arr = listeners[type];
		if (arr) { this.removeEventListener(type, listener, useCapture); }
		arr = listeners[type]; // remove may have deleted the array
		if (!arr) { listeners[type] = [listener];  }
		else { arr.push(listener); }
		return listener;
	};

	/**
	 * A shortcut method for using addEventListener that makes it easier to specify an execution scope, have a listener
	 * only run once, associate arbitrary data with the listener, and remove the listener.
	 *
	 * This method works by creating an anonymous wrapper function and subscribing it with addEventListener.
	 * The wrapper function is returned for use with `removeEventListener` (or `off`).
	 *
	 * <b>IMPORTANT:</b> To remove a listener added with `on`, you must pass in the returned wrapper function as the listener, or use
	 * {{#crossLink "Event/remove"}}{{/crossLink}}. Likewise, each time you call `on` a NEW wrapper function is subscribed, so multiple calls
	 * to `on` with the same params will create multiple listeners.
	 *
	 * <h4>Example</h4>
	 *
	 * 		var listener = myBtn.on("click", handleClick, null, false, {count:3});
	 * 		function handleClick(evt, data) {
	 * 			data.count -= 1;
	 * 			console.log(this == myBtn); // true - scope defaults to the dispatcher
	 * 			if (data.count == 0) {
	 * 				alert("clicked 3 times!");
	 * 				myBtn.off("click", listener);
	 * 				// alternately: evt.remove();
	 * 			}
	 * 		}
	 *
	 * @method on
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when
	 * the event is dispatched.
	 * @param {Object} [scope] The scope to execute the listener in. Defaults to the dispatcher/currentTarget for function listeners, and to the listener itself for object listeners (ie. using handleEvent).
	 * @param {Boolean} [once=false] If true, the listener will remove itself after the first time it is triggered.
	 * @param {*} [data] Arbitrary data that will be included as the second parameter when the listener is called.
	 * @param {Boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 * @return {Function} Returns the anonymous function that was created and assigned as the listener. This is needed to remove the listener later using .removeEventListener.
	 **/
	p.on = function(type, listener, scope, once, data, useCapture) {
		if (listener.handleEvent) {
			scope = scope||listener;
			listener = listener.handleEvent;
		}
		scope = scope||this;
		return this.addEventListener(type, function(evt) {
				listener.call(scope, evt, data);
				once&&evt.remove();
			}, useCapture);
	};

	/**
	 * Removes the specified event listener.
	 *
	 * <b>Important Note:</b> that you must pass the exact function reference used when the event was added. If a proxy
	 * function, or function closure is used as the callback, the proxy/closure reference must be used - a new proxy or
	 * closure will not work.
	 *
	 * <h4>Example</h4>
	 *
	 *      displayObject.removeEventListener("click", handleClick);
	 *
	 * @method removeEventListener
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener The listener function or object.
	 * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 **/
	p.removeEventListener = function(type, listener, useCapture) {
		var listeners = useCapture ? this._captureListeners : this._listeners;
		if (!listeners) { return; }
		var arr = listeners[type];
		if (!arr) { return; }
		for (var i=0,l=arr.length; i<l; i++) {
			if (arr[i] == listener) {
				if (l==1) { delete(listeners[type]); } // allows for faster checks.
				else { arr.splice(i,1); }
				break;
			}
		}
	};

	/**
	 * A shortcut to the removeEventListener method, with the same parameters and return value. This is a companion to the
	 * .on method.
	 *
	 * <b>IMPORTANT:</b> To remove a listener added with `on`, you must pass in the returned wrapper function as the listener. See
	 * {{#crossLink "EventDispatcher/on"}}{{/crossLink}} for an example.
	 *
	 * @method off
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener The listener function or object.
	 * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 **/
	p.off = p.removeEventListener;

	/**
	 * Removes all listeners for the specified type, or all listeners of all types.
	 *
	 * <h4>Example</h4>
	 *
	 *      // Remove all listeners
	 *      displayObject.removeAllEventListeners();
	 *
	 *      // Remove all click listeners
	 *      displayObject.removeAllEventListeners("click");
	 *
	 * @method removeAllEventListeners
	 * @param {String} [type] The string type of the event. If omitted, all listeners for all types will be removed.
	 **/
	p.removeAllEventListeners = function(type) {
		if (!type) { this._listeners = this._captureListeners = null; }
		else {
			if (this._listeners) { delete(this._listeners[type]); }
			if (this._captureListeners) { delete(this._captureListeners[type]); }
		}
	};

	/**
	 * Dispatches the specified event to all listeners.
	 *
	 * <h4>Example</h4>
	 *
	 *      // Use a string event
	 *      this.dispatchEvent("complete");
	 *
	 *      // Use an Event instance
	 *      var event = new createjs.Event("progress");
	 *      this.dispatchEvent(event);
	 *
	 * @method dispatchEvent
	 * @param {Object | String | Event} eventObj An object with a "type" property, or a string type.
	 * While a generic object will work, it is recommended to use a CreateJS Event instance. If a string is used,
	 * dispatchEvent will construct an Event instance if necessary with the specified type. This latter approach can
	 * be used to avoid event object instantiation for non-bubbling events that may not have any listeners.
	 * @param {Boolean} [bubbles] Specifies the `bubbles` value when a string was passed to eventObj.
	 * @param {Boolean} [cancelable] Specifies the `cancelable` value when a string was passed to eventObj.
	 * @return {Boolean} Returns false if `preventDefault()` was called on a cancelable event, true otherwise.
	 **/
	p.dispatchEvent = function(eventObj, bubbles, cancelable) {
		if (typeof eventObj == "string") {
			// skip everything if there's no listeners and it doesn't bubble:
			var listeners = this._listeners;
			if (!bubbles && (!listeners || !listeners[eventObj])) { return true; }
			eventObj = new createjs.Event(eventObj, bubbles, cancelable);
		} else if (eventObj.target && eventObj.clone) {
			// redispatching an active event object, so clone it:
			eventObj = eventObj.clone();
		}

		// TODO: it would be nice to eliminate this. Maybe in favour of evtObj instanceof Event? Or !!evtObj.createEvent
		try { eventObj.target = this; } catch (e) {} // try/catch allows redispatching of native events

		if (!eventObj.bubbles || !this.parent) {
			this._dispatchEvent(eventObj, 2);
		} else {
			var top=this, list=[top];
			while (top.parent) { list.push(top = top.parent); }
			var i, l=list.length;

			// capture & atTarget
			for (i=l-1; i>=0 && !eventObj.propagationStopped; i--) {
				list[i]._dispatchEvent(eventObj, 1+(i==0));
			}
			// bubbling
			for (i=1; i<l && !eventObj.propagationStopped; i++) {
				list[i]._dispatchEvent(eventObj, 3);
			}
		}
		return !eventObj.defaultPrevented;
	};

	/**
	 * Indicates whether there is at least one listener for the specified event type.
	 * @method hasEventListener
	 * @param {String} type The string type of the event.
	 * @return {Boolean} Returns true if there is at least one listener for the specified event.
	 **/
	p.hasEventListener = function(type) {
		var listeners = this._listeners, captureListeners = this._captureListeners;
		return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
	};

	/**
	 * Indicates whether there is at least one listener for the specified event type on this object or any of its
	 * ancestors (parent, parent's parent, etc). A return value of true indicates that if a bubbling event of the
	 * specified type is dispatched from this object, it will trigger at least one listener.
	 *
	 * This is similar to {{#crossLink "EventDispatcher/hasEventListener"}}{{/crossLink}}, but it searches the entire
	 * event flow for a listener, not just this object.
	 * @method willTrigger
	 * @param {String} type The string type of the event.
	 * @return {Boolean} Returns `true` if there is at least one listener for the specified event.
	 **/
	p.willTrigger = function(type) {
		var o = this;
		while (o) {
			if (o.hasEventListener(type)) { return true; }
			o = o.parent;
		}
		return false;
	};

	/**
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[EventDispatcher]";
	};


// private methods:
	/**
	 * @method _dispatchEvent
	 * @param {Object | Event} eventObj
	 * @param {Object} eventPhase
	 * @protected
	 **/
	p._dispatchEvent = function(eventObj, eventPhase) {
		var l, arr, listeners = (eventPhase <= 2) ? this._captureListeners : this._listeners;
		if (eventObj && listeners && (arr = listeners[eventObj.type]) && (l=arr.length)) {
			try { eventObj.currentTarget = this; } catch (e) {}
			try { eventObj.eventPhase = eventPhase|0; } catch (e) {}
			eventObj.removed = false;

			arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
			for (var i=0; i<l && !eventObj.immediatePropagationStopped; i++) {
				var o = arr[i];
				if (o.handleEvent) { o.handleEvent(eventObj); }
				else { o(eventObj); }
				if (eventObj.removed) {
					this.off(eventObj.type, o, eventPhase==1);
					eventObj.removed = false;
				}
			}
		}
		if (eventPhase === 2) { this._dispatchEvent(eventObj, 2.1); }
	};


	createjs.EventDispatcher = EventDispatcher;
}());

//##############################################################################
// ProgressEvent.js
//##############################################################################

this.createjs = this.createjs || {};

(function (scope) {
	"use strict";

	// constructor
	/**
	 * A CreateJS {{#crossLink "Event"}}{{/crossLink}} that is dispatched when progress changes.
	 * @class ProgressEvent
	 * @param {Number} loaded The amount that has been loaded. This can be any number relative to the total.
	 * @param {Number} [total=1] The total amount that will load. This will default to 1, so if the `loaded` value is
	 * a percentage (between 0 and 1), it can be omitted.
	 * @todo Consider having this event be a "fileprogress" event as well
	 * @constructor
	 */
	function ProgressEvent(loaded, total) {
		this.Event_constructor("progress");

		/**
		 * The amount that has been loaded (out of a total amount)
		 * @property loaded
		 * @type {Number}
		 */
		this.loaded = loaded;

		/**
		 * The total "size" of the load.
		 * @property total
		 * @type {Number}
		 * @default 1
		 */
		this.total = (total == null) ? 1 : total;

		/**
		 * The percentage (out of 1) that the load has been completed. This is calculated using `loaded/total`.
		 * @property progress
		 * @type {Number}
		 * @default 0
		 */
		this.progress = (total == 0) ? 0 : this.loaded / this.total;
	};

	var p = createjs.extend(ProgressEvent, createjs.Event);

	/**
	 * Returns a clone of the ProgressEvent instance.
	 * @method clone
	 * @return {ProgressEvent} a clone of the Event instance.
	 **/
	p.clone = function() {
		return new createjs.ProgressEvent(this.loaded, this.total);
	};

	createjs.ProgressEvent = createjs.promote(ProgressEvent, "Event");

}(window));

//##############################################################################
// json3.js
//##############################################################################

/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function () {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof define === "function" && define.amd;

  // A set of types used to distinguish objects from primitives.
  var objectTypes = {
    "function": true,
    "object": true
  };

  // Detect the `exports` object exposed by CommonJS implementations.
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context,
  // and the `window` object in browsers. Rhino exports a `global` function
  // instead.
  var root = objectTypes[typeof window] && window || this,
      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root["Object"]());
    exports || (exports = root["Object"]());

    // Native constructor aliases.
    var Number = context["Number"] || root["Number"],
        String = context["String"] || root["String"],
        Object = context["Object"] || root["Object"],
        Date = context["Date"] || root["Date"],
        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
        TypeError = context["TypeError"] || root["TypeError"],
        Math = context["Math"] || root["Math"],
        nativeJSON = context["JSON"] || root["JSON"];

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty, forEach, undef;

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    try {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        // Safari < 2.0.2 stores the internal millisecond time value correctly,
        // but clips the values returned by the date methods to the range of
        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    } catch (exception) {}

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] !== undef) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("json-parse");
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            try {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undef &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undef) === undef &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undef &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undef]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undef, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
            } catch (exception) {
              stringifySupported = false;
            }
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse;
          if (typeof parse == "function") {
            try {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  try {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  } catch (exception) {}
                  if (parseSupported) {
                    try {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    } catch (exception) {}
                  }
                  if (parseSupported) {
                    try {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    } catch (exception) {}
                  }
                }
              }
            } catch (exception) {
              parseSupported = false;
            }
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Define additional utility methods if the `Date` methods are buggy.
      if (!isExtended) {
        var floor = Math.floor;
        // A mapping between the months of the year and the number of days between
        // January 1st and the first of the respective month.
        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        // Internal: Calculates the number of days between the Unix epoch and the
        // first day of the given month.
        var getDay = function (year, month) {
          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
        };
      }

      // Internal: Determines if a property is a direct property of the given
      // object. Delegates to the native `Object#hasOwnProperty` method.
      if (!(isProperty = objectProto.hasOwnProperty)) {
        isProperty = function (property) {
          var members = {}, constructor;
          if ((members.__proto__ = null, members.__proto__ = {
            // The *proto* property cannot be set multiple times in recent
            // versions of Firefox and SeaMonkey.
            "toString": 1
          }, members).toString != getClass) {
            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
            // supports the mutable *proto* property.
            isProperty = function (property) {
              // Capture and break the object's prototype chain (see section 8.6.2
              // of the ES 5.1 spec). The parenthesized expression prevents an
              // unsafe transformation by the Closure Compiler.
              var original = this.__proto__, result = property in (this.__proto__ = null, this);
              // Restore the original prototype chain.
              this.__proto__ = original;
              return result;
            };
          } else {
            // Capture a reference to the top-level `Object` constructor.
            constructor = members.constructor;
            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
            // other environments.
            isProperty = function (property) {
              var parent = (this.constructor || constructor).prototype;
              return property in this && !(property in parent && this[property] === parent[property]);
            };
          }
          members = null;
          return isProperty.call(this, property);
        };
      }

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      forEach = function (object, callback) {
        var size = 0, Properties, members, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        members = new Properties();
        for (property in members) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(members, property)) {
            size++;
          }
        }
        Properties = members = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
          };
        } else if (size == 2) {
          // Safari <= 2.0.4 enumerates shadowed properties twice.
          forEach = function (object, callback) {
            // Create a set of iterated properties.
            var members = {}, isFunction = getClass.call(object) == functionClass, property;
            for (property in object) {
              // Store each property name to prevent double enumeration. The
              // `prototype` property of functions is not enumerated due to cross-
              // environment inconsistencies.
              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forEach(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Double-quotes a string `value`, replacing all ASCII control
        // characters (characters with code unit values between 0 and 31) with
        // their escaped equivalents. This is an implementation of the
        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
        var unicodePrefix = "\\u00";
        var quote = function (value) {
          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
          for (; index < length; index++) {
            var charCode = value.charCodeAt(index);
            // If the character is a control character, append its Unicode or
            // shorthand escape sequence; otherwise, append the character as-is.
            switch (charCode) {
              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                result += Escapes[charCode];
                break;
              default:
                if (charCode < 32) {
                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                  break;
                }
                result += useCharIndex ? symbols[index] : value.charAt(index);
            }
          }
          return result + '"';
        };

        // Internal: Recursively serializes an object. Implements the
        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
          try {
            // Necessary for host object support.
            value = object[property];
          } catch (exception) {}
          if (typeof value == "object" && value) {
            className = getClass.call(value);
            if (className == dateClass && !isProperty.call(value, "toJSON")) {
              if (value > -1 / 0 && value < 1 / 0) {
                // Dates are serialized according to the `Date#toJSON` method
                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                // for the ISO 8601 date time string format.
                if (getDay) {
                  // Manually compute the year, month, date, hours, minutes,
                  // seconds, and milliseconds if the `getUTC*` methods are
                  // buggy. Adapted from @Yaffle's `date-shim` project.
                  date = floor(value / 864e5);
                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                  date = 1 + date - getDay(year, month);
                  // The `time` value specifies the time within the day (see ES
                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                  // to compute `A modulo B`, as the `%` operator does not
                  // correspond to the `modulo` operation for negative numbers.
                  time = (value % 864e5 + 864e5) % 864e5;
                  // The hours, minutes, seconds, and milliseconds are obtained by
                  // decomposing the time within the day. See section 15.9.1.10.
                  hours = floor(time / 36e5) % 24;
                  minutes = floor(time / 6e4) % 60;
                  seconds = floor(time / 1e3) % 60;
                  milliseconds = time % 1e3;
                } else {
                  year = value.getUTCFullYear();
                  month = value.getUTCMonth();
                  date = value.getUTCDate();
                  hours = value.getUTCHours();
                  minutes = value.getUTCMinutes();
                  seconds = value.getUTCSeconds();
                  milliseconds = value.getUTCMilliseconds();
                }
                // Serialize extended years correctly.
                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                  // Months, dates, hours, minutes, and seconds should have two
                  // digits; milliseconds should have three.
                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                  // Milliseconds are optional in ES 5.0, but required in 5.1.
                  "." + toPaddedString(3, milliseconds) + "Z";
              } else {
                value = null;
              }
            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
              // ignores all `toJSON` methods on these objects unless they are
              // defined directly on an instance.
              value = value.toJSON(property);
            }
          }
          if (callback) {
            // If a replacement function was provided, call it to obtain the value
            // for serialization.
            value = callback.call(object, property, value);
          }
          if (value === null) {
            return "null";
          }
          className = getClass.call(value);
          if (className == booleanClass) {
            // Booleans are represented literally.
            return "" + value;
          } else if (className == numberClass) {
            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
            // `"null"`.
            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
          } else if (className == stringClass) {
            // Strings are double-quoted and escaped.
            return quote("" + value);
          }
          // Recursively serialize objects and arrays.
          if (typeof value == "object") {
            // Check for cyclic structures. This is a linear search; performance
            // is inversely proportional to the number of unique nested objects.
            for (length = stack.length; length--;) {
              if (stack[length] === value) {
                // Cyclic structures cannot be serialized by `JSON.stringify`.
                throw TypeError();
              }
            }
            // Add the object to the stack of traversed objects.
            stack.push(value);
            results = [];
            // Save the current indentation level and indent one additional level.
            prefix = indentation;
            indentation += whitespace;
            if (className == arrayClass) {
              // Recursively serialize array elements.
              for (index = 0, length = value.length; index < length; index++) {
                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                results.push(element === undef ? "null" : element);
              }
              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
            } else {
              // Recursively serialize object members. Members are selected from
              // either a user-specified list of property names, or the object
              // itself.
              forEach(properties || value, function (property) {
                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                if (element !== undef) {
                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                  // is not the empty string, let `member` {quote(property) + ":"}
                  // be the concatenation of `member` and the `space` character."
                  // The "`space` character" refers to the literal space
                  // character, not the `space` {width} argument provided to
                  // `JSON.stringify`.
                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                }
              });
              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
            }
            // Remove the object from the traversed object stack.
            stack.pop();
            return result;
          }
        };

        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
        exports.stringify = function (source, filter, width) {
          var whitespace, callback, properties, className;
          if (objectTypes[typeof filter] && filter) {
            if ((className = getClass.call(filter)) == functionClass) {
              callback = filter;
            } else if (className == arrayClass) {
              // Convert the property names array into a makeshift set.
              properties = {};
              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
            }
          }
          if (width) {
            if ((className = getClass.call(width)) == numberClass) {
              // Convert the `width` to an integer and create a string containing
              // `width` number of space characters.
              if ((width -= width % 1) > 0) {
                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
              }
            } else if (className == stringClass) {
              whitespace = width.length <= 10 ? width : width.slice(0, 10);
            }
          }
          // Opera <= 7.54u2 discards the values associated with empty string keys
          // (`""`) only if they are used directly within an object member list
          // (e.g., `!("" in { "": 1})`).
          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
        };
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "/",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                if (source.slice(Index, Index + 4) == "true") {
                  Index += 4;
                  return true;
                } else if (source.slice(Index, Index + 5) == "false") {
                  Index += 5;
                  return false;
                } else if (source.slice(Index, Index + 4) == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undef) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forEach` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(value, length, callback);
              }
            } else {
              forEach(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports["runInContext"] = runInContext;
    return exports;
  }

  if (freeExports && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, freeExports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON,
        previousJSON = root["JSON3"],
        isRestored = false;

    var JSON3 = runInContext(root, (root["JSON3"] = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        if (!isRestored) {
          isRestored = true;
          root.JSON = nativeJSON;
          root["JSON3"] = previousJSON;
          nativeJSON = previousJSON = null;
        }
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    define(function () {
      return JSON3;
    });
  }
}).call(this);

//##############################################################################
// Elements.js
//##############################################################################

(function () {

	/**
	 * Convenience methods for creating various elements used by PrelaodJS.
	 *
	 * @class DomUtils
	 */
	var s = {};

	s.a = function() {
		return s.el("a");
	}

	s.svg = function() {
		return s.el("svg");
	}

	s.object = function() {
		return s.el("object");
	}

	s.image = function() {
		return s.el("image");
	}

	s.img = function() {
		return s.el("img");
	}

	s.style = function() {
		return s.el("style");
	}

	s.link = function() {
		return s.el("link");
	}

	s.script = function() {
		return s.el("script");
	}

	s.audio = function() {
		return s.el("audio");
	}

	s.video = function() {
		return s.el("video");
	}

	s.text = function(value) {
		return document.createTextNode(value);
	}

	s.el = function(name) {
		return document.createElement(name);
	}

	createjs.Elements = s;

}());

//##############################################################################
// URLUtils.js
//##############################################################################

(function () {

	/**
	 * Utilities that assist with parsing load items, and determining file types, etc.
	 * @class URLUtils
	 */
	var s = {};

	/**
	 * The Regular Expression used to test file URLS for an absolute path.
	 * @property ABSOLUTE_PATH
	 * @type {RegExp}
	 * @static
	 */
	s.ABSOLUTE_PATT = /^(?:\w+:)?\/{2}/i;

	/**
	 * The Regular Expression used to test file URLS for a relative path.
	 * @property RELATIVE_PATH
	 * @type {RegExp}
	 * @static
	 */
	s.RELATIVE_PATT = (/^[./]*?\//i);

	/**
	 * The Regular Expression used to test file URLS for an extension. Note that URIs must already have the query string
	 * removed.
	 * @property EXTENSION_PATT
	 * @type {RegExp}
	 * @static
	 */
	s.EXTENSION_PATT = /\/?[^/]+\.(\w{1,5})$/i;

	/**
	 * Parse a file path to determine the information we need to work with it. Currently, PreloadJS needs to know:
	 * <ul>
	 *     <li>If the path is absolute. Absolute paths start with a protocol (such as `http://`, `file://`, or
	 *     `//networkPath`)</li>
	 *     <li>If the path is relative. Relative paths start with `../` or `/path` (or similar)</li>
	 *     <li>The file extension. This is determined by the filename with an extension. Query strings are dropped, and
	 *     the file path is expected to follow the format `name.ext`.</li>
	 * </ul>
	 *
	 * @method parseURI
	 * @param {String} path
	 * @returns {Object} An Object with an `absolute` and `relative` Boolean values,
	 * 	the pieces of the path (protocol, hostname, port, pathname, search, hash, host)
	 * 	as well as an optional 'extension` property, which is the lowercase extension.
	 *
	 * @static
	 */
	s.parseURI = function (path) {
		var info = {
			absolute: false,
			relative: false,
			protocol: null,
			hostname: null,
			port: null,
			pathname: null,
			search: null,
			hash: null,
			host: null
		};

		if (path == null) { return info; }

		// Inject the path parts.
		var parser = createjs.Elements.a();
		parser.href = path;

		for (var n in info) {
			if (n in parser) {
				info[n] = parser[n];
			}
		}

		// Drop the query string
		var queryIndex = path.indexOf("?");
		if (queryIndex > -1) {
			path = path.substr(0, queryIndex);
		}

		// Absolute
		var match;
		if (s.ABSOLUTE_PATT.test(path)) {
			info.absolute = true;

			// Relative
		} else if (s.RELATIVE_PATT.test(path)) {
			info.relative = true;
		}

		// Extension
		if (match = path.match(s.EXTENSION_PATT)) {
			info.extension = match[1].toLowerCase();
		}

		return info;
	};

	/**
	 * Formats an object into a query string for either a POST or GET request.
	 * @method formatQueryString
	 * @param {Object} data The data to convert to a query string.
	 * @param {Array} [query] Existing name/value pairs to append on to this query.
	 * @static
	 */
	s.formatQueryString = function (data, query) {
		if (data == null) {
			throw new Error("You must specify data.");
		}
		var params = [];
		for (var n in data) {
			params.push(n + "=" + escape(data[n]));
		}
		if (query) {
			params = params.concat(query);
		}
		return params.join("&");
	};

	/**
	 * A utility method that builds a file path using a source and a data object, and formats it into a new path.
	 * @method buildURI
	 * @param {String} src The source path to add values to.
	 * @param {Object} [data] Object used to append values to this request as a query string. Existing parameters on the
	 * path will be preserved.
	 * @returns {string} A formatted string that contains the path and the supplied parameters.
	 * @static
	 */
	s.buildURI = function (src, data) {
		if (data == null) {
			return src;
		}

		var query = [];
		var idx = src.indexOf("?");

		if (idx != -1) {
			var q = src.slice(idx + 1);
			query = query.concat(q.split("&"));
		}

		if (idx != -1) {
			return src.slice(0, idx) + "?" + this.formatQueryString(data, query);
		} else {
			return src + "?" + this.formatQueryString(data, query);
		}
	};

	/**
	 * @method isCrossDomain
	 * @param {LoadItem|Object} item A load item with a `src` property.
	 * @return {Boolean} If the load item is loading from a different domain than the current location.
	 * @static
	 */
	s.isCrossDomain = function (item) {
		var target = createjs.Elements.a();
		target.href = item.src;

		var host = createjs.Elements.a();
		host.href = location.href;

		var crossdomain = (target.hostname != "") &&
			(target.port != host.port ||
			target.protocol != host.protocol ||
			target.hostname != host.hostname);
		return crossdomain;
	};

	/**
	 * @method isLocal
	 * @param {LoadItem|Object} item A load item with a `src` property
	 * @return {Boolean} If the load item is loading from the "file:" protocol. Assume that the host must be local as
	 * well.
	 * @static
	 */
	s.isLocal = function (item) {
		var target = createjs.Elements.a();
		target.href = item.src;
		return target.hostname == "" && target.protocol == "file:";
	};

	createjs.URLUtils = s;

}());

//##############################################################################
// DomUtils.js
//##############################################################################

(function () {

	/**
	 * A few utilities for interacting with the dom.
	 * @class DomUtils
	 */
	var s = {
		container: null
	};

	s.appendToHead = function (el) {
		s.getHead().appendChild(el);
	}

	s.appendToBody = function (el) {
		if (s.container == null) {
			s.container = document.createElement("div");
			s.container.id = "preloadjs-container";
			var style = s.container.style;
			style.visibility = "hidden";
			style.position = "absolute";
			style.width = s.container.style.height = "10px";
			style.overflow = "hidden";
			style.transform = style.msTransform = style.webkitTransform = style.oTransform = "translate(-10px, -10px)"; //LM: Not working
			s.getBody().appendChild(s.container);
		}
		s.container.appendChild(el);
	}

	s.getHead = function () {
		return document.head || document.getElementsByTagName("head")[0];
	}

	s.getBody = function () {
		return document.body || document.getElementsByTagName("body")[0];
	}

	s.removeChild = function(el) {
		if (el.parent) {
			el.parent.removeChild(el);
		}
	}

	/**
	 * Check if item is a valid HTMLImageElement
	 * @method isImageTag
	 * @param {Object} item
	 * @returns {Boolean}
	 * @static
	 */
	s.isImageTag = function(item) {
		return item instanceof HTMLImageElement;
	};

	/**
	 * Check if item is a valid HTMLAudioElement
	 * @method isAudioTag
	 * @param {Object} item
	 * @returns {Boolean}
	 * @static
	 */
	s.isAudioTag = function(item) {
		if (window.HTMLAudioElement) {
			return item instanceof HTMLAudioElement;
		} else {
			return false;
		}
	};

	/**
	 * Check if item is a valid HTMLVideoElement
	 * @method isVideoTag
	 * @param {Object} item
	 * @returns {Boolean}
	 * @static
	 */
	s.isVideoTag = function(item) {
		if (window.HTMLVideoElement) {
			return item instanceof HTMLVideoElement;
		} else {
			return false;
		}
	};

	createjs.DomUtils = s;

}());

//##############################################################################
// DataUtils.js
//##############################################################################

(function () {

	/**
	 * A few data utilities for formatting different data types.
	 * @class DataUtils
	 */
	var s = {};

	// static methods
	/**
	 * Parse XML using the DOM. This is required when preloading XML or SVG.
	 * @method parseXML
	 * @param {String} text The raw text or XML that is loaded by XHR.
	 * @return {XML} An XML document
	 * @static
	 */
	s.parseXML = function (text) {
		var xml = null;
		// CocoonJS does not support XML parsing with either method.

		// Most browsers will use DOMParser
		// IE fails on certain SVG files, so we have a fallback below.
		try {
			if (window.DOMParser) {
				var parser = new DOMParser();
				xml = parser.parseFromString(text, "text/xml");
			}
		} catch (e) {
		}

		// Fallback for IE support.
		if (!xml) {
			try {
				xml = new ActiveXObject("Microsoft.XMLDOM");
				xml.async = false;
				xml.loadXML(text);
			} catch (e) {
				xml = null;
			}
		}

		return xml;
	};

	/**
	 * Parse a string into an Object.
	 * @method parseJSON
	 * @param {String} value The loaded JSON string
	 * @returns {Object} A JavaScript object.
	 */
	s.parseJSON = function (value) {
		if (value == null) {
			return null;
		}

		try {
			return JSON.parse(value);
		} catch (e) {
			// TODO; Handle this with a custom error?
			throw e;
		}
	};

	createjs.DataUtils = s;

}());

//##############################################################################
// Types.js
//##############################################################################

this.createjs = this.createjs || {};

(function() {
	var s = {};

	/**
	 * The preload type for generic binary types. Note that images are loaded as binary files when using XHR.
	 * @property BINARY
	 * @type {String}
	 * @default binary
	 * @static
	 * @since 0.6.0
	 */
	s.BINARY = "binary";

	/**
	 * The preload type for css files. CSS files are loaded using a &lt;link&gt; when loaded with XHR, or a
	 * &lt;style&gt; tag when loaded with tags.
	 * @property CSS
	 * @type {String}
	 * @default css
	 * @static
	 * @since 0.6.0
	 */
	s.CSS = "css";

	/**
	 * The preload type for font files.
	 * @property FONT
	 * @type {String}
	 * @default font
	 * @static
	 * @since 0.9.0
	 */
	s.FONT = "font";

	/**
	 * The preload type for fonts specified with CSS (such as Google fonts)
	 * @property FONTCSS
	 * @type {String}
	 * @default fontcss
	 * @static
	 * @since 0.9.0
	 */
	s.FONTCSS = "fontcss";

	/**
	 * The preload type for image files, usually png, gif, or jpg/jpeg. Images are loaded into an &lt;image&gt; tag.
	 * @property IMAGE
	 * @type {String}
	 * @default image
	 * @static
	 * @since 0.6.0
	 */
	s.IMAGE = "image";

	/**
	 * The preload type for javascript files, usually with the "js" file extension. JavaScript files are loaded into a
	 * &lt;script&gt; tag.
	 *
	 * Since version 0.4.1+, due to how tag-loaded scripts work, all JavaScript files are automatically injected into
	 * the body of the document to maintain parity between XHR and tag-loaded scripts. In version 0.4.0 and earlier,
	 * only tag-loaded scripts are injected.
	 * @property JAVASCRIPT
	 * @type {String}
	 * @default javascript
	 * @static
	 * @since 0.6.0
	 */
	s.JAVASCRIPT = "javascript";

	/**
	 * The preload type for json files, usually with the "json" file extension. JSON data is loaded and parsed into a
	 * JavaScript object. Note that if a `callback` is present on the load item, the file will be loaded with JSONP,
	 * no matter what the {{#crossLink "LoadQueue/preferXHR:property"}}{{/crossLink}} property is set to, and the JSON
	 * must contain a matching wrapper function.
	 * @property JSON
	 * @type {String}
	 * @default json
	 * @static
	 * @since 0.6.0
	 */
	s.JSON = "json";

	/**
	 * The preload type for jsonp files, usually with the "json" file extension. JSON data is loaded and parsed into a
	 * JavaScript object. You are required to pass a callback parameter that matches the function wrapper in the JSON.
	 * Note that JSONP will always be used if there is a callback present, no matter what the {{#crossLink "LoadQueue/preferXHR:property"}}{{/crossLink}}
	 * property is set to.
	 * @property JSONP
	 * @type {String}
	 * @default jsonp
	 * @static
	 * @since 0.6.0
	 */
	s.JSONP = "jsonp";

	/**
	 * The preload type for json-based manifest files, usually with the "json" file extension. The JSON data is loaded
	 * and parsed into a JavaScript object. PreloadJS will then look for a "manifest" property in the JSON, which is an
	 * Array of files to load, following the same format as the {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}}
	 * method. If a "callback" is specified on the manifest object, then it will be loaded using JSONP instead,
	 * regardless of what the {{#crossLink "LoadQueue/preferXHR:property"}}{{/crossLink}} property is set to.
	 * @property MANIFEST
	 * @type {String}
	 * @default manifest
	 * @static
	 * @since 0.6.0
	 */
	s.MANIFEST = "manifest";

	/**
	 * The preload type for sound files, usually mp3, ogg, or wav. When loading via tags, audio is loaded into an
	 * &lt;audio&gt; tag.
	 * @property SOUND
	 * @type {String}
	 * @default sound
	 * @static
	 * @since 0.6.0
	 */
	s.SOUND = "sound";

	/**
	 * The preload type for video files, usually mp4, ts, or ogg. When loading via tags, video is loaded into an
	 * &lt;video&gt; tag.
	 * @property VIDEO
	 * @type {String}
	 * @default video
	 * @static
	 * @since 0.6.0
	 */
	s.VIDEO = "video";

	/**
	 * The preload type for SpriteSheet files. SpriteSheet files are JSON files that contain string image paths.
	 * @property SPRITESHEET
	 * @type {String}
	 * @default spritesheet
	 * @static
	 * @since 0.6.0
	 */
	s.SPRITESHEET = "spritesheet";

	/**
	 * The preload type for SVG files.
	 * @property SVG
	 * @type {String}
	 * @default svg
	 * @static
	 * @since 0.6.0
	 */
	s.SVG = "svg";

	/**
	 * The preload type for text files, which is also the default file type if the type can not be determined. Text is
	 * loaded as raw text.
	 * @property TEXT
	 * @type {String}
	 * @default text
	 * @static
	 * @since 0.6.0
	 */
	s.TEXT = "text";

	/**
	 * The preload type for xml files. XML is loaded into an XML document.
	 * @property XML
	 * @type {String}
	 * @default xml
	 * @static
	 * @since 0.6.0
	 */
	s.XML = "xml";

	createjs.Types = s;
}());

//##############################################################################
// Methods.js
//##############################################################################

this.createjs = this.createjs || {};

(function() {
	var s = {};

	/**
	 * Defines a POST request, use for a method value when loading data.
	 * @property POST
	 * @type {string}
	 * @default post
	 * @static
	 */
	s.POST = "POST";

	/**
	 * Defines a GET request, use for a method value when loading data.
	 * @property GET
	 * @type {string}
	 * @default get
	 * @static
	 */
	s.GET = "GET";

	createjs.Methods = s;
}());

//##############################################################################
// LoadItem.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	/**
	 * All loaders accept an item containing the properties defined in this class. If a raw object is passed instead,
	 * it will not be affected, but it must contain at least a {{#crossLink "src:property"}}{{/crossLink}} property. A
	 * string path or HTML tag is also acceptable, but it will be automatically converted to a LoadItem using the
	 * {{#crossLink "create"}}{{/crossLink}} method by {{#crossLink "AbstractLoader"}}{{/crossLink}}
	 * @class LoadItem
	 * @constructor
	 * @since 0.6.0
	 */
	function LoadItem() {
		/**
		 * The source of the file that is being loaded. This property is <b>required</b>. The source can either be a
		 * string (recommended), or an HTML tag.
		 * This can also be an object, but in that case it has to include a type and be handled by a plugin.
		 * @property src
		 * @type {String}
		 * @default null
		 */
		this.src = null;

		/**
		 * The type file that is being loaded. The type of the file is usually inferred by the extension, but can also
		 * be set manually. This is helpful in cases where a file does not have an extension.
		 * @property type
		 * @type {String}
		 * @default null
		 */
		this.type = null;

		/**
		 * A string identifier which can be used to reference the loaded object. If none is provided, this will be
		 * automatically set to the {{#crossLink "src:property"}}{{/crossLink}}.
		 * @property id
		 * @type {String}
		 * @default null
		 */
		this.id = null;

		/**
		 * Determines if a manifest will maintain the order of this item, in relation to other items in the manifest
		 * that have also set the `maintainOrder` property to `true`. This only applies when the max connections has
		 * been set above 1 (using {{#crossLink "LoadQueue/setMaxConnections"}}{{/crossLink}}). Everything with this
		 * property set to `false` will finish as it is loaded. Ordered items are combined with script tags loading in
		 * order when {{#crossLink "LoadQueue/maintainScriptOrder:property"}}{{/crossLink}} is set to `true`.
		 * @property maintainOrder
		 * @type {Boolean}
		 * @default false
		 */
		this.maintainOrder = false;

		/**
		 * A callback used by JSONP requests that defines what global method to call when the JSONP content is loaded.
		 * @property callback
		 * @type {String}
		 * @default null
		 */
		this.callback = null;

		/**
		 * An arbitrary data object, which is included with the loaded object.
		 * @property data
		 * @type {Object}
		 * @default null
		 */
		this.data = null;

		/**
		 * The request method used for HTTP calls. Both {{#crossLink "Methods/GET:property"}}{{/crossLink}} or
		 * {{#crossLink "Methods/POST:property"}}{{/crossLink}} request types are supported, and are defined as
		 * constants on {{#crossLink "AbstractLoader"}}{{/crossLink}}.
		 * @property method
		 * @type {String}
		 * @default GET
		 */
		this.method = createjs.Methods.GET;

		/**
		 * An object hash of name/value pairs to send to the server.
		 * @property values
		 * @type {Object}
		 * @default null
		 */
		this.values = null;

		/**
		 * An object hash of headers to attach to an XHR request. PreloadJS will automatically attach some default
		 * headers when required, including "Origin", "Content-Type", and "X-Requested-With". You may override the
		 * default headers by including them in your headers object.
		 * @property headers
		 * @type {Object}
		 * @default null
		 */
		this.headers = null;

		/**
		 * Enable credentials for XHR requests.
		 * @property withCredentials
		 * @type {Boolean}
		 * @default false
		 */
		this.withCredentials = false;

		/**
		 * Set the mime type of XHR-based requests. This is automatically set to "text/plain; charset=utf-8" for text
		 * based files (json, xml, text, css, js).
		 * @property mimeType
		 * @type {String}
		 * @default null
		 */
		this.mimeType = null;

		/**
		 * Sets the crossOrigin attribute for CORS-enabled images loading cross-domain.
		 * @property crossOrigin
		 * @type {boolean}
		 * @default Anonymous
		 */
		this.crossOrigin = null;

		/**
		 * The duration in milliseconds to wait before a request times out. This only applies to tag-based and and XHR
		 * (level one) loading, as XHR (level 2) provides its own timeout event.
		 * @property loadTimeout
		 * @type {Number}
		 * @default 8000 (8 seconds)
		 */
		this.loadTimeout = s.LOAD_TIMEOUT_DEFAULT;
	};

	var p = LoadItem.prototype = {};
	var s = LoadItem;

	/**
	 * Default duration in milliseconds to wait before a request times out. This only applies to tag-based and and XHR
	 * (level one) loading, as XHR (level 2) provides its own timeout event.
	 * @property LOAD_TIMEOUT_DEFAULT
	 * @type {number}
	 * @static
	 */
	s.LOAD_TIMEOUT_DEFAULT = 8000;

	/**
	 * Create a LoadItem.
	 * <ul>
	 *     <li>String-based items are converted to a LoadItem with a populated {{#crossLink "src:property"}}{{/crossLink}}.</li>
	 *     <li>LoadItem instances are returned as-is</li>
	 *     <li>Objects are returned with any needed properties added</li>
	 * </ul>
	 * @method create
	 * @param {LoadItem|String|Object} value The load item value
	 * @returns {LoadItem|Object}
	 * @static
	 */
	s.create = function (value) {
		if (typeof value == "string") {
			var item = new LoadItem();
			item.src = value;
			return item;
		} else if (value instanceof s) {
			return value;
		} else if (value instanceof Object && value.src) {
			if (value.loadTimeout == null) {
				value.loadTimeout = s.LOAD_TIMEOUT_DEFAULT;
			}
			return value;
		} else {
			throw new Error("Type not recognized.");
		}
	};

	/**
	 * Provides a chainable shortcut method for setting a number of properties on the instance.
	 *
	 * <h4>Example</h4>
	 *
	 *      var loadItem = new createjs.LoadItem().set({src:"image.png", maintainOrder:true});
	 *
	 * @method set
	 * @param {Object} props A generic object containing properties to copy to the LoadItem instance.
	 * @return {LoadItem} Returns the instance the method is called on (useful for chaining calls.)
	*/
	p.set = function(props) {
		for (var n in props) { this[n] = props[n]; }
		return this;
	};

	createjs.LoadItem = s;

}());

//##############################################################################
// RequestUtils.js
//##############################################################################

(function () {

	/**
	 * Utilities that assist with parsing load items, and determining file types, etc.
	 * @class RequestUtils
	 */
	var s = {};

	/**
	 * Determine if a specific type should be loaded as a binary file. Currently, only images and items marked
	 * specifically as "binary" are loaded as binary. Note that audio is <b>not</b> a binary type, as we can not play
	 * back using an audio tag if it is loaded as binary. Plugins can change the item type to binary to ensure they get
	 * a binary result to work with. Binary files are loaded using XHR2. Types are defined as static constants on
	 * {{#crossLink "AbstractLoader"}}{{/crossLink}}.
	 * @method isBinary
	 * @param {String} type The item type.
	 * @return {Boolean} If the specified type is binary.
	 * @static
	 */
	s.isBinary = function (type) {
		switch (type) {
			case createjs.Types.IMAGE:
			case createjs.Types.BINARY:
				return true;
			default:
				return false;
		}
	};

	/**
	 * Determine if a specific type is a text-based asset, and should be loaded as UTF-8.
	 * @method isText
	 * @param {String} type The item type.
	 * @return {Boolean} If the specified type is text.
	 * @static
	 */
	s.isText = function (type) {
		switch (type) {
			case createjs.Types.TEXT:
			case createjs.Types.JSON:
			case createjs.Types.MANIFEST:
			case createjs.Types.XML:
			case createjs.Types.CSS:
			case createjs.Types.SVG:
			case createjs.Types.JAVASCRIPT:
			case createjs.Types.SPRITESHEET:
				return true;
			default:
				return false;
		}
	};

	/**
	 * Determine the type of the object using common extensions. Note that the type can be passed in with the load item
	 * if it is an unusual extension.
	 * @method getTypeByExtension
	 * @param {String} extension The file extension to use to determine the load type.
	 * @return {String} The determined load type (for example, `createjs.Types.IMAGE`). Will return `null` if
	 * the type can not be determined by the extension.
	 * @static
	 */
	s.getTypeByExtension = function (extension) {
		if (extension == null) {
			return createjs.Types.TEXT;
		}

		switch (extension.toLowerCase()) {
			case "jpeg":
			case "jpg":
			case "gif":
			case "png":
			case "webp":
			case "bmp":
				return createjs.Types.IMAGE;
			case "ogg":
			case "mp3":
			case "webm":
				return createjs.Types.SOUND;
			case "mp4":
			case "webm":
			case "ts":
				return createjs.Types.VIDEO;
			case "json":
				return createjs.Types.JSON;
			case "xml":
				return createjs.Types.XML;
			case "css":
				return createjs.Types.CSS;
			case "js":
				return createjs.Types.JAVASCRIPT;
			case 'svg':
				return createjs.Types.SVG;
			default:
				return createjs.Types.TEXT;
		}
	};

	createjs.RequestUtils = s;

}());

//##############################################################################
// AbstractLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

// constructor
	/**
	 * The base loader, which defines all the generic methods, properties, and events. All loaders extend this class,
	 * including the {{#crossLink "LoadQueue"}}{{/crossLink}}.
	 * @class AbstractLoader
	 * @param {LoadItem|object|string} loadItem The item to be loaded.
	 * @param {Boolean} [preferXHR] Determines if the LoadItem should <em>try</em> and load using XHR, or take a
	 * tag-based approach, which can be better in cross-domain situations. Not all loaders can load using one or the
	 * other, so this is a suggested directive.
	 * @param {String} [type] The type of loader. Loader types are defined as constants on the AbstractLoader class,
	 * such as {{#crossLink "IMAGE:property"}}{{/crossLink}}, {{#crossLink "CSS:property"}}{{/crossLink}}, etc.
	 * @extends EventDispatcher
	 */
	function AbstractLoader(loadItem, preferXHR, type) {
		this.EventDispatcher_constructor();

		// public properties
		/**
		 * If the loader has completed loading. This provides a quick check, but also ensures that the different approaches
		 * used for loading do not pile up resulting in more than one `complete` {{#crossLink "Event"}}{{/crossLink}}.
		 * @property loaded
		 * @type {Boolean}
		 * @default false
		 */
		this.loaded = false;

		/**
		 * Determine if the loader was canceled. Canceled loads will not fire complete events. Note that this property
		 * is readonly, so {{#crossLink "LoadQueue"}}{{/crossLink}} queues should be closed using {{#crossLink "LoadQueue/close"}}{{/crossLink}}
		 * instead.
		 * @property canceled
		 * @type {Boolean}
		 * @default false
		 * @readonly
		 */
		this.canceled = false;

		/**
		 * The current load progress (percentage) for this item. This will be a number between 0 and 1.
		 *
		 * <h4>Example</h4>
		 *
		 *     var queue = new createjs.LoadQueue();
		 *     queue.loadFile("largeImage.png");
		 *     queue.on("progress", function() {
		 *         console.log("Progress:", queue.progress, event.progress);
		 *     });
		 *
		 * @property progress
		 * @type {Number}
		 * @default 0
		 */
		this.progress = 0;

		/**
		 * The type of item this loader will load. See {{#crossLink "AbstractLoader"}}{{/crossLink}} for a full list of
		 * supported types.
		 * @property type
		 * @type {String}
		 */
		this.type = type;

		/**
		 * A formatter function that converts the loaded raw result into the final result. For example, the JSONLoader
		 * converts a string of text into a JavaScript object. Not all loaders have a resultFormatter, and this property
		 * can be overridden to provide custom formatting.
		 *
		 * Optionally, a resultFormatter can return a callback function in cases where the formatting needs to be
		 * asynchronous, such as creating a new image. The callback function is passed 2 parameters, which are callbacks
		 * to handle success and error conditions in the resultFormatter. Note that the resultFormatter method is
		 * called in the current scope, as well as the success and error callbacks.
		 *
		 * <h4>Example asynchronous resultFormatter</h4>
		 *
		 * 	function _formatResult(loader) {
		 * 		return function(success, error) {
		 * 			if (errorCondition) { error(errorDetailEvent); }
		 * 			success(result);
		 * 		}
		 * 	}
		 * @property resultFormatter
		 * @type {Function}
		 * @default null
		 */
		this.resultFormatter = null;

		// protected properties
		/**
		 * The {{#crossLink "LoadItem"}}{{/crossLink}} this loader represents. Note that this is null in a {{#crossLink "LoadQueue"}}{{/crossLink}},
		 * but will be available on loaders such as {{#crossLink "XMLLoader"}}{{/crossLink}} and {{#crossLink "ImageLoader"}}{{/crossLink}}.
		 * @property _item
		 * @type {LoadItem|Object}
		 * @private
		 */
		if (loadItem) {
			this._item = createjs.LoadItem.create(loadItem);
		} else {
			this._item = null;
		}

		/**
		 * Whether the loader will try and load content using XHR (true) or HTML tags (false).
		 * @property _preferXHR
		 * @type {Boolean}
		 * @private
		 */
		this._preferXHR = preferXHR;

		/**
		 * The loaded result after it is formatted by an optional {{#crossLink "resultFormatter"}}{{/crossLink}}. For
		 * items that are not formatted, this will be the same as the {{#crossLink "_rawResult:property"}}{{/crossLink}}.
		 * The result is accessed using the {{#crossLink "getResult"}}{{/crossLink}} method.
		 * @property _result
		 * @type {Object|String}
		 * @private
		 */
		this._result = null;

		/**
		 * The loaded result before it is formatted. The rawResult is accessed using the {{#crossLink "getResult"}}{{/crossLink}}
		 * method, and passing `true`.
		 * @property _rawResult
		 * @type {Object|String}
		 * @private
		 */
		this._rawResult = null;

		/**
		 * A list of items that loaders load behind the scenes. This does not include the main item the loader is
		 * responsible for loading. Examples of loaders that have sub-items include the {{#crossLink "SpriteSheetLoader"}}{{/crossLink}} and
		 * {{#crossLink "ManifestLoader"}}{{/crossLink}}.
		 * @property _loadItems
		 * @type {null}
		 * @protected
		 */
		this._loadedItems = null;

		/**
		 * The attribute the items loaded using tags use for the source.
		 * @type {string}
		 * @default null
		 * @private
		 */
		this._tagSrcAttribute = null;

		/**
		 * An HTML tag (or similar) that a loader may use to load HTML content, such as images, scripts, etc.
		 * @property _tag
		 * @type {Object}
		 * @private
		 */
		this._tag = null;
	};

	var p = createjs.extend(AbstractLoader, createjs.EventDispatcher);
	var s = AbstractLoader;

	// Remove these @deprecated properties after 1.0
	try {
		Object.defineProperties(s, {
			POST: { get: createjs.deprecate(function() { return createjs.Methods.POST; }, "AbstractLoader.POST") },
			GET: { get: createjs.deprecate(function() { return createjs.Methods.GET; }, "AbstractLoader.GET") },

			BINARY: { get: createjs.deprecate(function() { return createjs.Types.BINARY; }, "AbstractLoader.BINARY") },
			CSS: { get: createjs.deprecate(function() { return createjs.Types.CSS; }, "AbstractLoader.CSS") },
			FONT: { get: createjs.deprecate(function() { return createjs.Types.FONT; }, "AbstractLoader.FONT") },
			FONTCSS: { get: createjs.deprecate(function() { return createjs.Types.FONTCSS; }, "AbstractLoader.FONTCSS") },
			IMAGE: { get: createjs.deprecate(function() { return createjs.Types.IMAGE; }, "AbstractLoader.IMAGE") },
			JAVASCRIPT: { get: createjs.deprecate(function() { return createjs.Types.JAVASCRIPT; }, "AbstractLoader.JAVASCRIPT") },
			JSON: { get: createjs.deprecate(function() { return createjs.Types.JSON; }, "AbstractLoader.JSON") },
			JSONP: { get: createjs.deprecate(function() { return createjs.Types.JSONP; }, "AbstractLoader.JSONP") },
			MANIFEST: { get: createjs.deprecate(function() { return createjs.Types.MANIFEST; }, "AbstractLoader.MANIFEST") },
			SOUND: { get: createjs.deprecate(function() { return createjs.Types.SOUND; }, "AbstractLoader.SOUND") },
			VIDEO: { get: createjs.deprecate(function() { return createjs.Types.VIDEO; }, "AbstractLoader.VIDEO") },
			SPRITESHEET: { get: createjs.deprecate(function() { return createjs.Types.SPRITESHEET; }, "AbstractLoader.SPRITESHEET") },
			SVG: { get: createjs.deprecate(function() { return createjs.Types.SVG; }, "AbstractLoader.SVG") },
			TEXT: { get: createjs.deprecate(function() { return createjs.Types.TEXT; }, "AbstractLoader.TEXT") },
			XML: { get: createjs.deprecate(function() { return createjs.Types.XML; }, "AbstractLoader.XML") }
		});
	} catch (e) {}

// Events
	/**
	 * The {{#crossLink "ProgressEvent"}}{{/crossLink}} that is fired when the overall progress changes. Prior to
	 * version 0.6.0, this was just a regular {{#crossLink "Event"}}{{/crossLink}}.
	 * @event progress
	 * @since 0.3.0
	 */

	/**
	 * The {{#crossLink "Event"}}{{/crossLink}} that is fired when a load starts.
	 * @event loadstart
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @since 0.3.1
	 */

	/**
	 * The {{#crossLink "Event"}}{{/crossLink}} that is fired when the entire queue has been loaded.
	 * @event complete
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @since 0.3.0
	 */

	/**
	 * The {{#crossLink "ErrorEvent"}}{{/crossLink}} that is fired when the loader encounters an error. If the error was
	 * encountered by a file, the event will contain the item that caused the error. Prior to version 0.6.0, this was
	 * just a regular {{#crossLink "Event"}}{{/crossLink}}.
	 * @event error
	 * @since 0.3.0
	 */

	/**
	 * The {{#crossLink "Event"}}{{/crossLink}} that is fired when the loader encounters an internal file load error.
	 * This enables loaders to maintain internal queues, and surface file load errors.
	 * @event fileerror
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type ("fileerror")
	 * @param {LoadItem|object} The item that encountered the error
	 * @since 0.6.0
	 */

	/**
	 * The {{#crossLink "Event"}}{{/crossLink}} that is fired when a loader internally loads a file. This enables
	 * loaders such as {{#crossLink "ManifestLoader"}}{{/crossLink}} to maintain internal {{#crossLink "LoadQueue"}}{{/crossLink}}s
	 * and notify when they have loaded a file. The {{#crossLink "LoadQueue"}}{{/crossLink}} class dispatches a
	 * slightly different {{#crossLink "LoadQueue/fileload:event"}}{{/crossLink}} event.
	 * @event fileload
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type ("fileload")
	 * @param {Object} item The file item which was specified in the {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}}
	 * or {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}} call. If only a string path or tag was specified, the
	 * object will contain that value as a `src` property.
	 * @param {Object} result The HTML tag or parsed result of the loaded item.
	 * @param {Object} rawResult The unprocessed result, usually the raw text or binary data before it is converted
	 * to a usable object.
	 * @since 0.6.0
	 */

	/**
	 * The {{#crossLink "Event"}}{{/crossLink}} that is fired after the internal request is created, but before a load.
	 * This allows updates to the loader for specific loading needs, such as binary or XHR image loading.
	 * @event initialize
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type ("initialize")
	 * @param {AbstractLoader} loader The loader that has been initialized.
	 */


	/**
	 * Get a reference to the manifest item that is loaded by this loader. In some cases this will be the value that was
	 * passed into {{#crossLink "LoadQueue"}}{{/crossLink}} using {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}} or
	 * {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}}. However if only a String path was passed in, then it will
	 * be a {{#crossLink "LoadItem"}}{{/crossLink}}.
	 * @method getItem
	 * @return {Object} The manifest item that this loader is responsible for loading.
	 * @since 0.6.0
	 */
	p.getItem = function () {
		return this._item;
	};

	/**
	 * Get a reference to the content that was loaded by the loader (only available after the {{#crossLink "complete:event"}}{{/crossLink}}
	 * event is dispatched.
	 * @method getResult
	 * @param {Boolean} [raw=false] Determines if the returned result will be the formatted content, or the raw loaded
	 * data (if it exists).
	 * @return {Object}
	 * @since 0.6.0
	 */
	p.getResult = function (raw) {
		return raw ? this._rawResult : this._result;
	};

	/**
	 * Return the `tag` this object creates or uses for loading.
	 * @method getTag
	 * @return {Object} The tag instance
	 * @since 0.6.0
	 */
	p.getTag = function () {
		return this._tag;
	};

	/**
	 * Set the `tag` this item uses for loading.
	 * @method setTag
	 * @param {Object} tag The tag instance
	 * @since 0.6.0
	 */
	p.setTag = function(tag) {
	  this._tag = tag;
	};

	/**
	 * Begin loading the item. This method is required when using a loader by itself.
	 *
	 * <h4>Example</h4>
	 *
	 *      var queue = new createjs.LoadQueue();
	 *      queue.on("complete", handleComplete);
	 *      queue.loadManifest(fileArray, false); // Note the 2nd argument that tells the queue not to start loading yet
	 *      queue.load();
	 *
	 * @method load
	 */
	p.load = function () {
		this._createRequest();

		this._request.on("complete", this, this);
		this._request.on("progress", this, this);
		this._request.on("loadStart", this, this);
		this._request.on("abort", this, this);
		this._request.on("timeout", this, this);
		this._request.on("error", this, this);

		var evt = new createjs.Event("initialize");
		evt.loader = this._request;
		this.dispatchEvent(evt);

		this._request.load();
	};

	/**
	 * Close the the item. This will stop any open requests (although downloads using HTML tags may still continue in
	 * the background), but events will not longer be dispatched.
	 * @method cancel
	 */
	p.cancel = function () {
		this.canceled = true;
		this.destroy();
	};

	/**
	 * Clean up the loader.
	 * @method destroy
	 */
	p.destroy = function() {
		if (this._request) {
			this._request.removeAllEventListeners();
			this._request.destroy();
		}

		this._request = null;

		this._item = null;
		this._rawResult = null;
		this._result = null;

		this._loadItems = null;

		this.removeAllEventListeners();
	};

	/**
	 * Get any items loaded internally by the loader. The enables loaders such as {{#crossLink "ManifestLoader"}}{{/crossLink}}
	 * to expose items it loads internally.
	 * @method getLoadedItems
	 * @return {Array} A list of the items loaded by the loader.
	 * @since 0.6.0
	 */
	p.getLoadedItems = function () {
		return this._loadedItems;
	};


	// Private methods
	/**
	 * Create an internal request used for loading. By default, an {{#crossLink "XHRRequest"}}{{/crossLink}} or
	 * {{#crossLink "TagRequest"}}{{/crossLink}} is created, depending on the value of {{#crossLink "preferXHR:property"}}{{/crossLink}}.
	 * Other loaders may override this to use different request types, such as {{#crossLink "ManifestLoader"}}{{/crossLink}},
	 * which uses {{#crossLink "JSONLoader"}}{{/crossLink}} or {{#crossLink "JSONPLoader"}}{{/crossLink}} under the hood.
	 * @method _createRequest
	 * @protected
	 */
	p._createRequest = function() {
		if (!this._preferXHR) {
			this._request = new createjs.TagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute);
		} else {
			this._request = new createjs.XHRRequest(this._item);
		}
	};

	/**
	 * Create the HTML tag used for loading. This method does nothing by default, and needs to be implemented
	 * by loaders that require tag loading.
	 * @method _createTag
	 * @param {String} src The tag source
	 * @return {HTMLElement} The tag that was created
	 * @protected
	 */
	p._createTag = function(src) { return null; };

	/**
	 * Dispatch a loadstart {{#crossLink "Event"}}{{/crossLink}}. Please see the {{#crossLink "AbstractLoader/loadstart:event"}}{{/crossLink}}
	 * event for details on the event payload.
	 * @method _sendLoadStart
	 * @protected
	 */
	p._sendLoadStart = function () {
		if (this._isCanceled()) { return; }
		this.dispatchEvent("loadstart");
	};

	/**
	 * Dispatch a {{#crossLink "ProgressEvent"}}{{/crossLink}}.
	 * @method _sendProgress
	 * @param {Number | Object} value The progress of the loaded item, or an object containing <code>loaded</code>
	 * and <code>total</code> properties.
	 * @protected
	 */
	p._sendProgress = function (value) {
		if (this._isCanceled()) { return; }
		var event = null;
		if (typeof(value) == "number") {
			this.progress = value;
			event = new createjs.ProgressEvent(this.progress);
		} else {
			event = value;
			this.progress = value.loaded / value.total;
			event.progress = this.progress;
			if (isNaN(this.progress) || this.progress == Infinity) { this.progress = 0; }
		}
		this.hasEventListener("progress") && this.dispatchEvent(event);
	};

	/**
	 * Dispatch a complete {{#crossLink "Event"}}{{/crossLink}}. Please see the {{#crossLink "AbstractLoader/complete:event"}}{{/crossLink}} event
	 * @method _sendComplete
	 * @protected
	 */
	p._sendComplete = function () {
		if (this._isCanceled()) { return; }

		this.loaded = true;

		var event = new createjs.Event("complete");
		event.rawResult = this._rawResult;

		if (this._result != null) {
			event.result = this._result;
		}

		this.dispatchEvent(event);
	};

	/**
	 * Dispatch an error {{#crossLink "Event"}}{{/crossLink}}. Please see the {{#crossLink "AbstractLoader/error:event"}}{{/crossLink}}
	 * event for details on the event payload.
	 * @method _sendError
	 * @param {ErrorEvent} event The event object containing specific error properties.
	 * @protected
	 */
	p._sendError = function (event) {
		if (this._isCanceled() || !this.hasEventListener("error")) { return; }
		if (event == null) {
			event = new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY"); // TODO: Populate error
		}
		this.dispatchEvent(event);
	};

	/**
	 * Determine if the load has been canceled. This is important to ensure that method calls or asynchronous events
	 * do not cause issues after the queue has been cleaned up.
	 * @method _isCanceled
	 * @return {Boolean} If the loader has been canceled.
	 * @protected
	 */
	p._isCanceled = function () {
		if (window.createjs == null || this.canceled) {
			return true;
		}
		return false;
	};

	/**
	 * A custom result formatter function, which is called just before a request dispatches its complete event. Most
	 * loader types already have an internal formatter, but this can be user-overridden for custom formatting. The
	 * formatted result will be available on Loaders using {{#crossLink "getResult"}}{{/crossLink}}, and passing `true`.
	 * @property resultFormatter
	 * @type Function
	 * @return {Object} The formatted result
	 * @since 0.6.0
	 */
	p.resultFormatter = null;

	/**
	 * Handle events from internal requests. By default, loaders will handle, and redispatch the necessary events, but
	 * this method can be overridden for custom behaviours.
	 * @method handleEvent
	 * @param {Event} event The event that the internal request dispatches.
	 * @protected
	 * @since 0.6.0
	 */
	p.handleEvent = function (event) {
		switch (event.type) {
			case "complete":
				this._rawResult = event.target._response;
				var result = this.resultFormatter && this.resultFormatter(this);
				// The resultFormatter is asynchronous
				if (result instanceof Function) {
					result.call(this,
							createjs.proxy(this._resultFormatSuccess, this),
							createjs.proxy(this._resultFormatFailed, this)
					);
				// The result formatter is synchronous
				} else {
					this._result =  result || this._rawResult;
					this._sendComplete();
				}
				break;
			case "progress":
				this._sendProgress(event);
				break;
			case "error":
				this._sendError(event);
				break;
			case "loadstart":
				this._sendLoadStart();
				break;
			case "abort":
			case "timeout":
				if (!this._isCanceled()) {
					this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_" + event.type.toUpperCase() + "_ERROR"));
				}
				break;
		}
	};

	/**
	 * The "success" callback passed to {{#crossLink "AbstractLoader/resultFormatter"}}{{/crossLink}} asynchronous
	 * functions.
	 * @method _resultFormatSuccess
	 * @param {Object} result The formatted result
	 * @private
	 */
	p._resultFormatSuccess = function (result) {
		this._result = result;
		this._sendComplete();
	};

	/**
	 * The "error" callback passed to {{#crossLink "AbstractLoader/resultFormatter"}}{{/crossLink}} asynchronous
	 * functions.
	 * @method _resultFormatSuccess
	 * @param {Object} error The error event
	 * @private
	 */
	p._resultFormatFailed = function (event) {
		this._sendError(event);
	};

	/**
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	p.toString = function () {
		return "[PreloadJS AbstractLoader]";
	};

	createjs.AbstractLoader = createjs.promote(AbstractLoader, "EventDispatcher");

}());

//##############################################################################
// AbstractMediaLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * The AbstractMediaLoader is a base class that handles some of the shared methods and properties of loaders that
	 * handle HTML media elements, such as Video and Audio.
	 * @class AbstractMediaLoader
	 * @param {LoadItem|Object} loadItem
	 * @param {Boolean} preferXHR
	 * @param {String} type The type of media to load. Usually "video" or "audio".
	 * @extends AbstractLoader
	 * @constructor
	 */
	function AbstractMediaLoader(loadItem, preferXHR, type) {
		this.AbstractLoader_constructor(loadItem, preferXHR, type);

		// public properties
		this.resultFormatter = this._formatResult;

		// protected properties
		this._tagSrcAttribute = "src";

        this.on("initialize", this._updateXHR, this);
	};

	var p = createjs.extend(AbstractMediaLoader, createjs.AbstractLoader);

	// static properties
	// public methods
	p.load = function () {
		// TagRequest will handle most of this, but Sound / Video need a few custom properties, so just handle them here.
		if (!this._tag) {
			this._tag = this._createTag(this._item.src);
		}

		this._tag.preload = "auto";
		this._tag.load();

		this.AbstractLoader_load();
	};

	// protected methods
	/**
	 * Creates a new tag for loading if it doesn't exist yet.
	 * @method _createTag
	 * @private
	 */
	p._createTag = function () {};


	p._createRequest = function() {
		if (!this._preferXHR) {
			this._request = new createjs.MediaTagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute);
		} else {
			this._request = new createjs.XHRRequest(this._item);
		}
	};

    // protected methods
    /**
     * Before the item loads, set its mimeType and responseType.
     * @property _updateXHR
     * @param {Event} event
     * @private
     */
    p._updateXHR = function (event) {
        // Only exists for XHR
        if (event.loader.setResponseType) {
            event.loader.setResponseType("blob");
        }
    };

	/**
	 * The result formatter for media files.
	 * @method _formatResult
	 * @param {AbstractLoader} loader
	 * @returns {HTMLVideoElement|HTMLAudioElement}
	 * @private
	 */
	p._formatResult = function (loader) {
		this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler);
		this._tag.onstalled = null;
		if (this._preferXHR) {
            var URL = window.URL || window.webkitURL;
            var result = loader.getResult(true);

			loader.getTag().src = URL.createObjectURL(result);
		}
		return loader.getTag();
	};

	createjs.AbstractMediaLoader = createjs.promote(AbstractMediaLoader, "AbstractLoader");

}());

//##############################################################################
// AbstractRequest.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	/**
	 * A base class for actual data requests, such as {{#crossLink "XHRRequest"}}{{/crossLink}}, {{#crossLink "TagRequest"}}{{/crossLink}},
	 * and {{#crossLink "MediaRequest"}}{{/crossLink}}. PreloadJS loaders will typically use a data loader under the
	 * hood to get data.
	 * @class AbstractRequest
	 * @param {LoadItem} item
	 * @constructor
	 */
	var AbstractRequest = function (item) {
		this._item = item;
	};

	var p = createjs.extend(AbstractRequest, createjs.EventDispatcher);

	// public methods
	/**
	 * Begin a load.
	 * @method load
	 */
	p.load =  function() {};

	/**
	 * Clean up a request.
	 * @method destroy
	 */
	p.destroy = function() {};

	/**
	 * Cancel an in-progress request.
	 * @method cancel
	 */
	p.cancel = function() {};

	createjs.AbstractRequest = createjs.promote(AbstractRequest, "EventDispatcher");

}());

//##############################################################################
// TagRequest.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * An {{#crossLink "AbstractRequest"}}{{/crossLink}} that loads HTML tags, such as images and scripts.
	 * @class TagRequest
	 * @param {LoadItem} loadItem
	 * @param {HTMLElement} tag
	 * @param {String} srcAttribute The tag attribute that specifies the source, such as "src", "href", etc.
	 */
	function TagRequest(loadItem, tag, srcAttribute) {
		this.AbstractRequest_constructor(loadItem);

		// protected properties
		/**
		 * The HTML tag instance that is used to load.
		 * @property _tag
		 * @type {HTMLElement}
		 * @protected
		 */
		this._tag = tag;

		/**
		 * The tag attribute that specifies the source, such as "src", "href", etc.
		 * @property _tagSrcAttribute
		 * @type {String}
		 * @protected
		 */
		this._tagSrcAttribute = srcAttribute;

		/**
		 * A method closure used for handling the tag load event.
		 * @property _loadedHandler
		 * @type {Function}
		 * @private
		 */
		this._loadedHandler = createjs.proxy(this._handleTagComplete, this);

		/**
		 * Determines if the element was added to the DOM automatically by PreloadJS, so it can be cleaned up after.
		 * @property _addedToDOM
		 * @type {Boolean}
		 * @private
		 */
		this._addedToDOM = false;

	};

	var p = createjs.extend(TagRequest, createjs.AbstractRequest);

	// public methods
	p.load = function () {
		this._tag.onload = createjs.proxy(this._handleTagComplete, this);
		this._tag.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this);
		this._tag.onerror = createjs.proxy(this._handleError, this);

		var evt = new createjs.Event("initialize");
		evt.loader = this._tag;

		this.dispatchEvent(evt);

		this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);

		this._tag[this._tagSrcAttribute] = this._item.src;

		// wdg:: Append the tag AFTER setting the src, or SVG loading on iOS will fail.
		if (this._tag.parentNode == null) {
			createjs.DomUtils.appendToBody(this._tag);
			this._addedToDOM = true;
		}
	};

	p.destroy = function() {
		this._clean();
		this._tag = null;

		this.AbstractRequest_destroy();
	};

	// private methods
	/**
	 * Handle the readyStateChange event from a tag. We need this in place of the `onload` callback (mainly SCRIPT
	 * and LINK tags), but other cases may exist.
	 * @method _handleReadyStateChange
	 * @private
	 */
	p._handleReadyStateChange = function () {
		clearTimeout(this._loadTimeout);
		// This is strictly for tags in browsers that do not support onload.
		var tag = this._tag;

		// Complete is for old IE support.
		if (tag.readyState == "loaded" || tag.readyState == "complete") {
			this._handleTagComplete();
		}
	};

	/**
	 * Handle any error events from the tag.
	 * @method _handleError
	 * @protected
	 */
	p._handleError = function() {
		this._clean();
		this.dispatchEvent("error");
	};

	/**
	 * Handle the tag's onload callback.
	 * @method _handleTagComplete
	 * @private
	 */
	p._handleTagComplete = function () {
		this._rawResult = this._tag;
		this._result = this.resultFormatter && this.resultFormatter(this) || this._rawResult;

		this._clean();

		this.dispatchEvent("complete");
	};

	/**
	 * The tag request has not loaded within the time specified in loadTimeout.
	 * @method _handleError
	 * @param {Object} event The XHR error event.
	 * @private
	 */
	p._handleTimeout = function () {
		this._clean();
		this.dispatchEvent(new createjs.Event("timeout"));
	};

	/**
	 * Remove event listeners, but don't destroy the request object
	 * @method _clean
	 * @private
	 */
	p._clean = function() {
		this._tag.onload = null;
		this._tag.onreadystatechange = null;
		this._tag.onerror = null;
		if (this._addedToDOM && this._tag.parentNode != null) {
			this._tag.parentNode.removeChild(this._tag);
		}
		clearTimeout(this._loadTimeout);
	};

	/**
	 * Handle a stalled audio event. The main place this happens is with HTMLAudio in Chrome when playing back audio
	 * that is already in a load, but not complete.
	 * @method _handleStalled
	 * @private
	 */
	p._handleStalled = function () {
		//Ignore, let the timeout take care of it. Sometimes its not really stopped.
	};

	createjs.TagRequest = createjs.promote(TagRequest, "AbstractRequest");

}());

//##############################################################################
// MediaTagRequest.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * An {{#crossLink "TagRequest"}}{{/crossLink}} that loads HTML tags for video and audio.
	 * @class MediaTagRequest
	 * @param {LoadItem} loadItem
	 * @param {HTMLAudioElement|HTMLVideoElement} tag
	 * @param {String} srcAttribute The tag attribute that specifies the source, such as "src", "href", etc.
	 * @constructor
	 */
	function MediaTagRequest(loadItem, tag, srcAttribute) {
		this.AbstractRequest_constructor(loadItem);

		// protected properties
		this._tag = tag;
		this._tagSrcAttribute = srcAttribute;
		this._loadedHandler = createjs.proxy(this._handleTagComplete, this);
	};

	var p = createjs.extend(MediaTagRequest, createjs.TagRequest);
	var s = MediaTagRequest;

	// public methods
	p.load = function () {
		var sc = createjs.proxy(this._handleStalled, this);
		this._stalledCallback = sc;

		var pc = createjs.proxy(this._handleProgress, this);
		this._handleProgress = pc;

		this._tag.addEventListener("stalled", sc);
		this._tag.addEventListener("progress", pc);

		// This will tell us when audio is buffered enough to play through, but not when its loaded.
		// The tag doesn't keep loading in Chrome once enough has buffered, and we have decided that behaviour is sufficient.
		this._tag.addEventListener && this._tag.addEventListener("canplaythrough", this._loadedHandler, false); // canplaythrough callback doesn't work in Chrome, so we use an event.

		this.TagRequest_load();
	};

	// private methods
	p._handleReadyStateChange = function () {
		clearTimeout(this._loadTimeout);
		// This is strictly for tags in browsers that do not support onload.
		var tag = this._tag;

		// Complete is for old IE support.
		if (tag.readyState == "loaded" || tag.readyState == "complete") {
			this._handleTagComplete();
		}
	};

	p._handleStalled = function () {
		//Ignore, let the timeout take care of it. Sometimes its not really stopped.
	};

	/**
	 * An XHR request has reported progress.
	 * @method _handleProgress
	 * @param {Object} event The XHR progress event.
	 * @private
	 */
	p._handleProgress = function (event) {
		if (!event || event.loaded > 0 && event.total == 0) {
			return; // Sometimes we get no "total", so just ignore the progress event.
		}

		var newEvent = new createjs.ProgressEvent(event.loaded, event.total);
		this.dispatchEvent(newEvent);
	};

	// protected methods
	p._clean = function () {
		this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler);
		this._tag.removeEventListener("stalled", this._stalledCallback);
		this._tag.removeEventListener("progress", this._progressCallback);

		this.TagRequest__clean();
	};

	createjs.MediaTagRequest = createjs.promote(MediaTagRequest, "TagRequest");

}());

//##############################################################################
// XHRRequest.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

// constructor
	/**
	 * A preloader that loads items using XHR requests, usually XMLHttpRequest. However XDomainRequests will be used
	 * for cross-domain requests if possible, and older versions of IE fall back on to ActiveX objects when necessary.
	 * XHR requests load the content as text or binary data, provide progress and consistent completion events, and
	 * can be canceled during load. Note that XHR is not supported in IE 6 or earlier, and is not recommended for
	 * cross-domain loading.
	 * @class XHRRequest
	 * @constructor
	 * @param {Object} item The object that defines the file to load. Please see the {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}}
	 * for an overview of supported file properties.
	 * @extends AbstractLoader
	 */
	function XHRRequest (item) {
		this.AbstractRequest_constructor(item);

		// protected properties
		/**
		 * A reference to the XHR request used to load the content.
		 * @property _request
		 * @type {XMLHttpRequest | XDomainRequest | ActiveX.XMLHTTP}
		 * @private
		 */
		this._request = null;

		/**
		 * A manual load timeout that is used for browsers that do not support the onTimeout event on XHR (XHR level 1,
		 * typically IE9).
		 * @property _loadTimeout
		 * @type {Number}
		 * @private
		 */
		this._loadTimeout = null;

		/**
		 * The browser's XHR (XMLHTTPRequest) version. Supported versions are 1 and 2. There is no official way to detect
		 * the version, so we use capabilities to make a best guess.
		 * @property _xhrLevel
		 * @type {Number}
		 * @default 1
		 * @private
		 */
		this._xhrLevel = 1;

		/**
		 * The response of a loaded file. This is set because it is expensive to look up constantly. This property will be
		 * null until the file is loaded.
		 * @property _response
		 * @type {mixed}
		 * @private
		 */
		this._response = null;

		/**
		 * The response of the loaded file before it is modified. In most cases, content is converted from raw text to
		 * an HTML tag or a formatted object which is set to the <code>result</code> property, but the developer may still
		 * want to access the raw content as it was loaded.
		 * @property _rawResponse
		 * @type {String|Object}
		 * @private
		 */
		this._rawResponse = null;

		this._canceled = false;

		// Setup our event handlers now.
		this._handleLoadStartProxy = createjs.proxy(this._handleLoadStart, this);
		this._handleProgressProxy = createjs.proxy(this._handleProgress, this);
		this._handleAbortProxy = createjs.proxy(this._handleAbort, this);
		this._handleErrorProxy = createjs.proxy(this._handleError, this);
		this._handleTimeoutProxy = createjs.proxy(this._handleTimeout, this);
		this._handleLoadProxy = createjs.proxy(this._handleLoad, this);
		this._handleReadyStateChangeProxy = createjs.proxy(this._handleReadyStateChange, this);

		if (!this._createXHR(item)) {
			//TODO: Throw error?
		}
	};

	var p = createjs.extend(XHRRequest, createjs.AbstractRequest);

// static properties
	/**
	 * A list of XMLHTTP object IDs to try when building an ActiveX object for XHR requests in earlier versions of IE.
	 * @property ACTIVEX_VERSIONS
	 * @type {Array}
	 * @since 0.4.2
	 * @private
	 */
	XHRRequest.ACTIVEX_VERSIONS = [
		"Msxml2.XMLHTTP.6.0",
		"Msxml2.XMLHTTP.5.0",
		"Msxml2.XMLHTTP.4.0",
		"MSXML2.XMLHTTP.3.0",
		"MSXML2.XMLHTTP",
		"Microsoft.XMLHTTP"
	];

// Public methods
	/**
	 * Look up the loaded result.
	 * @method getResult
	 * @param {Boolean} [raw=false] Return a raw result instead of a formatted result. This applies to content
	 * loaded via XHR such as scripts, XML, CSS, and Images. If there is no raw result, the formatted result will be
	 * returned instead.
	 * @return {Object} A result object containing the content that was loaded, such as:
	 * <ul>
	 *      <li>An image tag (&lt;image /&gt;) for images</li>
	 *      <li>A script tag for JavaScript (&lt;script /&gt;). Note that scripts loaded with tags may be added to the
	 *      HTML head.</li>
	 *      <li>A style tag for CSS (&lt;style /&gt;)</li>
	 *      <li>Raw text for TEXT</li>
	 *      <li>A formatted JavaScript object defined by JSON</li>
	 *      <li>An XML document</li>
	 *      <li>An binary arraybuffer loaded by XHR</li>
	 * </ul>
	 * Note that if a raw result is requested, but not found, the result will be returned instead.
	 */
	p.getResult = function (raw) {
		if (raw && this._rawResponse) {
			return this._rawResponse;
		}
		return this._response;
	};

	// Overrides abstract method in AbstractRequest
	p.cancel = function () {
		this.canceled = true;
		this._clean();
		this._request.abort();
	};

	// Overrides abstract method in AbstractLoader
	p.load = function () {
		if (this._request == null) {
			this._handleError();
			return;
		}

		//Events
		if (this._request.addEventListener != null) {
			this._request.addEventListener("loadstart", this._handleLoadStartProxy, false);
			this._request.addEventListener("progress", this._handleProgressProxy, false);
			this._request.addEventListener("abort", this._handleAbortProxy, false);
			this._request.addEventListener("error", this._handleErrorProxy, false);
			this._request.addEventListener("timeout", this._handleTimeoutProxy, false);

			// Note: We don't get onload in all browsers (earlier FF and IE). onReadyStateChange handles these.
			this._request.addEventListener("load", this._handleLoadProxy, false);
			this._request.addEventListener("readystatechange", this._handleReadyStateChangeProxy, false);
		} else {
			// IE9 support
			this._request.onloadstart = this._handleLoadStartProxy;
			this._request.onprogress = this._handleProgressProxy;
			this._request.onabort = this._handleAbortProxy;
			this._request.onerror = this._handleErrorProxy;
			this._request.ontimeout = this._handleTimeoutProxy;

			// Note: We don't get onload in all browsers (earlier FF and IE). onReadyStateChange handles these.
			this._request.onload = this._handleLoadProxy;
			this._request.onreadystatechange = this._handleReadyStateChangeProxy;
		}

		// Set up a timeout if we don't have XHR2
		if (this._xhrLevel == 1) {
			this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);
		}

		// Sometimes we get back 404s immediately, particularly when there is a cross origin request.  // note this does not catch in Chrome
		try {
			if (!this._item.values) {
				this._request.send();
			} else {
				this._request.send(createjs.URLUtils.formatQueryString(this._item.values));
			}
		} catch (error) {
			this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND", null, error));
		}
	};

	p.setResponseType = function (type) {
		// Some old browsers doesn't support blob, so we convert arraybuffer to blob after response is downloaded
		if (type === 'blob') {
			type = window.URL ? 'blob' : 'arraybuffer';
			this._responseType = type;
		}
		this._request.responseType = type;
	};

	/**
	 * Get all the response headers from the XmlHttpRequest.
	 *
	 * <strong>From the docs:</strong> Return all the HTTP headers, excluding headers that are a case-insensitive match
	 * for Set-Cookie or Set-Cookie2, as a single string, with each header line separated by a U+000D CR U+000A LF pair,
	 * excluding the status line, and with each header name and header value separated by a U+003A COLON U+0020 SPACE
	 * pair.
	 * @method getAllResponseHeaders
	 * @return {String}
	 * @since 0.4.1
	 */
	p.getAllResponseHeaders = function () {
		if (this._request.getAllResponseHeaders instanceof Function) {
			return this._request.getAllResponseHeaders();
		} else {
			return null;
		}
	};

	/**
	 * Get a specific response header from the XmlHttpRequest.
	 *
	 * <strong>From the docs:</strong> Returns the header field value from the response of which the field name matches
	 * header, unless the field name is Set-Cookie or Set-Cookie2.
	 * @method getResponseHeader
	 * @param {String} header The header name to retrieve.
	 * @return {String}
	 * @since 0.4.1
	 */
	p.getResponseHeader = function (header) {
		if (this._request.getResponseHeader instanceof Function) {
			return this._request.getResponseHeader(header);
		} else {
			return null;
		}
	};

// protected methods
	/**
	 * The XHR request has reported progress.
	 * @method _handleProgress
	 * @param {Object} event The XHR progress event.
	 * @private
	 */
	p._handleProgress = function (event) {
		if (!event || event.loaded > 0 && event.total == 0) {
			return; // Sometimes we get no "total", so just ignore the progress event.
		}

		var newEvent = new createjs.ProgressEvent(event.loaded, event.total);
		this.dispatchEvent(newEvent);
	};

	/**
	 * The XHR request has reported a load start.
	 * @method _handleLoadStart
	 * @param {Object} event The XHR loadStart event.
	 * @private
	 */
	p._handleLoadStart = function (event) {
		clearTimeout(this._loadTimeout);
		this.dispatchEvent("loadstart");
	};

	/**
	 * The XHR request has reported an abort event.
	 * @method handleAbort
	 * @param {Object} event The XHR abort event.
	 * @private
	 */
	p._handleAbort = function (event) {
		this._clean();
		this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED", null, event));
	};

	/**
	 * The XHR request has reported an error event.
	 * @method _handleError
	 * @param {Object} event The XHR error event.
	 * @private
	 */
	p._handleError = function (event) {
		this._clean();
		this.dispatchEvent(new createjs.ErrorEvent(event.message));
	};

	/**
	 * The XHR request has reported a readyState change. Note that older browsers (IE 7 & 8) do not provide an onload
	 * event, so we must monitor the readyStateChange to determine if the file is loaded.
	 * @method _handleReadyStateChange
	 * @param {Object} event The XHR readyStateChange event.
	 * @private
	 */
	p._handleReadyStateChange = function (event) {
		if (this._request.readyState == 4) {
			this._handleLoad();
		}
	};

	/**
	 * The XHR request has completed. This is called by the XHR request directly, or by a readyStateChange that has
	 * <code>request.readyState == 4</code>. Only the first call to this method will be processed.
	 *
	 * Note that This method uses {{#crossLink "_checkError"}}{{/crossLink}} to determine if the server has returned an
	 * error code.
	 * @method _handleLoad
	 * @param {Object} event The XHR load event.
	 * @private
	 */
	p._handleLoad = function (event) {
		if (this.loaded) {
			return;
		}
		this.loaded = true;

		var error = this._checkError();
		if (error) {
			this._handleError(error);
			return;
		}

		this._response = this._getResponse();
		// Convert arraybuffer back to blob
		if (this._responseType === 'arraybuffer') {
			try {
				this._response = new Blob([this._response]);
			} catch (e) {
				// Fallback to use BlobBuilder if Blob constructor is not supported
				// Tested on Android 2.3 ~ 4.2 and iOS5 safari
				window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
				if (e.name === 'TypeError' && window.BlobBuilder) {
					var builder = new BlobBuilder();
					builder.append(this._response);
					this._response = builder.getBlob();
				}
			}
		}
		this._clean();

		this.dispatchEvent(new createjs.Event("complete"));
	};

	/**
	 * The XHR request has timed out. This is called by the XHR request directly, or via a <code>setTimeout</code>
	 * callback.
	 * @method _handleTimeout
	 * @param {Object} [event] The XHR timeout event. This is occasionally null when called by the backup setTimeout.
	 * @private
	 */
	p._handleTimeout = function (event) {
		this._clean();
		this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT", null, event));
	};

// Protected
	/**
	 * Determine if there is an error in the current load.
	 * Currently this checks the status of the request for problem codes, and not actual response content:
	 * <ul>
	 *     <li>Status codes between 400 and 599 (HTTP error range)</li>
	 *     <li>A status of 0, but *only when the application is running on a server*. If the application is running
	 *     on `file:`, then it may incorrectly treat an error on local (or embedded applications) as a successful
	 *     load.</li>
	 * </ul>
	 * @method _checkError
	 * @return {Error} An error with the status code in the `message` argument.
	 * @private
	 */
	p._checkError = function () {
		var status = parseInt(this._request.status);
		if (status >= 400 && status <= 599) {
			return new Error(status);
		} else if (status == 0) {
			if ((/^https?:/).test(location.protocol)) { return new Error(0); }
			return null; // Likely an embedded app.
		} else {
			return null;
		}
	};


	/**
	 * Validate the response. Different browsers have different approaches, some of which throw errors when accessed
	 * in other browsers. If there is no response, the <code>_response</code> property will remain null.
	 * @method _getResponse
	 * @private
	 */
	p._getResponse = function () {
		if (this._response != null) {
			return this._response;
		}

		if (this._request.response != null) {
			return this._request.response;
		}

		// Android 2.2 uses .responseText
		try {
			if (this._request.responseText != null) {
				return this._request.responseText;
			}
		} catch (e) {
		}

		// When loading XML, IE9 does not return .response, instead it returns responseXML.xml
		try {
			if (this._request.responseXML != null) {
				return this._request.responseXML;
			}
		} catch (e) {
		}

		return null;
	};

	/**
	 * Create an XHR request. Depending on a number of factors, we get totally different results.
	 * <ol><li>Some browsers get an <code>XDomainRequest</code> when loading cross-domain.</li>
	 *      <li>XMLHttpRequest are created when available.</li>
	 *      <li>ActiveX.XMLHTTP objects are used in older IE browsers.</li>
	 *      <li>Text requests override the mime type if possible</li>
	 *      <li>Origin headers are sent for crossdomain requests in some browsers.</li>
	 *      <li>Binary loads set the response type to "arraybuffer"</li></ol>
	 * @method _createXHR
	 * @param {Object} item The requested item that is being loaded.
	 * @return {Boolean} If an XHR request or equivalent was successfully created.
	 * @private
	 */
	p._createXHR = function (item) {
		// Check for cross-domain loads. We can't fully support them, but we can try.
		var crossdomain = createjs.URLUtils.isCrossDomain(item);
		var headers = {};

		// Create the request. Fallback to whatever support we have.
		var req = null;
		if (window.XMLHttpRequest) {
			req = new XMLHttpRequest();
			// This is 8 or 9, so use XDomainRequest instead.
			if (crossdomain && req.withCredentials === undefined && window.XDomainRequest) {
				req = new XDomainRequest();
			}
		} else { // Old IE versions use a different approach
			for (var i = 0, l = s.ACTIVEX_VERSIONS.length; i < l; i++) {
				var axVersion = s.ACTIVEX_VERSIONS[i];
				try {
					req = new ActiveXObject(axVersion);
					break;
				} catch (e) {
				}
			}
			if (req == null) {
				return false;
			}
		}

		// Default to utf-8 for Text requests.
		if (item.mimeType == null && createjs.RequestUtils.isText(item.type)) {
			item.mimeType = "text/plain; charset=utf-8";
		}

		// IE9 doesn't support overrideMimeType(), so we need to check for it.
		if (item.mimeType && req.overrideMimeType) {
			req.overrideMimeType(item.mimeType);
		}

		// Determine the XHR level
		this._xhrLevel = (typeof req.responseType === "string") ? 2 : 1;

		var src = null;
		if (item.method == createjs.Methods.GET) {
			src = createjs.URLUtils.buildURI(item.src, item.values);
		} else {
			src = item.src;
		}

		// Open the request.  Set cross-domain flags if it is supported (XHR level 1 only)
		req.open(item.method || createjs.Methods.GET, src, true);

		if (crossdomain && req instanceof XMLHttpRequest && this._xhrLevel == 1) {
			headers["Origin"] = location.origin;
		}

		// To send data we need to set the Content-type header)
		if (item.values && item.method == createjs.Methods.POST) {
			headers["Content-Type"] = "application/x-www-form-urlencoded";
		}

		if (!crossdomain && !headers["X-Requested-With"]) {
			headers["X-Requested-With"] = "XMLHttpRequest";
		}

		if (item.headers) {
			for (var n in item.headers) {
				headers[n] = item.headers[n];
			}
		}

		for (n in headers) {
			req.setRequestHeader(n, headers[n])
		}

		if (req instanceof XMLHttpRequest && item.withCredentials !== undefined) {
			req.withCredentials = item.withCredentials;
		}

		this._request = req;

		return true;
	};

	/**
	 * A request has completed (or failed or canceled), and needs to be disposed.
	 * @method _clean
	 * @private
	 */
	p._clean = function () {
		clearTimeout(this._loadTimeout);

		if (this._request.removeEventListener != null) {
			this._request.removeEventListener("loadstart", this._handleLoadStartProxy);
			this._request.removeEventListener("progress", this._handleProgressProxy);
			this._request.removeEventListener("abort", this._handleAbortProxy);
			this._request.removeEventListener("error", this._handleErrorProxy);
			this._request.removeEventListener("timeout", this._handleTimeoutProxy);
			this._request.removeEventListener("load", this._handleLoadProxy);
			this._request.removeEventListener("readystatechange", this._handleReadyStateChangeProxy);
		} else {
			this._request.onloadstart = null;
			this._request.onprogress = null;
			this._request.onabort = null;
			this._request.onerror = null;
			this._request.ontimeout = null;
			this._request.onload = null;
			this._request.onreadystatechange = null;
		}
	};

	p.toString = function () {
		return "[PreloadJS XHRRequest]";
	};

	createjs.XHRRequest = createjs.promote(XHRRequest, "AbstractRequest");

}());

//##############################################################################
// LoadQueue.js
//##############################################################################

this.createjs = this.createjs || {};

/*
 TODO: WINDOWS ISSUES
 * No error for HTML audio in IE 678
 * SVG no failure error in IE 67 (maybe 8) TAGS AND XHR
 * No script complete handler in IE 67 TAGS (XHR is fine)
 * No XML/JSON in IE6 TAGS
 * Need to hide loading SVG in Opera TAGS
 * No CSS onload/readystatechange in Safari or Android TAGS (requires rule checking)
 * SVG no load or failure in Opera XHR
 * Reported issues with IE7/8
 */

(function () {
	"use strict";

// constructor
	/**
	 * The LoadQueue class is the main API for preloading content. LoadQueue is a load manager, which can preload either
	 * a single file, or queue of files.
	 *
	 * <b>Creating a Queue</b><br />
	 * To use LoadQueue, create a LoadQueue instance. If you want to force tag loading where possible, set the preferXHR
	 * argument to false.
	 *
	 *      var queue = new createjs.LoadQueue(true);
	 *
	 * <b>Listening for Events</b><br />
	 * Add any listeners you want to the queue. Since PreloadJS 0.3.0, the {{#crossLink "EventDispatcher"}}{{/crossLink}}
	 * lets you add as many listeners as you want for events. You can subscribe to the following events:<ul>
	 *     <li>{{#crossLink "AbstractLoader/complete:event"}}{{/crossLink}}: fired when a queue completes loading all
	 *     files</li>
	 *     <li>{{#crossLink "AbstractLoader/error:event"}}{{/crossLink}}: fired when the queue encounters an error with
	 *     any file.</li>
	 *     <li>{{#crossLink "AbstractLoader/progress:event"}}{{/crossLink}}: Progress for the entire queue has
	 *     changed.</li>
	 *     <li>{{#crossLink "LoadQueue/fileload:event"}}{{/crossLink}}: A single file has completed loading.</li>
	 *     <li>{{#crossLink "LoadQueue/fileprogress:event"}}{{/crossLink}}: Progress for a single file has changes. Note
	 *     that only files loaded with XHR (or possibly by plugins) will fire progress events other than 0 or 100%.</li>
	 * </ul>
	 *
	 *      queue.on("fileload", handleFileLoad, this);
	 *      queue.on("complete", handleComplete, this);
	 *
	 * <b>Adding files and manifests</b><br />
	 * Add files you want to load using {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}} or add multiple files at a
	 * time using a list or a manifest definition using {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}}. Files are
	 * appended to the end of the active queue, so you can use these methods as many times as you like, whenever you
	 * like.
	 *
	 *      queue.loadFile("filePath/file.jpg");
	 *      queue.loadFile({id:"image", src:"filePath/file.jpg"});
	 *      queue.loadManifest(["filePath/file.jpg", {id:"image", src:"filePath/file.jpg"}]);
	 *
	 *      // Use an external manifest
	 *      queue.loadManifest("path/to/manifest.json");
	 *      queue.loadManifest({src:"manifest.json", type:"manifest"});
	 *
	 * If you pass `false` as the `loadNow` parameter, the queue will not kick of the load of the files, but it will not
	 * stop if it has already been started. Call the {{#crossLink "AbstractLoader/load"}}{{/crossLink}} method to begin
	 * a paused queue. Note that a paused queue will automatically resume when new files are added to it with a
	 * `loadNow` argument of `true`.
	 *
	 *      queue.load();
	 *
	 * <b>File Types</b><br />
	 * The file type of a manifest item is auto-determined by the file extension. The pattern matching in PreloadJS
	 * should handle the majority of standard file and url formats, and works with common file extensions. If you have
	 * either a non-standard file extension, or are serving the file using a proxy script, then you can pass in a
	 * <code>type</code> property with any manifest item.
	 *
	 *      queue.loadFile({src:"path/to/myFile.mp3x", type:createjs.Types.SOUND});
	 *
	 *      // Note that PreloadJS will not read a file extension from the query string
	 *      queue.loadFile({src:"http://server.com/proxy?file=image.jpg", type:createjs.Types.IMAGE});
	 *
	 * Supported types are defined on the {{#crossLink "AbstractLoader"}}{{/crossLink}} class, and include:
	 * <ul>
	 *     <li>{{#crossLink "Types/BINARY:property"}}{{/crossLink}}: Raw binary data via XHR</li>
	 *     <li>{{#crossLink "Types/CSS:property"}}{{/crossLink}}: CSS files</li>
	 *     <li>{{#crossLink "Types/IMAGE:property"}}{{/crossLink}}: Common image formats</li>
	 *     <li>{{#crossLink "Types/JAVASCRIPT:property"}}{{/crossLink}}: JavaScript files</li>
	 *     <li>{{#crossLink "Types/JSON:property"}}{{/crossLink}}: JSON data</li>
	 *     <li>{{#crossLink "Types/JSONP:property"}}{{/crossLink}}: JSON files cross-domain</li>
	 *     <li>{{#crossLink "Types/MANIFEST:property"}}{{/crossLink}}: A list of files to load in JSON format, see
	 *     {{#crossLink "AbstractLoader/loadManifest"}}{{/crossLink}}</li>
	 *     <li>{{#crossLink "Types/SOUND:property"}}{{/crossLink}}: Audio file formats</li>
	 *     <li>{{#crossLink "Types/SPRITESHEET:property"}}{{/crossLink}}: JSON SpriteSheet definitions. This
	 *     will also load sub-images, and provide a {{#crossLink "SpriteSheet"}}{{/crossLink}} instance.</li>
	 *     <li>{{#crossLink "Types/SVG:property"}}{{/crossLink}}: SVG files</li>
	 *     <li>{{#crossLink "Types/TEXT:property"}}{{/crossLink}}: Text files - XHR only</li>
     *     <li>{{#crossLink "Types/VIDEO:property"}}{{/crossLink}}: Video objects</li>
	 *     <li>{{#crossLink "Types/XML:property"}}{{/crossLink}}: XML data</li>
	 * </ul>
	 *
	 * <em>Note: Loader types used to be defined on LoadQueue, but have been moved to the Types class</em>
	 *
	 * <b>Handling Results</b><br />
	 * When a file is finished downloading, a {{#crossLink "LoadQueue/fileload:event"}}{{/crossLink}} event is
	 * dispatched. In an example above, there is an event listener snippet for fileload. Loaded files are usually a
	 * formatted object that can be used immediately, including:
	 * <ul>
	 *     <li>Binary: The binary loaded result</li>
	 *     <li>CSS: A &lt;link /&gt; tag</li>
	 *     <li>Image: An &lt;img /&gt; tag</li>
	 *     <li>JavaScript: A &lt;script /&gt; tag</li>
	 *     <li>JSON/JSONP: A formatted JavaScript Object</li>
	 *     <li>Manifest: A JavaScript object.
	 *     <li>Sound: An &lt;audio /&gt; tag</a>
	 *     <li>SpriteSheet: A {{#crossLink "SpriteSheet"}}{{/crossLink}} instance, containing loaded images.
	 *     <li>SVG: An &lt;object /&gt; tag</li>
	 *     <li>Text: Raw text</li>
     *     <li>Video: A Video DOM node</li>
	 *     <li>XML: An XML DOM node</li>
	 * </ul>
	 *
	 *      function handleFileLoad(event) {
	 *          var item = event.item; // A reference to the item that was passed in to the LoadQueue
	 *          var type = item.type;
	 *
	 *          // Add any images to the page body.
	 *          if (type == createjs.Types.IMAGE) {
	 *              document.body.appendChild(event.result);
	 *          }
	 *      }
	 *
	 * At any time after the file has been loaded (usually after the queue has completed), any result can be looked up
	 * via its "id" using {{#crossLink "LoadQueue/getResult"}}{{/crossLink}}. If no id was provided, then the
	 * "src" or file path can be used instead, including the `path` defined by a manifest, but <strong>not including</strong>
	 * a base path defined on the LoadQueue. It is recommended to always pass an id if you want to look up content.
	 *
	 *      var image = queue.getResult("image");
	 *      document.body.appendChild(image);
	 *
	 * Raw loaded content can be accessed using the <code>rawResult</code> property of the {{#crossLink "LoadQueue/fileload:event"}}{{/crossLink}}
	 * event, or can be looked up using {{#crossLink "LoadQueue/getResult"}}{{/crossLink}}, passing `true` as the 2nd
	 * argument. This is only applicable for content that has been parsed for the browser, specifically: JavaScript,
	 * CSS, XML, SVG, and JSON objects, or anything loaded with XHR.
	 *
	 *      var image = queue.getResult("image", true); // load the binary image data loaded with XHR.
	 *
	 * <b>Plugins</b><br />
	 * LoadQueue has a simple plugin architecture to help process and preload content. For example, to preload audio,
	 * make sure to install the <a href="http://soundjs.com">SoundJS</a> Sound class, which will help load HTML audio,
	 * Flash audio, and WebAudio files. This should be installed <strong>before</strong> loading any audio files.
	 *
	 *      queue.installPlugin(createjs.Sound);
	 *
	 * <h4>Known Browser Issues</h4>
	 * <ul>
	 *     <li>Browsers without audio support can not load audio files.</li>
	 *     <li>Safari on Mac OS X can only play HTML audio if QuickTime is installed</li>
	 *     <li>HTML Audio tags will only download until their <code>canPlayThrough</code> event is fired. Browsers other
	 *     than Chrome will continue to download in the background.</li>
	 *     <li>When loading scripts using tags, they are automatically added to the document.</li>
	 *     <li>Scripts loaded via XHR may not be properly inspectable with browser tools.</li>
	 *     <li>IE6 and IE7 (and some other browsers) may not be able to load XML, Text, or JSON, since they require
	 *     XHR to work.</li>
	 *     <li>Content loaded via tags will not show progress, and will continue to download in the background when
	 *     canceled, although no events will be dispatched.</li>
	 * </ul>
	 *
	 * @class LoadQueue
	 * @param {Boolean} [preferXHR=true] Determines whether the preload instance will favor loading with XHR (XML HTTP
	 * Requests), or HTML tags. When this is `false`, the queue will use tag loading when possible, and fall back on XHR
	 * when necessary.
	 * @param {String} [basePath=""] A path that will be prepended on to the source parameter of all items in the queue
	 * before they are loaded.  Sources beginning with a protocol such as `http://` or a relative path such as `../`
	 * will not receive a base path.
	 * @param {String|Boolean} [crossOrigin=""] An optional flag to support images loaded from a CORS-enabled server. To
	 * use it, set this value to `true`, which will default the crossOrigin property on images to "Anonymous". Any
	 * string value will be passed through, but only "" and "Anonymous" are recommended. <strong>Note: The crossOrigin
	 * parameter is deprecated. Use LoadItem.crossOrigin instead</strong>
	 *
	 * @constructor
	 * @extends AbstractLoader
	 */
	function LoadQueue (preferXHR, basePath, crossOrigin) {
		this.AbstractLoader_constructor();

		/**
		 * An array of the plugins registered using {{#crossLink "LoadQueue/installPlugin"}}{{/crossLink}}.
		 * @property _plugins
		 * @type {Array}
		 * @private
		 * @since 0.6.1
		 */
		this._plugins = [];

		/**
		 * An object hash of callbacks that are fired for each file type before the file is loaded, giving plugins the
		 * ability to override properties of the load. Please see the {{#crossLink "LoadQueue/installPlugin"}}{{/crossLink}}
		 * method for more information.
		 * @property _typeCallbacks
		 * @type {Object}
		 * @private
		 */
		this._typeCallbacks = {};

		/**
		 * An object hash of callbacks that are fired for each file extension before the file is loaded, giving plugins the
		 * ability to override properties of the load. Please see the {{#crossLink "LoadQueue/installPlugin"}}{{/crossLink}}
		 * method for more information.
		 * @property _extensionCallbacks
		 * @type {null}
		 * @private
		 */
		this._extensionCallbacks = {};

		/**
		 * The next preload queue to process when this one is complete. If an error is thrown in the current queue, and
		 * {{#crossLink "LoadQueue/stopOnError:property"}}{{/crossLink}} is `true`, the next queue will not be processed.
		 * @property next
		 * @type {LoadQueue}
		 * @default null
		 */
		this.next = null;

		/**
		 * Ensure loaded scripts "complete" in the order they are specified. Loaded scripts are added to the document head
		 * once they are loaded. Scripts loaded via tags will load one-at-a-time when this property is `true`, whereas
		 * scripts loaded using XHR can load in any order, but will "finish" and be added to the document in the order
		 * specified.
		 *
		 * Any items can be set to load in order by setting the {{#crossLink "maintainOrder:property"}}{{/crossLink}}
		 * property on the load item, or by ensuring that only one connection can be open at a time using
		 * {{#crossLink "LoadQueue/setMaxConnections"}}{{/crossLink}}. Note that when the `maintainScriptOrder` property
		 * is set to `true`, scripts items are automatically set to `maintainOrder=true`, and changing the
		 * `maintainScriptOrder` to `false` during a load will not change items already in a queue.
		 *
		 * <h4>Example</h4>
		 *
		 *      var queue = new createjs.LoadQueue();
		 *      queue.setMaxConnections(3); // Set a higher number to load multiple items at once
		 *      queue.maintainScriptOrder = true; // Ensure scripts are loaded in order
		 *      queue.loadManifest([
		 *          "script1.js",
		 *          "script2.js",
		 *          "image.png", // Load any time
		 *          {src: "image2.png", maintainOrder: true} // Will wait for script2.js
		 *          "image3.png",
		 *          "script3.js" // Will wait for image2.png before loading (or completing when loading with XHR)
		 *      ]);
		 *
		 * @property maintainScriptOrder
		 * @type {Boolean}
		 * @default true
		 */
		this.maintainScriptOrder = true;

		/**
		 * Determines if the LoadQueue will stop processing the current queue when an error is encountered.
		 * @property stopOnError
		 * @type {Boolean}
		 * @default false
		 */
		this.stopOnError = false;

		/**
		 * The number of maximum open connections that a loadQueue tries to maintain. Please see
		 * {{#crossLink "LoadQueue/setMaxConnections"}}{{/crossLink}} for more information.
		 * @property _maxConnections
		 * @type {Number}
		 * @default 1
		 * @private
		 */
		this._maxConnections = 1;

		/**
		 * An internal list of all the default Loaders that are included with PreloadJS. Before an item is loaded, the
		 * available loader list is iterated, in the order they are included, and as soon as a loader indicates it can
		 * handle the content, it will be selected. The default loader, ({{#crossLink "TextLoader"}}{{/crossLink}} is
		 * last in the list, so it will be used if no other match is found. Typically, loaders will match based on the
		 * {{#crossLink "LoadItem/type"}}{{/crossLink}}, which is automatically determined using the file extension of
		 * the {{#crossLink "LoadItem/src:property"}}{{/crossLink}}.
		 *
		 * Loaders can be removed from PreloadJS by simply not including them.
		 *
		 * Custom loaders installed using {{#crossLink "registerLoader"}}{{/crossLink}} will be prepended to this list
		 * so that they are checked first.
		 * @property _availableLoaders
		 * @type {Array}
		 * @private
		 * @since 0.6.0
		 */
		this._availableLoaders = [
            createjs.FontLoader,
			createjs.ImageLoader,
			createjs.JavaScriptLoader,
			createjs.CSSLoader,
			createjs.JSONLoader,
			createjs.JSONPLoader,
			createjs.SoundLoader,
			createjs.ManifestLoader,
			createjs.SpriteSheetLoader,
			createjs.XMLLoader,
			createjs.SVGLoader,
			createjs.BinaryLoader,
			createjs.VideoLoader,
			createjs.TextLoader
		];

		/**
		 * The number of built in loaders, so they can't be removed by {{#crossLink "unregisterLoader"}}{{/crossLink}.
				 * @property _defaultLoaderLength
		 * @type {Number}
		 * @private
		 * @since 0.6.0
		 */
		this._defaultLoaderLength = this._availableLoaders.length;

		this.init(preferXHR, basePath, crossOrigin);
	}

	var p = createjs.extend(LoadQueue, createjs.AbstractLoader);
	var s = LoadQueue;

	// Remove these @deprecated properties after 1.0
	try {
		Object.defineProperties(s, {
			POST: { get: createjs.deprecate(function() { return createjs.Methods.POST; }, "AbstractLoader.POST") },
			GET: { get: createjs.deprecate(function() { return createjs.Methods.GET; }, "AbstractLoader.GET") },

			BINARY: { get: createjs.deprecate(function() { return createjs.Types.BINARY; }, "AbstractLoader.BINARY") },
			CSS: { get: createjs.deprecate(function() { return createjs.Types.CSS; }, "AbstractLoader.CSS") },
			FONT: { get: createjs.deprecate(function() { return createjs.Types.FONT; }, "AbstractLoader.FONT") },
			FONTCSS: { get: createjs.deprecate(function() { return createjs.Types.FONTCSS; }, "AbstractLoader.FONTCSS") },
			IMAGE: { get: createjs.deprecate(function() { return createjs.Types.IMAGE; }, "AbstractLoader.IMAGE") },
			JAVASCRIPT: { get: createjs.deprecate(function() { return createjs.Types.JAVASCRIPT; }, "AbstractLoader.JAVASCRIPT") },
			JSON: { get: createjs.deprecate(function() { return createjs.Types.JSON; }, "AbstractLoader.JSON") },
			JSONP: { get: createjs.deprecate(function() { return createjs.Types.JSONP; }, "AbstractLoader.JSONP") },
			MANIFEST: { get: createjs.deprecate(function() { return createjs.Types.MANIFEST; }, "AbstractLoader.MANIFEST") },
			SOUND: { get: createjs.deprecate(function() { return createjs.Types.SOUND; }, "AbstractLoader.SOUND") },
			VIDEO: { get: createjs.deprecate(function() { return createjs.Types.VIDEO; }, "AbstractLoader.VIDEO") },
			SPRITESHEET: { get: createjs.deprecate(function() { return createjs.Types.SPRITESHEET; }, "AbstractLoader.SPRITESHEET") },
			SVG: { get: createjs.deprecate(function() { return createjs.Types.SVG; }, "AbstractLoader.SVG") },
			TEXT: { get: createjs.deprecate(function() { return createjs.Types.TEXT; }, "AbstractLoader.TEXT") },
			XML: { get: createjs.deprecate(function() { return createjs.Types.XML; }, "AbstractLoader.XML") }
		});
	} catch (e) {}

	/**
	 * An internal initialization method, which is used for initial set up, but also to reset the LoadQueue.
	 * @method init
	 * @param preferXHR
	 * @param basePath
	 * @param crossOrigin
	 * @private
	 */
	p.init = function (preferXHR, basePath, crossOrigin) {

		// public properties

		/**
		 * Try and use XMLHttpRequest (XHR) when possible. Note that LoadQueue will default to tag loading or XHR
		 * loading depending on the requirements for a media type. For example, HTML audio can not be loaded with XHR,
		 * and plain text can not be loaded with tags, so it will default the the correct type instead of using the
		 * user-defined type.
		 * @type {Boolean}
		 * @default true
		 * @since 0.6.0
		 */
		this.preferXHR = true; //TODO: Get/Set
		this._preferXHR = true;
		this.setPreferXHR(preferXHR);

		// protected properties
		/**
		 * Whether the queue is currently paused or not.
		 * @property _paused
		 * @type {boolean}
		 * @private
		 */
		this._paused = false;

		/**
		 * A path that will be prepended on to the item's {{#crossLink "LoadItem/src:property"}}{{/crossLink}}. The
		 * `_basePath` property will only be used if an item's source is relative, and does not include a protocol such
		 * as `http://`, or a relative path such as `../`.
		 * @property _basePath
		 * @type {String}
		 * @private
		 * @since 0.3.1
		 */
		this._basePath = basePath;

		/**
		 * An optional flag to set on images that are loaded using PreloadJS, which enables CORS support. Images loaded
		 * cross-domain by servers that support CORS require the crossOrigin flag to be loaded and interacted with by
		 * a canvas. When loading locally, or with a server with no CORS support, this flag can cause other security issues,
		 * so it is recommended to only set it if you are sure the server supports it. Currently, supported values are ""
		 * and "Anonymous".
		 * @property _crossOrigin
		 * @type {String}
		 * @default ""
		 * @private
		 * @since 0.4.1
		 */
		this._crossOrigin = crossOrigin;

		/**
		 * Determines if the loadStart event was dispatched already. This event is only fired one time, when the first
		 * file is requested.
		 * @property _loadStartWasDispatched
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		this._loadStartWasDispatched = false;

		/**
		 * Determines if there is currently a script loading. This helps ensure that only a single script loads at once when
		 * using a script tag to do preloading.
		 * @property _currentlyLoadingScript
		 * @type {Boolean}
		 * @private
		 */
		this._currentlyLoadingScript = null;

		/**
		 * An array containing the currently downloading files.
		 * @property _currentLoads
		 * @type {Array}
		 * @private
		 */
		this._currentLoads = [];

		/**
		 * An array containing the queued items that have not yet started downloading.
		 * @property _loadQueue
		 * @type {Array}
		 * @private
		 */
		this._loadQueue = [];

		/**
		 * An array containing downloads that have not completed, so that the LoadQueue can be properly reset.
		 * @property _loadQueueBackup
		 * @type {Array}
		 * @private
		 */
		this._loadQueueBackup = [];

		/**
		 * An object hash of items that have finished downloading, indexed by the {{#crossLink "LoadItem"}}{{/crossLink}}
		 * id.
		 * @property _loadItemsById
		 * @type {Object}
		 * @private
		 */
		this._loadItemsById = {};

		/**
		 * An object hash of items that have finished downloading, indexed by {{#crossLink "LoadItem"}}{{/crossLink}}
		 * source.
		 * @property _loadItemsBySrc
		 * @type {Object}
		 * @private
		 */
		this._loadItemsBySrc = {};

		/**
		 * An object hash of loaded items, indexed by the ID of the {{#crossLink "LoadItem"}}{{/crossLink}}.
		 * @property _loadedResults
		 * @type {Object}
		 * @private
		 */
		this._loadedResults = {};

		/**
		 * An object hash of un-parsed loaded items, indexed by the ID of the {{#crossLink "LoadItem"}}{{/crossLink}}.
		 * @property _loadedRawResults
		 * @type {Object}
		 * @private
		 */
		this._loadedRawResults = {};

		/**
		 * The number of items that have been requested. This helps manage an overall progress without knowing how large
		 * the files are before they are downloaded. This does not include items inside of loaders such as the
		 * {{#crossLink "ManifestLoader"}}{{/crossLink}}.
		 * @property _numItems
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		this._numItems = 0;

		/**
		 * The number of items that have completed loaded. This helps manage an overall progress without knowing how large
		 * the files are before they are downloaded.
		 * @property _numItemsLoaded
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		this._numItemsLoaded = 0;

		/**
		 * A list of scripts in the order they were requested. This helps ensure that scripts are "completed" in the right
		 * order.
		 * @property _scriptOrder
		 * @type {Array}
		 * @private
		 */
		this._scriptOrder = [];

		/**
		 * A list of scripts that have been loaded. Items are added to this list as <code>null</code> when they are
		 * requested, contain the loaded item if it has completed, but not been dispatched to the user, and <code>true</true>
		 * once they are complete and have been dispatched.
		 * @property _loadedScripts
		 * @type {Array}
		 * @private
		 */
		this._loadedScripts = [];

		/**
		 * The last progress amount. This is used to suppress duplicate progress events.
		 * @property _lastProgress
		 * @type {Number}
		 * @private
		 * @since 0.6.0
		 */
		this._lastProgress = NaN;

	};

// static properties

// events
	/**
	 * This event is fired when an individual file has loaded, and been processed.
	 * @event fileload
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @param {Object} item The file item which was specified in the {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}}
	 * or {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}} call. If only a string path or tag was specified, the
	 * object will contain that value as a `src` property.
	 * @param {Object} result The HTML tag or parsed result of the loaded item.
	 * @param {Object} rawResult The unprocessed result, usually the raw text or binary data before it is converted
	 * to a usable object.
	 * @since 0.3.0
	 */

	/**
	 * This {{#crossLink "ProgressEvent"}}{{/crossLink}} that is fired when an an individual file's progress changes.
	 * @event fileprogress
	 * @since 0.3.0
	 */

	/**
	 * This event is fired when an individual file starts to load.
	 * @event filestart
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @param {Object} item The file item which was specified in the {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}}
	 * or {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}} call. If only a string path or tag was specified, the
	 * object will contain that value as a property.
	 */

	/**
	 * Although it extends {{#crossLink "AbstractLoader"}}{{/crossLink}}, the `initialize` event is never fired from
	 * a LoadQueue instance.
	 * @event initialize
	 * @private
	 */

// public methods
	/**
	 * Register a custom loaders class. New loaders are given precedence over loaders added earlier and default loaders.
	 * It is recommended that loaders extend {{#crossLink "AbstractLoader"}}{{/crossLink}}. Loaders can only be added
	 * once, and will be prepended to the list of available loaders.
	 * @method registerLoader
	 * @param {Function|AbstractLoader} loader The AbstractLoader class to add.
	 * @since 0.6.0
	 */
	p.registerLoader = function (loader) {
		if (!loader || !loader.canLoadItem) {
			throw new Error("loader is of an incorrect type.");
		} else if (this._availableLoaders.indexOf(loader) != -1) {
			throw new Error("loader already exists."); //LM: Maybe just silently fail here
		}

		this._availableLoaders.unshift(loader);
	};

	/**
	 * Remove a custom loader added using {{#crossLink "registerLoader"}}{{/crossLink}}. Only custom loaders can be
	 * unregistered, the default loaders will always be available.
	 * @method unregisterLoader
	 * @param {Function|AbstractLoader} loader The AbstractLoader class to remove
	 */
	p.unregisterLoader = function (loader) {
		var idx = this._availableLoaders.indexOf(loader);
		if (idx != -1 && idx < this._defaultLoaderLength - 1) {
			this._availableLoaders.splice(idx, 1);
		}
	};

	/**
	 * Change the {{#crossLink "preferXHR:property"}}{{/crossLink}} value. Note that if this is set to `true`, it may
	 * fail, or be ignored depending on the browser's capabilities and the load type.
	 * @method setPreferXHR
	 * @param {Boolean} value
	 * @returns {Boolean} The value of {{#crossLink "preferXHR"}}{{/crossLink}} that was successfully set.
	 * @since 0.6.0
	 */
	p.setPreferXHR = function (value) {
		// Determine if we can use XHR. XHR defaults to TRUE, but the browser may not support it.
		//TODO: Should we be checking for the other XHR types? Might have to do a try/catch on the different types similar to createXHR.
		this.preferXHR = (value != false && window.XMLHttpRequest != null);
		return this.preferXHR;
	};

	/**
	 * Stops all queued and loading items, and clears the queue. This also removes all internal references to loaded
	 * content, and allows the queue to be used again.
	 * @method removeAll
	 * @since 0.3.0
	 */
	p.removeAll = function () {
		this.remove();
	};

	/**
	 * Stops an item from being loaded, and removes it from the queue. If nothing is passed, all items are removed.
	 * This also removes internal references to loaded item(s).
	 *
	 * <h4>Example</h4>
	 *
	 *      queue.loadManifest([
	 *          {src:"test.png", id:"png"},
	 *          {src:"test.jpg", id:"jpg"},
	 *          {src:"test.mp3", id:"mp3"}
	 *      ]);
	 *      queue.remove("png"); // Single item by ID
	 *      queue.remove("png", "test.jpg"); // Items as arguments. Mixed id and src.
	 *      queue.remove(["test.png", "jpg"]); // Items in an Array. Mixed id and src.
	 *
	 * @method remove
	 * @param {String | Array} idsOrUrls* The id or ids to remove from this queue. You can pass an item, an array of
	 * items, or multiple items as arguments.
	 * @since 0.3.0
	 */
	p.remove = function (idsOrUrls) {
		var args = null;

		if (idsOrUrls && !Array.isArray(idsOrUrls)) {
			args = [idsOrUrls];
		} else if (idsOrUrls) {
			args = idsOrUrls;
		} else if (arguments.length > 0) {
			return;
		}

		var itemsWereRemoved = false;

		// Destroy everything
		if (!args) {
			this.close();
			for (var n in this._loadItemsById) {
				this._disposeItem(this._loadItemsById[n]);
			}
			this.init(this.preferXHR, this._basePath);

			// Remove specific items
		} else {
			while (args.length) {
				var item = args.pop();
				var r = this.getResult(item);

				//Remove from the main load Queue
				for (i = this._loadQueue.length - 1; i >= 0; i--) {
					loadItem = this._loadQueue[i].getItem();
					if (loadItem.id == item || loadItem.src == item) {
						this._loadQueue.splice(i, 1)[0].cancel();
						break;
					}
				}

				//Remove from the backup queue
				for (i = this._loadQueueBackup.length - 1; i >= 0; i--) {
					loadItem = this._loadQueueBackup[i].getItem();
					if (loadItem.id == item || loadItem.src == item) {
						this._loadQueueBackup.splice(i, 1)[0].cancel();
						break;
					}
				}

				if (r) {
					this._disposeItem(this.getItem(item));
				} else {
					for (var i = this._currentLoads.length - 1; i >= 0; i--) {
						var loadItem = this._currentLoads[i].getItem();
						if (loadItem.id == item || loadItem.src == item) {
							this._currentLoads.splice(i, 1)[0].cancel();
							itemsWereRemoved = true;
							break;
						}
					}
				}
			}

			// If this was called during a load, try to load the next item.
			if (itemsWereRemoved) {
				this._loadNext();
			}
		}
	};

	/**
	 * Stops all open loads, destroys any loaded items, and resets the queue, so all items can
	 * be reloaded again by calling {{#crossLink "AbstractLoader/load"}}{{/crossLink}}. Items are not removed from the
	 * queue. To remove items use the {{#crossLink "LoadQueue/remove"}}{{/crossLink}} or
	 * {{#crossLink "LoadQueue/removeAll"}}{{/crossLink}} method.
	 * @method reset
	 * @since 0.3.0
	 */
	p.reset = function () {
		this.close();
		for (var n in this._loadItemsById) {
			this._disposeItem(this._loadItemsById[n]);
		}

		//Reset the queue to its start state
		var a = [];
		for (var i = 0, l = this._loadQueueBackup.length; i < l; i++) {
			a.push(this._loadQueueBackup[i].getItem());
		}

		this.loadManifest(a, false);
	};

	/**
	 * Register a plugin. Plugins can map to load types (sound, image, etc), or specific extensions (png, mp3, etc).
	 * Currently, only one plugin can exist per type/extension.
	 *
	 * When a plugin is installed, a <code>getPreloadHandlers()</code> method will be called on it. For more information
	 * on this method, check out the {{#crossLink "SamplePlugin/getPreloadHandlers"}}{{/crossLink}} method in the
	 * {{#crossLink "SamplePlugin"}}{{/crossLink}} class.
	 *
	 * Before a file is loaded, a matching plugin has an opportunity to modify the load. If a `callback` is returned
	 * from the {{#crossLink "SamplePlugin/getPreloadHandlers"}}{{/crossLink}} method, it will be invoked first, and its
	 * result may cancel or modify the item. The callback method can also return a `completeHandler` to be fired when
	 * the file is loaded, or a `tag` object, which will manage the actual download. For more information on these
	 * methods, check out the {{#crossLink "SamplePlugin/preloadHandler"}}{{/crossLink}} and {{#crossLink "SamplePlugin/fileLoadHandler"}}{{/crossLink}}
	 * methods on the {{#crossLink "SamplePlugin"}}{{/crossLink}}.
	 *
	 * @method installPlugin
	 * @param {Function} plugin The plugin class to install.
	 */
	p.installPlugin = function (plugin) {
		if (plugin == null) {
			return;
		}

		if (plugin.getPreloadHandlers != null) {
			this._plugins.push(plugin);
			var map = plugin.getPreloadHandlers();
			map.scope = plugin;

			if (map.types != null) {
				for (var i = 0, l = map.types.length; i < l; i++) {
					this._typeCallbacks[map.types[i]] = map;
				}
			}

			if (map.extensions != null) {
				for (i = 0, l = map.extensions.length; i < l; i++) {
					this._extensionCallbacks[map.extensions[i]] = map;
				}
			}
		}
	};

	/**
	 * Set the maximum number of concurrent connections. Note that browsers and servers may have a built-in maximum
	 * number of open connections, so any additional connections may remain in a pending state until the browser
	 * opens the connection. When loading scripts using tags, and when {{#crossLink "LoadQueue/maintainScriptOrder:property"}}{{/crossLink}}
	 * is `true`, only one script is loaded at a time due to browser limitations.
	 *
	 * <h4>Example</h4>
	 *
	 *      var queue = new createjs.LoadQueue();
	 *      queue.setMaxConnections(10); // Allow 10 concurrent loads
	 *
	 * @method setMaxConnections
	 * @param {Number} value The number of concurrent loads to allow. By default, only a single connection per LoadQueue
	 * is open at any time.
	 */
	p.setMaxConnections = function (value) {
		this._maxConnections = value;
		if (!this._paused && this._loadQueue.length > 0) {
			this._loadNext();
		}
	};

	/**
	 * Load a single file. To add multiple files at once, use the {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}}
	 * method.
	 *
	 * Files are always appended to the current queue, so this method can be used multiple times to add files.
	 * To clear the queue first, use the {{#crossLink "AbstractLoader/close"}}{{/crossLink}} method.
	 * @method loadFile
	 * @param {LoadItem|Object|String} file The file object or path to load. A file can be either
	 * <ul>
	 *     <li>A {{#crossLink "LoadItem"}}{{/crossLink}} instance</li>
	 *     <li>An object containing properties defined by {{#crossLink "LoadItem"}}{{/crossLink}}</li>
	 *     <li>OR A string path to a resource. Note that this kind of load item will be converted to a {{#crossLink "LoadItem"}}{{/crossLink}}
	 *     in the background.</li>
	 * </ul>
	 * @param {Boolean} [loadNow=true] Kick off an immediate load (true) or wait for a load call (false). The default
	 * value is true. If the queue is paused using {{#crossLink "LoadQueue/setPaused"}}{{/crossLink}}, and the value is
	 * `true`, the queue will resume automatically.
	 * @param {String} [basePath] A base path that will be prepended to each file. The basePath argument overrides the
	 * path specified in the constructor. Note that if you load a manifest using a file of type {{#crossLink "Types/MANIFEST:property"}}{{/crossLink}},
	 * its files will <strong>NOT</strong> use the basePath parameter. <strong>The basePath parameter is deprecated.</strong>
	 * This parameter will be removed in a future version. Please either use the `basePath` parameter in the LoadQueue
	 * constructor, or a `path` property in a manifest definition.
	 */
	p.loadFile = function (file, loadNow, basePath) {
		if (file == null) {
			var event = new createjs.ErrorEvent("PRELOAD_NO_FILE");
			this._sendError(event);
			return;
		}
		this._addItem(file, null, basePath);

		if (loadNow !== false) {
			this.setPaused(false);
		} else {
			this.setPaused(true);
		}
	};

	/**
	 * Load an array of files. To load a single file, use the {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}} method.
	 * The files in the manifest are requested in the same order, but may complete in a different order if the max
	 * connections are set above 1 using {{#crossLink "LoadQueue/setMaxConnections"}}{{/crossLink}}. Scripts will load
	 * in the right order as long as {{#crossLink "LoadQueue/maintainScriptOrder"}}{{/crossLink}} is true (which is
	 * default).
	 *
	 * Files are always appended to the current queue, so this method can be used multiple times to add files.
	 * To clear the queue first, use the {{#crossLink "AbstractLoader/close"}}{{/crossLink}} method.
	 * @method loadManifest
	 * @param {Array|String|Object} manifest An list of files to load. The loadManifest call supports four types of
	 * manifests:
	 * <ol>
	 *     <li>A string path, which points to a manifest file, which is a JSON file that contains a "manifest" property,
	 *     which defines the list of files to load, and can optionally contain a "path" property, which will be
	 *     prepended to each file in the list.</li>
	 *     <li>An object which defines a "src", which is a JSON or JSONP file. A "callback" can be defined for JSONP
	 *     file. The JSON/JSONP file should contain a "manifest" property, which defines the list of files to load,
	 *     and can optionally contain a "path" property, which will be prepended to each file in the list.</li>
	 *     <li>An object which contains a "manifest" property, which defines the list of files to load, and can
	 *     optionally contain a "path" property, which will be prepended to each file in the list.</li>
	 *     <li>An Array of files to load.</li>
	 * </ol>
	 *
	 * Each "file" in a manifest can be either:
	 * <ul>
	 *     <li>A {{#crossLink "LoadItem"}}{{/crossLink}} instance</li>
	 *     <li>An object containing properties defined by {{#crossLink "LoadItem"}}{{/crossLink}}</li>
	 *     <li>OR A string path to a resource. Note that this kind of load item will be converted to a {{#crossLink "LoadItem"}}{{/crossLink}}
	 *     in the background.</li>
	 * </ul>
	 *
	 * @param {Boolean} [loadNow=true] Kick off an immediate load (true) or wait for a load call (false). The default
	 * value is true. If the queue is paused using {{#crossLink "LoadQueue/setPaused"}}{{/crossLink}} and this value is
	 * `true`, the queue will resume automatically.
	 * @param {String} [basePath] A base path that will be prepended to each file. The basePath argument overrides the
	 * path specified in the constructor. Note that if you load a manifest using a file of type {{#crossLink "LoadQueue/MANIFEST:property"}}{{/crossLink}},
	 * its files will <strong>NOT</strong> use the basePath parameter. <strong>The basePath parameter is deprecated.</strong>
	 * This parameter will be removed in a future version. Please either use the `basePath` parameter in the LoadQueue
	 * constructor, or a `path` property in a manifest definition.
	 */
	p.loadManifest = function (manifest, loadNow, basePath) {
		var fileList = null;
		var path = null;

		// Array-based list of items
		if (Array.isArray(manifest)) {
			if (manifest.length == 0) {
				var event = new createjs.ErrorEvent("PRELOAD_MANIFEST_EMPTY");
				this._sendError(event);
				return;
			}
			fileList = manifest;

			// String-based. Only file manifests can be specified this way. Any other types will cause an error when loaded.
		} else if (typeof(manifest) === "string") {
			fileList = [
				{
					src: manifest,
					type: s.MANIFEST
				}
			];

		} else if (typeof(manifest) == "object") {

			// An object that defines a manifest path
			if (manifest.src !== undefined) {
				if (manifest.type == null) {
					manifest.type = s.MANIFEST;
				} else if (manifest.type != s.MANIFEST) {
					var event = new createjs.ErrorEvent("PRELOAD_MANIFEST_TYPE");
					this._sendError(event);
				}
				fileList = [manifest];

				// An object that defines a manifest
			} else if (manifest.manifest !== undefined) {
				fileList = manifest.manifest;
				path = manifest.path;
			}

			// Unsupported. This will throw an error.
		} else {
			var event = new createjs.ErrorEvent("PRELOAD_MANIFEST_NULL");
			this._sendError(event);
			return;
		}

		for (var i = 0, l = fileList.length; i < l; i++) {
			this._addItem(fileList[i], path, basePath);
		}

		if (loadNow !== false) {
			this.setPaused(false);
		} else {
			this.setPaused(true);
		}

	};

	/**
	 * Start a LoadQueue that was created, but not automatically started.
	 * @method load
	 */
	p.load = function () {
		this.setPaused(false);
	};

	/**
	 * Look up a {{#crossLink "LoadItem"}}{{/crossLink}} using either the "id" or "src" that was specified when loading it. Note that if no "id" was
	 * supplied with the load item, the ID will be the "src", including a `path` property defined by a manifest. The
	 * `basePath` will not be part of the ID.
	 * @method getItem
	 * @param {String} value The <code>id</code> or <code>src</code> of the load item.
	 * @return {Object} The load item that was initially requested using {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}}
	 * or {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}}. This object is also returned via the {{#crossLink "LoadQueue/fileload:event"}}{{/crossLink}}
	 * event as the `item` parameter.
	 */
	p.getItem = function (value) {
		return this._loadItemsById[value] || this._loadItemsBySrc[value];
	};

	/**
	 * Look up a loaded result using either the "id" or "src" that was specified when loading it. Note that if no "id"
	 * was supplied with the load item, the ID will be the "src", including a `path` property defined by a manifest. The
	 * `basePath` will not be part of the ID.
	 * @method getResult
	 * @param {String} value The <code>id</code> or <code>src</code> of the load item.
	 * @param {Boolean} [rawResult=false] Return a raw result instead of a formatted result. This applies to content
	 * loaded via XHR such as scripts, XML, CSS, and Images. If there is no raw result, the formatted result will be
	 * returned instead.
	 * @return {Object} A result object containing the content that was loaded, such as:
	 * <ul>
	 *      <li>An image tag (&lt;image /&gt;) for images</li>
	 *      <li>A script tag for JavaScript (&lt;script /&gt;). Note that scripts are automatically added to the HTML
	 *      DOM.</li>
	 *      <li>A style tag for CSS (&lt;style /&gt; or &lt;link &gt;)</li>
	 *      <li>Raw text for TEXT</li>
	 *      <li>A formatted JavaScript object defined by JSON</li>
	 *      <li>An XML document</li>
	 *      <li>A binary arraybuffer loaded by XHR</li>
	 *      <li>An audio tag (&lt;audio &gt;) for HTML audio. Note that it is recommended to use SoundJS APIs to play
	 *      loaded audio. Specifically, audio loaded by Flash and WebAudio will return a loader object using this method
	 *      which can not be used to play audio back.</li>
	 * </ul>
	 * This object is also returned via the {{#crossLink "LoadQueue/fileload:event"}}{{/crossLink}} event as the 'item`
	 * parameter. Note that if a raw result is requested, but not found, the result will be returned instead.
	 */
	p.getResult = function (value, rawResult) {
		var item = this._loadItemsById[value] || this._loadItemsBySrc[value];
		if (item == null) {
			return null;
		}
		var id = item.id;
		if (rawResult && this._loadedRawResults[id]) {
			return this._loadedRawResults[id];
		}
		return this._loadedResults[id];
	};

	/**
	 * Generate an list of items loaded by this queue.
	 * @method getItems
	 * @param {Boolean} loaded Determines if only items that have been loaded should be returned. If false, in-progress
	 * and failed load items will also be included.
	 * @returns {Array} A list of objects that have been loaded. Each item includes the {{#crossLink "LoadItem"}}{{/crossLink}},
	 * result, and rawResult.
	 * @since 0.6.0
	 */
	p.getItems = function (loaded) {
		var arr = [];
		for (var n in this._loadItemsById) {
			var item = this._loadItemsById[n];
			var result = this.getResult(n);
			if (loaded === true && result == null) {
				continue;
			}
			arr.push({
				item: item,
				result: result,
				rawResult: this.getResult(n, true)
			});
		}
		return arr;
	};

	/**
	 * Pause or resume the current load. Active loads will not be cancelled, but the next items in the queue will not
	 * be processed when active loads complete. LoadQueues are not paused by default.
	 *
	 * Note that if new items are added to the queue using {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}} or
	 * {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}}, a paused queue will be resumed, unless the `loadNow`
	 * argument is `false`.
	 * @method setPaused
	 * @param {Boolean} value Whether the queue should be paused or not.
	 */
	p.setPaused = function (value) {
		this._paused = value;
		if (!this._paused) {
			this._loadNext();
		}
	};

	/**
	 * Close the active queue. Closing a queue completely empties the queue, and prevents any remaining items from
	 * starting to download. Note that currently any active loads will remain open, and events may be processed.
	 *
	 * To stop and restart a queue, use the {{#crossLink "LoadQueue/setPaused"}}{{/crossLink}} method instead.
	 * @method close
	 */
	p.close = function () {
		while (this._currentLoads.length) {
			this._currentLoads.pop().cancel();
		}
		this._scriptOrder.length = 0;
		this._loadedScripts.length = 0;
		this.loadStartWasDispatched = false;
		this._itemCount = 0;
		this._lastProgress = NaN;
	};

// protected methods
	/**
	 * Add an item to the queue. Items are formatted into a usable object containing all the properties necessary to
	 * load the content. The load queue is populated with the loader instance that handles preloading, and not the load
	 * item that was passed in by the user. To look up the load item by id or src, use the {{#crossLink "LoadQueue.getItem"}}{{/crossLink}}
	 * method.
	 * @method _addItem
	 * @param {String|Object} value The item to add to the queue.
	 * @param {String} [path] An optional path prepended to the `src`. The path will only be prepended if the src is
	 * relative, and does not start with a protocol such as `http://`, or a path like `../`. If the LoadQueue was
	 * provided a {{#crossLink "_basePath"}}{{/crossLink}}, then it will optionally be prepended after.
	 * @param {String} [basePath] <strong>Deprecated</strong>An optional basePath passed into a {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}}
	 * or {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}} call. This parameter will be removed in a future tagged
	 * version.
	 * @private
	 */
	p._addItem = function (value, path, basePath) {
		var item = this._createLoadItem(value, path, basePath); // basePath and manifest path are added to the src.
		if (item == null) {
			return;
		} // Sometimes plugins or types should be skipped.
		var loader = this._createLoader(item);
		if (loader != null) {
			if ("plugins" in loader) {
				loader.plugins = this._plugins;
			}
			item._loader = loader;
			this._loadQueue.push(loader);
			this._loadQueueBackup.push(loader);

			this._numItems++;
			this._updateProgress();

			// Only worry about script order when using XHR to load scripts. Tags are only loading one at a time.
			if ((this.maintainScriptOrder
					&& item.type == createjs.Types.JAVASCRIPT
						//&& loader instanceof createjs.XHRLoader //NOTE: Have to track all JS files this way
					)
					|| item.maintainOrder === true) {
				this._scriptOrder.push(item);
				this._loadedScripts.push(null);
			}
		}
	};

	/**
	 * Create a refined {{#crossLink "LoadItem"}}{{/crossLink}}, which contains all the required properties. The type of
	 * item is determined by browser support, requirements based on the file type, and developer settings. For example,
	 * XHR is only used for file types that support it in new browsers.
	 *
	 * Before the item is returned, any plugins registered to handle the type or extension will be fired, which may
	 * alter the load item.
	 * @method _createLoadItem
	 * @param {String | Object | HTMLAudioElement | HTMLImageElement} value The item that needs to be preloaded.
	 * @param {String} [path] A path to prepend to the item's source. Sources beginning with http:// or similar will
	 * not receive a path. Since PreloadJS 0.4.1, the src will be modified to include the `path` and {{#crossLink "LoadQueue/_basePath:property"}}{{/crossLink}}
	 * when it is added.
	 * @param {String} [basePath] <strong>Deprectated</strong> A base path to prepend to the items source in addition to
	 * the path argument.
	 * @return {Object} The loader instance that will be used.
	 * @private
	 */
	p._createLoadItem = function (value, path, basePath) {
		var item = createjs.LoadItem.create(value);
		if (item == null) {
			return null;
		}

		var bp = ""; // Store the generated basePath
		var useBasePath = basePath || this._basePath;

		if (item.src instanceof Object) {
			if (!item.type) {
				return null;
			} // the the src is an object, type is required to pass off to plugin
			if (path) {
				bp = path;
				var pathMatch = createjs.URLUtils.parseURI(path);
				// Also append basePath
				if (useBasePath != null && !pathMatch.absolute && !pathMatch.relative) {
					bp = useBasePath + bp;
				}
			} else if (useBasePath != null) {
				bp = useBasePath;
			}
		} else {
			// Determine Extension, etc.
			var match = createjs.URLUtils.parseURI(item.src);
			if (match.extension) {
				item.ext = match.extension;
			}
			if (item.type == null) {
				item.type = createjs.RequestUtils.getTypeByExtension(item.ext);
			}

			// Inject path & basePath
			var autoId = item.src;
			if (!match.absolute && !match.relative) {
				if (path) {
					bp = path;
					var pathMatch = createjs.URLUtils.parseURI(path);
					autoId = path + autoId;
					// Also append basePath
					if (useBasePath != null && !pathMatch.absolute && !pathMatch.relative) {
						bp = useBasePath + bp;
					}
				} else if (useBasePath != null) {
					bp = useBasePath;
				}
			}
			item.src = bp + item.src;
		}
		item.path = bp;

		// If there's no id, set one now.
		if (item.id === undefined || item.id === null || item.id === "") {
			item.id = autoId;
		}

		// Give plugins a chance to modify the loadItem:
		var customHandler = this._typeCallbacks[item.type] || this._extensionCallbacks[item.ext];
		if (customHandler) {
			// Plugins are now passed both the full source, as well as a combined path+basePath (appropriately)
			var result = customHandler.callback.call(customHandler.scope, item, this);

			// The plugin will handle the load, or has canceled it. Ignore it.
			if (result === false) {
				return null;

				// Load as normal:
			} else if (result === true) {
				// Do Nothing

				// Result is a loader class:
			} else if (result != null) {
				item._loader = result;
			}

			// Update the extension in case the type changed:
			match = createjs.URLUtils.parseURI(item.src);
			if (match.extension != null) {
				item.ext = match.extension;
			}
		}

		// Store the item for lookup. This also helps clean-up later.
		this._loadItemsById[item.id] = item;
		this._loadItemsBySrc[item.src] = item;

		if (item.crossOrigin == null) {
			item.crossOrigin = this._crossOrigin;
		}

		return item;
	};

	/**
	 * Create a loader for a load item.
	 * @method _createLoader
	 * @param {Object} item A formatted load item that can be used to generate a loader.
	 * @return {AbstractLoader} A loader that can be used to load content.
	 * @private
	 */
	p._createLoader = function (item) {
		if (item._loader != null) { // A plugin already specified a loader
			return item._loader;
		}

		// Initially, try and use the provided/supported XHR mode:
		var preferXHR = this.preferXHR;

		for (var i = 0; i < this._availableLoaders.length; i++) {
			var loader = this._availableLoaders[i];
			if (loader && loader.canLoadItem(item)) {
				return new loader(item, preferXHR);
			}
		}

		// TODO: Log error (requires createjs.log)
		return null;
	};

	/**
	 * Load the next item in the queue. If the queue is empty (all items have been loaded), then the complete event
	 * is processed. The queue will "fill up" any empty slots, up to the max connection specified using
	 * {{#crossLink "LoadQueue.setMaxConnections"}}{{/crossLink}} method. The only exception is scripts that are loaded
	 * using tags, which have to be loaded one at a time to maintain load order.
	 * @method _loadNext
	 * @private
	 */
	p._loadNext = function () {
		if (this._paused) {
			return;
		}

		// Only dispatch loadstart event when the first file is loaded.
		if (!this._loadStartWasDispatched) {
			this._sendLoadStart();
			this._loadStartWasDispatched = true;
		}

		// The queue has completed.
		if (this._numItems == this._numItemsLoaded) {
			this.loaded = true;
			this._sendComplete();

			// Load the next queue, if it has been defined.
			if (this.next && this.next.load) {
				this.next.load();
			}
		} else {
			this.loaded = false;
		}

		// Must iterate forwards to load in the right order.
		for (var i = 0; i < this._loadQueue.length; i++) {
			if (this._currentLoads.length >= this._maxConnections) {
				break;
			}
			var loader = this._loadQueue[i];

			// Determine if we should be only loading one tag-script at a time:
			// Note: maintainOrder items don't do anything here because we can hold onto their loaded value
			if (!this._canStartLoad(loader)) {
				continue;
			}
			this._loadQueue.splice(i, 1);
			i--;
			this._loadItem(loader);
		}
	};

	/**
	 * Begin loading an item. Event listeners are not added to the loaders until the load starts.
	 * @method _loadItem
	 * @param {AbstractLoader} loader The loader instance to start. Currently, this will be an XHRLoader or TagLoader.
	 * @private
	 */
	p._loadItem = function (loader) {
		loader.on("fileload", this._handleFileLoad, this);
		loader.on("progress", this._handleProgress, this);
		loader.on("complete", this._handleFileComplete, this);
		loader.on("error", this._handleError, this);
		loader.on("fileerror", this._handleFileError, this);
		this._currentLoads.push(loader);
		this._sendFileStart(loader.getItem());
		loader.load();
	};

	/**
	 * The callback that is fired when a loader loads a file. This enables loaders like {{#crossLink "ManifestLoader"}}{{/crossLink}}
	 * to maintain internal queues, but for this queue to dispatch the {{#crossLink "fileload:event"}}{{/crossLink}}
	 * events.
	 * @param {Event} event The {{#crossLink "AbstractLoader/fileload:event"}}{{/crossLink}} event from the loader.
	 * @private
	 * @since 0.6.0
	 */
	p._handleFileLoad = function (event) {
		event.target = null;
		this.dispatchEvent(event);
	};

	/**
	 * The callback that is fired when a loader encounters an error from an internal file load operation. This enables
	 * loaders like M
	 * @param event
	 * @private
	 */
	p._handleFileError = function (event) {
		var newEvent = new createjs.ErrorEvent("FILE_LOAD_ERROR", null, event.item);
		this._sendError(newEvent);
	};

	/**
	 * The callback that is fired when a loader encounters an error. The queue will continue loading unless {{#crossLink "LoadQueue/stopOnError:property"}}{{/crossLink}}
	 * is set to `true`.
	 * @method _handleError
	 * @param {ErrorEvent} event The error event, containing relevant error information.
	 * @private
	 */
	p._handleError = function (event) {
		var loader = event.target;
		this._numItemsLoaded++;

		this._finishOrderedItem(loader, true);
		this._updateProgress();

		var newEvent = new createjs.ErrorEvent("FILE_LOAD_ERROR", null, loader.getItem());
		// TODO: Propagate actual error message.

		this._sendError(newEvent);

		if (!this.stopOnError) {
			this._removeLoadItem(loader);
			this._cleanLoadItem(loader);
			this._loadNext();
		} else {
			this.setPaused(true);
		}
	};

	/**
	 * An item has finished loading. We can assume that it is totally loaded, has been parsed for immediate use, and
	 * is available as the "result" property on the load item. The raw text result for a parsed item (such as JSON, XML,
	 * CSS, JavaScript, etc) is available as the "rawResult" property, and can also be looked up using {{#crossLink "LoadQueue/getResult"}}{{/crossLink}}.
	 * @method _handleFileComplete
	 * @param {Event} event The event object from the loader.
	 * @private
	 */
	p._handleFileComplete = function (event) {
		var loader = event.target;
		var item = loader.getItem();

		var result = loader.getResult();
		this._loadedResults[item.id] = result;
		var rawResult = loader.getResult(true);
		if (rawResult != null && rawResult !== result) {
			this._loadedRawResults[item.id] = rawResult;
		}

		this._saveLoadedItems(loader);

		// Remove the load item
		this._removeLoadItem(loader);

		if (!this._finishOrderedItem(loader)) {
			// The item was NOT managed, so process it now
			this._processFinishedLoad(item, loader);
		}

		// Clean up the load item
		this._cleanLoadItem(loader);
	};

	/**
	 * Some loaders might load additional content, other than the item they were passed (such as {{#crossLink "ManifestLoader"}}{{/crossLink}}).
	 * Any items exposed by the loader using {{#crossLink "AbstractLoader/getLoadItems"}}{{/crossLink}} are added to the
	 * LoadQueue's look-ups, including {{#crossLink "getItem"}}{{/crossLink}} and {{#crossLink "getResult"}}{{/crossLink}}
	 * methods.
	 * @method _saveLoadedItems
	 * @param {AbstractLoader} loader
	 * @protected
	 * @since 0.6.0
	 */
	p._saveLoadedItems = function (loader) {
		// TODO: Not sure how to handle this. Would be nice to expose the items.
		// Loaders may load sub-items. This adds them to this queue
		var list = loader.getLoadedItems();
		if (list === null) {
			return;
		}

		for (var i = 0; i < list.length; i++) {
			var item = list[i].item;

			// Store item lookups
			this._loadItemsBySrc[item.src] = item;
			this._loadItemsById[item.id] = item;

			// Store loaded content
			this._loadedResults[item.id] = list[i].result;
			this._loadedRawResults[item.id] = list[i].rawResult;
		}
	};

	/**
	 * Flag an item as finished. If the item's order is being managed, then ensure that it is allowed to finish, and if
	 * so, trigger prior items to trigger as well.
	 * @method _finishOrderedItem
	 * @param {AbstractLoader} loader
	 * @param {Boolean} loadFailed
	 * @return {Boolean} If the item's order is being managed. This allows the caller to take an alternate
	 * behaviour if it is.
	 * @private
	 */
	p._finishOrderedItem = function (loader, loadFailed) {
		var item = loader.getItem();

		if ((this.maintainScriptOrder && item.type == createjs.Types.JAVASCRIPT)
				|| item.maintainOrder) {

			//TODO: Evaluate removal of the _currentlyLoadingScript
			if (loader instanceof createjs.JavaScriptLoader) {
				this._currentlyLoadingScript = false;
			}

			var index = createjs.indexOf(this._scriptOrder, item);
			if (index == -1) {
				return false;
			} // This loader no longer exists
			this._loadedScripts[index] = (loadFailed === true) ? true : item;

			this._checkScriptLoadOrder();
			return true;
		}

		return false;
	};

	/**
	 * Ensure the scripts load and dispatch in the correct order. When using XHR, scripts are stored in an array in the
	 * order they were added, but with a "null" value. When they are completed, the value is set to the load item,
	 * and then when they are processed and dispatched, the value is set to `true`. This method simply
	 * iterates the array, and ensures that any loaded items that are not preceded by a `null` value are
	 * dispatched.
	 * @method _checkScriptLoadOrder
	 * @private
	 */
	p._checkScriptLoadOrder = function () {
		var l = this._loadedScripts.length;

		for (var i = 0; i < l; i++) {
			var item = this._loadedScripts[i];
			if (item === null) {
				break;
			} // This is still loading. Do not process further.
			if (item === true) {
				continue;
			} // This has completed, and been processed. Move on.

			var loadItem = this._loadedResults[item.id];
			if (item.type == createjs.Types.JAVASCRIPT) {
				// Append script tags to the head automatically.
				createjs.DomUtils.appendToHead(loadItem);
			}

			var loader = item._loader;
			this._processFinishedLoad(item, loader);
			this._loadedScripts[i] = true;
		}
	};

	/**
	 * A file has completed loading, and the LoadQueue can move on. This triggers the complete event, and kick-starts
	 * the next item.
	 * @method _processFinishedLoad
	 * @param {LoadItem|Object} item
	 * @param {AbstractLoader} loader
	 * @protected
	 */
	p._processFinishedLoad = function (item, loader) {
		this._numItemsLoaded++;

		// Since LoadQueue needs maintain order, we can't append scripts in the loader.
		// So we do it here instead. Or in _checkScriptLoadOrder();
		if (!this.maintainScriptOrder && item.type == createjs.Types.JAVASCRIPT) {
			var tag = loader.getTag();
			createjs.DomUtils.appendToHead(tag);
		}

		this._updateProgress();
		this._sendFileComplete(item, loader);
		this._loadNext();
	};

	/**
	 * Ensure items with `maintainOrder=true` that are before the specified item have loaded. This only applies to
	 * JavaScript items that are being loaded with a TagLoader, since they have to be loaded and completed <strong>before</strong>
	 * the script can even be started, since it exist in the DOM while loading.
	 * @method _canStartLoad
	 * @param {AbstractLoader} loader The loader for the item
	 * @return {Boolean} Whether the item can start a load or not.
	 * @private
	 */
	p._canStartLoad = function (loader) {
		if (!this.maintainScriptOrder || loader.preferXHR) {
			return true;
		}
		var item = loader.getItem();
		if (item.type != createjs.Types.JAVASCRIPT) {
			return true;
		}
		if (this._currentlyLoadingScript) {
			return false;
		}

		var index = this._scriptOrder.indexOf(item);
		var i = 0;
		while (i < index) {
			var checkItem = this._loadedScripts[i];
			if (checkItem == null) {
				return false;
			}
			i++;
		}
		this._currentlyLoadingScript = true;
		return true;
	};

	/**
	 * A load item is completed or was canceled, and needs to be removed from the LoadQueue.
	 * @method _removeLoadItem
	 * @param {AbstractLoader} loader A loader instance to remove.
	 * @private
	 */
	p._removeLoadItem = function (loader) {
		var l = this._currentLoads.length;
		for (var i = 0; i < l; i++) {
			if (this._currentLoads[i] == loader) {
				this._currentLoads.splice(i, 1);
				break;
			}
		}
	};

	/**
	 * Remove unneeded references from a loader.
	 *
	 * @param loader
	 * @private
	 */
	p._cleanLoadItem = function(loader) {
		var item = loader.getItem();
		if (item) {
			delete item._loader;
		}
	}

	/**
	 * An item has dispatched progress. Propagate that progress, and update the LoadQueue's overall progress.
	 * @method _handleProgress
	 * @param {ProgressEvent} event The progress event from the item.
	 * @private
	 */
	p._handleProgress = function (event) {
		var loader = event.target;
		this._sendFileProgress(loader.getItem(), loader.progress);
		this._updateProgress();
	};

	/**
	 * Overall progress has changed, so determine the new progress amount and dispatch it. This changes any time an
	 * item dispatches progress or completes. Note that since we don't always know the actual filesize of items before
	 * they are loaded. In this case, we define a "slot" for each item (1 item in 10 would get 10%), and then append
	 * loaded progress on top of the already-loaded items.
	 *
	 * For example, if 5/10 items have loaded, and item 6 is 20% loaded, the total progress would be:
	 * <ul>
	 *      <li>5/10 of the items in the queue (50%)</li>
	 *      <li>plus 20% of item 6's slot (2%)</li>
	 *      <li>equals 52%</li>
	 * </ul>
	 * @method _updateProgress
	 * @private
	 */
	p._updateProgress = function () {
		var loaded = this._numItemsLoaded / this._numItems; // Fully Loaded Progress
		var remaining = this._numItems - this._numItemsLoaded;
		if (remaining > 0) {
			var chunk = 0;
			for (var i = 0, l = this._currentLoads.length; i < l; i++) {
				chunk += this._currentLoads[i].progress;
			}
			loaded += (chunk / remaining) * (remaining / this._numItems);
		}

		if (this._lastProgress != loaded) {
			this._sendProgress(loaded);
			this._lastProgress = loaded;
		}
	};

	/**
	 * Clean out item results, to free them from memory. Mainly, the loaded item and results are cleared from internal
	 * hashes.
	 * @method _disposeItem
	 * @param {LoadItem|Object} item The item that was passed in for preloading.
	 * @private
	 */
	p._disposeItem = function (item) {
		delete this._loadedResults[item.id];
		delete this._loadedRawResults[item.id];
		delete this._loadItemsById[item.id];
		delete this._loadItemsBySrc[item.src];
	};

	/**
	 * Dispatch a "fileprogress" {{#crossLink "Event"}}{{/crossLink}}. Please see the LoadQueue {{#crossLink "LoadQueue/fileprogress:event"}}{{/crossLink}}
	 * event for details on the event payload.
	 * @method _sendFileProgress
	 * @param {LoadItem|Object} item The item that is being loaded.
	 * @param {Number} progress The amount the item has been loaded (between 0 and 1).
	 * @protected
	 */
	p._sendFileProgress = function (item, progress) {
		if (this._isCanceled() || this._paused) {
			return;
		}
		if (!this.hasEventListener("fileprogress")) {
			return;
		}

		//LM: Rework ProgressEvent to support this?
		var event = new createjs.Event("fileprogress");
		event.progress = progress;
		event.loaded = progress;
		event.total = 1;
		event.item = item;

		this.dispatchEvent(event);
	};

	/**
	 * Dispatch a fileload {{#crossLink "Event"}}{{/crossLink}}. Please see the {{#crossLink "LoadQueue/fileload:event"}}{{/crossLink}} event for
	 * details on the event payload.
	 * @method _sendFileComplete
	 * @param {LoadItemObject} item The item that is being loaded.
	 * @param {AbstractLoader} loader
	 * @protected
	 */
	p._sendFileComplete = function (item, loader) {
		if (this._isCanceled() || this._paused) {
			return;
		}

		var event = new createjs.Event("fileload");
		event.loader = loader;
		event.item = item;
		event.result = this._loadedResults[item.id];
		event.rawResult = this._loadedRawResults[item.id];

		// This calls a handler specified on the actual load item. Currently, the SoundJS plugin uses this.
		if (item.completeHandler) {
			item.completeHandler(event);
		}

		this.hasEventListener("fileload") && this.dispatchEvent(event);
	};

	/**
	 * Dispatch a filestart {{#crossLink "Event"}}{{/crossLink}} immediately before a file starts to load. Please see
	 * the {{#crossLink "LoadQueue/filestart:event"}}{{/crossLink}} event for details on the event payload.
	 * @method _sendFileStart
	 * @param {LoadItem|Object} item The item that is being loaded.
	 * @protected
	 */
	p._sendFileStart = function (item) {
		var event = new createjs.Event("filestart");
		event.item = item;
		this.hasEventListener("filestart") && this.dispatchEvent(event);
	};

	p.toString = function () {
		return "[PreloadJS LoadQueue]";
	};

	createjs.LoadQueue = createjs.promote(LoadQueue, "AbstractLoader");
}());

//##############################################################################
// TextLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for Text files.
	 * @class TextLoader
	 * @param {LoadItem|Object} loadItem
	 * @extends AbstractLoader
	 * @constructor
	 */
	function TextLoader(loadItem) {
		this.AbstractLoader_constructor(loadItem, true, createjs.Types.TEXT);
	};

	var p = createjs.extend(TextLoader, createjs.AbstractLoader);
	var s = TextLoader;

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader loads items that are of type {{#crossLink "Types/TEXT:property"}}{{/crossLink}},
	 * but is also the default loader if a file type can not be determined.
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.TEXT;
	};

	createjs.TextLoader = createjs.promote(TextLoader, "AbstractLoader");

}());

//##############################################################################
// BinaryLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for binary files. This is useful for loading web audio, or content that requires an ArrayBuffer.
	 * @class BinaryLoader
	 * @param {LoadItem|Object} loadItem
	 * @extends AbstractLoader
	 * @constructor
	 */
	function BinaryLoader(loadItem) {
		this.AbstractLoader_constructor(loadItem, true, createjs.Types.BINARY);
		this.on("initialize", this._updateXHR, this);
	};

	var p = createjs.extend(BinaryLoader, createjs.AbstractLoader);
	var s = BinaryLoader;

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/BINARY:property"}}{{/crossLink}}
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.BINARY;
	};

	// private methods
	/**
	 * Before the item loads, set the response type to "arraybuffer"
	 * @property _updateXHR
	 * @param {Event} event
	 * @private
	 */
	p._updateXHR = function (event) {
		event.loader.setResponseType("arraybuffer");
	};

	createjs.BinaryLoader = createjs.promote(BinaryLoader, "AbstractLoader");

}());

//##############################################################################
// CSSLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for CSS files.
	 * @class CSSLoader
	 * @param {LoadItem|Object} loadItem
	 * @param {Boolean} preferXHR
	 * @extends AbstractLoader
	 * @constructor
	 */
	function CSSLoader(loadItem, preferXHR) {
		this.AbstractLoader_constructor(loadItem, preferXHR, createjs.Types.CSS);

		// public properties
		this.resultFormatter = this._formatResult;

		// protected properties
		this._tagSrcAttribute = "href";

		if (preferXHR) {
			this._tag = createjs.Elements.style();
		} else {
			this._tag = createjs.Elements.link();
		}

		this._tag.rel = "stylesheet";
		this._tag.type = "text/css";
	};

	var p = createjs.extend(CSSLoader, createjs.AbstractLoader);
	var s = CSSLoader;

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/CSS:property"}}{{/crossLink}}.
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.CSS;
	};

	// protected methods
	/**
	 * The result formatter for CSS files.
	 * @method _formatResult
	 * @param {AbstractLoader} loader
	 * @returns {HTMLLinkElement|HTMLStyleElement}
	 * @private
	 */
	p._formatResult = function (loader) {
		if (this._preferXHR) {
			var tag = loader.getTag();

			if (tag.styleSheet) { // IE
				tag.styleSheet.cssText = loader.getResult(true);
			} else {
				var textNode = createjs.Elements.text(loader.getResult(true));
				tag.appendChild(textNode);
			}
		} else {
			tag = this._tag;
		}

		createjs.DomUtils.appendToHead(tag);

		return tag;
	};

	createjs.CSSLoader = createjs.promote(CSSLoader, "AbstractLoader");

}());

//##############################################################################
// FontLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

// constructor:
	/**
	 * A loader that handles font files, CSS definitions, and CSS paths. FontLoader doesn't actually preload fonts
	 * themselves, but rather generates CSS definitions, and then tests the size changes on an HTML5 Canvas element.
	 *
	 * Note that FontLoader does not support tag-based loading due to the requirement that CSS be read to determine the
	 * font definitions to test for.
	 * @class FontLoader
	 * @param {LoadItem|object|string} loadItem The item to be loaded.
	 * @extends AbstractLoader
	 * @constructor
	 **/
	function FontLoader(loadItem, preferXHR) {
		this.AbstractLoader_constructor(loadItem, preferXHR, loadItem.type);

		// private properties:
		/**
		 * A lookup of font faces to load.
		 * @property _faces
		 * @protected
		 * @type Object
		 **/
		this._faces = {};

		/**
		 * A list of font faces currently being "watched". Watched fonts will be tested on a regular interval, and be
		 * removed from this list when they are complete.
		 * @oroperty _watched
		 * @type {Array}
		 * @protected
		 */
		this._watched = [];

		/**
		 * A count of the total font faces to load.
		 * @property _count
		 * @type {number}
		 * @protected
		 * @default 0
		 */
		this._count = 0;

		/**
		 * The interval for checking if fonts have been loaded.
		 * @property _watchInterval
		 * @type {Number}
		 * @protected
		 */
		this._watchInterval = null;

		/**
		 * The timeout for determining if a font can't be loaded. Uses the LoadItem {{#crossLink "LoadImte/timeout:property"}}{{/crossLink}}
		 * value.
		 * @property _loadTimeout
		 * @type {Number}
		 * @protected
		 */
		this._loadTimeout = null;
		/**
		 * Determines if generated CSS should be injected into the document.
		 * @property _injectCSS
		 * @type {boolean}
		 * @protected
		 */
		this._injectCSS = (loadItem.injectCSS === undefined) ? true : loadItem.injectCSS;

		this.dispatchEvent("initialize");
	}
	var p = createjs.extend(FontLoader, createjs.AbstractLoader);

    /**
     * Determines if the loader can load a specific item. This loader can only load items that are of type
     * {{#crossLink "Types/FONT:property"}}{{/crossLink}}.
     * @method canLoadItem
     * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
     * @returns {Boolean} Whether the loader can load the item.
     * @static
     */
    FontLoader.canLoadItem = function (item) {
        return item.type == createjs.Types.FONT || item.type == createjs.Types.FONTCSS;
    };

// static properties:
	/**
	 * Sample text used by the FontLoader to determine if the font has been loaded. The sample text size is compared
	 * to the loaded font size, and a change indicates that the font has completed.
	 * @property sampleText
	 * @type {String}
	 * @default abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ
	 * @static
	 * @private
	 */
	FontLoader.sampleText = "abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	/**
	 * The canvas context used to test the font size. Note that this currently requires an HTML DOM.
	 * @property _ctx
	 * @type {CanvasRenderingContext2D}
	 * @static
	 * @private
	 */
	FontLoader._ctx = document.createElement("canvas").getContext("2d"); // TODO: Consider a method to do this like EaselJS Stage has.

	/**
	 * A list of reference fonts to test. Multiple faces are tested to address the rare case of a loaded font being the
	 * exact same dimensions as the test font.
	 * @property _referenceFonts
	 * @type {Array}
	 * @default ["serif", "monospace"]
	 * @private
	 */
	FontLoader._referenceFonts = ["serif","monospace"];

	/**
	 * A regular expression that pulls out possible style values from the font name.
	 * <ul>
	 *     <li>This includes font names that include thin, normal, book, regular, medium, black, and heavy (such as
	 *     "Arial Black")</li>
	 *     <li>Weight modifiers including extra, ultra, semi, demi, light, and bold (such as "WorkSans SemiBold")</li>
	 * </ul>
	 *
	 * Weight descriptions map to font weight values by default using the following (from
	 * http://www.w3.org/TR/css3-fonts/#font-weight-numeric-values):
	 * <ul>
	 *     <li>100 - Thin</li>
	 * 	   <li>200 - Extra Light, Ultra Light</li>
	 *     <li>300 - Light, Semi Light, Demi Light</li>
	 *     <li>400 - Normal, Book, Regular</li>
	 *     <li>500 - Medium</li>
	 *     <li>600 - Semi Bold, Demi Bold</li>
	 *     <li>700 - Bold</li>
	 *     <li>800 - Extra Bold, Ultra Bold</li>
	 *     <li>900 - Black, Heavy</li>
	 * </ul>
	 * @property WEIGHT_REGEX
	 * @type {RegExp}
	 * @static
	 */
	FontLoader.WEIGHT_REGEX = /[- ._]*(thin|normal|book|regular|medium|black|heavy|[1-9]00|(?:extra|ultra|semi|demi)?[- ._]*(?:light|bold))[- ._]*/ig;

	/**
	 * A regular expression that pulls out possible style values from the font name. These include "italic"
	 * and "oblique".
	 * @property STYLE_REGEX
	 * @type {RegExp}
	 * @static
	 */
	FontLoader.STYLE_REGEX = /[- ._]*(italic|oblique)[- ._]*/ig;

	/**
	 * A lookup of font types for generating a CSS definition. For example, TTF fonts requires a "truetype" type.
	 * @property FONT_FORMAT
	 * @type {Object}
	 * @static
	 */
	FontLoader.FONT_FORMAT = {woff2:"woff2", woff:"woff", ttf:"truetype", otf:"truetype"};

	/**
	 * A lookup of font weights based on a name. These values are from http://www.w3.org/TR/css3-fonts/#font-weight-numeric-values.
	 * @property FONT_WEIGHT
	 * @type {Object}
	 * @static
	 */
	FontLoader.FONT_WEIGHT = {thin:100, extralight:200, ultralight:200, light:300, semilight:300, demilight:300, book:"normal", regular:"normal", semibold:600, demibold:600, extrabold:800, ultrabold:800, black:900, heavy:900};

	/**
	 * The frequency in milliseconds to check for loaded fonts.
	 * @property WATCH_DURATION
	 * @type {number}
	 * @default 10
	 * @static
	 */
	FontLoader.WATCH_DURATION = 10;
// public methods:
	p.load = function() {
		if (this.type == createjs.Types.FONTCSS) {
			var loaded = this._watchCSS();

			// If the CSS is not ready, it will create a request, which AbstractLoader can handle.
			if (!loaded) {
				this.AbstractLoader_load();
				return;
			}

		} else if (this._item.src instanceof Array) {
			this._watchFontArray();
		} else {
			var def = this._defFromSrc(this._item.src);
			this._watchFont(def);
			this._injectStyleTag(this._cssFromDef(def));
		}

		this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);

		this.dispatchEvent("loadstart");
	};

	/**
	 * The font load has timed out. This is called via a <code>setTimeout</code>.
	 * callback.
	 * @method _handleTimeout
	 * @protected
	 */
	p._handleTimeout = function () {
		this._stopWatching();
		this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT"));
	};

	// WatchCSS does the work for us, and provides a modified src.
	p._createRequest = function() {
		return this._request;
	};

	// Events come from the internal XHR loader.
	p.handleEvent = function (event) {
		switch (event.type) {
			case "complete":
				this._rawResult = event.target._response;
				this._result = true;
				this._parseCSS(this._rawResult);
				break;

			case "error":
				this._stopWatching();
				this.AbstractLoader_handleEvent(event);
				break;
		}
	};

// private methods:
	/**
	 * Determine if the provided CSS is a string definition, CSS HTML element, or a CSS file URI. Depending on the
	 * format, the CSS will be parsed, or loaded.
	 * @method _watchCSS
	 * @returns {boolean} Whether or not the CSS is ready
	 * @protected
	 */
	p._watchCSS = function() {
		var src = this._item.src;

		// An HTMLElement was passed in. Just use it.
		if (src instanceof HTMLStyleElement) {
			if (this._injectCSS && !src.parentNode) { (document.head || document.getElementsByTagName('head')[0]).appendChild(src); }
			this._injectCSS = false;
			src = "\n"+src.textContent;
		}

		// A CSS string was passed in. Parse and use it
		if (src.search(/\n|\r|@font-face/i) !== -1) { // css string.
			this._parseCSS(src);
			return true;
		}

		// Load a CSS Path. Note that we CAN NOT load it without XHR because we need to read the CSS definition
		this._request = new createjs.XHRRequest(this._item);
		return false;
	};

	/**
	 * Parse a CSS string to determine the fonts to load.
	 * @method _parseCSS
	 * @param {String} css The CSS string to parse
	 * @protected
	 */
	p._parseCSS = function(css) {
		var regex = /@font-face\s*\{([^}]+)}/g
		while (true) {
			var result = regex.exec(css);
			if (!result) { break; }
			this._watchFont(this._parseFontFace(result[1]));
		}
		this._injectStyleTag(css);
	};

	/**
	 * The provided fonts were an array of object or string definitions. Parse them, and inject any that are ready.
	 * @method _watchFontArray
	 * @protected
	 */
	p._watchFontArray = function() {
		var arr = this._item.src, css = "", def;
		for (var i=arr.length-1; i>=0; i--) {
			var o = arr[i];
			if (typeof o === "string") { def = this._defFromSrc(o) }
			else { def = this._defFromObj(o); }
			this._watchFont(def);
			css += this._cssFromDef(def)+"\n";
		}
		this._injectStyleTag(css);
	};

	/**
	 * Inject any style definitions into the document head. This is necessary when the definition is just a string or
	 * object definition in order for the styles to be applied to the document. If the loaded fonts are already HTML CSS
	 * elements, they don't need to be appended again.
	 * @method _injectStyleTag
	 * @param {String} css The CSS string content to be appended to the
	 * @protected
	 */
	p._injectStyleTag = function(css) {
		if (!this._injectCSS) { return; }
		var head = document.head || document.getElementsByTagName('head')[0];
		var styleTag = document.createElement("style");
		styleTag.type = "text/css";
		if (styleTag.styleSheet){
			styleTag.styleSheet.cssText = css;
		} else {
			styleTag.appendChild(document.createTextNode(css));
		}
		head.appendChild(styleTag);
	};

	/**
	 * Determine the font face from a CSS definition.
	 * @method _parseFontFace
	 * @param {String} str The CSS string definition
	 * @protected
	 * @return {String} A modified CSS object containing family name, src, style, and weight
	 */
	p._parseFontFace = function(str) {
		var family = this._getCSSValue(str, "font-family"), src = this._getCSSValue(str, "src");
		if (!family || !src) { return null; }
		return this._defFromObj({
			family: family,
			src: src,
			style: this._getCSSValue(str, "font-style"),
			weight: this._getCSSValue(str, "font-weight")
		});
	};

	/**
	 * Add a font to the list of fonts currently being watched. If the font is already watched or loaded, it won't be
	 * added again.
	 * @method _watchFont
	 * @param {Object} def The font definition
	 * @protected
	 */
	p._watchFont = function(def) {
		if (!def || this._faces[def.id]) { return; }
		this._faces[def.id] = def;
		this._watched.push(def);
		this._count++;

		this._calculateReferenceSizes(def);
		this._startWatching();
	};

	/**
	 * Create a interval to check for loaded fonts. Only one interval is used for all fonts. The fonts are checked based
	 * on the {{#crossLink "FontLoader/WATCH_DURATION:property"}}{{/crossLink}}.
	 * @method _startWatching
	 * @protected
	 */
	p._startWatching = function() {
		if (this._watchInterval != null) { return; }
		this._watchInterval = setInterval(createjs.proxy(this._watch, this), FontLoader.WATCH_DURATION);
	};

	/**
	 * Clear the interval used to check fonts. This happens when all fonts are loaded, or an error occurs, such as a
	 * CSS file error, or a load timeout.
	 * @method _stopWatching
	 * @protected
	 */
	p._stopWatching = function() {
		clearInterval(this._watchInterval);
		clearTimeout(this._loadTimeout);
		this._watchInterval = null;
	};

	/**
	 * Check all the fonts that have not been loaded. The fonts are drawn to a canvas in memory, and if their font size
	 * varies from the default text size, then the font is considered loaded.
	 *
	 * A {{#crossLink "AbstractLoader/fileload"}}{{/crossLink}} event will be dispatched when each file is loaded, along
	 * with the font family name as the `item` value. A {{#crossLink "ProgressEvent"}}{{/crossLink}} is dispatched a
	 * maximum of one time per check when any fonts are loaded, with the {{#crossLink "ProgressEvent/progress:property"}}{{/crossLink}}
	 * value showing the percentage of fonts that have loaded.
	 * @method _watch
	 * @protected
	 */
	p._watch = function() {
		var defs = this._watched, refFonts = FontLoader._referenceFonts, l = defs.length;
		for (var i = l - 1; i >= 0; i--) {
			var def = defs[i], refs = def.refs;
			for (var j = refs.length - 1; j >= 0; j--) {
				var w = this._getTextWidth(def.family + "," + refFonts[j], def.weight, def.style);
				if (w != refs[j]) {
					var event = new createjs.Event("fileload");
					def.type = "font-family";
					event.item = def;
					this.dispatchEvent(event);
					defs.splice(i, 1);
					break;
				}
			}
		}
		if (l !== defs.length) {
			var event = new createjs.ProgressEvent(this._count-defs.length, this._count);
			this.dispatchEvent(event);
		}
		if (l === 0) {
			this._stopWatching();
			this._sendComplete();
		}
	};

	/**
	 * Determine the default size of the reference fonts used to compare against loaded fonts.
	 * @method _calculateReferenceSizes
	 * @param {Object} def The font definition to get the size of.
	 * @protected
	 */
	p._calculateReferenceSizes = function(def) {
		var refFonts = FontLoader._referenceFonts;
		var refs = def.refs = [];
		for (var i=0; i<refFonts.length; i++) {
			refs[i] = this._getTextWidth(refFonts[i], def.weight, def.style);
		}
	};

	/**
	 * Get a CSS definition from a font source and name.
	 * @method _defFromSrc
	 * @param {String} src The font source
	 * @protected
	 */
	p._defFromSrc = function(src) {
		var re = /[- ._]+/g, name = src, ext = null, index;

		index = name.search(/[?#]/);
		if (index !== -1) {
			name = name.substr(0,index);
		}
		index = name.lastIndexOf(".");
		if (index !== -1) {
			ext = name.substr(index+1);
			name = name.substr(0,index);
		}
		index = name.lastIndexOf("/");
		if (index !== -1) {
			name = name.substr(index+1);
		}

		var family = name,
				weight = family.match(FontLoader.WEIGHT_REGEX);
		if (weight) {
			weight = weight[0];
			family = family.replace(weight, "");
			weight = weight.replace(re, "").toLowerCase();
		}
		var style = name.match(FontLoader.STYLE_REGEX);
		if (style) {
			family = family.replace(style[0], "");
			style = "italic";
		}
		family = family.replace(re, "");

		var cssSrc = "local('"+name.replace(re," ")+"'), url('"+src+"')";
		var format = FontLoader.FONT_FORMAT[ext];
		if (format) { cssSrc += " format('"+format+"')"; }

		return this._defFromObj({
			family: family,
			weight: FontLoader.FONT_WEIGHT[weight]||weight,
			style: style,
			src: cssSrc
		});
	};

	/**
	 * Get a font definition from a raw font object.
	 * @method _defFromObj
	 * @param {Object} o A raw object provided to the FontLoader
	 * @returns {Object} A standard font object that the FontLoader understands
	 * @protected
	 */
	p._defFromObj = function(o) {
		var def = {
			family: o.family,
			src: o.src,
			style: o.style || "normal",
			weight: o.weight || "normal"
		};
		def.id = def.family + ";" + def.style + ";" + def.weight;
		return def;
	};

	/**
	 * Get CSS from a font definition.
	 * @method _cssFromDef
	 * @param {Object} def A font definition
	 * @returns {string} A CSS string representing the object
	 * @protected
	 */
	p._cssFromDef = function(def) {
		return "@font-face {\n" +
			"\tfont-family: '"+def.family+"';\n" +
			"\tfont-style: "+def.style+";\n" +
			"\tfont-weight: "+def.weight+";\n" +
			"\tsrc: "+def.src+";\n" +
			"}";
	};

	/**
	 * Get the text width of text using the family, weight, and style
	 * @method _getTextWidth
	 * @param {String} family The font family
	 * @param {String} weight The font weight
	 * @param {String} style The font style
	 * @returns {Number} The pixel measurement of the font.
	 * @protected
	 */
	p._getTextWidth = function(family, weight, style) {
		var ctx = FontLoader._ctx;
		ctx.font = style+" "+weight+" 72px "+family;
		return ctx.measureText(FontLoader.sampleText).width;
	};

	/**
	 * Get the value of a property from a CSS string. For example, searches a CSS string for the value of the
	 * "font-family" property.
	 * @method _getCSSValue
	 * @param {String} str The CSS string to search
	 * @param {String} propName The property name to get the value for
	 * @returns {String} The value in the CSS for the provided property name
	 * @protected
	 */
	p._getCSSValue = function(str, propName) {
		var regex = new RegExp(propName+":\s*([^;}]+?)\s*[;}]");
		var result = regex.exec(str);
		if (!result || !result[1]) { return null; }
		return result[1];
	};

	createjs.FontLoader = createjs.promote(FontLoader, "AbstractLoader");

})();

//##############################################################################
// ImageLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for image files.
	 * @class ImageLoader
	 * @param {LoadItem|Object} loadItem
	 * @param {Boolean} preferXHR
	 * @extends AbstractLoader
	 * @constructor
	 */
	function ImageLoader (loadItem, preferXHR) {
		this.AbstractLoader_constructor(loadItem, preferXHR, createjs.Types.IMAGE);

		// public properties
		this.resultFormatter = this._formatResult;

		// protected properties
		this._tagSrcAttribute = "src";

		// Check if the preload item is already a tag.
		if (createjs.DomUtils.isImageTag(loadItem)) {
			this._tag = loadItem;
		} else if (createjs.DomUtils.isImageTag(loadItem.src)) {
			this._tag = loadItem.src;
		} else if (createjs.DomUtils.isImageTag(loadItem.tag)) {
			this._tag = loadItem.tag;
		}

		if (this._tag != null) {
			this._preferXHR = false;
		} else {
			this._tag = createjs.Elements.img();
		}

		this.on("initialize", this._updateXHR, this);
	};

	var p = createjs.extend(ImageLoader, createjs.AbstractLoader);
	var s = ImageLoader;

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/IMAGE:property"}}{{/crossLink}}.
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.IMAGE;
	};

	// public methods
	p.load = function () {
		if (this._tag.src != "" && this._tag.complete) {
			this._sendComplete();
			return;
		}

		var crossOrigin = this._item.crossOrigin;
		if (crossOrigin == true) { crossOrigin = "Anonymous"; }
		if (crossOrigin != null && !createjs.URLUtils.isLocal(this._item)) {
			this._tag.crossOrigin = crossOrigin;
		}

		this.AbstractLoader_load();
	};

	// protected methods
	/**
	 * Before the item loads, set its mimeType and responseType.
	 * @property _updateXHR
	 * @param {Event} event
	 * @private
	 */
	p._updateXHR = function (event) {
		event.loader.mimeType = 'text/plain; charset=x-user-defined-binary';

		// Only exists for XHR
		if (event.loader.setResponseType) {
			event.loader.setResponseType("blob");
		}
	};

	/**
	 * The result formatter for Image files.
	 * @method _formatResult
	 * @param {AbstractLoader} loader
	 * @returns {HTMLImageElement}
	 * @private
	 */
	p._formatResult = function (loader) {
		return this._formatImage;
	};

	/**
	 * The asynchronous image formatter function. This is required because images have
	 * a short delay before they are ready.
	 * @method _formatImage
	 * @param {Function} successCallback The method to call when the result has finished formatting
	 * @param {Function} errorCallback The method to call if an error occurs during formatting
	 * @private
	 */
	p._formatImage = function (successCallback, errorCallback) {
		var tag = this._tag;
		var URL = window.URL || window.webkitURL;

		if (!this._preferXHR) {

			//document.body.removeChild(tag);
		} else if (URL) {
			var objURL = URL.createObjectURL(this.getResult(true));
			tag.src = objURL;

			tag.addEventListener("load", this._cleanUpURL, false);
			tag.addEventListener("error", this._cleanUpURL, false);
		} else {
			tag.src = this._item.src;
		}

		if (tag.complete) {
			successCallback(tag);
		} else {
            tag.onload = createjs.proxy(function() {
                successCallback(this._tag);
                tag.onload = tag.onerror = null;
            }, this);

            tag.onerror = createjs.proxy(function(event) {
                errorCallback(new createjs.ErrorEvent('IMAGE_FORMAT', null, event));
                tag.onload = tag.onerror = null;
            }, this);
		}
	};

	/**
	 * Clean up the ObjectURL, the tag is done with it. Note that this function is run
	 * as an event listener without a proxy/closure, as it doesn't require it - so do not
	 * include any functionality that requires scope without changing it.
	 * @method _cleanUpURL
	 * @param event
	 * @private
	 */
	p._cleanUpURL = function (event) {
		var URL = window.URL || window.webkitURL;
		URL.revokeObjectURL(event.target.src);
	};

	createjs.ImageLoader = createjs.promote(ImageLoader, "AbstractLoader");

}());

//##############################################################################
// JavaScriptLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for JavaScript files.
	 * @class JavaScriptLoader
	 * @param {LoadItem|Object} loadItem
	 * @param {Boolean} preferXHR
	 * @extends AbstractLoader
	 * @constructor
	 */
	function JavaScriptLoader(loadItem, preferXHR) {
		this.AbstractLoader_constructor(loadItem, preferXHR, createjs.Types.JAVASCRIPT);

		// public properties
		this.resultFormatter = this._formatResult;

		// protected properties
		this._tagSrcAttribute = "src";
		this.setTag(createjs.Elements.script());
	};

	var p = createjs.extend(JavaScriptLoader, createjs.AbstractLoader);
	var s = JavaScriptLoader;

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/JAVASCRIPT:property"}}{{/crossLink}}
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.JAVASCRIPT;
	};

	// protected methods
	/**
	 * The result formatter for JavaScript files.
	 * @method _formatResult
	 * @param {AbstractLoader} loader
	 * @returns {HTMLLinkElement|HTMLStyleElement}
	 * @private
	 */
	p._formatResult = function (loader) {
		var tag = loader.getTag();
		if (this._preferXHR) {
			tag.text = loader.getResult(true);
		}
		return tag;
	};

	createjs.JavaScriptLoader = createjs.promote(JavaScriptLoader, "AbstractLoader");

}());

//##############################################################################
// JSONLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for JSON files. To load JSON cross-domain, use JSONP and the {{#crossLink "JSONPLoader"}}{{/crossLink}}
	 * instead. To load JSON-formatted manifests, use {{#crossLink "ManifestLoader"}}{{/crossLink}}, and to
	 * load EaselJS SpriteSheets, use {{#crossLink "SpriteSheetLoader"}}{{/crossLink}}.
	 * @class JSONLoader
	 * @param {LoadItem|Object} loadItem
	 * @extends AbstractLoader
	 * @constructor
	 */
	function JSONLoader(loadItem) {
		this.AbstractLoader_constructor(loadItem, true, createjs.Types.JSON);

		// public properties
		this.resultFormatter = this._formatResult;
	};

	var p = createjs.extend(JSONLoader, createjs.AbstractLoader);
	var s = JSONLoader;

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/JSON:property"}}{{/crossLink}}.
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.JSON;
	};

	// protected methods
	/**
	 * The result formatter for JSON files.
	 * @method _formatResult
	 * @param {AbstractLoader} loader
	 * @returns {HTMLLinkElement|HTMLStyleElement}
	 * @private
	 */
	p._formatResult = function (loader) {
		var json = null;
		try {
			json = createjs.DataUtils.parseJSON(loader.getResult(true));
		} catch (e) {
			var event = new createjs.ErrorEvent("JSON_FORMAT", null, e);
			this._sendError(event);
			return e;
		}

		return json;
	};

	createjs.JSONLoader = createjs.promote(JSONLoader, "AbstractLoader");

}());

//##############################################################################
// JSONPLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for JSONP files, which are JSON-formatted text files, wrapped in a callback. To load regular JSON
	 * without a callback use the {{#crossLink "JSONLoader"}}{{/crossLink}} instead. To load JSON-formatted manifests,
	 * use {{#crossLink "ManifestLoader"}}{{/crossLink}}, and to load EaselJS SpriteSheets, use
	 * {{#crossLink "SpriteSheetLoader"}}{{/crossLink}}.
	 *
	 * JSONP is a format that provides a solution for loading JSON files cross-domain <em>without</em> requiring CORS.
	 * JSONP files are loaded as JavaScript, and the "callback" is executed once they are loaded. The callback in the
	 * JSONP must match the callback passed to the loadItem.
	 *
	 * <h4>Example JSONP</h4>
	 *
	 * 		callbackName({
	 * 			"name": "value",
	 *	 		"num": 3,
	 *			"obj": { "bool":true }
	 * 		});
	 *
	 * <h4>Example</h4>
	 *
	 * 		var loadItem = {id:"json", type:"jsonp", src:"http://server.com/text.json", callback:"callbackName"}
	 * 		var queue = new createjs.LoadQueue();
	 * 		queue.on("complete", handleComplete);
	 * 		queue.loadItem(loadItem);
	 *
	 * 		function handleComplete(event) }
	 * 			var json = queue.getResult("json");
	 * 			console.log(json.obj.bool); // true
	 * 		}
	 *
	 * JSONP files loaded concurrently require a <em>unique</em> callback. To ensure JSONP files are loaded in order,
	 * either use the {{#crossLink "LoadQueue/setMaxConnections"}}{{/crossLink}} method (set to 1), or set
	 * {{#crossLink "LoadItem/maintainOrder:property"}}{{/crossLink}} on items with the same callback.
	 *
	 * Important note: Some browsers will prevent JSONP from firing the callback if the file was loaded as JSON, and not
	 * JavaScript. You may have to have your server give you a JavaScript mime-type for this to work.
	 *
	 * @class JSONPLoader
	 * @param {LoadItem|Object} loadItem
	 * @extends AbstractLoader
	 * @constructor
	 */
	function JSONPLoader(loadItem) {
		this.AbstractLoader_constructor(loadItem, false, createjs.Types.JSONP);
		this.setTag(createjs.Elements.script());
		this.getTag().type = "text/javascript";
	};

	var p = createjs.extend(JSONPLoader, createjs.AbstractLoader);
	var s = JSONPLoader;


	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/JSONP:property"}}{{/crossLink}}.
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.JSONP;
	};

	// public methods
	p.cancel = function () {
		this.AbstractLoader_cancel();
		this._dispose();
	};

	/**
	 * Loads the JSONp file.  Because of the unique loading needs of JSONp
	 * we don't use the AbstractLoader.load() method.
	 *
	 * @method load
	 *
	 */
	p.load = function () {
		if (this._item.callback == null) {
			throw new Error('callback is required for loading JSONP requests.');
		}

		// TODO: Look into creating our own iFrame to handle the load
		// In the first attempt, FF did not get the result
		//   result instanceof Object did not work either
		//   so we would need to clone the result.
		if (window[this._item.callback] != null) {
			throw new Error(
				"JSONP callback '" +
				this._item.callback +
				"' already exists on window. You need to specify a different callback or re-name the current one.");
		}

		window[this._item.callback] = createjs.proxy(this._handleLoad, this);
		createjs.DomUtils.appendToBody(this._tag);

		this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);

		// Load the tag
		this._tag.src = this._item.src;
	};

	// private methods
	/**
	 * Handle the JSONP callback, which is a public method defined on `window`.
	 * @method _handleLoad
	 * @param {Object} data The formatted JSON data.
	 * @private
	 */
	p._handleLoad = function (data) {
		this._result = this._rawResult = data;
		this._sendComplete();

		this._dispose();
	};

	/**
	 * The tag request has not loaded within the time specfied in loadTimeout.
	 * @method _handleError
	 * @param {Object} event The XHR error event.
	 * @private
	 */
	p._handleTimeout = function () {
		this._dispose();
		this.dispatchEvent(new createjs.ErrorEvent("timeout"));
	};

	/**
	 * Clean up the JSONP load. This clears out the callback and script tag that this loader creates.
	 * @method _dispose
	 * @private
	 */
	p._dispose = function () {
		createjs.DomUtils.removeChild(this._tag);
		delete window[this._item.callback];

		clearTimeout(this._loadTimeout);
	};

	createjs.JSONPLoader = createjs.promote(JSONPLoader, "AbstractLoader");

}());

//##############################################################################
// ManifestLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for JSON manifests. Items inside the manifest are loaded before the loader completes. To load manifests
	 * using JSONP, specify a {{#crossLink "LoadItem/callback:property"}}{{/crossLink}} as part of the
	 * {{#crossLink "LoadItem"}}{{/crossLink}}.
	 *
	 * The list of files in the manifest must be defined on the top-level JSON object in a `manifest` property. This
	 * example shows a sample manifest definition, as well as how to to include a sub-manifest.
	 *
	 * 		{
	 * 			"path": "assets/",
	 *	 	    "manifest": [
	 *				"image.png",
	 *				{"src": "image2.png", "id":"image2"},
	 *				{"src": "sub-manifest.json", "type":"manifest", "callback":"jsonCallback"}
	 *	 	    ]
	 *	 	}
	 *
	 * When a ManifestLoader has completed loading, the parent loader (usually a {{#crossLink "LoadQueue"}}{{/crossLink}},
	 * but could also be another ManifestLoader) will inherit all the loaded items, so you can access them directly.
	 *
	 * Note that the {{#crossLink "JSONLoader"}}{{/crossLink}} and {{#crossLink "JSONPLoader"}}{{/crossLink}} are
	 * higher priority loaders, so manifests <strong>must</strong> set the {{#crossLink "LoadItem"}}{{/crossLink}}
	 * {{#crossLink "LoadItem/type:property"}}{{/crossLink}} property to {{#crossLink "Types/MANIFEST:property"}}{{/crossLink}}.
	 *
	 * Additionally, some browsers require the server to serve a JavaScript mime-type for JSONP, so it may not work in
	 * some conditions.
	 * @class ManifestLoader
	 * @param {LoadItem|Object} loadItem
	 * @extends AbstractLoader
	 * @constructor
	 */
	function ManifestLoader(loadItem, preferXHR) {
		this.AbstractLoader_constructor(loadItem, preferXHR, createjs.Types.MANIFEST);

	// Public Properties
		/**
		 * An array of the plugins registered using {{#crossLink "LoadQueue/installPlugin"}}{{/crossLink}},
		 * used to pass plugins to new LoadQueues that may be created.
		 * @property _plugins
		 * @type {Array}
		 * @private
		 * @since 0.6.1
		 */
		this.plugins = null;


	// Protected Properties
		/**
		 * An internal {{#crossLink "LoadQueue"}}{{/crossLink}} that loads the contents of the manifest.
		 * @property _manifestQueue
		 * @type {LoadQueue}
		 * @private
		 */
		this._manifestQueue = null;
	};

	var p = createjs.extend(ManifestLoader, createjs.AbstractLoader);
	var s = ManifestLoader;

	// static properties
	/**
	 * The amount of progress that the manifest itself takes up.
	 * @property MANIFEST_PROGRESS
	 * @type {number}
	 * @default 0.25 (25%)
	 * @private
	 * @static
	 */
	s.MANIFEST_PROGRESS = 0.25;

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/MANIFEST:property"}}{{/crossLink}}
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.MANIFEST;
	};

	// public methods
	p.load = function () {
		this.AbstractLoader_load();
	};

	// protected methods
	p._createRequest = function() {
		var callback = this._item.callback;
		if (callback != null) {
			this._request = new createjs.JSONPLoader(this._item);
		} else {
			this._request = new createjs.JSONLoader(this._item);
		}
	};

	p.handleEvent = function (event) {
		switch (event.type) {
			case "complete":
				this._rawResult = event.target.getResult(true);
				this._result = event.target.getResult();
				this._sendProgress(s.MANIFEST_PROGRESS);
				this._loadManifest(this._result);
				return;
			case "progress":
				event.loaded *= s.MANIFEST_PROGRESS;
				this.progress = event.loaded / event.total;
				if (isNaN(this.progress) || this.progress == Infinity) { this.progress = 0; }
				this._sendProgress(event);
				return;
		}
		this.AbstractLoader_handleEvent(event);
	};

	p.destroy = function() {
		this.AbstractLoader_destroy();
		this._manifestQueue.close();
	};

	/**
	 * Create and load the manifest items once the actual manifest has been loaded.
	 * @method _loadManifest
	 * @param {Object} json
	 * @private
	 */
	p._loadManifest = function (json) {
		if (json && json.manifest) {
			var queue = this._manifestQueue = new createjs.LoadQueue(this._preferXHR);
			queue.on("fileload", this._handleManifestFileLoad, this);
			queue.on("progress", this._handleManifestProgress, this);
			queue.on("complete", this._handleManifestComplete, this, true);
			queue.on("error", this._handleManifestError, this, true);
			for(var i = 0, l = this.plugins.length; i < l; i++) {	// conserve order of plugins
				queue.installPlugin(this.plugins[i]);
			}
			queue.loadManifest(json);
		} else {
			this._sendComplete();
		}
	};

	/**
	 * An item from the {{#crossLink "_manifestQueue:property"}}{{/crossLink}} has completed.
	 * @method _handleManifestFileLoad
	 * @param {Event} event
	 * @private
	 */
	p._handleManifestFileLoad = function (event) {
		event.target = null;
		this.dispatchEvent(event);
	};

	/**
	 * The manifest has completed loading. This triggers the {{#crossLink "AbstractLoader/complete:event"}}{{/crossLink}}
	 * {{#crossLink "Event"}}{{/crossLink}} from the ManifestLoader.
	 * @method _handleManifestComplete
	 * @param {Event} event
	 * @private
	 */
	p._handleManifestComplete = function (event) {
		this._loadedItems = this._manifestQueue.getItems(true);
		this._sendComplete();
	};

	/**
	 * The manifest has reported progress.
	 * @method _handleManifestProgress
	 * @param {ProgressEvent} event
	 * @private
	 */
	p._handleManifestProgress = function (event) {
		this.progress = event.progress * (1 - s.MANIFEST_PROGRESS) + s.MANIFEST_PROGRESS;
		this._sendProgress(this.progress);
	};

	/**
	 * The manifest has reported an error with one of the files.
	 * @method _handleManifestError
	 * @param {ErrorEvent} event
	 * @private
	 */
	p._handleManifestError = function (event) {
		var newEvent = new createjs.Event("fileerror");
		newEvent.item = event.data;
		this.dispatchEvent(newEvent);
	};

	createjs.ManifestLoader = createjs.promote(ManifestLoader, "AbstractLoader");

}());

//##############################################################################
// SoundLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for HTML audio files. PreloadJS can not load WebAudio files, as a WebAudio context is required, which
	 * should be created by either a library playing the sound (such as <a href="http://soundjs.com">SoundJS</a>, or an
	 * external framework that handles audio playback. To load content that can be played by WebAudio, use the
	 * {{#crossLink "BinaryLoader"}}{{/crossLink}}, and handle the audio context decoding manually.
	 * @class SoundLoader
	 * @param {LoadItem|Object} loadItem
	 * @param {Boolean} preferXHR
	 * @extends AbstractMediaLoader
	 * @constructor
	 */
	function SoundLoader(loadItem, preferXHR) {
		this.AbstractMediaLoader_constructor(loadItem, preferXHR, createjs.Types.SOUND);

		// protected properties
		if (createjs.DomUtils.isAudioTag(loadItem)) {
			this._tag = loadItem;
		} else if (createjs.DomUtils.isAudioTag(loadItem.src)) {
			this._tag = loadItem;
		} else if (createjs.DomUtils.isAudioTag(loadItem.tag)) {
			this._tag = createjs.DomUtils.isAudioTag(loadItem) ? loadItem : loadItem.src;
		}

		if (this._tag != null) {
			this._preferXHR = false;
		}
	};

	var p = createjs.extend(SoundLoader, createjs.AbstractMediaLoader);
	var s = SoundLoader;

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/SOUND:property"}}{{/crossLink}}.
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.SOUND;
	};

	// protected methods
	p._createTag = function (src) {
		var tag = createjs.Elements.audio();
		tag.autoplay = false;
		tag.preload = "none";

		//LM: Firefox fails when this the preload="none" for other tags, but it needs to be "none" to ensure PreloadJS works.
		tag.src = src;
		return tag;
	};

	createjs.SoundLoader = createjs.promote(SoundLoader, "AbstractMediaLoader");

}());

//##############################################################################
// VideoLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for video files.
	 * @class VideoLoader
	 * @param {LoadItem|Object} loadItem
	 * @param {Boolean} preferXHR
	 * @extends AbstractMediaLoader
	 * @constructor
	 */
	function VideoLoader(loadItem, preferXHR) {
		this.AbstractMediaLoader_constructor(loadItem, preferXHR, createjs.Types.VIDEO);

		if (createjs.DomUtils.isVideoTag(loadItem) || createjs.DomUtils.isVideoTag(loadItem.src)) {
			this.setTag(createjs.DomUtils.isVideoTag(loadItem)?loadItem:loadItem.src);

			// We can't use XHR for a tag that's passed in.
			this._preferXHR = false;
		} else {
			this.setTag(this._createTag());
		}
	};

	var p = createjs.extend(VideoLoader, createjs.AbstractMediaLoader);
	var s = VideoLoader;

	/**
	 * Create a new video tag
	 *
	 * @returns {HTMLElement}
	 * @private
	 */
	p._createTag = function () {
		return createjs.Elements.video();
	};

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/VIDEO:property"}}{{/crossLink}}.
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.VIDEO;
	};

	createjs.VideoLoader = createjs.promote(VideoLoader, "AbstractMediaLoader");

}());

//##############################################################################
// SpriteSheetLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for EaselJS SpriteSheets. Images inside the spritesheet definition are loaded before the loader
	 * completes. To load SpriteSheets using JSONP, specify a {{#crossLink "LoadItem/callback:property"}}{{/crossLink}}
	 * as part of the {{#crossLink "LoadItem"}}{{/crossLink}}. Note that the {{#crossLink "JSONLoader"}}{{/crossLink}}
	 * and {{#crossLink "JSONPLoader"}}{{/crossLink}} are higher priority loaders, so SpriteSheets <strong>must</strong>
	 * set the {{#crossLink "LoadItem"}}{{/crossLink}} {{#crossLink "LoadItem/type:property"}}{{/crossLink}} property
	 * to {{#crossLink "Types/SPRITESHEET:property"}}{{/crossLink}}.
	 *
	 * The {{#crossLink "LoadItem"}}{{/crossLink}} {{#crossLink "LoadItem/crossOrigin:property"}}{{/crossLink}} as well
	 * as the {{#crossLink "LoadQueue's"}}{{/crossLink}} `basePath` argument and {{#crossLink "LoadQueue/_preferXHR"}}{{/crossLink}}
	 * property supplied to the {{#crossLink "LoadQueue"}}{{/crossLink}} are passed on to the sub-manifest that loads
	 * the SpriteSheet images.
	 *
	 * Note that the SpriteSheet JSON does not respect the {{#crossLink "LoadQueue/_preferXHR:property"}}{{/crossLink}}
	 * property, which should instead be determined by the presence of a {{#crossLink "LoadItem/callback:property"}}{{/crossLink}}
	 * property on the SpriteSheet load item. This is because the JSON loaded will have a different format depending on
	 * if it is loaded as JSON, so just changing `preferXHR` is not enough to change how it is loaded.
	 * @class SpriteSheetLoader
	 * @param {LoadItem|Object} loadItem
	 * @extends AbstractLoader
	 * @constructor
	 */
	function SpriteSheetLoader(loadItem, preferXHR) {
		this.AbstractLoader_constructor(loadItem, preferXHR, createjs.Types.SPRITESHEET);

		// protected properties
		/**
		 * An internal queue which loads the SpriteSheet's images.
		 * @method _manifestQueue
		 * @type {LoadQueue}
		 * @private
		 */
		this._manifestQueue = null;
	}

	var p = createjs.extend(SpriteSheetLoader, createjs.AbstractLoader);
	var s = SpriteSheetLoader;

	// static properties
	/**
	 * The amount of progress that the manifest itself takes up.
	 * @property SPRITESHEET_PROGRESS
	 * @type {number}
	 * @default 0.25 (25%)
	 * @private
	 * @static
	 */
	s.SPRITESHEET_PROGRESS = 0.25;

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/SPRITESHEET:property"}}{{/crossLink}}
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.SPRITESHEET;
	};

	// public methods
	p.destroy = function() {
		this.AbstractLoader_destroy();
		this._manifestQueue.close();
	};

	// protected methods
	p._createRequest = function() {
		var callback = this._item.callback;
		if (callback != null) {
			this._request = new createjs.JSONPLoader(this._item);
		} else {
			this._request = new createjs.JSONLoader(this._item);
		}
	};

	p.handleEvent = function (event) {
		switch (event.type) {
			case "complete":
				this._rawResult = event.target.getResult(true);
				this._result = event.target.getResult();
				this._sendProgress(s.SPRITESHEET_PROGRESS);
				this._loadManifest(this._result);
				return;
			case "progress":
				event.loaded *= s.SPRITESHEET_PROGRESS;
				this.progress = event.loaded / event.total;
				if (isNaN(this.progress) || this.progress == Infinity) { this.progress = 0; }
				this._sendProgress(event);
				return;
		}
		this.AbstractLoader_handleEvent(event);
	};

	/**
	 * Create and load the images once the SpriteSheet JSON has been loaded.
	 * @method _loadManifest
	 * @param {Object} json
	 * @private
	 */
	p._loadManifest = function (json) {
		if (json && json.images) {
			var queue = this._manifestQueue = new createjs.LoadQueue(this._preferXHR, this._item.path, this._item.crossOrigin);
			queue.on("complete", this._handleManifestComplete, this, true);
			queue.on("fileload", this._handleManifestFileLoad, this);
			queue.on("progress", this._handleManifestProgress, this);
			queue.on("error", this._handleManifestError, this, true);
			queue.loadManifest(json.images);
		}
	};

	/**
	 * An item from the {{#crossLink "_manifestQueue:property"}}{{/crossLink}} has completed.
	 * @method _handleManifestFileLoad
	 * @param {Event} event
	 * @private
	 */
	p._handleManifestFileLoad = function (event) {
		var image = event.result;
		if (image != null) {
			var images = this.getResult().images;
			var pos = images.indexOf(event.item.src);
			images[pos] = image;
		}
	};

	/**
	 * The images have completed loading. This triggers the {{#crossLink "AbstractLoader/complete:event"}}{{/crossLink}}
	 * {{#crossLink "Event"}}{{/crossLink}} from the SpriteSheetLoader.
	 * @method _handleManifestComplete
	 * @param {Event} event
	 * @private
	 */
	p._handleManifestComplete = function (event) {
		this._result = new createjs.SpriteSheet(this._result);
		this._loadedItems = this._manifestQueue.getItems(true);
		this._sendComplete();
	};

	/**
	 * The images {{#crossLink "LoadQueue"}}{{/crossLink}} has reported progress.
	 * @method _handleManifestProgress
	 * @param {ProgressEvent} event
	 * @private
	 */
	p._handleManifestProgress = function (event) {
		this.progress = event.progress * (1 - s.SPRITESHEET_PROGRESS) + s.SPRITESHEET_PROGRESS;
		this._sendProgress(this.progress);
	};

	/**
	 * An image has reported an error.
	 * @method _handleManifestError
	 * @param {ErrorEvent} event
	 * @private
	 */
	p._handleManifestError = function (event) {
		var newEvent = new createjs.Event("fileerror");
		newEvent.item = event.data;
		this.dispatchEvent(newEvent);
	};

	createjs.SpriteSheetLoader = createjs.promote(SpriteSheetLoader, "AbstractLoader");

}());

//##############################################################################
// SVGLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for SVG files.
	 * @class SVGLoader
	 * @param {LoadItem|Object} loadItem
	 * @param {Boolean} preferXHR
	 * @extends AbstractLoader
	 * @constructor
	 */
	function SVGLoader(loadItem, preferXHR) {
		this.AbstractLoader_constructor(loadItem, preferXHR, createjs.Types.SVG);

		// public properties
		this.resultFormatter = this._formatResult;

		// protected properties
		this._tagSrcAttribute = "data";

		if (preferXHR) {
			this.setTag(createjs.Elements.svg());
		} else {
			this.setTag(createjs.Elements.object());
			this.getTag().type = "image/svg+xml";
		}
	};

	var p = createjs.extend(SVGLoader, createjs.AbstractLoader);
	var s = SVGLoader;

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/SVG:property"}}{{/crossLink}}
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.SVG;
	};

	// protected methods
	/**
	 * The result formatter for SVG files.
	 * @method _formatResult
	 * @param {AbstractLoader} loader
	 * @returns {Object}
	 * @private
	 */
	p._formatResult = function (loader) {
		// mime should be image/svg+xml, but Opera requires text/xml
		var xml = createjs.DataUtils.parseXML(loader.getResult(true));
		var tag = loader.getTag();

		if (!this._preferXHR && document.body.contains(tag)) {
			document.body.removeChild(tag);
		}

		if (xml.documentElement != null) {
			var element = xml.documentElement;
			// Support loading an SVG from a different domain in ID
			if (document.importNode) {
				element = document.importNode(element, true);
			}
			tag.appendChild(element);
			return tag;
		} else { // For browsers that don't support SVG, just give them the XML. (IE 9-8)
			return xml;
		}
	};

	createjs.SVGLoader = createjs.promote(SVGLoader, "AbstractLoader");

}());

//##############################################################################
// XMLLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for CSS files.
	 * @class XMLLoader
	 * @param {LoadItem|Object} loadItem
	 * @extends AbstractLoader
	 * @constructor
	 */
	function XMLLoader(loadItem) {
		this.AbstractLoader_constructor(loadItem, true, createjs.Types.XML);

		// public properties
		this.resultFormatter = this._formatResult;
	};

	var p = createjs.extend(XMLLoader, createjs.AbstractLoader);
	var s = XMLLoader;

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/XML:property"}}{{/crossLink}}.
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.XML;
	};

	// protected methods
	/**
	 * The result formatter for XML files.
	 * @method _formatResult
	 * @param {AbstractLoader} loader
	 * @returns {XMLDocument}
	 * @private
	 */
	p._formatResult = function (loader) {
		return createjs.DataUtils.parseXML(loader.getResult(true));
	};

	createjs.XMLLoader = createjs.promote(XMLLoader, "AbstractLoader");

}());
/*!
* SoundJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/


//##############################################################################
// version.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {

	/**
	 * Static class holding library specific information such as the version and buildDate of the library.
	 * The SoundJS class has been renamed {{#crossLink "Sound"}}{{/crossLink}}.  Please see {{#crossLink "Sound"}}{{/crossLink}}
	 * for information on using sound.
	 * @class SoundJS
	 **/
	var s = createjs.SoundJS = createjs.SoundJS || {};

	/**
	 * The version string for this release.
	 * @property version
	 * @type String
	 * @static
	 **/
	s.version = /*=version*/"1.0.0"; // injected by build process

	/**
	 * The build date for this release in UTC format.
	 * @property buildDate
	 * @type String
	 * @static
	 **/
	s.buildDate = /*=date*/"Thu, 12 Oct 2017 16:34:05 GMT"; // injected by build process

})();

//##############################################################################
// extend.js
//##############################################################################

this.createjs = this.createjs||{};

/**
 * @class Utility Methods
 */

/**
 * Sets up the prototype chain and constructor property for a new class.
 *
 * This should be called right after creating the class constructor.
 *
 * 	function MySubClass() {}
 * 	createjs.extend(MySubClass, MySuperClass);
 * 	MySubClass.prototype.doSomething = function() { }
 *
 * 	var foo = new MySubClass();
 * 	console.log(foo instanceof MySuperClass); // true
 * 	console.log(foo.prototype.constructor === MySubClass); // true
 *
 * @method extend
 * @param {Function} subclass The subclass.
 * @param {Function} superclass The superclass to extend.
 * @return {Function} Returns the subclass's new prototype.
 */
createjs.extend = function(subclass, superclass) {
	"use strict";

	function o() { this.constructor = subclass; }
	o.prototype = superclass.prototype;
	return (subclass.prototype = new o());
};

//##############################################################################
// promote.js
//##############################################################################

this.createjs = this.createjs||{};

/**
 * @class Utility Methods
 */

/**
 * Promotes any methods on the super class that were overridden, by creating an alias in the format `prefix_methodName`.
 * It is recommended to use the super class's name as the prefix.
 * An alias to the super class's constructor is always added in the format `prefix_constructor`.
 * This allows the subclass to call super class methods without using `function.call`, providing better performance.
 *
 * For example, if `MySubClass` extends `MySuperClass`, and both define a `draw` method, then calling `promote(MySubClass, "MySuperClass")`
 * would add a `MySuperClass_constructor` method to MySubClass and promote the `draw` method on `MySuperClass` to the
 * prototype of `MySubClass` as `MySuperClass_draw`.
 *
 * This should be called after the class's prototype is fully defined.
 *
 * 	function ClassA(name) {
 * 		this.name = name;
 * 	}
 * 	ClassA.prototype.greet = function() {
 * 		return "Hello "+this.name;
 * 	}
 *
 * 	function ClassB(name, punctuation) {
 * 		this.ClassA_constructor(name);
 * 		this.punctuation = punctuation;
 * 	}
 * 	createjs.extend(ClassB, ClassA);
 * 	ClassB.prototype.greet = function() {
 * 		return this.ClassA_greet()+this.punctuation;
 * 	}
 * 	createjs.promote(ClassB, "ClassA");
 *
 * 	var foo = new ClassB("World", "!?!");
 * 	console.log(foo.greet()); // Hello World!?!
 *
 * @method promote
 * @param {Function} subclass The class to promote super class methods on.
 * @param {String} prefix The prefix to add to the promoted method names. Usually the name of the superclass.
 * @return {Function} Returns the subclass.
 */
createjs.promote = function(subclass, prefix) {
	"use strict";

	var subP = subclass.prototype, supP = (Object.getPrototypeOf&&Object.getPrototypeOf(subP))||subP.__proto__;
	if (supP) {
		subP[(prefix+="_") + "constructor"] = supP.constructor; // constructor is not always innumerable
		for (var n in supP) {
			if (subP.hasOwnProperty(n) && (typeof supP[n] == "function")) { subP[prefix + n] = supP[n]; }
		}
	}
	return subclass;
};

//##############################################################################
// deprecate.js
//##############################################################################

this.createjs = this.createjs||{};

/**
 * @class Utility Methods
 */

/**
 * Wraps deprecated methods so they still be used, but throw warnings to developers.
 *
 *	obj.deprecatedMethod = createjs.deprecate("Old Method Name", obj._fallbackMethod);
 *
 * The recommended approach for deprecated properties is:
 *
 *	try {
 *		Obj	ect.defineProperties(object, {
 *			readyOnlyProp: { get: createjs.deprecate("readOnlyProp", function() { return this.alternateProp; }) },
 *			readWriteProp: {
 *				get: createjs.deprecate("readOnlyProp", function() { return this.alternateProp; }),
 *				set: createjs.deprecate("readOnlyProp", function(val) { this.alternateProp = val; })
 *		});
 *	} catch (e) {}
 *
 * @method deprecate
 * @param {Function} [fallbackMethod=null] A method to call when the deprecated method is used. See the example for how
 * @param {String} [name=null] The name of the method or property to display in the console warning.
 * to deprecate properties.
 * @return {Function} If a fallbackMethod is supplied, returns a closure that will call the fallback method after
 * logging the warning in the console.
 */
createjs.deprecate = function(fallbackMethod, name) {
	"use strict";
	return function() {
		var msg = "Deprecated property or method '"+name+"'. See docs for info.";
		console && (console.warn ? console.warn(msg) : console.log(msg));
		return fallbackMethod && fallbackMethod.apply(this, arguments);
	}
};

//##############################################################################
// indexOf.js
//##############################################################################

this.createjs = this.createjs||{};

/**
 * @class Utility Methods
 */

/**
 * Finds the first occurrence of a specified value searchElement in the passed in array, and returns the index of
 * that value.  Returns -1 if value is not found.
 *
 *      var i = createjs.indexOf(myArray, myElementToFind);
 *
 * @method indexOf
 * @param {Array} array Array to search for searchElement
 * @param searchElement Element to find in array.
 * @return {Number} The first index of searchElement in array.
 */
createjs.indexOf = function (array, searchElement){
	"use strict";

	for (var i = 0,l=array.length; i < l; i++) {
		if (searchElement === array[i]) {
			return i;
		}
	}
	return -1;
};

//##############################################################################
// proxy.js
//##############################################################################

this.createjs = this.createjs||{};

/**
 * Various utilities that the CreateJS Suite uses. Utilities are created as separate files, and will be available on the
 * createjs namespace directly.
 *
 * <h4>Example</h4>
 *
 *      myObject.addEventListener("change", createjs.proxy(myMethod, scope));
 *
 * @class Utility Methods
 * @main Utility Methods
 */

(function() {
	"use strict";

	/**
	 * A function proxy for methods. By default, JavaScript methods do not maintain scope, so passing a method as a
	 * callback will result in the method getting called in the scope of the caller. Using a proxy ensures that the
	 * method gets called in the correct scope.
	 *
	 * Additional arguments can be passed that will be applied to the function when it is called.
	 *
	 * <h4>Example</h4>
	 *
	 *      myObject.addEventListener("event", createjs.proxy(myHandler, this, arg1, arg2));
	 *
	 *      function myHandler(arg1, arg2) {
	 *           // This gets called when myObject.myCallback is executed.
	 *      }
	 *
	 * @method proxy
	 * @param {Function} method The function to call
	 * @param {Object} scope The scope to call the method name on
	 * @param {mixed} [arg] * Arguments that are appended to the callback for additional params.
	 * @public
	 * @static
	 */
	createjs.proxy = function (method, scope) {
		var aArgs = Array.prototype.slice.call(arguments, 2);
		return function () {
			return method.apply(scope, Array.prototype.slice.call(arguments, 0).concat(aArgs));
		};
	}

}());

//##############################################################################
// BrowserDetect.js
//##############################################################################

this.createjs = this.createjs||{};

/**
 * @class Utility Methods
 */
(function() {
	"use strict";

	/**
	 * An object that determines the current browser, version, operating system, and other environment
	 * variables via user agent string.
	 *
	 * Used for audio because feature detection is unable to detect the many limitations of mobile devices.
	 *
	 * <h4>Example</h4>
	 *
	 *      if (createjs.BrowserDetect.isIOS) { // do stuff }
	 *
	 * @property BrowserDetect
	 * @type {Object}
	 * @param {Boolean} isFirefox True if our browser is Firefox.
	 * @param {Boolean} isOpera True if our browser is opera.
	 * @param {Boolean} isChrome True if our browser is Chrome.  Note that Chrome for Android returns true, but is a
	 * completely different browser with different abilities.
	 * @param {Boolean} isIOS True if our browser is safari for iOS devices (iPad, iPhone, and iPod).
	 * @param {Boolean} isAndroid True if our browser is Android.
	 * @param {Boolean} isBlackberry True if our browser is Blackberry.
	 * @constructor
	 * @static
	 */
	function BrowserDetect() {
		throw "BrowserDetect cannot be instantiated";
	};

	var agent = BrowserDetect.agent = window.navigator.userAgent;
	BrowserDetect.isWindowPhone = (agent.indexOf("IEMobile") > -1) || (agent.indexOf("Windows Phone") > -1);
	BrowserDetect.isFirefox = (agent.indexOf("Firefox") > -1);
	BrowserDetect.isOpera = (window.opera != null);
	BrowserDetect.isChrome = (agent.indexOf("Chrome") > -1);  // NOTE that Chrome on Android returns true but is a completely different browser with different abilities
	BrowserDetect.isIOS = (agent.indexOf("iPod") > -1 || agent.indexOf("iPhone") > -1 || agent.indexOf("iPad") > -1) && !BrowserDetect.isWindowPhone;
	BrowserDetect.isAndroid = (agent.indexOf("Android") > -1) && !BrowserDetect.isWindowPhone;
	BrowserDetect.isBlackberry = (agent.indexOf("Blackberry") > -1);

	createjs.BrowserDetect = BrowserDetect;

}());

//##############################################################################
// EventDispatcher.js
//##############################################################################

this.createjs = this.createjs||{};

(function() {
	"use strict";


// constructor:
	/**
	 * EventDispatcher provides methods for managing queues of event listeners and dispatching events.
	 *
	 * You can either extend EventDispatcher or mix its methods into an existing prototype or instance by using the
	 * EventDispatcher {{#crossLink "EventDispatcher/initialize"}}{{/crossLink}} method.
	 *
	 * Together with the CreateJS Event class, EventDispatcher provides an extended event model that is based on the
	 * DOM Level 2 event model, including addEventListener, removeEventListener, and dispatchEvent. It supports
	 * bubbling / capture, preventDefault, stopPropagation, stopImmediatePropagation, and handleEvent.
	 *
	 * EventDispatcher also exposes a {{#crossLink "EventDispatcher/on"}}{{/crossLink}} method, which makes it easier
	 * to create scoped listeners, listeners that only run once, and listeners with associated arbitrary data. The
	 * {{#crossLink "EventDispatcher/off"}}{{/crossLink}} method is merely an alias to
	 * {{#crossLink "EventDispatcher/removeEventListener"}}{{/crossLink}}.
	 *
	 * Another addition to the DOM Level 2 model is the {{#crossLink "EventDispatcher/removeAllEventListeners"}}{{/crossLink}}
	 * method, which can be used to listeners for all events, or listeners for a specific event. The Event object also
	 * includes a {{#crossLink "Event/remove"}}{{/crossLink}} method which removes the active listener.
	 *
	 * <h4>Example</h4>
	 * Add EventDispatcher capabilities to the "MyClass" class.
	 *
	 *      EventDispatcher.initialize(MyClass.prototype);
	 *
	 * Add an event (see {{#crossLink "EventDispatcher/addEventListener"}}{{/crossLink}}).
	 *
	 *      instance.addEventListener("eventName", handlerMethod);
	 *      function handlerMethod(event) {
	 *          console.log(event.target + " Was Clicked");
	 *      }
	 *
	 * <b>Maintaining proper scope</b><br />
	 * Scope (ie. "this") can be be a challenge with events. Using the {{#crossLink "EventDispatcher/on"}}{{/crossLink}}
	 * method to subscribe to events simplifies this.
	 *
	 *      instance.addEventListener("click", function(event) {
	 *          console.log(instance == this); // false, scope is ambiguous.
	 *      });
	 *
	 *      instance.on("click", function(event) {
	 *          console.log(instance == this); // true, "on" uses dispatcher scope by default.
	 *      });
	 *
	 * If you want to use addEventListener instead, you may want to use function.bind() or a similar proxy to manage
	 * scope.
	 *
	 * <b>Browser support</b>
	 * The event model in CreateJS can be used separately from the suite in any project, however the inheritance model
	 * requires modern browsers (IE9+).
	 *
	 *
	 * @class EventDispatcher
	 * @constructor
	 **/
	function EventDispatcher() {


	// private properties:
		/**
		 * @protected
		 * @property _listeners
		 * @type Object
		 **/
		this._listeners = null;

		/**
		 * @protected
		 * @property _captureListeners
		 * @type Object
		 **/
		this._captureListeners = null;
	}
	var p = EventDispatcher.prototype;

// static public methods:
	/**
	 * Static initializer to mix EventDispatcher methods into a target object or prototype.
	 *
	 * 		EventDispatcher.initialize(MyClass.prototype); // add to the prototype of the class
	 * 		EventDispatcher.initialize(myObject); // add to a specific instance
	 *
	 * @method initialize
	 * @static
	 * @param {Object} target The target object to inject EventDispatcher methods into. This can be an instance or a
	 * prototype.
	 **/
	EventDispatcher.initialize = function(target) {
		target.addEventListener = p.addEventListener;
		target.on = p.on;
		target.removeEventListener = target.off =  p.removeEventListener;
		target.removeAllEventListeners = p.removeAllEventListeners;
		target.hasEventListener = p.hasEventListener;
		target.dispatchEvent = p.dispatchEvent;
		target._dispatchEvent = p._dispatchEvent;
		target.willTrigger = p.willTrigger;
	};


// public methods:
	/**
	 * Adds the specified event listener. Note that adding multiple listeners to the same function will result in
	 * multiple callbacks getting fired.
	 *
	 * <h4>Example</h4>
	 *
	 *      displayObject.addEventListener("click", handleClick);
	 *      function handleClick(event) {
	 *         // Click happened.
	 *      }
	 *
	 * @method addEventListener
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when
	 * the event is dispatched.
	 * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 * @return {Function | Object} Returns the listener for chaining or assignment.
	 **/
	p.addEventListener = function(type, listener, useCapture) {
		var listeners;
		if (useCapture) {
			listeners = this._captureListeners = this._captureListeners||{};
		} else {
			listeners = this._listeners = this._listeners||{};
		}
		var arr = listeners[type];
		if (arr) { this.removeEventListener(type, listener, useCapture); }
		arr = listeners[type]; // remove may have deleted the array
		if (!arr) { listeners[type] = [listener];  }
		else { arr.push(listener); }
		return listener;
	};

	/**
	 * A shortcut method for using addEventListener that makes it easier to specify an execution scope, have a listener
	 * only run once, associate arbitrary data with the listener, and remove the listener.
	 *
	 * This method works by creating an anonymous wrapper function and subscribing it with addEventListener.
	 * The wrapper function is returned for use with `removeEventListener` (or `off`).
	 *
	 * <b>IMPORTANT:</b> To remove a listener added with `on`, you must pass in the returned wrapper function as the listener, or use
	 * {{#crossLink "Event/remove"}}{{/crossLink}}. Likewise, each time you call `on` a NEW wrapper function is subscribed, so multiple calls
	 * to `on` with the same params will create multiple listeners.
	 *
	 * <h4>Example</h4>
	 *
	 * 		var listener = myBtn.on("click", handleClick, null, false, {count:3});
	 * 		function handleClick(evt, data) {
	 * 			data.count -= 1;
	 * 			console.log(this == myBtn); // true - scope defaults to the dispatcher
	 * 			if (data.count == 0) {
	 * 				alert("clicked 3 times!");
	 * 				myBtn.off("click", listener);
	 * 				// alternately: evt.remove();
	 * 			}
	 * 		}
	 *
	 * @method on
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when
	 * the event is dispatched.
	 * @param {Object} [scope] The scope to execute the listener in. Defaults to the dispatcher/currentTarget for function listeners, and to the listener itself for object listeners (ie. using handleEvent).
	 * @param {Boolean} [once=false] If true, the listener will remove itself after the first time it is triggered.
	 * @param {*} [data] Arbitrary data that will be included as the second parameter when the listener is called.
	 * @param {Boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 * @return {Function} Returns the anonymous function that was created and assigned as the listener. This is needed to remove the listener later using .removeEventListener.
	 **/
	p.on = function(type, listener, scope, once, data, useCapture) {
		if (listener.handleEvent) {
			scope = scope||listener;
			listener = listener.handleEvent;
		}
		scope = scope||this;
		return this.addEventListener(type, function(evt) {
				listener.call(scope, evt, data);
				once&&evt.remove();
			}, useCapture);
	};

	/**
	 * Removes the specified event listener.
	 *
	 * <b>Important Note:</b> that you must pass the exact function reference used when the event was added. If a proxy
	 * function, or function closure is used as the callback, the proxy/closure reference must be used - a new proxy or
	 * closure will not work.
	 *
	 * <h4>Example</h4>
	 *
	 *      displayObject.removeEventListener("click", handleClick);
	 *
	 * @method removeEventListener
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener The listener function or object.
	 * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 **/
	p.removeEventListener = function(type, listener, useCapture) {
		var listeners = useCapture ? this._captureListeners : this._listeners;
		if (!listeners) { return; }
		var arr = listeners[type];
		if (!arr) { return; }
		for (var i=0,l=arr.length; i<l; i++) {
			if (arr[i] == listener) {
				if (l==1) { delete(listeners[type]); } // allows for faster checks.
				else { arr.splice(i,1); }
				break;
			}
		}
	};

	/**
	 * A shortcut to the removeEventListener method, with the same parameters and return value. This is a companion to the
	 * .on method.
	 *
	 * <b>IMPORTANT:</b> To remove a listener added with `on`, you must pass in the returned wrapper function as the listener. See
	 * {{#crossLink "EventDispatcher/on"}}{{/crossLink}} for an example.
	 *
	 * @method off
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener The listener function or object.
	 * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 **/
	p.off = p.removeEventListener;

	/**
	 * Removes all listeners for the specified type, or all listeners of all types.
	 *
	 * <h4>Example</h4>
	 *
	 *      // Remove all listeners
	 *      displayObject.removeAllEventListeners();
	 *
	 *      // Remove all click listeners
	 *      displayObject.removeAllEventListeners("click");
	 *
	 * @method removeAllEventListeners
	 * @param {String} [type] The string type of the event. If omitted, all listeners for all types will be removed.
	 **/
	p.removeAllEventListeners = function(type) {
		if (!type) { this._listeners = this._captureListeners = null; }
		else {
			if (this._listeners) { delete(this._listeners[type]); }
			if (this._captureListeners) { delete(this._captureListeners[type]); }
		}
	};

	/**
	 * Dispatches the specified event to all listeners.
	 *
	 * <h4>Example</h4>
	 *
	 *      // Use a string event
	 *      this.dispatchEvent("complete");
	 *
	 *      // Use an Event instance
	 *      var event = new createjs.Event("progress");
	 *      this.dispatchEvent(event);
	 *
	 * @method dispatchEvent
	 * @param {Object | String | Event} eventObj An object with a "type" property, or a string type.
	 * While a generic object will work, it is recommended to use a CreateJS Event instance. If a string is used,
	 * dispatchEvent will construct an Event instance if necessary with the specified type. This latter approach can
	 * be used to avoid event object instantiation for non-bubbling events that may not have any listeners.
	 * @param {Boolean} [bubbles] Specifies the `bubbles` value when a string was passed to eventObj.
	 * @param {Boolean} [cancelable] Specifies the `cancelable` value when a string was passed to eventObj.
	 * @return {Boolean} Returns false if `preventDefault()` was called on a cancelable event, true otherwise.
	 **/
	p.dispatchEvent = function(eventObj, bubbles, cancelable) {
		if (typeof eventObj == "string") {
			// skip everything if there's no listeners and it doesn't bubble:
			var listeners = this._listeners;
			if (!bubbles && (!listeners || !listeners[eventObj])) { return true; }
			eventObj = new createjs.Event(eventObj, bubbles, cancelable);
		} else if (eventObj.target && eventObj.clone) {
			// redispatching an active event object, so clone it:
			eventObj = eventObj.clone();
		}

		// TODO: it would be nice to eliminate this. Maybe in favour of evtObj instanceof Event? Or !!evtObj.createEvent
		try { eventObj.target = this; } catch (e) {} // try/catch allows redispatching of native events

		if (!eventObj.bubbles || !this.parent) {
			this._dispatchEvent(eventObj, 2);
		} else {
			var top=this, list=[top];
			while (top.parent) { list.push(top = top.parent); }
			var i, l=list.length;

			// capture & atTarget
			for (i=l-1; i>=0 && !eventObj.propagationStopped; i--) {
				list[i]._dispatchEvent(eventObj, 1+(i==0));
			}
			// bubbling
			for (i=1; i<l && !eventObj.propagationStopped; i++) {
				list[i]._dispatchEvent(eventObj, 3);
			}
		}
		return !eventObj.defaultPrevented;
	};

	/**
	 * Indicates whether there is at least one listener for the specified event type.
	 * @method hasEventListener
	 * @param {String} type The string type of the event.
	 * @return {Boolean} Returns true if there is at least one listener for the specified event.
	 **/
	p.hasEventListener = function(type) {
		var listeners = this._listeners, captureListeners = this._captureListeners;
		return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
	};

	/**
	 * Indicates whether there is at least one listener for the specified event type on this object or any of its
	 * ancestors (parent, parent's parent, etc). A return value of true indicates that if a bubbling event of the
	 * specified type is dispatched from this object, it will trigger at least one listener.
	 *
	 * This is similar to {{#crossLink "EventDispatcher/hasEventListener"}}{{/crossLink}}, but it searches the entire
	 * event flow for a listener, not just this object.
	 * @method willTrigger
	 * @param {String} type The string type of the event.
	 * @return {Boolean} Returns `true` if there is at least one listener for the specified event.
	 **/
	p.willTrigger = function(type) {
		var o = this;
		while (o) {
			if (o.hasEventListener(type)) { return true; }
			o = o.parent;
		}
		return false;
	};

	/**
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[EventDispatcher]";
	};


// private methods:
	/**
	 * @method _dispatchEvent
	 * @param {Object | Event} eventObj
	 * @param {Object} eventPhase
	 * @protected
	 **/
	p._dispatchEvent = function(eventObj, eventPhase) {
		var l, arr, listeners = (eventPhase <= 2) ? this._captureListeners : this._listeners;
		if (eventObj && listeners && (arr = listeners[eventObj.type]) && (l=arr.length)) {
			try { eventObj.currentTarget = this; } catch (e) {}
			try { eventObj.eventPhase = eventPhase|0; } catch (e) {}
			eventObj.removed = false;

			arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
			for (var i=0; i<l && !eventObj.immediatePropagationStopped; i++) {
				var o = arr[i];
				if (o.handleEvent) { o.handleEvent(eventObj); }
				else { o(eventObj); }
				if (eventObj.removed) {
					this.off(eventObj.type, o, eventPhase==1);
					eventObj.removed = false;
				}
			}
		}
		if (eventPhase === 2) { this._dispatchEvent(eventObj, 2.1); }
	};


	createjs.EventDispatcher = EventDispatcher;
}());

//##############################################################################
// Event.js
//##############################################################################

this.createjs = this.createjs||{};

(function() {
	"use strict";

// constructor:
	/**
	 * Contains properties and methods shared by all events for use with
	 * {{#crossLink "EventDispatcher"}}{{/crossLink}}.
	 *
	 * Note that Event objects are often reused, so you should never
	 * rely on an event object's state outside of the call stack it was received in.
	 * @class Event
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/
	function Event(type, bubbles, cancelable) {


	// public properties:
		/**
		 * The type of event.
		 * @property type
		 * @type String
		 **/
		this.type = type;

		/**
		 * The object that generated an event.
		 * @property target
		 * @type Object
		 * @default null
		 * @readonly
		*/
		this.target = null;

		/**
		 * The current target that a bubbling event is being dispatched from. For non-bubbling events, this will
		 * always be the same as target. For example, if childObj.parent = parentObj, and a bubbling event
		 * is generated from childObj, then a listener on parentObj would receive the event with
		 * target=childObj (the original target) and currentTarget=parentObj (where the listener was added).
		 * @property currentTarget
		 * @type Object
		 * @default null
		 * @readonly
		*/
		this.currentTarget = null;

		/**
		 * For bubbling events, this indicates the current event phase:<OL>
		 * 	<LI> capture phase: starting from the top parent to the target</LI>
		 * 	<LI> at target phase: currently being dispatched from the target</LI>
		 * 	<LI> bubbling phase: from the target to the top parent</LI>
		 * </OL>
		 * @property eventPhase
		 * @type Number
		 * @default 0
		 * @readonly
		*/
		this.eventPhase = 0;

		/**
		 * Indicates whether the event will bubble through the display list.
		 * @property bubbles
		 * @type Boolean
		 * @default false
		 * @readonly
		*/
		this.bubbles = !!bubbles;

		/**
		 * Indicates whether the default behaviour of this event can be cancelled via
		 * {{#crossLink "Event/preventDefault"}}{{/crossLink}}. This is set via the Event constructor.
		 * @property cancelable
		 * @type Boolean
		 * @default false
		 * @readonly
		*/
		this.cancelable = !!cancelable;

		/**
		 * The epoch time at which this event was created.
		 * @property timeStamp
		 * @type Number
		 * @default 0
		 * @readonly
		*/
		this.timeStamp = (new Date()).getTime();

		/**
		 * Indicates if {{#crossLink "Event/preventDefault"}}{{/crossLink}} has been called
		 * on this event.
		 * @property defaultPrevented
		 * @type Boolean
		 * @default false
		 * @readonly
		*/
		this.defaultPrevented = false;

		/**
		 * Indicates if {{#crossLink "Event/stopPropagation"}}{{/crossLink}} or
		 * {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called on this event.
		 * @property propagationStopped
		 * @type Boolean
		 * @default false
		 * @readonly
		*/
		this.propagationStopped = false;

		/**
		 * Indicates if {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called
		 * on this event.
		 * @property immediatePropagationStopped
		 * @type Boolean
		 * @default false
		 * @readonly
		*/
		this.immediatePropagationStopped = false;

		/**
		 * Indicates if {{#crossLink "Event/remove"}}{{/crossLink}} has been called on this event.
		 * @property removed
		 * @type Boolean
		 * @default false
		 * @readonly
		*/
		this.removed = false;
	}
	var p = Event.prototype;

// public methods:
	/**
	 * Sets {{#crossLink "Event/defaultPrevented"}}{{/crossLink}} to true if the event is cancelable.
	 * Mirrors the DOM level 2 event standard. In general, cancelable events that have `preventDefault()` called will
	 * cancel the default behaviour associated with the event.
	 * @method preventDefault
	 **/
	p.preventDefault = function() {
		this.defaultPrevented = this.cancelable&&true;
	};

	/**
	 * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} to true.
	 * Mirrors the DOM event standard.
	 * @method stopPropagation
	 **/
	p.stopPropagation = function() {
		this.propagationStopped = true;
	};

	/**
	 * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} and
	 * {{#crossLink "Event/immediatePropagationStopped"}}{{/crossLink}} to true.
	 * Mirrors the DOM event standard.
	 * @method stopImmediatePropagation
	 **/
	p.stopImmediatePropagation = function() {
		this.immediatePropagationStopped = this.propagationStopped = true;
	};

	/**
	 * Causes the active listener to be removed via removeEventListener();
	 *
	 * 		myBtn.addEventListener("click", function(evt) {
	 * 			// do stuff...
	 * 			evt.remove(); // removes this listener.
	 * 		});
	 *
	 * @method remove
	 **/
	p.remove = function() {
		this.removed = true;
	};

	/**
	 * Returns a clone of the Event instance.
	 * @method clone
	 * @return {Event} a clone of the Event instance.
	 **/
	p.clone = function() {
		return new Event(this.type, this.bubbles, this.cancelable);
	};

	/**
	 * Provides a chainable shortcut method for setting a number of properties on the instance.
	 *
	 * @method set
	 * @param {Object} props A generic object containing properties to copy to the instance.
	 * @return {Event} Returns the instance the method is called on (useful for chaining calls.)
	 * @chainable
	*/
	p.set = function(props) {
		for (var n in props) { this[n] = props[n]; }
		return this;
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Event (type="+this.type+")]";
	};

	createjs.Event = Event;
}());

//##############################################################################
// ErrorEvent.js
//##############################################################################

this.createjs = this.createjs||{};

(function() {
	"use strict";

	/**
	 * A general error {{#crossLink "Event"}}{{/crossLink}}, that describes an error that occurred, as well as any details.
	 * @class ErrorEvent
	 * @param {String} [title] The error title
	 * @param {String} [message] The error description
	 * @param {Object} [data] Additional error data
	 * @constructor
	 */
	function ErrorEvent(title, message, data) {
		this.Event_constructor("error");

		/**
		 * The short error title, which indicates the type of error that occurred.
		 * @property title
		 * @type String
		 */
		this.title = title;

		/**
		 * The verbose error message, containing details about the error.
		 * @property message
		 * @type String
		 */
		this.message = message;

		/**
		 * Additional data attached to an error.
		 * @property data
		 * @type {Object}
		 */
		this.data = data;
	}

	var p = createjs.extend(ErrorEvent, createjs.Event);

	p.clone = function() {
		return new createjs.ErrorEvent(this.title, this.message, this.data);
	};

	createjs.ErrorEvent = createjs.promote(ErrorEvent, "Event");

}());

//##############################################################################
// ProgressEvent.js
//##############################################################################

this.createjs = this.createjs || {};

(function (scope) {
	"use strict";

	// constructor
	/**
	 * A CreateJS {{#crossLink "Event"}}{{/crossLink}} that is dispatched when progress changes.
	 * @class ProgressEvent
	 * @param {Number} loaded The amount that has been loaded. This can be any number relative to the total.
	 * @param {Number} [total=1] The total amount that will load. This will default to 1, so if the `loaded` value is
	 * a percentage (between 0 and 1), it can be omitted.
	 * @todo Consider having this event be a "fileprogress" event as well
	 * @constructor
	 */
	function ProgressEvent(loaded, total) {
		this.Event_constructor("progress");

		/**
		 * The amount that has been loaded (out of a total amount)
		 * @property loaded
		 * @type {Number}
		 */
		this.loaded = loaded;

		/**
		 * The total "size" of the load.
		 * @property total
		 * @type {Number}
		 * @default 1
		 */
		this.total = (total == null) ? 1 : total;

		/**
		 * The percentage (out of 1) that the load has been completed. This is calculated using `loaded/total`.
		 * @property progress
		 * @type {Number}
		 * @default 0
		 */
		this.progress = (total == 0) ? 0 : this.loaded / this.total;
	};

	var p = createjs.extend(ProgressEvent, createjs.Event);

	/**
	 * Returns a clone of the ProgressEvent instance.
	 * @method clone
	 * @return {ProgressEvent} a clone of the Event instance.
	 **/
	p.clone = function() {
		return new createjs.ProgressEvent(this.loaded, this.total);
	};

	createjs.ProgressEvent = createjs.promote(ProgressEvent, "Event");

}(window));

//##############################################################################
// LoadItem.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	/**
	 * All loaders accept an item containing the properties defined in this class. If a raw object is passed instead,
	 * it will not be affected, but it must contain at least a {{#crossLink "src:property"}}{{/crossLink}} property. A
	 * string path or HTML tag is also acceptable, but it will be automatically converted to a LoadItem using the
	 * {{#crossLink "create"}}{{/crossLink}} method by {{#crossLink "AbstractLoader"}}{{/crossLink}}
	 * @class LoadItem
	 * @constructor
	 * @since 0.6.0
	 */
	function LoadItem() {
		/**
		 * The source of the file that is being loaded. This property is <b>required</b>. The source can either be a
		 * string (recommended), or an HTML tag.
		 * This can also be an object, but in that case it has to include a type and be handled by a plugin.
		 * @property src
		 * @type {String}
		 * @default null
		 */
		this.src = null;

		/**
		 * The type file that is being loaded. The type of the file is usually inferred by the extension, but can also
		 * be set manually. This is helpful in cases where a file does not have an extension.
		 * @property type
		 * @type {String}
		 * @default null
		 */
		this.type = null;

		/**
		 * A string identifier which can be used to reference the loaded object. If none is provided, this will be
		 * automatically set to the {{#crossLink "src:property"}}{{/crossLink}}.
		 * @property id
		 * @type {String}
		 * @default null
		 */
		this.id = null;

		/**
		 * Determines if a manifest will maintain the order of this item, in relation to other items in the manifest
		 * that have also set the `maintainOrder` property to `true`. This only applies when the max connections has
		 * been set above 1 (using {{#crossLink "LoadQueue/setMaxConnections"}}{{/crossLink}}). Everything with this
		 * property set to `false` will finish as it is loaded. Ordered items are combined with script tags loading in
		 * order when {{#crossLink "LoadQueue/maintainScriptOrder:property"}}{{/crossLink}} is set to `true`.
		 * @property maintainOrder
		 * @type {Boolean}
		 * @default false
		 */
		this.maintainOrder = false;

		/**
		 * A callback used by JSONP requests that defines what global method to call when the JSONP content is loaded.
		 * @property callback
		 * @type {String}
		 * @default null
		 */
		this.callback = null;

		/**
		 * An arbitrary data object, which is included with the loaded object.
		 * @property data
		 * @type {Object}
		 * @default null
		 */
		this.data = null;

		/**
		 * The request method used for HTTP calls. Both {{#crossLink "Methods/GET:property"}}{{/crossLink}} or
		 * {{#crossLink "Methods/POST:property"}}{{/crossLink}} request types are supported, and are defined as
		 * constants on {{#crossLink "AbstractLoader"}}{{/crossLink}}.
		 * @property method
		 * @type {String}
		 * @default GET
		 */
		this.method = createjs.Methods.GET;

		/**
		 * An object hash of name/value pairs to send to the server.
		 * @property values
		 * @type {Object}
		 * @default null
		 */
		this.values = null;

		/**
		 * An object hash of headers to attach to an XHR request. PreloadJS will automatically attach some default
		 * headers when required, including "Origin", "Content-Type", and "X-Requested-With". You may override the
		 * default headers by including them in your headers object.
		 * @property headers
		 * @type {Object}
		 * @default null
		 */
		this.headers = null;

		/**
		 * Enable credentials for XHR requests.
		 * @property withCredentials
		 * @type {Boolean}
		 * @default false
		 */
		this.withCredentials = false;

		/**
		 * Set the mime type of XHR-based requests. This is automatically set to "text/plain; charset=utf-8" for text
		 * based files (json, xml, text, css, js).
		 * @property mimeType
		 * @type {String}
		 * @default null
		 */
		this.mimeType = null;

		/**
		 * Sets the crossOrigin attribute for CORS-enabled images loading cross-domain.
		 * @property crossOrigin
		 * @type {boolean}
		 * @default Anonymous
		 */
		this.crossOrigin = null;

		/**
		 * The duration in milliseconds to wait before a request times out. This only applies to tag-based and and XHR
		 * (level one) loading, as XHR (level 2) provides its own timeout event.
		 * @property loadTimeout
		 * @type {Number}
		 * @default 8000 (8 seconds)
		 */
		this.loadTimeout = s.LOAD_TIMEOUT_DEFAULT;
	};

	var p = LoadItem.prototype = {};
	var s = LoadItem;

	/**
	 * Default duration in milliseconds to wait before a request times out. This only applies to tag-based and and XHR
	 * (level one) loading, as XHR (level 2) provides its own timeout event.
	 * @property LOAD_TIMEOUT_DEFAULT
	 * @type {number}
	 * @static
	 */
	s.LOAD_TIMEOUT_DEFAULT = 8000;

	/**
	 * Create a LoadItem.
	 * <ul>
	 *     <li>String-based items are converted to a LoadItem with a populated {{#crossLink "src:property"}}{{/crossLink}}.</li>
	 *     <li>LoadItem instances are returned as-is</li>
	 *     <li>Objects are returned with any needed properties added</li>
	 * </ul>
	 * @method create
	 * @param {LoadItem|String|Object} value The load item value
	 * @returns {LoadItem|Object}
	 * @static
	 */
	s.create = function (value) {
		if (typeof value == "string") {
			var item = new LoadItem();
			item.src = value;
			return item;
		} else if (value instanceof s) {
			return value;
		} else if (value instanceof Object && value.src) {
			if (value.loadTimeout == null) {
				value.loadTimeout = s.LOAD_TIMEOUT_DEFAULT;
			}
			return value;
		} else {
			throw new Error("Type not recognized.");
		}
	};

	/**
	 * Provides a chainable shortcut method for setting a number of properties on the instance.
	 *
	 * <h4>Example</h4>
	 *
	 *      var loadItem = new createjs.LoadItem().set({src:"image.png", maintainOrder:true});
	 *
	 * @method set
	 * @param {Object} props A generic object containing properties to copy to the LoadItem instance.
	 * @return {LoadItem} Returns the instance the method is called on (useful for chaining calls.)
	*/
	p.set = function(props) {
		for (var n in props) { this[n] = props[n]; }
		return this;
	};

	createjs.LoadItem = s;

}());

//##############################################################################
// Methods.js
//##############################################################################

this.createjs = this.createjs || {};

(function() {
	var s = {};

	/**
	 * Defines a POST request, use for a method value when loading data.
	 * @property POST
	 * @type {string}
	 * @default post
	 * @static
	 */
	s.POST = "POST";

	/**
	 * Defines a GET request, use for a method value when loading data.
	 * @property GET
	 * @type {string}
	 * @default get
	 * @static
	 */
	s.GET = "GET";

	createjs.Methods = s;
}());

//##############################################################################
// Types.js
//##############################################################################

this.createjs = this.createjs || {};

(function() {
	var s = {};

	/**
	 * The preload type for generic binary types. Note that images are loaded as binary files when using XHR.
	 * @property BINARY
	 * @type {String}
	 * @default binary
	 * @static
	 * @since 0.6.0
	 */
	s.BINARY = "binary";

	/**
	 * The preload type for css files. CSS files are loaded using a &lt;link&gt; when loaded with XHR, or a
	 * &lt;style&gt; tag when loaded with tags.
	 * @property CSS
	 * @type {String}
	 * @default css
	 * @static
	 * @since 0.6.0
	 */
	s.CSS = "css";

	/**
	 * The preload type for font files.
	 * @property FONT
	 * @type {String}
	 * @default font
	 * @static
	 * @since 0.9.0
	 */
	s.FONT = "font";

	/**
	 * The preload type for fonts specified with CSS (such as Google fonts)
	 * @property FONTCSS
	 * @type {String}
	 * @default fontcss
	 * @static
	 * @since 0.9.0
	 */
	s.FONTCSS = "fontcss";

	/**
	 * The preload type for image files, usually png, gif, or jpg/jpeg. Images are loaded into an &lt;image&gt; tag.
	 * @property IMAGE
	 * @type {String}
	 * @default image
	 * @static
	 * @since 0.6.0
	 */
	s.IMAGE = "image";

	/**
	 * The preload type for javascript files, usually with the "js" file extension. JavaScript files are loaded into a
	 * &lt;script&gt; tag.
	 *
	 * Since version 0.4.1+, due to how tag-loaded scripts work, all JavaScript files are automatically injected into
	 * the body of the document to maintain parity between XHR and tag-loaded scripts. In version 0.4.0 and earlier,
	 * only tag-loaded scripts are injected.
	 * @property JAVASCRIPT
	 * @type {String}
	 * @default javascript
	 * @static
	 * @since 0.6.0
	 */
	s.JAVASCRIPT = "javascript";

	/**
	 * The preload type for json files, usually with the "json" file extension. JSON data is loaded and parsed into a
	 * JavaScript object. Note that if a `callback` is present on the load item, the file will be loaded with JSONP,
	 * no matter what the {{#crossLink "LoadQueue/preferXHR:property"}}{{/crossLink}} property is set to, and the JSON
	 * must contain a matching wrapper function.
	 * @property JSON
	 * @type {String}
	 * @default json
	 * @static
	 * @since 0.6.0
	 */
	s.JSON = "json";

	/**
	 * The preload type for jsonp files, usually with the "json" file extension. JSON data is loaded and parsed into a
	 * JavaScript object. You are required to pass a callback parameter that matches the function wrapper in the JSON.
	 * Note that JSONP will always be used if there is a callback present, no matter what the {{#crossLink "LoadQueue/preferXHR:property"}}{{/crossLink}}
	 * property is set to.
	 * @property JSONP
	 * @type {String}
	 * @default jsonp
	 * @static
	 * @since 0.6.0
	 */
	s.JSONP = "jsonp";

	/**
	 * The preload type for json-based manifest files, usually with the "json" file extension. The JSON data is loaded
	 * and parsed into a JavaScript object. PreloadJS will then look for a "manifest" property in the JSON, which is an
	 * Array of files to load, following the same format as the {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}}
	 * method. If a "callback" is specified on the manifest object, then it will be loaded using JSONP instead,
	 * regardless of what the {{#crossLink "LoadQueue/preferXHR:property"}}{{/crossLink}} property is set to.
	 * @property MANIFEST
	 * @type {String}
	 * @default manifest
	 * @static
	 * @since 0.6.0
	 */
	s.MANIFEST = "manifest";

	/**
	 * The preload type for sound files, usually mp3, ogg, or wav. When loading via tags, audio is loaded into an
	 * &lt;audio&gt; tag.
	 * @property SOUND
	 * @type {String}
	 * @default sound
	 * @static
	 * @since 0.6.0
	 */
	s.SOUND = "sound";

	/**
	 * The preload type for video files, usually mp4, ts, or ogg. When loading via tags, video is loaded into an
	 * &lt;video&gt; tag.
	 * @property VIDEO
	 * @type {String}
	 * @default video
	 * @static
	 * @since 0.6.0
	 */
	s.VIDEO = "video";

	/**
	 * The preload type for SpriteSheet files. SpriteSheet files are JSON files that contain string image paths.
	 * @property SPRITESHEET
	 * @type {String}
	 * @default spritesheet
	 * @static
	 * @since 0.6.0
	 */
	s.SPRITESHEET = "spritesheet";

	/**
	 * The preload type for SVG files.
	 * @property SVG
	 * @type {String}
	 * @default svg
	 * @static
	 * @since 0.6.0
	 */
	s.SVG = "svg";

	/**
	 * The preload type for text files, which is also the default file type if the type can not be determined. Text is
	 * loaded as raw text.
	 * @property TEXT
	 * @type {String}
	 * @default text
	 * @static
	 * @since 0.6.0
	 */
	s.TEXT = "text";

	/**
	 * The preload type for xml files. XML is loaded into an XML document.
	 * @property XML
	 * @type {String}
	 * @default xml
	 * @static
	 * @since 0.6.0
	 */
	s.XML = "xml";

	createjs.Types = s;
}());

//##############################################################################
// Elements.js
//##############################################################################

(function () {

	/**
	 * Convenience methods for creating various elements used by PrelaodJS.
	 *
	 * @class DomUtils
	 */
	var s = {};

	s.a = function() {
		return s.el("a");
	}

	s.svg = function() {
		return s.el("svg");
	}

	s.object = function() {
		return s.el("object");
	}

	s.image = function() {
		return s.el("image");
	}

	s.img = function() {
		return s.el("img");
	}

	s.style = function() {
		return s.el("style");
	}

	s.link = function() {
		return s.el("link");
	}

	s.script = function() {
		return s.el("script");
	}

	s.audio = function() {
		return s.el("audio");
	}

	s.video = function() {
		return s.el("video");
	}

	s.text = function(value) {
		return document.createTextNode(value);
	}

	s.el = function(name) {
		return document.createElement(name);
	}

	createjs.Elements = s;

}());

//##############################################################################
// DomUtils.js
//##############################################################################

(function () {

	/**
	 * A few utilities for interacting with the dom.
	 * @class DomUtils
	 */
	var s = {
		container: null
	};

	s.appendToHead = function (el) {
		s.getHead().appendChild(el);
	}

	s.appendToBody = function (el) {
		if (s.container == null) {
			s.container = document.createElement("div");
			s.container.id = "preloadjs-container";
			var style = s.container.style;
			style.visibility = "hidden";
			style.position = "absolute";
			style.width = s.container.style.height = "10px";
			style.overflow = "hidden";
			style.transform = style.msTransform = style.webkitTransform = style.oTransform = "translate(-10px, -10px)"; //LM: Not working
			s.getBody().appendChild(s.container);
		}
		s.container.appendChild(el);
	}

	s.getHead = function () {
		return document.head || document.getElementsByTagName("head")[0];
	}

	s.getBody = function () {
		return document.body || document.getElementsByTagName("body")[0];
	}

	s.removeChild = function(el) {
		if (el.parent) {
			el.parent.removeChild(el);
		}
	}

	/**
	 * Check if item is a valid HTMLImageElement
	 * @method isImageTag
	 * @param {Object} item
	 * @returns {Boolean}
	 * @static
	 */
	s.isImageTag = function(item) {
		return item instanceof HTMLImageElement;
	};

	/**
	 * Check if item is a valid HTMLAudioElement
	 * @method isAudioTag
	 * @param {Object} item
	 * @returns {Boolean}
	 * @static
	 */
	s.isAudioTag = function(item) {
		if (window.HTMLAudioElement) {
			return item instanceof HTMLAudioElement;
		} else {
			return false;
		}
	};

	/**
	 * Check if item is a valid HTMLVideoElement
	 * @method isVideoTag
	 * @param {Object} item
	 * @returns {Boolean}
	 * @static
	 */
	s.isVideoTag = function(item) {
		if (window.HTMLVideoElement) {
			return item instanceof HTMLVideoElement;
		} else {
			return false;
		}
	};

	createjs.DomUtils = s;

}());

//##############################################################################
// RequestUtils.js
//##############################################################################

(function () {

	/**
	 * Utilities that assist with parsing load items, and determining file types, etc.
	 * @class RequestUtils
	 */
	var s = {};

	/**
	 * Determine if a specific type should be loaded as a binary file. Currently, only images and items marked
	 * specifically as "binary" are loaded as binary. Note that audio is <b>not</b> a binary type, as we can not play
	 * back using an audio tag if it is loaded as binary. Plugins can change the item type to binary to ensure they get
	 * a binary result to work with. Binary files are loaded using XHR2. Types are defined as static constants on
	 * {{#crossLink "AbstractLoader"}}{{/crossLink}}.
	 * @method isBinary
	 * @param {String} type The item type.
	 * @return {Boolean} If the specified type is binary.
	 * @static
	 */
	s.isBinary = function (type) {
		switch (type) {
			case createjs.Types.IMAGE:
			case createjs.Types.BINARY:
				return true;
			default:
				return false;
		}
	};

	/**
	 * Determine if a specific type is a text-based asset, and should be loaded as UTF-8.
	 * @method isText
	 * @param {String} type The item type.
	 * @return {Boolean} If the specified type is text.
	 * @static
	 */
	s.isText = function (type) {
		switch (type) {
			case createjs.Types.TEXT:
			case createjs.Types.JSON:
			case createjs.Types.MANIFEST:
			case createjs.Types.XML:
			case createjs.Types.CSS:
			case createjs.Types.SVG:
			case createjs.Types.JAVASCRIPT:
			case createjs.Types.SPRITESHEET:
				return true;
			default:
				return false;
		}
	};

	/**
	 * Determine the type of the object using common extensions. Note that the type can be passed in with the load item
	 * if it is an unusual extension.
	 * @method getTypeByExtension
	 * @param {String} extension The file extension to use to determine the load type.
	 * @return {String} The determined load type (for example, `createjs.Types.IMAGE`). Will return `null` if
	 * the type can not be determined by the extension.
	 * @static
	 */
	s.getTypeByExtension = function (extension) {
		if (extension == null) {
			return createjs.Types.TEXT;
		}

		switch (extension.toLowerCase()) {
			case "jpeg":
			case "jpg":
			case "gif":
			case "png":
			case "webp":
			case "bmp":
				return createjs.Types.IMAGE;
			case "ogg":
			case "mp3":
			case "webm":
				return createjs.Types.SOUND;
			case "mp4":
			case "webm":
			case "ts":
				return createjs.Types.VIDEO;
			case "json":
				return createjs.Types.JSON;
			case "xml":
				return createjs.Types.XML;
			case "css":
				return createjs.Types.CSS;
			case "js":
				return createjs.Types.JAVASCRIPT;
			case 'svg':
				return createjs.Types.SVG;
			default:
				return createjs.Types.TEXT;
		}
	};

	createjs.RequestUtils = s;

}());

//##############################################################################
// URLUtils.js
//##############################################################################

(function () {

	/**
	 * Utilities that assist with parsing load items, and determining file types, etc.
	 * @class URLUtils
	 */
	var s = {};

	/**
	 * The Regular Expression used to test file URLS for an absolute path.
	 * @property ABSOLUTE_PATH
	 * @type {RegExp}
	 * @static
	 */
	s.ABSOLUTE_PATT = /^(?:\w+:)?\/{2}/i;

	/**
	 * The Regular Expression used to test file URLS for a relative path.
	 * @property RELATIVE_PATH
	 * @type {RegExp}
	 * @static
	 */
	s.RELATIVE_PATT = (/^[./]*?\//i);

	/**
	 * The Regular Expression used to test file URLS for an extension. Note that URIs must already have the query string
	 * removed.
	 * @property EXTENSION_PATT
	 * @type {RegExp}
	 * @static
	 */
	s.EXTENSION_PATT = /\/?[^/]+\.(\w{1,5})$/i;

	/**
	 * Parse a file path to determine the information we need to work with it. Currently, PreloadJS needs to know:
	 * <ul>
	 *     <li>If the path is absolute. Absolute paths start with a protocol (such as `http://`, `file://`, or
	 *     `//networkPath`)</li>
	 *     <li>If the path is relative. Relative paths start with `../` or `/path` (or similar)</li>
	 *     <li>The file extension. This is determined by the filename with an extension. Query strings are dropped, and
	 *     the file path is expected to follow the format `name.ext`.</li>
	 * </ul>
	 *
	 * @method parseURI
	 * @param {String} path
	 * @returns {Object} An Object with an `absolute` and `relative` Boolean values,
	 * 	the pieces of the path (protocol, hostname, port, pathname, search, hash, host)
	 * 	as well as an optional 'extension` property, which is the lowercase extension.
	 *
	 * @static
	 */
	s.parseURI = function (path) {
		var info = {
			absolute: false,
			relative: false,
			protocol: null,
			hostname: null,
			port: null,
			pathname: null,
			search: null,
			hash: null,
			host: null
		};

		if (path == null) { return info; }

		// Inject the path parts.
		var parser = createjs.Elements.a();
		parser.href = path;

		for (var n in info) {
			if (n in parser) {
				info[n] = parser[n];
			}
		}

		// Drop the query string
		var queryIndex = path.indexOf("?");
		if (queryIndex > -1) {
			path = path.substr(0, queryIndex);
		}

		// Absolute
		var match;
		if (s.ABSOLUTE_PATT.test(path)) {
			info.absolute = true;

			// Relative
		} else if (s.RELATIVE_PATT.test(path)) {
			info.relative = true;
		}

		// Extension
		if (match = path.match(s.EXTENSION_PATT)) {
			info.extension = match[1].toLowerCase();
		}

		return info;
	};

	/**
	 * Formats an object into a query string for either a POST or GET request.
	 * @method formatQueryString
	 * @param {Object} data The data to convert to a query string.
	 * @param {Array} [query] Existing name/value pairs to append on to this query.
	 * @static
	 */
	s.formatQueryString = function (data, query) {
		if (data == null) {
			throw new Error("You must specify data.");
		}
		var params = [];
		for (var n in data) {
			params.push(n + "=" + escape(data[n]));
		}
		if (query) {
			params = params.concat(query);
		}
		return params.join("&");
	};

	/**
	 * A utility method that builds a file path using a source and a data object, and formats it into a new path.
	 * @method buildURI
	 * @param {String} src The source path to add values to.
	 * @param {Object} [data] Object used to append values to this request as a query string. Existing parameters on the
	 * path will be preserved.
	 * @returns {string} A formatted string that contains the path and the supplied parameters.
	 * @static
	 */
	s.buildURI = function (src, data) {
		if (data == null) {
			return src;
		}

		var query = [];
		var idx = src.indexOf("?");

		if (idx != -1) {
			var q = src.slice(idx + 1);
			query = query.concat(q.split("&"));
		}

		if (idx != -1) {
			return src.slice(0, idx) + "?" + this.formatQueryString(data, query);
		} else {
			return src + "?" + this.formatQueryString(data, query);
		}
	};

	/**
	 * @method isCrossDomain
	 * @param {LoadItem|Object} item A load item with a `src` property.
	 * @return {Boolean} If the load item is loading from a different domain than the current location.
	 * @static
	 */
	s.isCrossDomain = function (item) {
		var target = createjs.Elements.a();
		target.href = item.src;

		var host = createjs.Elements.a();
		host.href = location.href;

		var crossdomain = (target.hostname != "") &&
			(target.port != host.port ||
			target.protocol != host.protocol ||
			target.hostname != host.hostname);
		return crossdomain;
	};

	/**
	 * @method isLocal
	 * @param {LoadItem|Object} item A load item with a `src` property
	 * @return {Boolean} If the load item is loading from the "file:" protocol. Assume that the host must be local as
	 * well.
	 * @static
	 */
	s.isLocal = function (item) {
		var target = createjs.Elements.a();
		target.href = item.src;
		return target.hostname == "" && target.protocol == "file:";
	};

	createjs.URLUtils = s;

}());

//##############################################################################
// AbstractLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

// constructor
	/**
	 * The base loader, which defines all the generic methods, properties, and events. All loaders extend this class,
	 * including the {{#crossLink "LoadQueue"}}{{/crossLink}}.
	 * @class AbstractLoader
	 * @param {LoadItem|object|string} loadItem The item to be loaded.
	 * @param {Boolean} [preferXHR] Determines if the LoadItem should <em>try</em> and load using XHR, or take a
	 * tag-based approach, which can be better in cross-domain situations. Not all loaders can load using one or the
	 * other, so this is a suggested directive.
	 * @param {String} [type] The type of loader. Loader types are defined as constants on the AbstractLoader class,
	 * such as {{#crossLink "IMAGE:property"}}{{/crossLink}}, {{#crossLink "CSS:property"}}{{/crossLink}}, etc.
	 * @extends EventDispatcher
	 */
	function AbstractLoader(loadItem, preferXHR, type) {
		this.EventDispatcher_constructor();

		// public properties
		/**
		 * If the loader has completed loading. This provides a quick check, but also ensures that the different approaches
		 * used for loading do not pile up resulting in more than one `complete` {{#crossLink "Event"}}{{/crossLink}}.
		 * @property loaded
		 * @type {Boolean}
		 * @default false
		 */
		this.loaded = false;

		/**
		 * Determine if the loader was canceled. Canceled loads will not fire complete events. Note that this property
		 * is readonly, so {{#crossLink "LoadQueue"}}{{/crossLink}} queues should be closed using {{#crossLink "LoadQueue/close"}}{{/crossLink}}
		 * instead.
		 * @property canceled
		 * @type {Boolean}
		 * @default false
		 * @readonly
		 */
		this.canceled = false;

		/**
		 * The current load progress (percentage) for this item. This will be a number between 0 and 1.
		 *
		 * <h4>Example</h4>
		 *
		 *     var queue = new createjs.LoadQueue();
		 *     queue.loadFile("largeImage.png");
		 *     queue.on("progress", function() {
		 *         console.log("Progress:", queue.progress, event.progress);
		 *     });
		 *
		 * @property progress
		 * @type {Number}
		 * @default 0
		 */
		this.progress = 0;

		/**
		 * The type of item this loader will load. See {{#crossLink "AbstractLoader"}}{{/crossLink}} for a full list of
		 * supported types.
		 * @property type
		 * @type {String}
		 */
		this.type = type;

		/**
		 * A formatter function that converts the loaded raw result into the final result. For example, the JSONLoader
		 * converts a string of text into a JavaScript object. Not all loaders have a resultFormatter, and this property
		 * can be overridden to provide custom formatting.
		 *
		 * Optionally, a resultFormatter can return a callback function in cases where the formatting needs to be
		 * asynchronous, such as creating a new image. The callback function is passed 2 parameters, which are callbacks
		 * to handle success and error conditions in the resultFormatter. Note that the resultFormatter method is
		 * called in the current scope, as well as the success and error callbacks.
		 *
		 * <h4>Example asynchronous resultFormatter</h4>
		 *
		 * 	function _formatResult(loader) {
		 * 		return function(success, error) {
		 * 			if (errorCondition) { error(errorDetailEvent); }
		 * 			success(result);
		 * 		}
		 * 	}
		 * @property resultFormatter
		 * @type {Function}
		 * @default null
		 */
		this.resultFormatter = null;

		// protected properties
		/**
		 * The {{#crossLink "LoadItem"}}{{/crossLink}} this loader represents. Note that this is null in a {{#crossLink "LoadQueue"}}{{/crossLink}},
		 * but will be available on loaders such as {{#crossLink "XMLLoader"}}{{/crossLink}} and {{#crossLink "ImageLoader"}}{{/crossLink}}.
		 * @property _item
		 * @type {LoadItem|Object}
		 * @private
		 */
		if (loadItem) {
			this._item = createjs.LoadItem.create(loadItem);
		} else {
			this._item = null;
		}

		/**
		 * Whether the loader will try and load content using XHR (true) or HTML tags (false).
		 * @property _preferXHR
		 * @type {Boolean}
		 * @private
		 */
		this._preferXHR = preferXHR;

		/**
		 * The loaded result after it is formatted by an optional {{#crossLink "resultFormatter"}}{{/crossLink}}. For
		 * items that are not formatted, this will be the same as the {{#crossLink "_rawResult:property"}}{{/crossLink}}.
		 * The result is accessed using the {{#crossLink "getResult"}}{{/crossLink}} method.
		 * @property _result
		 * @type {Object|String}
		 * @private
		 */
		this._result = null;

		/**
		 * The loaded result before it is formatted. The rawResult is accessed using the {{#crossLink "getResult"}}{{/crossLink}}
		 * method, and passing `true`.
		 * @property _rawResult
		 * @type {Object|String}
		 * @private
		 */
		this._rawResult = null;

		/**
		 * A list of items that loaders load behind the scenes. This does not include the main item the loader is
		 * responsible for loading. Examples of loaders that have sub-items include the {{#crossLink "SpriteSheetLoader"}}{{/crossLink}} and
		 * {{#crossLink "ManifestLoader"}}{{/crossLink}}.
		 * @property _loadItems
		 * @type {null}
		 * @protected
		 */
		this._loadedItems = null;

		/**
		 * The attribute the items loaded using tags use for the source.
		 * @type {string}
		 * @default null
		 * @private
		 */
		this._tagSrcAttribute = null;

		/**
		 * An HTML tag (or similar) that a loader may use to load HTML content, such as images, scripts, etc.
		 * @property _tag
		 * @type {Object}
		 * @private
		 */
		this._tag = null;
	};

	var p = createjs.extend(AbstractLoader, createjs.EventDispatcher);
	var s = AbstractLoader;

	// Remove these @deprecated properties after 1.0
	try {
		Object.defineProperties(s, {
			POST: { get: createjs.deprecate(function() { return createjs.Methods.POST; }, "AbstractLoader.POST") },
			GET: { get: createjs.deprecate(function() { return createjs.Methods.GET; }, "AbstractLoader.GET") },

			BINARY: { get: createjs.deprecate(function() { return createjs.Types.BINARY; }, "AbstractLoader.BINARY") },
			CSS: { get: createjs.deprecate(function() { return createjs.Types.CSS; }, "AbstractLoader.CSS") },
			FONT: { get: createjs.deprecate(function() { return createjs.Types.FONT; }, "AbstractLoader.FONT") },
			FONTCSS: { get: createjs.deprecate(function() { return createjs.Types.FONTCSS; }, "AbstractLoader.FONTCSS") },
			IMAGE: { get: createjs.deprecate(function() { return createjs.Types.IMAGE; }, "AbstractLoader.IMAGE") },
			JAVASCRIPT: { get: createjs.deprecate(function() { return createjs.Types.JAVASCRIPT; }, "AbstractLoader.JAVASCRIPT") },
			JSON: { get: createjs.deprecate(function() { return createjs.Types.JSON; }, "AbstractLoader.JSON") },
			JSONP: { get: createjs.deprecate(function() { return createjs.Types.JSONP; }, "AbstractLoader.JSONP") },
			MANIFEST: { get: createjs.deprecate(function() { return createjs.Types.MANIFEST; }, "AbstractLoader.MANIFEST") },
			SOUND: { get: createjs.deprecate(function() { return createjs.Types.SOUND; }, "AbstractLoader.SOUND") },
			VIDEO: { get: createjs.deprecate(function() { return createjs.Types.VIDEO; }, "AbstractLoader.VIDEO") },
			SPRITESHEET: { get: createjs.deprecate(function() { return createjs.Types.SPRITESHEET; }, "AbstractLoader.SPRITESHEET") },
			SVG: { get: createjs.deprecate(function() { return createjs.Types.SVG; }, "AbstractLoader.SVG") },
			TEXT: { get: createjs.deprecate(function() { return createjs.Types.TEXT; }, "AbstractLoader.TEXT") },
			XML: { get: createjs.deprecate(function() { return createjs.Types.XML; }, "AbstractLoader.XML") }
		});
	} catch (e) {}

// Events
	/**
	 * The {{#crossLink "ProgressEvent"}}{{/crossLink}} that is fired when the overall progress changes. Prior to
	 * version 0.6.0, this was just a regular {{#crossLink "Event"}}{{/crossLink}}.
	 * @event progress
	 * @since 0.3.0
	 */

	/**
	 * The {{#crossLink "Event"}}{{/crossLink}} that is fired when a load starts.
	 * @event loadstart
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @since 0.3.1
	 */

	/**
	 * The {{#crossLink "Event"}}{{/crossLink}} that is fired when the entire queue has been loaded.
	 * @event complete
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @since 0.3.0
	 */

	/**
	 * The {{#crossLink "ErrorEvent"}}{{/crossLink}} that is fired when the loader encounters an error. If the error was
	 * encountered by a file, the event will contain the item that caused the error. Prior to version 0.6.0, this was
	 * just a regular {{#crossLink "Event"}}{{/crossLink}}.
	 * @event error
	 * @since 0.3.0
	 */

	/**
	 * The {{#crossLink "Event"}}{{/crossLink}} that is fired when the loader encounters an internal file load error.
	 * This enables loaders to maintain internal queues, and surface file load errors.
	 * @event fileerror
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type ("fileerror")
	 * @param {LoadItem|object} The item that encountered the error
	 * @since 0.6.0
	 */

	/**
	 * The {{#crossLink "Event"}}{{/crossLink}} that is fired when a loader internally loads a file. This enables
	 * loaders such as {{#crossLink "ManifestLoader"}}{{/crossLink}} to maintain internal {{#crossLink "LoadQueue"}}{{/crossLink}}s
	 * and notify when they have loaded a file. The {{#crossLink "LoadQueue"}}{{/crossLink}} class dispatches a
	 * slightly different {{#crossLink "LoadQueue/fileload:event"}}{{/crossLink}} event.
	 * @event fileload
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type ("fileload")
	 * @param {Object} item The file item which was specified in the {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}}
	 * or {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}} call. If only a string path or tag was specified, the
	 * object will contain that value as a `src` property.
	 * @param {Object} result The HTML tag or parsed result of the loaded item.
	 * @param {Object} rawResult The unprocessed result, usually the raw text or binary data before it is converted
	 * to a usable object.
	 * @since 0.6.0
	 */

	/**
	 * The {{#crossLink "Event"}}{{/crossLink}} that is fired after the internal request is created, but before a load.
	 * This allows updates to the loader for specific loading needs, such as binary or XHR image loading.
	 * @event initialize
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type ("initialize")
	 * @param {AbstractLoader} loader The loader that has been initialized.
	 */


	/**
	 * Get a reference to the manifest item that is loaded by this loader. In some cases this will be the value that was
	 * passed into {{#crossLink "LoadQueue"}}{{/crossLink}} using {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}} or
	 * {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}}. However if only a String path was passed in, then it will
	 * be a {{#crossLink "LoadItem"}}{{/crossLink}}.
	 * @method getItem
	 * @return {Object} The manifest item that this loader is responsible for loading.
	 * @since 0.6.0
	 */
	p.getItem = function () {
		return this._item;
	};

	/**
	 * Get a reference to the content that was loaded by the loader (only available after the {{#crossLink "complete:event"}}{{/crossLink}}
	 * event is dispatched.
	 * @method getResult
	 * @param {Boolean} [raw=false] Determines if the returned result will be the formatted content, or the raw loaded
	 * data (if it exists).
	 * @return {Object}
	 * @since 0.6.0
	 */
	p.getResult = function (raw) {
		return raw ? this._rawResult : this._result;
	};

	/**
	 * Return the `tag` this object creates or uses for loading.
	 * @method getTag
	 * @return {Object} The tag instance
	 * @since 0.6.0
	 */
	p.getTag = function () {
		return this._tag;
	};

	/**
	 * Set the `tag` this item uses for loading.
	 * @method setTag
	 * @param {Object} tag The tag instance
	 * @since 0.6.0
	 */
	p.setTag = function(tag) {
	  this._tag = tag;
	};

	/**
	 * Begin loading the item. This method is required when using a loader by itself.
	 *
	 * <h4>Example</h4>
	 *
	 *      var queue = new createjs.LoadQueue();
	 *      queue.on("complete", handleComplete);
	 *      queue.loadManifest(fileArray, false); // Note the 2nd argument that tells the queue not to start loading yet
	 *      queue.load();
	 *
	 * @method load
	 */
	p.load = function () {
		this._createRequest();

		this._request.on("complete", this, this);
		this._request.on("progress", this, this);
		this._request.on("loadStart", this, this);
		this._request.on("abort", this, this);
		this._request.on("timeout", this, this);
		this._request.on("error", this, this);

		var evt = new createjs.Event("initialize");
		evt.loader = this._request;
		this.dispatchEvent(evt);

		this._request.load();
	};

	/**
	 * Close the the item. This will stop any open requests (although downloads using HTML tags may still continue in
	 * the background), but events will not longer be dispatched.
	 * @method cancel
	 */
	p.cancel = function () {
		this.canceled = true;
		this.destroy();
	};

	/**
	 * Clean up the loader.
	 * @method destroy
	 */
	p.destroy = function() {
		if (this._request) {
			this._request.removeAllEventListeners();
			this._request.destroy();
		}

		this._request = null;

		this._item = null;
		this._rawResult = null;
		this._result = null;

		this._loadItems = null;

		this.removeAllEventListeners();
	};

	/**
	 * Get any items loaded internally by the loader. The enables loaders such as {{#crossLink "ManifestLoader"}}{{/crossLink}}
	 * to expose items it loads internally.
	 * @method getLoadedItems
	 * @return {Array} A list of the items loaded by the loader.
	 * @since 0.6.0
	 */
	p.getLoadedItems = function () {
		return this._loadedItems;
	};


	// Private methods
	/**
	 * Create an internal request used for loading. By default, an {{#crossLink "XHRRequest"}}{{/crossLink}} or
	 * {{#crossLink "TagRequest"}}{{/crossLink}} is created, depending on the value of {{#crossLink "preferXHR:property"}}{{/crossLink}}.
	 * Other loaders may override this to use different request types, such as {{#crossLink "ManifestLoader"}}{{/crossLink}},
	 * which uses {{#crossLink "JSONLoader"}}{{/crossLink}} or {{#crossLink "JSONPLoader"}}{{/crossLink}} under the hood.
	 * @method _createRequest
	 * @protected
	 */
	p._createRequest = function() {
		if (!this._preferXHR) {
			this._request = new createjs.TagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute);
		} else {
			this._request = new createjs.XHRRequest(this._item);
		}
	};

	/**
	 * Create the HTML tag used for loading. This method does nothing by default, and needs to be implemented
	 * by loaders that require tag loading.
	 * @method _createTag
	 * @param {String} src The tag source
	 * @return {HTMLElement} The tag that was created
	 * @protected
	 */
	p._createTag = function(src) { return null; };

	/**
	 * Dispatch a loadstart {{#crossLink "Event"}}{{/crossLink}}. Please see the {{#crossLink "AbstractLoader/loadstart:event"}}{{/crossLink}}
	 * event for details on the event payload.
	 * @method _sendLoadStart
	 * @protected
	 */
	p._sendLoadStart = function () {
		if (this._isCanceled()) { return; }
		this.dispatchEvent("loadstart");
	};

	/**
	 * Dispatch a {{#crossLink "ProgressEvent"}}{{/crossLink}}.
	 * @method _sendProgress
	 * @param {Number | Object} value The progress of the loaded item, or an object containing <code>loaded</code>
	 * and <code>total</code> properties.
	 * @protected
	 */
	p._sendProgress = function (value) {
		if (this._isCanceled()) { return; }
		var event = null;
		if (typeof(value) == "number") {
			this.progress = value;
			event = new createjs.ProgressEvent(this.progress);
		} else {
			event = value;
			this.progress = value.loaded / value.total;
			event.progress = this.progress;
			if (isNaN(this.progress) || this.progress == Infinity) { this.progress = 0; }
		}
		this.hasEventListener("progress") && this.dispatchEvent(event);
	};

	/**
	 * Dispatch a complete {{#crossLink "Event"}}{{/crossLink}}. Please see the {{#crossLink "AbstractLoader/complete:event"}}{{/crossLink}} event
	 * @method _sendComplete
	 * @protected
	 */
	p._sendComplete = function () {
		if (this._isCanceled()) { return; }

		this.loaded = true;

		var event = new createjs.Event("complete");
		event.rawResult = this._rawResult;

		if (this._result != null) {
			event.result = this._result;
		}

		this.dispatchEvent(event);
	};

	/**
	 * Dispatch an error {{#crossLink "Event"}}{{/crossLink}}. Please see the {{#crossLink "AbstractLoader/error:event"}}{{/crossLink}}
	 * event for details on the event payload.
	 * @method _sendError
	 * @param {ErrorEvent} event The event object containing specific error properties.
	 * @protected
	 */
	p._sendError = function (event) {
		if (this._isCanceled() || !this.hasEventListener("error")) { return; }
		if (event == null) {
			event = new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY"); // TODO: Populate error
		}
		this.dispatchEvent(event);
	};

	/**
	 * Determine if the load has been canceled. This is important to ensure that method calls or asynchronous events
	 * do not cause issues after the queue has been cleaned up.
	 * @method _isCanceled
	 * @return {Boolean} If the loader has been canceled.
	 * @protected
	 */
	p._isCanceled = function () {
		if (window.createjs == null || this.canceled) {
			return true;
		}
		return false;
	};

	/**
	 * A custom result formatter function, which is called just before a request dispatches its complete event. Most
	 * loader types already have an internal formatter, but this can be user-overridden for custom formatting. The
	 * formatted result will be available on Loaders using {{#crossLink "getResult"}}{{/crossLink}}, and passing `true`.
	 * @property resultFormatter
	 * @type Function
	 * @return {Object} The formatted result
	 * @since 0.6.0
	 */
	p.resultFormatter = null;

	/**
	 * Handle events from internal requests. By default, loaders will handle, and redispatch the necessary events, but
	 * this method can be overridden for custom behaviours.
	 * @method handleEvent
	 * @param {Event} event The event that the internal request dispatches.
	 * @protected
	 * @since 0.6.0
	 */
	p.handleEvent = function (event) {
		switch (event.type) {
			case "complete":
				this._rawResult = event.target._response;
				var result = this.resultFormatter && this.resultFormatter(this);
				// The resultFormatter is asynchronous
				if (result instanceof Function) {
					result.call(this,
							createjs.proxy(this._resultFormatSuccess, this),
							createjs.proxy(this._resultFormatFailed, this)
					);
				// The result formatter is synchronous
				} else {
					this._result =  result || this._rawResult;
					this._sendComplete();
				}
				break;
			case "progress":
				this._sendProgress(event);
				break;
			case "error":
				this._sendError(event);
				break;
			case "loadstart":
				this._sendLoadStart();
				break;
			case "abort":
			case "timeout":
				if (!this._isCanceled()) {
					this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_" + event.type.toUpperCase() + "_ERROR"));
				}
				break;
		}
	};

	/**
	 * The "success" callback passed to {{#crossLink "AbstractLoader/resultFormatter"}}{{/crossLink}} asynchronous
	 * functions.
	 * @method _resultFormatSuccess
	 * @param {Object} result The formatted result
	 * @private
	 */
	p._resultFormatSuccess = function (result) {
		this._result = result;
		this._sendComplete();
	};

	/**
	 * The "error" callback passed to {{#crossLink "AbstractLoader/resultFormatter"}}{{/crossLink}} asynchronous
	 * functions.
	 * @method _resultFormatSuccess
	 * @param {Object} error The error event
	 * @private
	 */
	p._resultFormatFailed = function (event) {
		this._sendError(event);
	};

	/**
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	p.toString = function () {
		return "[PreloadJS AbstractLoader]";
	};

	createjs.AbstractLoader = createjs.promote(AbstractLoader, "EventDispatcher");

}());

//##############################################################################
// AbstractMediaLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * The AbstractMediaLoader is a base class that handles some of the shared methods and properties of loaders that
	 * handle HTML media elements, such as Video and Audio.
	 * @class AbstractMediaLoader
	 * @param {LoadItem|Object} loadItem
	 * @param {Boolean} preferXHR
	 * @param {String} type The type of media to load. Usually "video" or "audio".
	 * @extends AbstractLoader
	 * @constructor
	 */
	function AbstractMediaLoader(loadItem, preferXHR, type) {
		this.AbstractLoader_constructor(loadItem, preferXHR, type);

		// public properties
		this.resultFormatter = this._formatResult;

		// protected properties
		this._tagSrcAttribute = "src";

        this.on("initialize", this._updateXHR, this);
	};

	var p = createjs.extend(AbstractMediaLoader, createjs.AbstractLoader);

	// static properties
	// public methods
	p.load = function () {
		// TagRequest will handle most of this, but Sound / Video need a few custom properties, so just handle them here.
		if (!this._tag) {
			this._tag = this._createTag(this._item.src);
		}

		this._tag.preload = "auto";
		this._tag.load();

		this.AbstractLoader_load();
	};

	// protected methods
	/**
	 * Creates a new tag for loading if it doesn't exist yet.
	 * @method _createTag
	 * @private
	 */
	p._createTag = function () {};


	p._createRequest = function() {
		if (!this._preferXHR) {
			this._request = new createjs.MediaTagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute);
		} else {
			this._request = new createjs.XHRRequest(this._item);
		}
	};

    // protected methods
    /**
     * Before the item loads, set its mimeType and responseType.
     * @property _updateXHR
     * @param {Event} event
     * @private
     */
    p._updateXHR = function (event) {
        // Only exists for XHR
        if (event.loader.setResponseType) {
            event.loader.setResponseType("blob");
        }
    };

	/**
	 * The result formatter for media files.
	 * @method _formatResult
	 * @param {AbstractLoader} loader
	 * @returns {HTMLVideoElement|HTMLAudioElement}
	 * @private
	 */
	p._formatResult = function (loader) {
		this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler);
		this._tag.onstalled = null;
		if (this._preferXHR) {
            var URL = window.URL || window.webkitURL;
            var result = loader.getResult(true);

			loader.getTag().src = URL.createObjectURL(result);
		}
		return loader.getTag();
	};

	createjs.AbstractMediaLoader = createjs.promote(AbstractMediaLoader, "AbstractLoader");

}());

//##############################################################################
// AbstractRequest.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	/**
	 * A base class for actual data requests, such as {{#crossLink "XHRRequest"}}{{/crossLink}}, {{#crossLink "TagRequest"}}{{/crossLink}},
	 * and {{#crossLink "MediaRequest"}}{{/crossLink}}. PreloadJS loaders will typically use a data loader under the
	 * hood to get data.
	 * @class AbstractRequest
	 * @param {LoadItem} item
	 * @constructor
	 */
	var AbstractRequest = function (item) {
		this._item = item;
	};

	var p = createjs.extend(AbstractRequest, createjs.EventDispatcher);

	// public methods
	/**
	 * Begin a load.
	 * @method load
	 */
	p.load =  function() {};

	/**
	 * Clean up a request.
	 * @method destroy
	 */
	p.destroy = function() {};

	/**
	 * Cancel an in-progress request.
	 * @method cancel
	 */
	p.cancel = function() {};

	createjs.AbstractRequest = createjs.promote(AbstractRequest, "EventDispatcher");

}());

//##############################################################################
// TagRequest.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * An {{#crossLink "AbstractRequest"}}{{/crossLink}} that loads HTML tags, such as images and scripts.
	 * @class TagRequest
	 * @param {LoadItem} loadItem
	 * @param {HTMLElement} tag
	 * @param {String} srcAttribute The tag attribute that specifies the source, such as "src", "href", etc.
	 */
	function TagRequest(loadItem, tag, srcAttribute) {
		this.AbstractRequest_constructor(loadItem);

		// protected properties
		/**
		 * The HTML tag instance that is used to load.
		 * @property _tag
		 * @type {HTMLElement}
		 * @protected
		 */
		this._tag = tag;

		/**
		 * The tag attribute that specifies the source, such as "src", "href", etc.
		 * @property _tagSrcAttribute
		 * @type {String}
		 * @protected
		 */
		this._tagSrcAttribute = srcAttribute;

		/**
		 * A method closure used for handling the tag load event.
		 * @property _loadedHandler
		 * @type {Function}
		 * @private
		 */
		this._loadedHandler = createjs.proxy(this._handleTagComplete, this);

		/**
		 * Determines if the element was added to the DOM automatically by PreloadJS, so it can be cleaned up after.
		 * @property _addedToDOM
		 * @type {Boolean}
		 * @private
		 */
		this._addedToDOM = false;

	};

	var p = createjs.extend(TagRequest, createjs.AbstractRequest);

	// public methods
	p.load = function () {
		this._tag.onload = createjs.proxy(this._handleTagComplete, this);
		this._tag.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this);
		this._tag.onerror = createjs.proxy(this._handleError, this);

		var evt = new createjs.Event("initialize");
		evt.loader = this._tag;

		this.dispatchEvent(evt);

		this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);

		this._tag[this._tagSrcAttribute] = this._item.src;

		// wdg:: Append the tag AFTER setting the src, or SVG loading on iOS will fail.
		if (this._tag.parentNode == null) {
			createjs.DomUtils.appendToBody(this._tag);
			this._addedToDOM = true;
		}
	};

	p.destroy = function() {
		this._clean();
		this._tag = null;

		this.AbstractRequest_destroy();
	};

	// private methods
	/**
	 * Handle the readyStateChange event from a tag. We need this in place of the `onload` callback (mainly SCRIPT
	 * and LINK tags), but other cases may exist.
	 * @method _handleReadyStateChange
	 * @private
	 */
	p._handleReadyStateChange = function () {
		clearTimeout(this._loadTimeout);
		// This is strictly for tags in browsers that do not support onload.
		var tag = this._tag;

		// Complete is for old IE support.
		if (tag.readyState == "loaded" || tag.readyState == "complete") {
			this._handleTagComplete();
		}
	};

	/**
	 * Handle any error events from the tag.
	 * @method _handleError
	 * @protected
	 */
	p._handleError = function() {
		this._clean();
		this.dispatchEvent("error");
	};

	/**
	 * Handle the tag's onload callback.
	 * @method _handleTagComplete
	 * @private
	 */
	p._handleTagComplete = function () {
		this._rawResult = this._tag;
		this._result = this.resultFormatter && this.resultFormatter(this) || this._rawResult;

		this._clean();

		this.dispatchEvent("complete");
	};

	/**
	 * The tag request has not loaded within the time specified in loadTimeout.
	 * @method _handleError
	 * @param {Object} event The XHR error event.
	 * @private
	 */
	p._handleTimeout = function () {
		this._clean();
		this.dispatchEvent(new createjs.Event("timeout"));
	};

	/**
	 * Remove event listeners, but don't destroy the request object
	 * @method _clean
	 * @private
	 */
	p._clean = function() {
		this._tag.onload = null;
		this._tag.onreadystatechange = null;
		this._tag.onerror = null;
		if (this._addedToDOM && this._tag.parentNode != null) {
			this._tag.parentNode.removeChild(this._tag);
		}
		clearTimeout(this._loadTimeout);
	};

	/**
	 * Handle a stalled audio event. The main place this happens is with HTMLAudio in Chrome when playing back audio
	 * that is already in a load, but not complete.
	 * @method _handleStalled
	 * @private
	 */
	p._handleStalled = function () {
		//Ignore, let the timeout take care of it. Sometimes its not really stopped.
	};

	createjs.TagRequest = createjs.promote(TagRequest, "AbstractRequest");

}());

//##############################################################################
// MediaTagRequest.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * An {{#crossLink "TagRequest"}}{{/crossLink}} that loads HTML tags for video and audio.
	 * @class MediaTagRequest
	 * @param {LoadItem} loadItem
	 * @param {HTMLAudioElement|HTMLVideoElement} tag
	 * @param {String} srcAttribute The tag attribute that specifies the source, such as "src", "href", etc.
	 * @constructor
	 */
	function MediaTagRequest(loadItem, tag, srcAttribute) {
		this.AbstractRequest_constructor(loadItem);

		// protected properties
		this._tag = tag;
		this._tagSrcAttribute = srcAttribute;
		this._loadedHandler = createjs.proxy(this._handleTagComplete, this);
	};

	var p = createjs.extend(MediaTagRequest, createjs.TagRequest);
	var s = MediaTagRequest;

	// public methods
	p.load = function () {
		var sc = createjs.proxy(this._handleStalled, this);
		this._stalledCallback = sc;

		var pc = createjs.proxy(this._handleProgress, this);
		this._handleProgress = pc;

		this._tag.addEventListener("stalled", sc);
		this._tag.addEventListener("progress", pc);

		// This will tell us when audio is buffered enough to play through, but not when its loaded.
		// The tag doesn't keep loading in Chrome once enough has buffered, and we have decided that behaviour is sufficient.
		this._tag.addEventListener && this._tag.addEventListener("canplaythrough", this._loadedHandler, false); // canplaythrough callback doesn't work in Chrome, so we use an event.

		this.TagRequest_load();
	};

	// private methods
	p._handleReadyStateChange = function () {
		clearTimeout(this._loadTimeout);
		// This is strictly for tags in browsers that do not support onload.
		var tag = this._tag;

		// Complete is for old IE support.
		if (tag.readyState == "loaded" || tag.readyState == "complete") {
			this._handleTagComplete();
		}
	};

	p._handleStalled = function () {
		//Ignore, let the timeout take care of it. Sometimes its not really stopped.
	};

	/**
	 * An XHR request has reported progress.
	 * @method _handleProgress
	 * @param {Object} event The XHR progress event.
	 * @private
	 */
	p._handleProgress = function (event) {
		if (!event || event.loaded > 0 && event.total == 0) {
			return; // Sometimes we get no "total", so just ignore the progress event.
		}

		var newEvent = new createjs.ProgressEvent(event.loaded, event.total);
		this.dispatchEvent(newEvent);
	};

	// protected methods
	p._clean = function () {
		this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler);
		this._tag.removeEventListener("stalled", this._stalledCallback);
		this._tag.removeEventListener("progress", this._progressCallback);

		this.TagRequest__clean();
	};

	createjs.MediaTagRequest = createjs.promote(MediaTagRequest, "TagRequest");

}());

//##############################################################################
// XHRRequest.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

// constructor
	/**
	 * A preloader that loads items using XHR requests, usually XMLHttpRequest. However XDomainRequests will be used
	 * for cross-domain requests if possible, and older versions of IE fall back on to ActiveX objects when necessary.
	 * XHR requests load the content as text or binary data, provide progress and consistent completion events, and
	 * can be canceled during load. Note that XHR is not supported in IE 6 or earlier, and is not recommended for
	 * cross-domain loading.
	 * @class XHRRequest
	 * @constructor
	 * @param {Object} item The object that defines the file to load. Please see the {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}}
	 * for an overview of supported file properties.
	 * @extends AbstractLoader
	 */
	function XHRRequest (item) {
		this.AbstractRequest_constructor(item);

		// protected properties
		/**
		 * A reference to the XHR request used to load the content.
		 * @property _request
		 * @type {XMLHttpRequest | XDomainRequest | ActiveX.XMLHTTP}
		 * @private
		 */
		this._request = null;

		/**
		 * A manual load timeout that is used for browsers that do not support the onTimeout event on XHR (XHR level 1,
		 * typically IE9).
		 * @property _loadTimeout
		 * @type {Number}
		 * @private
		 */
		this._loadTimeout = null;

		/**
		 * The browser's XHR (XMLHTTPRequest) version. Supported versions are 1 and 2. There is no official way to detect
		 * the version, so we use capabilities to make a best guess.
		 * @property _xhrLevel
		 * @type {Number}
		 * @default 1
		 * @private
		 */
		this._xhrLevel = 1;

		/**
		 * The response of a loaded file. This is set because it is expensive to look up constantly. This property will be
		 * null until the file is loaded.
		 * @property _response
		 * @type {mixed}
		 * @private
		 */
		this._response = null;

		/**
		 * The response of the loaded file before it is modified. In most cases, content is converted from raw text to
		 * an HTML tag or a formatted object which is set to the <code>result</code> property, but the developer may still
		 * want to access the raw content as it was loaded.
		 * @property _rawResponse
		 * @type {String|Object}
		 * @private
		 */
		this._rawResponse = null;

		this._canceled = false;

		// Setup our event handlers now.
		this._handleLoadStartProxy = createjs.proxy(this._handleLoadStart, this);
		this._handleProgressProxy = createjs.proxy(this._handleProgress, this);
		this._handleAbortProxy = createjs.proxy(this._handleAbort, this);
		this._handleErrorProxy = createjs.proxy(this._handleError, this);
		this._handleTimeoutProxy = createjs.proxy(this._handleTimeout, this);
		this._handleLoadProxy = createjs.proxy(this._handleLoad, this);
		this._handleReadyStateChangeProxy = createjs.proxy(this._handleReadyStateChange, this);

		if (!this._createXHR(item)) {
			//TODO: Throw error?
		}
	};

	var p = createjs.extend(XHRRequest, createjs.AbstractRequest);

// static properties
	/**
	 * A list of XMLHTTP object IDs to try when building an ActiveX object for XHR requests in earlier versions of IE.
	 * @property ACTIVEX_VERSIONS
	 * @type {Array}
	 * @since 0.4.2
	 * @private
	 */
	XHRRequest.ACTIVEX_VERSIONS = [
		"Msxml2.XMLHTTP.6.0",
		"Msxml2.XMLHTTP.5.0",
		"Msxml2.XMLHTTP.4.0",
		"MSXML2.XMLHTTP.3.0",
		"MSXML2.XMLHTTP",
		"Microsoft.XMLHTTP"
	];

// Public methods
	/**
	 * Look up the loaded result.
	 * @method getResult
	 * @param {Boolean} [raw=false] Return a raw result instead of a formatted result. This applies to content
	 * loaded via XHR such as scripts, XML, CSS, and Images. If there is no raw result, the formatted result will be
	 * returned instead.
	 * @return {Object} A result object containing the content that was loaded, such as:
	 * <ul>
	 *      <li>An image tag (&lt;image /&gt;) for images</li>
	 *      <li>A script tag for JavaScript (&lt;script /&gt;). Note that scripts loaded with tags may be added to the
	 *      HTML head.</li>
	 *      <li>A style tag for CSS (&lt;style /&gt;)</li>
	 *      <li>Raw text for TEXT</li>
	 *      <li>A formatted JavaScript object defined by JSON</li>
	 *      <li>An XML document</li>
	 *      <li>An binary arraybuffer loaded by XHR</li>
	 * </ul>
	 * Note that if a raw result is requested, but not found, the result will be returned instead.
	 */
	p.getResult = function (raw) {
		if (raw && this._rawResponse) {
			return this._rawResponse;
		}
		return this._response;
	};

	// Overrides abstract method in AbstractRequest
	p.cancel = function () {
		this.canceled = true;
		this._clean();
		this._request.abort();
	};

	// Overrides abstract method in AbstractLoader
	p.load = function () {
		if (this._request == null) {
			this._handleError();
			return;
		}

		//Events
		if (this._request.addEventListener != null) {
			this._request.addEventListener("loadstart", this._handleLoadStartProxy, false);
			this._request.addEventListener("progress", this._handleProgressProxy, false);
			this._request.addEventListener("abort", this._handleAbortProxy, false);
			this._request.addEventListener("error", this._handleErrorProxy, false);
			this._request.addEventListener("timeout", this._handleTimeoutProxy, false);

			// Note: We don't get onload in all browsers (earlier FF and IE). onReadyStateChange handles these.
			this._request.addEventListener("load", this._handleLoadProxy, false);
			this._request.addEventListener("readystatechange", this._handleReadyStateChangeProxy, false);
		} else {
			// IE9 support
			this._request.onloadstart = this._handleLoadStartProxy;
			this._request.onprogress = this._handleProgressProxy;
			this._request.onabort = this._handleAbortProxy;
			this._request.onerror = this._handleErrorProxy;
			this._request.ontimeout = this._handleTimeoutProxy;

			// Note: We don't get onload in all browsers (earlier FF and IE). onReadyStateChange handles these.
			this._request.onload = this._handleLoadProxy;
			this._request.onreadystatechange = this._handleReadyStateChangeProxy;
		}

		// Set up a timeout if we don't have XHR2
		if (this._xhrLevel == 1) {
			this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);
		}

		// Sometimes we get back 404s immediately, particularly when there is a cross origin request.  // note this does not catch in Chrome
		try {
			if (!this._item.values) {
				this._request.send();
			} else {
				this._request.send(createjs.URLUtils.formatQueryString(this._item.values));
			}
		} catch (error) {
			this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND", null, error));
		}
	};

	p.setResponseType = function (type) {
		// Some old browsers doesn't support blob, so we convert arraybuffer to blob after response is downloaded
		if (type === 'blob') {
			type = window.URL ? 'blob' : 'arraybuffer';
			this._responseType = type;
		}
		this._request.responseType = type;
	};

	/**
	 * Get all the response headers from the XmlHttpRequest.
	 *
	 * <strong>From the docs:</strong> Return all the HTTP headers, excluding headers that are a case-insensitive match
	 * for Set-Cookie or Set-Cookie2, as a single string, with each header line separated by a U+000D CR U+000A LF pair,
	 * excluding the status line, and with each header name and header value separated by a U+003A COLON U+0020 SPACE
	 * pair.
	 * @method getAllResponseHeaders
	 * @return {String}
	 * @since 0.4.1
	 */
	p.getAllResponseHeaders = function () {
		if (this._request.getAllResponseHeaders instanceof Function) {
			return this._request.getAllResponseHeaders();
		} else {
			return null;
		}
	};

	/**
	 * Get a specific response header from the XmlHttpRequest.
	 *
	 * <strong>From the docs:</strong> Returns the header field value from the response of which the field name matches
	 * header, unless the field name is Set-Cookie or Set-Cookie2.
	 * @method getResponseHeader
	 * @param {String} header The header name to retrieve.
	 * @return {String}
	 * @since 0.4.1
	 */
	p.getResponseHeader = function (header) {
		if (this._request.getResponseHeader instanceof Function) {
			return this._request.getResponseHeader(header);
		} else {
			return null;
		}
	};

// protected methods
	/**
	 * The XHR request has reported progress.
	 * @method _handleProgress
	 * @param {Object} event The XHR progress event.
	 * @private
	 */
	p._handleProgress = function (event) {
		if (!event || event.loaded > 0 && event.total == 0) {
			return; // Sometimes we get no "total", so just ignore the progress event.
		}

		var newEvent = new createjs.ProgressEvent(event.loaded, event.total);
		this.dispatchEvent(newEvent);
	};

	/**
	 * The XHR request has reported a load start.
	 * @method _handleLoadStart
	 * @param {Object} event The XHR loadStart event.
	 * @private
	 */
	p._handleLoadStart = function (event) {
		clearTimeout(this._loadTimeout);
		this.dispatchEvent("loadstart");
	};

	/**
	 * The XHR request has reported an abort event.
	 * @method handleAbort
	 * @param {Object} event The XHR abort event.
	 * @private
	 */
	p._handleAbort = function (event) {
		this._clean();
		this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED", null, event));
	};

	/**
	 * The XHR request has reported an error event.
	 * @method _handleError
	 * @param {Object} event The XHR error event.
	 * @private
	 */
	p._handleError = function (event) {
		this._clean();
		this.dispatchEvent(new createjs.ErrorEvent(event.message));
	};

	/**
	 * The XHR request has reported a readyState change. Note that older browsers (IE 7 & 8) do not provide an onload
	 * event, so we must monitor the readyStateChange to determine if the file is loaded.
	 * @method _handleReadyStateChange
	 * @param {Object} event The XHR readyStateChange event.
	 * @private
	 */
	p._handleReadyStateChange = function (event) {
		if (this._request.readyState == 4) {
			this._handleLoad();
		}
	};

	/**
	 * The XHR request has completed. This is called by the XHR request directly, or by a readyStateChange that has
	 * <code>request.readyState == 4</code>. Only the first call to this method will be processed.
	 *
	 * Note that This method uses {{#crossLink "_checkError"}}{{/crossLink}} to determine if the server has returned an
	 * error code.
	 * @method _handleLoad
	 * @param {Object} event The XHR load event.
	 * @private
	 */
	p._handleLoad = function (event) {
		if (this.loaded) {
			return;
		}
		this.loaded = true;

		var error = this._checkError();
		if (error) {
			this._handleError(error);
			return;
		}

		this._response = this._getResponse();
		// Convert arraybuffer back to blob
		if (this._responseType === 'arraybuffer') {
			try {
				this._response = new Blob([this._response]);
			} catch (e) {
				// Fallback to use BlobBuilder if Blob constructor is not supported
				// Tested on Android 2.3 ~ 4.2 and iOS5 safari
				window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
				if (e.name === 'TypeError' && window.BlobBuilder) {
					var builder = new BlobBuilder();
					builder.append(this._response);
					this._response = builder.getBlob();
				}
			}
		}
		this._clean();

		this.dispatchEvent(new createjs.Event("complete"));
	};

	/**
	 * The XHR request has timed out. This is called by the XHR request directly, or via a <code>setTimeout</code>
	 * callback.
	 * @method _handleTimeout
	 * @param {Object} [event] The XHR timeout event. This is occasionally null when called by the backup setTimeout.
	 * @private
	 */
	p._handleTimeout = function (event) {
		this._clean();
		this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT", null, event));
	};

// Protected
	/**
	 * Determine if there is an error in the current load.
	 * Currently this checks the status of the request for problem codes, and not actual response content:
	 * <ul>
	 *     <li>Status codes between 400 and 599 (HTTP error range)</li>
	 *     <li>A status of 0, but *only when the application is running on a server*. If the application is running
	 *     on `file:`, then it may incorrectly treat an error on local (or embedded applications) as a successful
	 *     load.</li>
	 * </ul>
	 * @method _checkError
	 * @return {Error} An error with the status code in the `message` argument.
	 * @private
	 */
	p._checkError = function () {
		var status = parseInt(this._request.status);
		if (status >= 400 && status <= 599) {
			return new Error(status);
		} else if (status == 0) {
			if ((/^https?:/).test(location.protocol)) { return new Error(0); }
			return null; // Likely an embedded app.
		} else {
			return null;
		}
	};


	/**
	 * Validate the response. Different browsers have different approaches, some of which throw errors when accessed
	 * in other browsers. If there is no response, the <code>_response</code> property will remain null.
	 * @method _getResponse
	 * @private
	 */
	p._getResponse = function () {
		if (this._response != null) {
			return this._response;
		}

		if (this._request.response != null) {
			return this._request.response;
		}

		// Android 2.2 uses .responseText
		try {
			if (this._request.responseText != null) {
				return this._request.responseText;
			}
		} catch (e) {
		}

		// When loading XML, IE9 does not return .response, instead it returns responseXML.xml
		try {
			if (this._request.responseXML != null) {
				return this._request.responseXML;
			}
		} catch (e) {
		}

		return null;
	};

	/**
	 * Create an XHR request. Depending on a number of factors, we get totally different results.
	 * <ol><li>Some browsers get an <code>XDomainRequest</code> when loading cross-domain.</li>
	 *      <li>XMLHttpRequest are created when available.</li>
	 *      <li>ActiveX.XMLHTTP objects are used in older IE browsers.</li>
	 *      <li>Text requests override the mime type if possible</li>
	 *      <li>Origin headers are sent for crossdomain requests in some browsers.</li>
	 *      <li>Binary loads set the response type to "arraybuffer"</li></ol>
	 * @method _createXHR
	 * @param {Object} item The requested item that is being loaded.
	 * @return {Boolean} If an XHR request or equivalent was successfully created.
	 * @private
	 */
	p._createXHR = function (item) {
		// Check for cross-domain loads. We can't fully support them, but we can try.
		var crossdomain = createjs.URLUtils.isCrossDomain(item);
		var headers = {};

		// Create the request. Fallback to whatever support we have.
		var req = null;
		if (window.XMLHttpRequest) {
			req = new XMLHttpRequest();
			// This is 8 or 9, so use XDomainRequest instead.
			if (crossdomain && req.withCredentials === undefined && window.XDomainRequest) {
				req = new XDomainRequest();
			}
		} else { // Old IE versions use a different approach
			for (var i = 0, l = s.ACTIVEX_VERSIONS.length; i < l; i++) {
				var axVersion = s.ACTIVEX_VERSIONS[i];
				try {
					req = new ActiveXObject(axVersion);
					break;
				} catch (e) {
				}
			}
			if (req == null) {
				return false;
			}
		}

		// Default to utf-8 for Text requests.
		if (item.mimeType == null && createjs.RequestUtils.isText(item.type)) {
			item.mimeType = "text/plain; charset=utf-8";
		}

		// IE9 doesn't support overrideMimeType(), so we need to check for it.
		if (item.mimeType && req.overrideMimeType) {
			req.overrideMimeType(item.mimeType);
		}

		// Determine the XHR level
		this._xhrLevel = (typeof req.responseType === "string") ? 2 : 1;

		var src = null;
		if (item.method == createjs.Methods.GET) {
			src = createjs.URLUtils.buildURI(item.src, item.values);
		} else {
			src = item.src;
		}

		// Open the request.  Set cross-domain flags if it is supported (XHR level 1 only)
		req.open(item.method || createjs.Methods.GET, src, true);

		if (crossdomain && req instanceof XMLHttpRequest && this._xhrLevel == 1) {
			headers["Origin"] = location.origin;
		}

		// To send data we need to set the Content-type header)
		if (item.values && item.method == createjs.Methods.POST) {
			headers["Content-Type"] = "application/x-www-form-urlencoded";
		}

		if (!crossdomain && !headers["X-Requested-With"]) {
			headers["X-Requested-With"] = "XMLHttpRequest";
		}

		if (item.headers) {
			for (var n in item.headers) {
				headers[n] = item.headers[n];
			}
		}

		for (n in headers) {
			req.setRequestHeader(n, headers[n])
		}

		if (req instanceof XMLHttpRequest && item.withCredentials !== undefined) {
			req.withCredentials = item.withCredentials;
		}

		this._request = req;

		return true;
	};

	/**
	 * A request has completed (or failed or canceled), and needs to be disposed.
	 * @method _clean
	 * @private
	 */
	p._clean = function () {
		clearTimeout(this._loadTimeout);

		if (this._request.removeEventListener != null) {
			this._request.removeEventListener("loadstart", this._handleLoadStartProxy);
			this._request.removeEventListener("progress", this._handleProgressProxy);
			this._request.removeEventListener("abort", this._handleAbortProxy);
			this._request.removeEventListener("error", this._handleErrorProxy);
			this._request.removeEventListener("timeout", this._handleTimeoutProxy);
			this._request.removeEventListener("load", this._handleLoadProxy);
			this._request.removeEventListener("readystatechange", this._handleReadyStateChangeProxy);
		} else {
			this._request.onloadstart = null;
			this._request.onprogress = null;
			this._request.onabort = null;
			this._request.onerror = null;
			this._request.ontimeout = null;
			this._request.onload = null;
			this._request.onreadystatechange = null;
		}
	};

	p.toString = function () {
		return "[PreloadJS XHRRequest]";
	};

	createjs.XHRRequest = createjs.promote(XHRRequest, "AbstractRequest");

}());

//##############################################################################
// SoundLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * A loader for HTML audio files. PreloadJS can not load WebAudio files, as a WebAudio context is required, which
	 * should be created by either a library playing the sound (such as <a href="http://soundjs.com">SoundJS</a>, or an
	 * external framework that handles audio playback. To load content that can be played by WebAudio, use the
	 * {{#crossLink "BinaryLoader"}}{{/crossLink}}, and handle the audio context decoding manually.
	 * @class SoundLoader
	 * @param {LoadItem|Object} loadItem
	 * @param {Boolean} preferXHR
	 * @extends AbstractMediaLoader
	 * @constructor
	 */
	function SoundLoader(loadItem, preferXHR) {
		this.AbstractMediaLoader_constructor(loadItem, preferXHR, createjs.Types.SOUND);

		// protected properties
		if (createjs.DomUtils.isAudioTag(loadItem)) {
			this._tag = loadItem;
		} else if (createjs.DomUtils.isAudioTag(loadItem.src)) {
			this._tag = loadItem;
		} else if (createjs.DomUtils.isAudioTag(loadItem.tag)) {
			this._tag = createjs.DomUtils.isAudioTag(loadItem) ? loadItem : loadItem.src;
		}

		if (this._tag != null) {
			this._preferXHR = false;
		}
	};

	var p = createjs.extend(SoundLoader, createjs.AbstractMediaLoader);
	var s = SoundLoader;

	// static methods
	/**
	 * Determines if the loader can load a specific item. This loader can only load items that are of type
	 * {{#crossLink "Types/SOUND:property"}}{{/crossLink}}.
	 * @method canLoadItem
	 * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
	 * @returns {Boolean} Whether the loader can load the item.
	 * @static
	 */
	s.canLoadItem = function (item) {
		return item.type == createjs.Types.SOUND;
	};

	// protected methods
	p._createTag = function (src) {
		var tag = createjs.Elements.audio();
		tag.autoplay = false;
		tag.preload = "none";

		//LM: Firefox fails when this the preload="none" for other tags, but it needs to be "none" to ensure PreloadJS works.
		tag.src = src;
		return tag;
	};

	createjs.SoundLoader = createjs.promote(SoundLoader, "AbstractMediaLoader");

}());

//##############################################################################
// AudioSprite.js
//##############################################################################

//  NOTE this is "Class" is purely to document audioSprite Setup and usage.


/**
 * <strong>Note: AudioSprite is not a class, but its usage is easily lost in the documentation, so it has been called
 * out here for quick reference.</strong>
 *
 * Audio sprites are much like CSS sprites or image sprite sheets: multiple audio assets grouped into a single file.
 * Audio sprites work around limitations in certain browsers, where only a single sound can be loaded and played at a
 * time. We recommend at least 300ms of silence between audio clips to deal with HTML audio tag inaccuracy, and to prevent
 * accidentally playing bits of the neighbouring clips.
 *
 * <strong>Benefits of Audio Sprites:</strong>
 * <ul>
 *     <li>More robust support for older browsers and devices that only allow a single audio instance, such as iOS 5.</li>
 *     <li>They provide a work around for the Internet Explorer 9 audio tag limit, which restricts how many different
 *     sounds that could be loaded at once.</li>
 *     <li>Faster loading by only requiring a single network request for several sounds, especially on mobile devices
 * where the network round trip for each file can add significant latency.</li>
 * </ul>
 *
 * <strong>Drawbacks of Audio Sprites</strong>
 * <ul>
 *     <li>No guarantee of smooth looping when using HTML or Flash audio. If you have a track that needs to loop
 * 		smoothly and you are supporting non-web audio browsers, do not use audio sprites for that sound if you can avoid
 * 		it.</li>
 *     <li>No guarantee that HTML audio will play back immediately, especially the first time. In some browsers
 *     (Chrome!), HTML audio will only load enough to play through at the current download speed – so we rely on the
 *     `canplaythrough` event to determine if the audio is loaded. Since audio sprites must jump ahead to play specific
 *     sounds, the audio may not yet have downloaded fully.</li>
 *     <li>Audio sprites share the same core source, so if you have a sprite with 5 sounds and are limited to 2
 * 		concurrently playing instances, you can only play 2 of the sounds at the same time.</li>
 * </ul>
 *
 * <h4>Example</h4>
 *
 *		createjs.Sound.initializeDefaultPlugins();
 *		var assetsPath = "./assets/";
 *		var sounds = [{
 *			src:"MyAudioSprite.ogg", data: {
 *				audioSprite: [
 *					{id:"sound1", startTime:0, duration:500},
 *					{id:"sound2", startTime:1000, duration:400},
 *					{id:"sound3", startTime:1700, duration: 1000}
 *				]}
 *			}
 *		];
 *		createjs.Sound.alternateExtensions = ["mp3"];
 *		createjs.Sound.on("fileload", loadSound);
 *		createjs.Sound.registerSounds(sounds, assetsPath);
 *		// after load is complete
 *		createjs.Sound.play("sound2");
 *
 * You can also create audio sprites on the fly by setting the startTime and duration when creating an new AbstractSoundInstance.
 *
 * 		createjs.Sound.play("MyAudioSprite", {startTime: 1000, duration: 400});
 *
 * The excellent CreateJS community has created a tool to create audio sprites, available at
 * <a href="https://github.com/tonistiigi/audiosprite" target="_blank">https://github.com/tonistiigi/audiosprite</a>,
 * as well as a <a href="http://jsfiddle.net/bharat_battu/g8fFP/12/" target="_blank">jsfiddle</a> to convert the output
 * to SoundJS format.
 *
 * @class AudioSprite
 * @since 0.6.0
 */

//##############################################################################
// PlayPropsConfig.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";
	/**
	 * A class to store the optional play properties passed in {{#crossLink "Sound/play"}}{{/crossLink}} and
	 * {{#crossLink "AbstractSoundInstance/play"}}{{/crossLink}} calls.
	 *
	 * Optional Play Properties Include:
	 * <ul>
	 * <li>interrupt - How to interrupt any currently playing instances of audio with the same source,
	 * if the maximum number of instances of the sound are already playing. Values are defined as <code>INTERRUPT_TYPE</code>
	 * constants on the Sound class, with the default defined by {{#crossLink "Sound/defaultInterruptBehavior:property"}}{{/crossLink}}.</li>
	 * <li>delay - The amount of time to delay the start of audio playback, in milliseconds.</li>
	 * <li>offset - The offset from the start of the audio to begin playback, in milliseconds.</li>
	 * <li>loop - How many times the audio loops when it reaches the end of playback. The default is 0 (no
	 * loops), and -1 can be used for infinite playback.</li>
	 * <li>volume - The volume of the sound, between 0 and 1. Note that the master volume is applied
	 * against the individual volume.</li>
	 * <li>pan - The left-right pan of the sound (if supported), between -1 (left) and 1 (right).</li>
	 * <li>startTime - To create an audio sprite (with duration), the initial offset to start playback and loop from, in milliseconds.</li>
	 * <li>duration - To create an audio sprite (with startTime), the amount of time to play the clip for, in milliseconds.</li>
	 * </ul>
	 *
	 * <h4>Example</h4>
	 *
	 * 	var props = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1, volume: 0.5})
	 * 	createjs.Sound.play("mySound", props);
	 * 	// OR
	 * 	mySoundInstance.play(props);
	 *
	 * @class PlayPropsConfig
	 * @constructor
	 * @since 0.6.1
	 */
	// TODO think of a better name for this class
	var PlayPropsConfig = function () {
// Public Properties
		/**
		 * How to interrupt any currently playing instances of audio with the same source,
		 * if the maximum number of instances of the sound are already playing. Values are defined as
		 * <code>INTERRUPT_TYPE</code> constants on the Sound class, with the default defined by
		 * {{#crossLink "Sound/defaultInterruptBehavior:property"}}{{/crossLink}}.
		 * @property interrupt
		 * @type {string}
		 * @default null
		 */
		this.interrupt = null;

		/**
		 * The amount of time to delay the start of audio playback, in milliseconds.
		 * @property delay
		 * @type {Number}
		 * @default null
		 */
		this.delay = null;

		/**
		 * The offset from the start of the audio to begin playback, in milliseconds.
		 * @property offset
		 * @type {number}
		 * @default null
		 */
		this.offset = null;

		/**
		 * How many times the audio loops when it reaches the end of playback. The default is 0 (no
		 * loops), and -1 can be used for infinite playback.
		 * @property loop
		 * @type {number}
		 * @default null
		 */
		this.loop = null;

		/**
		 * The volume of the sound, between 0 and 1. Note that the master volume is applied
		 * against the individual volume.
		 * @property volume
		 * @type {number}
		 * @default null
		 */
		this.volume = null;

		/**
		 * The left-right pan of the sound (if supported), between -1 (left) and 1 (right).
		 * @property pan
		 * @type {number}
		 * @default null
		 */
		this.pan = null;

		/**
		 * Used to create an audio sprite (with duration), the initial offset to start playback and loop from, in milliseconds.
		 * @property startTime
		 * @type {number}
		 * @default null
		 */
		this.startTime = null;

		/**
		 * Used to create an audio sprite (with startTime), the amount of time to play the clip for, in milliseconds.
		 * @property duration
		 * @type {number}
		 * @default null
		 */
		this.duration = null;
	};
	var p = PlayPropsConfig.prototype = {};
	var s = PlayPropsConfig;


// Static Methods
	/**
	 * Creates a PlayPropsConfig from another PlayPropsConfig or an Object.
	 *
	 * @method create
	 * @param {PlayPropsConfig|Object} value The play properties
	 * @returns {PlayPropsConfig}
	 * @static
	 */
	s.create = function (value) {
		if (typeof(value) === "string") {
			// Handle the old API gracefully.
			console && (console.warn || console.log)("Deprecated behaviour. Sound.play takes a configuration object instead of individual arguments. See docs for info.");
			return new createjs.PlayPropsConfig().set({interrupt:value});
		} else if (value == null || value instanceof s || value instanceof Object) {
			return new createjs.PlayPropsConfig().set(value);
		} else if (value == null) {
			throw new Error("PlayProps configuration not recognized.");
		}
	};

// Public Methods
	/**
	 * Provides a chainable shortcut method for setting a number of properties on the instance.
	 *
	 * <h4>Example</h4>
	 *
	 *      var PlayPropsConfig = new createjs.PlayPropsConfig().set({loop:-1, volume:0.7});
	 *
	 * @method set
	 * @param {Object} props A generic object containing properties to copy to the PlayPropsConfig instance.
	 * @return {PlayPropsConfig} Returns the instance the method is called on (useful for chaining calls.)
	*/
	p.set = function(props) {
		if (props != null) {
			for (var n in props) { this[n] = props[n]; }
		}
		return this;
	};

	p.toString = function() {
		return "[PlayPropsConfig]";
	};

	createjs.PlayPropsConfig = s;

}());

//##############################################################################
// Sound.js
//##############################################################################

this.createjs = this.createjs || {};



(function () {
	"use strict";

	/**
	 * The Sound class is the public API for creating sounds, controlling the overall sound levels, and managing plugins.
	 * All Sound APIs on this class are static.
	 *
	 * <b>Registering and Preloading</b><br />
	 * Before you can play a sound, it <b>must</b> be registered. You can do this with {{#crossLink "Sound/registerSound"}}{{/crossLink}},
	 * or register multiple sounds using {{#crossLink "Sound/registerSounds"}}{{/crossLink}}. If you don't register a
	 * sound prior to attempting to play it using {{#crossLink "Sound/play"}}{{/crossLink}} or create it using {{#crossLink "Sound/createInstance"}}{{/crossLink}},
	 * the sound source will be automatically registered but playback will fail as the source will not be ready. If you use
	 * <a href="http://preloadjs.com" target="_blank">PreloadJS</a>, registration is handled for you when the sound is
	 * preloaded. It is recommended to preload sounds either internally using the register functions or externally using
	 * PreloadJS so they are ready when you want to use them.
	 *
	 * <b>Playback</b><br />
	 * To play a sound once it's been registered and preloaded, use the {{#crossLink "Sound/play"}}{{/crossLink}} method.
	 * This method returns a {{#crossLink "AbstractSoundInstance"}}{{/crossLink}} which can be paused, resumed, muted, etc.
	 * Please see the {{#crossLink "AbstractSoundInstance"}}{{/crossLink}} documentation for more on the instance control APIs.
	 *
	 * <b>Plugins</b><br />
	 * By default, the {{#crossLink "WebAudioPlugin"}}{{/crossLink}} or the {{#crossLink "HTMLAudioPlugin"}}{{/crossLink}}
	 * are used (when available), although developers can change plugin priority or add new plugins (such as the
	 * provided {{#crossLink "FlashAudioPlugin"}}{{/crossLink}}). Please see the {{#crossLink "Sound"}}{{/crossLink}} API
	 * methods for more on the playback and plugin APIs. To install plugins, or specify a different plugin order, see
	 * {{#crossLink "Sound/installPlugins"}}{{/crossLink}}.
	 *
	 * <h4>Example</h4>
	 *
	 *      createjs.FlashAudioPlugin.swfPath = "../src/soundjs/flashaudio";
	 *      createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
	 *      createjs.Sound.alternateExtensions = ["mp3"];
	 *      createjs.Sound.on("fileload", this.loadHandler, this);
	 *      createjs.Sound.registerSound("path/to/mySound.ogg", "sound");
	 *      function loadHandler(event) {
     *          // This is fired for each sound that is registered.
     *          var instance = createjs.Sound.play("sound");  // play using id.  Could also use full source path or event.src.
     *          instance.on("complete", this.handleComplete, this);
     *          instance.volume = 0.5;
	 *      }
	 *
	 * The maximum number of concurrently playing instances of the same sound can be specified in the "data" argument
	 * of {{#crossLink "Sound/registerSound"}}{{/crossLink}}.  Note that if not specified, the active plugin will apply
	 * a default limit.  Currently HTMLAudioPlugin sets a default limit of 2, while WebAudioPlugin and FlashAudioPlugin set a
	 * default limit of 100.
	 *
	 *      createjs.Sound.registerSound("sound.mp3", "soundId", 4);
	 *
	 * Sound can be used as a plugin with PreloadJS to help preload audio properly. Audio preloaded with PreloadJS is
	 * automatically registered with the Sound class. When audio is not preloaded, Sound will do an automatic internal
	 * load. As a result, it may fail to play the first time play is called if the audio is not finished loading. Use
	 * the {{#crossLink "Sound/fileload:event"}}{{/crossLink}} event to determine when a sound has finished internally
	 * preloading. It is recommended that all audio is preloaded before it is played.
	 *
	 *      var queue = new createjs.LoadQueue();
	 *		queue.installPlugin(createjs.Sound);
	 *
	 * <b>Audio Sprites</b><br />
	 * SoundJS has added support for {{#crossLink "AudioSprite"}}{{/crossLink}}, available as of version 0.6.0.
	 * For those unfamiliar with audio sprites, they are much like CSS sprites or sprite sheets: multiple audio assets
	 * grouped into a single file.
	 *
	 * <h4>Example</h4>
	 *
	 *		var assetsPath = "./assets/";
	 *		var sounds = [{
	 *			src:"MyAudioSprite.ogg", data: {
	 *				audioSprite: [
	 *					{id:"sound1", startTime:0, duration:500},
	 *					{id:"sound2", startTime:1000, duration:400},
	 *					{id:"sound3", startTime:1700, duration: 1000}
	 *				]}
 	 *			}
	 *		];
	 *		createjs.Sound.alternateExtensions = ["mp3"];
	 *		createjs.Sound.on("fileload", loadSound);
	 *		createjs.Sound.registerSounds(sounds, assetsPath);
	 *		// after load is complete
	 *		createjs.Sound.play("sound2");
	 *
	 * <b>Mobile Playback</b><br />
	 * Devices running iOS require the WebAudio context to be "unlocked" by playing at least one sound inside of a user-
	 * initiated event (such as touch/click). Earlier versions of SoundJS included a "MobileSafe" sample, but this is no
	 * longer necessary as of SoundJS 0.6.2.
	 * <ul>
	 *     <li>
	 *         In SoundJS 0.4.1 and above, you can either initialize plugins or use the {{#crossLink "WebAudioPlugin/playEmptySound"}}{{/crossLink}}
	 *         method in the call stack of a user input event to manually unlock the audio context.
	 *     </li>
	 *     <li>
	 *         In SoundJS 0.6.2 and above, SoundJS will automatically listen for the first document-level "mousedown"
	 *         and "touchend" event, and unlock WebAudio. This will continue to check these events until the WebAudio
	 *         context becomes "unlocked" (changes from "suspended" to "running")
	 *     </li>
	 *     <li>
	 *         Both the "mousedown" and "touchend" events can be used to unlock audio in iOS9+, the "touchstart" event
	 *         will work in iOS8 and below. The "touchend" event will only work in iOS9 when the gesture is interpreted
	 *         as a "click", so if the user long-presses the button, it will no longer work.
	 *     </li>
	 *     <li>
	 *         When using the <a href="http://www.createjs.com/docs/easeljs/classes/Touch.html">EaselJS Touch class</a>,
	 *         the "mousedown" event will not fire when a canvas is clicked, since MouseEvents are prevented, to ensure
	 *         only touch events fire. To get around this, you can either rely on "touchend", or:
	 *         <ol>
	 *             <li>Set the `allowDefault` property on the Touch class constructor to `true` (defaults to `false`).</li>
	 *             <li>Set the `preventSelection` property on the EaselJS `Stage` to `false`.</li>
	 *         </ol>
	 *         These settings may change how your application behaves, and are not recommended.
	 *     </li>
	 * </ul>
	 *
	 * <b>Loading Alternate Paths and Extension-less Files</b><br />
	 * SoundJS supports loading alternate paths and extension-less files by passing an object instead of a string for
	 * the `src` property, which is a hash using the format `{extension:"path", extension2:"path2"}`. These labels are
	 * how SoundJS determines if the browser will support the sound. This also enables multiple formats to live in
	 * different folders, or on CDNs, which often has completely different filenames for each file.
	 *
	 * Priority is determined by the property order (first property is tried first).  This is supported by both internal loading
	 * and loading with PreloadJS.
	 *
	 * <em>Note: an id is required for playback.</em>
	 *
	 * <h4>Example</h4>
	 *
	 *		var sounds = {path:"./audioPath/",
	 * 				manifest: [
	 *				{id: "cool", src: {mp3:"mp3/awesome.mp3", ogg:"noExtensionOggFile"}}
	 *		]};
	 *
	 *		createjs.Sound.alternateExtensions = ["mp3"];
	 *		createjs.Sound.addEventListener("fileload", handleLoad);
	 *		createjs.Sound.registerSounds(sounds);
	 *
	 * <h3>Known Browser and OS issues</h3>
	 * <b>IE 9 HTML Audio limitations</b><br />
	 * <ul><li>There is a delay in applying volume changes to tags that occurs once playback is started. So if you have
	 * muted all sounds, they will all play during this delay until the mute applies internally. This happens regardless of
	 * when or how you apply the volume change, as the tag seems to need to play to apply it.</li>
     * <li>MP3 encoding will not always work for audio tags, particularly in Internet Explorer. We've found default
	 * encoding with 64kbps works.</li>
	 * <li>Occasionally very short samples will get cut off.</li>
	 * <li>There is a limit to how many audio tags you can load and play at once, which appears to be determined by
	 * hardware and browser settings.  See {{#crossLink "HTMLAudioPlugin.MAX_INSTANCES"}}{{/crossLink}} for a safe
	 * estimate.</li></ul>
	 *
	 * <b>Firefox 25 Web Audio limitations</b>
	 * <ul><li>mp3 audio files do not load properly on all windows machines, reported
	 * <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=929969" target="_blank">here</a>. </br>
	 * For this reason it is recommended to pass another FF supported type (ie ogg) first until this bug is resolved, if
	 * possible.</li></ul>

	 * <b>Safari limitations</b><br />
	 * <ul><li>Safari requires Quicktime to be installed for audio playback.</li></ul>
	 *
	 * <b>iOS 6 Web Audio limitations</b><br />
	 * <ul><li>Sound is initially locked, and must be unlocked via a user-initiated event. Please see the section on
	 * Mobile Playback above.</li>
	 * <li>A bug exists that will distort un-cached web audio when a video element is present in the DOM that has audio
	 * at a different sampleRate.</li>
	 * </ul>
	 *
	 * <b>Android HTML Audio limitations</b><br />
	 * <ul><li>We have no control over audio volume. Only the user can set volume on their device.</li>
	 * <li>We can only play audio inside a user event (touch/click).  This currently means you cannot loop sound or use
	 * a delay.</li></ul>
	 *
	 * <b>Web Audio and PreloadJS</b><br />
	 * <ul><li>Web Audio must be loaded through XHR, therefore when used with PreloadJS, tag loading is not possible.
	 * This means that tag loading can not be used to avoid cross domain issues.</li><ul>
	 *
	 * @class Sound
	 * @static
	 * @uses EventDispatcher
	 */
	function Sound() {
		throw "Sound cannot be instantiated";
	}

	var s = Sound;


// Static Properties
	/**
	 * The interrupt value to interrupt any currently playing instance with the same source, if the maximum number of
	 * instances of the sound are already playing.
	 * @property INTERRUPT_ANY
	 * @type {String}
	 * @default any
	 * @static
	 */
	s.INTERRUPT_ANY = "any";

	/**
	 * The interrupt value to interrupt the earliest currently playing instance with the same source that progressed the
	 * least distance in the audio track, if the maximum number of instances of the sound are already playing.
	 * @property INTERRUPT_EARLY
	 * @type {String}
	 * @default early
	 * @static
	 */
	s.INTERRUPT_EARLY = "early";

	/**
	 * The interrupt value to interrupt the currently playing instance with the same source that progressed the most
	 * distance in the audio track, if the maximum number of instances of the sound are already playing.
	 * @property INTERRUPT_LATE
	 * @type {String}
	 * @default late
	 * @static
	 */
	s.INTERRUPT_LATE = "late";

	/**
	 * The interrupt value to not interrupt any currently playing instances with the same source, if the maximum number of
	 * instances of the sound are already playing.
	 * @property INTERRUPT_NONE
	 * @type {String}
	 * @default none
	 * @static
	 */
	s.INTERRUPT_NONE = "none";

	/**
	 * Defines the playState of an instance that is still initializing.
	 * @property PLAY_INITED
	 * @type {String}
	 * @default playInited
	 * @static
	 */
	s.PLAY_INITED = "playInited";

	/**
	 * Defines the playState of an instance that is currently playing or paused.
	 * @property PLAY_SUCCEEDED
	 * @type {String}
	 * @default playSucceeded
	 * @static
	 */
	s.PLAY_SUCCEEDED = "playSucceeded";

	/**
	 * Defines the playState of an instance that was interrupted by another instance.
	 * @property PLAY_INTERRUPTED
	 * @type {String}
	 * @default playInterrupted
	 * @static
	 */
	s.PLAY_INTERRUPTED = "playInterrupted";

	/**
	 * Defines the playState of an instance that completed playback.
	 * @property PLAY_FINISHED
	 * @type {String}
	 * @default playFinished
	 * @static
	 */
	s.PLAY_FINISHED = "playFinished";

	/**
	 * Defines the playState of an instance that failed to play. This is usually caused by a lack of available channels
	 * when the interrupt mode was "INTERRUPT_NONE", the playback stalled, or the sound could not be found.
	 * @property PLAY_FAILED
	 * @type {String}
	 * @default playFailed
	 * @static
	 */
	s.PLAY_FAILED = "playFailed";

	/**
	 * A list of the default supported extensions that Sound will <i>try</i> to play. Plugins will check if the browser
	 * can play these types, so modifying this list before a plugin is initialized will allow the plugins to try to
	 * support additional media types.
	 *
	 * NOTE this does not currently work for {{#crossLink "FlashAudioPlugin"}}{{/crossLink}}.
	 *
	 * More details on file formats can be found at <a href="http://en.wikipedia.org/wiki/Audio_file_format" target="_blank">http://en.wikipedia.org/wiki/Audio_file_format</a>.<br />
	 * A very detailed list of file formats can be found at <a href="http://www.fileinfo.com/filetypes/audio" target="_blank">http://www.fileinfo.com/filetypes/audio</a>.
	 * @property SUPPORTED_EXTENSIONS
	 * @type {Array[String]}
	 * @default ["mp3", "ogg", "opus", "mpeg", "wav", "m4a", "mp4", "aiff", "wma", "mid"]
	 * @since 0.4.0
	 * @static
	 */
	s.SUPPORTED_EXTENSIONS = ["mp3", "ogg", "opus", "mpeg", "wav", "m4a", "mp4", "aiff", "wma", "mid"];

	/**
	 * Some extensions use another type of extension support to play (one of them is a codex).  This allows you to map
	 * that support so plugins can accurately determine if an extension is supported.  Adding to this list can help
	 * plugins determine more accurately if an extension is supported.
	 *
 	 * A useful list of extensions for each format can be found at <a href="http://html5doctor.com/html5-audio-the-state-of-play/" target="_blank">http://html5doctor.com/html5-audio-the-state-of-play/</a>.
	 * @property EXTENSION_MAP
	 * @type {Object}
	 * @since 0.4.0
	 * @default {m4a:"mp4"}
	 * @static
	 */
	s.EXTENSION_MAP = {
		m4a:"mp4"
	};

	/**
	 * The RegExp pattern used to parse file URIs. This supports simple file names, as well as full domain URIs with
	 * query strings. The resulting match is: protocol:$1 domain:$2 path:$3 file:$4 extension:$5 query:$6.
	 * @property FILE_PATTERN
	 * @type {RegExp}
	 * @static
	 * @private
	 */
	s.FILE_PATTERN = /^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?))?([/.]*?(?:[^?]+)?\/)?((?:[^/?]+)\.(\w+))(?:\?(\S+)?)?$/;


// Class Public properties
	/**
	 * Determines the default behavior for interrupting other currently playing instances with the same source, if the
	 * maximum number of instances of the sound are already playing.  Currently the default is {{#crossLink "Sound/INTERRUPT_NONE:property"}}{{/crossLink}}
	 * but this can be set and will change playback behavior accordingly.  This is only used when {{#crossLink "Sound/play"}}{{/crossLink}}
	 * is called without passing a value for interrupt.
	 * @property defaultInterruptBehavior
	 * @type {String}
	 * @default Sound.INTERRUPT_NONE, or "none"
	 * @static
	 * @since 0.4.0
	 */
	s.defaultInterruptBehavior = s.INTERRUPT_NONE;  // OJR does s.INTERRUPT_ANY make more sense as default?  Needs game dev testing to see which case makes more sense.

	/**
	 * An array of extensions to attempt to use when loading sound, if the default is unsupported by the active plugin.
	 * These are applied in order, so if you try to Load Thunder.ogg in a browser that does not support ogg, and your
	 * extensions array is ["mp3", "m4a", "wav"] it will check mp3 support, then m4a, then wav. The audio files need
	 * to exist in the same location, as only the extension is altered.
	 *
	 * Note that regardless of which file is loaded, you can call {{#crossLink "Sound/createInstance"}}{{/crossLink}}
	 * and {{#crossLink "Sound/play"}}{{/crossLink}} using the same id or full source path passed for loading.
	 *
	 * <h4>Example</h4>
	 *
	 *	var sounds = [
	 *		{src:"myPath/mySound.ogg", id:"example"},
	 *	];
	 *	createjs.Sound.alternateExtensions = ["mp3"]; // now if ogg is not supported, SoundJS will try asset0.mp3
	 *	createjs.Sound.on("fileload", handleLoad); // call handleLoad when each sound loads
	 *	createjs.Sound.registerSounds(sounds, assetPath);
	 *	// ...
	 *	createjs.Sound.play("myPath/mySound.ogg"); // works regardless of what extension is supported.  Note calling with ID is a better approach
	 *
	 * @property alternateExtensions
	 * @type {Array}
	 * @since 0.5.2
	 * @static
	 */
	s.alternateExtensions = [];

	/**
	 * The currently active plugin. If this is null, then no plugin could be initialized. If no plugin was specified,
	 * Sound attempts to apply the default plugins: {{#crossLink "WebAudioPlugin"}}{{/crossLink}}, followed by
	 * {{#crossLink "HTMLAudioPlugin"}}{{/crossLink}}.
	 * @property activePlugin
	 * @type {Object}
	 * @static
	 */
    s.activePlugin = null;


// class getter / setter properties

	/**
	 * Set the master volume of Sound. The master volume is multiplied against each sound's individual volume.  For
	 * example, if master volume is 0.5 and a sound's volume is 0.5, the resulting volume is 0.25. To set individual
	 * sound volume, use AbstractSoundInstance {{#crossLink "AbstractSoundInstance/volume:property"}}{{/crossLink}}
	 * instead.
	 *
	 * <h4>Example</h4>
	 *
	 *     createjs.Sound.volume = 0.5;
	 *
	 * @property volume
	 * @type {Number}
	 * @default 1
	 * @since 0.6.1
	 */

	/**
	 * The internal volume level. Use {{#crossLink "Sound/volume:property"}}{{/crossLink}} to adjust the master volume.
	 * @property _masterVolume
	 * @type {number}
	 * @default 1
	 * @private
	 */
	s._masterVolume = 1;

	/**
	 * Use the {{#crossLink "Sound/volume:property"}}{{/crossLink}} property instead.
	 * @method _getMasterVolume
	 * @private
	 * @static
	 * @return {Number}
	 **/
	s._getMasterVolume = function() {
		return this._masterVolume;
	};
	// Sound.getMasterVolume is @deprecated. Remove for 1.1+
	s.getVolume = createjs.deprecate(s._getMasterVolume, "Sound.getVolume");
	/**
	 * Use the {{#crossLink "Sound/volume:property"}}{{/crossLink}} property instead.
	 * @method _setMasterVolume
	 * @static
	 * @private
	 **/
	s._setMasterVolume = function(value) {
		if (Number(value) == null) { return; }
		value = Math.max(0, Math.min(1, value));
		s._masterVolume = value;
		if (!this.activePlugin || !this.activePlugin.setVolume || !this.activePlugin.setVolume(value)) {
			var instances = this._instances;
			for (var i = 0, l = instances.length; i < l; i++) {
				instances[i].setMasterVolume(value);
			}
		}
	};
	// Sound.stMasterVolume is @deprecated. Remove for 1.1+
	s.setVolume = createjs.deprecate(s._setMasterVolume, "Sound.setVolume");

	/**
	 * Mute/Unmute all audio. Note that muted audio still plays at 0 volume. This global mute value is maintained
	 * separately and when set will override, but not change the mute property of individual instances. To mute an individual
	 * instance, use AbstractSoundInstance {{#crossLink "AbstractSoundInstance/muted:property"}}{{/crossLink}} instead.
	 *
	 * <h4>Example</h4>
	 *
	 *     createjs.Sound.muted = true;
	 *
	 *
	 * @property muted
	 * @type {Boolean}
	 * @default false
	 * @since 0.6.1
	 */
	s._masterMute = false;

	/**
	 * Use the {{#crossLink "Sound/muted:property"}}{{/crossLink}} property instead.
	 * @method _getMute
	 * @returns {Boolean}
	 * @static
	 * @private
	 */
	s._getMute = function () {
		return this._masterMute;
	};
	// Sound.getMute is @deprecated. Remove for 1.1+
	s.getMute = createjs.deprecate(s._getMute, "Sound.getMute");

	/**
	 * Use the {{#crossLink "Sound/muted:property"}}{{/crossLink}} property instead.
	 * @method _setMute
	 * @param {Boolean} value The muted value
	 * @static
	 * @private
	 */
	s._setMute = function (value) {
		if (value == null) { return; }
		this._masterMute = value;
		if (!this.activePlugin || !this.activePlugin.setMute || !this.activePlugin.setMute(value)) {
			var instances = this._instances;
			for (var i = 0, l = instances.length; i < l; i++) {
				instances[i].setMasterMute(value);
			}
		}
	};
	// Sound.setMute is @deprecated. Remove for 1.1+
	s.setMute = createjs.deprecate(s._setMute, "Sound.setMute");

	/**
	 * Get the active plugins capabilities, which help determine if a plugin can be used in the current environment,
	 * or if the plugin supports a specific feature. Capabilities include:
	 * <ul>
	 *     <li><b>panning:</b> If the plugin can pan audio from left to right</li>
	 *     <li><b>volume;</b> If the plugin can control audio volume.</li>
	 *     <li><b>tracks:</b> The maximum number of audio tracks that can be played back at a time. This will be -1
	 *     if there is no known limit.</li>
	 * <br />An entry for each file type in {{#crossLink "Sound/SUPPORTED_EXTENSIONS:property"}}{{/crossLink}}:
	 *     <li><b>mp3:</b> If MP3 audio is supported.</li>
	 *     <li><b>ogg:</b> If OGG audio is supported.</li>
	 *     <li><b>wav:</b> If WAV audio is supported.</li>
	 *     <li><b>mpeg:</b> If MPEG audio is supported.</li>
	 *     <li><b>m4a:</b> If M4A audio is supported.</li>
	 *     <li><b>mp4:</b> If MP4 audio is supported.</li>
	 *     <li><b>aiff:</b> If aiff audio is supported.</li>
	 *     <li><b>wma:</b> If wma audio is supported.</li>
	 *     <li><b>mid:</b> If mid audio is supported.</li>
	 * </ul>
	 *
	 * You can get a specific capability of the active plugin using standard object notation
	 *
	 * <h4>Example</h4>
	 *
	 *      var mp3 = createjs.Sound.capabilities.mp3;
	 *
	 * Note this property is read only.
	 *
	 * @property capabilities
	 * @type {Object}
	 * @static
	 * @readOnly
	 * @since 0.6.1
	 */

	/**
	 * Use the {{#crossLink "Sound/capabilities:property"}}{{/crossLink}} property instead.
	 * @returns {null}
	 * @private
	 */
	s._getCapabilities = function() {
		if (s.activePlugin == null) { return null; }
		return s.activePlugin._capabilities;
	};
	// Sound.getCapabilities is @deprecated. Remove for 1.1+
	s.getCapabilities = createjs.deprecate(s._getCapabilities, "Sound.getCapabilities");

	Object.defineProperties(s, {
		volume: { get: s._getMasterVolume, set: s._setMasterVolume },
		muted: { get: s._getMute, set: s._setMute },
		capabilities: { get: s._getCapabilities }
	});


// Class Private properties
	/**
	 * Determines if the plugins have been registered. If false, the first call to {{#crossLink "play"}}{{/crossLink}} will instantiate the default
	 * plugins ({{#crossLink "WebAudioPlugin"}}{{/crossLink}}, followed by {{#crossLink "HTMLAudioPlugin"}}{{/crossLink}}).
	 * If plugins have been registered, but none are applicable, then sound playback will fail.
	 * @property _pluginsRegistered
	 * @type {Boolean}
	 * @default false
	 * @static
	 * @private
	 */
	s._pluginsRegistered = false;

	/**
	 * Used internally to assign unique IDs to each AbstractSoundInstance.
	 * @property _lastID
	 * @type {Number}
	 * @static
	 * @private
	 */
	s._lastID = 0;

	/**
	 * An array containing all currently playing instances. This allows Sound to control the volume, mute, and playback of
	 * all instances when using static APIs like {{#crossLink "Sound/stop"}}{{/crossLink}} and {{#crossLink "Sound/volume:property"}}{{/crossLink}}.
	 * When an instance has finished playback, it gets removed via the {{#crossLink "Sound/finishedPlaying"}}{{/crossLink}}
	 * method. If the user replays an instance, it gets added back in via the {{#crossLink "Sound/_beginPlaying"}}{{/crossLink}}
	 * method.
	 * @property _instances
	 * @type {Array}
	 * @private
	 * @static
	 */
	s._instances = [];

	/**
	 * An object hash storing objects with sound sources, startTime, and duration via there corresponding ID.
	 * @property _idHash
	 * @type {Object}
	 * @private
	 * @static
	 */
	s._idHash = {};

	/**
	 * An object hash that stores preloading sound sources via the parsed source that is passed to the plugin.  Contains the
	 * source, id, and data that was passed in by the user.  Parsed sources can contain multiple instances of source, id,
	 * and data.
	 * @property _preloadHash
	 * @type {Object}
	 * @private
	 * @static
	 */
	s._preloadHash = {};

	/**
	 * An object hash storing {{#crossLink "PlayPropsConfig"}}{{/crossLink}} via the parsed source that is passed as defaultPlayProps in
	 * {{#crossLink "Sound/registerSound"}}{{/crossLink}} and {{#crossLink "Sound/registerSounds"}}{{/crossLink}}.
	 * @property _defaultPlayPropsHash
	 * @type {Object}
	 * @private
	 * @static
	 * @since 0.6.1
	 */
	s._defaultPlayPropsHash = {};


// EventDispatcher methods:
	s.addEventListener = null;
	s.removeEventListener = null;
	s.removeAllEventListeners = null;
	s.dispatchEvent = null;
	s.hasEventListener = null;
	s._listeners = null;

	createjs.EventDispatcher.initialize(s); // inject EventDispatcher methods.


// Events
	/**
	 * This event is fired when a file finishes loading internally. This event is fired for each loaded sound,
	 * so any handler methods should look up the <code>event.src</code> to handle a particular sound.
	 * @event fileload
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @param {String} src The source of the sound that was loaded.
	 * @param {String} [id] The id passed in when the sound was registered. If one was not provided, it will be null.
	 * @param {Number|Object} [data] Any additional data associated with the item. If not provided, it will be undefined.
	 * @since 0.4.1
	 */

	/**
	 * This event is fired when a file fails loading internally. This event is fired for each loaded sound,
	 * so any handler methods should look up the <code>event.src</code> to handle a particular sound.
	 * @event fileerror
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @param {String} src The source of the sound that was loaded.
	 * @param {String} [id] The id passed in when the sound was registered. If one was not provided, it will be null.
	 * @param {Number|Object} [data] Any additional data associated with the item. If not provided, it will be undefined.
	 * @since 0.6.0
	 */


// Class Public Methods
	/**
	 * Get the preload rules to allow Sound to be used as a plugin by <a href="http://preloadjs.com" target="_blank">PreloadJS</a>.
	 * Any load calls that have the matching type or extension will fire the callback method, and use the resulting
	 * object, which is potentially modified by Sound. This helps when determining the correct path, as well as
	 * registering the audio instance(s) with Sound. This method should not be called, except by PreloadJS.
	 * @method getPreloadHandlers
	 * @return {Object} An object containing:
	 * <ul><li>callback: A preload callback that is fired when a file is added to PreloadJS, which provides
	 *      Sound a mechanism to modify the load parameters, select the correct file format, register the sound, etc.</li>
	 *      <li>types: A list of file types that are supported by Sound (currently supports "sound").</li>
	 *      <li>extensions: A list of file extensions that are supported by Sound (see {{#crossLink "Sound/SUPPORTED_EXTENSIONS:property"}}{{/crossLink}}).</li></ul>
	 * @static
	 * @private
	 */
	s.getPreloadHandlers = function () {
		return {
			callback:createjs.proxy(s.initLoad, s),
			types:["sound"],
			extensions:s.SUPPORTED_EXTENSIONS
		};
	};

	/**
	 * Used to dispatch fileload events from internal loading.
	 * @method _handleLoadComplete
	 * @param event A loader event.
	 * @private
	 * @static
	 * @since 0.6.0
	 */
	s._handleLoadComplete = function(event) {
		var src = event.target.getItem().src;
		if (!s._preloadHash[src]) {return;}

		for (var i = 0, l = s._preloadHash[src].length; i < l; i++) {
			var item = s._preloadHash[src][i];
			s._preloadHash[src][i] = true;

			if (!s.hasEventListener("fileload")) { continue; }

			var event = new createjs.Event("fileload");
			event.src = item.src;
			event.id = item.id;
			event.data = item.data;
			event.sprite = item.sprite;

			s.dispatchEvent(event);
		}
	};

	/**
	 * Used to dispatch error events from internal preloading.
	 * @param event
	 * @private
	 * @since 0.6.0
	 * @static
	 */
	s._handleLoadError = function(event) {
		var src = event.target.getItem().src;
		if (!s._preloadHash[src]) {return;}

		for (var i = 0, l = s._preloadHash[src].length; i < l; i++) {
			var item = s._preloadHash[src][i];
			s._preloadHash[src][i] = false;

			if (!s.hasEventListener("fileerror")) { continue; }

			var event = new createjs.Event("fileerror");
			event.src = item.src;
			event.id = item.id;
			event.data = item.data;
			event.sprite = item.sprite;

			s.dispatchEvent(event);
		}
	};

	/**
	 * Used by {{#crossLink "Sound/registerPlugins"}}{{/crossLink}} to register a Sound plugin.
	 *
	 * @method _registerPlugin
	 * @param {Object} plugin The plugin class to install.
	 * @return {Boolean} Whether the plugin was successfully initialized.
	 * @static
	 * @private
	 */
	s._registerPlugin = function (plugin) {
		// Note: Each plugin is passed in as a class reference, but we store the activePlugin as an instance
		if (plugin.isSupported()) {
			s.activePlugin = new plugin();
			return true;
		}
		return false;
	};

	/**
	 * Register a list of Sound plugins, in order of precedence. To register a single plugin, pass a single element in the array.
	 *
	 * <h4>Example</h4>
	 *
	 *      createjs.FlashAudioPlugin.swfPath = "../src/soundjs/flashaudio/";
	 *      createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashAudioPlugin]);
	 *
	 * @method registerPlugins
	 * @param {Array} plugins An array of plugins classes to install.
	 * @return {Boolean} Whether a plugin was successfully initialized.
	 * @static
	 */
	s.registerPlugins = function (plugins) {
		s._pluginsRegistered = true;
		for (var i = 0, l = plugins.length; i < l; i++) {
			if (s._registerPlugin(plugins[i])) {
				return true;
			}
		}
		return false;
	};

	/**
	 * Initialize the default plugins. This method is automatically called when any audio is played or registered before
	 * the user has manually registered plugins, and enables Sound to work without manual plugin setup. Currently, the
	 * default plugins are {{#crossLink "WebAudioPlugin"}}{{/crossLink}} followed by {{#crossLink "HTMLAudioPlugin"}}{{/crossLink}}.
	 *
	 * <h4>Example</h4>
	 *
	 * 	if (!createjs.initializeDefaultPlugins()) { return; }
	 *
	 * @method initializeDefaultPlugins
	 * @returns {Boolean} True if a plugin was initialized, false otherwise.
	 * @since 0.4.0
	 * @static
	 */
	s.initializeDefaultPlugins = function () {
		if (s.activePlugin != null) {return true;}
		if (s._pluginsRegistered) {return false;}
		if (s.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin])) {return true;}
		return false;
	};

	/**
	 * Determines if Sound has been initialized, and a plugin has been activated.
	 *
	 * <h4>Example</h4>
	 * This example sets up a Flash fallback, but only if there is no plugin specified yet.
	 *
	 * 	if (!createjs.Sound.isReady()) {
	 *		createjs.FlashAudioPlugin.swfPath = "../src/soundjs/flashaudio/";
	 * 		createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashAudioPlugin]);
	 *	}
	 *
	 * @method isReady
	 * @return {Boolean} If Sound has initialized a plugin.
	 * @static
	 */
	s.isReady = function () {
		return (s.activePlugin != null);
	};

	/**
	 * Process manifest items from <a href="http://preloadjs.com" target="_blank">PreloadJS</a>. This method is intended
	 * for usage by a plugin, and not for direct interaction.
	 * @method initLoad
	 * @param {Object} src The object to load.
	 * @return {Object|AbstractLoader} An instance of AbstractLoader.
	 * @private
	 * @static
	 */
	s.initLoad = function (loadItem) {
		if (loadItem.type == "video") { return true; } // Don't handle video. PreloadJS's plugin model is really aggressive.
		return s._registerSound(loadItem);
	};

	/**
	 * Internal method for loading sounds.  This should not be called directly.
	 *
	 * @method _registerSound
	 * @param {Object} src The object to load, containing src property and optionally containing id and data.
	 * @return {Object} An object with the modified values that were passed in, which defines the sound.
	 * Returns false if the source cannot be parsed or no plugins can be initialized.
	 * Returns true if the source is already loaded.
	 * @static
	 * @private
	 * @since 0.6.0
	 */

	s._registerSound = function (loadItem) {
		if (!s.initializeDefaultPlugins()) {return false;}

		var details;
		if (loadItem.src instanceof Object) {
			details = s._parseSrc(loadItem.src);
			details.src = loadItem.path + details.src;
		} else {
			details = s._parsePath(loadItem.src);
		}
		if (details == null) {return false;}
		loadItem.src = details.src;
		loadItem.type = "sound";

		var data = loadItem.data;
		var numChannels = null;
		if (data != null) {
			if (!isNaN(data.channels)) {
				numChannels = parseInt(data.channels);
			} else if (!isNaN(data)) {
				numChannels = parseInt(data);
			}

			if(data.audioSprite) {
				var sp;
				for(var i = data.audioSprite.length; i--; ) {
					sp = data.audioSprite[i];
					s._idHash[sp.id] = {src: loadItem.src, startTime: parseInt(sp.startTime), duration: parseInt(sp.duration)};

					if (sp.defaultPlayProps) {
						s._defaultPlayPropsHash[sp.id] = createjs.PlayPropsConfig.create(sp.defaultPlayProps);
					}
				}
			}
		}
		if (loadItem.id != null) {s._idHash[loadItem.id] = {src: loadItem.src}};
		var loader = s.activePlugin.register(loadItem);

		SoundChannel.create(loadItem.src, numChannels);

		// return the number of instances to the user.  This will also be returned in the load event.
		if (data == null || !isNaN(data)) {
			loadItem.data = numChannels || SoundChannel.maxPerChannel();
		} else {
			loadItem.data.channels = numChannels || SoundChannel.maxPerChannel();
		}

		if (loader.type) {loadItem.type = loader.type;}

		if (loadItem.defaultPlayProps) {
			s._defaultPlayPropsHash[loadItem.src] = createjs.PlayPropsConfig.create(loadItem.defaultPlayProps);
		}
		return loader;
	};

	/**
	 * Register an audio file for loading and future playback in Sound. This is automatically called when using
	 * <a href="http://preloadjs.com" target="_blank">PreloadJS</a>.  It is recommended to register all sounds that
	 * need to be played back in order to properly prepare and preload them. Sound does internal preloading when required.
	 *
	 * <h4>Example</h4>
	 *
	 *      createjs.Sound.alternateExtensions = ["mp3"];
	 *      createjs.Sound.on("fileload", handleLoad); // add an event listener for when load is completed
	 *      createjs.Sound.registerSound("myAudioPath/mySound.ogg", "myID", 3);
	 *      createjs.Sound.registerSound({ogg:"path1/mySound.ogg", mp3:"path2/mySoundNoExtension"}, "myID", 3);
	 *
	 *
	 * @method registerSound
	 * @param {String | Object} src The source or an Object with a "src" property or an Object with multiple extension labeled src properties.
	 * @param {String} [id] An id specified by the user to play the sound later.  Note id is required for when src is multiple extension labeled src properties.
	 * @param {Number | Object} [data] Data associated with the item. Sound uses the data parameter as the number of
	 * channels for an audio instance, however a "channels" property can be appended to the data object if it is used
	 * for other information. The audio channels will set a default based on plugin if no value is found.
	 * Sound also uses the data property to hold an {{#crossLink "AudioSprite"}}{{/crossLink}} array of objects in the following format {id, startTime, duration}.<br/>
	 *   id used to play the sound later, in the same manner as a sound src with an id.<br/>
	 *   startTime is the initial offset to start playback and loop from, in milliseconds.<br/>
	 *   duration is the amount of time to play the clip for, in milliseconds.<br/>
	 * This allows Sound to support audio sprites that are played back by id.
	 * @param {string} basePath Set a path that will be prepended to src for loading.
	 * @param {Object | PlayPropsConfig} defaultPlayProps Optional Playback properties that will be set as the defaults on any new AbstractSoundInstance.
	 * See {{#crossLink "PlayPropsConfig"}}{{/crossLink}} for options.
	 * @return {Object} An object with the modified values that were passed in, which defines the sound.
	 * Returns false if the source cannot be parsed or no plugins can be initialized.
	 * Returns true if the source is already loaded.
	 * @static
	 * @since 0.4.0
	 */
	s.registerSound = function (src, id, data, basePath, defaultPlayProps) {
		var loadItem = {src: src, id: id, data:data, defaultPlayProps:defaultPlayProps};
		if (src instanceof Object && src.src) {
			basePath = id;
			loadItem = src;
		}
		loadItem = createjs.LoadItem.create(loadItem);
		loadItem.path = basePath;

		if (basePath != null && !(loadItem.src instanceof Object)) {loadItem.src = basePath + loadItem.src;}

		var loader = s._registerSound(loadItem);
		if(!loader) {return false;}

		if (!s._preloadHash[loadItem.src]) { s._preloadHash[loadItem.src] = [];}
		s._preloadHash[loadItem.src].push(loadItem);
		if (s._preloadHash[loadItem.src].length == 1) {
			// OJR note this will disallow reloading a sound if loading fails or the source changes
			loader.on("complete", this._handleLoadComplete, this);
			loader.on("error", this._handleLoadError, this);
			s.activePlugin.preload(loader);
		} else {
			if (s._preloadHash[loadItem.src][0] == true) {return true;}
		}

		return loadItem;
	};

	/**
	 * Register an array of audio files for loading and future playback in Sound. It is recommended to register all
	 * sounds that need to be played back in order to properly prepare and preload them. Sound does internal preloading
	 * when required.
	 *
	 * <h4>Example</h4>
	 *
	 * 		var assetPath = "./myAudioPath/";
	 *      var sounds = [
	 *          {src:"asset0.ogg", id:"example"},
	 *          {src:"asset1.ogg", id:"1", data:6},
	 *          {src:"asset2.mp3", id:"works"}
	 *          {src:{mp3:"path1/asset3.mp3", ogg:"path2/asset3NoExtension"}, id:"better"}
	 *      ];
	 *      createjs.Sound.alternateExtensions = ["mp3"];	// if the passed extension is not supported, try this extension
	 *      createjs.Sound.on("fileload", handleLoad); // call handleLoad when each sound loads
	 *      createjs.Sound.registerSounds(sounds, assetPath);
	 *
	 * @method registerSounds
	 * @param {Array} sounds An array of objects to load. Objects are expected to be in the format needed for
	 * {{#crossLink "Sound/registerSound"}}{{/crossLink}}: <code>{src:srcURI, id:ID, data:Data}</code>
	 * with "id" and "data" being optional.
	 * You can also pass an object with path and manifest properties, where path is a basePath and manifest is an array of objects to load.
	 * Note id is required if src is an object with extension labeled src properties.
	 * @param {string} basePath Set a path that will be prepended to each src when loading.  When creating, playing, or removing
	 * audio that was loaded with a basePath by src, the basePath must be included.
	 * @return {Object} An array of objects with the modified values that were passed in, which defines each sound.
	 * Like registerSound, it will return false for any values when the source cannot be parsed or if no plugins can be initialized.
	 * Also, it will return true for any values when the source is already loaded.
	 * @static
	 * @since 0.6.0
	 */
	s.registerSounds = function (sounds, basePath) {
		var returnValues = [];
		if (sounds.path) {
			if (!basePath) {
				basePath = sounds.path;
			} else {
				basePath = basePath + sounds.path;
			}
			sounds = sounds.manifest;
			// TODO document this feature
		}
		for (var i = 0, l = sounds.length; i < l; i++) {
			returnValues[i] = createjs.Sound.registerSound(sounds[i].src, sounds[i].id, sounds[i].data, basePath, sounds[i].defaultPlayProps);
		}
		return returnValues;
	};

	/**
	 * Remove a sound that has been registered with {{#crossLink "Sound/registerSound"}}{{/crossLink}} or
	 * {{#crossLink "Sound/registerSounds"}}{{/crossLink}}.
	 * <br />Note this will stop playback on active instances playing this sound before deleting them.
	 * <br />Note if you passed in a basePath, you need to pass it or prepend it to the src here.
	 *
	 * <h4>Example</h4>
	 *
	 *      createjs.Sound.removeSound("myID");
	 *      createjs.Sound.removeSound("myAudioBasePath/mySound.ogg");
	 *      createjs.Sound.removeSound("myPath/myOtherSound.mp3", "myBasePath/");
	 *      createjs.Sound.removeSound({mp3:"musicNoExtension", ogg:"music.ogg"}, "myBasePath/");
	 *
	 * @method removeSound
	 * @param {String | Object} src The src or ID of the audio, or an Object with a "src" property, or an Object with multiple extension labeled src properties.
	 * @param {string} basePath Set a path that will be prepended to each src when removing.
	 * @return {Boolean} True if sound is successfully removed.
	 * @static
	 * @since 0.4.1
	 */
	s.removeSound = function(src, basePath) {
		if (s.activePlugin == null) {return false;}

		if (src instanceof Object && src.src) {src = src.src;}

		var details;
		if (src instanceof Object) {
			details = s._parseSrc(src);
		} else {
			src = s._getSrcById(src).src;
			details = s._parsePath(src);
		}
		if (details == null) {return false;}
		src = details.src;
		if (basePath != null) {src = basePath + src;}

		for(var prop in s._idHash){
			if(s._idHash[prop].src == src) {
				delete(s._idHash[prop]);
			}
		}

		// clear from SoundChannel, which also stops and deletes all instances
		SoundChannel.removeSrc(src);

		delete(s._preloadHash[src]);

		s.activePlugin.removeSound(src);

		return true;
	};

	/**
	 * Remove an array of audio files that have been registered with {{#crossLink "Sound/registerSound"}}{{/crossLink}} or
	 * {{#crossLink "Sound/registerSounds"}}{{/crossLink}}.
	 * <br />Note this will stop playback on active instances playing this audio before deleting them.
	 * <br />Note if you passed in a basePath, you need to pass it or prepend it to the src here.
	 *
	 * <h4>Example</h4>
	 *
	 * 		assetPath = "./myPath/";
	 *      var sounds = [
	 *          {src:"asset0.ogg", id:"example"},
	 *          {src:"asset1.ogg", id:"1", data:6},
	 *          {src:"asset2.mp3", id:"works"}
	 *      ];
	 *      createjs.Sound.removeSounds(sounds, assetPath);
	 *
	 * @method removeSounds
	 * @param {Array} sounds An array of objects to remove. Objects are expected to be in the format needed for
	 * {{#crossLink "Sound/removeSound"}}{{/crossLink}}: <code>{srcOrID:srcURIorID}</code>.
	 * You can also pass an object with path and manifest properties, where path is a basePath and manifest is an array of objects to remove.
	 * @param {string} basePath Set a path that will be prepended to each src when removing.
	 * @return {Object} An array of Boolean values representing if the sounds with the same array index were
	 * successfully removed.
	 * @static
	 * @since 0.4.1
	 */
	s.removeSounds = function (sounds, basePath) {
		var returnValues = [];
		if (sounds.path) {
			if (!basePath) {
				basePath = sounds.path;
			} else {
				basePath = basePath + sounds.path;
			}
			sounds = sounds.manifest;
		}
		for (var i = 0, l = sounds.length; i < l; i++) {
			returnValues[i] = createjs.Sound.removeSound(sounds[i].src, basePath);
		}
		return returnValues;
	};

	/**
	 * Remove all sounds that have been registered with {{#crossLink "Sound/registerSound"}}{{/crossLink}} or
	 * {{#crossLink "Sound/registerSounds"}}{{/crossLink}}.
	 * <br />Note this will stop playback on all active sound instances before deleting them.
	 *
	 * <h4>Example</h4>
	 *
	 *     createjs.Sound.removeAllSounds();
	 *
	 * @method removeAllSounds
	 * @static
	 * @since 0.4.1
	 */
	s.removeAllSounds = function() {
		s._idHash = {};
		s._preloadHash = {};
		SoundChannel.removeAll();
		if (s.activePlugin) {s.activePlugin.removeAllSounds();}
	};

	/**
	 * Check if a source has been loaded by internal preloaders. This is necessary to ensure that sounds that are
	 * not completed preloading will not kick off a new internal preload if they are played.
	 *
	 * <h4>Example</h4>
	 *
	 *     var mySound = "assetPath/asset0.ogg";
	 *     if(createjs.Sound.loadComplete(mySound) {
	 *         createjs.Sound.play(mySound);
	 *     }
	 *
	 * @method loadComplete
	 * @param {String} src The src or id that is being loaded.
	 * @return {Boolean} If the src is already loaded.
	 * @since 0.4.0
	 * @static
	 */
	s.loadComplete = function (src) {
		if (!s.isReady()) { return false; }
		var details = s._parsePath(src);
		if (details) {
			src = s._getSrcById(details.src).src;
		} else {
			src = s._getSrcById(src).src;
		}
		if(s._preloadHash[src] == undefined) {return false;}
		return (s._preloadHash[src][0] == true);  // src only loads once, so if it's true for the first it's true for all
	};

	/**
	 * Parse the path of a sound. Alternate extensions will be attempted in order if the
	 * current extension is not supported
	 * @method _parsePath
	 * @param {String} value The path to an audio source.
	 * @return {Object} A formatted object that can be registered with the {{#crossLink "Sound/activePlugin:property"}}{{/crossLink}}
	 * and returned to a preloader like <a href="http://preloadjs.com" target="_blank">PreloadJS</a>.
	 * @private
	 * @static
	 */
	s._parsePath = function (value) {
		if (typeof(value) != "string") {value = value.toString();}

		var match = value.match(s.FILE_PATTERN);
		if (match == null) {return false;}

		var name = match[4];
		var ext = match[5];
		var c = s.capabilities;
		var i = 0;
		while (!c[ext]) {
			ext = s.alternateExtensions[i++];
			if (i > s.alternateExtensions.length) { return null;}	// no extensions are supported
		}
		value = value.replace("."+match[5], "."+ext);

		var ret = {name:name, src:value, extension:ext};
		return ret;
	};

	/**
	 * Parse the path of a sound based on properties of src matching with supported extensions.
	 * Returns false if none of the properties are supported
	 * @method _parseSrc
	 * @param {Object} value The paths to an audio source, indexed by extension type.
	 * @return {Object} A formatted object that can be registered with the {{#crossLink "Sound/activePlugin:property"}}{{/crossLink}}
	 * and returned to a preloader like <a href="http://preloadjs.com" target="_blank">PreloadJS</a>.
	 * @private
	 * @static
	 */
	s._parseSrc = function (value) {
		var ret = {name:undefined, src:undefined, extension:undefined};
		var c = s.capabilities;

		for (var prop in value) {
		  if(value.hasOwnProperty(prop) && c[prop]) {
				ret.src = value[prop];
				ret.extension = prop;
				break;
		  }
		}
		if (!ret.src) {return false;}	// no matches

		var i = ret.src.lastIndexOf("/");
		if (i != -1) {
			ret.name = ret.src.slice(i+1);
		} else {
			ret.name = ret.src;
		}

		return ret;
	};

	/* ---------------
	 Static API.
	 --------------- */
	/**
	 * Play a sound and get a {{#crossLink "AbstractSoundInstance"}}{{/crossLink}} to control. If the sound fails to
	 * play, an AbstractSoundInstance will still be returned, and have a playState of {{#crossLink "Sound/PLAY_FAILED:property"}}{{/crossLink}}.
	 * Note that even on sounds with failed playback, you may still be able to call the {{#crossLink "AbstractSoundInstance/play"}}{{/crossLink}},
	 * method, since the failure could be due to lack of available channels. If the src does not have a supported
	 * extension or if there is no available plugin, a default AbstractSoundInstance will still be returned, which will
	 * not play any audio, but will not generate errors.
	 *
	 * <h4>Example</h4>
	 *
	 *      createjs.Sound.on("fileload", handleLoad);
	 *      createjs.Sound.registerSound("myAudioPath/mySound.mp3", "myID", 3);
	 *      function handleLoad(event) {
	 *      	createjs.Sound.play("myID");
	 *      	// store off AbstractSoundInstance for controlling
	 *      	var myInstance = createjs.Sound.play("myID", {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1});
	 *      }
	 *
	 * NOTE: To create an audio sprite that has not already been registered, both startTime and duration need to be set.
	 * This is only when creating a new audio sprite, not when playing using the id of an already registered audio sprite.
	 *
	 * @method play
	 * @param {String} src The src or ID of the audio.
	 * @param {Object | PlayPropsConfig} props A PlayPropsConfig instance, or an object that contains the parameters to
	 * play a sound. See the {{#crossLink "PlayPropsConfig"}}{{/crossLink}} for more info.
	 * @return {AbstractSoundInstance} A {{#crossLink "AbstractSoundInstance"}}{{/crossLink}} that can be controlled
	 * after it is created.
	 * @static
	 */
	s.play = function (src, props) {
		var playProps = createjs.PlayPropsConfig.create(props);
		var instance = s.createInstance(src, playProps.startTime, playProps.duration);
		var ok = s._playInstance(instance, playProps);
		if (!ok) {instance._playFailed();}
		return instance;
	};

	/**
	 * Creates a {{#crossLink "AbstractSoundInstance"}}{{/crossLink}} using the passed in src. If the src does not have a
	 * supported extension or if there is no available plugin, a default AbstractSoundInstance will be returned that can be
	 * called safely but does nothing.
	 *
	 * <h4>Example</h4>
	 *
	 *      var myInstance = null;
	 *      createjs.Sound.on("fileload", handleLoad);
	 *      createjs.Sound.registerSound("myAudioPath/mySound.mp3", "myID", 3);
	 *      function handleLoad(event) {
	 *      	myInstance = createjs.Sound.createInstance("myID");
	 *      	// alternately we could call the following
	 *      	myInstance = createjs.Sound.createInstance("myAudioPath/mySound.mp3");
	 *      }
	 *
	 * NOTE to create an audio sprite that has not already been registered, both startTime and duration need to be set.
	 * This is only when creating a new audio sprite, not when playing using the id of an already registered audio sprite.
	 *
	 * @method createInstance
	 * @param {String} src The src or ID of the audio.
	 * @param {Number} [startTime=null] To create an audio sprite (with duration), the initial offset to start playback and loop from, in milliseconds.
	 * @param {Number} [duration=null] To create an audio sprite (with startTime), the amount of time to play the clip for, in milliseconds.
	 * @return {AbstractSoundInstance} A {{#crossLink "AbstractSoundInstance"}}{{/crossLink}} that can be controlled after it is created.
	 * Unsupported extensions will return the default AbstractSoundInstance.
	 * @since 0.4.0
	 * @static
	 */
	s.createInstance = function (src, startTime, duration) {
		if (!s.initializeDefaultPlugins()) { return new createjs.DefaultSoundInstance(src, startTime, duration); }

		var defaultPlayProps = s._defaultPlayPropsHash[src];	// for audio sprites, which create and store defaults by id
		src = s._getSrcById(src);

		var details = s._parsePath(src.src);

		var instance = null;
		if (details != null && details.src != null) {
			SoundChannel.create(details.src);
			if (startTime == null) { startTime = src.startTime; }
			instance = s.activePlugin.create(details.src, startTime, duration || src.duration);

			defaultPlayProps = defaultPlayProps || s._defaultPlayPropsHash[details.src];
			if (defaultPlayProps) {
				instance.applyPlayProps(defaultPlayProps);
			}
		} else {
			instance = new createjs.DefaultSoundInstance(src, startTime, duration);
		}

		instance.uniqueId = s._lastID++;

		return instance;
	};

	/**
	 * Stop all audio (global stop). Stopped audio is reset, and not paused. To play audio that has been stopped,
	 * call AbstractSoundInstance {{#crossLink "AbstractSoundInstance/play"}}{{/crossLink}}.
	 *
	 * <h4>Example</h4>
	 *
	 *     createjs.Sound.stop();
	 *
	 * @method stop
	 * @static
	 */
	s.stop = function () {
		var instances = this._instances;
		for (var i = instances.length; i--; ) {
			instances[i].stop();  // NOTE stop removes instance from this._instances
		}
	};

	/**
	 * Set the default playback properties for all new SoundInstances of the passed in src or ID.
	 * See {{#crossLink "PlayPropsConfig"}}{{/crossLink}} for available properties.
	 *
	 * @method setDefaultPlayProps
	 * @param {String} src The src or ID used to register the audio.
	 * @param {Object | PlayPropsConfig} playProps The playback properties you would like to set.
	 * @since 0.6.1
	 */
	s.setDefaultPlayProps = function(src, playProps) {
		src = s._getSrcById(src);
		s._defaultPlayPropsHash[s._parsePath(src.src).src] = createjs.PlayPropsConfig.create(playProps);
	};

	/**
	 * Get the default playback properties for the passed in src or ID.  These properties are applied to all
	 * new SoundInstances.  Returns null if default does not exist.
	 *
	 * @method getDefaultPlayProps
	 * @param {String} src The src or ID used to register the audio.
	 * @returns {PlayPropsConfig} returns an existing PlayPropsConfig or null if one does not exist
	 * @since 0.6.1
	 */
	s.getDefaultPlayProps = function(src) {
		src = s._getSrcById(src);
		return s._defaultPlayPropsHash[s._parsePath(src.src).src];
	};


	/* ---------------
	 Internal methods
	 --------------- */
	/**
	 * Play an instance. This is called by the static API, as well as from plugins. This allows the core class to
	 * control delays.
	 * @method _playInstance
	 * @param {AbstractSoundInstance} instance The {{#crossLink "AbstractSoundInstance"}}{{/crossLink}} to start playing.
	 * @param {PlayPropsConfig} playProps A PlayPropsConfig object.
	 * @return {Boolean} If the sound can start playing. Sounds that fail immediately will return false. Sounds that
	 * have a delay will return true, but may still fail to play.
	 * @private
	 * @static
	 */
	s._playInstance = function (instance, playProps) {
		var defaultPlayProps = s._defaultPlayPropsHash[instance.src] || {};
		if (playProps.interrupt == null) {playProps.interrupt = defaultPlayProps.interrupt || s.defaultInterruptBehavior};
		if (playProps.delay == null) {playProps.delay = defaultPlayProps.delay || 0;}
		if (playProps.offset == null) {playProps.offset = instance.position;}
		if (playProps.loop == null) {playProps.loop = instance.loop;}
		if (playProps.volume == null) {playProps.volume = instance.volume;}
		if (playProps.pan == null) {playProps.pan = instance.pan;}

		if (playProps.delay == 0) {
			var ok = s._beginPlaying(instance, playProps);
			if (!ok) {return false;}
		} else {
			//Note that we can't pass arguments to proxy OR setTimeout (IE only), so just wrap the function call.
			// OJR WebAudio may want to handle this differently, so it might make sense to move this functionality into the plugins in the future
			var delayTimeoutId = setTimeout(function () {
				s._beginPlaying(instance, playProps);
			}, playProps.delay);
			instance.delayTimeoutId = delayTimeoutId;
		}

		this._instances.push(instance);

		return true;
	};

	/**
	 * Begin playback. This is called immediately or after delay by {{#crossLink "Sound/playInstance"}}{{/crossLink}}.
	 * @method _beginPlaying
	 * @param {AbstractSoundInstance} instance A {{#crossLink "AbstractSoundInstance"}}{{/crossLink}} to begin playback.
	 * @param {PlayPropsConfig} playProps A PlayPropsConfig object.
	 * @return {Boolean} If the sound can start playing. If there are no available channels, or the instance fails to
	 * start, this will return false.
	 * @private
	 * @static
	 */
	s._beginPlaying = function (instance, playProps) {
		if (!SoundChannel.add(instance, playProps.interrupt)) {
			return false;
		}
		var result = instance._beginPlaying(playProps);
		if (!result) {
			var index = createjs.indexOf(this._instances, instance);
			if (index > -1) {this._instances.splice(index, 1);}
			return false;
		}
		return true;
	};

	/**
	 * Get the source of a sound via the ID passed in with a register call. If no ID is found the value is returned
	 * instead.
	 * @method _getSrcById
	 * @param {String} value The ID the sound was registered with.
	 * @return {String} The source of the sound if it has been registered with this ID or the value that was passed in.
	 * @private
	 * @static
	 */
	s._getSrcById = function (value) {
		return s._idHash[value] || {src: value};
	};

	/**
	 * A sound has completed playback, been interrupted, failed, or been stopped. This method removes the instance from
	 * Sound management. It will be added again, if the sound re-plays. Note that this method is called from the
	 * instances themselves.
	 * @method _playFinished
	 * @param {AbstractSoundInstance} instance The instance that finished playback.
	 * @private
	 * @static
	 */
	s._playFinished = function (instance) {
		SoundChannel.remove(instance);
		var index = createjs.indexOf(this._instances, instance);
		if (index > -1) {this._instances.splice(index, 1);}	// OJR this will always be > -1, there is no way for an instance to exist without being added to this._instances
	};

	createjs.Sound = Sound;

	/**
	 * An internal class that manages the number of active {{#crossLink "AbstractSoundInstance"}}{{/crossLink}} instances for
	 * each sound type. This method is only used internally by the {{#crossLink "Sound"}}{{/crossLink}} class.
	 *
	 * The number of sounds is artificially limited by Sound in order to prevent over-saturation of a
	 * single sound, as well as to stay within hardware limitations, although the latter may disappear with better
	 * browser support.
	 *
	 * When a sound is played, this class ensures that there is an available instance, or interrupts an appropriate
	 * sound that is already playing.
	 * #class SoundChannel
	 * @param {String} src The source of the instances
	 * @param {Number} [max=1] The number of instances allowed
	 * @constructor
	 * @protected
	 */
	function SoundChannel(src, max) {
		this.init(src, max);
	}

	/* ------------
	 Static API
	 ------------ */
	/**
	 * A hash of channel instances indexed by source.
	 * #property channels
	 * @type {Object}
	 * @static
	 */
	SoundChannel.channels = {};

	/**
	 * Create a sound channel. Note that if the sound channel already exists, this will fail.
	 * #method create
	 * @param {String} src The source for the channel
	 * @param {Number} max The maximum amount this channel holds. The default is {{#crossLink "SoundChannel.maxDefault"}}{{/crossLink}}.
	 * @return {Boolean} If the channels were created.
	 * @static
	 */
	SoundChannel.create = function (src, max) {
		var channel = SoundChannel.get(src);
		if (channel == null) {
			SoundChannel.channels[src] = new SoundChannel(src, max);
			return true;
		}
		return false;
	};
	/**
	 * Delete a sound channel, stop and delete all related instances. Note that if the sound channel does not exist, this will fail.
	 * #method remove
	 * @param {String} src The source for the channel
	 * @return {Boolean} If the channels were deleted.
	 * @static
	 */
	SoundChannel.removeSrc = function (src) {
		var channel = SoundChannel.get(src);
		if (channel == null) {return false;}
		channel._removeAll();	// this stops and removes all active instances
		delete(SoundChannel.channels[src]);
		return true;
	};
	/**
	 * Delete all sound channels, stop and delete all related instances.
	 * #method removeAll
	 * @static
	 */
	SoundChannel.removeAll = function () {
		for(var channel in SoundChannel.channels) {
			SoundChannel.channels[channel]._removeAll();	// this stops and removes all active instances
		}
		SoundChannel.channels = {};
	};
	/**
	 * Add an instance to a sound channel.
	 * #method add
	 * @param {AbstractSoundInstance} instance The instance to add to the channel
	 * @param {String} interrupt The interrupt value to use. Please see the {{#crossLink "Sound/play"}}{{/crossLink}}
	 * for details on interrupt modes.
	 * @return {Boolean} The success of the method call. If the channel is full, it will return false.
	 * @static
	 */
	SoundChannel.add = function (instance, interrupt) {
		var channel = SoundChannel.get(instance.src);
		if (channel == null) {return false;}
		return channel._add(instance, interrupt);
	};
	/**
	 * Remove an instance from the channel.
	 * #method remove
	 * @param {AbstractSoundInstance} instance The instance to remove from the channel
	 * @return The success of the method call. If there is no channel, it will return false.
	 * @static
	 */
	SoundChannel.remove = function (instance) {
		var channel = SoundChannel.get(instance.src);
		if (channel == null) {return false;}
		channel._remove(instance);
		return true;
	};
	/**
	 * Get the maximum number of sounds you can have in a channel.
	 * #method maxPerChannel
	 * @return {Number} The maximum number of sounds you can have in a channel.
	 */
	SoundChannel.maxPerChannel = function () {
		return p.maxDefault;
	};
	/**
	 * Get a channel instance by its src.
	 * #method get
	 * @param {String} src The src to use to look up the channel
	 * @static
	 */
	SoundChannel.get = function (src) {
		return SoundChannel.channels[src];
	};

	var p = SoundChannel.prototype;
	p.constructor = SoundChannel;

	/**
	 * The source of the channel.
	 * #property src
	 * @type {String}
	 */
	p.src = null;

	/**
	 * The maximum number of instances in this channel.  -1 indicates no limit
	 * #property max
	 * @type {Number}
	 */
	p.max = null;

	/**
	 * The default value to set for max, if it isn't passed in.  Also used if -1 is passed.
	 * #property maxDefault
	 * @type {Number}
	 * @default 100
	 * @since 0.4.0
	 */
	p.maxDefault = 100;

	/**
	 * The current number of active instances.
	 * #property length
	 * @type {Number}
	 */
	p.length = 0;

	/**
	 * Initialize the channel.
	 * #method init
	 * @param {String} src The source of the channel
	 * @param {Number} max The maximum number of instances in the channel
	 * @protected
	 */
	p.init = function (src, max) {
		this.src = src;
		this.max = max || this.maxDefault;
		if (this.max == -1) {this.max = this.maxDefault;}
		this._instances = [];
	};

	/**
	 * Get an instance by index.
	 * #method get
	 * @param {Number} index The index to return.
	 * @return {AbstractSoundInstance} The AbstractSoundInstance at a specific instance.
	 */
	p._get = function (index) {
		return this._instances[index];
	};

	/**
	 * Add a new instance to the channel.
	 * #method add
	 * @param {AbstractSoundInstance} instance The instance to add.
	 * @return {Boolean} The success of the method call. If the channel is full, it will return false.
	 */
	p._add = function (instance, interrupt) {
		if (!this._getSlot(interrupt, instance)) {return false;}
		this._instances.push(instance);
		this.length++;
		return true;
	};

	/**
	 * Remove an instance from the channel, either when it has finished playing, or it has been interrupted.
	 * #method remove
	 * @param {AbstractSoundInstance} instance The instance to remove
	 * @return {Boolean} The success of the remove call. If the instance is not found in this channel, it will
	 * return false.
	 */
	p._remove = function (instance) {
		var index = createjs.indexOf(this._instances, instance);
		if (index == -1) {return false;}
		this._instances.splice(index, 1);
		this.length--;
		return true;
	};

	/**
	 * Stop playback and remove all instances from the channel.  Usually in response to a delete call.
	 * #method removeAll
	 */
	p._removeAll = function () {
		// Note that stop() removes the item from the list
		for (var i=this.length-1; i>=0; i--) {
			this._instances[i].stop();
		}
	};

	/**
	 * Get an available slot depending on interrupt value and if slots are available.
	 * #method getSlot
	 * @param {String} interrupt The interrupt value to use.
	 * @param {AbstractSoundInstance} instance The sound instance that will go in the channel if successful.
	 * @return {Boolean} Determines if there is an available slot. Depending on the interrupt mode, if there are no slots,
	 * an existing AbstractSoundInstance may be interrupted. If there are no slots, this method returns false.
	 */
	p._getSlot = function (interrupt, instance) {
		var target, replacement;

		if (interrupt != Sound.INTERRUPT_NONE) {
			// First replacement candidate
			replacement = this._get(0);
			if (replacement == null) {
				return true;
			}
		}

		for (var i = 0, l = this.max; i < l; i++) {
			target = this._get(i);

			// Available Space
			if (target == null) {
				return true;
			}

			// Audio is complete or not playing
			if (target.playState == Sound.PLAY_FINISHED ||
				target.playState == Sound.PLAY_INTERRUPTED ||
				target.playState == Sound.PLAY_FAILED) {
				replacement = target;
				break;
			}

			if (interrupt == Sound.INTERRUPT_NONE) {
				continue;
			}

			// Audio is a better candidate than the current target, according to playhead
			if ((interrupt == Sound.INTERRUPT_EARLY && target.position < replacement.position) ||
				(interrupt == Sound.INTERRUPT_LATE && target.position > replacement.position)) {
					replacement = target;
			}
		}

		if (replacement != null) {
			replacement._interrupt();
			this._remove(replacement);
			return true;
		}
		return false;
	};

	p.toString = function () {
		return "[Sound SoundChannel]";
	};
	// do not add SoundChannel to namespace

}());

//##############################################################################
// AbstractSoundInstance.js
//##############################################################################

this.createjs = this.createjs || {};

/**
 * A AbstractSoundInstance is created when any calls to the Sound API method {{#crossLink "Sound/play"}}{{/crossLink}} or
 * {{#crossLink "Sound/createInstance"}}{{/crossLink}} are made. The AbstractSoundInstance is returned by the active plugin
 * for control by the user.
 *
 * <h4>Example</h4>
 *
 *      var myInstance = createjs.Sound.play("myAssetPath/mySrcFile.mp3");
 *
 * A number of additional parameters provide a quick way to determine how a sound is played. Please see the Sound
 * API method {{#crossLink "Sound/play"}}{{/crossLink}} for a list of arguments.
 *
 * Once a AbstractSoundInstance is created, a reference can be stored that can be used to control the audio directly through
 * the AbstractSoundInstance. If the reference is not stored, the AbstractSoundInstance will play out its audio (and any loops), and
 * is then de-referenced from the {{#crossLink "Sound"}}{{/crossLink}} class so that it can be cleaned up. If audio
 * playback has completed, a simple call to the {{#crossLink "AbstractSoundInstance/play"}}{{/crossLink}} instance method
 * will rebuild the references the Sound class need to control it.
 *
 *      var myInstance = createjs.Sound.play("myAssetPath/mySrcFile.mp3", {loop:2});
 *      myInstance.on("loop", handleLoop);
 *      function handleLoop(event) {
 *          myInstance.volume = myInstance.volume * 0.5;
 *      }
 *
 * Events are dispatched from the instance to notify when the sound has completed, looped, or when playback fails
 *
 *      var myInstance = createjs.Sound.play("myAssetPath/mySrcFile.mp3");
 *      myInstance.on("complete", handleComplete);
 *      myInstance.on("loop", handleLoop);
 *      myInstance.on("failed", handleFailed);
 *
 *
 * @class AbstractSoundInstance
 * @param {String} src The path to and file name of the sound.
 * @param {Number} startTime Audio sprite property used to apply an offset, in milliseconds.
 * @param {Number} duration Audio sprite property used to set the time the clip plays for, in milliseconds.
 * @param {Object} playbackResource Any resource needed by plugin to support audio playback.
 * @extends EventDispatcher
 * @constructor
 */

(function () {
	"use strict";


// Constructor:
	var AbstractSoundInstance = function (src, startTime, duration, playbackResource) {
		this.EventDispatcher_constructor();


	// public properties:
		/**
		 * The source of the sound.
		 * @property src
		 * @type {String}
		 * @default null
		 */
		this.src = src;

		/**
		 * The unique ID of the instance. This is set by {{#crossLink "Sound"}}{{/crossLink}}.
		 * @property uniqueId
		 * @type {String} | Number
		 * @default -1
		 */
		this.uniqueId = -1;

		/**
		 * The play state of the sound. Play states are defined as constants on {{#crossLink "Sound"}}{{/crossLink}}.
		 * @property playState
		 * @type {String}
		 * @default null
		 */
		this.playState = null;

		/**
		 * A Timeout created by {{#crossLink "Sound"}}{{/crossLink}} when this AbstractSoundInstance is played with a delay.
		 * This allows AbstractSoundInstance to remove the delay if stop, pause, or cleanup are called before playback begins.
		 * @property delayTimeoutId
		 * @type {timeoutVariable}
		 * @default null
		 * @protected
		 * @since 0.4.0
		 */
		this.delayTimeoutId = null;
		// TODO consider moving delay into AbstractSoundInstance so it can be handled by plugins


	// private properties
	// Getter / Setter Properties
		// OJR TODO find original reason that we didn't use defined functions.  I think it was performance related
		/**
		 * The volume of the sound, between 0 and 1.
		 *
		 * The actual output volume of a sound can be calculated using:
		 * <code>myInstance.volume * createjs.Sound._getVolume();</code>
		 *
		 * @property volume
		 * @type {Number}
		 * @default 1
		 */
		this._volume =  1;
		Object.defineProperty(this, "volume", {
			get: this._getVolume,
			set: this._setVolume
		});
		this.getVolume = createjs.deprecate(this._getVolume, "AbstractSoundInstance.getVolume");
		this.setVolume = createjs.deprecate(this._setVolume, "AbstractSoundInstance.setVolume");

		/**
		 * The pan of the sound, between -1 (left) and 1 (right). Note that pan is not supported by HTML Audio.
		 *
		 * Note in WebAudioPlugin this only gives us the "x" value of what is actually 3D audio
		 * @property pan
		 * @type {Number}
		 * @default 0
		 */
		this._pan =  0;
		Object.defineProperty(this, "pan", {
			get: this._getPan,
			set: this._setPan
		});
		this.getPan = createjs.deprecate(this._getPan, "AbstractSoundInstance.getPan");
		this.setPan = createjs.deprecate(this._setPan, "AbstractSoundInstance.setPan");

		/**
		 * Audio sprite property used to determine the starting offset.
		 * @property startTime
		 * @type {Number}
		 * @default 0
		 * @since 0.6.1
		 */
		this._startTime = Math.max(0, startTime || 0);
		Object.defineProperty(this, "startTime", {
			get: this._getStartTime,
			set: this._setStartTime
		});
		this.getStartTime = createjs.deprecate(this._getStartTime, "AbstractSoundInstance.getStartTime");
		this.setStartTime = createjs.deprecate(this._setStartTime, "AbstractSoundInstance.setStartTime");

		/**
		 * Sets or gets the length of the audio clip, value is in milliseconds.
		 *
		 * @property duration
		 * @type {Number}
		 * @default 0
		 * @since 0.6.0
		 */
		this._duration = Math.max(0, duration || 0);
		Object.defineProperty(this, "duration", {
			get: this._getDuration,
			set: this._setDuration
		});
		this.getDuration = createjs.deprecate(this._getDuration, "AbstractSoundInstance.getDuration");
		this.setDuration = createjs.deprecate(this._setDuration, "AbstractSoundInstance.setDuration");

		/**
		 * Object that holds plugin specific resource need for audio playback.
		 * This is set internally by the plugin.  For example, WebAudioPlugin will set an array buffer,
		 * HTMLAudioPlugin will set a tag, FlashAudioPlugin will set a flash reference.
		 *
		 * @property playbackResource
		 * @type {Object}
		 * @default null
		 */
		this._playbackResource = null;
		Object.defineProperty(this, "playbackResource", {
			get: this._getPlaybackResource,
			set: this._setPlaybackResource
		});
		if(playbackResource !== false && playbackResource !== true) { this._setPlaybackResource(playbackResource); }
		this.getPlaybackResource = createjs.deprecate(this._getPlaybackResource, "AbstractSoundInstance.getPlaybackResource");
		this.setPlaybackResource = createjs.deprecate(this._setPlaybackResource, "AbstractSoundInstance.setPlaybackResource");

		/**
		 * The position of the playhead in milliseconds. This can be set while a sound is playing, paused, or stopped.
		 *
		 * @property position
		 * @type {Number}
		 * @default 0
		 * @since 0.6.0
		 */
		this._position = 0;
		Object.defineProperty(this, "position", {
			get: this._getPosition,
			set: this._setPosition
		});
		this.getPosition = createjs.deprecate(this._getPosition, "AbstractSoundInstance.getPosition");
		this.setPosition = createjs.deprecate(this._setPosition, "AbstractSoundInstance.setPosition");

		/**
		 * The number of play loops remaining. Negative values will loop infinitely.
		 *
		 * @property loop
		 * @type {Number}
		 * @default 0
		 * @public
		 * @since 0.6.0
		 */
		this._loop = 0;
		Object.defineProperty(this, "loop", {
			get: this._getLoop,
			set: this._setLoop
		});
		this.getLoop = createjs.deprecate(this._getLoop, "AbstractSoundInstance.getLoop");
		this.setLoop = createjs.deprecate(this._setLoop, "AbstractSoundInstance.setLoop");

		/**
		 * Mutes or unmutes the current audio instance.
		 *
		 * @property muted
		 * @type {Boolean}
		 * @default false
		 * @since 0.6.0
		 */
		this._muted = false;
		Object.defineProperty(this, "muted", {
			get: this._getMuted,
			set: this._setMuted
		});
		this.getMuted = createjs.deprecate(this._getMuted, "AbstractSoundInstance.getMuted");
		this.setMuted = createjs.deprecate(this._setMuted, "AbstractSoundInstance.setMuted");

		/**
		 * Pauses or resumes the current audio instance.
		 *
		 * @property paused
		 * @type {Boolean}
		 */
		this._paused = false;
		Object.defineProperty(this, "paused", {
			get: this._getPaused,
			set: this._setPaused
		});
		this.getPaused = createjs.deprecate(this._getPaused, "AbstractSoundInstance.getPaused");
		this.setPaused = createjs.deprecate(this._setPaused, "AbstractSoundInstance.setPaused");


	// Events
		/**
		 * The event that is fired when playback has started successfully.
		 * @event succeeded
		 * @param {Object} target The object that dispatched the event.
		 * @param {String} type The event type.
		 * @since 0.4.0
		 */

		/**
		 * The event that is fired when playback is interrupted. This happens when another sound with the same
		 * src property is played using an interrupt value that causes this instance to stop playing.
		 * @event interrupted
		 * @param {Object} target The object that dispatched the event.
		 * @param {String} type The event type.
		 * @since 0.4.0
		 */

		/**
		 * The event that is fired when playback has failed. This happens when there are too many channels with the same
		 * src property already playing (and the interrupt value doesn't cause an interrupt of another instance), or
		 * the sound could not be played, perhaps due to a 404 error.
		 * @event failed
		 * @param {Object} target The object that dispatched the event.
		 * @param {String} type The event type.
		 * @since 0.4.0
		 */

		/**
		 * The event that is fired when a sound has completed playing but has loops remaining.
		 * @event loop
		 * @param {Object} target The object that dispatched the event.
		 * @param {String} type The event type.
		 * @since 0.4.0
		 */

		/**
		 * The event that is fired when playback completes. This means that the sound has finished playing in its
		 * entirety, including its loop iterations.
		 * @event complete
		 * @param {Object} target The object that dispatched the event.
		 * @param {String} type The event type.
		 * @since 0.4.0
		 */
	};

	var p = createjs.extend(AbstractSoundInstance, createjs.EventDispatcher);

// Public Methods:
	/**
	 * Play an instance. This method is intended to be called on SoundInstances that already exist (created
	 * with the Sound API {{#crossLink "Sound/createInstance"}}{{/crossLink}} or {{#crossLink "Sound/play"}}{{/crossLink}}).
	 *
	 * <h4>Example</h4>
	 *
	 *      var myInstance = createjs.Sound.createInstance(mySrc);
	 *      myInstance.play({interrupt:createjs.Sound.INTERRUPT_ANY, loop:2, pan:0.5});
	 *
	 * Note that if this sound is already playing, this call will still set the passed in parameters.

	 * <b>Parameters Deprecated</b><br />
	 * The parameters for this method are deprecated in favor of a single parameter that is an Object or {{#crossLink "PlayPropsConfig"}}{{/crossLink}}.
	 *
	 * @method play
	 * @param {Object | PlayPropsConfig} props A PlayPropsConfig instance, or an object that contains the parameters to
	 * play a sound. See the {{#crossLink "PlayPropsConfig"}}{{/crossLink}} for more info.
	 * @return {AbstractSoundInstance} A reference to itself, intended for chaining calls.
	 */
	p.play = function (props) {
		var playProps = createjs.PlayPropsConfig.create(props);
		if (this.playState == createjs.Sound.PLAY_SUCCEEDED) {
			this.applyPlayProps(playProps);
			if (this._paused) {	this._setPaused(false); }
			return;
		}
		this._cleanUp();
		createjs.Sound._playInstance(this, playProps);	// make this an event dispatch??
		return this;
	};

	/**
	 * Stop playback of the instance. Stopped sounds will reset their position to 0, and calls to {{#crossLink "AbstractSoundInstance/resume"}}{{/crossLink}}
	 * will fail. To start playback again, call {{#crossLink "AbstractSoundInstance/play"}}{{/crossLink}}.
     *
     * If you don't want to lose your position use yourSoundInstance.paused = true instead. {{#crossLink "AbstractSoundInstance/paused"}}{{/crossLink}}.
	 *
	 * <h4>Example</h4>
	 *
	 *     myInstance.stop();
	 *
	 * @method stop
	 * @return {AbstractSoundInstance} A reference to itself, intended for chaining calls.
	 */
	p.stop = function () {
		this._position = 0;
		this._paused = false;
		this._handleStop();
		this._cleanUp();
		this.playState = createjs.Sound.PLAY_FINISHED;
		return this;
	};

	/**
	 * Remove all external references and resources from AbstractSoundInstance.  Note this is irreversible and AbstractSoundInstance will no longer work
	 * @method destroy
	 * @since 0.6.0
	 */
	p.destroy = function() {
		this._cleanUp();
		this.src = null;
		this.playbackResource = null;

		this.removeAllEventListeners();
	};

	/**
	 * Takes an PlayPropsConfig or Object with the same properties and sets them on this instance.
	 * @method applyPlayProps
	 * @param {PlayPropsConfig | Object} playProps A PlayPropsConfig or object containing the same properties.
	 * @since 0.6.1
	 * @return {AbstractSoundInstance} A reference to itself, intended for chaining calls.
	 */
	p.applyPlayProps = function(playProps) {
		if (playProps.offset != null) { this._setPosition(playProps.offset) }
		if (playProps.loop != null) { this._setLoop(playProps.loop); }
		if (playProps.volume != null) { this._setVolume(playProps.volume); }
		if (playProps.pan != null) { this._setPan(playProps.pan); }
		if (playProps.startTime != null) {
			this._setStartTime(playProps.startTime);
			this._setDuration(playProps.duration);
		}
		return this;
	};

	p.toString = function () {
		return "[AbstractSoundInstance]";
	};

// get/set methods that allow support for IE8
	/**
	 * Please use {{#crossLink "AbstractSoundInstance/paused:property"}}{{/crossLink}} directly as a property.
	 * @method _getPaused
	 * @protected
	 * @return {boolean} If the instance is currently paused
	 * @since 0.6.0
	 */
	p._getPaused = function() {
		return this._paused;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/paused:property"}}{{/crossLink}} directly as a property
	 * @method _setPaused
	 * @protected
	 * @param {boolean} value
	 * @since 0.6.0
	 * @return {AbstractSoundInstance} A reference to itself, intended for chaining calls.
	 */
	p._setPaused = function (value) {
		if ((value !== true && value !== false) || this._paused == value) {return;}
		if (value == true && this.playState != createjs.Sound.PLAY_SUCCEEDED) {return;}
		this._paused = value;
		if(value) {
			this._pause();
		} else {
			this._resume();
		}
		clearTimeout(this.delayTimeoutId);
		return this;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/volume:property"}}{{/crossLink}} directly as a property
	 * @method _setVolume
	 * @protected
	 * @param {Number} value The volume to set, between 0 and 1.
	 * @return {AbstractSoundInstance} A reference to itself, intended for chaining calls.
	 */
	p._setVolume = function (value) {
		if (value == this._volume) { return this; }
		this._volume = Math.max(0, Math.min(1, value));
		if (!this._muted) {
			this._updateVolume();
		}
		return this;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/volume:property"}}{{/crossLink}} directly as a property
	 * @method _getVolume
	 * @protected
	 * @return {Number} The current volume of the sound instance.
	 */
	p._getVolume = function () {
		return this._volume;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/muted:property"}}{{/crossLink}} directly as a property
	 * @method _setMuted
	 * @protected
	 * @param {Boolean} value If the sound should be muted.
	 * @return {AbstractSoundInstance} A reference to itself, intended for chaining calls.
	 * @since 0.6.0
	 */
	p._setMuted = function (value) {
		if (value !== true && value !== false) {return;}
		this._muted = value;
		this._updateVolume();
		return this;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/muted:property"}}{{/crossLink}} directly as a property
	 * @method _getMuted
	 * @protected
	 * @return {Boolean} If the sound is muted.
	 * @since 0.6.0
	 */
	p._getMuted = function () {
		return this._muted;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/pan:property"}}{{/crossLink}} directly as a property
	 * @method _setPan
	 * @protected
	 * @param {Number} value The pan value, between -1 (left) and 1 (right).
	 * @return {AbstractSoundInstance} Returns reference to itself for chaining calls
	 */
	p._setPan = function (value) {
		if(value == this._pan) { return this; }
		this._pan = Math.max(-1, Math.min(1, value));
		this._updatePan();
		return this;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/pan:property"}}{{/crossLink}} directly as a property
	 * @method _getPan
	 * @protected
	 * @return {Number} The value of the pan, between -1 (left) and 1 (right).
	 */
	p._getPan = function () {
		return this._pan;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/position:property"}}{{/crossLink}} directly as a property
	 * @method _getPosition
	 * @protected
	 * @return {Number} The position of the playhead in the sound, in milliseconds.
	 */
	p._getPosition = function () {
		if (!this._paused && this.playState == createjs.Sound.PLAY_SUCCEEDED) {
			this._position = this._calculateCurrentPosition();
		}
		return this._position;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/position:property"}}{{/crossLink}} directly as a property
	 * @method _setPosition
	 * @protected
	 * @param {Number} value The position to place the playhead, in milliseconds.
	 * @return {AbstractSoundInstance} Returns reference to itself for chaining calls
	 */
	p._setPosition = function (value) {
		this._position = Math.max(0, value);
		if (this.playState == createjs.Sound.PLAY_SUCCEEDED) {
			this._updatePosition();
		}
		return this;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/startTime:property"}}{{/crossLink}} directly as a property
	 * @method _getStartTime
	 * @protected
	 * @return {Number} The startTime of the sound instance in milliseconds.
	 */
	p._getStartTime = function () {
		return this._startTime;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/startTime:property"}}{{/crossLink}} directly as a property
	 * @method _setStartTime
	 * @protected
	 * @param {number} value The new startTime time in milli seconds.
	 * @return {AbstractSoundInstance} Returns reference to itself for chaining calls
	 */
	p._setStartTime = function (value) {
		if (value == this._startTime) { return this; }
		this._startTime = Math.max(0, value || 0);
		this._updateStartTime();
		return this;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/duration:property"}}{{/crossLink}} directly as a property
	 * @method _getDuration
	 * @protected
	 * @return {Number} The duration of the sound instance in milliseconds.
	 */
	p._getDuration = function () {
		return this._duration;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/duration:property"}}{{/crossLink}} directly as a property
	 * @method _setDuration
	 * @protected
	 * @param {number} value The new duration time in milli seconds.
	 * @return {AbstractSoundInstance} Returns reference to itself for chaining calls
	 * @since 0.6.0
	 */
	p._setDuration = function (value) {
		if (value == this._duration) { return this; }
		this._duration = Math.max(0, value || 0);
		this._updateDuration();
		return this;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/playbackResource:property"}}{{/crossLink}} directly as a property
	 * @method _setPlaybackResource
	 * @protected
	 * @param {Object} value The new playback resource.
	 * @return {AbstractSoundInstance} Returns reference to itself for chaining calls
	 * @since 0.6.0
	 **/
	p._setPlaybackResource = function (value) {
		this._playbackResource = value;
		if (this._duration == 0 && this._playbackResource) { this._setDurationFromSource(); }
		return this;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/playbackResource:property"}}{{/crossLink}} directly as a property
	 * @method _getPlaybackResource
	 * @protected
	 * @param {Object} value The new playback resource.
	 * @return {Object} playback resource used for playing audio
	 * @since 0.6.0
	 **/
	p._getPlaybackResource = function () {
		return this._playbackResource;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/loop:property"}}{{/crossLink}} directly as a property
	 * @method _getLoop
	 * @protected
	 * @return {number}
	 * @since 0.6.0
	 **/
	p._getLoop = function () {
		return this._loop;
	};

	/**
	 * Please use {{#crossLink "AbstractSoundInstance/loop:property"}}{{/crossLink}} directly as a property
	 * @method _setLoop
	 * @protected
	 * @param {number} value The number of times to loop after play.
	 * @since 0.6.0
	 */
	p._setLoop = function (value) {
		if(this._playbackResource != null) {
			// remove looping
			if (this._loop != 0 && value == 0) {
				this._removeLooping(value);
			}
			// add looping
			else if (this._loop == 0 && value != 0) {
				this._addLooping(value);
			}
		}
		this._loop = value;
	};


// Private Methods:
	/**
	 * A helper method that dispatches all events for AbstractSoundInstance.
	 * @method _sendEvent
	 * @param {String} type The event type
	 * @protected
	 */
	p._sendEvent = function (type) {
		var event = new createjs.Event(type);
		this.dispatchEvent(event);
	};

	/**
	 * Clean up the instance. Remove references and clean up any additional properties such as timers.
	 * @method _cleanUp
	 * @protected
	 */
	p._cleanUp = function () {
		clearTimeout(this.delayTimeoutId); // clear timeout that plays delayed sound
		this._handleCleanUp();
		this._paused = false;

		createjs.Sound._playFinished(this);	// TODO change to an event
	};

	/**
	 * The sound has been interrupted.
	 * @method _interrupt
	 * @protected
	 */
	p._interrupt = function () {
		this._cleanUp();
		this.playState = createjs.Sound.PLAY_INTERRUPTED;
		this._sendEvent("interrupted");
	};

	/**
	 * Called by the Sound class when the audio is ready to play (delay has completed). Starts sound playing if the
	 * src is loaded, otherwise playback will fail.
	 * @method _beginPlaying
	 * @param {PlayPropsConfig} playProps A PlayPropsConfig object.
	 * @return {Boolean} If playback succeeded.
	 * @protected
	 */
	// OJR FlashAudioSoundInstance overwrites
	p._beginPlaying = function (playProps) {
		this._setPosition(playProps.offset);
		this._setLoop(playProps.loop);
		this._setVolume(playProps.volume);
		this._setPan(playProps.pan);
		if (playProps.startTime != null) {
			this._setStartTime(playProps.startTime);
			this._setDuration(playProps.duration);
		}

		if (this._playbackResource != null && this._position < this._duration) {
			this._paused = false;
			this._handleSoundReady();
			this.playState = createjs.Sound.PLAY_SUCCEEDED;
			this._sendEvent("succeeded");
			return true;
		} else {
			this._playFailed();
			return false;
		}
	};

	/**
	 * Play has failed, which can happen for a variety of reasons.
	 * Cleans up instance and dispatches failed event
	 * @method _playFailed
	 * @private
	 */
	p._playFailed = function () {
		this._cleanUp();
		this.playState = createjs.Sound.PLAY_FAILED;
		this._sendEvent("failed");
	};

	/**
	 * Audio has finished playing. Manually loop it if required.
	 * @method _handleSoundComplete
	 * @param event
	 * @protected
	 */
	p._handleSoundComplete = function (event) {
		this._position = 0;  // have to set this as it can be set by pause during playback

		if (this._loop != 0) {
			this._loop--;  // NOTE this introduces a theoretical limit on loops = float max size x 2 - 1
			this._handleLoop();
			this._sendEvent("loop");
			return;
		}

		this._cleanUp();
		this.playState = createjs.Sound.PLAY_FINISHED;
		this._sendEvent("complete");
	};

// Plugin specific code
	/**
	 * Handles starting playback when the sound is ready for playing.
	 * @method _handleSoundReady
	 * @protected
 	 */
	p._handleSoundReady = function () {
		// plugin specific code
	};

	/**
	 * Internal function used to update the volume based on the instance volume, master volume, instance mute value,
	 * and master mute value.
	 * @method _updateVolume
	 * @protected
	 */
	p._updateVolume = function () {
		// plugin specific code
	};

	/**
	 * Internal function used to update the pan
	 * @method _updatePan
	 * @protected
	 * @since 0.6.0
	 */
	p._updatePan = function () {
		// plugin specific code
	};

	/**
	 * Internal function used to update the startTime of the audio.
	 * @method _updateStartTime
	 * @protected
	 * @since 0.6.1
	 */
	p._updateStartTime = function () {
		// plugin specific code
	};

	/**
	 * Internal function used to update the duration of the audio.
	 * @method _updateDuration
	 * @protected
	 * @since 0.6.0
	 */
	p._updateDuration = function () {
		// plugin specific code
	};

	/**
	 * Internal function used to get the duration of the audio from the source we'll be playing.
	 * @method _updateDuration
	 * @protected
	 * @since 0.6.0
	 */
	p._setDurationFromSource = function () {
		// plugin specific code
	};

	/**
	 * Internal function that calculates the current position of the playhead and sets this._position to that value
	 * @method _calculateCurrentPosition
	 * @protected
	 * @since 0.6.0
	 */
	p._calculateCurrentPosition = function () {
		// plugin specific code that sets this.position
	};

	/**
	 * Internal function used to update the position of the playhead.
	 * @method _updatePosition
	 * @protected
	 * @since 0.6.0
	 */
	p._updatePosition = function () {
		// plugin specific code
	};

	/**
	 * Internal function called when looping is removed during playback.
	 * @method _removeLooping
	 * @param {number} value The number of times to loop after play.
	 * @protected
	 * @since 0.6.0
	 */
	p._removeLooping = function (value) {
		// plugin specific code
	};

	/**
	 * Internal function called when looping is added during playback.
	 * @method _addLooping
	 * @param {number} value The number of times to loop after play.
	 * @protected
	 * @since 0.6.0
	 */
	p._addLooping = function (value) {
		// plugin specific code
	};

	/**
	 * Internal function called when pausing playback
	 * @method _pause
	 * @protected
	 * @since 0.6.0
	 */
	p._pause = function () {
		// plugin specific code
	};

	/**
	 * Internal function called when resuming playback
	 * @method _resume
	 * @protected
	 * @since 0.6.0
	 */
	p._resume = function () {
		// plugin specific code
	};

	/**
	 * Internal function called when stopping playback
	 * @method _handleStop
	 * @protected
	 * @since 0.6.0
	 */
	p._handleStop = function() {
		// plugin specific code
	};

	/**
	 * Internal function called when AbstractSoundInstance is being cleaned up
	 * @method _handleCleanUp
	 * @protected
	 * @since 0.6.0
	 */
	p._handleCleanUp = function() {
		// plugin specific code
	};

	/**
	 * Internal function called when AbstractSoundInstance has played to end and is looping
	 * @method _handleLoop
	 * @protected
	 * @since 0.6.0
	 */
	p._handleLoop = function () {
		// plugin specific code
	};

	createjs.AbstractSoundInstance = createjs.promote(AbstractSoundInstance, "EventDispatcher");
	createjs.DefaultSoundInstance = createjs.AbstractSoundInstance;	// used when no plugin is supported
}());

//##############################################################################
// AbstractPlugin.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";


// constructor:
 	/**
	 * A default plugin class used as a base for all other plugins.
	 * @class AbstractPlugin
	 * @constructor
	 * @since 0.6.0
	 */

	var AbstractPlugin = function () {
	// private properties:
		/**
		 * The capabilities of the plugin.
		 * method and is used internally.
		 * @property _capabilities
		 * @type {Object}
		 * @default null
		 * @protected
		 * @static
		 */
		this._capabilities = null;

		/**
		 * Object hash indexed by the source URI of all created loaders, used to properly destroy them if sources are removed.
		 * @type {Object}
		 * @protected
		 */
		this._loaders = {};

		/**
		 * Object hash indexed by the source URI of each file to indicate if an audio source has begun loading,
		 * is currently loading, or has completed loading.  Can be used to store non boolean data after loading
		 * is complete (for example arrayBuffers for web audio).
		 * @property _audioSources
		 * @type {Object}
		 * @protected
		 */
		this._audioSources = {};

		/**
		 * Object hash indexed by the source URI of all created SoundInstances, updates the playbackResource if it loads after they are created,
		 * and properly destroy them if sources are removed
		 * @type {Object}
		 * @protected
		 */
		this._soundInstances = {};

		/**
		 * The internal master volume value of the plugin.
		 * @property _volume
		 * @type {Number}
		 * @default 1
		 * @protected
		 */
		this._volume = 1;

		/**
		 * A reference to a loader class used by a plugin that must be set.
		 * @type {Object}
		 * @protected
		 */
		this._loaderClass;

		/**
		 * A reference to an AbstractSoundInstance class used by a plugin that must be set.
		 * @type {Object}
		 * @protected;
		 */
		this._soundInstanceClass;
	};
	var p = AbstractPlugin.prototype;

// Static Properties:
// NOTE THESE PROPERTIES NEED TO BE ADDED TO EACH PLUGIN
	/**
	 * The capabilities of the plugin. This is generated via the _generateCapabilities method and is used internally.
	 * @property _capabilities
	 * @type {Object}
	 * @default null
	 * @private
	 * @static
	 */
	AbstractPlugin._capabilities = null;

	/**
	 * Determine if the plugin can be used in the current browser/OS.
	 * @method isSupported
	 * @return {Boolean} If the plugin can be initialized.
	 * @static
	 */
	AbstractPlugin.isSupported = function () {
		return true;
	};


// public methods:
	/**
	 * Pre-register a sound for preloading and setup. This is called by {{#crossLink "Sound"}}{{/crossLink}}.
	 * Note all plugins provide a <code>Loader</code> instance, which <a href="http://preloadjs.com" target="_blank">PreloadJS</a>
	 * can use to assist with preloading.
	 * @method register
	 * @param {String} loadItem An Object containing the source of the audio
	 * Note that not every plugin will manage this value.
	 * @return {Object} A result object, containing a "tag" for preloading purposes.
	 */
	p.register = function (loadItem) {
		var loader = this._loaders[loadItem.src];
		if(loader && !loader.canceled) {return this._loaders[loadItem.src];}	// already loading/loaded this, so don't load twice
		// OJR potential issue that we won't be firing loaded event, might need to trigger if this is already loaded?
		this._audioSources[loadItem.src] = true;
		this._soundInstances[loadItem.src] = [];
		loader = new this._loaderClass(loadItem);
		loader.on("complete", this._handlePreloadComplete, this);
		this._loaders[loadItem.src] = loader;
		return loader;
	};

	// note sound calls register before calling preload
	/**
	 * Internally preload a sound.
	 * @method preload
	 * @param {Loader} loader The sound URI to load.
	 */
	p.preload = function (loader) {
		loader.on("error", this._handlePreloadError, this);
		loader.load();
	};

	/**
	 * Checks if preloading has started for a specific source. If the source is found, we can assume it is loading,
	 * or has already finished loading.
	 * @method isPreloadStarted
	 * @param {String} src The sound URI to check.
	 * @return {Boolean}
	 */
	p.isPreloadStarted = function (src) {
		return (this._audioSources[src] != null);
	};

	/**
	 * Checks if preloading has finished for a specific source.
	 * @method isPreloadComplete
	 * @param {String} src The sound URI to load.
	 * @return {Boolean}
	 */
	p.isPreloadComplete = function (src) {
		return (!(this._audioSources[src] == null || this._audioSources[src] == true));
	};

	/**
	 * Remove a sound added using {{#crossLink "WebAudioPlugin/register"}}{{/crossLink}}. Note this does not cancel a preload.
	 * @method removeSound
	 * @param {String} src The sound URI to unload.
	 */
	p.removeSound = function (src) {
		if (!this._soundInstances[src]) { return; }
		for (var i = this._soundInstances[src].length; i--; ) {
			var item = this._soundInstances[src][i];
			item.destroy();
		}
		delete(this._soundInstances[src]);
		delete(this._audioSources[src]);
		if(this._loaders[src]) { this._loaders[src].destroy(); }
		delete(this._loaders[src]);
	};

	/**
	 * Remove all sounds added using {{#crossLink "WebAudioPlugin/register"}}{{/crossLink}}. Note this does not cancel a preload.
	 * @method removeAllSounds
	 * @param {String} src The sound URI to unload.
	 */
	p.removeAllSounds = function () {
		for(var key in this._audioSources) {
			this.removeSound(key);
		}
	};

	/**
	 * Create a sound instance. If the sound has not been preloaded, it is internally preloaded here.
	 * @method create
	 * @param {String} src The sound source to use.
	 * @param {Number} startTime Audio sprite property used to apply an offset, in milliseconds.
	 * @param {Number} duration Audio sprite property used to set the time the clip plays for, in milliseconds.
	 * @return {AbstractSoundInstance} A sound instance for playback and control.
	 */
	p.create = function (src, startTime, duration) {
		if (!this.isPreloadStarted(src)) {
			this.preload(this.register(src));
		}
		var si = new this._soundInstanceClass(src, startTime, duration, this._audioSources[src]);
		if(this._soundInstances[src]){
			this._soundInstances[src].push(si);
		}

		// Plugins that don't have a setVolume should implement a setMasterVolune/setMasterMute
		// So we have to check that here.
		si.setMasterVolume && si.setMasterVolume(createjs.Sound.volume);
		si.setMasterMute && si.setMasterMute(createjs.Sound.muted);

		return si;
	};

	// if a plugin does not support volume and mute, it should set these to null
	/**
	 * Set the master volume of the plugin, which affects all SoundInstances.
	 * @method setVolume
	 * @param {Number} value The volume to set, between 0 and 1.
	 * @return {Boolean} If the plugin processes the setVolume call (true). The Sound class will affect all the
	 * instances manually otherwise.
	 */
	p.setVolume = function (value) {
		this._volume = value;
		this._updateVolume();
		return true;
	};

	/**
	 * Get the master volume of the plugin, which affects all SoundInstances.
	 * @method getVolume
	 * @return {Number} The volume level, between 0 and 1.
	 */
	p.getVolume = function () {
		return this._volume;
	};

	/**
	 * Mute all sounds via the plugin.
	 * @method setMute
	 * @param {Boolean} value If all sound should be muted or not. Note that plugin-level muting just looks up
	 * the mute value of Sound {{#crossLink "Sound/muted:property"}}{{/crossLink}}, so this property is not used here.
	 * @return {Boolean} If the mute call succeeds.
	 */
	p.setMute = function (value) {
		this._updateVolume();
		return true;
	};

	// plugins should overwrite this method
	p.toString = function () {
		return "[AbstractPlugin]";
	};


// private methods:
	/**
	 * Handles internal preload completion.
	 * @method _handlePreloadComplete
	 * @param event
	 * @protected
	 */
	p._handlePreloadComplete = function (event) {
		var src = event.target.getItem().src,
				result = event.result,
				instances = this._soundInstances[src];
		this._audioSources[src] = result;

		if (instances != null && instances.length > 0) {
			for (var i=0, l=instances.length; i<l; i++) {
				instances[i].playbackResource = result;
				// TODO consider adding play call here if playstate == playfailed
				// LM: SoundJS policy is not to play sounds late that previously failed, as it could play unexpectedly.
			}
		}
		this._soundInstances[src] = null;
	};

	/**
	 * Handles internal preload errors
	 * @method _handlePreloadError
	 * @param event
	 * @protected
	 */
	p._handlePreloadError = function(event) {
		//delete(this._audioSources[src]);
	};

	/**
	 * Set the gain value for master audio. Should not be called externally.
	 * @method _updateVolume
	 * @protected
	 */
	p._updateVolume = function () {
		// Plugin Specific code
	};

	createjs.AbstractPlugin = AbstractPlugin;
}());

//##############################################################################
// WebAudioLoader.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	/**
	 * Loader provides a mechanism to preload Web Audio content via PreloadJS or internally. Instances are returned to
	 * the preloader, and the load method is called when the asset needs to be requested.
	 *
	 * @class WebAudioLoader
	 * @param {String} loadItem The item to be loaded
	 * @extends XHRRequest
	 * @protected
	 */
	function Loader(loadItem) {
		this.AbstractLoader_constructor(loadItem, true, createjs.Types.SOUND);

	};
	var p = createjs.extend(Loader, createjs.AbstractLoader);

	/**
	 * web audio context required for decoding audio
	 * @property context
	 * @type {AudioContext}
	 * @static
	 */
	Loader.context = null;


// public methods
	p.toString = function () {
		return "[WebAudioLoader]";
	};


// private methods
	p._createRequest = function() {
		this._request = new createjs.XHRRequest(this._item, false);
		this._request.setResponseType("arraybuffer");
	};

	p._sendComplete = function (event) {
		// OJR we leave this wrapped in Loader because we need to reference src and the handler only receives a single argument, the decodedAudio
		Loader.context.decodeAudioData(this._rawResult,
	         createjs.proxy(this._handleAudioDecoded, this),
	         createjs.proxy(this._sendError, this));
	};


	/**
	* The audio has been decoded.
	* @method handleAudioDecoded
	* @param decoded
	* @protected
	*/
	p._handleAudioDecoded = function (decodedAudio) {
		this._result = decodedAudio;
		this.AbstractLoader__sendComplete();
	};

	createjs.WebAudioLoader = createjs.promote(Loader, "AbstractLoader");
}());

//##############################################################################
// WebAudioSoundInstance.js
//##############################################################################

this.createjs = this.createjs || {};

/**
 * WebAudioSoundInstance extends the base api of {{#crossLink "AbstractSoundInstance"}}{{/crossLink}} and is used by
 * {{#crossLink "WebAudioPlugin"}}{{/crossLink}}.
 *
 * WebAudioSoundInstance exposes audioNodes for advanced users.
 *
 * @param {String} src The path to and file name of the sound.
 * @param {Number} startTime Audio sprite property used to apply an offset, in milliseconds.
 * @param {Number} duration Audio sprite property used to set the time the clip plays for, in milliseconds.
 * @param {Object} playbackResource Any resource needed by plugin to support audio playback.
 * @class WebAudioSoundInstance
 * @extends AbstractSoundInstance
 * @constructor
 */
(function () {
	"use strict";

	function WebAudioSoundInstance(src, startTime, duration, playbackResource) {
		this.AbstractSoundInstance_constructor(src, startTime, duration, playbackResource);


// public properties
		/**
		 * NOTE this is only intended for use by advanced users.
		 * <br />GainNode for controlling <code>WebAudioSoundInstance</code> volume. Connected to the {{#crossLink "WebAudioSoundInstance/destinationNode:property"}}{{/crossLink}}.
		 * @property gainNode
		 * @type {AudioGainNode}
		 * @since 0.4.0
		 *
		 */
		this.gainNode = s.context.createGain();

		/**
		 * NOTE this is only intended for use by advanced users.
		 * <br />A panNode allowing left and right audio channel panning only. Connected to WebAudioSoundInstance {{#crossLink "WebAudioSoundInstance/gainNode:property"}}{{/crossLink}}.
		 * @property panNode
		 * @type {AudioPannerNode}
		 * @since 0.4.0
		 */
		this.panNode = s.context.createPanner();
		this.panNode.panningModel = s._panningModel;
		this.panNode.connect(this.gainNode);
		this._updatePan();

		/**
		 * NOTE this is only intended for use by advanced users.
		 * <br />sourceNode is the audio source. Connected to WebAudioSoundInstance {{#crossLink "WebAudioSoundInstance/panNode:property"}}{{/crossLink}}.
		 * @property sourceNode
		 * @type {AudioNode}
		 * @since 0.4.0
		 *
		 */
		this.sourceNode = null;


// private properties
		/**
		 * Timeout that is created internally to handle sound playing to completion.
		 * Stored so we can remove it when stop, pause, or cleanup are called
		 * @property _soundCompleteTimeout
		 * @type {timeoutVariable}
		 * @default null
		 * @protected
		 * @since 0.4.0
		 */
		this._soundCompleteTimeout = null;

		/**
		 * NOTE this is only intended for use by very advanced users.
		 * _sourceNodeNext is the audio source for the next loop, inserted in a look ahead approach to allow for smooth
		 * looping. Connected to {{#crossLink "WebAudioSoundInstance/gainNode:property"}}{{/crossLink}}.
		 * @property _sourceNodeNext
		 * @type {AudioNode}
		 * @default null
		 * @protected
		 * @since 0.4.1
		 *
		 */
		this._sourceNodeNext = null;

		/**
		 * Time audio started playback, in seconds. Used to handle set position, get position, and resuming from paused.
		 * @property _playbackStartTime
		 * @type {Number}
		 * @default 0
		 * @protected
		 * @since 0.4.0
		 */
		this._playbackStartTime = 0;

		// Proxies, make removing listeners easier.
		this._endedHandler = createjs.proxy(this._handleSoundComplete, this);
	};
	var p = createjs.extend(WebAudioSoundInstance, createjs.AbstractSoundInstance);
	var s = WebAudioSoundInstance;

	/**
	 * Note this is only intended for use by advanced users.
	 * <br />Audio context used to create nodes.  This is and needs to be the same context used by {{#crossLink "WebAudioPlugin"}}{{/crossLink}}.
  	 * @property context
	 * @type {AudioContext}
	 * @static
	 * @since 0.6.0
	 */
	s.context = null;

	/**
	 * Note this is only intended for use by advanced users.
	 * <br />The scratch buffer that will be assigned to the buffer property of a source node on close.
	 * This is and should be the same scratch buffer referenced by {{#crossLink "WebAudioPlugin"}}{{/crossLink}}.
  	 * @property _scratchBuffer
	 * @type {AudioBufferSourceNode}
	 * @static
	 */
	s._scratchBuffer = null;

	/**
	 * Note this is only intended for use by advanced users.
	 * <br /> Audio node from WebAudioPlugin that sequences to <code>context.destination</code>
	 * @property destinationNode
	 * @type {AudioNode}
	 * @static
	 * @since 0.6.0
	 */
	s.destinationNode = null;

	/**
	 * Value to set panning model to equal power for WebAudioSoundInstance.  Can be "equalpower" or 0 depending on browser implementation.
	 * @property _panningModel
	 * @type {Number / String}
	 * @protected
	 * @static
	 * @since 0.6.0
	 */
	s._panningModel = "equalpower";


// Public methods
	p.destroy = function() {
		this.AbstractSoundInstance_destroy();

		this.panNode.disconnect(0);
		this.panNode = null;
		this.gainNode.disconnect(0);
		this.gainNode = null;
	};

	p.toString = function () {
		return "[WebAudioSoundInstance]";
	};


// Private Methods
	p._updatePan = function() {
		this.panNode.setPosition(this._pan, 0, -0.5);
		// z need to be -0.5 otherwise the sound only plays in left, right, or center
	};

	p._removeLooping = function(value) {
		this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext);
	};

	p._addLooping = function(value) {
		if (this.playState != createjs.Sound.PLAY_SUCCEEDED) { return; }
		this._sourceNodeNext = this._createAndPlayAudioNode(this._playbackStartTime, 0);
	};

	p._setDurationFromSource = function () {
		this._duration = this.playbackResource.duration * 1000;
	};

	p._handleCleanUp = function () {
		if (this.sourceNode && this.playState == createjs.Sound.PLAY_SUCCEEDED) {
			this.sourceNode = this._cleanUpAudioNode(this.sourceNode);
			this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext);
		}

		if (this.gainNode.numberOfOutputs != 0) {this.gainNode.disconnect(0);}
		// OJR there appears to be a bug that this doesn't always work in webkit (Chrome and Safari). According to the documentation, this should work.

		clearTimeout(this._soundCompleteTimeout);

		this._playbackStartTime = 0;	// This is used by _getPosition
	};

	/**
	 * Turn off and disconnect an audioNode, then set reference to null to release it for garbage collection
	 * @method _cleanUpAudioNode
	 * @param audioNode
	 * @return {audioNode}
	 * @protected
	 * @since 0.4.1
	 */
	p._cleanUpAudioNode = function(audioNode) {
		if(audioNode) {
			audioNode.stop(0);
			audioNode.disconnect(0);
			// necessary to prevent leak on iOS Safari 7-9. will throw in almost all other
			// browser implementations.
			if ( createjs.BrowserDetect.isIOS ) {
				try { audioNode.buffer = s._scratchBuffer; } catch(e) {}
			}
			audioNode = null;
		}
		return audioNode;
	};

	p._handleSoundReady = function (event) {
		this.gainNode.connect(s.destinationNode);  // this line can cause a memory leak.  Nodes need to be disconnected from the audioDestination or any sequence that leads to it.

		var dur = this._duration * 0.001,
			pos = Math.min(Math.max(0, this._position) * 0.001, dur);
		this.sourceNode = this._createAndPlayAudioNode((s.context.currentTime - dur), pos);
		this._playbackStartTime = this.sourceNode.startTime - pos;

		this._soundCompleteTimeout = setTimeout(this._endedHandler, (dur - pos) * 1000);

		if(this._loop != 0) {
			this._sourceNodeNext = this._createAndPlayAudioNode(this._playbackStartTime, 0);
		}
	};

	/**
	 * Creates an audio node using the current src and context, connects it to the gain node, and starts playback.
	 * @method _createAndPlayAudioNode
	 * @param {Number} startTime The time to add this to the web audio context, in seconds.
	 * @param {Number} offset The amount of time into the src audio to start playback, in seconds.
	 * @return {audioNode}
	 * @protected
	 * @since 0.4.1
	 */
	p._createAndPlayAudioNode = function(startTime, offset) {
		var audioNode = s.context.createBufferSource();
		audioNode.buffer = this.playbackResource;
		audioNode.connect(this.panNode);
		var dur = this._duration * 0.001;
		audioNode.startTime = startTime + dur;
		audioNode.start(audioNode.startTime, offset+(this._startTime*0.001), dur - offset);
		return audioNode;
	};

	p._pause = function () {
		this._position = (s.context.currentTime - this._playbackStartTime) * 1000;  // * 1000 to give milliseconds, lets us restart at same point
		this.sourceNode = this._cleanUpAudioNode(this.sourceNode);
		this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext);

		if (this.gainNode.numberOfOutputs != 0) {this.gainNode.disconnect(0);}

		clearTimeout(this._soundCompleteTimeout);
	};

	p._resume = function () {
		this._handleSoundReady();
	};

	/*
	p._handleStop = function () {
		// web audio does not need to do anything extra
	};
	*/

	p._updateVolume = function () {
		var newVolume = this._muted ? 0 : this._volume;
	  	if (newVolume != this.gainNode.gain.value) {
		  this.gainNode.gain.value = newVolume;
  		}
	};

	p._calculateCurrentPosition = function () {
		return ((s.context.currentTime - this._playbackStartTime) * 1000); // pos in seconds * 1000 to give milliseconds
	};

	p._updatePosition = function () {
		this.sourceNode = this._cleanUpAudioNode(this.sourceNode);
		this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext);
		clearTimeout(this._soundCompleteTimeout);

		if (!this._paused) {this._handleSoundReady();}
	};

	// OJR we are using a look ahead approach to ensure smooth looping.
	// We add _sourceNodeNext to the audio context so that it starts playing even if this callback is delayed.
	// This technique is described here:  http://www.html5rocks.com/en/tutorials/audio/scheduling/
	// NOTE the cost of this is that our audio loop may not always match the loop event timing precisely.
	p._handleLoop = function () {
		this._cleanUpAudioNode(this.sourceNode);
		this.sourceNode = this._sourceNodeNext;
		this._playbackStartTime = this.sourceNode.startTime;
		this._sourceNodeNext = this._createAndPlayAudioNode(this._playbackStartTime, 0);
		this._soundCompleteTimeout = setTimeout(this._endedHandler, this._duration);
	};

	p._updateDuration = function () {
		if(this.playState == createjs.Sound.PLAY_SUCCEEDED) {
			this._pause();
			this._resume();
		}
	};

	createjs.WebAudioSoundInstance = createjs.promote(WebAudioSoundInstance, "AbstractSoundInstance");
}());

//##############################################################################
// WebAudioPlugin.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {

	"use strict";

	/**
	 * Play sounds using Web Audio in the browser. The WebAudioPlugin is currently the default plugin, and will be used
	 * anywhere that it is supported. To change plugin priority, check out the Sound API
	 * {{#crossLink "Sound/registerPlugins"}}{{/crossLink}} method.

	 * <h4>Known Browser and OS issues for Web Audio</h4>
	 * <b>Firefox 25</b>
	 * <li>
	 *     mp3 audio files do not load properly on all windows machines, reported <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=929969" target="_blank">here</a>.
	 *     <br />For this reason it is recommended to pass another FireFox-supported type (i.e. ogg) as the default
	 *     extension, until this bug is resolved
	 * </li>
	 *
	 * <b>Webkit (Chrome and Safari)</b>
	 * <li>
	 *     AudioNode.disconnect does not always seem to work.  This can cause the file size to grow over time if you
	 * 	   are playing a lot of audio files.
	 * </li>
	 *
	 * <b>iOS 6 limitations</b>
	 * <ul>
	 *     <li>
	 *         Sound is initially muted and will only unmute through play being called inside a user initiated event
	 *         (touch/click). Please read the mobile playback notes in the the {{#crossLink "Sound"}}{{/crossLink}}
	 *         class for a full overview of the limitations, and how to get around them.
	 *     </li>
	 *	   <li>
	 *	       A bug exists that will distort un-cached audio when a video element is present in the DOM. You can avoid
	 *	       this bug by ensuring the audio and video audio share the same sample rate.
	 *	   </li>
	 * </ul>
	 * @class WebAudioPlugin
	 * @extends AbstractPlugin
	 * @constructor
	 * @since 0.4.0
	 */
	function WebAudioPlugin() {
		this.AbstractPlugin_constructor();


// Private Properties
		/**
		 * Value to set panning model to equal power for WebAudioSoundInstance.  Can be "equalpower" or 0 depending on browser implementation.
		 * @property _panningModel
		 * @type {Number / String}
		 * @protected
		 */
		this._panningModel = s._panningModel;;

		/**
		 * The web audio context, which WebAudio uses to play audio. All nodes that interact with the WebAudioPlugin
		 * need to be created within this context.
		 * @property context
		 * @type {AudioContext}
		 */
		this.context = s.context;

		/**
		 * A DynamicsCompressorNode, which is used to improve sound quality and prevent audio distortion.
		 * It is connected to <code>context.destination</code>.
		 *
		 * Can be accessed by advanced users through createjs.Sound.activePlugin.dynamicsCompressorNode.
		 * @property dynamicsCompressorNode
		 * @type {AudioNode}
		 */
		this.dynamicsCompressorNode = this.context.createDynamicsCompressor();
		this.dynamicsCompressorNode.connect(this.context.destination);

		/**
		 * A GainNode for controlling master volume. It is connected to {{#crossLink "WebAudioPlugin/dynamicsCompressorNode:property"}}{{/crossLink}}.
		 *
		 * Can be accessed by advanced users through createjs.Sound.activePlugin.gainNode.
		 * @property gainNode
		 * @type {AudioGainNode}
		 */
		this.gainNode = this.context.createGain();
		this.gainNode.connect(this.dynamicsCompressorNode);
		createjs.WebAudioSoundInstance.destinationNode = this.gainNode;

		this._capabilities = s._capabilities;

		this._loaderClass = createjs.WebAudioLoader;
		this._soundInstanceClass = createjs.WebAudioSoundInstance;

		this._addPropsToClasses();
	}
	var p = createjs.extend(WebAudioPlugin, createjs.AbstractPlugin);

// Static Properties
	var s = WebAudioPlugin;
	/**
	 * The capabilities of the plugin. This is generated via the {{#crossLink "WebAudioPlugin/_generateCapabilities:method"}}{{/crossLink}}
	 * method and is used internally.
	 * @property _capabilities
	 * @type {Object}
	 * @default null
	 * @private
	 * @static
	 */
	s._capabilities = null;

	/**
	 * Value to set panning model to equal power for WebAudioSoundInstance.  Can be "equalpower" or 0 depending on browser implementation.
	 * @property _panningModel
	 * @type {Number / String}
	 * @private
	 * @static
	 */
	s._panningModel = "equalpower";

	/**
	 * The web audio context, which WebAudio uses to play audio. All nodes that interact with the WebAudioPlugin
	 * need to be created within this context.
	 *
	 * Advanced users can set this to an existing context, but <b>must</b> do so before they call
	 * {{#crossLink "Sound/registerPlugins"}}{{/crossLink}} or {{#crossLink "Sound/initializeDefaultPlugins"}}{{/crossLink}}.
	 *
	 * @property context
	 * @type {AudioContext}
	 * @static
	 */
	s.context = null;

	/**
	 * The scratch buffer that will be assigned to the buffer property of a source node on close.
	 * Works around an iOS Safari bug: https://github.com/CreateJS/SoundJS/issues/102
	 *
	 * Advanced users can set this to an existing source node, but <b>must</b> do so before they call
	 * {{#crossLink "Sound/registerPlugins"}}{{/crossLink}} or {{#crossLink "Sound/initializeDefaultPlugins"}}{{/crossLink}}.
	 *
	 * @property _scratchBuffer
	 * @type {AudioBuffer}
	 * @private
	 * @static
	 */
	 s._scratchBuffer = null;

	/**
	 * Indicated whether audio on iOS has been unlocked, which requires a touchend/mousedown event that plays an
	 * empty sound.
	 * @property _unlocked
	 * @type {boolean}
	 * @since 0.6.2
	 * @private
	 */
	s._unlocked = false;

	/**
	 * The default sample rate used when checking for iOS compatibility. See {{#crossLink "WebAudioPlugin/_createAudioContext"}}{{/crossLink}}.
	 * @property DEFAULT_SAMPLE_REATE
	 * @type {number}
	 * @default 44100
	 * @static
	 */
	s.DEFAULT_SAMPLE_RATE = 44100;

// Static Public Methods
	/**
	 * Determine if the plugin can be used in the current browser/OS.
	 * @method isSupported
	 * @return {Boolean} If the plugin can be initialized.
	 * @static
	 */
	s.isSupported = function () {
		// check if this is some kind of mobile device, Web Audio works with local protocol under PhoneGap and it is unlikely someone is trying to run a local file
		var isMobilePhoneGap = createjs.BrowserDetect.isIOS || createjs.BrowserDetect.isAndroid || createjs.BrowserDetect.isBlackberry;
		// OJR isMobile may be redundant with _isFileXHRSupported available.  Consider removing.
		if (location.protocol == "file:" && !isMobilePhoneGap && !this._isFileXHRSupported()) { return false; }  // Web Audio requires XHR, which is not usually available locally
		s._generateCapabilities();
		if (s.context == null) {return false;}
		return true;
	};

	/**
	 * Plays an empty sound in the web audio context.  This is used to enable web audio on iOS devices, as they
	 * require the first sound to be played inside of a user initiated event (touch/click).  This is called when
	 * {{#crossLink "WebAudioPlugin"}}{{/crossLink}} is initialized (by Sound {{#crossLink "Sound/initializeDefaultPlugins"}}{{/crossLink}}
	 * for example).
	 *
	 * <h4>Example</h4>
	 *
	 *     function handleTouch(event) {
	 *         createjs.WebAudioPlugin.playEmptySound();
	 *     }
	 *
	 * @method playEmptySound
	 * @static
	 * @since 0.4.1
	 */
	s.playEmptySound = function() {
		if (s.context == null) {return;}
		var source = s.context.createBufferSource();
		source.buffer = s._scratchBuffer;
		source.connect(s.context.destination);
		source.start(0, 0, 0);
	};


// Static Private Methods
	/**
	 * Determine if XHR is supported, which is necessary for web audio.
	 * @method _isFileXHRSupported
	 * @return {Boolean} If XHR is supported.
	 * @since 0.4.2
	 * @private
	 * @static
	 */
	s._isFileXHRSupported = function() {
		// it's much easier to detect when something goes wrong, so let's start optimistically
		var supported = true;

		var xhr = new XMLHttpRequest();
		try {
			xhr.open("GET", "WebAudioPluginTest.fail", false); // loading non-existant file triggers 404 only if it could load (synchronous call)
		} catch (error) {
			// catch errors in cases where the onerror is passed by
			supported = false;
			return supported;
		}
		xhr.onerror = function() { supported = false; }; // cause irrelevant
		// with security turned off, we can get empty success results, which is actually a failed read (status code 0?)
		xhr.onload = function() { supported = this.status == 404 || (this.status == 200 || (this.status == 0 && this.response != "")); };
		try {
			xhr.send();
		} catch (error) {
			// catch errors in cases where the onerror is passed by
			supported = false;
		}

		return supported;
	};

	/**
	 * Determine the capabilities of the plugin. Used internally. Please see the Sound API {{#crossLink "Sound/capabilities:property"}}{{/crossLink}}
	 * method for an overview of plugin capabilities.
	 * @method _generateCapabilities
	 * @static
	 * @private
	 */
	s._generateCapabilities = function () {
		if (s._capabilities != null) {return;}
		// Web Audio can be in any formats supported by the audio element, from http://www.w3.org/TR/webaudio/#AudioContext-section
		var t = document.createElement("audio");
		if (t.canPlayType == null) {return null;}

		if (s.context == null) {
			s.context = s._createAudioContext();
			if (s.context == null) { return null; }
		}
		if (s._scratchBuffer == null) {
			s._scratchBuffer = s.context.createBuffer(1, 1, 22050);
		}

		s._compatibilitySetUp();

		// Listen for document level clicks to unlock WebAudio on iOS. See the _unlock method.
		if ("ontouchstart" in window && s.context.state != "running") {
			s._unlock(); // When played inside of a touch event, this will enable audio on iOS immediately.
			document.addEventListener("mousedown", s._unlock, true);
			document.addEventListener("touchstart", s._unlock, true);
			document.addEventListener("touchend", s._unlock, true);
		}

		s._capabilities = {
			panning:true,
			volume:true,
			tracks:-1
		};

		// determine which extensions our browser supports for this plugin by iterating through Sound.SUPPORTED_EXTENSIONS
		var supportedExtensions = createjs.Sound.SUPPORTED_EXTENSIONS;
		var extensionMap = createjs.Sound.EXTENSION_MAP;
		for (var i = 0, l = supportedExtensions.length; i < l; i++) {
			var ext = supportedExtensions[i];
			var playType = extensionMap[ext] || ext;
			s._capabilities[ext] = (t.canPlayType("audio/" + ext) != "no" && t.canPlayType("audio/" + ext) != "") || (t.canPlayType("audio/" + playType) != "no" && t.canPlayType("audio/" + playType) != "");
		}  // OJR another way to do this might be canPlayType:"m4a", codex: mp4

		// 0=no output, 1=mono, 2=stereo, 4=surround, 6=5.1 surround.
		// See http://www.w3.org/TR/webaudio/#AudioChannelSplitter for more details on channels.
		if (s.context.destination.numberOfChannels < 2) {
			s._capabilities.panning = false;
		}
	};

	/**
	 * Create an audio context for the sound.
	 *
	 * This method handles both vendor prefixes (specifically webkit support), as well as a case on iOS where
	 * audio played with a different sample rate may play garbled when first started. The default sample rate is
	 * 44,100, however it can be changed using the {{#crossLink "WebAudioPlugin/DEFAULT_SAMPLE_RATE:property"}}{{/crossLink}}.
	 * @method _createAudioContext
	 * @return {AudioContext | webkitAudioContext}
	 * @private
	 * @static
	 * @since 1.0.0
	 */
	s._createAudioContext = function() {
		// Slightly modified version of https://github.com/Jam3/ios-safe-audio-context
		// Resolves issues with first-run contexts playing garbled on iOS.
		var AudioCtor = (window.AudioContext || window.webkitAudioContext);
		if (AudioCtor == null) { return null; }
		var context = new AudioCtor();

		// Check if hack is necessary. Only occurs in iOS6+ devices
		// and only when you first boot the iPhone, or play a audio/video
		// with a different sample rate
		if (/(iPhone|iPad)/i.test(navigator.userAgent)
				&& context.sampleRate !== s.DEFAULT_SAMPLE_RATE) {
			var buffer = context.createBuffer(1, 1, s.DEFAULT_SAMPLE_RATE),
					dummy = context.createBufferSource();
			dummy.buffer = buffer;
			dummy.connect(context.destination);
			dummy.start(0);
			dummy.disconnect();
			context.close() // dispose old context

			context = new AudioCtor();
		}
		return context;
	}

	/**
	 * Set up compatibility if only deprecated web audio calls are supported.
	 * See http://www.w3.org/TR/webaudio/#DeprecationNotes
	 * Needed so we can support new browsers that don't support deprecated calls (Firefox) as well as old browsers that
	 * don't support new calls.
	 *
	 * @method _compatibilitySetUp
	 * @static
	 * @private
	 * @since 0.4.2
	 */
	s._compatibilitySetUp = function() {
		s._panningModel = "equalpower";
		//assume that if one new call is supported, they all are
		if (s.context.createGain) { return; }

		// simple name change, functionality the same
		s.context.createGain = s.context.createGainNode;

		// source node, add to prototype
		var audioNode = s.context.createBufferSource();
		audioNode.__proto__.start = audioNode.__proto__.noteGrainOn;	// note that noteGrainOn requires all 3 parameters
		audioNode.__proto__.stop = audioNode.__proto__.noteOff;

		// panningModel
		s._panningModel = 0;
	};

	/**
	 * Try to unlock audio on iOS. This is triggered from either WebAudio plugin setup (which will work if inside of
	 * a `mousedown` or `touchend` event stack), or the first document touchend/mousedown event. If it fails (touchend
	 * will fail if the user presses for too long, indicating a scroll event instead of a click event.
	 *
	 * Note that earlier versions of iOS supported `touchstart` for this, but iOS9 removed this functionality. Adding
	 * a `touchstart` event to support older platforms may preclude a `mousedown` even from getting fired on iOS9, so we
	 * stick with `mousedown` and `touchend`.
	 * @method _unlock
	 * @since 0.6.2
	 * @private
	 */
	s._unlock = function() {
		if (s._unlocked) { return; }
		s.playEmptySound();
		if (s.context.state == "running") {
			document.removeEventListener("mousedown", s._unlock, true);
			document.removeEventListener("touchend", s._unlock, true);
			document.removeEventListener("touchstart", s._unlock, true);
			s._unlocked = true;
		}
	};


// Public Methods
	p.toString = function () {
		return "[WebAudioPlugin]";
	};


// Private Methods
	/**
	 * Set up needed properties on supported classes WebAudioSoundInstance and WebAudioLoader.
	 * @method _addPropsToClasses
	 * @static
	 * @protected
	 * @since 0.6.0
	 */
	p._addPropsToClasses = function() {
		var c = this._soundInstanceClass;
		c.context = this.context;
		c._scratchBuffer = s._scratchBuffer;
		c.destinationNode = this.gainNode;
		c._panningModel = this._panningModel;

		this._loaderClass.context = this.context;
	};


	/**
	 * Set the gain value for master audio. Should not be called externally.
	 * @method _updateVolume
	 * @protected
	 */
	p._updateVolume = function () {
		var newVolume = createjs.Sound._masterMute ? 0 : this._volume;
		if (newVolume != this.gainNode.gain.value) {
			this.gainNode.gain.value = newVolume;
		}
	};

	createjs.WebAudioPlugin = createjs.promote(WebAudioPlugin, "AbstractPlugin");
}());

//##############################################################################
// HTMLAudioTagPool.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	/**
	 * HTMLAudioTagPool is an object pool for HTMLAudio tag instances.
	 * @class HTMLAudioTagPool
	 * @param {String} src The source of the channel.
	 * @protected
	 */
	function HTMLAudioTagPool() {
			throw "HTMLAudioTagPool cannot be instantiated";
	}

	var s = HTMLAudioTagPool;

// Static Properties
	/**
	 * A hash lookup of each base audio tag, indexed by the audio source.
	 * @property _tags
	 * @type {{}}
	 * @static
	 * @private
	 */
	s._tags = {};

	/**
	 * An object pool for html audio tags
	 * @property _tagPool
	 * @type {TagPool}
	 * @static
	 * @private
	 */
	s._tagPool = new TagPool();

	/**
	 * A hash lookup of if a base audio tag is available, indexed by the audio source
	 * @property _tagsUsed
	 * @type {{}}
	 * @private
	 * @static
	 */
	s._tagUsed = {};

// Static Methods
	/**
	  * Get an audio tag with the given source.
	  * @method get
	  * @param {String} src The source file used by the audio tag.
	  * @static
	  */
	 s.get = function (src) {
		var t = s._tags[src];
		if (t == null) {
			// create new base tag
			t = s._tags[src] = s._tagPool.get();
			t.src = src;
		} else {
			// get base or pool
			if (s._tagUsed[src]) {
				t = s._tagPool.get();
				t.src = src;
			} else {
				s._tagUsed[src] = true;
			}
		}
		return t;
	 };

	 /**
	  * Return an audio tag to the pool.
	  * @method set
	  * @param {String} src The source file used by the audio tag.
	  * @param {HTMLElement} tag Audio tag to set.
	  * @static
	  */
	 s.set = function (src, tag) {
		 // check if this is base, if yes set boolean if not return to pool
		 if(tag == s._tags[src]) {
			 s._tagUsed[src] = false;
		 } else {
			 s._tagPool.set(tag);
		 }
	 };

	/**
	 * Delete stored tag reference and return them to pool. Note that if the tag reference does not exist, this will fail.
	 * @method remove
	 * @param {String} src The source for the tag
	 * @return {Boolean} If the TagPool was deleted.
	 * @static
	 */
	s.remove = function (src) {
		var tag = s._tags[src];
		if (tag == null) {return false;}
		s._tagPool.set(tag);
		delete(s._tags[src]);
		delete(s._tagUsed[src]);
		return true;
	};

	/**
	 * Gets the duration of the src audio in milliseconds
	 * @method getDuration
	 * @param {String} src The source file used by the audio tag.
	 * @return {Number} Duration of src in milliseconds
	 * @static
	 */
	s.getDuration= function (src) {
		var t = s._tags[src];
		if (t == null || !t.duration) {return 0;}	// OJR duration is NaN if loading has not completed
		return t.duration * 1000;
	};

	createjs.HTMLAudioTagPool = HTMLAudioTagPool;


// ************************************************************************************************************
	/**
	 * The TagPool is an object pool for HTMLAudio tag instances.
	 * #class TagPool
	 * @param {String} src The source of the channel.
	 * @protected
	 */
	function TagPool(src) {

// Public Properties
		/**
		 * A list of all available tags in the pool.
		 * #property tags
		 * @type {Array}
		 * @protected
		 */
		this._tags = [];
	};

	var p = TagPool.prototype;
	p.constructor = TagPool;


// Public Methods
	/**
	 * Get an HTMLAudioElement for immediate playback. This takes it out of the pool.
	 * #method get
	 * @return {HTMLAudioElement} An HTML audio tag.
	 */
	p.get = function () {
		var tag;
		if (this._tags.length == 0) {
			tag = this._createTag();
		} else {
			tag = this._tags.pop();
		}
		if (tag.parentNode == null) {document.body.appendChild(tag);}
		return tag;
	};

	/**
	 * Put an HTMLAudioElement back in the pool for use.
	 * #method set
	 * @param {HTMLAudioElement} tag HTML audio tag
	 */
	p.set = function (tag) {
		// OJR this first step seems unnecessary
		var index = createjs.indexOf(this._tags, tag);
		if (index == -1) {
			this._tags.src = null;
			this._tags.push(tag);
		}
	};

	p.toString = function () {
		return "[TagPool]";
	};


// Private Methods
	/**
	 * Create an HTML audio tag.
	 * #method _createTag
	 * @param {String} src The source file to set for the audio tag.
	 * @return {HTMLElement} Returns an HTML audio tag.
	 * @protected
	 */
	p._createTag = function () {
		var tag = document.createElement("audio");
		tag.autoplay = false;
		tag.preload = "none";
		//LM: Firefox fails when this the preload="none" for other tags, but it needs to be "none" to ensure PreloadJS works.
		return tag;
	};

}());

//##############################################################################
// HTMLAudioSoundInstance.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
	"use strict";

	/**
	 * HTMLAudioSoundInstance extends the base api of {{#crossLink "AbstractSoundInstance"}}{{/crossLink}} and is used by
	 * {{#crossLink "HTMLAudioPlugin"}}{{/crossLink}}.
	 *
	 * @param {String} src The path to and file name of the sound.
	 * @param {Number} startTime Audio sprite property used to apply an offset, in milliseconds.
	 * @param {Number} duration Audio sprite property used to set the time the clip plays for, in milliseconds.
	 * @param {Object} playbackResource Any resource needed by plugin to support audio playback.
	 * @class HTMLAudioSoundInstance
	 * @extends AbstractSoundInstance
	 * @constructor
	 */
	function HTMLAudioSoundInstance(src, startTime, duration, playbackResource) {
		this.AbstractSoundInstance_constructor(src, startTime, duration, playbackResource);


// Private Properties
		this._audioSpriteStopTime = null;
		this._delayTimeoutId = null;

		// Proxies, make removing listeners easier.
		this._endedHandler = createjs.proxy(this._handleSoundComplete, this);
		this._readyHandler = createjs.proxy(this._handleTagReady, this);
		this._stalledHandler = createjs.proxy(this._playFailed, this);
		this._audioSpriteEndHandler = createjs.proxy(this._handleAudioSpriteLoop, this);
		this._loopHandler = createjs.proxy(this._handleSoundComplete, this);

		if (duration) {
			this._audioSpriteStopTime = (startTime + duration) * 0.001;
		} else {
			this._duration = createjs.HTMLAudioTagPool.getDuration(this.src);
		}
	}
	var p = createjs.extend(HTMLAudioSoundInstance, createjs.AbstractSoundInstance);

// Public Methods
	/**
	 * Called by {{#crossLink "Sound"}}{{/crossLink}} when plugin does not handle master volume.
	 * undoc'd because it is not meant to be used outside of Sound
	 * #method setMasterVolume
	 * @param value
	 */
	p.setMasterVolume = function (value) {
		this._updateVolume();
	};

	/**
	 * Called by {{#crossLink "Sound"}}{{/crossLink}} when plugin does not handle master mute.
	 * undoc'd because it is not meant to be used outside of Sound
	 * #method setMasterMute
	 * @param value
	 */
	p.setMasterMute = function (isMuted) {
		this._updateVolume();
	};

	p.toString = function () {
		return "[HTMLAudioSoundInstance]";
	};

//Private Methods
	p._removeLooping = function() {
		if(this._playbackResource == null) {return;}
		this._playbackResource.loop = false;
		this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, false);
	};

	p._addLooping = function() {
		if(this._playbackResource == null  || this._audioSpriteStopTime) {return;}
		this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, false);
		this._playbackResource.loop = true;
	};

	p._handleCleanUp = function () {
		var tag = this._playbackResource;
		if (tag != null) {
			tag.pause();
			tag.loop = false;
			tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, false);
			tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY, this._readyHandler, false);
			tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED, this._stalledHandler, false);
			tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, false);
			tag.removeEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, false);

			try {
				tag.currentTime = this._startTime;
			} catch (e) {
			} // Reset Position
			createjs.HTMLAudioTagPool.set(this.src, tag);
			this._playbackResource = null;
		}
	};

	p._beginPlaying = function (playProps) {
		this._playbackResource = createjs.HTMLAudioTagPool.get(this.src);
		return this.AbstractSoundInstance__beginPlaying(playProps);
	};

	p._handleSoundReady = function (event) {
		if (this._playbackResource.readyState !== 4) {
			var tag = this._playbackResource;
			tag.addEventListener(createjs.HTMLAudioPlugin._AUDIO_READY, this._readyHandler, false);
			tag.addEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED, this._stalledHandler, false);
			tag.preload = "auto"; // This is necessary for Firefox, as it won't ever "load" until this is set.
			tag.load();
			return;
		}

		this._updateVolume();
		this._playbackResource.currentTime = (this._startTime + this._position) * 0.001;
		if (this._audioSpriteStopTime) {
			this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, false);
		} else {
			this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, false);
			if(this._loop != 0) {
				this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, false);
				this._playbackResource.loop = true;
			}
		}

		this._playbackResource.play();
	};

	/**
	 * Used to handle when a tag is not ready for immediate playback when it is returned from the HTMLAudioTagPool.
	 * @method _handleTagReady
	 * @param event
	 * @protected
	 */
	p._handleTagReady = function (event) {
		this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY, this._readyHandler, false);
		this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED, this._stalledHandler, false);

		this._handleSoundReady();
	};

	p._pause = function () {
		this._playbackResource.pause();
	};

	p._resume = function () {
		this._playbackResource.play();
	};

	p._updateVolume = function () {
		if (this._playbackResource != null) {
			var newVolume = (this._muted || createjs.Sound._masterMute) ? 0 : this._volume * createjs.Sound._masterVolume;
			if (newVolume != this._playbackResource.volume) {this._playbackResource.volume = newVolume;}
		}
	};

	p._calculateCurrentPosition = function() {
		return (this._playbackResource.currentTime * 1000) - this._startTime;
	};

	p._updatePosition = function() {
		this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, false);
		this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._handleSetPositionSeek, false);
		try {
			this._playbackResource.currentTime = (this._position + this._startTime) * 0.001;
		} catch (error) { // Out of range
			this._handleSetPositionSeek(null);
		}
	};

	/**
	 * Used to enable setting position, as we need to wait for that seek to be done before we add back our loop handling seek listener
	 * @method _handleSetPositionSeek
	 * @param event
	 * @protected
	 */
	p._handleSetPositionSeek = function(event) {
		if (this._playbackResource == null) { return; }
		this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._handleSetPositionSeek, false);
		this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, false);
	};

	/**
	 * Timer used to loop audio sprites.
	 * NOTE because of the inaccuracies in the timeupdate event (15 - 250ms) and in setting the tag to the desired timed
	 * (up to 300ms), it is strongly recommended not to loop audio sprites with HTML Audio if smooth looping is desired
	 *
	 * @method _handleAudioSpriteLoop
	 * @param event
	 * @private
	 */
	p._handleAudioSpriteLoop = function (event) {
		if(this._playbackResource.currentTime <= this._audioSpriteStopTime) {return;}
		this._playbackResource.pause();
		if(this._loop == 0) {
			this._handleSoundComplete(null);
		} else {
			this._position = 0;
			this._loop--;
			this._playbackResource.currentTime = this._startTime * 0.001;
			if(!this._paused) {this._playbackResource.play();}
			this._sendEvent("loop");
		}
	};

	// NOTE with this approach audio will loop as reliably as the browser allows
	// but we could end up sending the loop event after next loop playback begins
	p._handleLoop = function (event) {
		if(this._loop == 0) {
			this._playbackResource.loop = false;
			this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, false);
		}
	};

	p._updateStartTime = function () {
		this._audioSpriteStopTime = (this._startTime + this._duration) * 0.001;

		if(this.playState == createjs.Sound.PLAY_SUCCEEDED) {
			this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, false);
			this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, false);
		}
	};

	p._updateDuration = function () {
		this._audioSpriteStopTime = (this._startTime + this._duration) * 0.001;

		if(this.playState == createjs.Sound.PLAY_SUCCEEDED) {
			this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, false);
			this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, false);
		}
	};

	p._setDurationFromSource = function () {
		this._duration = createjs.HTMLAudioTagPool.getDuration(this.src);
		this._playbackResource = null;
	};

	createjs.HTMLAudioSoundInstance = createjs.promote(HTMLAudioSoundInstance, "AbstractSoundInstance");
}());

//##############################################################################
// HTMLAudioPlugin.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {

	"use strict";

	/**
	 * Play sounds using HTML &lt;audio&gt; tags in the browser. This plugin is the second priority plugin installed
	 * by default, after the {{#crossLink "WebAudioPlugin"}}{{/crossLink}}.  For older browsers that do not support html
	 * audio, include and install the {{#crossLink "FlashAudioPlugin"}}{{/crossLink}}.
	 *
	 * <h4>Known Browser and OS issues for HTML Audio</h4>
	 * <b>All browsers</b><br />
	 * Testing has shown in all browsers there is a limit to how many audio tag instances you are allowed.  If you exceed
	 * this limit, you can expect to see unpredictable results. Please use {{#crossLink "Sound.MAX_INSTANCES"}}{{/crossLink}} as
	 * a guide to how many total audio tags you can safely use in all browsers.  This issue is primarily limited to IE9.
	 *
     * <b>IE html limitations</b><br />
     * <ul><li>There is a delay in applying volume changes to tags that occurs once playback is started. So if you have
     * muted all sounds, they will all play during this delay until the mute applies internally. This happens regardless of
     * when or how you apply the volume change, as the tag seems to need to play to apply it.</li>
     * <li>MP3 encoding will not always work for audio tags if it's not default.  We've found default encoding with
     * 64kbps works.</li>
	 * <li>Occasionally very short samples will get cut off.</li>
	 * <li>There is a limit to how many audio tags you can load or play at once, which appears to be determined by
	 * hardware and browser settings.  See {{#crossLink "HTMLAudioPlugin.MAX_INSTANCES"}}{{/crossLink}} for a safe estimate.
	 * Note that audio sprites can be used as a solution to this issue.</li></ul>
	 *
	 * <b>Safari limitations</b><br />
	 * <ul><li>Safari requires Quicktime to be installed for audio playback.</li></ul>
	 *
	 * <b>iOS 6 limitations</b><br />
	 * <ul><li>can only have one &lt;audio&gt; tag</li>
	 * 		<li>can not preload or autoplay the audio</li>
	 * 		<li>can not cache the audio</li>
	 * 		<li>can not play the audio except inside a user initiated event.</li>
	 *		<li>Note it is recommended to use {{#crossLink "WebAudioPlugin"}}{{/crossLink}} for iOS (6+)</li>
	 * 		<li>audio sprites can be used to mitigate some of these issues and are strongly recommended on iOS</li>
	 * </ul>
	 *
	 * <b>Android Native Browser limitations</b><br />
	 * <ul><li>We have no control over audio volume. Only the user can set volume on their device.</li>
	 *      <li>We can only play audio inside a user event (touch/click).  This currently means you cannot loop sound or use a delay.</li></ul>
	 * <b> Android Chrome 26.0.1410.58 specific limitations</b><br />
	 * <ul> <li>Can only play 1 sound at a time.</li>
	 *      <li>Sound is not cached.</li>
	 *      <li>Sound can only be loaded in a user initiated touch/click event.</li>
	 *      <li>There is a delay before a sound is played, presumably while the src is loaded.</li>
	 * </ul>
	 *
	 * See {{#crossLink "Sound"}}{{/crossLink}} for general notes on known issues.
	 *
	 * @class HTMLAudioPlugin
	 * @extends AbstractPlugin
	 * @constructor
	 */
	function HTMLAudioPlugin() {
		this.AbstractPlugin_constructor();


	// Public Properties
		this._capabilities = s._capabilities;

		this._loaderClass = createjs.SoundLoader;
		this._soundInstanceClass = createjs.HTMLAudioSoundInstance;
	}

	var p = createjs.extend(HTMLAudioPlugin, createjs.AbstractPlugin);
	var s = HTMLAudioPlugin;

// Static Properties
	/**
	 * The maximum number of instances that can be loaded or played. This is a browser limitation, primarily limited to IE9.
	 * The actual number varies from browser to browser (and is largely hardware dependant), but this is a safe estimate.
	 * Audio sprites work around this limitation.
	 * @property MAX_INSTANCES
	 * @type {Number}
	 * @default 30
	 * @static
	 */
	s.MAX_INSTANCES = 30;

	/**
	 * Event constant for the "canPlayThrough" event for cleaner code.
	 * @property _AUDIO_READY
	 * @type {String}
	 * @default canplaythrough
	 * @static
	 * @private
	 */
	s._AUDIO_READY = "canplaythrough";

	/**
	 * Event constant for the "ended" event for cleaner code.
	 * @property _AUDIO_ENDED
	 * @type {String}
	 * @default ended
	 * @static
	 * @private
	 */
	s._AUDIO_ENDED = "ended";

	/**
	 * Event constant for the "seeked" event for cleaner code.  We utilize this event for maintaining loop events.
	 * @property _AUDIO_SEEKED
	 * @type {String}
	 * @default seeked
	 * @static
	 * @private
	 */
	s._AUDIO_SEEKED = "seeked";

	/**
	 * Event constant for the "stalled" event for cleaner code.
	 * @property _AUDIO_STALLED
	 * @type {String}
	 * @default stalled
	 * @static
	 * @private
	 */
	s._AUDIO_STALLED = "stalled";

	/**
	 * Event constant for the "timeupdate" event for cleaner code.  Utilized for looping audio sprites.
	 * This event callsback ever 15 to 250ms and can be dropped by the browser for performance.
	 * @property _TIME_UPDATE
	 * @type {String}
	 * @default timeupdate
	 * @static
	 * @private
	 */
	s._TIME_UPDATE = "timeupdate";

	/**
	 * The capabilities of the plugin. This is generated via the {{#crossLink "HTMLAudioPlugin/_generateCapabilities"}}{{/crossLink}}
	 * method. Please see the Sound {{#crossLink "Sound/capabilities:property"}}{{/crossLink}} method for an overview of all
	 * of the available properties.
	 * @property _capabilities
	 * @type {Object}
	 * @private
	 * @static
	 */
	s._capabilities = null;


// Static Methods
	/**
	 * Determine if the plugin can be used in the current browser/OS. Note that HTML audio is available in most modern
	 * browsers, but is disabled in iOS because of its limitations.
	 * @method isSupported
	 * @return {Boolean} If the plugin can be initialized.
	 * @static
	 */
	s.isSupported = function () {
		s._generateCapabilities();
		return (s._capabilities != null);
	};

	/**
	 * Determine the capabilities of the plugin. Used internally. Please see the Sound API {{#crossLink "Sound/capabilities:property"}}{{/crossLink}}
	 * method for an overview of plugin capabilities.
	 * @method _generateCapabilities
	 * @static
	 * @private
	 */
	s._generateCapabilities = function () {
		if (s._capabilities != null) {return;}
		var t = document.createElement("audio");
		if (t.canPlayType == null) {return null;}

		s._capabilities = {
			panning:false,
			volume:true,
			tracks:-1
		};

		// determine which extensions our browser supports for this plugin by iterating through Sound.SUPPORTED_EXTENSIONS
		var supportedExtensions = createjs.Sound.SUPPORTED_EXTENSIONS;
		var extensionMap = createjs.Sound.EXTENSION_MAP;
		for (var i = 0, l = supportedExtensions.length; i < l; i++) {
			var ext = supportedExtensions[i];
			var playType = extensionMap[ext] || ext;
			s._capabilities[ext] = (t.canPlayType("audio/" + ext) != "no" && t.canPlayType("audio/" + ext) != "") || (t.canPlayType("audio/" + playType) != "no" && t.canPlayType("audio/" + playType) != "");
		}  // OJR another way to do this might be canPlayType:"m4a", codex: mp4
	};


// public methods
	p.register = function (loadItem) {
		var tag = createjs.HTMLAudioTagPool.get(loadItem.src);
		var loader = this.AbstractPlugin_register(loadItem);
		loader.setTag(tag);

		return loader;
	};

	p.removeSound = function (src) {
		this.AbstractPlugin_removeSound(src);
		createjs.HTMLAudioTagPool.remove(src);
	};

	p.create = function (src, startTime, duration) {
		var si = this.AbstractPlugin_create(src, startTime, duration);
		si.playbackResource = null;
		return si;
	};

	p.toString = function () {
		return "[HTMLAudioPlugin]";
	};

	// plugin does not support these
	p.setVolume = p.getVolume = p.setMute = null;


	createjs.HTMLAudioPlugin = createjs.promote(HTMLAudioPlugin, "AbstractPlugin");
}());
if(typeof module !== "undefined" && typeof module.exports !== "undefined") module.exports = this.createjs;