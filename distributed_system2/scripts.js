
var printers = [
    {
        id: 1,
        busy: false,
        uid: null
    },
    {
        id: 2,
        busy: false,
        uid: null
    }
];

var requests = [];

var interval = setInterval(function() {
    if (requests.length > 0) {
        for (var i=0;i<printers.length;i++) {
            if (printers[i].busy === false) {
                console.log(`Found printer ${printers[i].id}`);
                sendControlToUser(printers[i].id, requests[0].userid);
                requests.splice(0, 1);
                break;
            }
        }
    }
    var text = '';
    for (var i=0;i<requests.length;i++) {
        text += `<p>Користувач ${requests[i].userid} очикує звільнення принтеру</p>`
    }

    $('.js-requests').html(text);
}, 500);

function sendControlToUser(pid, uid) {
    for (var i=0;i<printers.length;i++) {
        if (printers[i].id == pid) {
            printers[i].busy = true;
            printers[i].uid = uid;
            console.log(`Control on printer ${printers[i].id} provided for user: ${uid}`);
            $('.js-print-status-'+printers[i].id).text('Зайнятий, керується користувачем: ' + uid);
            console.log(printers);
            break;
        }
    }
}

function request (uid) {
    requests.push({
        userid: uid
    });
    console.log(`Added printer request for user: ${uid}`);
    console.log(printers);
}

function release (uid) {
    for (var i=0;i<printers.length;i++) {
        if (printers[i].uid == uid) {
            printers[i].busy = false;
            printers[i].uid = null;
            console.log(`Printer released ${printers[i].id} by user: ${uid}`);
            $('.js-print-status-'+printers[i].id).text('Вільний');
            break;
        }
    }
}


//----------------UI------------------

$(".js-request-print").on("click", function (el) {
    var uid = $(el.currentTarget).data('id');
    request(uid);
});

$(".js-rerease-print").on("click", function (el) {
    var uid = $(el.currentTarget).data('id');
    release(uid);
});
  