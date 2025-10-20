import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FERTILIZER_TYPES } from "@/core/constant";
import { useDispatch } from "react-redux";
import {
  createFertilizer,
  updateFertilizer,
} from "@/features/fertilizers/fertilizerSlice";

const FertilizerModal = ({ isOpen, onClose, editingFertilizer }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingFertilizer) {
      setName(editingFertilizer.name);
      setType(editingFertilizer.type);
      setDescription(editingFertilizer.description || "");
    } else {
      setName("");
      setType("");
      setDescription("");
    }
  }, [editingFertilizer]);

  const handleSubmit = async () => {
    const payload = { name, type, description };
    console.log(payload);
    if (editingFertilizer) {
      await dispatch(
        updateFertilizer({ id: editingFertilizer._id, data: payload })
      );
    } else {
      await dispatch(createFertilizer(payload));
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingFertilizer ? "Edit Fertilizer" : "Add Fertilizer"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {FERTILIZER_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingFertilizer ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FertilizerModal;
