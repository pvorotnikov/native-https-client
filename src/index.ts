import https, { RequestOptions } from 'https';

export type NativeHttpsClientOptions = RequestOptions & {
  throwOnErrors?: boolean
}

export class NativeHttpsClient {

  private options: NativeHttpsClientOptions;

  // create a client
  constructor(options = {}) {
    this.options = {
      rejectUnauthorized: true,
      throwOnErrors: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      ...options
    }
  }

  // update the default options of the client
  async setOptions(options: NativeHttpsClientOptions) { this.options = { ...this.options, ...options } }

  // wrappers around doRequest
  async get(path: string, options: NativeHttpsClientOptions = {}) { return this.doRequest({ ...options, path, method: 'GET' }) }
  async post(path: string, data: any, options: NativeHttpsClientOptions = {}) { return this.doRequest({ ...options, path, method: 'POST' }, data) }
  async put(path: string, data: any, options: NativeHttpsClientOptions = {}) { return this.doRequest({ ...options, path, method: 'PUT' }, data) }
  async patch(path: string, data: any, options: NativeHttpsClientOptions = {}) { return this.doRequest({ ...options, path, method: 'PATCH' }, data) }
  async delete(path: string, data: any, options: NativeHttpsClientOptions = {}) { return this.doRequest({ ...options, path, method: 'DELETE' }, data) }

  // do the actual request
  async doRequest(options: NativeHttpsClientOptions, data: any = null) {

    return new Promise(resolve => {

      const configOptions = { ...this.options, ...options };

      const req = https.request(configOptions, res => {

        console.log(`code=${res.statusCode}`);

        // construct response
        let response = '';
        res.on('data', chunk => response += chunk);

        // return response
        res.on('close', () => {
          
          if (configOptions.throwOnErrors && (res.statusCode || 1000) >= 400) {
            throw new Error(`code=${res.statusCode}, body=${response}`);
          }

          try {
            response = JSON.parse(response);
          } catch (err) { };

          resolve(response);
        });

        res.on('error', err => { // handle errors on the response
          console.error(err.message);
          throw err
        });

      });

      req.on('error', err => { // handle errors on the request
        console.error(err.message);
        throw err;
      });

      if (data) {
        const body = typeof data === 'string' ? data : JSON.stringify(data);
        req.write(body);
      }

      req.end();

    });

  }

}
