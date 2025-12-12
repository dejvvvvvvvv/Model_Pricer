
/** Copyright 2014-2023 Stewart Allen -- All Rights Reserved */

"use strict";

(function() {

    if (!self.kiri) {
        return;
    }

    function Client(worker) {
        this.worker = worker;
        this.seq = 1;
        this.waiting = {};
        this.onmessage = this.onmessage.bind(this);
    }

    Client.prototype.send = function(f, data, direct) {
        let msg = {
            f: f,
            seq: this.seq++,
            data: data
        };
        kiri.send_to_work(msg, direct);
        return this;
    };

    Client.prototype.onmessage = function(e) {
        let msg = e.data,
            f = msg.f,
            seq = msg.seq,
            data = msg.data;

        if (f === 'ack') {
            let waiting = this.waiting[seq];
            if (waiting) {
                if (waiting.resolve) {
                    waiting.resolve(data);
                } else {
                    waiting(data);
                }
                delete this.waiting[seq];
            }
            return;
        }

        if (f === 'init_done') {
            kiri.init_done.forEach(f => f());
            kiri.init_done = [];
            return;
        }

        if (f && f.indexOf("kiri.api") === 0) {
            let api = kiri.api,
                o = api,
                lo = null,
                lf = null;

            f.split('.').slice(1).forEach(function(k) {
                lo = o;
                o = o[k];
                lf = k;
            });

            lo[lf](data);
        } else {
            console.log("client received unknown message", msg);
        }
    }

    Client.prototype.promise = function(f, data, direct) {
        return new Promise((resolve, reject) => {
            this.waiting[this.seq] = { resolve, reject };
            this.send(f, data, direct);
        });
    }

    Client.prototype.buttons = function(buttons) {
        return this.send("buttons", buttons);
    }

    Client.prototype.setMode = function(mode, ondone) {
        return this.promise("setMode", mode).then(ondone);
    }

    Client.prototype.setDevice = function(device, ondone) {
        return this.promise("setDevice", device).then(ondone);
    }

    Client.prototype.setProcess = function(process, ondone) {
        return this.promise("setProcess", process).then(ondone);
    }

    Client.prototype.getDevice = function(ondone) {
        return this.promise("getDevice").then(ondone);
    }

    Client.prototype.getProcess = function(ondone) {
        return this.promise("getProcess").then(ondone);
    }

    Client.prototype.parse = function(data, ondone) {
        return this.promise("parse", data, [data.buffer]).then(ondone);
    }

    Client.prototype.slice = function(ondone) {
        return this.promise("slice").then(ondone);
    }

    Client.prototype.prepare = function(ondone) {
        return this.promise("prepare").then(ondone);
    }

    Client.prototype.export = function(ondone) {
        return this.promise("export").then(ondone);
    }

    Client.prototype.colors = function(colors, ondone) {
        return this.promise("colors", colors).then(ondone);
    }

    Client.prototype.image = function(options, ondone) {
        return this.promise("image", options).then(ondone);
    }

    Client.prototype.clear = function() {
        return this.send("clear");
    }

    kiri.Client = Client;

})();

(function() {

    if (!self.kiri) {
        return;
    }

    function Server(worker) {
        this.worker = worker;
        this.onmessage = this.onmessage.bind(this);
    }

    Server.prototype.send = function(f, data, seq, direct) {
        let msg = {
            f: f,
            seq: seq,
            data: data
        };
        if (direct) {
            this.worker.postMessage(msg, direct);
        } else {
            this.worker.postMessage(msg);
        }
        return this;
    }

    Server.prototype.onmessage = function(e) {
        let msg = e.data,
            api = kiri.api,
            f = msg.f,
            data = msg.data,
            seq = msg.seq;

        if (f === 'init') {
            kiri.version = data.version;
            kiri.beta = data.beta;
            kiri.init_work.forEach(f => f());
            kiri.init_work = [];
            this.send('init_done');
            return;
        }

        let o = api, lo = null, lf = null;
        f.split('.').slice(1).forEach(function(k) {
            if (o) {
                lo = o;
                o = o[k];
                lf = k;
            }
        });

        if (o) {
            let r = o.apply(lo, [data, function(reply, direct) {
                this.send('ack', reply, seq, direct);
            }.bind(this)]);
            if (r) this.send('ack', r, seq);
        } else {
            console.log("server received unknown message", msg);
        }
    }

    kiri.Server = Server;

})();

// a bare-bones api structure for server-side functions
self.kiri.api = {
    version: function() {
        return kiri.version;
    },

    setMode: function(mode, send) {
        // to be overridden
    },

    setDevice: function(device, send) {
        // to be overridden
    },

    setProcess: function(process, send) {
        // to be overridden
    },

    getDevice: function(send) {
        // to be overridden
    },

    getProcess: function(send) {
        // to be overridden
    },

    parse: function(data, send) {
        // to be overridden
    },

    slice: function(ondone) {
        // to be overridden
    },

    prepare: function(ondone) {
        // to be overridden
    },

    export: function(ondone) {
        // to be overridden
    },

    image: function(options, ondone) {
        // to be overridden
    },

    clear: function() {
        // to be overridden
    },

    buttons: function(buttons) {
        // to be overridden
    },

    colors: function(colors) {
        // to be overridden
    }
};
