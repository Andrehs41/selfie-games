import { useEffect, useMemo, useState } from 'react';
import {
  Typography,
  Stack,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Box,
  CircularProgress,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import CasinoIcon from '@mui/icons-material/Casino';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PageShell from '../components/PageShell.jsx';
import api from '../api/client.js';
import { exportCsv, exportPdf } from '../utils/exporters.js';

function StatCard({ icon, label, value, color }) {
  return (
    <Paper sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ bgcolor: color, borderRadius: 3, p: 1.2, display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="h4" fontWeight={700} lineHeight={1}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
}

// Clave de día local (YYYY-MM-DD) y etiqueta legible para el selector.
function dayKey(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}
function dayLabel(key) {
  return new Date(key + 'T00:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [q, setQ] = useState('');
  const [triviaF, setTriviaF] = useState('todos');
  const [ruletaF, setRuletaF] = useState('todos');
  const [dia, setDia] = useState('todos');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/admin/participants'), api.get('/admin/stats')])
      .then(([p, s]) => {
        setRows(p.data.participants);
        setStats(s.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((u) => {
      if (term) {
        const hit = u.nombre.toLowerCase().includes(term) || (u.telefono || '').includes(term);
        if (!hit) return false;
      }
      if (triviaF === 'jugada' && !u.trivia?.played) return false;
      if (triviaF === 'no' && u.trivia?.played) return false;
      if (ruletaF === 'gano' && u.ruleta?.prizeType !== 'win') return false;
      if (ruletaF === 'sinpremio' && !(u.ruleta?.played && u.ruleta?.prizeType === 'retry')) return false;
      if (ruletaF === 'no' && u.ruleta?.played) return false;
      if (dia !== 'todos' && dayKey(u.createdAt) !== dia) return false;
      return true;
    });
  }, [rows, q, triviaF, ruletaF, dia]);

  // Días disponibles (con registros), del más reciente al más antiguo.
  const days = useMemo(() => {
    const set = new Set(rows.map((u) => dayKey(u.createdAt)));
    return Array.from(set).sort().reverse();
  }, [rows]);

  useEffect(() => setPage(0), [q, triviaF, ruletaF, dia]);

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/participants/${toDelete.id}`);
      setRows((prev) => prev.filter((u) => u.id !== toDelete.id));
      setStats((s) => (s ? { ...s, total: Math.max(0, s.total - 1) } : s));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageShell maxWidth="lg">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">Participantes</Typography>
          <Typography color="text.secondary">Registros y resultados de los juegos</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => exportCsv(filtered)} disabled={!filtered.length}>
            CSV
          </Button>
          <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={() => exportPdf(filtered)} disabled={!filtered.length}>
            PDF
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} md={3}>
              <StatCard icon={<PeopleIcon sx={{ color: '#fff' }} />} label="Participantes" value={stats.total} color="primary.main" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard icon={<QuizIcon sx={{ color: '#fff' }} />} label="Jugaron trivia" value={stats.triviaJugada} color="secondary.main" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard icon={<CasinoIcon sx={{ color: '#fff' }} />} label="Giraron ruleta" value={stats.ruletaJugada} color="#E87CB2" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard icon={<EmojiEventsIcon sx={{ color: '#fff' }} />} label="Premiados" value={stats.premiados} color="#F7941E" />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={12}>
              <TextField
                placeholder="Buscar por nombre o teléfono…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="disabled" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <TextField select label="Día" value={dia} onChange={(e) => setDia(e.target.value)} fullWidth>
                <MenuItem value="todos">Todos los días</MenuItem>
                {days.map((d) => (
                  <MenuItem key={d} value={d} sx={{ textTransform: 'capitalize' }}>
                    {dayLabel(d)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={4} md={4}>
              <TextField select label="Trivia" value={triviaF} onChange={(e) => setTriviaF(e.target.value)} fullWidth>
                <MenuItem value="todos">Todas</MenuItem>
                <MenuItem value="jugada">Jugaron</MenuItem>
                <MenuItem value="no">No jugaron</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} sm={4} md={4}>
              <TextField select label="Ruleta" value={ruletaF} onChange={(e) => setRuletaF(e.target.value)} fullWidth>
                <MenuItem value="todos">Todas</MenuItem>
                <MenuItem value="gano">Ganaron premio</MenuItem>
                <MenuItem value="sinpremio">Sin premio</MenuItem>
                <MenuItem value="no">No jugaron</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'rgba(236,14,142,0.08)' } }}>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Registrado</TableCell>
                  <TableCell align="center">Trivia</TableCell>
                  <TableCell>Ruleta</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.nombre}</TableCell>
                    <TableCell>{u.telefono}</TableCell>
                    <TableCell>{fmtDate(u.createdAt)}</TableCell>
                    <TableCell align="center">
                      {u.trivia?.played ? (
                        <Chip size="small" color="success" label={`${u.trivia.score}/${u.trivia.total}`} />
                      ) : (
                        <Chip size="small" variant="outlined" label="—" />
                      )}
                    </TableCell>
                    <TableCell>
                      {u.ruleta?.played ? (
                        <Chip size="small" color={u.ruleta.prizeType === 'win' ? 'secondary' : 'default'} label={u.ruleta.prizeLabel} />
                      ) : (
                        <Chip size="small" variant="outlined" label="—" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Eliminar participante">
                        <IconButton size="small" color="error" onClick={() => setToDelete(u)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {!filtered.length && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      Sin resultados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(e, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50, 100]}
              labelRowsPerPage="Por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
            />
          </TableContainer>
        </>
      )}

      <Dialog open={Boolean(toDelete)} onClose={() => !deleting && setToDelete(null)}>
        <DialogTitle>Eliminar participante</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que quieres eliminar a <strong>{toDelete?.nombre}</strong> ({toDelete?.telefono})? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)} disabled={deleting}>
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageShell>
  );
}
