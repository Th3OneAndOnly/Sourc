# Changelog

All changes made to the project will be listed here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Documentation for every publicly accessible thing
- findLineOf string utility function

### Removed

- Remove TextEditor.overlay since it's unimplemented and
  its functionality will be replicated in a future plugin anyway.
- Remove TextEditor#setName since TextEditor.LOGGER#withName is good enough.

## [0.0.1] - 8/27/2021

### Added

- Plugin registry
- State handlers
- Plugin#onKeyPressed

### Core Plugin

#### Added

- Basic single character insertion and deletion
- Arrow key movement
