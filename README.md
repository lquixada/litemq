# LiteMQ [![Build Status](https://travis-ci.org/lquixada/litemq.png?branch=master)](https://travis-ci.org/lquixada/litemq)

A light message-oriented middleware in Javascript based on Apache's ActiveMQ. LiteMQ is great for single-page apps since
it promotes loosely coupling between modules.

## Topics

* [Getting Started](#quickstart)
* [Documentation](https://github.com/lquixada/litemq/wiki/Documentation)
* [Benefits](#benefits)
* [Dependencies](#dependencies)
* **Projects using LiteMQ**
  * [MyTravis Chrome extension] (https://chrome.google.com/webstore/detail/my-travis/ddlafmkcenhiahiikbgjemcbdengmjbg)
  * [Lightplayer plugin](https://github.com/lquixada/lightplayer)
* [Credits & License](#credits)


## Getting Started

Add these tags to your page:

```html
<script src="o.min.js"></script>
<script src="litemq.min.js"></script>
```

Put this somewhere in your code:

```javascript
client1 = new LiteMQ.Client();
client1.sub('some-event', function (msg) {
	console.log('Name: '+msg.body.name);
	console.log('Age: '+msg.body.age);
});
```

And put this somewhere else in the same code:

```javascript
client2 = new LiteMQ.Client();
client2.pub('some-event', {name: 'John', age: 23});
```

It will output this on your console:

```
Name: John
Age: 23
```


## Benefits

* Easier to test (since it has fewer dependencies)
* Easier to develop modules (since different developers can implement different modules at the same time)
* Easier to maintain (since you're not dealing with big monolithic code)


## Dependencies

LiteMQ has only one dependency: [the O framework](https://github.com/lquixada/o). This is intentional since
LiteMQ is designed to be extensible. If you disagree with the implementation you can extend the Client class
and implement your own logic.


## Credits & License

Copyright (c) 2013 Leonardo Quixada ([@lquixada](http://twitter.com/lquixada)). This software is licensed under the MIT License.

