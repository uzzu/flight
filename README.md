## flight
flight-framework is a jsfl script framework with a CommonJS-like module mechanism.

## How to use?

```javascript
fl.runScript(
  "/path/to/flight_root/flight.jsfl",
  "flight$bootstrap",
  this,
  "/path/to/flight_root",
  "/path/to/script_root"
);
require("console").log("Hello, jsfl!");
```

How to use others should look at examples/ and <http://uzzu.github.com/docs/flight/>

## Licence
flight-framework is release under the MIT License.

