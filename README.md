# Native HTTPS client

This is a tiny library intended to provide HTTPS client capabilities
based on the native HTTPS library of NodeJS. It comes without any
external dependencies so that it can be used in vanilla NodeJS environment.

# Usage

```javascript
import { NativeHttpsClient } from 'native-https-client'

(async function() {

  // create client instance
  const client = new NativeHttpsClient({
    host: 'jsonplaceholder.typicode.com'
  });

  // get and log users
  const users = await client.get('/users');
  console.log(users);

})();
```
