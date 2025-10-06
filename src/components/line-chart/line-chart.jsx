import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

const LineChart = ({ historyData }) => {
  const [data, setData] = useState([["Date", "prices"]]);
  useEffect(() => {
    let dataCopy = [["Date", "prices"]];
    if (historyData.prices) {
      historyData.prices.map((item) => {
        const date = new Date(item[0]).toLocaleDateString().slice(0, -5);
        const price = item[1];
        dataCopy.push([date, price]);
      });
      setData(dataCopy);
    }
  }, [historyData]);
  const options = {
    title: "Price Chart (Last 10 Days)",
    curveType: "function",
    legend: { position: "bottom", textStyle: { color: "#fff" } },
    backgroundColor: "#1e1e2f",
    chartArea: { width: "85%", height: "70%", backgroundColor: "#2b2b3c" },
    colors: ["#00b4d8"],
    hAxis: {
      title: "Date",
      textStyle: { color: "#ccc" },
      titleTextStyle: { color: "#aaa" },
      gridlines: { color: "#333" },
    },
    vAxis: {
      title: "Price (USD)",
      textStyle: { color: "#ccc" },
      titleTextStyle: { color: "#aaa" },
      gridlines: { color: "#333" },
    },
    titleTextStyle: { color: "#fff", fontSize: 16 },
  };
  return (
    <Chart
      chartType="LineChart"
      data={data}
      height="100%"
      legendToggle
      options={options}
    />
  );
};

export default LineChart;
