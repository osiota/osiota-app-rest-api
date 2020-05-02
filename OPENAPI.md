# osiota REST api
This is the osiota REST api documentation. You can find out more about osiota at [https://osiota.net/](https://osiota.net/).

## Version: 1.0.0

**License:** [MIT](https://github.com/osiota/osiota/blob/master/LICENSE)

### /{node}

#### GET
##### Summary:

Get current value of the node

##### Description:



##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| node | path | Name of the node | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | successful operation | [Node](#node) |
| 400 | Bad Request |  |
| 404 | Node not found |  |

#### POST
##### Summary:

Call a RPC function of a node

##### Description:



##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| node | path | Name of the node | Yes | string |
| method | query | RPC method to call | Yes | string |
| arguments | body | Arguments to call | Yes | [ any ] |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | successful operation | [ any ] |
| 400 | Bad Request |  |
| 404 | Node not found |  |
| 422 | Unprocessable Entity | [Error](#error) |
| 500 | Internal application error | [Error](#error) |

### Models


#### Node

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| value | any | Value of a Node | No |
| time | number | Unix timestamp of last alteration | No |

#### Error

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| error | string | Error string | No |
| data | any | Addional information | No |