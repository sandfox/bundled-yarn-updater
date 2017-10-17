# bundled yarn updater

A small command for updating a bundled copy of yarn. If you use a bundled copy of yarn for something like your CI enviroment or anything else you might want a way to update it. This package does that! (crudely)

If this means nothing to you maybe reading [yarn's blog post](https://yarnpkg.com/blog/2016/11/24/offline-mirror/#did-you-know-that-yarn-is-also-distributed-as-a-single-bundle-js-file-in-releaseshttpsgithubcomyarnpkgyarnreleases-that-can-be-used-on-ci-systems-without-internet-access) might help



## Usage



```
bundled-yarn-updater PATH_TO_YARN_BUNDLE
```

e.g

```
npx @sandfox/bundled-yarn-updater scripts/yarn
```

or:
```
npm install -g @sandfox/bundled-yarn-updater
bundled-yarn-updater path/to/project/bin/yarn
```

or:

```
yarn add --dev @sandfox/bundled-yarn-updater

// the next command shows an example script from a package.json 
```
{
...
	scripts:{
	...
	"update-yarn": "bundled-yarn-updater travis/ci-yarn",
	...
	}
...
}
```

yarn run update-yarn
```
	

