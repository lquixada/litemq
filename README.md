# LiteMQ
[![Build Status](https://travis-ci.org/lquixada/litemq.png?branch=master)](https://travis-ci.org/lquixada/litemq)

## Installation


## QuickStart

Put this somewhere in your code.

```javascript
var client1 = new LiteMQ.Client();

client1.sub('some-event', function (msg) {
	console.log('These are the headers:');
	console.log('Origin: '+msg.origin);
	console.log('Event Name: '+msg.eventName);

	console.log('This is the message:');
	console.log('User: '+msg.body.user);
	console.log('Age: '+msg.body.age);
});
```

And put this somewhere else in your code.

```javascript
var json = {name: 'John', age: 23},
	client2 = new LiteMQ.Client();

client2.pub('some-event', json);
```

It will output this on your console:

```
These are the headers:
Origin: anonymous
EventName: some-event

This is the message:
User: John
Age: 23
```

## Credits

This project is developed and maintained by Leonardo Quixada.
Licensed under the MIT License.

