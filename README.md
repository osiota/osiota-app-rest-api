<a name="root"></a>
# osiota application rest-api

*Osiota* is a software platform capable of running *distributed IoT applications* written in JavaScript to enable any kind of IoT tasks. See [osiota](https://github.com/osiota/osiota).

## Configuration: rest-api


This application starts a seperate HTTP server to provide a REST api. With this REST api it is possible get the current state a node or to call a RPC function. As REST (without extention) does not provide the publish subscribe pattern, we recommend to **not** use this application. You could use multiple instances of osiota and connect them with WebSocket connections instead.

See [OpenAPI definition](OPENAPI.md)

**Properties**

|Name|Description|Type|
|----|-----------|----|
|server|HTTP server port for the REST api<br/>|number|
|base\_path|Base path of the REST api<br/><br/>Default: `""`|string|

**Example**

```json
{
    "server": "8081",
    "base_path": ""
}
```


## How to setup

Add a configuration object for this application, see [osiota configuration](https://github.com/osiota/osiota/blob/master/doc/configuration.md):

```json
{
    "name": "rest-api",
    "config": CONFIG
}
```

## License

Osiota and this application are released under the MIT license.

Please note that this project is released with a [Contributor Code of Conduct](https://github.com/osiota/osiota/blob/master/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
