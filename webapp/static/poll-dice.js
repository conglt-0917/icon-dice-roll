
var prev_data = null;
var waiting_for_update = false;
var LONG_POLL_DURATION = 60000; //  time in ms


function load_data() {
    var url = '/getLatestTx';
    $.ajax({ url:     url,
             success: function(data) {
                          display_data(data);
                          wait_for_update();
                      },
    });
    return true;
}

function wait_for_update() {
    if (!waiting_for_update) {
        waiting_for_update = true;
        $.ajax(
        { url: '/updated',
                 success:  load_data,
                 complete: function () {
                    waiting_for_update = false;
                    wait_for_update();
                 },
                 timeout:  LONG_POLL_DURATION,
               });
    }
}


function display_data(data) {
    dataLength = 0;
    prevLength = 0;
    if (data != null) {
        dataLength = data['transaction_list'].length;
    }
    if (prev_data != null) {
        prevLength = prev_data['transaction_list'].length;
    }

    if (data && (dataLength != prevLength)) {
        $('span#score_balance').html(data.score_balance);

        $('span#latest_transaction').html(function () {
            var win_lose = data.latest_transaction.result == 1 ? 'Won' : 'Lost';
            var latest_transaction_string = 'TxHash(<span class="value">' +
                data.latest_transaction.txHash +
                '</span>), AmountSpent(<span class="value">' +
                data.latest_transaction.amount +
                '</span>), Result (<span class="value">' +
                win_lose +
                '</span>)';
            $('#coin-flip-id').html('You '+ win_lose);
            return latest_transaction_string;
        });
        $('div#transaction_list').html(function () {
            var transaction_table = '<table class="table table-striped TblCoin"><thead><tr><th>Toss Coin</th><th>Result</th></tr></thead><tbody>';

            var transaction_length = data.transaction_list.length;
            for (var i = 0; i < transaction_length; i++) {
                var win_lose = data.transaction_list[i]['result'] == 1 ? 'Won' : 'Lost';
                transaction_table += '<tr><td>' +
                    data.transaction_list[i]['txHash'] +
                    '</td><td>' +
                    win_lose +
                    '</td></tr>';
            }
            transaction_table += '</tbody></table>';
            return transaction_table;
        });

        prev_data = data;

        $('#updated').fadeIn('fast');
        setTimeout(function () {
            $('#updated').fadeOut('slow');
        }, 2500);


    } else if (dataLength == prevLength) {
        console.log('Same data recieved.');
        $('#coin-flip-id').html('<div class="coin-tails"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/US_One_Cent_Rev.png/240px-US_One_Cent_Rev.png"></div><div class="coin-heads"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/US_One_Cent_Obv.png/240px-US_One_Cent_Obv.png"></div>');
    }
}


$(document).ready(function() {
    $('#updated').fadeOut(0);
    $('div#latest_transaction').append('awaiting data...');

    load_data();
});
