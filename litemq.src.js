var LiteMQ = {
	version: '<version>',
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
		LiteMQ.each(evts, function (evt) {
			this._addEventListener(evt, [dest, fn]);
		}, this);
	},

	detach: function (evts, origin, fn) {
		if (evts) {
			LiteMQ.each(evts, function (evt) {
				if (fn) {
					this._detachListener(evt, origin, fn);
				} else {
					this._detachEvent(evt, origin);
				}
			}, this);
		} else {
			this._detachAll(origin);
		}
	},

	init: function (opt) {
		this._super(opt);
		this._listeners = {};
	},

	trigger: function (evts, origin, msg) {
		LiteMQ.each(evts, function (evt) {
			msg.eventName = evt;

			LiteMQ.debug(origin, msg);

			this._filterEventListener(evt, function (dest, fn) {
				try {
					if (dest !== origin) {
						fn.call(dest, msg);
					}

					return true;
				} catch (err) {
					// if dest raises an error, it should be detached
					// Hence, not returning true
					console.log(err);
				}
			});
		}, this);
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
	}
});

LiteMQ.DefaultBus = new LiteMQ.Bus({name: 'DefaultBus'});


LiteMQ.Client = o.Class({
	disable: function (evt) {
		// transfer from enabled to disabled those who satisfies
		// the function
		this.transfer('enabled', 'disabled', function (eventName, fn) {
			if (eventName===evt) {
				this.unsub(eventName, fn);
				return true;
			}
		})
	},

	enable: function (evt) {
		// transfer from disabled to enabled those who satisfies
		// the function
		this.transfer('disabled', 'enabled', function (eventName, fn) {
			if (eventName===evt) {
				this.sub(eventName, fn);
				return true;
			}
		})
	},

	transfer: function (target, source, fn) {
		// make a copy of target
		var	target = this[target].slice();
		
		// Empty target to do the filtering
		this[target] = [];

		LiteMQ.each(target, function (subs) {
			if (fn.call(this, subs.evt, subs.fn)) {
				this[source].push(subs);
			} else {
				this[target].push(subs);
			}
		}, this);
	},

	init: function (opt) {
		this.bus = LiteMQ.DefaultBus;
		this.name = 'anonymous';

		this._super(opt);
		this.enabled = [];
		this.disabled = [];
	},

	pub: function (evt, data) {
		var msg = {
			origin: this.name,
			body: LiteMQ.copy(data)
		};

		this.bus.trigger(evt, this, msg);

		return this;
	},

	sub: function (evts, fn) {
		LiteMQ.each(evts, function (evt) {
			this.bus.attach(evt, this, fn);
			this.enabled.push({evt: evt, fn: fn});	
		}, this);
		
		return this;
	},

	unsub: function (evt, fn) {
		this.bus.detach(evt, this, fn);

		return this;
	}
});
