import React from 'react';
import { Bar } from 'react-chartjs-2'; // Correct import for react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Chart.js components

// Register required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100
  },
  Normal: {
    min: 100,
    max: 200
  },
  Expensive: {
    min: 200,
    max: 10000000
  }
};

const BookingsChart = (props) => {
  const chartData = {
    labels: [],
    datasets: [
      {
        label: 'Bookings per Price Range', // Optional label for your dataset
        backgroundColor: 'rgba(220,220,220,0.5)',
        borderColor: 'rgba(220,220,220,0.8)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(220,220,220,0.75)',
        hoverBorderColor: 'rgba(220,220,220,1)',
        data: []
      }
    ]
  };

  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price <= BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      }
      return prev;
    }, 0);

    chartData.labels.push(bucket);
    chartData.datasets[0].data.push(filteredBookingsCount);
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Bar data={chartData} />
    </div>
  );
};

export default BookingsChart;
