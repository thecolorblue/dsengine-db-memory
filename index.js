/**
 *
 * To use this library:
 *
 * var DseServer = require("dsengine").Server;
 * var dseMemory = require("dsengine-db-memory");
 * var server = new DseServer({ docId: "1", clientId: "A", db: dseMemory })
 */
module.exports = require("./lib/memory");
