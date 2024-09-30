import React from 'react';
import '../Style/Home.css';
import {Chart, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {Doughnut,Line} from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend, Title);
Chart.defaults.plugins.tooltip.backgroundColor = 'rgb(0, 0, 156)';
Chart.defaults.plugins.legend.position = 'right';
Chart.defaults.plugins.legend.title.display = true;
Chart.defaults.plugins.legend.title.text = 'Todays Attendance';
Chart.defaults.plugins.legend.title.font = 'Helvetica Neue';

function Home() {
    

    return (
        <div className="home-container">
            <div>InOut</div>
            <div className='Total-emp'>
                <div className='emp-icon'>emp-Icon</div>
                <div className='tot-emp-value'>dummy number</div>
                <h5 className='tot-emp-head'>Total Employees</h5>
            </div>

            <div className='today-attendance'>
            <Doughnut
                data={{
                labels: [
                    'Active',
                    'Inactive'
                ],
                datasets: [{
    data: [60,40],
    backgroundColor: [
      'rgb(0, 197, 0)',
      'rgb(204, 223, 243)'
    ],
    borderWidth: 2,
    radius: '90%',
    cutout:"87%"
  }]}}

          /> 
          <div className='check-in-status'>

            <Doughnut
                data={{
                labels: [
                    'Present',
                    'Absent'
                ],
                datasets: [{
    data: [60,40],
    backgroundColor: [
      'rgb(0, 197, 0)',
      'rgb(204, 223, 243)'
    ],
    borderWidth: 2,
    radius: '90%',
    cutout:"87%"
  }]}}

          /> 
          </div>

          <div className='over-view'>
                {/* <Line data={{
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "First dataset",
      data: [33, 53, 85, 41, 44, 65],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)"
    },
    {
      label: "Second dataset",
      data: [33, 25, 35, 51, 54, 76],
      fill: false,
      borderColor: "#742774"
    }
  ]
}} 

            /> */}
          </div>
            </div>
        </div>
    );
}

export default Home;
