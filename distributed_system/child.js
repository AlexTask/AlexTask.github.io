const data = JSON.parse(process.argv[2]);

var count = 0;
for(var i=0;i<data.arr1.length;i++) {
  if(data.arr2.indexOf(data.arr1[i]) > -1) {
    count++
  }
}

console.log(`[result]${count}=${process.argv[3]}`);
