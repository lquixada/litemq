# LiteMQ [![Build Status](https://travis-ci.org/lquixada/litemq.png?branch=master)](https://travis-ci.org/lquixada/litemq)

## Installation

## QuickStart

Put this somewhere in your code.

```javascript
client1 = new LiteMQ.Client();
client1.sub('some-event', function (msg) {
	console.log('Name: '+msg.body.name);
	console.log('Age: '+msg.body.age);
});
```

And put this somewhere else in your code.

```javascript
client2 = new LiteMQ.Client();
client2.pub('some-event', {name: 'John', age: 23});
```

It will output this on your console:

```
Name: John
Age: 23
```

## Documentation

### new LiteMQ.Client(options)

Instantiates a client that will interact with the deafult LiteMQ bus.

* **options** is an object whose properties will be copied to the instance.

```javascript
client = new LiteMQ.Client({name: 'FormUser', count: 0});
client.name  // Outputs: 'FormUser'
client.count // Outputs: 0
```


### client.sub(events, callback)

Subscribes to an event and, when it's triggered, executes the callback function.

* **events** can be a string or an array of strings.
* **callback** a function to be invoked when the event happens which receives a message with headers and body as argument.

```javascript
// Subscribes a listener to an event
client.count = 0;
client.sub('some-event', function () {
	this.count++; // "this" refers to the client object
});
```


### client.pub(events [, message])

Publishes an event to all clients that are listening to it with an optional message.

* **events** can be a string or an array of strings.
* **message** can be anything: from boolean to an object (altough functions are not recommended).

```javascript
client.pub('some-event');                        // Publishes an event with no message
client.pub('some-event', 123);                   // Publishes a number as message
client.pub('some-event', 'text');                // Publishes a string as message
client.pub('some-event', {user:'John', age:23}); // Publishes an object as message
```


### client.unsub([events [,callback]]):

Unsubscribe an event and when it happens executes the callback function.

* **events** can be a string or an array of strings.
	
```javascript
client.unsub('some-event', listener); // Unsubscribe only the specified listener attached to the specified client's event
client.unsub('some-event');           // Unsubscribe all listeners attached to the specified client's event
client.unsub();                       // Unsubscribe all listeners attached to all client's events
```


### client.disable(events)

Disables all listeners temporally.

* **events** can be a string or an array of strings.

```javascript
client.disable('some-event'); // Disables all listeners attached to the event temporally
```


### client.enable(events)

Enables event listeners that were disable.

* **events** can be a string or an array of strings.

```javascript
client.enable('some-event'); // Enables all listeners attached to the event that has been disabled
```


### Shortcuts

#### Chaining

All client's methods return the client itself for chaining purposes. For instance, this:

```transcript
client.pub('some-event');
client.pub('other-event');
```

can be written like this:

```transcript
client.pub('some-event').pub('other-event');
```


#### Multiple events

In any method you see an **events** argument, you can supply an array of strings. For instance, this:

```transcript
client.pub('some-event');
client.pub('other-event');
```

can be written like this:

```transcript
client.pub(['some-event','other-event']);
```


## Who's using LiteMQ

* [MyTravis Chrome extension] (https://chrome.google.com/webstore/detail/my-travis/ddlafmkcenhiahiikbgjemcbdengmjbg)
* [Lightplayer plugin](https://github.com/lquixada/lightplayer)


## Credits

This project is developed and maintained by Leonardo Quixada.
Licensed under the MIT License.

