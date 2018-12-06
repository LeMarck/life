let cellSize = 10;
let isPlay = false;

if (/Android|iPhone|Mobile/gi.test(navigator.userAgent)) {
    cellSize = 20;
    document.body.classList.add('mobile');
}

const area = document.querySelector('.game');
const canvas = document.querySelector('.game__area');

canvas.width = area.offsetWidth;
canvas.height = area.offsetHeight;

const x = Math.round(area.offsetWidth / cellSize);
const y = Math.round(area.offsetHeight / cellSize);

const game = new Life(canvas, { cellSize, x, y });

const startBtn = document.querySelector('.button__start');
const randomBtn = document.querySelector('.button__random');
const clearBtn = document.querySelector('.button__clear');

const start = () => {
    game.start();
    startBtn.classList.add('button__stop');
    isPlay = true;
};

const stop = () => {
    game.stop();
    startBtn.classList.remove('button__stop');
    isPlay = false;
};

canvas.addEventListener('click', stop);

startBtn.addEventListener('click', _ => {
    (isPlay ? stop : start)();
});

clearBtn.addEventListener('click', _ => {
    stop();
    game.clear();
});

randomBtn.addEventListener('click', _ => {
    game.addFigure(
        0, 0, Array(y).fill(Array(x).fill(0))
            .map(line => line.map(() => (Math.random() / Math.random()) > 0.3 ? 0 : 1))
    );
});
