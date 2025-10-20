import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFertilizers,
  deleteFertilizer,
} from "@/features/fertilizers/fertilizerSlice";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import FertilizerModal from "@/components/FertilizerModal";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Fertilizers = () => {
  const dispatch = useDispatch();
  const { fertilizers } = useSelector((state) => state.fertilizers);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFertilizer, setEditingFertilizer] = useState(null);

  useEffect(() => {
    dispatch(fetchFertilizers());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingFertilizer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (fertilizer) => {
    setEditingFertilizer(fertilizer);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this fertilizer?")) {
      dispatch(deleteFertilizer(id));
    }
  };

  // Example chart data (you can later connect this to live fertilizer availability)
  const chartData = {
    labels: fertilizers?.map((f) => f.name),
    datasets: [
      {
        label: "Fertilizer Types (Sample Visualization)",
        data: fertilizers?.map((_, i) => Math.floor(Math.random() * 100) + 20),
        fill: false,
        borderColor: "#16a34a",
        backgroundColor: "#22c55e",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#065f46",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#065f46" },
        grid: { color: "rgba(209, 250, 229, 0.4)" },
      },
      y: {
        ticks: { color: "#065f46" },
        grid: { color: "rgba(209, 250, 229, 0.4)" },
      },
    },
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-emerald-200 pb-4">
        <h1 className="text-3xl font-extrabold text-emerald-700 tracking-tight">
          Manage Fertilizers
        </h1>
        {user?.role === "admin" && (
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
            onClick={handleAdd}
          >
            + Add Fertilizer
          </Button>
        )}
      </div>

      {/* Chart Section */}
      <Card className="border border-emerald-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-emerald-700">
            Fertilizer Overview (Sample Data)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Fertilizers Table */}
      <Card className="border border-emerald-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-emerald-700 font-semibold">
            All Fertilizers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-emerald-50">
                <TableRow>
                  <TableHead className="text-emerald-800 font-medium">
                    Name
                  </TableHead>
                  <TableHead className="text-emerald-800 font-medium">
                    Type
                  </TableHead>
                  <TableHead className="text-emerald-800 font-medium">
                    Description
                  </TableHead>
                  {user?.role === "admin" && (
                    <TableHead className="text-center text-emerald-800 font-medium">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {fertilizers?.length > 0 ? (
                  fertilizers.map((f) => (
                    <TableRow
                      key={f._id}
                      className="hover:bg-emerald-50 transition-all"
                    >
                      <TableCell>{f.name}</TableCell>
                      <TableCell>{f.type}</TableCell>
                      <TableCell>{f.description}</TableCell>
                      {user?.role === "admin" && (
                        <TableCell className="text-center">
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                              onClick={() => handleEdit(f)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleDelete(f._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center py-4">
                      <span className="text-gray-500">
                        No fertilizers found.
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Fertilizer Modal */}
      <FertilizerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingFertilizer={editingFertilizer}
      />
    </div>
  );
};

export default Fertilizers;
