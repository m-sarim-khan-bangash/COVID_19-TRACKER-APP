import React from "react";
import { Line } from "react-chartjs-2";
const LineGraph = (props) => {
  return (
    <div
      style={{
        maxWidth: "600px",
        minWidth: "300px",
        height: "800px",
        margin: "50px auto",
      }}
    >
      <Line
        data={{
          labels: props.label,
          datasets: [
            {
              label: "COVID_19 Data",
              fill: true,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "#ff4757",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "red",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: props.yAxis,
            },
          ],
        }}
      />
    </div>
  );
};

export default LineGraph;
