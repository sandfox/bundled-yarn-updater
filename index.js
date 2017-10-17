"use strict";

/**
 * updates the bundled version of yarn
 * does not (yet) verify the gpg sigs / checksums...
 */

const fs = require("fs");
const path = require("path");
const spawnSync = require("child_process").spawnSync;
const fetch = require("node-fetch");
const semver = require("semver");

const releaseUrl = "https://api.github.com/repos/yarnpkg/yarn/releases/latest";
const bundleHintBlogLink =
  "https://yarnpkg.com/blog/2016/11/24/offline-mirror/#did-you-know-that-yarn-is-also-distributed-as-a-single-bundle-js-file-in-releaseshttpsgithubcomyarnpkgyarnreleases-that-can-be-used-on-ci-systems-without-internet-access";

module.exports = yarnBinPath => {
  // Grab the current local version
  const getLocalYarnVersion = () =>
    spawnSync(yarnBinPath, ["--version"], { encoding: "utf8" }).stdout.trim();

  fetch(releaseUrl)
    .then(res => {
      return res.json();
    })
    .then(payload => {
      const remoteVersion = payload.tag_name.replace("v", "");
      const localVersion = getLocalYarnVersion();

      console.log(`currently installed version: ${localVersion}`);
      console.log(`latest released version: ${remoteVersion}`);

      if (!semver.gt(remoteVersion, localVersion)) {
        console.log("no newer version available, exiting...");
        process.exit(0);
      }
      console.log("newer remote version available");

      //find the right asset...
      const jsBundleAsset = payload.assets.find(
        asset => asset.name === `yarn-${remoteVersion}.js`
      );

      if (jsBundleAsset === undefined) {
        console.log(
          `could not find a js bundle for the latest release to download,\n see ${bundleHintBlogLink} to understand what we are looking for.\n  exiting...`
        );
        process.exit(1);
      }

      return jsBundleAsset.browser_download_url;
    })
    .then(fetch)
    .then(res => {
      return new Promise((resolve, reject) => {
        console.log("downloading js bundle...");
        res.body
          .pipe(fs.createWriteStream(yarnBinPath))
          .on("close", resolve)
          .on("finish", resolve)
          .on("error", reject);
      });
    })
    .then(() => {
      console.log("download finished...");
      console.log(`new local version is ${getLocalYarnVersion()}`);
      console.log("finished!");
      console.log(
        `\nyou should probably commit this:\n\tgit commit -m "bump bundled yarn to v${getLocalYarnVersion()}" ${yarnBinPath} \n`
      );
    })
    .catch(err => {
      console.log(err);
      console.log(
        `an unexpected thing went wrong, this may have left ${yarnBinPath} in an inconsistent state.`
      );
      console.log(
        `you may want to reset or revert it:\n\tgit checkout HEAD -- ${yarnBinPath}`
      );
      process.exit(1);
    });
};
