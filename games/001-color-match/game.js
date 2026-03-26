// 游戏配置
const COLORS = {
    red: {
        name: '红色',
        hex: '#ff6b6b',
        emojis: ['🍎', '🍓', '🍒', '❤️', '🌹', '🧢', '🚗', '🔴', '🎈', '🧸']
    },
    blue: {
        name: '蓝色',
        hex: '#4ecdc4',
        emojis: ['🫐', '🐋', '🦋', '💎', '🧊', '🚙', '👖', '🌊', '🔵', '🐟']
    },
    yellow: {
        name: '黄色',
        hex: '#ffe66d',
        emojis: ['🌟', '🍋', '🌻', '🐝', '🌽', '🧀', '🐣', '⭐', '🔶', '🏀']
    },
    green: {
        name: '绿色',
        hex: '#95e1d3',
        emojis: ['🍀', '🥒', '🐸', '🥝', '🌿', '🦜', '🍏', '🥦', '♻️', '🐢']
    },
    orange: {
        name: '橙色',
        hex: '#ffa502',
        emojis: ['🍊', '🥕', '🐯', '🧡', '🔥', '🦊', '🥭', '🎃', '🍁', '🐱']
    },
    purple: {
        name: '紫色',
        hex: '#a29bfe',
        emojis: ['🍇', '🍆', '🦄', '🔮', '💜', '🍭', '🌜', '🎭', '🦚', '🐙']
    }
};

// 游戏状态
let gameState = {
    score: 0,
    level: 1,
    targetColor: null,
    items: [],
    foundCount: 0,
    totalTargetItems: 0
};

// 获取所有颜色键
const colorKeys = Object.keys(COLORS);

// 初始化游戏
function initGame() {
    gameState.score = 0;
    gameState.level = 1;
    updateUI();
    startLevel();
}

// 开始新关卡
function startLevel() {
    // 重置关卡状态
    gameState.foundCount = 0;
    gameState.items = [];

    // 选择目标颜色
    gameState.targetColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];

    // 确定目标物品数量（随关卡增加）
    const targetCount = Math.min(3 + gameState.level, 6);
    gameState.totalTargetItems = targetCount;

    // 生成游戏物品
    generateItems(targetCount);

    // 更新 UI
    updateUI();
    showMessage('');
    document.getElementById('btn-next').style.display = 'none';
}

// 生成游戏物品
function generateItems(targetCount) {
    const grid = document.getElementById('items-grid');
    grid.innerHTML = '';

    // 选择目标颜色的物品
    const targetItems = [];
    const targetEmojis = [...COLORS[gameState.targetColor].emojis];
    for (let i = 0; i < targetCount; i++) {
        const randomIndex = Math.floor(Math.random() * targetEmojis.length);
        targetItems.push({
            emoji: targetEmojis.splice(randomIndex, 1)[0],
            color: gameState.targetColor
        });
    }

    // 选择其他颜色的物品
    const otherItems = [];
    const otherColors = colorKeys.filter(c => c !== gameState.targetColor);

    for (let color of otherColors) {
        const emojiCount = Math.floor(Math.random() * 2) + 1; // 1-2个每种颜色
        const emojis = [...COLORS[color].emojis];
        for (let i = 0; i < emojiCount; i++) {
            if (emojis.length > 0) {
                const randomIndex = Math.floor(Math.random() * emojis.length);
                otherItems.push({
                    emoji: emojis.splice(randomIndex, 1)[0],
                    color: color
                });
            }
        }
    }

    // 合并并打乱所有物品
    gameState.items = shuffleArray([...targetItems, ...otherItems]);

    // 渲染物品
    gameState.items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'game-item';
        itemElement.style.backgroundColor = COLORS[item.color].hex;
        itemElement.textContent = item.emoji;
        itemElement.dataset.index = index;
        itemElement.dataset.color = item.color;
        itemElement.addEventListener('click', handleItemClick);
        grid.appendChild(itemElement);
    });
}

// 处理物品点击
function handleItemClick(event) {
    const element = event.currentTarget;

    // 如果已经找到，忽略
    if (element.classList.contains('found')) {
        return;
    }

    const itemColor = element.dataset.color;

    if (itemColor === gameState.targetColor) {
        // 正确！
        element.classList.add('correct', 'found');
        gameState.score += 10;
        gameState.foundCount++;

        // 播放正确反馈
        showMessage('太棒了！🎉', 'success');

        // 检查是否完成
        if (gameState.foundCount >= gameState.totalTargetItems) {
            setTimeout(() => {
                levelComplete();
            }, 500);
        }
    } else {
        // 错误！
        element.classList.add('wrong');
        setTimeout(() => {
            element.classList.remove('wrong');
        }, 500);

        showMessage('再试试看！😊', '');
    }

    updateUI();
}

// 关卡完成
function levelComplete() {
    showMessage(`关卡 ${gameState.level} 完成！⭐`, 'complete');

    if (gameState.level >= 5) {
        // 游戏通关
        setTimeout(() => {
            showMessage('恭喜通关！🏆 你真棒！', 'complete');
            document.getElementById('btn-next').textContent = '再玩一次';
            document.getElementById('btn-next').style.display = 'block';
            document.getElementById('btn-next').onclick = () => {
                initGame();
            };
        }, 1000);
    } else {
        // 下一关
        document.getElementById('btn-next').style.display = 'block';
        document.getElementById('btn-next').onclick = () => {
            gameState.level++;
            startLevel();
        };
    }
}

// 更新 UI
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('level').textContent = gameState.level;

    if (gameState.targetColor) {
        const targetColorData = COLORS[gameState.targetColor];
        document.getElementById('target-color-name').textContent = targetColorData.name;
        document.getElementById('target-color-name').style.color = targetColorData.hex;
        document.getElementById('target-color').style.backgroundColor = targetColorData.hex;
    }
}

// 显示消息
function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = 'message ' + type;
}

// 打乱数组
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 启动游戏
initGame();
