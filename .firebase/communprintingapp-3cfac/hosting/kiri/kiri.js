
/** Copyright 2014-2023 Stewart Allen -- All Rights Reserved */

"use strict";

(function() {

    if (self.kiri) {
        return;
    }

    const KIRI = self.kiri = {
        beta: 2,
        version: 200,
        driver: {}, // driver modules
        worker: null, // worker thread
        client: null, // client connection
        server: null, // server connection
        license: null, // license object
        init_work: [], // functions to run on work init
        init_done: [], // functions to run on init done
        send_to_work: send_to_work,
    };

    function send_to_work(msg, direct) {
        if (direct) {
            KIRI.worker.postMessage(msg, direct);
        } else {
            KIRI.worker.postMessage(msg);
        }
    }

    // start worker and connect to it
    function start_worker() {
        let worker = KIRI.worker = new Worker(`/kiri/kiri_work.js?${KIRI.version}`);
        let client = KIRI.client = new kiri.Client(worker);
        worker.onmessage = client.onmessage;
        client.send("init", {
            version: KIRI.version,
            beta: KIRI.beta
        });
    }

    // connect to remote worker and start client
    function start_remote_worker(remote) {
        let worker = KIRI.worker = remote;
        let client = KIRI.client = new kiri.Client(worker);
        worker.onmessage = client.onmessage;
        client.send("init", {
            version: KIRI.version,
            beta: KIRI.beta
        });
    }

    // establish a new client connection
    function start_client(worker) {
        if (self.kiri.client) {
            console.log("client already started");
            return;
        }
        // if no worker, start a new one
        if (!worker) {
            start_worker();
            return;
        }
        // if worker is a string, it's a remote worker
        if (typeof(worker) === 'string') {
            start_remote_worker(new Worker(worker));
            return;
        }
        // if worker is a worker, use it
        if (worker instanceof Worker) {
            start_remote_worker(worker);
            return;
        }
        throw "invalid worker";
    }

    function start_server(worker) {
        if (self.kiri.server) {
            console.log("server already started");
            return;
        }
        let server = KIRI.server = new kiri.Server(worker || self);
        self.onmessage = server.onmessage;
    }

    // common starting point for all kiri browser-side apps
    async function init(options) {
        KIRI.license = await fetch("/kiri/license.json").then(r => r.json());
        if (!self.kiri.client) {
            start_client();
        }
    }

    KIRI.init = init;
    KIRI.start_client = start_client;
    KIRI.start_server = start_server;

})();
