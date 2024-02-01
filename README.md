[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Github Actions Workflow](https://github.com/PolymeshAssociation/polymesh-subquery/actions/workflows/main.yml/badge.svg)](https://github.com/PolymeshAssociation/polymesh-subquery/actions)
[![Sonar Status](https://sonarcloud.io/api/project_badges/measure?project=PolymeshAssociation_polymesh-subquery&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=PolymeshAssociation_polymesh-subquery)
[![Issues](https://img.shields.io/github/issues/PolymeshAssociation/polymesh-subquery)](https://github.com/PolymeshAssociation/polymesh-subquery/issues)

# Polymesh Subquery

This project has been initially created to replace [the harvester](https://github.com/PolymathNetwork/polkascan-pre-harvester) meaning the output of both should match as much as possible, however since the harvester serializes chain objects in slightly different ways than polkadot-js, this project contains a list of special cases handled both at the initial deserialization level (in [project.yaml](project.yaml).network.types) and at the serialization level in [serializeLikeHarvester.ts](src/mappings/serializeLikeHarvester.ts).

## Running

1. In the [docker-compose.yml](docker-compose.yml) file, set the appropriate [environment variables](#env-settings) for `subquery-node` container
2. Install subql cli: `npm i -g @subql/cli`
3. `./rerun.sh` (requires docker compose). To persist data between runs, remove the `-v` flag, which causes the docker volume to be removed

## Using event_arg_x indexes.

The event_arg_x columns are now text, in order for them to fit in BTree indexes they are truncated to 100 characters like in the harvester.
This means that if you want to take advantage of the index in your query, you must use an expression like: `WHERE left(event_arg_x, 100) = 'foobar'`.
Otherwise using `WHERE event_arg_x = 'foobar'` will result in a full table scan.

## Debugging using the found_types table

The found_types table generated by subquery contains all types that have been serialized like the harvester, the actual type is in column ID which is the primary key and therefore unique and the raw type is in the raw_type column, if things break this is the first place to look for potential mismatches between types.

## Version

This SubQuery version works with chain version 5.3.x

### ENV settings

The behavior of the dev image can be controlled by setting ENV variables. The default entrypoint is `docker-entrypoint.sh`, which should be looked at to fully understand these settings. Notable ones include:

- `NETWORK_ENDPOINT` - the wss endpoint of the blockchain to be indexed
- `NETWORK_CHAIN_ID` - The genesis hash of the chain. This value can be retrieved by going to the explorer and looking for the block hash of block 0. e.g. [for mainnet](https://mainnet-app.polymesh.network/#/explorer/query/0)
- `NETWORK_DICTIONARY` - The GraphQL endpoint of SubQuery Dictionary Project that pre-indexes events on chain to dramatically improve indexing of this SubQuery Project (sometimes up to 10x faster). The dictionary has already pre-scanned over the network, and has records of the module and method for every event/extrinsic on each block. If you don't have dictionary setup you can see examples of how to create a dictionary in the [dictionary repository](https://github.com/subquery/subql-dictionary). Polymesh dictionary can be referenced from [here](https://github.com/PolymeshAssociation/subql-dictionary).
- `START_BLOCK` - block from which indexing should start. Generally this should be set to 1, but other values can be useful for debugging.

More advanced options are:

- `NO_NATIVE_GRAPHQL_DATA` — this will set the event handler to only record what is necessary for tooling gql. This allows a stable indexer to be ran as native GraphQL handlers get developed
- `MAX_OLD_SPACE_SIZE` — this will be passed onto the node process as `--max-old-space-size` flag. The recommendation is for this to be ~75% of available RAM. Defaults to 1536, a setting appropriate for 2GB.

## License

This project uses [SubQuery](https://github.com/subquery/subql), which is [Apache 2.0 licensed](./LICENSE).

The project itself is also [Apache 2.0 licensed](./LICENSE).
