// 颜色配对游戏 - 基于蒙特梭利理念设计

// 游戏配置
const GAME_CONFIG = {
    colors: [
        { name: '红色', code: '#FF6B6B', emoji: '🍎' },
        { name: '蓝色', code: '#4ECDC4', emoji: '🐳' },
        { name: '黄色', code: '#FFE66D', emoji: '🌟' },
        { name: '绿色', code: '#95E1D3', emoji: '🌿' },
        { name: '橙色', code: '#FFA07A', emoji: '🍊' },
        { name: '紫色', code: '#B19CD9', emoji: '🍇' },
        { name: '粉色', code: '#FFB6C1', emoji: '🌸' },
        { name: '棕色', code: '#D2691E', emoji: '🐻' }
    ],
    totalPairs: 8
};

// 游戏状态
let gameState = {
    currentTargetIndex: 0,
    score: 0,
    matchedColors: new Set()
};

// 初始化游戏
function initGame() {
    gameState = {
        currentTargetIndex: 0,
        score: 0,
        matchedColors: new Set()
    };

    updateScore();
    generateNewRound();
}

// 生成新一轮
function generateNewRound() {
    // 如果所有颜色都配对完成，显示胜利界面
    if (gameState.matchedColors.size >= GAME_CONFIG.totalPairs) {
        showVictory();
        return;
    }

    // 选择一个未配对的颜色作为目标
    const availableColors = GAME_CONFIG.colors.filter((_, index) =>
        !gameState.matchedColors.has(index)
    );

    const randomIndex = Math.floor(Math.random() * availableColors.length);
    const targetColor = availableColors[randomIndex];
    gameState.currentTargetIndex = GAME_CONFIG.colors.indexOf(targetColor);

    // 更新目标颜色显示
    const targetColorElement = document.getElementById('targetColor');
    targetColorElement.style.backgroundColor = targetColor.code;

    // 生成选项物品
    generateItems();
}

// 生成选项物品
function generateItems() {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';

    const targetColor = GAME_CONFIG.colors[gameState.currentTargetIndex];

    // 创建选项（包含目标颜色和干扰项）
    const options = [];

    // 添加目标颜色的物品（2-3个）
    const targetCount = Math.floor(Math.random() * 2) + 2; // 2-3个
    for (let i = 0; i < targetCount; i++) {
        options.push({
            color: targetColor.code,
            isTarget: true,
            emoji: getRandomEmoji()
        });
    }

    // 添加干扰项（5-6个）
    const distractorColors = GAME_CONFIG.colors.filter(
        (_, index) => index !== gameState.currentTargetIndex
    );

    for (let i = 0; i < 6; i++) {
        const randomDistractor = distractorColors[
            Math.floor(Math.random() * distractorColors.length)
        ];
        options.push({
            color: randomDistractor.code,
            isTarget: false,
            emoji: getRandomEmoji()
        });
    }

    // 打乱选项顺序
    shuffleArray(options);

    // 创建DOM元素
    options.forEach((option, index) => {
        const item = document.createElement('div');
        item.className = 'item';
        item.style.backgroundColor = option.color;
        item.textContent = option.emoji;
        item.dataset.isTarget = option.isTarget;
        item.onclick = () => handleItemClick(item, option.isTarget);

        // 添加入场动画
        item.style.animationDelay = `${index * 0.1}s`;

        container.appendChild(item);
    });
}

// 处理物品点击
function handleItemClick(itemElement, isTarget) {
    if (itemElement.classList.contains('matched')) {
        return; // 已经配对的物品不能再点击
    }

    if (isTarget) {
        // 正确配对
        handleCorrectMatch(itemElement);
    } else {
        // 错误配对
        handleWrongMatch(itemElement);
    }
}

// 处理正确配对
function handleCorrectMatch(itemElement) {
    // 播放成功反馈
    showFeedback('✓ 太棒了！', 'success');

    // 标记物品已配对
    itemElement.classList.add('matched');

    // 添加动画效果
    itemElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        itemElement.style.transform = 'scale(1)';
    }, 300);

    // 更新分数
    gameState.score++;
    updateScore();

    // 记录已配对的颜色
    gameState.matchedColors.add(gameState.currentTargetIndex);

    // 延迟后生成新一轮
    setTimeout(() => {
        generateNewRound();
    }, 1000);
}

// 处理错误配对
function handleWrongMatch(itemElement) {
    // 播放错误反馈
    showFeedback('✗ 再试试看', 'error');

    // 添加抖动动画
    itemElement.style.animation = 'shake 0.5s ease';

    setTimeout(() => {
        itemElement.style.animation = '';
    }, 500);
}

// 显示反馈
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    feedback.style.display = 'block';

    setTimeout(() => {
        feedback.style.display = 'none';
    }, 1000);
}

// 更新分数显示
function updateScore() {
    document.getElementById('score').textContent = gameState.score;
}

// 显示胜利界面
function showVictory() {
    document.getElementById('victoryScreen').style.display = 'flex';

    // 添加庆祝特效
    createConfetti();
}

// 创建彩带特效
function createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FFA07A', '#B19CD9'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 3000;
                animation: fall ${2 + Math.random() * 2}s linear forwards;
            `;

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 50);
    }
}

// 重启游戏
function restartGame() {
    document.getElementById('victoryScreen').style.display = 'none';
    initGame();
}

// 获取随机emoji
function getRandomEmoji() {
    const emojis = ['⭐', '🌟', '✨', '💫', '🎀', '🎈', '🎁', '🎪', '🎨', '🌈'];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

// 打乱数组
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }

    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化游戏
window.onload = () => {
    initGame();
};
