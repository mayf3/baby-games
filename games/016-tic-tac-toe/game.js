// 井字棋游戏 - 无状态设计
// 所有游戏状态存储在内存中，无需后端

class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        this.statusDisplay = document.getElementById('status');
        this.restartBtn = document.getElementById('restartBtn');
        this.cells = document.querySelectorAll('.cell');

        this.init();
    }

    init() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        this.restartBtn.addEventListener('click', () => this.restartGame());

        this.updateStatus();
    }

    handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (this.board[clickedCellIndex] !== '' || !this.gameActive) {
            return;
        }

        this.handleCellPlayed(clickedCell, clickedCellIndex);
        this.handleResultValidation();
    }

    handleCellPlayed(clickedCell, clickedCellIndex) {
        this.board[clickedCellIndex] = this.currentPlayer;
        clickedCell.textContent = this.currentPlayer;
        clickedCell.classList.add('taken', this.currentPlayer.toLowerCase());
    }

    handleResultValidation() {
        let roundWon = false;
        let winningLine = [];

        for (let i = 0; i < this.winningConditions.length; i++) {
            const [a, b, c] = this.winningConditions[i];
            if (this.board[a] === '' || this.board[b] === '' || this.board[c] === '') {
                continue;
            }
            if (this.board[a] === this.board[b] && this.board[b] === this.board[c]) {
                roundWon = true;
                winningLine = [a, b, c];
                break;
            }
        }

        if (roundWon) {
            this.highlightWinningCells(winningLine);
            this.statusDisplay.textContent = `🎉 玩家 ${this.currentPlayer} 获胜！`;
            this.gameActive = false;
            return;
        }

        if (!this.board.includes('')) {
            this.statusDisplay.textContent = '🤝 平局！';
            this.gameActive = false;
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    highlightWinningCells(winningLine) {
        winningLine.forEach(index => {
            this.cells[index].classList.add('winning');
        });
    }

    updateStatus() {
        this.statusDisplay.textContent = `轮到玩家 ${this.currentPlayer}`;
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;

        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('taken', 'x', 'o', 'winning');
        });

        this.updateStatus();
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
