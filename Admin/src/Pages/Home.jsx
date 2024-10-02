import React, { useState ,useEffect} from 'react'
import {Chart, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, PointElement, LineElement} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from "axios"

import { useDispatch, useSelector } from 'react-redux';

Chart.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  Title, 
  CategoryScale, 
  LinearScale,    
  PointElement,   
  LineElement,    
  ChartDataLabels
);
Chart.defaults.plugins.tooltip.backgroundColor = 'rgb(0, 0, 156)';
Chart.defaults.plugins.legend.position = 'right';
Chart.defaults.plugins.legend.title.display = true;
Chart.defaults.plugins.legend.title.font = 'Helvetica Neue';

function Home() {
  const selector = useSelector(state => state.user);
  const [today,setToday]=useState({
    present:0,
    absent:0

  });
  const todayAttendance = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/today');
      const data = response.data; // Axios automatically parses the response
      console.log(data); // Log the parsed response data
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error);
    }
  };
  
  useEffect(() => {
    if(selector.user){
    todayAttendance();}
  }, []);
  
  return (
    <div className="home-container">
      <div>InOut</div>
      <div className='Total-emp'>
        <div className='emp-icon'>emp-Icon</div>
        <div className='tot-emp-value'>dummy number</div>
        <h5 className='tot-emp-head'>Total Employees</h5>
      </div>

      <div className='today-attendance'>
      <h4>Today's Attendance:</h4>
        <Doughnut
          data={{
            labels: ['Active', 'Inactive'],
            datasets: [{
              data: [today.present===0?90:today.present, today.absent===0?10:today.absent],
              backgroundColor: [
                'rgb(0, 197, 0)',
                'rgb(204, 223, 243)'
              ],
              borderWidth: 2,
              radius: '25%',
              cutout: "87%"
            }]
          }}
          options={{
            plugins: {
              datalabels: {
                formatter: (value, context) => {
                  let sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  let percentage = (value * 100 / sum).toFixed(0) + "%";
                  return percentage;
                },
                color: '#000',
                font: {
                  size: '16',
                  weight: 'bold',
                },
              },
            },
          }}
        />

        <div className='check-in-status'>
        <h4>Check-In Status</h4>
          <Doughnut
            data={{
              labels: ['Present', 'Absent'],
              datasets: [{
                data: [today.present===0?90:today.present, today.absent===0?10:today.absent],
                backgroundColor: [
                  'rgb(0, 197, 0)',
                  'rgb(204, 223, 243)'
                ],
                borderWidth: 2,
                radius: '25%',
                cutout: "87%"
              }]
            }}
            options={{
              plugins: {
                datalabels: {
                  formatter: (value, context) => {
                    let sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    let percentage = (value * 100 / sum).toFixed(0) + "%";
                    return percentage;
                  },
                  color: '#000',
                  font: {
                    size: '16',
                    weight: 'bold',
                  },
                },
              },
            }}
          />
        </div>

        <div className='over-view'>
        <h4>Statistical  Overview</h4>
          <Line
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  label: "Last 6 months",
                  data: [33, 53, 85, 41, 44, 65],
                  fill: true,
                  backgroundColor: "rgba(75,192,192,0.2)",
                  borderColor: "rgba(75,192,192,1)"
                },
                {
                  label: "Previous",
                  data: [33, 25, 35, 51, 54, 76],
                  fill: false,
                  borderColor: "#742774"
                }
              ]
            }}
            options={{
              scales: {
                x: {
                  type: 'category',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
