# Sourc

###### Repo at [https://github.com/Th3OneAndOnly/Sourc](https://github.com/Th3OneAndOnly/Sourc)

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![GitHub issues](https://img.shields.io/github/issues/Th3OneAndOnly/Sourc.svg)](https://GitHub.com/Th3OneAndOnly/Sourc/issues/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![NPM Version](https://img.shields.io/npm/v/sourc-editor)](https://www.npmjs.com/package/sourc-editor)
[![NPM scoped bundle size](https://badgen.net/packagephobia/publish/sourc-editor)](https://www.npmjs.com/package/sourc-editor)

## [![saythanks](https://img.shields.io/badge/say-thanks-ff69b4.svg)](https://saythanks.io/to/Th3OneAndOnly)

Sourc is a text editor for the web,
ready to use in your projects.
It's lightweight, extensible, and embeddable.
This repository is open-source and openly accepts
contributions. See the Contributing section for
more.

## Features (still WIP)

### Fully implemented

- Basic text input including:
  - Single character input
  - Single character deleting
  - Arrow key movement
- Plugin based code injection system.
- A powerful, simple to use
  logging system.

### In Progress

- The rest of the basic text editing features

**This is a synopsis.
See `CHANGLELOG.md` for up to date changes**

## Installation

Install Sourc with npm

```bash
  cd your-project
  npm install --save sourc-editor
```

Take note that you will need webpack and some
sort of dev server environment to run your webpage.

## Documentation

Documentation is available at [th3oneandonly.github.io/Sourc](https://th3oneandonly.github.io/Sourc). This will take you
to the `latest` link, which is updated with each commit made
to the github. To access documentation for other releases,
replace `latest` with the version number, i.e. `0.0.6`.

For now, I haven't figured out how to make the dynamic version
dropdown, coming soon 👀.

## Contributing

Contributions are welcome and appreciated!

Please see `contributing.md` for rules and regulations
about contributing.

To get started, clone this repo:

```bash
git clone https://github.com/Th3OneAndOnly/Sourc
npm i
```

Now you can use `npm run dev:init` to make a `demo` folder containing
everything you need to kickstart local development. If we make changes to how the dev environment is set up
you can run `npm run dev:update` to update your dev environment without touching any code you've written.
You can build each by running `npm run dev:build`!

To build Sourc, use `npm run build` 🏗️ and to build the docs use `npm run doc` 📖.

Now, hack away! 🔨 Thank you so much for making a
contribution, please make a pull request in the repo
after checking your PR with `contributing.md`.

Please adhere to this project's `code of conduct`.

## Testing

`npm test` runs jest on the project.
If you use `npm run test:cov` instead, coverage data is stored in the resulting `coverage` folder.

## Support

For support, email 209theoneandonly@gmail.com
or create a Github Issue.

## License

[MIT](https://choosealicense.com/licenses/mit/)
