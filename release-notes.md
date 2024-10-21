# 0.0.5

## Behaviour

* Added new selectors, combinators and extension methods
* Added new actions
* Removed presets entirely
* Improved UI performance

## Structure

* Added tests for selectors and actions


# 0.0.1

## Behaviour

* Added "accept all" button
* Added device preview mode and live preset config
    * Mobile emulation also replaces user agent value
    * Story factory functions like arrange and act now accept additional device argument
* Actions were replaced to fix hover jumps
* Fill method now clears previous value before entering next one
* Other minor visual fixes

## Structure

* Self testing solution were written. Now framework tests itself, although there are some problems to be solved
* core now declares actors, finders and journal. Clients should use them via concrete preview (like react-preview)

# 0.0.0

Initial release