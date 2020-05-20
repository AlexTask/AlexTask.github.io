var minStarsCount = 500,
  maxStarsCount = 3000,
  randomAccuracy = 10000,
  minStarSize = 2,
  maxStarSize = 50,
  documentWidth = 300,
  documentHeight = 300,
  starsArr = [],
  minDist = 2,
  generateCount = 100;

//Random int Geterator
function getRandomInt(minValue, maxValue) {
  if (minValue >= maxValue) {
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

function generateColor() {
  var colorMap = {
    10: 'A',
    11: 'B',
    12: 'C',
    13: 'D',
    14: 'E',
    15: 'F'
  };

  var resArr = [];

  for (let i = 0; i < 6; i++) {
    var c = getRandomInt(0, 15);
    if (c > 9) {
      c = colorMap[c];
    }
    resArr.push(c);
  }

  return resArr.join('');
}

function generateStar() {
  let star = {
    top: getRandomInt(0, documentWidth),
    left: getRandomInt(0, documentHeight),
    size: getRandomInt(minStarSize, maxStarSize),
    color: generateColor()
  }
  star.style = getStarStyle(star);

  return star;
}

function isCollided(circle0, circle1) {
  var minDistance = circle0.radius + circle1.radius + minDist;

  var dx = circle0.x - circle1.x;
  var dy = circle0.y - circle1.y;

  var dist = Math.sqrt(dx * dx + dy * dy);

  return dist < minDistance;
}

function checkNewStar(stars, star) {
  let res = true;
  let radius = star.size / 2;
  let newStar = {
    x: star.left + radius,
    y: star.top + radius,
    radius: radius
  }

  for (let i = 0; i < stars.length; i++) {
    let rad = stars[i].size / 2;
    let starPos = {
      x: stars[i].left + rad,
      y: stars[i].top + rad,
      radius: rad
    }

    if (isCollided(newStar, starPos)) {
      res = false;
      break;
    }

  }

  return res;
}

function generateMap(maxCount) {
  var stars = [];
  var maxItarations = maxCount * 20;
  for (var i = 0; stars.length < maxCount; ++i) {
    var star = generateStar();
    if (checkNewStar(stars, star)) {
      stars.push(star);
    }
    maxItarations++;
    if (i > maxItarations) {
      break;
    }
  }
  return stars;
}

function getStarStyle(star) {
  return 'top:' + star.top + 'px;left:' + star.left + 'px;width:' + star.size + 'px;height:' + star.size + 'px;border-radius:' + (star.size / 2) + 'px;background-color:#' + star.color + ';';
}

function init() {
  generateCount = getRandomInt(minStarsCount, maxStarsCount);
  console.log('Stars count: ', generateCount);

  starsArr = generateMap(generateCount);

  showMap();
}


//-----------------UI-------------------

function showMap() {
  jQuery('.js_space').html(tmpl("stars_tmpl", starsArr)).trigger('create');
}

$(document).ready(function () {
  documentWidth = $(document).width();
  documentHeight = $(document).width();

  init();

  $('.js-stars-count').text(generateCount);
  $('.js-minStarsCount').text(minStarsCount);
  $('.js-maxStarsCount').text(maxStarsCount);
  $('.js-minStarSize').text(minStarSize);
  $('.js-maxStarSize').text(maxStarSize);
});