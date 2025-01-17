# Name suggestions

state-shots - that is a good name

# Functional improvements

* React-devtool duplicates roots
* Write docs
* Add story search
    * Should work like live filter on groups and story contents
* Error should be linked to specific device
* Text matching strategy must be systematic across selectors
    * Text should match by substring by default, case-insensitive
    * Add possibility to use regexp
* Handle non serializable entities for recorder
    * Examine how jest handles them
* Add
  recorder https://github.com/AndrewUsher/playwright-chrome-recorder https://github.com/AndrewUsher/playwright-recorder-extension
* Accessibility checking https://github.com/abhinaba-ghosh/axe-playwright
* AI Engine to turn text commands in playwright API https://github.com/zerostep-ai/zerostep
* Add action modifiers and key shortcuts
  emulation https://stackoverflow.com/questions/59575748/puppeteer-how-to-click-element-so-it-opens-in-new-tab

## Low priority

* Add baseline read button
* Support HMR
* Add todo meta function to `it` factory
* Implement antd actor extensions package
* Implement antd finder extensions package
* Rename story or group utility
    * It is relatively hard to rename them manually
* Add action guards tests

# Structural improvements

* Explain package level architecture
* Obtain more control under public interface
    * api extractor
* Develop a general strategy of test writing that ensures there are no duplicated or missed tests
* Refactor tests
* Refactor manager component styles
* Refactor main storyshots models (story, test result, etc.)

## Low priority

* Verify that package meta is correct (module type, tags, dependencies etc.)

# Useful links

known devices
constant https://github.com/puppeteer/puppeteer/blob/197f00547ea402118c7db3cfaa4a57eb0efdd4cc/packages/puppeteer-core/src/common/Device.ts#L17

library for generating selectors https://github.com/antonmedv/finder

playwright UI https://playwright.dev/docs/test-ui-mode

# Hypotheses

* "waitForState" action, for example to determine when an element is hidden
    * There is always a possibility to replace any long async tasks with mocks using Externals object
* option to configure action guards, for example to be able to click on hidden elements
    * It is better to rely on true user experience, thus producing much more stable results
* expected changes on cross-cut elements make a lot of tests to fail, it is hard and error-prone to verify all
  screenshots manually
    * Failed shots can be analyzed and grouped with "similar" kinds of change to ease this task
    * Algorithm of comparison is a key
    * Diff might be generated as well to make this change much more obvious
* plain scroll is not necessary because there is scrollUntilVisible alternative
