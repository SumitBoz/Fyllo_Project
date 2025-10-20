import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  createAvailability,
  updateAvailability,
  fetchAvailability,
} from "@/features/availability/availabilitySlice";
import { fetchFertilizers } from "@/features/fertilizers/fertilizerSlice";
import { STATES } from "@/core/constant";
import { MONTHS } from "@/core/constant";

const AvailabilityModal = ({ open, onClose, editData }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.availability);
  const { fertilizers } = useSelector((state) => state.fertilizers);

  const [form, setForm] = useState({
    fertilizer: "",
    state: "",
    month: "",
    year: "",
    availableQty: 0,
    requiredQty: 0,
  });

  useEffect(() => {
    dispatch(fetchFertilizers());
  }, [dispatch]);

  useEffect(() => {
    if (editData) {
      setForm({
        fertilizer: editData.fertilizer?._id || "",
        state: editData.state || "",
        month: editData.month || "",
        year: editData.year || new Date().getFullYear(),
        availableQty: editData.availableQty || 0,
        requiredQty: editData.requiredQty || 0,
      });
    } else {
      setForm({
        fertilizer: "",
        state: "",
        month: "",
        year: new Date().getFullYear(),
        availableQty: 0,
        requiredQty: 0,
      });
    }
  }, [editData]);

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (editData) {
      await dispatch(updateAvailability({ id: editData._id, data: form }));
    } else {
      await dispatch(createAvailability(form));
    }
    onClose();
    dispatch(fetchAvailability()); 
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Availability" : "Add Availability"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Fertilizer dropdown */}
          <div>
            <Label>Fertilizer</Label>
            <Select
              value={form.fertilizer}
              onValueChange={(v) => handleChange("fertilizer", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a fertilizer" />
              </SelectTrigger>
              <SelectContent>
                {fertilizers.map((f) => (
                  <SelectItem key={f._id} value={f._id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State dropdown */}
          <div>
            <Label>State</Label>
            <Select
              value={form.state}
              onValueChange={(v) => handleChange("state", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month & Year */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Month</Label>
              <Select
                value={form.month}
                onValueChange={(v) => handleChange("month", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, idx) => (
                    <SelectItem key={idx} value={idx + 1}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label>Year</Label>
              <Input
                type="number"
                value={form.year}
                onChange={(e) => handleChange("year", e.target.value)}
              />
            </div>
          </div>

          {/* Quantities */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Available Qty</Label>
              <Input
                type="number"
                value={form.availableQty}
                onChange={(e) =>
                  handleChange("availableQty", parseInt(e.target.value))
                }
              />
            </div>
            <div className="flex-1">
              <Label>Required Qty</Label>
              <Input
                type="number"
                value={form.requiredQty}
                onChange={(e) =>
                  handleChange("requiredQty", parseInt(e.target.value))
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : editData ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;
