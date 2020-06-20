```
      _           _               _             _                              _        _                    
  ___| |__   __ _| |_    __ _  __| | __ _ _ __ | |_ ___ _ __   _ __  _ __ ___ | |_ ___ | |_ _   _ _ __   ___ 
 / __| '_ \ / _` | __|  / _` |/ _` |/ _` | '_ \| __/ _ \ '__| | '_ \| '__/ _ \| __/ _ \| __| | | | '_ \ / _ \
| (__| | | | (_| | |_  | (_| | (_| | (_| | |_) | ||  __/ |    | |_) | | | (_) | || (_) | |_| |_| | |_) |  __/
 \___|_| |_|\__,_|\__|  \__,_|\__,_|\__,_| .__/ \__\___|_|    | .__/|_|  \___/ \__\___/ \__|\__, | .__/ \___|
                                         |_|                  |_|                           |___/|_|         
```

<!--
Standard by Glenn Chappell & Ian Chai 3/93 -- based on .sig of Frank Sheeran
Figlet release 2.0 -- August 5, 1993
-->

# Etqiuette

## Test for every fix and feature

> This section is not completed yet.

All fix and feature work must come with integration tests. This is to protect your code and make sure your investment will not be broken by others.

Please review our tests under [`__tests__/stories`](__tests__/stories). These tests are user stories. They include both "today's requirements" and "tomorrow's dreams". We try to push this adapter design to as far as 2 years ahead.

For every new feature, a user story is required. The user story need to be coded as an end-to-end test and placed under this folder for POR.

# Design

## Egress design

### Goals

> TODO: Add links to user stories

- Middleware/enhancer can patch/skip/fork egress activities
   - Asynchronous patch
   - Can be skipped
   - Can be forked into 2+ activities

## Ingress design

### Goals

> TODO: Add links to user stories

- Anyone who have public access to adapter can send ingress
- Middleware/enhancer can stop ingress of another middleware/enhancer
   - Web Socket can pause/resume REST API (protocol fallback)
   - Connection manager can stop downstream ingress
- Middleware can patch/skip/fork the activity of another middleware doing the ingress

### Optional goals

- Easy to ingress a static transcript

## Other designs

- Event target and async iterables are recommended, Observable is welcomed
- Do not use any operators on Observable
   - Observable operators (for example, `flatMap` and `retryWhen` in RxJS) are not welcomed because they are very difficult to debug

# Related articles

- [`applyMiddleware`](https://redux.js.org/api/applymiddleware)
- [`Store creator`](https://redux.js.org/glossary#store-creator)
