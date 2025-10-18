import * as React from 'react';
import { PrimaryColors, SecondaryColors } from "@/helpers/colors";
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsLabelCustomMarkProps } from '@mui/x-charts/ChartsLabel';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useStats from './hooks/useStats'; // Adjust path as needed

function HTMLDiamond({ className, color }: ChartsLabelCustomMarkProps) {
  return (
    <div
      className={className}
      style={{ transform: 'scale(0.6, 0.75) rotate(45deg)', background: color }}
    />
  );
}

function SVGStar({ className, color }: ChartsLabelCustomMarkProps) {
  return (
    <svg viewBox="-7.423 -7.423 14.846 14.846">
      <path
        className={className}
        d="M0,-7.528L1.69,-2.326L7.16,-2.326L2.735,0.889L4.425,6.09L0,2.875L-4.425,6.09L-2.735,0.889L-7.16,-2.326L-1.69,-2.326Z"
        fill={color}
      />
    </svg>
  );
}

function ChartCard({
  children,
  width = 400,
  height = 300
}: {
  children: React.ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        border: `2px solid ${SecondaryColors.content_4}`,
        borderRadius: '6px',
        background: SecondaryColors.background_3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 2px 8px ${SecondaryColors.dark_gray}`,
        padding: '1rem'
      }}
    >
      {children}
    </div>
  );
}

function CustomCardContent({ title, body }: { title: string; body: string }) {
  return (
    <>
      <CardContent sx={{ background: SecondaryColors.background, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: SecondaryColors.dark_gray, fontWeight: 'bold', fontSize: 28, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: SecondaryColors.dark_gray, fontSize: 16 }}>
          {body}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          sx={{
            background: SecondaryColors.background_3,
            color: PrimaryColors.red,
            boxShadow: 'none',
            '&:hover': { background: SecondaryColors.background }
          }}
        >
          Saber más
        </Button>
      </CardActions>
    </>
  );
}

export default function ChartsPage() {
  const stats = useStats();

  const cardData = [
    { title: 'Número de usuarios registrados', body: stats.users?.toString() || "0" },
    { title: 'Número de archivos subidos en el mes', body: stats.files?.toString() || "0" },
    { title: 'Número de archivos históricos', body: stats.filesAllTime?.toString() || "0" },
    { title: 'Cambios a reglas durante la última semana', body: stats.changes?.toString() || "0" },
    { title: 'Últimas notificaciones', body: stats.notifications || "Sin notificaciones" },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        alignItems: 'flex-start',
        height: '80vh',
        overflowY: 'auto',
        padding: '2rem'
      }}
    >
      {/* Left side */}
      <div style={{ flex: 1 }}>
        <h1 className="text-4xl font-bold mb-4 mt-4" style={{ color: SecondaryColors.dark_gray }}>
          Estadísticas
        </h1>

        {/* Bar & Pie Charts */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
          {stats.rulesPerMonth.length > 0 && (
            <ChartCard width={400} height={300}>
              <h2 style={{ marginBottom: '0.5rem', color: SecondaryColors.dark_gray, fontWeight: 'bold' }}>
                Reglas creadas por mes
              </h2>
              <BarChart
                xAxis={[{ data: stats.rulesPerMonth.map(m => m.month) }]}
                series={[{ data: stats.rulesPerMonth.map(m => m.count) }]}
                width={350}
                height={220}
                colors={[PrimaryColors.red]}
              />
            </ChartCard>
          )}

          {stats.ruleStatus.length > 0 && (
            <ChartCard width={350} height={250}>
              <h2 style={{ marginBottom: '0.5rem', color: SecondaryColors.dark_gray, fontWeight: 'bold' }}>
                Estatus de reglas
              </h2>
              <PieChart
                series={[
                  {
                    data: stats.ruleStatus.map(item => {
                      let labelMarkType: any = 'circle';
                      if (item.label === 'Fallida') labelMarkType = HTMLDiamond;
                      if (item.label === 'Exitosa') labelMarkType = SVGStar;
                      return {
                        label: item.label,
                        value: item.value,
                        color:
                          item.label === 'Fallida'
                            ? SecondaryColors.dark_gray
                            : item.label === 'Exitosa'
                            ? PrimaryColors.red
                            : PrimaryColors.gray,
                        labelMarkType,
                      };
                    }),
                  },
                ]}
                width={200}
                height={200}
              />
            </ChartCard>
          )}
        </Stack>

        {/* Gauges */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} style={{ marginTop: '2rem' }}>
          <ChartCard width={188} height={170}>
            <h2 style={{ marginBottom: '0.5rem', color: SecondaryColors.dark_gray, fontWeight: 'bold', textAlign: 'center' }}>
              Reglas creadas exitosamente (día)
            </h2>
            <Gauge
              width={120}
              height={120}
              value={stats.successDay ?? 0}
              sx={{
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: PrimaryColors.red,
                },
              }}
            />
          </ChartCard>
          <ChartCard width={188} height={170}>
            <h2 style={{ marginBottom: '0.5rem', color: SecondaryColors.dark_gray, fontWeight: 'bold', textAlign: 'center' }}>
              Reglas creadas exitosamente (mes)
            </h2>
            <Gauge
              width={120}
              height={120}
              value={stats.successMonth ?? 0}
              sx={{
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: PrimaryColors.red,
                },
              }}
            />
          </ChartCard>
        </Stack>
      </div>

      {/* Right side cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          minWidth: 220,
          maxWidth: 220
        }}
      >
        {cardData.map((data, idx) => (
          <Card
            variant="outlined"
            key={idx}
            sx={{
              width: 220,
              minWidth: 220,
              maxWidth: 220,
              margin: '0 auto'
            }}
          >
            <CustomCardContent {...data} />
          </Card>
        ))}
      </div>
    </div>
  );
}
