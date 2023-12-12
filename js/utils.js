let morseRef = [];
document.addEventListener('DOMContentLoaded', () => {
  console.log('start');
  fetch('/data/morse.json')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      morseRef = data;
      init();
    });
});

const init = () => {
  document.getElementById('morse').addEventListener('touchstart', () => morse(1));
  document.getElementById('morse').addEventListener('touchend', () => morse(0));

  document.addEventListener('keydown', (e) => {
    if(e.keyCode == 32) morse(1);
  });
  document.addEventListener('keyup', (e) => {
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
      document.documentElement.classList.add('press');
      if(hideTime) clearTimeout(hideTime);
      if(letterCut) clearTimeout(letterCut);
      if(wordCut) clearTimeout(wordCut);
      if(!letterMorse.length) document.getElementById('dotdash').textContent = '';
      document.getElementById('dotdash').classList.remove('hide');
      time = new Date().getTime();
      console.log(time);
    } else {
      document.documentElement.classList.remove('press');
      duration = new Date().getTime() - time;
      console.log(duration);
      if(duration < 200) {
        letterMorse += '•';
      } else {
        letterMorse += '–';
      }

      document.getElementById('dotdash').textContent = '';
      for (var i = 0; i < letterMorse.length - 1; i++) {
        let item = document.createElement('p');
        item.textContent = letterMorse.charAt(i);
        if(letterMorse[i] == '–' && letterMorse[i + 1] == '–') {
          item.classList.add('dashdash');
        }
        if(letterMorse[i] == '•' && letterMorse[i + 1] == '•') {
          item.classList.add('dotdot');
        }
        document.getElementById('dotdash').appendChild(item);
      }
      let lastItem = document.createElement('p');
      lastItem.textContent = letterMorse[letterMorse.length - 1];
      document.getElementById('dotdash').appendChild(lastItem);

      hideTime = setTimeout(() => {
        document.getElementById('dotdash').classList.add('hide');
      }, 300);
      letterCut = setTimeout(() => {
        const letter = morse2text(letterMorse).toUpperCase();
        document.getElementById('dotdash').textContent = letter;
        document.getElementById('dotdash').classList.remove('hide');
        if(letter != 'UNDEFINED') {
          let img = document.createElement('img');
          img.src = `/img/letter/${letter}.svg`;
          document.getElementById('morse').appendChild(img);
        }
        letterMorse = '';

        hideTime = setTimeout(() => {
          document.getElementById('dotdash').classList.add('hide');
        }, 500);

        wordCut = setTimeout(() => {
          document.getElementById('dotdash').textContent = '<SPACE>';
          document.getElementById('dotdash').classList.remove('hide');
          let img = document.createElement('img');
          img.src = "/img/letter/EMPTY.svg";
          document.getElementById('morse').appendChild(img);
          setTimeout(() => {
            document.getElementById('dotdash').classList.add('hide');
          }, 10);
        }, 600);
      }, 400);
    }
  }
}