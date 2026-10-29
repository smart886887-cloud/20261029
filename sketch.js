// 全域變數宣告
let imgStop;             // 宣告存放靜止狀態精靈圖的變數
let imgWalk;             // 宣告存放走路狀態精靈圖的變數

let posX;                // 宣告角色的 X 軸座標
let posY;                // 宣告角色的 Y 軸座標
let moveSpeed = 4;       // 宣告角色的移動速度（像素/幀）

// 靜止精靈圖參數
const stopFrameCount = 7;     // 靜止動畫總共有 7 張畫格
const stopWidth = 492;        // 整張橫向靜止圖檔的總寬度
const stopHeight = 46;        // 靜止圖檔的高度
const stopFrameW = stopWidth / stopFrameCount; // 單張靜止畫格寬度 (約 70.28px)

// 走路精靈圖參數
const walkFrameCount = 14;    // 走路動畫總共有 14 張畫格
const walkWidth = 975;        // 整張橫向走路圖檔的總寬度
const walkHeight = 58;        // 走路圖檔的高度
const walkFrameW = walkWidth / walkFrameCount; // 單張走路畫格寬度 (約 69.64px)

let currentFrame = 0;         // 目前播放到的畫格索引
let animTimer = 0;            // 動畫計時器，用來控制動畫播放速度

// p5.js 預載函數：在 setup() 執行前先載入外部資源
function preload() {
  // 嘗試載入靜止與走路圖片（若沒有圖片也會自動使用下方動態繪製備案）
  imgStop = loadImage('1/stop/stpop.png', null, () => { console.log('使用預設虛擬角色繪製模式（未找到外部靜止圖片檔）'); });
  imgWalk = loadImage('1/walk/walk.png', null, () => { console.log('使用預設虛擬角色繪製模式（未找到外部走路圖片檔）'); });
}

// p5.js 初始化函數：只執行一次
function setup() {
  // 建立與全螢幕視窗大小相同的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 設定畫圖模式為中心對齊（方便做翻轉與旋轉動作）
  imageMode(CENTER);
  rectMode(CENTER);
  ellipseMode(CENTER);
  
  // 初始化角色的位置在畫面的正中央
  posX = width / 2;
  posY = height / 2;
}

// p5.js 主重複繪製函數：每秒預設執行 60 次
function draw() {
  // 1. 設定背景顏色為需求指定的 #e9edc9 (米黃綠色)
  background('#e9edc9');

  // 2. 畫面上方顯示控制操作說明提示文字
  drawInstructions();

  // 3. 計算與更新動畫畫格（每 5 幀更新一次動畫圖片，避免動畫太快）
  animTimer++;
  if (animTimer % 5 === 0) {
    currentFrame++; // 切換到下一張畫格
  }

  // 4. 偵測鍵盤輸入狀態並決定角色的動作與方向
  let isMoving = false;  // 記錄是否正在移動
  let facingLeft = false; // 記錄是否面向左邊

  // 當使用者按下鍵盤右方向鍵 (RIGHT_ARROW)
  if (keyIsDown(RIGHT_ARROW)) {
    posX += moveSpeed;   // 角色向右移動
    isMoving = true;     // 標記為移動中
    facingLeft = false;  // 面向右邊
  } 
  // 當使用者按下鍵盤左方向鍵 (LEFT_ARROW)
  else if (keyIsDown(LEFT_ARROW)) {
    posX -= moveSpeed;   // 角色向左移動
    isMoving = true;     // 標記為移動中
    facingLeft = true;   // 面向左邊
  }

  // 5. 畫面邊界檢查：防止角色走出螢幕外
  posX = constrain(posX, 50, width - 50);

  // 6. 保存當前繪圖座標系狀態
  push();
  
  // 將座標原點移至角色的當前位置，方便進行繪圖與翻轉
  translate(posX, posY);

  // 如果角色面向左邊，利用 scale(-1, 1) 將繪圖方向水平翻轉
  if (facingLeft) {
    scale(-1, 1);
  }

  // 7. 繪製角色精靈（判斷是載入圖片還是呈現備用圖形）
  if (isMoving) {
    // 【走路狀態】
    let frameIdx = currentFrame % walkFrameCount; // 計算當前走路畫格 (0~13)
    let sx = frameIdx * walkFrameW;               // 計算在圖檔中的 X 裁切位置

    if (imgWalk && imgWalk.width > 0) {
      // 繪製來自 1/walk/walk.png 的特定畫格
      image(imgWalk, 0, 0, walkFrameW, walkHeight, sx, 0, walkFrameW, walkHeight);
    } else {
      // 備用繪圖：若圖片尚未提供，顯示程式產生的動態走路角色
      drawFallbackCharacter(true, frameIdx);
    }
  } else {
    // 【靜止狀態】
    let frameIdx = currentFrame % stopFrameCount; // 計算當前靜止畫格 (0~6)
    let sx = frameIdx * stopFrameW;               // 計算在圖檔中的 X 裁切位置

    if (imgStop && imgStop.width > 0) {
      // 繪製來自 1/stop/stpop.png 的特定畫格
      image(imgStop, 0, 0, stopFrameW, stopHeight, sx, 0, stopFrameW, stopHeight);
    } else {
      // 備用繪圖：若圖片尚未提供，顯示程式產生的動態呼吸靜止角色
      drawFallbackCharacter(false, frameIdx);
    }
  }

  // 恢復原先的座標系狀態
  pop();
}

// 當視窗大小發生變動時自動觸發的函數
function windowResized() {
  // 將畫布大小重新調整為目前視窗的新寬高
  resizeCanvas(windowWidth, windowHeight);
  // 重設 Y 軸位置為新畫面中央
  posY = height / 2;
}

// 輔助函數：畫面上顯示提示訊息
function drawInstructions() {
  push();
  textAlign(CENTER, TOP); // 文字水平居中、垂直置頂
  textSize(18);           // 設定字型大小
  fill(60);               // 設定深灰色文字
  noStroke();             // 無邊框
  text("使用鍵盤方向鍵 ◀ 和 ▶ 控制角色移動與轉向", width / 2, 20); // 繪製提示文字
  textSize(14);
  fill(100);
  text("當前狀態: " + (keyIsDown(LEFT_ARROW) ? "向左走路" : keyIsDown(RIGHT_ARROW) ? "向右走路" : "靜止待機"), width / 2, 50);
  pop();
}

// 備用繪圖函數（當缺少圖片時確保畫面依然有精彩的視覺呈現）
function drawFallbackCharacter(isWalking, frameIdx) {
  push();
  noStroke();
  
  // 計算身體上下浮動動作
  let bounce = isWalking ? Math.sin(frameIdx * 0.5) * 5 : Math.sin(frameIdx * 0.4) * 2;
  
  // 1. 繪製陰影
  fill(0, 0, 0, 30);
  ellipse(0, 25, 40, 10);

  // 2. 繪製角色身體 (可愛圓形小靈魂)
  fill('#6b9080');
  ellipse(0, 0 + bounce, 50, 50);

  // 3. 繪製眼睛
  fill(255);
  ellipse(10, -5 + bounce, 12, 12); // 右眼
  ellipse(-5, -5 + bounce, 12, 12); // 左眼
  fill(0);
  ellipse(12, -5 + bounce, 5, 5);   // 眼珠
  ellipse(-3, -5 + bounce, 5, 5);

  // 4. 繪製走路時腳部的擺動效果
  if (isWalking) {
    fill('#a4c3b2');
    let legOffset = Math.sin(frameIdx * 0.8) * 10;
    ellipse(-10 + legOffset, 20 + bounce, 12, 12); // 腳 A
    ellipse(10 - legOffset, 20 + bounce, 12, 12);  // 腳 B
  } else {
    fill('#a4c3b2');
    ellipse(-8, 22 + bounce, 12, 10);
    ellipse(8, 22 + bounce, 12, 10);
  }

  pop();
}