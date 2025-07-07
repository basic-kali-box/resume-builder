import { FaEye, FaEdit, FaTrashAlt, FaBook, FaSpinner } from "react-icons/fa";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const gradients = [
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-green-400 via-blue-500 to-purple-600",
  "from-red-400 via-yellow-500 to-green-500",
  "from-blue-500 via-teal-400 to-green-300",
  "from-pink-500 via-red-500 to-yellow-500",
];

const getRandomGradient = () => {
  return gradients[Math.floor(Math.random() * gradients.length)];
};

function ResumeCard({ resume, refreshData, onSelect, isSelected }) {
  const [loading, setLoading] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const gradient = getRandomGradient();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    console.log("Delete Resume with ID", resume._id);
    try {
      const response = await deleteThisResume(resume._id);
    } catch (error) {
      console.error("Error deleting resume:", error.message);
      toast(error.message);
    } finally {
      setLoading(false);
      setOpenAlert(false);
      refreshData();
    }
  };
  return (
    <div
      className={`relative p-4 bg-white rounded-lg border-2 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg ${
        isSelected
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect && onSelect(resume._id)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}

      {/* Resume title with theme color accent */}
      <div className="mb-4">
        <div
          className="h-2 rounded-t-lg mb-3"
          style={{ backgroundColor: resume.themeColor || '#000000' }}
        ></div>
        <h3 className="font-semibold text-lg text-gray-800 text-center mb-2">
          {resume.title}
        </h3>
        <p className="text-sm text-gray-500 text-center">
          Created {new Date(resume.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/view-resume/${resume._id}`);
          }}
          className="flex-1 text-xs"
        >
          <FaEye className="mr-1" />
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/edit-resume/${resume._id}`);
          }}
          className="flex-1 text-xs"
        >
          <FaEdit className="mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setOpenAlert(true);
          }}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <FaTrashAlt />
        </Button>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={openAlert} onClose={() => setOpenAlert(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              resume "{resume.title}" and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {loading ? <FaSpinner className="animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ResumeCard;
