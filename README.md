# Stateless DANE Proofs Service

Serves proofs required for Stateless DANE ([HIP-0017](https://hsd-dev.org/HIPs/proposals/0017/)).

## Use

Access it at https://sdaneproofs.htools.work/ or self-host (see below to run server).

The basic syntax URL to get proofs is:

```
/proofs/:domain
```

Append query params as needed:

- `dnssec` - include dnssec proof
- `urkel` - include urkel tree proof
- `parsed` - return json object instead of hex-encoded extension values

Examples:

```
# Get both DNSSEC and Urkel proofs, in expanded form
https://sdaneproofs.htools.work/proofs/letsdane?dnssec&urkel&parsed

# Get only DNSSEC proof as hex-encoded HIP-17 extension value
https://sdaneproofs.htools.work/proofs/collate?dnssec
```

## Installation / Run server

Install dependencies with:

```sh
npm install
```

Create an `.env` file (see `sample.env` for reference).

Start the server with:

```sh
npm start
```

> **Note:** If you are using hsd as a resolver, make sure to also set `no-sig0: true` in its config.

## Contributing

Contributions are always welcome! However, please create an issue before starting any work so there won't be any repeated/wasted effort.
