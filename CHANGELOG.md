# Changelog

All changes made to the project will be listed here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Documentation for every publicly accessible thing
- `findLineOf` string utility function
- `StatefulFunction` class for shortening and cleaning up long functions.

  - `StatefulFunction#runOne`
  - `StatefulFunction#runAny`
  - `StatefulFunction#if`
  - `StatefulFunction#require`
  - `StatefulFunction#try`

> Issues with StatefulFunction, (TODO):
>
> - You have to `.bind(this)` most of the time if you
>   pass in a method, which is annoying.

- `normalizeSelection`
- `isCaretFlat` -> `isSelectionFlat`
- `setSelection` -> `setCaretSelection`

### Removed

- Remove `TextEditor.overlay` since it's unimplemented and
  its functionality will be replicated in a future plugin anyway.
- Remove `TextEditor#setName` since `TextEditor.LOGGER#withName` is good enough.

### Changed

- Previously `setSelection` ignored `selection.end`, now it uses it to determine
  where to place the end of the selection.
- You may have noticed a small delay when you clicked past the text before the editor
  corrected it. I have removed that delay.

## [0.0.1] - 8/27/2021

### Added

- Plugin registry
- State handlers
- Plugin#onKeyPressed

### Core Plugin

#### Added

- Basic single character insertion and deletion
- Arrow key movement
