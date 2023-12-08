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
  });

  const drawBall = (ctx, ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx, paddle, canvas) => {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { ball, paddle } = gameRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(ctx, ball);
    drawPaddle(ctx, paddle, canvas);

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
        // ゲームオーバーの処理（ここでは初期位置にボールを戻す）
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
      }
    }

    if (paddle.x + ball.dx > 0 && paddle.x + paddle.width + ball.dx < canvas.width) {
      paddle.x += ball.dx;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    requestAnimationFrame(draw);
  };

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

    canvas.addEventListener("mousemove", mouseMoveHandler);

    draw();

    return () => {
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return (
    <div className='main-content'>
      <canvas ref={canvasRef} width={300} height={200} style={{ border: '1px solid #000' }} />
    </div>
  )
}

export default BlockMain;
