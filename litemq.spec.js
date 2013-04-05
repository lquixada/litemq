describe("LiteMQ", function() {
	describe("Client", function() {
		it("should have a name", function() {
			var
				client1 = new LiteMQ.Client({name: 'Tester'}),
				client2 = new LiteMQ.Client();
			
			expect(client1.name).toBe('Tester');
			expect(client2.name).toBe('anonymous');
		});
		
		it("should subscribe to and publish an event", function () {
			var
				client1 = new LiteMQ.Client(),
				client2 = new LiteMQ.Client();

			client1.sub('event', function () {
				this.counter = 1;
			});
			
			client2
				.sub('event', function () {
					this.counter = 1;
				})
				.pub('event');

			expect(client1.counter).toBe(1);
			expect(client2.counter).not.toBe(1);
		});

		it("should send and receive message", function () {
			var
				message,
				client1 = new LiteMQ.Client(),
				client2 = new LiteMQ.Client({name: 'Client2'});

			client1.sub('event', function (msg) {
				message = msg;
			});

			client2.pub('event', {user: 'John'});

			expect(message.origin).toBe('Client2');
			expect(message.body.user).toBe('John');
		});

		describe("unsubscribe", function () {
			it("listener", function () {
				var
					client1 = new LiteMQ.Client(),
					client2 = new LiteMQ.Client(),
					callbackA = function () { this.count=1; },
					callbackB = function () { this.count=2; };

				client1
					.sub('event', callbackA)
					.sub('event', callbackB)
					.unsub('event', callbackB);

				client2.pub('event');

				expect(client1.count).toBe(1);
			});

			it("event", function() {
				var
					client1 = new LiteMQ.Client(),
					client2 = new LiteMQ.Client();

				client1
					.sub('event', function () {
						this.count = 1;
					})
					.unsub('event');

				client2.pub('event');

				expect(client1.count).not.toBe(1);
			});
			
			it("everything", function() {
				var
					client1 = new LiteMQ.Client(),
					client2 = new LiteMQ.Client();

				client1.count = 0;

				client1
					.sub('event', function () {
						this.count = 1;
					})
					.sub('event', function () {
						this.count = 2;
					})
					.unsub();

				client2.pub('event');

				expect(client1.count).toBe(0);
			});
		});
	});
});

