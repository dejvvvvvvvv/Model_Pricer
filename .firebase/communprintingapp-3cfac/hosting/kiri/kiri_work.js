
/** Copyright 2014-2023 Stewart Allen -- All Rights Reserved */

"use strict";

(function() {

    let self = this,
        kiri = self.kiri = {},
        loc = self.location,
        host = loc.host.split(':')[0],
        port = loc.port,
        proto = loc.protocol;

    if (self.window) {
        // running in browser
        return;
    }

    if (host === '' || host === 'localhost') {
        // could be a worker
    } else {
        // don't load support scripts
        return;
    }

    if (self.document) {
        // running in browser main thread
        return;
    }

    try {
        kiri.version = 0;
        kiri.beta = 0;
        kiri.init_work = [];

        self.onmessage = function(e) {
            kiri.server.onmessage(e);
        };

        importScripts(
            `/kiri/license.js?${kiri.version}`,
            `/kiri/moto.js?${kiri.version}`,
            `/kiri/engine.js?${kiri.version}`
        );

        kiri.start_server();

    } catch (e) {
        console.log("worker scope missing objects or failed to load scripts");
        // self.postMessage({ error: "worker scope missing objects"});
        // self.close();
    }

})();
