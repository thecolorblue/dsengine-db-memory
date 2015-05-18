var _ = require("lodash");

var memory = function(docId, clientId) {
  return {
    type: "memory",

    exists: function(cb) {
      cb(null, (memory.shadows[clientId + docId]) ? true : false);
    },

    get: function(cb) {
      var ret = {};

      if (memory.contents[docId]) {
        _.extend(ret, { contents: memory.contents[docId] });
      }
      if (memory.shadows[clientId + docId]) {
        _.extend(ret, { shadow: memory.shadows[clientId + docId] });
      }

      process.nextTick(function() {
        cb(null, ret);
      });
    },

    set: function(updateData, cb) {
      memory.shadows[clientId + docId] = memory.shadows[clientId + docId] || {};
      var shadow = memory.shadows[clientId + docId];

      if (updateData.contents && updateData.contents.length > 0) {
        memory.contents[docId] = updateData.contents;
      }

      if (updateData.shadow) {
        shadow.text = updateData.shadow.text;
        shadow.clientVersion = updateData.shadow.clientVersion;
        shadow.serverVersion = updateData.shadow.serverVersion;
      }

      process.nextTick(function() {
        cb(null, {
          contents: memory.contents[docId],
          shadow: shadow
        });
      });
    },

    clear: function(cb) {
      delete memory.contents[docId];
      delete memory.shadows[clientId + docId];
      delete memory.editStacks[clientId + docId];

      cb(null);
    },

    saveEditStack: function(editStack, cb) {
      memory.editStacks[clientId + docId] = editStack;
      cb(null, memory.editStacks[clientId + docId]);
    },

    getEditStack: function(cb) {
      cb(null, memory.editStacks[clientId + docId]);
    }
  };
};

memory.contents = {};
memory.shadows = {};
memory.editStacks = {};

module.exports = memory;
