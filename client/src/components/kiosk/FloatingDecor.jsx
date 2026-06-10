import { useEffect, useRef, useMemo } from 'react';
import { Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import { gsap } from 'gsap';

// Colores suaves cercanos a la paleta (blanco, rosa claro, coral claro) para
// decorar sin robarle protagonismo al juego.
const COLORS = ['#FFFFFF', '#FFD9EC', '#FFC59E', '#FFFFFF', '#FBB9DA'];

// Decoración de fondo: corazones y estrellas (iconos SVG) flotando con GSAP.
export default function FloatingDecor({ count = 25 }) {
  const ref = useRef(null);

  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        type: i % 2 === 0 ? 'heart' : 'star',
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 16 + Math.random() * 42,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 0.35 + Math.random() * 0.35,
        dur: 3 + Math.random() * 4,
        delay: Math.random() * 3,
        drift: (Math.random() * 2 - 1) * 28,
        rot: (Math.random() * 2 - 1) * 22,
      })),
    [count]
  );

  useEffect(() => {
    const els = ref.current ? Array.from(ref.current.children) : [];
    const tweens = [];
    items.forEach((it, idx) => {
      const el = els[idx];
      if (!el) return;
      gsap.set(el, { opacity: it.opacity });
      tweens.push(
        gsap.to(el, {
          y: -22 - Math.random() * 26,
          x: it.drift,
          rotation: it.rot,
          duration: it.dur,
          delay: it.delay,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      );
      tweens.push(
        gsap.to(el, {
          opacity: it.opacity * 0.9,
          duration: it.dur * 0.8,
          delay: it.delay,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      );
    });
    return () => tweens.forEach((t) => t.kill());
  }, [items]);

  return (
    <Box ref={ref} aria-hidden sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {items.map((it) => {
        const Icon = it.type === 'heart' ? FavoriteIcon : StarIcon;
        return (
          <Icon
            key={it.id}
            sx={{ position: 'absolute', top: `${it.top}%`, left: `${it.left}%`, fontSize: it.size, color: it.color }}
          />
        );
      })}
    </Box>
  );
}
