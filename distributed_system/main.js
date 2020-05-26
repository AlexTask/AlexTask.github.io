const { spawn } = require('child_process');
const arr1Length = 20000;
const maxArrayForChild = 500;

// Рахуємо кількість потоків
var childCount = Math.round((arr1Length / maxArrayForChild)) + 1;
var testArr1 = [];

// Заповнюємо массив випадковими значеннями
for(var i=0;i<arr1Length;i++) {
    testArr1.push(getRandomInt(0, 10));
}

// Другий массив у якому шукаємо співпадіння 
const testArr2 = [7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4,7,6,5,4,3,4,4,3,3,4,5,6,5,4,5,6,6,4];

var childPool = [];

console.log(`Program started with:\nArray 1 length: ${testArr1.length}\nArray 2 length: ${testArr2.length}\n\n`);

// Створюємо child процеси
for (var i=0;i<childCount;i++) {
    var part = Math.round(testArr1.length / childCount);

    if (i == childCount-1) {
        arr1 = testArr1.slice(part * i, testArr1.length);
    } else {
        arr1 = testArr1.slice(part * i, part * i + part);
    }
    
    var reqObj = {
        arr1: arr1,
        arr2: testArr2
    };

    childPool.push(spawn('cmd.exe', ['/c', `node child.js ${JSON.stringify(reqObj)} ${i}`]));
    console.log(`Child process ${i} started with:\nArray 1 length: ${arr1.length}\nArray 2 length: ${testArr2.length}\n`);
}

var result = 0;
var finished = 0;

//Створюємо хендлери child процесів
for (var i=0;i<childPool.length;i++) {
    var child = childPool[i];

    //Обробляємо результат
    child.stdout.on('data', (data) => {
        var res = data.toString();
        if (res.indexOf('[result]') == 0) {
            var resArr = res.replace('[result]','').replace('\n','').split('=');

            var res = parseInt(resArr[0]);
            result += res;
            console.log(`Child ${resArr[1]} sent calculation result: ${res}`);
        }
    });

    //Обробляємо завершення роботи
    child.on('exit', (code) => {
        console.log(`Child process finished ${code == 0 ? 'successfully' : 'with error'}`);
        finished++;
    });
}

//Перевіряємо статус процессів
var interval = setInterval(function() {
    if (finished >= childPool.length) {
        console.log('\n\nCalculation result:', result);
        clearInterval(interval);
    } else {
        console.log(`Finished ${finished} child processes from ${childPool.length}`);
    }
}, 100);



//Генератор випадкових значень для заповнення масиву
function getRandomInt(minValue, maxValue) {
    var randomAccuracy = 1000;

    if (minValue >= maxValue) {
      console.log(minValue, maxValue, minValue >= maxValue);
      debugger;
      return NaN;
    }
  
    var rand = Math.floor(Math.random() * randomAccuracy) % maxValue;
    if (minValue) {
      while (rand < minValue) {
        rand = Math.floor(Math.random() * randomAccuracy) % maxValue;
      }
    }
    return rand;
  }