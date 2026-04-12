// 游戏状态
const gameState = {
    currentLevel: 1,
    maxLevels: 10,
    stars: 3,
    correctAnswers: 0,
    totalQuestions: 10,
    currentTarget: 0,
    isAnswering: false
};

// 物品表情列表
const emojis = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍒', '🥝', '🍑', '🥭', '🍍'];

// 初始化游戏
function initGame() {
    gameState.currentLevel = 1;
    gameState.stars = 3;
    gameState.correctAnswers = 0;
    gameState.isAnswering = false;

    updateUI();
    generateQuestion();
}

// 生成新问题
function generateQuestion() {
    // 当前关卡对应的目标数字（1-10）
    gameState.currentTarget = gameState.currentLevel;

    // 随机选择一个表情
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    // 更新显示
    document.getElementById('targetEmoji').textContent = randomEmoji;
    document.getElementById('targetNumber').textContent = gameState.currentTarget;

    // 生成选项
    generateOptions();
}

// 生成选项
function generateOptions() {
    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = '';

    // 生成选项：包括正确答案和3个干扰项
    let options = [gameState.currentTarget];

    // 添加干扰项（确保不重复且在合理范围内）
    while (options.length < 4) {
        let wrongAnswer;
        // 50%概率生成相邻数字，50%概率生成随机数字
        if (Math.random() > 0.5) {
            // 生成相邻数字
            const offset = Math.random() > 0.5 ? 1 : -1;
            wrongAnswer = gameState.currentTarget + offset;
        } else {
            // 生成随机数字（1-10范围内）
            wrongAnswer = Math.floor(Math.random() * 10) + 1;
        }

        // 确保数字在1-10范围内且不重复
        if (wrongAnswer >= 1 && wrongAnswer <= 10 && !options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }

    // 打乱选项顺序
    options = shuffleArray(options);

    // 创建选项按钮
    options.forEach(number => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = number;
        button.onclick = () => checkAnswer(number, button);
        optionsGrid.appendChild(button);
    });
}

// 打乱数组
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 检查答案
function checkAnswer(selectedNumber, button) {
    if (gameState.isAnswering) return;
    gameState.isAnswering = true;

    const feedback = document.getElementById('feedback');

    if (selectedNumber === gameState.currentTarget) {
        // 正确答案
        button.classList.add('correct');
        feedback.textContent = getRandomPraise();
        feedback.className = 'feedback show success';

        gameState.correctAnswers++;

        // 播放成功动画后进入下一关
        setTimeout(() => {
            feedback.className = 'feedback';
            nextLevel();
        }, 1500);
    } else {
        // 错误答案
        button.classList.add('wrong');
        feedback.textContent = '再试一次！加油！💪';
        feedback.className = 'feedback show error';

        // 扣除星星
        if (gameState.stars > 1) {
            gameState.stars--;
            updateUI();
        }

        // 允许重新选择
        setTimeout(() => {
            button.classList.remove('wrong');
            feedback.className = 'feedback';
            gameState.isAnswering = false;
        }, 1500);
    }
}

// 获取随机鼓励语
function getRandomPraise() {
    const praises = [
        '太棒了！🎉',
        '答对了！✨',
        '你真聪明！🌟',
        '好样的！💯',
        '继续加油！🚀',
        '完美！👏',
        '厉害！🎊',
        '真棒！⭐'
    ];
    return praises[Math.floor(Math.random() * praises.length)];
}

// 进入下一关
function nextLevel() {
    if (gameState.currentLevel < gameState.maxLevels) {
        gameState.currentLevel++;
        updateUI();
        generateQuestion();
        gameState.isAnswering = false;
    } else {
        // 完成所有关卡
        showCompletion();
    }
}

// 更新UI
function updateUI() {
    document.getElementById('level').textContent = gameState.currentLevel;
    document.getElementById('stars').textContent = '⭐'.repeat(gameState.stars);

    // 更新进度条
    const progress = (gameState.currentLevel - 1) / gameState.maxLevels * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// 显示完成弹窗
function showCompletion() {
    const modal = document.getElementById('completionModal');
    const finalStars = document.getElementById('finalStars');

    finalStars.textContent = '⭐'.repeat(gameState.stars);
    modal.classList.add('show');
}

// 重新开始游戏
function restartGame() {
    const modal = document.getElementById('completionModal');
    modal.classList.remove('show');
    initGame();
}

// 页面加载时初始化游戏
window.onload = initGame;
