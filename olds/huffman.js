(function() {
String.prototype.replaceAll = function(search, replace) {
    return this.split(search).join(replace);
}

const topairs = freqs =>
  Object.keys(freqs).map(c => [c, freqs[c]]);


//Frequency table
function freq (text) {
    return text.split('').reduce((fs, c) =>
            fs[c] ? (fs[c] = fs[c] + 1, fs)
                : (fs[c] = 1, fs), {});
}

//Sort pairs
function sortPairs(pairs) {
    return pairs.sort((a, b) => a[1] > b[1]);
}
  
//Make tree
function makeTree(sortedPairs) {
    return sortedPairs.length < 2
        ? sortedPairs[0]
        : makeTree(sortPairs([[sortedPairs.slice(0, 2), sortedPairs[0][1] + sortedPairs[1][1]]].concat(sortedPairs.slice(2))));
}

//Convert tree to codes
function treeToCodes (tree, pfx) {
    pfx = pfx || '';
    return tree[0] instanceof Array
        ? Object.assign(treeToCodes(tree[0][0], pfx + "0"),
                        treeToCodes(tree[0][1], pfx + "1"))
        : {[tree[0]]: pfx};
}

//Get codes table
function getCodesTable(text) {
    return treeToCodes(makeTree(sortPairs(topairs(freq(text)))));
}

// Encode string by codes
function encode (hufCodes, str) {
    Object.keys(hufCodes).forEach(key => {
        str = str.replaceAll(key, hufCodes[key]);
    });

    return str;
}

// Decode code to string
function decode (hufCodes, str) {
    let code = '';
    let newStr = '';
    for (let i = 0;i < str.length;i++) {
        code += str[i];

        Object.keys(hufCodes).forEach(key => {
            if (code == hufCodes[key]) {
                newStr += key;
                code = '';
            }
        });
    }

    return newStr;
}


function showCodes(text) {
    
    var table = '<table cellspacing="0" class="enc-table"><tr>';

    var codes = sortPairs(topairs(freq(text)));

    Object.keys(codes).forEach(key => {
        table += '<tr>';
        table += '<td>' + codes[key][0] + '</td>';
        table += '<td>' + codes[key][1] + '</td>';
        table += '</tr>';
    });

    table += '</tr></table>';

    $('.js-freq-table').html(table);




    var table = '<table cellspacing="0" class="enc-table"><tr>';

    var codes = getCodesTable(text);

    Object.keys(codes).forEach(key => {
        table += '<tr>';
        table += '<td>' + key + '</td>';
        table += '<td>' + codes[key] + '</td>';
        table += '</tr>';
    });

    table += '</tr></table>';

    $('.js-codes-table').html(table);
    
}




//------------------UI----------------------

$(".js-encode-huf-btn").on("click", function () {
    let inputStr = $('.js-input-str-huf').val();

    $('.js-codes-huf').val(JSON.stringify(getCodesTable(inputStr)));
    $('.js-encoded-str-huf').val(encode(getCodesTable(inputStr), inputStr));

    showCodes(inputStr);
});

$(".js-decode-huf-btn").on("click", function () {
    let inputStr = $('.js-encoded-str-huf').val();
    let hufCodes = JSON.parse($('.js-codes-huf').val());

    $('.js-result-str-huf').val(decode(hufCodes, inputStr));
});

$('.js-encoded-str-huf').val('');
$('.js-codes-huf').val('');
$('.js-result-str-huf').val('');
})();