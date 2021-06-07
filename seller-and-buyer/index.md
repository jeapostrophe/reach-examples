# Seller and Buyer

## Get started

1. Create a directory and change directory:

    ```
    % mkdir -p seller-and-buyer
    % cd seller-and-buyer
    ```

1. Create Reach scaffold files:

    ```
    % reach scaffold
    ```

1. Open `docker-compose.yml`, and append the following:

    ```
    participant: &participant
      <<: *default-app
      stdin_open: true
    seller: *participant
    buyer: *participant
    ```

    You can also adjust the location of `&default-app`. For example, you might move it to the end of the line `reach-app-cli-ALGO-live:`.

1. Open `Makefile`, append the following, replace four spaces with one tab, save, and close.

    ```
    .PHONY: run-seller
    run-seller:
        docker-compose run --rm seller

    .PHONY: run-buyer
    run-buyer:
        docker-compose run --rm buyer
    ```

1. Run `reach init` to create `index.mjs` and `index.rsh`. Replace Alice with Seller and Bob with Buyer in both files. 

1. Run `make build`.

1. Run `make run-seller` in one terminal.

1. Run `make run-buyer` in a second terminal.
