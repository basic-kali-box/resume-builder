import React from "react";
import { FaFileAlt, FaEye, FaDownload, FaClock } from "react-icons/fa";

function DashboardStats({ resumeList }) {
  const totalResumes = resumeList.length;
  const recentResumes = resumeList.filter(resume => {
    const createdDate = new Date(resume.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate > weekAgo;
  }).length;

  const stats = [
    {
      name: "Total Resumes",
      value: totalResumes,
      icon: FaFileAlt,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      name: "Created This Week",
      value: recentResumes,
      icon: FaClock,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      name: "Total Views",
      value: "0", // This would come from analytics
      icon: FaEye,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      name: "Downloads",
      value: "0", // This would come from analytics
      icon: FaDownload,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;
