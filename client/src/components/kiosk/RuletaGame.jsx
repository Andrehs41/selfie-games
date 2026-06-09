import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Stack, Button, CircularProgress, Paper, Chip, IconButton } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { gsap } from 'gsap';
import api from '../../api/client.js';
import { celebrate } from '../../utils/confetti.js';
import { primeAudio, playTick, playWin } from '../../utils/sound.js';

// Geometría interna del SVG (unidades del viewBox). El tamaño en pantalla se
// controla por CSS (responsive y GIGANTE), manteniendo la geometría constante.
const BASE = 400;
const R = BASE / 2;
const SEG = 45;
// Tamaño en pantalla: lo más grande posible sin salirse del alto/ancho.
const WHEEL_SIZE = 'min(94vw, 80vh, 900px)';
const WIN_COLORS = ['#EC0E8E', '#F7941E', '#E87CB2', '#F4B6D2', '#F09A3E'];
const RETRY_COLOR = '#E4DACE';

function pointFromTop(deg, radius) {
  const rad = ((-90 + deg) * Math.PI) / 180;
  return [R + radius * Math.cos(rad), R + radius * Math.sin(rad)];
}

function slicePath(i) {
  const [x1, y1] = pointFromTop(i * SEG, R - 6);
  const [x2, y2] = pointFromTop((i + 1) * SEG, R - 6);
  return `M ${R} ${R} L ${x1} ${y1} A ${R - 6} ${R - 6} 0 0 1 ${x2} ${y2} Z`;
}

function wrap(label) {
  const words = label.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > 10 && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

export default function RuletaGame({ participant, onDone }) {
  const [loading, setLoading] = useState(true);
  const [segments, setSegments] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [muted, setMuted] = useState(false);
  const wheelRef = useRef(null);
  const resultRef = useRef(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  useEffect(() => {
    api
      .get('/play/ruleta')
      .then((res) => setSegments(res.data.segments))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(resultRef.current, { scale: 0.8, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' });
    }
  }, [result]);

  const spin = async () => {
    if (spinning || result) return;
    primeAudio();
    setSpinning(true);
    try {
      const res = await api.post(`/play/${participant.id}/ruleta`);
      const { prizeIndex, prizeLabel, prizeType } = res.data;
      const target = 360 * 6 - (prizeIndex * SEG + SEG / 2);
      let lastSeg = 0;
      gsap.to(wheelRef.current, {
        rotation: target,
        svgOrigin: `${R} ${R}`,
        duration: 5,
        ease: 'power4.out',
        onUpdate: () => {
          const rot = gsap.getProperty(wheelRef.current, 'rotation');
          const seg = Math.floor(rot / SEG);
          if (seg !== lastSeg) {
            lastSeg = seg;
            if (!mutedRef.current) playTick();
          }
        },
        onComplete: () => {
          setResult({ prizeLabel, prizeType });
          setSpinning(false);
          if (prizeType === 'win') {
            celebrate();
            if (!mutedRef.current) playWin();
          }
        },
      });
    } catch (err) {
      const prev = err.response?.data?.result;
      if (prev) setResult({ prizeLabel: prev.prizeLabel, prizeType: prev.prizeType });
      setSpinning(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  let winCount = 0;
  const logoSize = 96;

  return (
    <Stack spacing={2.5} alignItems="center">
      <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
        <Typography variant="h3" sx={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          La Ruleta
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.95)' }}>
          {result ? '¡Listo!' : 'Gira y prueba tu suerte'}
        </Typography>
        <IconButton
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'activar sonido' : 'silenciar'}
          sx={{ position: 'absolute', top: 0, right: 0, color: '#fff' }}
        >
          {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
      </Box>

      {!result && (
        <Box sx={{ position: 'relative', width: WHEEL_SIZE, height: WHEEL_SIZE, maxWidth: '100%' }}>
          {/* Puntero */}
          <Box
            sx={{
              position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', zIndex: 3,
              width: 0, height: 0,
              borderLeft: '22px solid transparent', borderRight: '22px solid transparent',
              borderTop: '42px solid #6B4E3D', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.3))',
            }}
          />
          <svg width="100%" height="100%" viewBox={`0 0 ${BASE} ${BASE}`} style={{ display: 'block', filter: 'drop-shadow(0 18px 44px rgba(0,0,0,0.28))' }}>
            <circle cx={R} cy={R} r={R - 2} fill="#FFFDFA" />
            {Array.from({ length: 16 }).map((_, k) => {
              const [bx, by] = pointFromTop(k * 22.5, R - 4);
              return <circle key={k} cx={bx} cy={by} r={3.2} fill="#F7941E" />;
            })}
            <g ref={wheelRef} style={{ transformOrigin: `${R}px ${R}px` }}>
              {segments.map((seg, i) => {
                const isWin = seg.type === 'win';
                const fill = isWin ? WIN_COLORS[winCount++ % WIN_COLORS.length] : RETRY_COLOR;
                const mid = i * SEG + SEG / 2;
                const [tx, ty] = pointFromTop(mid, R * 0.6);
                let rot = mid - 90;
                if (mid > 90 && mid < 270) rot += 180;
                const lines = wrap(seg.label);
                return (
                  <g key={seg.id}>
                    <path d={slicePath(i)} fill={fill} stroke="#FFFDFA" strokeWidth="2.5" />
                    <text
                      transform={`rotate(${rot} ${tx} ${ty})`}
                      x={tx}
                      y={ty}
                      fill={isWin ? '#FFFFFF' : '#9C8B7B'}
                      fontSize="13"
                      fontWeight="700"
                      fontFamily="Poppins, sans-serif"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {lines.map((ln, li) => (
                        <tspan key={li} x={tx} dy={li === 0 ? -(lines.length - 1) * 7 : 14}>
                          {ln}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}
            </g>
            {/* Hub central ESTÁTICO con el logo de la marca */}
            <circle cx={R} cy={R} r="60" fill="#FFFFFF" stroke="#F7941E" strokeWidth="4" />
            <image
              href="/logo.png"
              x={R - logoSize / 2}
              y={R - logoSize / 2}
              width={logoSize}
              height={logoSize}
            />
          </svg>
        </Box>
      )}

      {result ? (
        <Paper ref={resultRef} sx={{ p: 4, textAlign: 'center', width: '100%', maxWidth: 420 }}>
          <Stack spacing={1.5} alignItems="center">
            {result.prizeType === 'win' ? (
              <>
                <Typography variant="h4">🎉 ¡Felicidades!</Typography>
                <Typography color="text.secondary">Ganaste:</Typography>
                <Chip label={result.prizeLabel} color="secondary" sx={{ fontSize: 18, py: 3, px: 2, fontWeight: 600 }} />
              </>
            ) : (
              <>
                <Typography variant="h4">¡Casi!</Typography>
                <Typography color="text.secondary">Esta vez no hubo premio, ¡gracias por jugar! 💖</Typography>
              </>
            )}
            <Button variant="contained" onClick={() => onDone(result)} sx={{ mt: 1, py: 1.4, px: 5, fontSize: 18 }}>
              Continuar
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Button variant="contained" size="large" onClick={spin} disabled={spinning} startIcon={!spinning && <ReplayIcon />} sx={{ px: 7, py: 2, fontSize: 22 }}>
          {spinning ? 'Girando…' : '¡Girar!'}
        </Button>
      )}
    </Stack>
  );
}
