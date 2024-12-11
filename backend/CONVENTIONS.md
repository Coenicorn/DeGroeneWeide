# Code conventions

Please follow these. I (coen) will be looking at this document for future code reviews. 

Please do the same

## Logging to the console

All (non-debug) logging **must** be done through any of the helper functions in `util.js`. Any left console.log statements **must** be removed or replaced by calls to their corresponding helper function. In general, try and log important data. This is to help development and bug identification and fixing (plus it makes the program console look cool as shit).


## Error handling and logging

Every error must be handled, be it through `try/catch` or other means. Every time an error is caught, a call to `err_log` **MUST** be made with a status message and the error. This is so that in the future we can log all received errors in their entirety so that we can better find the causes and fix them.

Should an error occur in a route, the server **must** respond with an error code and a status message. This **must** be done with the `respondwithstatus` function in `util.js`, like this:

```javascript

try {
    ...
} catch(e) {
    err_log("error doing" /* or some other message */, e);
    // make sure to add 'return', execution MUST stop here
    return respondwithstatus(
        res, 
        500 /* or some other error code */, 
        "something went wrong doing ..." /* or some other message */
    );
}

```

Note that the `respondwithstatus` function takes one additional argument; an object. This object will, *in the dev environment*, be sent to the client and must thus be of value to the developer. **In production, this object is NOT sent to the client**, so make sure that it doesn't contain anything important to the client. Instead, send those in the status string.

The status string **must not** contain any implementation-specific data, such as entire error objects (`Error`), error object status messages (`Error.message`) or anything that might give away some information about the backend.