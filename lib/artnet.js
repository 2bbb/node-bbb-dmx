const bbb = require('bit-by-bit');
const artnet = require('artnet-node');

class Clients {
    constructor(ip = '127.0.0.1', opt = {}) {
        this.private = {
            ip,
            port: opt.port || 6454,
            size: opt.size || 512,
            fps:  opt.fps  || 40,
            ticks: {}
        };

        if(opt.buffer) {
            this.private.data = opt.buffer;
        } else {
            this.private.data = [];
            for(let i = 0; i < this.size; i++) this.data.push(0);
        }

        this.private.client = artnet.Client.createClient(this.ip, this.port);
        this.start();
    }

    get ip() { return this.private.ip; }
    get port() { return this.private.port; }
    get data() { return this.private.data; }
    set data(data) {
        if(!data) return;
        
        const length = Math.min(data.length, this.data.length);
        for(let i = 0; i < length; ++i) this.data[i] = data[i];
    }
    get size() { return this.private.size; }
    get fps() { return this.private.fps; }
    get interval() { return (this.private.fps == 0) ? 25 : 1000 / this.private.fps; }
    set fps(fps) {
        this.private.fps = fps;
        if(this.isSending) this.start();
    }
    get client() { return this.private.client; }
    get isSending() { return !!this.private.timer; }

    start() {
        this.stop();
        this.private.timer = setInterval(() => {
            this.send();
        }, this.interval);
    }

    stop() {
        if(this.private.timer) clearInterval(this.private.timer);
        this.private.timer = null;
    }

    send(data) {
        if(data) this.data = data;
        this.client.send(this.data);
        const now = new Date();
        bbb.functional.object.forEach(this.private.ticks, ({callback, name, context, start}, key) => {
            callback(
                (now - start) * 0.001,
                () => { this.removeTick(name); },
                context
            );
        });
    }

    // callback: (elapsed, done, context)
    addTick(name, callback, context) {
        this.private.ticks[name] = {
            name,
            callback,
            context,
            start: new Date()
        };
    }
    getTick(name) {
        return this.private.ticks[name];
    }
    removeTick(name) {
        if(this.private.ticks[name]) delete this.private.ticks[name];
    }

    static create(ip, port) {
        return new Clients(ip, port);
    }
};

module.exports = {
    Clients
};
