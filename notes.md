# Functional improvements

## High priority

* Clipboard copy for action picker
* Integrate react-devtools
* Add story search
    * Should work like live filter on groups and story contents
* Accessibility checking https://github.com/abhinaba-ghosh/axe-playwright
* AI Engine to turn text commands in playwright API https://github.com/zerostep-ai/zerostep
* Add coverage tool
* Run only changed stories first
* Describe masking technique

## Low priority

* Add baseline read button
* Support HMR
* Implement antd actor extensions package
* Implement antd finder extensions package
* Rename story or group utility
    * It is relatively hard to rename them manually
* Write more tests
    * Masking
    * Animations and testing mode
        * dynamic arrange (based on testing)
        * dynamic render (based on testing)
        * ability to disable css animations
    * Indicators priority
    * Fetching phase (stories loading, stories execution, stories accepting)
    * Retries taking { device }
    * Does not remove stale shots (intermediate shots which are no longer being taken, or stories that are now missing)
    * Allows to redefine last shot name
    * Failures pane
        * failure message
        * jump to story causing failure
        * display failure messages

## Low priority

* Verify that package meta is correct (module type, tags, dependencies etc.)

# Useful links

playwright UI https://playwright.dev/docs/test-ui-mode

# Hypotheses

* "waitForState" action, for example to determine when an element is hidden
    * There is always a possibility to replace any long async tasks with mocks using Externals object
* plain scroll is not necessary because there is scrollUntilVisible alternative
* screenshot masking technique is useful when expected changes on cross-cut elements make a lot of tests to fail
