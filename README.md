## Reference: 

https://gitlab.com/ibriz/icon-dice-roll

## Deployment to local tbears instance

### Run container

```bash
docker run -it -p 127.0.0.1:9000:9000 -p 127.0.0.1:5000:5000 --rm ibriz/icon-workshop:latest
```

### Deploy with tbears

```bash
tbears deploy dice-roll -k keystores/keystore_test1.json -c config/tbears_cli_config.json
```

note: use **test1_Account** as password

### Check result transaction

```bash
tbears txresult [txHASH]
```

Copy the **scoreAddress** from the result

### Edit file `testcmdline/send_set_treasury.json` to update **scoreAddress**

### Send 8 ICX to SCORE and check balance

```bash
tbears sendtx -k keystores/keystore_test1.json -c config/tbears_cli_config.json testcmdline/send_set_treasury.json
```

```bash
tbears balance [SCORE address]
```

### Update default_score in `/tbears/icon­dice­roll/webapp/main.py`

### Call fallback function in SCORE

Step 1: Edit to address by SCORE address

```bash
tbears sendtx -k keystores/keystore_test1.json -c config/tbears_cli_config.json testcmdline/send_bet.json
```

**Note**: Use key store of ICONex wallet

```bash
docker cp <file path> <container id>:/tbears/icon­dice roll/keystores/keystore1.json
```

## Deployment to testnet

### Faucet ICX testnet

- [https://faucet.sharpn.tech](https://faucet.sharpn.tech/)
- [http://icon-faucet.ibriz.ai](http://icon-faucet.ibriz.ai/)
- [https://faucet.reliantnode.com/](https://faucet.reliantnode.com/)

### Deploy

```bash
tbears deploy dice-roll -f <from address> -k keystores/keystore1.json -c config/tbears_cli_config_testnet.json
```

note: use **p@ssword1** as password

### Check transaction

```bash
tbears txresult txnhash -c config/tbears_cli_config_testnet.json
```

**Testnet tracker**: https://bicon.tracker.solidwallet.io/ put the score address

## Run WEB APP

```bash
cd webapp/
python3 main.py
```
