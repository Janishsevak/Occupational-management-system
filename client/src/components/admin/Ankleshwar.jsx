import React, { useEffect, useState } from "react";
import axios from "axios";
import { PureComponent } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Legend,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

function Ankleshwar() {
  const [data, setdata] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/injurydata/injurydata",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            "x-origin": "Ankleshwar",
          },
        }
      );

      const entries = res.data.entries || res.data;

      // 🟦 Pie Chart Data (by Injury Type)
      const injuryCounts = {};
      entries.forEach((entry) => {
        const injury = entry.injury?.trim() || "Unknown";
        injuryCounts[injury] = (injuryCounts[injury] || 0) + 1;
      });

      const pieData = Object.entries(injuryCounts).map(([name, value]) => ({
        name,
        value,
      }));

      setdata(pieData); // ✅ This fixes your pie chart issue!

      // 🟧 Bar Chart Data (by Month-Year)
      const injuryByMonth = {};
      entries.forEach((entry) => {
        if (entry.date) {
          const date = new Date(entry.date);
          const monthYear = date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });

          injuryByMonth[monthYear] = (injuryByMonth[monthYear] || 0) + 1;
        }
      });

      const monthlyFormatted = Object.entries(injuryByMonth).map(
        ([month, count]) => ({
          month,
          count,
        })
      );
      // Optional: sort chronologically
      monthlyFormatted.sort((a, b) => {
        const [aMonth, aYear] = a.month.split(" ");
        const [bMonth, bYear] = b.month.split(" ");
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const aIndex = parseInt(aYear) * 12 + months.indexOf(aMonth);
        const bIndex = parseInt(bYear) * 12 + months.indexOf(bMonth);
        return aIndex - bIndex;
      });

      setMonthlyData(monthlyFormatted);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchData();
    }
  }, []);
  const COLORS = ["#0088FE", "#00C49F", "#8228ff", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-[80%] w-full">
      <div className="grid grid-cols-3 gap-3 p-4 ml-10">
        <div className="bg-gray-100 h-[300px] w-full shadow rounded-lg">
          <h1 className="text-center font-semibold mb-2">Injury Graph</h1>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="top" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* <div className="bg-white h-[300px] w-full shadow rounded-lg">
          <h1 className="text-center font-semibold mb-2">Injury year Graph</h1>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="top" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white h-[300px] w-full shadow rounded-lg">
          <h1 className="text-center font-semibold mb-2">Injury month Graph</h1>
              <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="top" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div> */}
        <div className="bg-gray-100 h-[300px] w-full shadow rounded-lg">
          <h1 className="text-center font-semibold mb-2">
            Injury by Month & Year
          </h1>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8">
                <LabelList dataKey="count" position="top" />
              </Bar>

            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Ankleshwar;
