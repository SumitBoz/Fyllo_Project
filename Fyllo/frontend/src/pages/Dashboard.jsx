// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchFertilizers } from "@/features/fertilizers/fertilizerSlice";
import {
  fetchAvailability,
  fetchTopRequired,
  fetchLeastAvailable,
} from "@/features/availability/availabilitySlice";
import Chart from "react-apexcharts";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { fertilizers = [] } = useSelector((state) => state.fertilizers || {});
  const {
    availability = [],
    topRequired = [],
    leastAvailable = [],
    trend = [],
    loading,
  } = useSelector((state) => state.availability || {});

  const [chartFilter, setChartFilter] = useState("all"); // all | topRequired | topAvailable | trend
  const [selectedFertilizer, setSelectedFertilizer] = useState("");
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchFertilizers());
    dispatch(fetchAvailability());
    dispatch(fetchTopRequired());
    dispatch(fetchLeastAvailable());
  }, [dispatch]);

  // Prepare chart data
  useEffect(() => {
    let data = [];
    let categories = [];

    if (chartFilter === "all") {
      data = selectedFertilizer
        ? availability
            .filter(
              (a) => a.fertilizer && a.fertilizer._id === selectedFertilizer
            )
            .map((a) => ({
              month: a.month,
              available: a.availableQty,
              required: a.requiredQty,
            }))
        : availability.map((a) => ({
            month: a.month,
            available: a.availableQty,
            required: a.requiredQty,
          }));
      categories = data.map((d) => d.month);
    } else if (chartFilter === "topRequired") {
      data = topRequired.map((f) => ({
        name: f.name,
        required: f.totalRequired,
      }));
      categories = data.map((d) => d.name);
    } else if (chartFilter === "topAvailable") {
      data = leastAvailable.map((f) => ({
        name: f.name,
        available: f.availableQty || f.totalAvailable || 0,
      }));
      categories = data.map((d) => d.name);
    } else if (chartFilter === "trend") {
      data = selectedFertilizer
        ? trend
            .filter(
              (t) => t.fertilizer && t.fertilizer._id === selectedFertilizer
            )
            .map((t) => ({
              month: t.month,
              available: t.availableQty,
              required: t.requiredQty,
            }))
        : trend.map((t) => ({
            month: t.month,
            available: t.availableQty,
            required: t.requiredQty,
          }));
      categories = data.map((d) => d.month);
    }

    const availableSeries = data.map((d) => d.available || 0);
    const requiredSeries = data.map((d) => d.required || 0);

    setChartData([
      { name: "Available", data: availableSeries },
      { name: "Required", data: requiredSeries },
    ]);

    setChartOptions({
      chart: {
        background: "transparent",
        toolbar: { show: false },
        foreColor: "#ccc",
      },
      theme: { mode: "dark" },
      grid: {
        borderColor: "#2f2f2f",
      },
      xaxis: {
        categories,
        labels: { style: { colors: "#9ca3af" } },
      },
      yaxis: {
        labels: { style: { colors: "#9ca3af" } },
      },
      colors: ["#16a34a", "#22c55e"],
      stroke: {
        width: 3,
        curve: "smooth",
      },
      legend: {
        labels: { colors: "#fff" },
      },
      tooltip: {
        theme: "dark",
      },
    });
  }, [
    chartFilter,
    selectedFertilizer,
    availability,
    topRequired,
    leastAvailable,
    trend,
    fertilizers,
  ]);

  return (
    <div className="space-y-6 p-6 bg-neutral-950 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-green-400">Dashboard</h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        {["all", "topRequired", "topAvailable", "trend"].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              chartFilter === filter
                ? "bg-green-600 text-white"
                : "bg-neutral-800 hover:bg-neutral-700 text-gray-300"
            }`}
            onClick={() => setChartFilter(filter)}
          >
            {filter === "all"
              ? "All Fertilizers"
              : filter === "topRequired"
              ? "Top Required"
              : filter === "topAvailable"
              ? "Top Available"
              : "Trend"}
          </button>
        ))}
      </div>

      {/* Fertilizer Select */}
      {(chartFilter === "all" || chartFilter === "trend") && (
        <Card className="bg-neutral-900 border border-neutral-800 text-white">
          <CardHeader>
            <CardTitle className="text-green-400">Select Fertilizer</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              className="w-full p-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setSelectedFertilizer(e.target.value)}
            >
              <option value="">-- All Fertilizers --</option>
              {fertilizers.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      )}

      {/* Chart Card */}
      <Card className="bg-neutral-900 border border-neutral-800 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-green-400">
            {chartFilter === "all"
              ? selectedFertilizer
                ? `Trend: ${
                    fertilizers.find((f) => f._id === selectedFertilizer)?.name
                  }`
                : "All Fertilizers Trend"
              : chartFilter === "topRequired"
              ? "Top Required Fertilizers"
              : chartFilter === "topAvailable"
              ? "Top Available Fertilizers"
              : selectedFertilizer
              ? `Trend: ${
                  fertilizers.find((f) => f._id === selectedFertilizer)?.name
                }`
              : "Fertilizer Trend"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-green-400" />
            </div>
          ) : chartData.length === 0 ? (
            <p className="text-center text-gray-400">No data available</p>
          ) : (
            <div className="w-full h-[400px]">
              <Chart
                options={chartOptions}
                series={chartData}
                type="line"
                height="100%"
                width="100%"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
