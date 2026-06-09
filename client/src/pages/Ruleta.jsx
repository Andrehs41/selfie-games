import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, Button, CircularProgress, Paper, Chip, IconButton } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { gsap } from 'gsap';
import PageShell from '../components/PageShell.jsx';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { celebrate } from '../utils/confetti.js';
import { primeAudio, playTick, playWin } from '../utils/sound.js';

const SIZE = 360;
const R = SIZE / 2;
const SEG = 45; // 8 segmentos
const WIN_COLORS = ['#E8B4B8', '#C8A98F', '#A8C3A2', '#EBC8A0', '#E0A9AD'];
const RETRY_COLOR = '#E4DACE';

// Punto a `deg` grados en sentido horario desde las 12 en punto.
function pointFromTop(deg, radius) {
  const rad = ((-90 + deg) * Math.PI) / 180;
  return [R + radius * Math.cos(rad), R + radius * Math.sin(rad)];
}

function slicePath(i) {
  const [x1, y1] = pointFromTop(i * SEG, R - 6);
  const [x2, y2] = pointFromTop((i + 1) * SEG, R - 6);
  return `M ${R} ${R} L ${x1} ${y1} A ${R - 6} ${R - 6} 0 0 1 ${x2} ${y2} Z`;
}

// Parte un texto en líneas de máximo ~10 caracteres por palabras.
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

export default function Ruleta() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [segments, setSegments] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null); // { prizeLabel, prizeType, prizeIndex }
  const [muted, setMuted] = useState(false);
  const wheelRef = useRef(null);
  const resultRef = useRef(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  useEffect(() => {
    api
      .get('/games/ruleta')
      .then((res) => {
        setSegments(res.data.segments);
        if (res.data.played) {
          const r = res.data.result;
          setResult({ prizeLabel: r.prizeLabel, prizeType: r.prizeType, prizeIndex: r.prizeIndex });
          if (wheelRef.current) {
            gsap.set(wheelRef.current, {
              rotation: -(r.prizeIndex * SEG + SEG / 2),
              svgOrigin: `${R} ${R}`,
            });
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Anima la tarjeta de resultado cuando aparece (sin sonido/confeti aquí, para
  // no dispararlos al recargar una partida ya jugada).
  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }
  }, [result]);

  const spin = async () => {
    if (spinning || result) return;
    primeAudio(); // activa el audio dentro del gesto del usuario
    setSpinning(true);
    try {
      const res = await api.post('/games/ruleta');
      const { prizeIndex, prizeLabel, prizeType } = res.data;
      const target = 360 * 6 - (prizeIndex * SEG + SEG / 2);
      let lastSeg = 0;
      gsap.to(wheelRef.current, {
        rotation: target,
        svgOrigin: `${R} ${R}`,
        duration: 5,
        ease: 'power4.out',
        onUpdate: () => {
          // Un "tic" cada vez que pasa un segmento (se va espaciando con el frenado).
          const rot = gsap.getProperty(wheelRef.current, 'rotation');
          const seg = Math.floor(rot / SEG);
          if (seg !== lastSeg) {
            lastSeg = seg;
            if (!mutedRef.current) playTick();
          }
        },
        onComplete: async () => {
          setResult({ prizeLabel, prizeType, prizeIndex });
          setSpinning(false);
          if (prizeType === 'win') {
            celebrate();
            if (!mutedRef.current) playWin();
          }
          await refreshUser();
        },
      });
    } catch (err) {
      const prev = err.response?.data?.result;
      if (prev) setResult({ prizeLabel: prev.prizeLabel, prizeType: prev.prizeType, prizeIndex: prev.prizeIndex });
      setSpinning(false);
    }
  };

  if (loading) {
    return (
      <PageShell maxWidth="sm">
        <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </PageShell>
    );
  }

  let winCount = 0;

  return (
    <PageShell maxWidth="sm">
      <Stack spacing={3} alignItems="center">
        <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
          <Typography variant="h3">La Ruleta</Typography>
          <Typography color="text.secondary">
            {result ? '¡Gracias por jugar!' : 'Gira la rueda y prueba tu suerte'}
          </Typography>
          <IconButton
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'activar sonido' : 'silenciar'}
            title={muted ? 'Activar sonido' : 'Silenciar'}
            sx={{ position: 'absolute', top: 0, right: 0 }}
          >
            {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>
        </Box>

        <Box sx={{ position: 'relative', width: SIZE, height: SIZE }}>
          {/* Puntero superior */}
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 3,
              width: 0,
              height: 0,
              borderLeft: '15px solid transparent',
              borderRight: '15px solid transparent',
              borderTop: '30px solid #6B4E3D',
              filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.25))',
            }}
          />

          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{ display: 'block', filter: 'drop-shadow(0 14px 36px rgba(120,90,60,0.30))' }}
          >
            {/* Aro exterior con "luces" */}
            <circle cx={R} cy={R} r={R - 2} fill="#FFFDFA" />
            {Array.from({ length: 16 }).map((_, k) => {
              const [bx, by] = pointFromTop(k * 22.5, R - 3);
              return <circle key={k} cx={bx} cy={by} r={2.6} fill="#D9A06B" />;
            })}

            {/* Grupo que rota */}
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
                      fill={isWin ? '#4A3F38' : '#9C8B7B'}
                      fontSize="12.5"
                      fontWeight="600"
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

            {/* Hub central */}
            <circle cx={R} cy={R} r="30" fill="#FFFDFA" stroke="#D9A06B" strokeWidth="3" />
            <text
              x={R}
              y={R}
              fill="#6B4E3D"
              fontSize="16"
              fontWeight="700"
              fontFamily="Poppins, sans-serif"
              textAnchor="middle"
              dominantBaseline="central"
            >
              MZ
            </text>
          </svg>
        </Box>

        {result ? (
          <Paper ref={resultRef} sx={{ p: 4, textAlign: 'center', width: '100%', maxWidth: 400 }}>
            <Stack spacing={1.5} alignItems="center">
              {result.prizeType === 'win' ? (
                <>
                  <Typography variant="h4">🎉 ¡Felicidades!</Typography>
                  <Typography color="text.secondary">Ganaste:</Typography>
                  <Chip
                    label={result.prizeLabel}
                    color="secondary"
                    sx={{ fontSize: 18, py: 3, px: 2, fontWeight: 600 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Acércate al stand para reclamar tu premio 💖
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="h4">¡Casi!</Typography>
                  <Typography color="text.secondary">
                    Esta vez no hubo premio, pero gracias por participar 💖
                  </Typography>
                </>
              )}
              <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 1 }}>
                Volver al inicio
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={spin}
            disabled={spinning}
            startIcon={!spinning && <ReplayIcon />}
            sx={{ px: 6, py: 1.5, fontSize: 18 }}
          >
            {spinning ? 'Girando…' : '¡Girar!'}
          </Button>
        )}
      </Stack>
    </PageShell>
  );
}
