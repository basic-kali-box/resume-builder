import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getResumeData } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { RWebShare } from "react-web-share";
import { toast } from "sonner";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = React.useState({});
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchResumeInfo();
  }, []);
  const fetchResumeInfo = async () => {
    const response = await getResumeData(resume_id);
    // console.log(response.data);
    dispatch(addResumeData(response.data));
  };

  const HandleDownload = () => {
    window.print();
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center py-8 bg-gray-50">
        <div id="noPrint">
          <div className="mobile-padding my-6 sm:my-10 max-w-4xl mx-auto">
            <h2 className="text-center mobile-subheading font-medium mb-4">
              Congrats! Your Ultimate AI generates Resume is ready!
            </h2>
            <p className="text-center text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
              Now you are ready to download your resume and you can share unique
              resume url with your friends and family
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Button
                onClick={HandleDownload}
                className="w-full sm:w-auto btn-touch bg-blue-600 hover:bg-blue-700 text-white"
              >
                Download PDF
              </Button>
              <RWebShare
                data={{
                  text: "Hello This is My resume",
                  url: import.meta.env.VITE_BASE_URL + "/dashboard/view-resume/" + resume_id,
                  title: "AI Resume Builder",
                }}
                onClick={() => toast("Resume Shared Successfully")}
              >
                <Button className="w-full sm:w-auto btn-touch bg-green-600 hover:bg-green-700 text-white">
                  Share Resume
                </Button>
              </RWebShare>
            </div>
          </div>
        </div>
        <div className="mobile-resume-preview bg-white rounded-lg shadow-xl print-area mb-6">
          <div className="print p-4 sm:p-8" style={{ minHeight: "297mm" }}>
            <ResumePreview />
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewResume;
