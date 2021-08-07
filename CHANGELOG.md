# Changelog

All notable changes to pipeline-editor-s5 project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).


## [v0.2.1] - 2021-08-07 (2021 Aug 7)


### Fixed

* Fixed #43 centering in scaling buttons
* Fixed paddings
* Fixed #39 centering name if block has not description
* Fixed #36 after delete block also delete connections


### Added

* Added hints to menu buttons
* Attached deepcode.ai

### Changed

* Redesign color for menu buttons
* Fixed #37 changed behaviour moving workspace
* Updated screenshot
* updated data_pl_sample.js
* Fixed #2 edition states complited
* Renamed render-pipeline.js to pipeline-editor-s5

### Security

* Attached deepcode.ai
* Fixed lgtm alerts

## [v0.2.0] - 2021-07-31 (2021 Jul 31)

### Fixed

* Fixed #30 forbidden moving child upper than parent
* Fixed #23 added to README integration to angular

### Changed

* Redesign format of json (minifier for share)
* Fixed #4 Scaling - redesign, moved to canvas
* Renamed RenderPipelineNode -> RenderPipelineBlock
* Start redesign modes of editor (redesign remove blocks)
* Redraw icons
* Redesign padding option for #4
* Scale value moved to RenderPipelineConfig
* Prepare #32 - reposition nodes (auto_placement)
* Updated html/images/share.svg

### Added 

* Fixed #3: autosave
* Fixed #15, #18: share by url (`?v=data_share`)
* Implemented get_data_share/set_data_share for url sharing
* added `version` to RenderPipelineEditor
* Added cursor on delete blocks
* Prepare list of functions for documentation
* Implemented settings title, description, background-color
* Added lz-string for share urls

### Security

* Fixed lgtm alerts
* Removed unused functions


## [v0.1.1] - 2021-07-13 (2021 Jul 13)

### Changed

* Redesign selection: highlight border but not fill block
* Cleanup code

### Added

* Fixed #10 added diagram name
* Fixed #31 added background-color

### Fixed

* Fixed #28 apply monospase font for json-content (For Safary browser)

### Security

* Fixed lgtm alert

## [v0.1.0] - 2021-07-06 (2021 Jul 7)

### Changed

* Data format
* Cleanup code

## [v0.0.1] - 2021-07-06 (2021 Jul 6)

### Added

* Init first version