const generateRandomString = (num) => {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const idx = generateRandomString(20);

const socket = io();
socket.on('connect', () => {
  console.log('connected');
}).on('key', (data) => {
  if(data.idx == idx) return;
  if(data.key == 'EMPTY') $('#morse').append(`<img src="/img/letter/EMPTY.svg">`);
  else $('#morse').append(`<img src="/img/letter/${data.key}.svg">`);
});

let morseRef = [];
$(document).ready(() => {
  console.log('start');
  $.ajax({
    url: '/data/morse.json',
    dataType: 'json',
    success: (data) => { console.log(data);
      morseRef = data;
      init();
    }
  })
});

const init = () => {
  $('#morse').on('touchstart', function() {
    morse(1);
  }).on('touchend', function() {
    morse(0);
  });

  $(document).on('keydown', (e) => {
    if(e.keyCode == 32) morse(1);
  }).on('keyup', (e) => {
    if(e.keyCode == 32) morse(0);
  });

  const morse2text = (morse) => {
    if(Object.keys(morseRef).indexOf(morse) > -1) {
      return morseRef[morse];
    } else {
      return 'UNDEFINED';
    }
  };

  let time = 0;
  let preType = 0;
  let letterMorse = '';
  let [hideTime, letterCut, wordCut] = [null, null, null];
  const morse = (type) => {
    if(preType == type) return;
    preType = type;
    if(type) {
      $('html').addClass('press');
      if(hideTime) clearTimeout(hideTime);
      if(letterCut) clearTimeout(letterCut);
      if(wordCut) clearTimeout(wordCut);
      if(!letterMorse.length) $('#dotdash').text('');
      $('#dotdash').removeClass('hide');
      time = new Date().getTime();
      console.log(time);
    } else {
      $('html').removeClass('press');
      duration = new Date().getTime() - time;
      console.log(duration);
      if(duration < 200) {
        letterMorse += '•';
      } else {
        letterMorse += '–';
      }

      $('#dotdash').text('');
      for (var i = 0; i < letterMorse.length - 1; i++) {
        $item = $(`<p>${letterMorse.charAt(i)}</p>`);
        if(letterMorse[i] == '–' && letterMorse[i + 1] == '–') {
          $item.addClass('dashdash');
        }
        if(letterMorse[i] == '•' && letterMorse[i + 1] == '•') {
          $item.addClass('dotdot');
        }
        $('#dotdash').append($item);
      }
      $('#dotdash').append($(`<p>${letterMorse[letterMorse.length - 1]}</p>`));

      hideTime = setTimeout(() => {
        $('#dotdash').addClass('hide');
      }, 300);
      letterCut = setTimeout(() => {
        const letter = morse2text(letterMorse).toUpperCase();
        $('#dotdash').text(letter).removeClass('hide');
        if(letter != 'UNDEFINED') {
          $('#morse').append(`<img src="/img/letter/${letter}.svg">`);
          socket.emit('key', {
            'idx': idx,
            'key': letter
          });
        }
        letterMorse = '';

        hideTime = setTimeout(() => {
          $('#dotdash').addClass('hide');
        }, 500);

        wordCut = setTimeout(() => {
          $('#dotdash').text('<SPACE>').removeClass('hide');
          $('#morse').append(`<img src="/img/letter/EMPTY.svg">`);
          socket.emit('key', {
            'idx': idx,
            'key': 'EMPTY'
          });
          setTimeout(() => {
            $('#dotdash').addClass('hide');
          }, 10);
        }, 600);
      }, 400);
    }
  }
}