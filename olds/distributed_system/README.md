Завдання:
Написати паралельну програму для знаходження кількості спільних
елементів двох числових масивів (значень, які зустрічаються в обох масивах)

Програма створює масив випадкових чисел дліною 200000 елементів і звіряє його з статичним масивом (задан в коді).

Для розрахунку програма розділяє великий масив на масиви до 500 елементів і кожен отриманий масив відправляє в окремий процес для обрахунку.

Після виконання підпроцес повертає дані до основної програми.
Програма підраховує отримані результати и по закінченню роботи виводить результат.

Результат роботи програми [тут](https://github.com/AlexTask/AlexTask.github.io/blob/master/distributed_system/result.txt)

Програма пріцює на node.js тому для запуску потрібно виконати такі команди:

npm install

node main.js
