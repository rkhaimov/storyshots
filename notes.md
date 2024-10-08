# Name suggestions

state-shots - that is a good name

# Functional improvements

* React-devtool duplicates roots
* Presets might not be needed
* Write docs
* Implement true background CI (without headless hack)
* Reduce preview reload times. Right now it reloads too often and easily can be decreased to update only when absolutely
  necessary.
* Add wait for element to hide action (does user need to be able to determine when element was mounted on a page)
* Add story search
    * Should work like live filter on groups and story contents
* Error should be linked to specific test config
* Add retry play button
* Implement single text matching strategy
    * All selectors should match by substring by default
* Implement non-strict matching strategy
    * Accept non visible elements
* Implement story filter
    * Each story should be able to describe on which env it is able to run (`only` predicate)
    * When current test config is not supported by story, it should be grayed out
* Decide how bulk run should react on error
    * It should not stop, probably
* Handle non serializable entities for recorder
    * Examine how jest handles them
* Stop button
* Slight changes on global components make a lot of tests to fail
    * Maybe there is a way of determining similar kinds of change?
    * Pixels areas might be used
* Tests must run on compiled versions
* Add recorder https://github.com/AndrewUsher/playwright-chrome-recorder https://github.com/AndrewUsher/playwright-recorder-extension
* Accessibility checking https://github.com/abhinaba-ghosh/axe-playwright
* AI Engine to turn text commands in playwright API https://github.com/zerostep-ai/zerostep

## Low priority

* Add baseline read button
* Support HMR
* Add todo meta function to `it` factory
* Implement antd actor extensions package
* Rename story or group utility
    * It is relatively hard to rename them manually
* Improve story bulk run - it should give quick response (now it updates in chunks, use promise pool function?)

# Structural improvements

* Explain package level architecture
* Obtain more control under public interface
    * api extractor
* Develop a general strategy of test writing that ensures there are no duplicated or missed tests

## Low priority

* Verify that package meta is correct (module type, tags, dependencies etc.)

# Useful links

known devices
constant https://github.com/puppeteer/puppeteer/blob/197f00547ea402118c7db3cfaa4a57eb0efdd4cc/packages/puppeteer-core/src/common/Device.ts#L17

library for generating selectors https://github.com/antonmedv/finder

playwright UI https://playwright.dev/docs/test-ui-mode
