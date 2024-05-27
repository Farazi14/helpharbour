﻿import React, { useEffect, useState } from 'react';                                                 // Import the useEffect and useState hooks
import { Doughnut } from 'react-chartjs-2';                                                         // Import the Doughnut chart component
import 'chart.js/auto';                                                                             // Ensure Chart.js components are auto-registered
import { useAuth } from '../context/AuthContext';                                                   // Import the useAuth hook

const Charts = () => {
    const { user }                  = useAuth();                                                    // Get the user from the AuthContext
    const [chartData, setChartData] = useState({                                                    // Define the state variable for storing the chart data
        datasets: [],
    });
       
    useEffect(() => {
        // Fetch data for the chart
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/ticket/user/${user.userID}/status-counts`);      //API call to get the status counts for the user
                if (response.ok) {
                    const data = await response.json();
                    
                    setChartData({                                                                  //Setting Chart Data by defining the label and dataset values            
                        labels: ['Assigned', 'Unassigned', 'Resolved'],
                        datasets: [
                            {
                                label: 'Ticket Status Counts',
                                data: [data.assignedCount, data.unassignedCount, data.resolvedCount],
                                backgroundColor: [
                                    '#36A2EB',
                                    '#FF6384',
                                    '#FFCE56'
                                ],
                                hoverBackgroundColor: [
                                    '#36A2EB',
                                    '#FF6384',
                                    '#FFCE56'
                                ]
                            }
                        ]
                    });
                } else {
                    throw new Error('Failed to fetch chart data');
                }
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchData();
    }, [user.userID]);

    return (
        <div>
            
            <div style={{ width: '500px', height: '300px' }}>
                <Doughnut data={chartData} />                                                      {/* Display the Doughnut chart */}
            </div>
        </div>
    );
};

export default Charts;