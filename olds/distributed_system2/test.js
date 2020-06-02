var V = [2,40,0,5,8,4,0];

var dob = 1;
var avr = 0;
var sum = 0;
var count = 0;

for (var i=0;i<V.length;i++) {
    if (V[i] != 0) {
        dob *= V[i];
    }

    if (V[i] < 10) {
        sum += V[i];
        count++;
    }
}

avr = sum / count;

console.log(`Добуток: ${dob}, середнє арифметичне: ${avr}`);