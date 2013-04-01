var LiteMQ = {
	attach: function (evt, dest, fn) {
		this._addEventListener(evt, [dest, fn]);
	},

	detach: function (evt, origin, fn) {
		if (evt) {
			if (fn) {
				this._detachListener(evt, origin, fn);
			} else {
				this._detachEvent(evt, origin);
			}
		} else {
			this._detachAll(origin);
		}
	},

	trigger: function (evt, origin, data) {
		this._eachEventListener(evt, function (dest, fn) {
			if (dest !== origin) {
				fn.call(dest, data);
			}
		});
	},

	// private
	
	_listeners: [],

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
		var result = [];

		this._eachEventListener(evt, function (dest, func) {
			if (origin !== dest) {
				result.push([dest, func]);
			}
		});

		this._setEventListeners(evt, result);
	},

	_detachListener: function (evt, origin, fn) {
		var result = [];

		this._eachEventListener(evt, function (dest, func) {
			if (!(origin === dest && fn === func)) {
				result.push([dest, func]);
			}
		});

		this._setEventListeners(evt, result);
	},
	
	_eachEventListener: function (evt, callback) {
		var listener,
			listeners = this._getEventListeners(evt);

		for (var i = 0; i < listeners.length; i++) {
			listener = listeners[i];
			callback(listener[0], listener[1]);
		}
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
};

LiteMQ.Client = o.Class({
	init: function (opt) {
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

		LiteMQ.trigger(evt, this, msg);
	},

	sub: function (evt, fn) {
		LiteMQ.attach(evt, this, fn);
	},

	unsub: function (evt, fn) {
		LiteMQ.detach(evt, this, fn);
	}
});
