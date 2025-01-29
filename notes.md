# Name suggestions

state-shots - that is a good name

# Functional improvements

* Background mode - script on CI, run only manually by anyone, with queue and commit in ran branch OR Introduce detached machine background mode
* Replace RunnableStoriesSuit with PureStory
* Add pressSequentially
* HMR on actions, highlight when several matches, each function
* React-devtool duplicates roots
* Write docs (including all sub packages)
* Add story search
    * Should work like live filter on groups and story contents
* Error should be linked to specific device
* Handle non serializable entities for recorder
    * Examine how jest handles them
* Accessibility checking https://github.com/abhinaba-ghosh/axe-playwright
* AI Engine to turn text commands in playwright API https://github.com/zerostep-ai/zerostep
* Add recorder and improve pick mode (add clipboard copy)
* expected changes on cross-cut elements make a lot of tests to fail, it is hard and error-prone to verify all
    screenshots manually
* Failed shots can be analyzed and grouped with "similar" kinds of change to ease this task
* Algorithm of comparison is a key
* Diff might be generated as well to make this change much more obvious
* Add mechanism for masking certain areas (by selector)
* Add coverage tool

## Low priority

* Add baseline read button
* Support HMR
* Add todo meta function to `it` factory
* Implement antd actor extensions package
* Implement antd finder extensions package
* Rename story or group utility
    * It is relatively hard to rename them manually

# Structural improvements

* Replace RunnableStoriesSuit with PureStory
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

playwright UI https://playwright.dev/docs/test-ui-mode

# Hypotheses

* "waitForState" action, for example to determine when an element is hidden
    * There is always a possibility to replace any long async tasks with mocks using Externals object
* plain scroll is not necessary because there is scrollUntilVisible alternative
