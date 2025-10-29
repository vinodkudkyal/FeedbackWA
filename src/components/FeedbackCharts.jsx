import React, { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const FeedbackChart = ({ facultyId, subject, year }) => {
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/feedback?facultyId=${facultyId}&subject=${subject}&year=${year}`
        );
        const data = await response.json();

        console.log("Fetched Data:", data); // Log API response
        
        if (data.length > 0) {
          const formattedData = data.map((question) => ({
            question: question.name,
            avgRating: parseFloat(question.avgRating) || 0,
            totalRatings: question.totalRatings || 0
          }));
          
          setChartData(formattedData);
        } else {
          setChartData([]);
        }
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedbackData();
  }, [facultyId, subject, year]);

  const downloadPDF = () => {
    // Create a print-specific view
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Feedback Analysis</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { 
        font-family: Arial, sans-serif; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        padding: 20px;
      }
      h1 { color: #333; }
      .chart-container { 
        width: 100%; 
        max-width: 800px; 
        margin: 20px 0; 
      }
    `);
    printWindow.document.write('</style></head><body>');
    
    // Add title
    printWindow.document.write(`<h1>Feedback Analysis - ${subject} (${year})</h1>`);
    
    // Add chart container
    printWindow.document.write('<div class="chart-container">');
    printWindow.document.write(chartRef.current.innerHTML);
    printWindow.document.write('</div>');
    
    // Add additional details
    printWindow.document.write('<div class="details">');
    printWindow.document.write(`<p>Faculty ID: ${facultyId}</p>`);
    printWindow.document.write(`<p>Subject: ${subject}</p>`);
    printWindow.document.write(`<p>Year: ${year}</p>`);
    printWindow.document.write('</div>');
    
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Trigger print dialog
    printWindow.print();
  };

  return (
    <div className="w-full relative">
      <div ref={chartRef} className="w-full h-[400px]">
        <h3 className="text-xl font-semibold mb-4">Feedback Analysis</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="question" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgRating" fill="#82ca9d" name="Average Rating" />
            <Bar dataKey="totalRatings" fill="#8884d8" name="Total Ratings" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {chartData.length > 0 && (
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <button 
            onClick={downloadPDF}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackChart;