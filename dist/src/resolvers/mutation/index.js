"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
const addAgent_1 = require("./addAgent");
const alterAgent_1 = require("./alterAgent");
const deleteAgent_1 = require("./deleteAgent");
const deleteAgents_1 = require("./deleteAgents");
exports.Mutation = {
    addAgent: addAgent_1.addAgent,
    alterAgent: alterAgent_1.alterAgent,
    deleteAgent: deleteAgent_1.deleteAgent,
    deleteAgents: deleteAgents_1.deleteAgents,
};
//# sourceMappingURL=index.js.map