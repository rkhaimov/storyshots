Following conditions are required to be satisfied in order for solution to be called "ready"

Axioms:

1. Program must be described as a set of arguments and set of outputs
    1. Inputs
        1. User actions
        2. Remote API state
        3. Browser env state
    2. Outputs
        1. Monitor screen
        2. Remote API calls
        3. Browser env calls
2. Program output must allow representation in a value format
    1. They must be comparable: args0 === args1 -> P(args0) === P(arg1)
    2. They must be storable: retrieve(store(P(arg))) === P(arg)

Followings:

* Program may be divided into subprograms (scenarios) each of which meets conditions of the aggregate
* Scenario input may be strongly and statically typed
* Scenario input may be bound, thus allowing program to be opened in a browser with desired output given as a result
* Scenario output may be continued by a developer via act of system usage
* Scenario output may be debugged using modern development tools (chrome devtools, library tools plugins, etc.)
* Scenario can be developed using hot mode, where the latter being replayed after each change
* Scenario can be represented as a test case, where output is being recorded automatically and compared later
