# Stateless DANE Proofs Service

Serves proofs required for Stateless DANE ([HIP-0017](https://hsd-dev.org/HIPs/proposals/0017/)).

## Installation / Usage

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
