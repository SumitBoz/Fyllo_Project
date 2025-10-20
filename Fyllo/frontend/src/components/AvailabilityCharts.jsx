import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopRequired,
  fetchLeastAvailable,
} from "@/features/availability/availabilitySlice";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const AvailabilityCharts = () => {
  const dispatch = useDispatch();
  const { topRequired, leastAvailable, loading, error } = useSelector(
    (state) => state.availability
  );

  useEffect(() => {
    dispatch(fetchTopRequired());
    dispatch(fetchLeastAvailable());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading charts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 mt-10">Error: {error}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 5 Fertilizers (Most Required) */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold text-center mb-3 text-green-700">
              Top 5 Fertilizers (Most Required)
            </h2>
            {topRequired.length === 0 ? (
              <p className="text-center text-gray-500">No data available</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topRequired}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalRequired" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Least Available Fertilizers */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold text-center mb-3 text-blue-700">
              Least Available Fertilizers
            </h2>
            {leastAvailable.length === 0 ? (
              <p className="text-center text-gray-500">No data available</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leastAvailable}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {/* Correct dataKey here */}
                  <Bar dataKey="totalAvailable" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AvailabilityCharts;
