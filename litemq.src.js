var LiteMQ = {
	utils: {
			convertToArray: function (object) {
			if (Object.prototype.toString.call(object)==='[object Array]') {
				return object;
			}

			return [object];
		}
	}
};


LiteMQ.Bus = o.Class({
	attach: function (evt, dest, fn) {
		var events = LiteMQ.utils.convertToArray(evt);

		for (var i = 0; i < events.length; i++) {
			this._addEventListener(events[i], [dest, fn]);
		}
	},

	detach: function (evt, origin, fn) {
		var events;

		if (evt) {
			events = LiteMQ.utils.convertToArray(evt);
			
			for (var i = 0; i < events.length; i++) {
				if (fn) {
					this._detachListener(events[i], origin, fn);
				} else {
					this._detachEvent(events[i], origin);
				}
			}
		} else {
			this._detachAll(origin);
		}
	},

	init: function () {
		this._listeners = {};
	},

	trigger: function (evt, origin, data) {
		var events = LiteMQ.utils.convertToArray(evt);

		for (var i = 0; i < events.length; i++) {
			this._filterEventListener(events[i], function (dest, fn) {
				try {
					if (dest !== origin) {
						fn.call(dest, data);
					}

					return true;
				} catch (err) {
					// if dest raises an error, it should be detached
					// Hence, not returning true
					console.log(err);
				}
			});
		}
	},

	// private

	_addEventListener: function (evt, listener) {
		var listeners = this._getEventListeners(evt);

		listeners.push(listener);
	},

	_detachAll: function (origin) {
		var listeners = this._getListeners();

		for (var evt in listeners) {
			this._detachEvent(evt, origin);
		}
	},

	_detachEvent: function (evt, origin, fn) {
		this._filterEventListener(evt, function (dest, func) {
			if (origin !== dest) {
				return true;
			}
		});
	},

	_detachListener: function (evt, origin, fn) {
		this._filterEventListener(evt, function (dest, func) {
			if (!(origin === dest && fn === func)) {
				return true;
			}
		});
	},
	
	_filterEventListener: function (evt, callback) {
		var listener,
			listeners = this._getEventListeners(evt),
			filtered = [];

		for (var i = 0; i < listeners.length; i++) {
			listener = listeners[i];

			if (callback(listener[0], listener[1])) {
				filtered.push([listener[0], listener[1]]);
			}
		}

		this._setEventListeners(evt, filtered);
	},

	_getEventListeners: function (evt) {
		var listeners = this._listeners[evt] || [];
		
		this._setEventListeners(evt, listeners);

		return this._listeners[evt];
	},

	_getListeners: function () {
		return this._listeners;
	},

	_setEventListeners: function (evt, listeners) {
		this._listeners[evt] = listeners;
	}
});

LiteMQ.DefaultBus = new LiteMQ.Bus();


LiteMQ.Client = o.Class({
	init: function (opt) {
		this.bus = LiteMQ.DefaultBus;
		this.name = 'anonymous';

		this._super(opt);
	},

	pub: function (evt, data) {
		var msg = {};

		if (typeof data === 'object') {
			data = JSON.parse(JSON.stringify(data));
		}

		msg.origin = this.name;
		msg.body = data;

		this.bus.trigger(evt, this, msg);

		return this;
	},

	sub: function (evt, fn) {
		this.bus.attach(evt, this, fn);
		
		return this;
	},

	unsub: function (evt, fn) {
		this.bus.detach(evt, this, fn);

		return this;
	}
});
