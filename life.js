/**
 * Игра "Жизнь"
 */

const NEIGHBORING_CELLS = [
    [-1, -1], [-1, 0], [-1, 1], [1, -1],
    [1, 0], [1, 1], [0, 1], [0, -1]
];

class Life {
    /**
     * Инициализация игры
     *
     * @param canvas игровое поле
     * @param [opts]
     * @param [opts.cellSize] размер клетки (default = 10px)
     * @param [opts.x] количество клеток по вертикали (default = 70)
     * @param [opts.y] количество клеток по горизонтали (default = 70)
     * @param [opts.color] количество клеток по горизонтали (default = 70)
     */
    constructor(canvas, opts) {
        opts = opts || {};

        this.cellSize = opts.cellSize || 10;
        this.x = opts.x || 70;
        this.y = opts.y || 70;

        this.canvas = canvas;
        this.canvas.addEventListener('click', this._changePoint.bind(this));

        this.ctx = canvas.getContext('2d');
        this.ctx.fillStyle = opts.color || '#444';

        this.clear();
    }

    /**
     * Обработка киков по игровому полю.
     * Меняет цвет клекти на противоположный.
     *
     * @param event
     * @private
     */
    _changePoint(event) {
        const x = Math.floor((event.pageX - event.currentTarget.offsetLeft) / this.cellSize);
        const y = Math.floor((event.pageY - event.currentTarget.offsetTop) / this.cellSize);

        this.stop();
        this.area[y][x] = !this.area[y][x];
        this._draw();
    }

    /**
     * Закрашивает клетку
     *
     * @param x
     * @param y
     * @private
     */
    _fillRect(x, y) {
        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }

    /**
     * Отрисовка игрового поля
     *
     * @private
     */
    _draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.area.forEach((line, y) => line.forEach((cell, x) => cell && this._fillRect(x, y), this), this);
    }

    /**
     * Проверка клетки на её "живость"
     *
     * @param pointX
     * @param pointY
     * @returns {boolean}
     * @private
     */
    _isAlive(pointX, pointY) {
        const count = NEIGHBORING_CELLS.reduce((sum, diff) => {
            const x = pointX - diff[0];
            const y = pointY - diff[1];

            return (x < 0 || x >= this.area[0].length || y < 0 || y >= this.area.length) ?
                sum : sum + this.area[y][x];
        }, 0);

        return this.area[pointY][pointX] ? (count === 2 || count === 3) : count === 3;
    }

    /**
     * Вставка фигуры
     *
     * @param x
     * @param y
     * @param matrix фигу заданная матрицей
     */
    addFigure(x, y, matrix) {
        if (x + matrix[0].length > this.x || y + matrix.length > this.y) return;

        for (let index = 0; index < matrix.length; index++) {
            this.area[index + y] = this.area[index + y].slice(0, x)
                .concat(matrix[index], this.area[index + y].slice(matrix[index].length, this.x));
        }

        this._draw();
    }

    /**
     * Запуск игры
     *
     * @param tick миллисекунды
     */
    start(tick) {
        if (this.game) return;

        this.game = setInterval(self => {
            self.area = self.area.map((row, y) => row.map((cell, x) => self._isAlive(x, y)));
            self._draw();
        }, tick || 100, this);
    }

    /**
     * Остановка игры
     */
    stop() {
        if (this.game) {
            clearInterval(this.game);
            this.game = null;
        }
    }

    /**
     * Очистка игрового поля
     */
    clear() {
        this.area = Array(this.y).fill(0).map(() => Array(this.x).fill(0));
        this._draw();
    }
}
