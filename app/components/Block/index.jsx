"use client";

import React, { useEffect, useRef } from 'react';

const BlockMain = () => {
  const canvasRef = useRef(null);
  const gameRef = useRef({
    ball: {
      x: 0,
      y: 0,
      radius: 10,
      dx: 2,
      dy: -2,
    },
    paddle: {
      height: 10,
      width: 75,
      x: 0,
    },
    blocks: [], // ブロックを管理する配列
  });

  // ボールを描画
  const drawBall = (ctx, ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  // パドルを描画
  const drawPaddle = (ctx, paddle, canvas) => {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  // ブロックを描画
  const drawBlocks = (ctx, blocks) => {
    blocks.forEach((block) => {
      if (!block.isDestroyed) {
        ctx.beginPath();
        ctx.rect(block.x, block.y, block.width, block.height);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    });
  };

  // ゲームのアニメーション（ボールの動き、衝突判定など）
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { ball, paddle, blocks } = gameRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(ctx, ball);
    drawPaddle(ctx, paddle, canvas);
    drawBlocks(ctx, blocks);

    if (
      ball.x + ball.dx > canvas.width - ball.radius ||
      ball.x + ball.dx < ball.radius
    ) {
      ball.dx = -ball.dx;
    }

    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
      // パドルに当たった場合
      if (
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
      ) {
        ball.dy = -ball.dy;
      } else {
        // ゲームオーバーの処理
        alert('GAME OVER')
        document.location.reload();
        return;
      }
    }

    // ブロックとの当たり判定
    blocks.forEach((block) => {
      if (!block.isDestroyed) {
        if (
          ball.x > block.x &&
          ball.x < block.x + block.width &&
          ball.y > block.y &&
          ball.y < block.y + block.height
        ) {
          block.isDestroyed = true;
          ball.dy = -ball.dy;
        }
      }
    });

    ball.x += ball.dx;
    ball.y += ball.dy;

    requestAnimationFrame(draw);
  };

  // マウスの位置に応じてパドルの位置を更新
  const mouseMoveHandler = (e) => {
    const canvas = canvasRef.current;
    const { paddle } = gameRef.current;
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddle.x = relativeX - paddle.width / 2;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const { ball, paddle } = gameRef.current;

    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    paddle.x = (canvas.width - paddle.width) / 2;

    // ブロックの初期化（例: 5行 x 5列のブロック）
    const blockRowCount = 5;
    const blockColumnCount = 5;
    for (let c = 0; c < blockColumnCount; c++) {
      for (let r = 0; r < blockRowCount; r++) {
        gameRef.current.blocks.push({
          x: c * (75 + 10),
          y: r * (20 + 10),
          width: 75,
          height: 20,
          isDestroyed: false,
        });
      }
    }

    canvas.addEventListener("mousemove", mouseMoveHandler);

    draw();

    return () => {
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return (
    <div className='main-content'>
      <canvas ref={canvasRef} width={410} height={400} style={{ border: '1px solid #000' }} />
    </div>
  );
};

export default BlockMain;
