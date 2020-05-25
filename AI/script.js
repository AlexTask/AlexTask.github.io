(function() {
const randomAccuracy = 10000;
const texts = {
    'start': ['Бот приєднався до чату', "Бот зайшов у цей чат"],
    'hi': ['Привіт', "Доброго дня", "Вітаю"],
    'ask_name': ['Як до вас звертатись?', "Дозвольте поцікавитися, як вас звати?", "Як ваше ім'я?"],
    'welcome': ['{0}, дуже приємно', "{0}, приємно познайомитись"],
    'ask_games': ['Вас цікавлять комп`ютерні ігри?', "Часто граєте в ігри?"],
    'fail_games': ['{0}, це не біда, всі колись пичинають', "{0}, обов'язково спробуйте, вам сподобається!", "Інколи таке буває, я вірю що вам {0} це сподобається"],
    'fail_games_2': ['Я розповім як це цікаво', "Це дуже цікаво, я розповім."],
    'ok_games': ['Дуже добре!', "Я теж!", "Мені теж подобається грати"],
    'null_games': ['Не зрозумів, можете перефразувати?', "Я не розумію вас(", "{0}, я вас не розумію."],
    'game': ['Мені подобається гра The Elder Scrolls V: Skyrim, а вам?', "Я впевнений що ви грали в The Elder Scrolls V: Skyrim, грали?", "Розповісти вам про The Elder Scrolls V: Skyrim?"],
    'fail_game_info': ['Навіщо ви так? Я ж готувався', "Не цікаво? Але я знаю тільки цю гру"],
    'fail_game_info2': ['Може розповісти?', "Я все одно розповім, добре?"],
    'ok_game': ['Добре!'],
    'ok_game2': ['The Elder Scrolls V: Skyrim - рольова відеогра, розроблена Bethesda Game Studios і опублікована Bethesda Softworks. Це п`ята гра в серії The Elder Scrolls, попередньою була The Elder Scrolls IV: Oblivion. Гра вийшла 11 листопада 2011 для Microsoft Windows, PlayStation 3 та Xbox 360. Влітку 2016 було анонсоване перевидання The Elder Scrolls V: Skyrim – Special Edition зі значно покращенною графікою. Реліз перевидання відбувся 28 жовтня 2016 для платформ PC, PlayStation 4 та Xbox One. Власники повної ліцензійної гри на PC отримали перевидання безкоштовно. Головна лінія сюжету Skyrim присвячена намаганням головного героя перемогти дракона Алдуїна, старшого сина головного бога Тамріеля Акатоша. За пророцтвом Алдуїн знищить світ. Події гри відбуваються в провінції Скайрім через 200 років після подій Oblivion. У той час у Скайрімі починається громадянська війна, що розпочалася з убивства Верховного короля. Skyrim має відкритий світ, як це властиво всій серії ігор The Elder Scrolls. Гравець може при бажанні досліджувати світ, чи виконувати додаткові завдання, замість виконання завдань основного квесту. '],
    'final': ["{0}, вам сподобалося спілкування зі мною?", "{0}, вам сподобалася ця розмова?", "{0}, ви будете інколи зі мною спілкуватися?"],
    'final_ok': ['Добре, дякую за розмову.', "Дякую, гарного дня!"],
    'final_fail': ['ок, самоформотуюся.', "Зрозумів, мені прикро."],
    'final_null': ['добре, виходжу с чату.'],
    'end': ['Бот залишив чат.']
}

let restartState = 0;
let name = '';

let progress = [
{
    id: 'hi',
    passed: false,
    pretext: 'start',
    cb: () => {progress[getStepByID('hi')].passed = true}
},
{
    id: 'ask_name',
    passed: false,
    cb: str => {name = str; sendToHuman(getText('welcome', name)); progress[getStepByID('ask_name')].passed = true} 
}, 
{
    id: 'ask_games',
    passed: false,
    success: ['Так',"Да","Інколи","буває"],
    fail: ['ні'],
    successcb: () => {sendToHuman(getText('ok_games')); progress[getStepByID('ask_games')].passed = true},
    failcb: () => {sendToHuman(getText('fail_games', name)); sendToHuman(getText('fail_games_2', name)); progress[getStepByID('ask_games')].passed = true},
    nullcb: () => {sendToHuman(getText('null_games', name));}
},
{
    id: 'game',
    passed: false,
    success: ['Так',"Да","подобається"],
    fail: ['ні'],
    successcb: () => {sendToHuman(getText('ok_game')); sendToHuman(getText('ok_game2'));},
    failcb: () => {sendToHuman(getText('fail_game_info', name));},
    nullcb: () => {sendToHuman(getText('null_games', name));}
},
{
    id: 'final',
    passed: false,
    success: ['Так',"Да","подобається"],
    fail: ['ні'],
    textfunc: () => getText('final').replace('{0}', name),
    successcb: () => {sendToHuman(getText('final_ok', name)); sendToHuman(getText('end'));},
    failcb: () => {sendToHuman(getText('final_fail', name));  sendToHuman(getText('end'));},
    nullcb: () => {sendToHuman(getText('final_null', name));  sendToHuman(getText('end')); progress[getStepByID('final')].passed = true}
}
]; 

const getRandomInt = (minValue, maxValue) => {
    if (minValue > maxValue) {
      return NaN;
    }
  
    var rand = Math.floor(Math.random() * randomAccuracy) % (maxValue + 1);
    if (minValue) {
      while (rand < minValue) {
        rand = Math.floor(Math.random() * randomAccuracy) % (maxValue + 1);
      }
    }
    return rand;
}

const getText = (id, var1, var2, var3) => {
    let length = texts[id].length;
    let rand = getRandomInt(0, length - 1);
    console.log('На запрос', id, "Знайдені варианти");
    console.log(texts[id]);
    console.log('Обрано варіант', rand);

    let text = texts[id][rand];
    if (var1) {
        text = text.replace('{0}', var1);
    }
    if (var2) {
        text = text.replace('{1}', var1);
    }
    if (var3) {
        text = text.replace('{2}', var1);
    }

    return text;
}

const showMessage = (message, from) => {
    $('.js-chat').append('<p><span>' + from + ':</span> '+message+'</p>');
}

const sendToHuman = message => {
    showMessage(message, 'Бот');
}

const getStateStep = () => {
    let stateid = 0;
    let l = progress.length;
    for (let i=0;i<l;i++) {
        if(progress[i].passed) {
            stateid++;
        } else {
            break;
        }
    }

    if (stateid >= progress.length) {
        stateid = restart();
    }
    return stateid;
}

const getStepByID = (id) => {
    let stateid = 0;
    let l = progress.length;
    for (let i=0;i<l;i++) {
        if(progress[i].id == id) {
            break
        } else {
            stateid++;
        }
    }

    return stateid;
}

const prepareMessageForHuman = () => {
    let step = progress[getStateStep()];
    if (step.pretext) {
        sendToHuman(getText(step.pretext));
    }

    let text = getText(step.id);
    if (step.textfunc) {
        text = step.textfunc();
    }

    sendToHuman(text);
}

const sendToBot = message => {
    let step = progress[getStateStep()];
    let done = false;
    if (typeof step.cb == 'function') {
        step.cb(message);
        done = true;
    }
    if (!done && step.success) {
        let l = step.success.length;
        for (let i=0;i<l;i++) {
            if (message.toLowerCase() == step.success[i].toLowerCase()) {
                step.passed = true;
                step.successcb && step.successcb(message);
                done = true;
                break;
            }
        }
    }

    if (!done && step.fail) {
        let l = step.fail.length;
        for (let i=0;i<l;i++) {
            if (message.toLowerCase() == step.fail[i].toLowerCase()) {
                step.failcb && step.failcb(message);
                done = true;
                break;
            }
        }
    }

    if (!done && step.nullcb) {
        step.nullcb(message);
        done = true;
    }

    prepareMessageForHuman();
}

const sendHumanMessage = message => {
    if(!message) {
        return;
    }
    
    showMessage(message, 'Ви');
    sendToBot(message);
}

const restart = () => {
    let l = progress.length;
    for (let i=restartState;i<l;i++) {
        progress[i].passed = false;
    }
    return restartState;
}

const init = () => {
    //sendToHuman(getText('hi'));
    prepareMessageForHuman()
}

init();


$(".js-send-btn").on("click", function () {
    sendHumanMessage($('.js-input-str').val());
});

document.onkeydown = (e) => {
    e = e || window.event;
    if (e.keyCode === 13) {
        sendHumanMessage($('.js-input-str').val());
    }
}




})();