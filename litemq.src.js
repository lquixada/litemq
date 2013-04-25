var LiteMQ = {
	version: '@VERSION',
	debugMode: false,

	utils: {
		convertToArray: function (obj) {
			if (Object.prototype.toString.call(obj)==='[object Array]') {
				return obj;
			}

			return [obj];
		},

		copy: function (obj) {
			if (obj) {
				return JSON.parse(JSON.stringify(obj));	
			}

			return obj;
		},

		each: function (arr, fn, context) {
			arr = LiteMQ.convertToArray(arr);

			for (var i = 0; i < arr.length; i++) {
				fn.call(context || null, arr[i], i);
			}
		}
	},

	logger: {
		log: function (obj) {
			if (typeof console !== 'undefined' && console.log) {
				console.log(obj);
			}
		},

		debug: function (origin, msg) {
			if (LiteMQ.debugMode) {
				this.log([
					'# DEBUG MODE ON',
					'# Bus: '+origin.bus.name,
					'# Origin: '+origin.name,
					'# Event: '+msg.eventName,
					'# Body: '
				].join('\n'));
				this.log(msg.body);
				this.log('#########################');
			}
		}
	},

	convertToArray: function (obj) {
		return this.utils.convertToArray(obj);
	},

	copy: function (obj) {
		return this.utils.copy(obj);
	},

	debug: function (origin, msg) {
		this.logger.debug(origin, msg);
	},

	each: function (arr, fn, context) {
		this.utils.each(arr, fn, context);
	}
};


LiteMQ.Bus = o.Class({
	attach: function (evts, dest, fn) {
		var that = this;

		LiteMQ.each(evts, function (evt) {
			that._addEventListener(evt, [dest, fn]);
		});
	},

	clear: function () {
		this._resetListeners();
	},

	detach: function (evts, origin, fn) {
		var that = this;

		if (evts) {
			LiteMQ.each(evts, function (evt) {
				if (fn) {
					that._detachListener(evt, origin, fn);
				} else {
					that._detachEvent(evt, origin);
				}
			});
		} else {
			this._detachAll(origin);
		}
	},

	init: function (opt) {
		this.name = 'AnonymousBus';
		this._super(opt);
		this._listeners = {};
	},

	trigger: function (evts, origin, data) {
		var that = this;

		LiteMQ.each(evts, function (evt) {
			var msg = {
				busName: origin.bus.name,
				originName: origin.name,
				eventName: evt,
				body: LiteMQ.copy(data)
			};

			LiteMQ.debug(origin, msg);

			that._filterEventListener(evt, function (dest, fn) {
				if (dest !== origin) {
					fn.call(dest, msg);
				}

				return true;
			});
		});
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
	
	_filterEventListener: function (evt, fn) {
		var
			listeners = this._getEventListeners(evt),
			filtered = [];

		LiteMQ.each(listeners, function (listener) {
			if (fn(listener[0], listener[1])) {
				filtered.push([listener[0], listener[1]]);
			}
		});

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
	},

	_resetListeners: function () {
		this._listeners = {};
	}
});

LiteMQ.DefaultBus = new LiteMQ.Bus({name: 'DefaultBus'});


LiteMQ.Client = o.Class({
	disable: function (evt) {
		var that = this;

		LiteMQ.each(this.listeners, function (listener) {
			if (!listener.enabled) {
				return;
			}

			if (listener.evt===evt || !evt) {
				listener.enabled = false;
				that._detach(listener.evt, listener.fn);
			}
		});
	},

	enable: function (evt) {
		var that = this;

		LiteMQ.each(this.listeners, function (listener) {
			if (listener.enabled) {
				return;
			}

			if (listener.evt===evt || !evt) {
				listener.enabled = true;
				that._attach(listener.evt, listener.fn);
			}
		});
	},

	init: function (opt) {
		this.bus = LiteMQ.DefaultBus;
		this.name = 'anonymous';

		this._super(opt);
		this.listeners = [];
	},

	pub: function (evt, data) {
		this.bus.trigger(evt, this, data);

		return this;
	},

	sub: function (evts, fn) {
		var that = this;

		LiteMQ.each(evts, function (evt) {
			that._attach(evt, fn);
			that.listeners.push({evt: evt, fn: fn, enabled: true});	
		});
		
		return this;
	},

	unsub: function (evt, fn) {
		this._detach(evt, fn);

		return this;
	},

	// private

	_attach: function (evt, fn) {
		this.bus.attach(evt, this, fn);	
	},

	_detach: function (evt, fn) {
		this.bus.detach(evt, this, fn);	
	}
});
