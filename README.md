## Related articles

- [`applyMiddleware`](https://redux.js.org/api/applymiddleware)
- [Store creator](https://redux.js.org/glossary#store-creator)

## Egress design

## Ingress design

### Goals

- Anyone who have public access to adapter can send ingress
- Middleware/enhancer can stop ingress of another middleware/enhancer
   - Web Socket can pause/resume REST API (protocol fallback)
   - Connection manager can stop downstream ingress
- Middleware can alter the activity of another middleware doing the ingress

### Optional goals

- Easy to send bunch of static transcript
