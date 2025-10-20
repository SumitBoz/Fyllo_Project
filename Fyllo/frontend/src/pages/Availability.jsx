import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAvailability,
  deleteAvailability,
} from "@/features/availability/availabilitySlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Trash2, Pencil } from "lucide-react";
import AvailabilityModal from "@/components/AvailabilityModal";
import AvailabilityCharts from "@/components/AvailabilityCharts";

const Availability = () => {
  const dispatch = useDispatch();
  const { availability, loading } = useSelector((state) => state.availability);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(fetchAvailability());
  }, [dispatch]);

  const handleEdit = (item) => {
    setEditData(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await dispatch(deleteAvailability(id));
    }
  };

  return (
    <div className="p-6 space-y-6 text-white bg-neutral-950 min-h-screen">
      <Card className="bg-neutral-900 border border-neutral-800 text-white shadow-lg">
        <CardHeader className="flex justify-between items-center border-b border-neutral-800">
          <CardTitle className="text-xl font-semibold text-green-400">
            Availability Management
          </CardTitle>
          <Button
            onClick={() => {
              setEditData(null);
              setModalOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-medium"
          >
            Add Availability
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-green-400" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-800 text-green-400">
                    <TableHead>Fertilizer</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Available Qty</TableHead>
                    <TableHead>Required Qty</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {availability.map((item) => (
                    <TableRow
                      key={item._id}
                      className="hover:bg-neutral-800 transition-colors"
                    >
                      <TableCell>{item.fertilizer?.name || "-"}</TableCell>
                      <TableCell>{item.state}</TableCell>
                      <TableCell>{item.month}</TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell>{item.availableQty}</TableCell>
                      <TableCell>{item.requiredQty}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                            className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item._id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-lg">
        <AvailabilityCharts />
      </div>

      <AvailabilityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editData={editData}
      />
    </div>
  );
};

export default Availability;
