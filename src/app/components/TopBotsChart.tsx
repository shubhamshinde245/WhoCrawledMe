'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BotData {
  bot_type: string;
  visits: number;
}

interface TopBotsChartProps {
  timeRange: string;
}

export default function TopBotsChart({ timeRange }: TopBotsChartProps) {
  const [data, setData] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopBotsData();
  }, [timeRange]);

  const fetchTopBotsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?type=top-bots&timeRange=${timeRange}`);
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error('Failed to fetch top bots data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate colors for the pie chart
  const generateColors = (count: number) => {
    const colors = [
      'rgba(59, 130, 246, 0.8)',   // Blue
      'rgba(16, 185, 129, 0.8)',   // Green
      'rgba(245, 158, 11, 0.8)',   // Yellow
      'rgba(239, 68, 68, 0.8)',    // Red
      'rgba(139, 92, 246, 0.8)',   // Purple
      'rgba(236, 72, 153, 0.8)',   // Pink
      'rgba(14, 165, 233, 0.8)',   // Sky
      'rgba(34, 197, 94, 0.8)',    // Emerald
      'rgba(251, 146, 60, 0.8)',   // Orange
      'rgba(168, 85, 247, 0.8)',   // Violet
    ];
    
    const borderColors = colors.map(color => color.replace('0.8', '1'));
    
    return {
      backgroundColor: colors.slice(0, count),
      borderColor: borderColors.slice(0, count),
    };
  };

  const colors = generateColors(data.length);

  const chartData = {
    labels: data.map(item => item.bot_type),
    datasets: [
      {
        data: data.map(item => item.visits),
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
          },
          color: 'rgb(75, 85, 99)',
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} visits (${percentage}%)`;
          },
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Bot Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Bot Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🤖</div>
              <p>No bot data available for the selected time range</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Top Bot Types</span>
          <span className="text-sm font-normal text-gray-500">
            {timeRange === '24h' ? 'Last 24 Hours' : timeRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Pie data={chartData} options={options} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.length}</div>
            <div className="text-gray-500">Unique Bots</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.reduce((sum, item) => sum + item.visits, 0)}
            </div>
            <div className="text-gray-500">Total Visits</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}