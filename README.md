# gpsdws #

WebSockets server for gpsd's JSON feed.

This presents a simple service on `wss://localhost:8947/gpsdws` which pushes WebSockets datagrams containing [a single gpsd JSON message](http://www.catb.org/gpsd/gpsd_json.html).

There is also a simple JavaScript library which takes care of some setup tasks.

This server is served over HTTPS, so can be used with sites that use HTTPS.  No warranty to the actual encryption used is given.

There are some examples of use in the `gpsdws_root` directory, which is served as the root of the web server by default.

## Setup ##

```console
$ sudo apt-get install gpsd openssl python-autobahn python-gps python-twisted
$ ./generate_cert.sh
```

## Installing the certificate ##

This service runs over HTTPS, to allow use with userscripts running on HTTPS sites.

For Chrome:

1. Goto `chrome://settings/certificates`
2. Click **Authorities**
3. Click **Import...**
4. Select `cert.pem` in the gpsdws directory.
5. Tick "Trust this certificate authority for identifying websites"
6. Click **OK** then **Finished**

## Running ##

```console
$ python gpsdws.py
```

## TODO ##

- Implement security on the WebSocket. Right now anything can access it, this is bad.
- Send JavaScript events for other, non-TPV GPSd messages
- Implement a simple slippymap with live updates

