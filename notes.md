# Name suggestions

vcheck - visual check, refers to main function of this library

ui-play - self-explanatory

# Functional improvements

* Add more info when failed (by which selectors was unable to find an element, on what action)
  * Probably requires to develop separate error pane
  * Error should be linked to specific test config
* Add bulk status bar (passed, failed, running and percentage)
* Autoplay does not work after startup
  * Add retry button
* Implement single text matching strategy
  * All selectors should match by substring by default
* Implement story filter
  * Each story should be able to describe on which env it is able to run (`only` predicate)
  * When current test config is not supported by story, it should be grayed out
* Decide how bulk run should react on error
  * It should not stop, probably
* Handle non serializable entities for recorder
  * Examine how jest handles them
* Errors should say implicitly that element was not visible, that is why timeout has been triggered
* Fill method can not change input value (ref to puppeteer-core\src\api\locators\locators.ts#472)
* React-devtool duplicates roots
* Stop button
* Slight changes on global components make a lot of tests to fail
  * Maybe there is a way of determining similar kinds of change?
  * Pixels areas might be used

## Low priority

* Add baseline read button
* Add configuration for chrome pool
* Support HMR
* Implement STOP button
* Add actor a function to wait while all page animations are done
* Add todo meta function to `it` factory
* Implement antd actor extensions package
* Implement stale test results indicators
  * Allows to cache results
  * Content hash might be used as relevancy key
* Rename story or group utility
  * It is relatively hard to rename them manually

## Questionable

* Quick action on screenshot and records preview - why default actions are not sufficient?
* Display unhandled preview exception - browser console already displays them with correct source maps

# Structural improvements

* Hide behind preview facade @core dependency from clients
  * It is very likely that packages structure will change in future
* Explain package level architecture
* Move devtools extension to react-preview
* Obtain more control under public interface
  * api extractor
* Solve broken self testing
  * Testing env references actual code but not bundled
* Develop a general strategy of test writing that ensures there are no duplicated or missed tests

## Low priority

* Verify that package meta is correct (module type, tags, dependencies etc.)

# Useful links

known devices constant https://github.com/puppeteer/puppeteer/blob/197f00547ea402118c7db3cfaa4a57eb0efdd4cc/packages/puppeteer-core/src/common/Device.ts#L17

library for generating selectors https://github.com/antonmedv/finder

playwright UI https://playwright.dev/docs/test-ui-mode
