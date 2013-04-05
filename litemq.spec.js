describe("LiteMQ", function() {
	describe("Client", function() {
		it("has a name", function() {
			var
				client1 = new LiteMQ.Client({name: 'Tester'}),
				client2 = new LiteMQ.Client();
			
			expect(client1.name).toBe('Tester');
			expect(client2.name).toBe('anonymous');
		});
		
		it("subscribes to and publish an event", function () {
			var
				client1 = new LiteMQ.Client(),
				client2 = new LiteMQ.Client();

			client1.sub('event', function () {
				this.count = 1;
			});
			
			client2
				.sub('event', function () {
					this.count = 1;
				})
				.pub('event');

			expect(client1.count).toBe(1);
			expect(client2.count).not.toBe(1);
		});

		it("subscribes to and publishes multiple events", function () {
			var
				client1 = new LiteMQ.Client(),
				client2 = new LiteMQ.Client();

			client1.count = 0;
			client1.sub(['event1', 'event2', 'event3'], function () {
				this.count++;
			});
			
			client2.pub(['event1', 'event3']);

			expect(client1.count).toBe(2);

			client1.unsub(['event1', 'event3']);

			client2.pub(['event1', 'event3']);

			// it must remain 2
			expect(client1.count).toBe(2);
		});

		it("sends and receives message", function () {
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

		describe("unsubscribes", function () {
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

		describe("Bus", function() {
			it("can be different among clients", function() {
					var
						bus1 = new LiteMQ.Bus({name: 'Bus1'}),
						bus2 = new LiteMQ.Bus({name: 'Bus2'}),
						clientA = new LiteMQ.Client({bus: bus1}),
						clientB = new LiteMQ.Client({bus: bus2}),
						clientC = new LiteMQ.Client({bus: bus2});
				
					clientA.count = 0;
					clientA.sub('event', function () {
						this.count = 1;
					});

					clientB.count = 0;
					clientB.sub('event', function () {
						this.count = 1;
					});

					clientC.pub('event');

					expect(clientA.count).toBe(0);
					expect(clientB.count).toBe(1);
			});
		});
		
	});

});

