import ast
import json
import threading
import time

from flask import Flask, render_template, jsonify
from iconsdk.builder.call_builder import CallBuilder
from iconsdk.icon_service import IconService
from iconsdk.providers.http_provider import HTTPProvider
from iconsdk.wallet.wallet import KeyWallet
import urllib.request

from repeater import retry

app = Flask(__name__)

default_score = "cx653ee26085d5a477d3de5784c90b19432391487d"
icon_service = IconService(HTTPProvider("http://127.0.0.1:9000/api/v3"))

wallets = {
    'wallet1': KeyWallet.load("../keystores/keystore_test1.json", "test1_Account"),
}


@app.route('/getLatestTx', methods=['GET', 'POST'])
def latest_transactions():
    params = {}
    call = CallBuilder().from_(wallets['wallet1'].get_address()) \
        .to(default_score) \
        .method("get_results") \
        .params(params) \
        .build()
    result = icon_service.call(call)

    transaction_list = []
    for resultVal in result['result']:
        transaction_list.append(ast.literal_eval(resultVal))

    score_balance = icon_service.get_balance(default_score)
    account_balance = icon_service.get_balance(wallets['wallet1'].get_address())

    decending_ordered_transaction = sorted(transaction_list, key=lambda val: int(val['timestamp']), reverse=True)
    latest_transaction = decending_ordered_transaction[0] if len(decending_ordered_transaction) > 0 else []
    response = {
        'transaction_list': decending_ordered_transaction,
        'score_balance': score_balance,
        'account_balance': account_balance,
        'latest_transaction': latest_transaction
    }
    return jsonify(response)


@app.route('/getTransaction', methods=['GET', 'POST'])
def testnet_transactions():
    tx_list = urllib.request.urlopen(
        "https://bicon.tracker.solidwallet.io/v3/contract/txList?addr=cx9d10d63edc8225b7fbbecb335a099d97d0ee19d8&page=1&count=10").read()
    jsonTransaction = json.loads(tx_list)
    return render_template('flip.html', context=jsonTransaction['data'])


def occasional_update(first_time=False):
    app.config['updated'] = not first_time
    threading.Timer(10, occasional_update).start()


@app.route("/updated")
def updated():
    while not app.config['updated']:
        time.sleep(0.5)
    app.config['updated'] = False
    return "Updated"


@app.route("/")
def main():
    return render_template("index.html")


if __name__ == '__main__':
    occasional_update(first_time=True)
    app.run(debug=True, host='0.0.0.0', port=5000)
