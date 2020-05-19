function hammingEncode(input) {
    var debug = false;
    $('.js-encode-err').text('');
    if (typeof input !== "string" || input.match(/[^10]/)) {
        $('.js-encode-err').text('Error: Input value should be binary string, for example "101010"');
        return console.error(
            'hamming-code error: input should be binary string, for example "101010"'
        );
    }

    var output = input;
    var controlBitsIndexes = [];
    var l = input.length;
    var i = 1;
    var key, j, arr, temp, check;

    while (l / i >= 1) {
        controlBitsIndexes.push(i);
        i *= 2;
    }

    debug && console.log('Input value: ' + output);
    debug && console.log('controlBitsIndexes: ' + controlBitsIndexes);

    //Insert control bits to code. (Empty values)
    for (j = 0; j < controlBitsIndexes.length; j++) {
        key = controlBitsIndexes[j];
        output = output.slice(0, key - 1) + '0' + output.slice(key - 1);
    }

    debug && console.log('With control bits: ' + output);

    //Calculate control bits
    arr = output.split('');

    for (i = 0; i < controlBitsIndexes.length; i++) {
        var controlBits = [];
        var bitKey = controlBitsIndexes[i];

        debug && console.log('Bit num: ' + bitKey);

        var controlBit = 0;
        for (j = (bitKey - 1); j < arr.length; j += (2 * bitKey)) {
            for (m = 0; m < bitKey && j + m < arr.length; m++) {
                controlBits.push(arr[j + m]);
                controlBit += parseInt(arr[j + m]);
                controlBit = (controlBit % 2);
            }
        }

        arr[bitKey - 1] = controlBit;

        debug && console.log('Control bits: ' + controlBits);
        debug && console.log('Control bit value: ' + controlBit);
        debug && console.log('Tmp result ouput: ' + arr);
    }

    output = arr.join('');

    debug && console.log('Encoding ouput: ' + output);

    return output;
}

//Decode without correction
function hammingPureDecode(input) {
    if (typeof input !== "string" || input.match(/[^10]/)) {
        return console.error(
            'hamming-code error: input should be binary string, for example "101010"'
        );
    }

    var controlBitsIndexes = [];
    var l = input.length;
    var originCode = input;
    var i;

    i = 1;
    while (l / i >= 1) {
        controlBitsIndexes.push(i);
        i *= 2;
    }

    controlBitsIndexes.forEach(function (key, index) {
        originCode =
            originCode.substring(0, key - 1 - index) +
            originCode.substring(key - index);
    });

    return originCode;
}


function hammingDecode(input) {
    var debug = false;
    if (typeof input !== "string" || input.match(/[^10]/)) {
        return console.error(
            'hamming-code error: input should be binary string, for example "101010"'
        );
    }

    var controlBitsIndexes = [];
    var sum = 0;
    var l = input.length;
    var i = 1;
    var output = hammingPureDecode(input);
    var inputFixed = hammingEncode(output);

    debug && console.log('input: ' + input, 'inputFixed: ' + inputFixed);

    while (l / i >= 1) {
        controlBitsIndexes.push(i);
        i *= 2;
    }

    var inputArr = input.split('');
    var inputFixedArr = inputFixed.split('');

    debug && console.log('input: ' + inputArr, 'inputFixed: ' + inputFixedArr);

    controlBitsIndexes.forEach(function (i) {
        debug && console.log('*****');
        var key = i - 1;
        debug && console.log('Bit: ' + i);
        debug && console.log('input bite: ', inputArr[key], 'new bite: ', inputFixedArr[key]);
        if (inputArr[key] !== inputFixedArr[key]) {
            debug && console.log('Sum Bit: ' + i);
            sum += parseInt(i);
        }

        debug && console.log('------');
    });

    debug && console.log('Sum: ', sum);

    if (sum > 0) {
        inputArr[sum - 1] = inputArr[sum - 1] == '1' ? '0' : '1';
    }

    var fixedEncodedStr = inputArr.join('');

    return hammingPureDecode(fixedEncodedStr);
}

function hammingCheck(input) {
    if (typeof input !== "string" || input.match(/[^10]/)) {
        return console.error(
            'hamming-code error: input should be binary string, for example "101010"'
        );
    }

    var inputFixed = hammingEncode(hammingPureDecode(input));

    return !(inputFixed === input);
}


//------------------UI----------------------

$(".js-encode-btn").on("click", function () {
    hammingEncode($('.js-input-code').val());
    $('.js-encoded-code').val(hammingEncode($('.js-input-code').val()));
});

$(".js-decode-btn").on("click", function () {
    var code = $('.js-encoded-code').val();

    $('.js-has-error').text(hammingCheck(code) ? 'Так' : 'Ні');
    $('.js-result-code').val(hammingDecode(code));
    $('.js-result-noncorrect-code').val(hammingPureDecode(code));
});

$('.js-encoded-code').val('');
$('.js-has-error').text('');
$('.js-result-code').val('');
$('.js-result-noncorrect-code').val('');
