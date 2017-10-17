"use strict";
const assert = require("assert");
const fs = require("fs");
const spawnSync = require("child_process").spawnSync;

const semver = require("semver");

const mockYarnBinPath = "test/mock-yarn";
const testYarnBinPath = "test/yarn";

const commandBin = "bin/bundled-yarn-updater";

// copy across mock yarn binary so we don't accidentally commit the updated copy
const copyTask = spawnSync("cp", [mockYarnBinPath, testYarnBinPath], {
  encoding: "utf8"
});
assert.strictEqual(copyTask.status, 0);

// run the update task
const updateTask = spawnSync(commandBin, [testYarnBinPath], {
  encoding: "utf8"
});

assert.strictEqual(
  updateTask.status,
  0,
  "update task should exit with code of 0"
);

const newYarnVersionTask = spawnSync(testYarnBinPath, ["--version"], {
  encoding: "utf8"
});

assert.strictEqual(
  newYarnVersionTask.status,
  0,
  "yarn version should exit with code 0"
);
assert.ok(
  semver.gt(newYarnVersionTask.stdout.trim(), "0.0.0"),
  "new yarn version should be greater than mock versions"
);
