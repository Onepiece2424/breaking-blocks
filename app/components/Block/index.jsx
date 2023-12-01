"use client";

import { useEffect, useRef } from 'react';

const BlockMain = () => {
  const ballRef = useRef(null);

  useEffect(() => {
    const canvas = ballRef.current;
    const ctx = canvas.getContext('2d');

    // ボールの初期設定
    const ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
      }

      x += dx;
      y += dy;
    };

    // 毎フレームごとにボールを描画
    const intervalId = setInterval(() => {
      draw();
    }, 10);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className='main-content'>
     <canvas ref={ballRef} width={300} height={200} style={{ border: '1px solid #000' }} />
    </div>
  )
}

export default BlockMain