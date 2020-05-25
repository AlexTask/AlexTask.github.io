function main(count) {
    var min, max;

    for (var i=0;i<count;i++) {
        var res = Math.random() * Math.random();
        if (i == 0) {
            max = min = res;
        }

        if (min > res) {
            min = res;
        }

        if (max < res) {
            max = res;
        }
    }

    console.log('Count:', count, 'Min:', min, 'Max:', max);
}

main(100);
main(1000);
main(10000);
main(100000);


Count: 10 Min: 0.01562707245697693 Max: 0.6384850391382543
Count: 100 Min: 0.0003228151378212605 Max: 0.9695134553255528
Count: 1000 Min: 0.00007314765975369387 Max: 0.9565495796894083
Count: 10000 Min: 0.00000005371391283653 Max: 0.9940544396719087