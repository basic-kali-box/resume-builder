import React from "react";
import { FaFileAlt, FaEye, FaDownload, FaClock, FaArrowUp, FaCalendarAlt } from "react-icons/fa";

function DashboardStats({ resumeList }) {
  const totalResumes = resumeList.length;
  const recentResumes = resumeList.filter(resume => {
    const createdDate = new Date(resume.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate > weekAgo;
  }).length;

  // Calculate growth percentage (mock data for now)
  const growthPercentage = recentResumes > 0 ? "+12%" : "0%";

  const stats = [
    {
      name: "Total Resumes",
      value: totalResumes,
      icon: FaFileAlt,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      textColor: "text-blue-600",
      description: "All time",
      trend: totalResumes > 0 ? "up" : "neutral"
    },
    {
      name: "This Week",
      value: recentResumes,
      icon: FaClock,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      textColor: "text-green-600",
      description: "New resumes",
      trend: recentResumes > 0 ? "up" : "neutral"
    },
    {
      name: "Profile Views",
      value: "0", // This would come from analytics
      icon: FaEye,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      textColor: "text-purple-600",
      description: "Coming soon",
      trend: "neutral"
    },
    {
      name: "Downloads",
      value: "0", // This would come from analytics
      icon: FaDownload,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      textColor: "text-orange-600",
      description: "PDF exports",
      trend: "neutral"
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="dashboard-stat-card group animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Header with icon and trend */}
            <div className="flex items-start justify-between mb-4">
              <div className={`icon-container bg-gradient-to-br ${stat.bgGradient} ${stat.textColor} group-hover:scale-110 transition-transform duration-200`}>
                <stat.icon className="h-6 w-6" />
              </div>

              {stat.trend === "up" && (
                <div className="flex items-center text-green-500 text-xs font-medium">
                  <FaArrowUp className="h-3 w-3 mr-1" />
                  {growthPercentage}
                </div>
              )}
            </div>

            {/* Main content */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-200">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>

            {/* Subtle bottom accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200`}></div>
          </div>
        ))}
      </div>

      {/* Summary insight */}
      {totalResumes > 0 && (
        <div className="mt-6 dashboard-card-compact bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 animate-fade-in-up animate-stagger-4">
          <div className="flex items-center gap-3">
            <div className="icon-container-sm bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600">
              <FaCalendarAlt className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {recentResumes > 0
                  ? `Great progress! You've created ${recentResumes} resume${recentResumes > 1 ? 's' : ''} this week.`
                  : "Ready to create your next resume? Start building your career story!"
                }
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Keep building to unlock more insights and analytics
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardStats;
