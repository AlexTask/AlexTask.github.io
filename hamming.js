(function() {
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

    var nullControl = output;

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

    
    
    showEncodeInfo(arr,controlBitsIndexes, nullControl.split(''), input);

    return output;
}

function showEncodeInfo(arr, controlBitsIndexes, inputArr, input) {
    $('.js-str-l').text(input.length);
    $('.js-control-bits-nums').text(controlBitsIndexes.join(', '));

    var table = '<table cellspacing="0" class="enc-table"><tr>';

    //Add new empty control bits
    for (i = 0; i < inputArr.length; i++) {
        var addClass = '';
        if (controlBitsIndexes.indexOf(i+1) > -1) {
            addClass = 'class="control-bit"';
        }

        table += '<th ' + addClass +'>' + inputArr[i] + '</th>';
    }

    table += '<th>біт</th><th>сума</th><th>значення</th></tr>';

    //Show bits calculations
    for (i = 0; i < controlBitsIndexes.length; i++) {
        table += '<tr>';
        var bitKey = controlBitsIndexes[i];

        var controlBit = 0;
        var controlBitVal = 0;
        var corrBits = [];
        for (j = (bitKey - 1); j < inputArr.length; j += (2 * bitKey)) {
            for (m = 0; m < bitKey && j + m < inputArr.length; m++) {
                corrBits.push(j + m);
                //table += '<td class="control-bit">' + arr[j + m] + '</td>';
                //controlBits.push(arr[j + m]);
                controlBit += parseInt(inputArr[j + m]);
                controlBitVal = (controlBit % 2);
            }
        }

        for (let j = 0; j < arr.length; j++) {
            if (corrBits.indexOf(j) > -1) {
                table += '<td>' + arr[j] + '</td>';
            } else {
                table += '<td></td>';
            }
        }

        

        table += '<td class="add-info">' + bitKey + '</td><td class="add-info">' + controlBit + '</td><td class="add-info">' + controlBitVal + '</td></tr>';
    }


    table += '</tr>';

    table += '</table>';
    $('.js-encode-process').html(table);


    var str = '';

    for (i = 0; i < arr.length; i++) {
        if (controlBitsIndexes.indexOf(i+1) > -1) {
            str += '<span class="control-bit">'+arr[i]+'</span>';
        } else {
            str += arr[i];
        }
    }

    $('.js-control-bits').html(str);
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
        console.log('l / i', (l / i));
        controlBitsIndexes.push(i);
        i *= 2;
    }

    console.log('controlBitsIndexes', controlBitsIndexes);

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
    var i = 1;
    var output = hammingPureDecode(input);
    var inputFixed = hammingEncode(output);

    var l = output.length;

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

    showDecode(input.split(''), inputFixed.split(''), fixedEncodedStr.split(''));

    return hammingPureDecode(fixedEncodedStr);
}

function showDecode(inArr, newArr, resArr) {
    var table = '<table cellspacing="0" class="enc-table"><tr>';
    console.log(inArr);
    //console.log(hammingPureDecode(inArr));
    var controlBitsIndexes = getControlBits(hammingPureDecode(inArr.join('')));

    for (i = 0; i < inArr.length; i++) {
        table += '<th>' + (i + 1) + '</th>';
    }

    table += '</tr><tr>';

    var sumBits = [];
    for (i = 0; i < inArr.length; i++) {
        var addClass = '';

        if (controlBitsIndexes.indexOf(i+1) > -1) {
            addClass = 'class="control-bit';
            if (inArr[i] !== newArr[i]) {
                addClass += ' check-bit';
                sumBits.push(i+1);
            }
            addClass += '"';
        }

        table += '<th ' + addClass +'>' + inArr[i] + '</th>';
    }

    table += '</tr><tr>';

    for (i = 0; i < newArr.length; i++) {
        var addClass = '';

        if (controlBitsIndexes.indexOf(i+1) > -1) {
            addClass = 'class="control-bit';
            if (inArr[i] !== newArr[i]) {
                addClass += ' check-bit';
            }
            addClass += '"';
        }

        table += '<th ' + addClass +'>' + newArr[i] + '</th>';
    }

    table += '</tr></table>';

    $('.js-calc-bits').html(table);

    
    var str = '';
    var sum = 0;
    if (sumBits.length > 0) {
        str += 'Рахуємо позицію невірного біту: '
        for (i = 0; i < sumBits.length; i++) {
            if (i == 0) {
                str += sumBits[i];
            } else {
                str += ' + ' + sumBits[i];
            }

            sum = sum + parseInt(sumBits[i]);
        }

        str += ' = ' + sum + ' та заміяємо його на протилежний.';
    }

    $('.js-sum-control-bits').html(str);


    //Result table
    var resTable = '<table cellspacing="0" class="enc-table">';

    for (i = 0; i < inArr.length; i++) {
        resTable += '<th>' + (i + 1) + '</th>';
    }

    resTable += '</tr><tr>';

    for (i = 0; i < resArr.length; i++) {
        var addClass = 'class="';

        if (controlBitsIndexes.indexOf(i+1) > -1) {
            addClass = 'control-bit';
        }

        if ((i + 1) == sum) {
            addClass += 'res-bit check-bit';
        }
        addClass += '"';
        resTable += '<th ' + addClass +'>' + resArr[i] + '</th>';
    }

    resTable += '</tr></table>';

    $('.js-bits-decode-res').html(resTable);
}

function getControlBits(input) {
    var controlBitsIndexes = [];
    var l = input.length;
    var i;

    i = 1;
    while (l / i >= 1) {
        controlBitsIndexes.push(i);
        i *= 2;
    }

    return controlBitsIndexes;
}

function hammingCheck(input) {
    if (typeof input !== "string" || input.match(/[^10]/)) {
        return console.error(
            'hamming-code error: input should be binary string, for example "101010"'
        );
    }
    console.log(hammingPureDecode(input));

    var inputFixed = hammingEncode(hammingPureDecode(input));

    showCheckProcess(input, inputFixed);

    if (inputFixed === input) {
        $('.js-no-errors').show();
        $('.js-has-errors').hide();
    } else {
        $('.js-no-errors').hide();
        $('.js-has-errors').show();
    }

    return !(inputFixed === input);
}

function showCheckProcess(inArr, checkArr) {
    var table = '<table cellspacing="0" class="enc-table"><tr>';
    var controlBitsIndexes = getControlBits(hammingPureDecode(inArr));
    console.log(inArr.length, checkArr.length);
    //Add new empty control bits
    for (i = 0; i < inArr.length; i++) {
        var addClass = '';
        if (controlBitsIndexes.indexOf(i+1) > -1) {
            addClass = 'class="control-bit"';
        }

        table += '<th ' + addClass +'>' + inArr[i] + '</th>';
    }

    table += '</tr><tr>';

    for (i = 0; i < checkArr.length; i++) {
        var addClass = '';
        if (controlBitsIndexes.indexOf(i+1) > -1) {
            addClass = 'class="control-bit"';
        }

        table += '<th ' + addClass +'>' + checkArr[i] + '</th>';
    }

    table += '</tr></table>';

    $('.js-check-process').html(table);
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
    //$('.js-result-noncorrect-code').val(hammingPureDecode(code));
});

$('.js-encoded-code').val('');
$('.js-has-error').text('');
$('.js-result-code').val('');
$('.js-result-noncorrect-code').val('');

})();