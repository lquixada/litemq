describe("LiteMQ", function() {
	describe("Client", function() {
		it("should subscribe to and publish an event", function() {
			var
				client1 = new LiteMQ.Client(),
				client2 = new LiteMQ.Client();

			client1.sub('event', function () {
				this.counter = 1;
			});
			
			client2.sub('event', function () {
				this.counter = 1;
			});

			client2.pub('event');

			expect(client1.counter).toBe(1);
			expect(client2.counter).not.toBe(1);
		});

		it("should send a copy of message", function() {
			var
				msg = { content: 'message' },
				client1 = new LiteMQ.Client(),
				client2 = new LiteMQ.Client();

			client1.sub('event', function (msg) {
				this.msg = msg;
			});

			client2.pub('event', msg);

			expect(client1.msg).not.toBe(msg);
			expect(client1.msg.content).toBe(msg.content);
		});

		describe("unsubscribe", function(){
			it("listener", function() {
				var
					client1 = new LiteMQ.Client(),
					client2 = new LiteMQ.Client(),
					callbackA = function() { this.count=1; },
					callbackB = function() { this.count=2; };

				client1.sub('event', callbackA);
				client1.sub('event', callbackB);

				client1.unsub('event', callbackB);

				client2.pub('event');

				expect(client1.count).toBe(1);
			});

			it("event", function() {
				var
					client1 = new LiteMQ.Client(),
					client2 = new LiteMQ.Client();

				client1.sub('event', function () {
					this.count = 1;
				});

				client1.unsub('event');

				client2.pub('event');

				expect(client1.count).not.toBe(1);
			});
			
			it("everything", function() {
				var
					client1 = new LiteMQ.Client(),
					client2 = new LiteMQ.Client();

				client1.count = 0;

				client1.sub('event', function () {
					this.count = 1;
				});
				
				client1.sub('event', function () {
					this.count = 2;
				});

				client1.unsub();

				client2.pub('event');

				expect(client1.count).toBe(0);
			});	
		});
	});
});

