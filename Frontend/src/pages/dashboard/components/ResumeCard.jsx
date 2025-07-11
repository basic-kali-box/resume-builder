import { FaEye, FaEdit, FaTrashAlt, FaBook, FaSpinner, FaCalendarAlt, FaClock, FaCheckCircle } from "react-icons/fa";
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
  "from-purple-500 via-pink-500 to-red-500",
  "from-cyan-400 via-blue-500 to-purple-600",
  "from-emerald-400 via-teal-500 to-blue-600",
];

const getRandomGradient = () => {
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
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
      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error("Error deleting resume:", error.message);
      toast.error(error.message || "Failed to delete resume");
    } finally {
      setLoading(false);
      setOpenAlert(false);
      refreshData();
    }
  };

  const createdDate = formatDate(resume.createdAt);
  const isRecent = new Date(resume.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`relative dashboard-card group cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
        isSelected
          ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg border-blue-200 bg-blue-50'
          : 'hover:shadow-xl hover:border-gray-300'
      }`}
      onClick={() => onSelect && onSelect(resume._id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
          <FaCheckCircle className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Recent badge */}
      {isRecent && !isSelected && (
        <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-full shadow-lg animate-scale-in">
          New
        </div>
      )}

      {/* Header with gradient accent */}
      <div className="relative mb-4">
        <div
          className={`h-3 rounded-t-xl mb-4 bg-gradient-to-r ${gradient} transition-all duration-300 ${
            isHovered ? 'h-4' : 'h-3'
          }`}
        ></div>

        {/* Resume icon and title */}
        <div className="flex items-start gap-3">
          <div className="icon-container-sm bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
            <FaBook className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 truncate group-hover:text-blue-600 transition-colors">
              {resume.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FaCalendarAlt className="w-3 h-3" />
              <span>Created {createdDate}</span>
              {isRecent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                  <FaClock className="w-2 h-2" />
                  Recent
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/view-resume/${resume._id}`);
          }}
          className="flex-1 btn-modern-ghost text-xs group/btn"
        >
          <FaEye className="mr-2 group-hover/btn:scale-110 transition-transform" />
          <span className="hidden sm:inline">View</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/edit-resume/${resume._id}`);
          }}
          className="flex-1 btn-modern-ghost text-xs group/btn"
        >
          <FaEdit className="mr-2 group-hover/btn:scale-110 transition-transform" />
          <span className="hidden sm:inline">Edit</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenAlert(true);
          }}
          className="flex-1 btn-modern-ghost text-xs text-red-600 hover:text-red-700 hover:bg-red-50 group/btn"
        >
          <FaTrashAlt className="mr-2 group-hover/btn:scale-110 transition-transform" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>

      {/* Hover overlay effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl transition-opacity duration-300 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={openAlert} onClose={() => setOpenAlert(false)}>
        <AlertDialogContent className="mx-4 sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              This action cannot be undone. This will permanently delete your
              resume "{resume.title}" and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => setOpenAlert(false)} className="btn-touch w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading} className="btn-touch w-full sm:w-auto">
              {loading ? <FaSpinner className="animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ResumeCard;
