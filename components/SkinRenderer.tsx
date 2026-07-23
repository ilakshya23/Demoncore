'use client';

import { useEffect, useRef } from 'react';
import { SkinViewer } from 'skinview3d';

// Renders a raw Minecraft skin texture (the flat PNG skin sites hand out) as
// a posed 3D character, instead of showing the flat sprite sheet directly.
export function SkinRenderer({
  skinUrl,
  fallbackTextureUrl,
  width = 110,
  height = 160,
}: {
  skinUrl: string;
  fallbackTextureUrl: string;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const viewer = new SkinViewer({
      canvas: canvasRef.current,
      width,
      height,
      zoom: 0.55,
      enableControls: false,
    });
    // Yaw the model for a 3/4 "hero" angle instead of a flat mugshot — pure
    // Y-axis rotation only. Tilting the CAMERA (pitch) was tried and reverted:
    // this camera's focal point sits below the model's visual center, so any
    // pitch shrinks the head's margin much faster than the feet's, and it
    // clips the head off-frame well before zoom looks "full". Yaw alone
    // doesn't touch vertical framing, so the zoom that fits head-to-toe dead
    // -on (verified at 0.55) still fits identically here.
    viewer.playerObject.rotation.y = Math.PI / 4;

    // Proxied through our own origin — most skin sites don't send CORS
    // headers, which silently breaks WebGL texture loading otherwise.
    const proxiedUrl = `/api/skin-proxy?url=${encodeURIComponent(skinUrl)}`;
    viewer.loadSkin(proxiedUrl).catch(() => {
      viewer.loadSkin(fallbackTextureUrl).catch(() => {});
    });

    return () => viewer.dispose();
  }, [skinUrl, fallbackTextureUrl, width, height]);

  return <canvas ref={canvasRef} />;
}
