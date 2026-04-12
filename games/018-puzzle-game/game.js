// 拼图游戏主逻辑
class PuzzleGame {
    constructor() {
        this.currentLevel = 1;
        this.moves = 0;
        this.placedPieces = 0;
        this.totalPieces = 0;
        this.draggedPiece = null;
        this.currentPattern = null;

        // 关卡配置
        this.levels = [
            {
                gridSize: 2,
                patterns: [
                    { type: 'circle', color: '#FF6B6B' },
                    { type: 'square', color: '#4ECDC4' },
                    { type: 'triangle', color: '#FFE66D' },
                    { type: 'star', color: '#95E1D3' }
                ]
            },
            {
                gridSize: 3,
                patterns: [
                    { type: 'cat', color: '#FF6B6B' },
                    { type: 'dog', color: '#4ECDC4' },
                    { type: 'rabbit', color: '#FFE66D' },
                    { type: 'bird', color: '#95E1D3' },
                    { type: 'fish', color: '#DDA0DD' },
                    { type: 'sun', color: '#FFD93D' },
                    { type: 'moon', color: '#6BCF7F' },
                    { type: 'flower', color: '#FF69B4' },
                    { type: 'tree', color: '#32CD32' }
                ]
            },
            {
                gridSize: 4,
                patterns: [
                    { type: 'house', color: '#FF6B6B' },
                    { type: 'car', color: '#4ECDC4' },
                    { type: 'boat', color: '#FFE66D' },
                    { type: 'airplane', color: '#95E1D3' },
                    { type: 'butterfly', color: '#DDA0DD' },
                    { type: 'heart', color: '#FF69B4' },
                    { type: 'cloud', color: '#87CEEB' },
                    { type: 'rainbow', color: '#FFB6C1' },
                    { type: 'mountain', color: '#8FBC8F' },
                    { type: 'apple', color: '#FF4444' },
                    { type: 'banana', color: '#FFE135' },
                    { type: 'grape', color: '#9370DB' },
                    { type: 'orange', color: '#FFA500' },
                    { type: 'strawberry', color: '#FF1493' },
                    { type: 'watermelon', color: '#32CD32' },
                    { type: 'pineapple', color: '#FFD700' }
                ]
            }
        ];

        this.init();
    }

    init() {
        this.loadLevel(this.currentLevel);
        this.bindEvents();
    }

    loadLevel(levelNum) {
        const level = this.levels[levelNum - 1];
        this.currentPattern = level.patterns;
        this.totalPieces = level.gridSize * level.gridSize;
        this.moves = 0;
        this.placedPieces = 0;

        // 更新UI
        document.getElementById('level').textContent = levelNum;
        document.getElementById('moves').textContent = '0';
        document.getElementById('progress').style.width = '0%';

        // 设置网格
        this.setupPuzzleBoard(level.gridSize);

        // 创建拼图块
        this.createPieces(level.patterns);

        // 显示预览
        this.showPreview(level.patterns, level.gridSize);

        // 更新说明
        this.updateInstructions();
    }

    setupPuzzleBoard(gridSize) {
        const board = document.getElementById('puzzle-board');
        board.innerHTML = '';
        board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        for (let i = 0; i < gridSize * gridSize; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.index = i;
            board.appendChild(slot);
        }
    }

    createPieces(patterns) {
        const pool = document.getElementById('pieces-pool');
        pool.innerHTML = '';

        // 打乱顺序
        const shuffled = [...patterns].sort(() => Math.random() - 0.5);

        shuffled.forEach((pattern, index) => {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.draggable = true;
            piece.dataset.patternIndex = patterns.indexOf(pattern);

            // 设置拼图块大小（根据网格）
            const level = this.levels[this.currentLevel - 1];
            const size = 350 / level.gridSize;
            piece.style.width = `${size}px`;
            piece.style.height = `${size}px`;

            // 创建SVG图案
            piece.innerHTML = this.createPatternSVG(pattern, size);

            pool.appendChild(piece);
        });
    }

    createPatternSVG(pattern, size) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('class', 'piece-pattern');

        let content = '';

        switch(pattern.type) {
            case 'circle':
                content = `<circle cx="50" cy="50" r="40" fill="${pattern.color}"/>`;
                break;
            case 'square':
                content = `<rect x="15" y="15" width="70" height="70" rx="5" fill="${pattern.color}"/>`;
                break;
            case 'triangle':
                content = `<polygon points="50,15 15,85 85,85" fill="${pattern.color}"/>`;
                break;
            case 'star':
                content = `<polygon points="50,10 61,35 88,35 66,55 75,80 50,65 25,80 34,55 12,35 39,35" fill="${pattern.color}"/>`;
                break;
            case 'cat':
                content = `
                    <ellipse cx="50" cy="55" rx="35" ry="30" fill="${pattern.color}"/>
                    <circle cx="35" cy="35" r="8" fill="${pattern.color}"/>
                    <circle cx="65" cy="35" r="8" fill="${pattern.color}"/>
                    <polygon points="30,28 35,40 25,40" fill="${pattern.color}"/>
                    <polygon points="70,28 65,40 75,40" fill="${pattern.color}"/>
                    <circle cx="40" cy="55" r="5" fill="#333"/>
                    <circle cx="60" cy="55" r="5" fill="#333"/>
                    <ellipse cx="50" cy="70" rx="8" ry="5" fill="#FFB6C1"/>
                `;
                break;
            case 'dog':
                content = `
                    <ellipse cx="50" cy="50" rx="30" ry="25" fill="${pattern.color}"/>
                    <ellipse cx="25" cy="45" rx="12" ry="18" fill="${pattern.color}"/>
                    <ellipse cx="75" cy="45" rx="12" ry="18" fill="${pattern.color}"/>
                    <circle cx="40" cy="50" r="5" fill="#333"/>
                    <circle cx="60" cy="50" r="5" fill="#333"/>
                    <ellipse cx="50" cy="62" rx="10" ry="6" fill="#333"/>
                    <polygon points="45,68 50,65 55,68" fill="#FFB6C1"/>
                `;
                break;
            case 'rabbit':
                content = `
                    <ellipse cx="50" cy="55" rx="28" ry="25" fill="${pattern.color}"/>
                    <ellipse cx="40" cy="20" rx="10" ry="30" fill="${pattern.color}"/>
                    <ellipse cx="60" cy="20" rx="10" ry="30" fill="${pattern.color}"/>
                    <circle cx="40" cy="50" r="5" fill="#333"/>
                    <circle cx="60" cy="50" r="5" fill="#333"/>
                    <circle cx="50" cy="60" r="4" fill="#FFB6C1"/>
                `;
                break;
            case 'bird':
                content = `
                    <ellipse cx="50" cy="50" rx="25" ry="20" fill="${pattern.color}"/>
                    <circle cx="65" cy="45" r="12" fill="${pattern.color}"/>
                    <circle cx="68" cy="42" r="3" fill="#333"/>
                    <polygon points="75,45 85,42 85,48" fill="#FFA500"/>
                    <ellipse cx="30" cy="50" rx="15" ry="8" fill="#87CEEB"/>
                    <ellipse cx="70" cy="50" rx="15" ry="8" fill="#87CEEB"/>
                `;
                break;
            case 'fish':
                content = `
                    <ellipse cx="50" cy="50" rx="35" ry="20" fill="${pattern.color}"/>
                    <polygon points="15,50 0,35 0,65" fill="${pattern.color}"/>
                    <circle cx="65" cy="45" r="4" fill="#333"/>
                    <polygon points="70,42 78,40 78,46" fill="#FFA500"/>
                    <path d="M40,50 Q50,40 60,50" stroke="#FFB6C1" stroke-width="2" fill="none"/>
                `;
                break;
            case 'sun':
                content = `
                    <circle cx="50" cy="50" r="25" fill="${pattern.color}"/>
                    ${[0,45,90,135,180,225,270,315].map(angle => 
                        `<line x1="50" y1="20" x2="50" y2="5" stroke="${pattern.color}" stroke-width="5" transform="rotate(${angle} 50 50)"/>`
                    ).join('')}
                    <circle cx="43" cy="45" r="3" fill="#333"/>
                    <circle cx="57" cy="45" r="3" fill="#333"/>
                    <path d="M45,58 Q50,63 55,58" stroke="#333" stroke-width="2" fill="none"/>
                `;
                break;
            case 'moon':
                content = `
                    <circle cx="50" cy="50" r="35" fill="#87CEEB"/>
                    <circle cx="60" cy="50" r="30" fill="${pattern.color}"/>
                    <circle cx="45" cy="42" r="3" fill="#333"/>
                    <circle cx="55" cy="42" r="2" fill="#333"/>
                    <path d="M48,58 Q52,60 56,58" stroke="#333" stroke-width="1.5" fill="none"/>
                `;
                break;
            case 'flower':
                content = `
                    <circle cx="50" cy="50" r="12" fill="#FFD700"/>
                    ${[0,72,144,216,288].map(angle => 
                        `<ellipse cx="50" cy="50" rx="8" ry="25" fill="${pattern.color}" transform="rotate(${angle} 50 50)"/>`
                    ).join('')}
                `;
                break;
            case 'tree':
                content = `
                    <polygon points="50,15 20,60 80,60" fill="#228B22"/>
                    <polygon points="50,35 25,75 75,75" fill="#228B22"/>
                    <rect x="42" y="75" width="16" height="20" fill="#8B4513"/>
                `;
                break;
            case 'house':
                content = `
                    <polygon points="50,15 15,50 85,50" fill="#DC143C"/>
                    <rect x="25" y="50" width="50" height="40" fill="#F5DEB3"/>
                    <rect x="42" y="60" width="16" height="30" fill="#8B4513"/>
                    <circle cx="58" cy="75" r="2" fill="#FFD700"/>
                    <rect x="30" y="55" width="10" height="10" fill="#87CEEB"/>
                    <rect x="60" y="55" width="10" height="10" fill="#87CEEB"/>
                `;
                break;
            case 'car':
                content = `
                    <rect x="20" y="40" width="60" height="30" rx="5" fill="${pattern.color}"/>
                    <rect x="35" y="25" width="30" height="20" rx="3" fill="#87CEEB"/>
                    <circle cx="35" cy="70" r="10" fill="#333"/>
                    <circle cx="65" cy="70" r="10" fill="#333"/>
                    <circle cx="35" cy="70" r="5" fill="#DDD"/>
                    <circle cx="65" cy="70" r="5" fill="#DDD"/>
                `;
                break;
            case 'boat':
                content = `
                    <polygon points="20,60 80,60 70,85 30,85" fill="${pattern.color}"/>
                    <rect x="48" y="30" width="4" height="30" fill="#8B4513"/>
                    <polygon points="52,35 80,50 52,50" fill="#FFF"/>
                `;
                break;
            case 'airplane':
                content = `
                    <ellipse cx="50" cy="50" rx="35" ry="12" fill="${pattern.color}"/>
                    <polygon points="45,50 35,25 65,25 55,50" fill="${pattern.color}"/>
                    <polygon points="50,50 40,75 60,75" fill="${pattern.color}"/>
                    <circle cx="75" cy="50" r="6" fill="#87CEEB"/>
                `;
                break;
            case 'butterfly':
                content = `
                    <ellipse cx="35" cy="50" rx="20" ry="30" fill="${pattern.color}" opacity="0.8"/>
                    <ellipse cx="65" cy="50" rx="20" ry="30" fill="${pattern.color}" opacity="0.8"/>
                    <ellipse cx="50" cy="50" rx="8" ry="25" fill="#333"/>
                    <line x1="50" y1="30" x2="45" y2="20" stroke="#333" stroke-width="2"/>
                    <line x1="50" y1="30" x2="55" y2="20" stroke="#333" stroke-width="2"/>
                    <circle cx="46" cy="45" r="2" fill="#FFF"/>
                    <circle cx="54" cy="45" r="2" fill="#FFF"/>
                `;
                break;
            case 'heart':
                content = `
                    <path d="M50,85 C20,60 10,35 30,25 C40,20 50,30 50,30 C50,30 60,20 70,25 C90,35 80,60 50,85" fill="${pattern.color}"/>
                `;
                break;
            case 'cloud':
                content = `
                    <ellipse cx="35" cy="55" rx="25" ry="18" fill="#FFF"/>
                    <ellipse cx="65" cy="55" rx="25" ry="18" fill="#FFF"/>
                    <ellipse cx="50" cy="45" rx="22" ry="15" fill="#FFF"/>
                    <ellipse cx="40" cy="40" rx="12" ry="10" fill="#FFF"/>
                    <ellipse cx="60" cy="40" rx="12" ry="10" fill="#FFF"/>
                `;
                break;
            case 'rainbow':
                content = `
                    ${['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'].map((color, i) => 
                        `<path d="M15,85 Q50,${20 + i * 5} 85,85" stroke="${color}" stroke-width="6" fill="none"/>`
                    ).join('')}
                `;
                break;
            case 'mountain':
                content = `
                    <polygon points="20,85 50,25 80,85" fill="#8FBC8F"/>
                    <polygon points="10,85 35,45 60,85" fill="#2E8B57"/>
                    <polygon points="40,85 65,50 90,85" fill="#228B22"/>
                    <polygon points="45,35 50,25 55,35" fill="#FFF"/>
                `;
                break;
            case 'apple':
                content = `
                    <circle cx="50" cy="55" r="30" fill="${pattern.color}"/>
                    <path d="M50,25 Q55,20 52,30" stroke="#8B4513" stroke-width="3" fill="none"/>
                    <ellipse cx="58" cy="27" rx="8" ry="5" fill="#228B22"/>
                    <ellipse cx="45" cy="50" r="4" fill="#FFF" opacity="0.5"/>
                `;
                break;
            case 'banana':
                content = `
                    <path d="M30,70 Q50,20 70,70 Q60,75 50,70 Q40,75 30,70" fill="${pattern.color}"/>
                    <path d="M32,68 Q50,25 68,68" stroke="#FFD700" stroke-width="2" fill="none"/>
                `;
                break;
            case 'grape':
                content = `
                    ${[0,1,2,3,4].map(i => 
                        `<circle cx="${40 + i * 5}" cy="35 + i * 10}" r="10" fill="${pattern.color}"/>`
                    ).join('')}
                    ${[0,1,2].map(i => 
                        `<circle cx="${45 + i * 5}" cy="45 + i * 10}" r="10" fill="${pattern.color}"/>`
                    ).join('')}
                    <path d="M50,30 L50,15" stroke="#228B22" stroke-width="2"/>
                    <ellipse cx="52" cy="13" rx="5" ry="3" fill="#228B22"/>
                `;
                break;
            case 'orange':
                content = `
                    <circle cx="50" cy="50" r="35" fill="${pattern.color}"/>
                    <circle cx="40" cy="45" r="3" fill="#FFA500" opacity="0.7"/>
                    <circle cx="60" cy="55" r="2" fill="#FFA500" opacity="0.7"/>
                `;
                break;
            case 'strawberry':
                content = `
                    <path d="M30,30 Q20,50 30,80 Q50,90 70,80 Q80,50 70,30 Q50,20 30,30" fill="${pattern.color}"/>
                    <polygon points="35,30 50,15 65,30 50,35" fill="#228B22"/>
                    ${[0,1,2,3,4,5,6,7,8].map(i => 
                        `<circle cx="${35 + (i % 3) * 15}" cy="${45 + Math.floor(i / 3) * 12}" r="1.5" fill="#FFF"/>`
                    ).join('')}
                `;
                break;
            case 'watermelon':
                content = `
                    <circle cx="50" cy="50" r="35" fill="${pattern.color}"/>
                    <circle cx="50" cy="50" r="30" fill="#FF6B6B"/>
                    ${[0,1,2,3,4].map(i => 
                        `<circle cx="${35 + i * 8}" cy="${40 + (i % 2) * 15}" r="3" fill="#333"/>`
                    ).join('')}
                `;
                break;
            case 'pineapple':
                content = `
                    <ellipse cx="50" cy="55" rx="28" ry="32" fill="${pattern.color}"/>
                    <path d="M30,50 L20,40 M40,45 L35,32 M50,42 L50,28 M60,45 L65,32 M70,50 L80,40" stroke="#228B22" stroke-width="4"/>
                    ${[0,1,2,3,4,5].map(i => 
                        `<circle cx="${35 + (i % 3) * 15}" cy="${50 + Math.floor(i / 3) * 12}" r="2" fill="#8B4513"/>`
                    ).join('')}
                `;
                break;
            default:
                content = `<rect x="10" y="10" width="80" height="80" fill="${pattern.color}"/>`;
        }

        svg.innerHTML = content;
        return svg.outerHTML;
    }

    showPreview(patterns, gridSize) {
        const preview = document.getElementById('preview');
        preview.innerHTML = '';
        preview.style.display = 'grid';
        preview.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        preview.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
        preview.style.gap = '1px';

        patterns.forEach((pattern, index) => {
            const cell = document.createElement('div');
            cell.style.background = '#f5f5f5';
            cell.style.display = 'flex';
            cell.style.justifyContent = 'center';
            cell.style.alignItems = 'center';
            cell.innerHTML = this.createPatternSVG(pattern, 50);
            preview.appendChild(cell);
        });
    }

    updateInstructions() {
        const instructions = [
            '拖拽拼图块到正确的位置',
            '观察目标图案，找到对应的位置',
            '完成后可以点击提示按钮'
        ];
        document.getElementById('instruction-text').textContent = instructions[this.currentLevel - 1] || instructions[0];
    }

    bindEvents() {
        const pool = document.getElementById('pieces-pool');

        // 拖拽事件
        pool.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('puzzle-piece')) {
                this.draggedPiece = e.target;
                e.target.classList.add('dragging');
            }
        });

        pool.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('puzzle-piece')) {
                e.target.classList.remove('dragging');
                this.draggedPiece = null;
            }
        });

        // 放置区域事件
        const board = document.getElementById('puzzle-board');
        board.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        board.addEventListener('drop', (e) => {
            e.preventDefault();
            const slot = e.target.closest('.puzzle-slot');
            if (slot && this.draggedPiece && !slot.hasChildNodes()) {
                this.placePiece(slot, this.draggedPiece);
            }
        });

        // 触摸事件支持
        this.setupTouchEvents();

        // 按钮事件
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.loadLevel(this.currentLevel);
        });

        document.getElementById('hint-btn').addEventListener('click', () => {
            this.showHint();
        });

        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.nextLevel();
        });
    }

    setupTouchEvents() {
        let touchedPiece = null;
        let touchOffsetX = 0;
        let touchOffsetY = 0;

        const pool = document.getElementById('pieces-pool');

        pool.addEventListener('touchstart', (e) => {
            const piece = e.target.closest('.puzzle-piece');
            if (piece && !piece.classList.contains('placed')) {
                touchedPiece = piece;
                const touch = e.touches[0];
                const rect = piece.getBoundingClientRect();
                touchOffsetX = touch.clientX - rect.left;
                touchOffsetY = touch.clientY - rect.top;

                piece.style.position = 'fixed';
                piece.style.zIndex = '1000';
                piece.style.opacity = '0.8';
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (touchedPiece) {
                e.preventDefault();
                const touch = e.touches[0];
                touchedPiece.style.left = `${touch.clientX - touchOffsetX}px`;
                touchedPiece.style.top = `${touch.clientY - touchOffsetY}px`;
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (touchedPiece) {
                const touch = e.changedTouches[0];
                touchedPiece.style.position = '';
                touchedPiece.style.zIndex = '';
                touchedPiece.style.opacity = '';
                touchedPiece.style.left = '';
                touchedPiece.style.top = '';

                const slot = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.puzzle-slot');

                if (slot && !slot.hasChildNodes()) {
                    this.placePiece(slot, touchedPiece);
                }

                touchedPiece = null;
            }
        });
    }

    placePiece(slot, piece) {
        const pieceIndex = parseInt(piece.dataset.patternIndex);
        const slotIndex = parseInt(slot.dataset.index);

        // 检查是否是正确位置
        if (pieceIndex === slotIndex) {
            // 正确！
            slot.appendChild(piece);
            piece.classList.add('placed');
            piece.draggable = false;

            this.placedPieces++;
            this.moves++;

            // 更新UI
            document.getElementById('moves').textContent = this.moves;
            document.getElementById('progress').style.width = `${(this.placedPieces / this.totalPieces) * 100}%`;

            // 播放成功音效（可选）
            this.playSound('success');

            // 检查是否完成
            if (this.placedPieces === this.totalPieces) {
                this.onLevelComplete();
            }
        } else {
            // 错误！
            this.moves++;
            document.getElementById('moves').textContent = this.moves;

            // 晃动效果
            slot.style.animation = 'shake 0.5s';
            setTimeout(() => {
                slot.style.animation = '';
            }, 500);

            this.playSound('error');
        }
    }

    playSound(type) {
        // 使用Web Audio API创建简单音效
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'success') {
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } else {
            oscillator.frequency.value = 200;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    }

    showHint() {
        const slots = document.querySelectorAll('.puzzle-slot');
        const board = document.getElementById('puzzle-board');

        board.classList.add('hint-active');

        // 高亮一个空的正确位置
        for (let slot of slots) {
            if (!slot.hasChildNodes()) {
                slot.style.background = 'rgba(102, 126, 234, 0.3)';
                setTimeout(() => {
                    slot.style.background = '';
                    board.classList.remove('hint-active');
                }, 1000);
                break;
            }
        }
    }

    onLevelComplete() {
        // 计算星星
        let stars = '⭐⭐⭐';
        if (this.moves > this.totalPieces * 1.5) {
            stars = '⭐⭐';
        } else if (this.moves > this.totalPieces * 2) {
            stars = '⭐';
        }

        // 显示完成弹窗
        document.getElementById('final-moves').textContent = this.moves;
        document.getElementById('stars').textContent = stars;
        document.getElementById('completion-modal').classList.add('show');

        // 播放庆祝音效
        this.playVictorySound();
    }

    playVictorySound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        [0, 150, 300].forEach((delay, i) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 523.25 + i * 100;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }, delay);
        });
    }

    nextLevel() {
        document.getElementById('completion-modal').classList.remove('show');

        if (this.currentLevel < this.levels.length) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
        } else {
            // 完成所有关卡！
            alert('🎉 恭喜你完成了所有关卡！');
            this.currentLevel = 1;
            this.loadLevel(this.currentLevel);
        }
    }
}

// 添加晃动动画
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// 启动游戏
window.addEventListener('DOMContentLoaded', () => {
    new PuzzleGame();
});
