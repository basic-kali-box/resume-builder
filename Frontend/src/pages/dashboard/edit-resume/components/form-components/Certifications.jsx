import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateResumeData } from "@/Services/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

function Certifications({ resumeInfo, enabledNext }) {
  const [loading, setLoading] = React.useState(false);
  const [certificationsList, setCertificationsList] = React.useState(
    resumeInfo?.certifications || [
      {
        name: "",
        issuingOrganization: "",
        issueDate: "",
        expirationDate: "",
      },
    ]
  );

  const dispatch = useDispatch();
  const { resume_id } = useParams();

  useEffect(() => {
    if (resumeInfo?.certifications?.length > 0) {
      setCertificationsList(resumeInfo.certifications);
    }
  }, [resumeInfo]);

  const handleChange = (index, event) => {
    const newEntries = certificationsList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setCertificationsList(newEntries);
  };

  const AddNewCertification = () => {
    setCertificationsList([
      ...certificationsList,
      {
        name: "",
        issuingOrganization: "",
        issueDate: "",
        expirationDate: "",
      },
    ]);
  };

  const RemoveCertification = () => {
    setCertificationsList((certificationsList) => certificationsList.slice(0, -1));
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        certifications: certificationsList.map((item) => ({
          name: item?.name,
          issuingOrganization: item?.issuingOrganization,
          issueDate: item?.issueDate,
          expirationDate: item?.expirationDate,
        })),
      },
    };

    updateThisResume(resume_id, data)
      .then((resp) => {
        console.log(resp);

        // Update Redux store with the complete updated resume data
        if (resp && resp.data) {
          dispatch(addResumeData(resp.data));
        }

        setLoading(false);
        toast.success("Certifications updated successfully!");
        enabledNext(true);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Failed to update certifications");
        console.error(error);
      });
  };

  return (
    <div className="mobile-card border-t-primary border-t-4 mt-6 sm:mt-10">
      <h2 className="font-bold text-lg sm:text-xl">Certifications</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6">Add your professional certifications and credentials</p>

      <div className="space-y-6">
        {certificationsList.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Certification {index + 1}</h3>
              {certificationsList.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newList = certificationsList.filter((_, i) => i !== index);
                    setCertificationsList(newList);
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 btn-touch"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="mobile-form-grid gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-2">Certification Name *</label>
                <Input
                  name="name"
                  onChange={(event) => handleChange(index, event)}
                  value={item?.name}
                  placeholder="e.g., AWS Certified Solutions Architect"
                  className="btn-touch"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-2">Issuing Organization *</label>
                <Input
                  name="issuingOrganization"
                  onChange={(event) => handleChange(index, event)}
                  value={item?.issuingOrganization}
                  placeholder="e.g., Amazon Web Services"
                  className="btn-touch"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Issue Date *</label>
                <Input
                  name="issueDate"
                  type="month"
                  onChange={(event) => handleChange(index, event)}
                  value={item?.issueDate}
                  className="btn-touch"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Expiration Date</label>
                <Input
                  name="expirationDate"
                  type="month"
                  onChange={(event) => handleChange(index, event)}
                  value={item?.expirationDate}
                  placeholder="Leave blank if no expiration"
                  className="btn-touch"
                />
                <p className="text-xs text-gray-500 mt-1">Optional - leave blank if certification doesn't expire</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={AddNewCertification}
            className="text-primary flex items-center justify-center gap-2 btn-touch"
          >
            <Plus className="h-4 w-4" />
            Add Certification
          </Button>
          <Button
            variant="outline"
            onClick={RemoveCertification}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center justify-center gap-2 btn-touch"
            disabled={certificationsList.length <= 1}
          >
            <Trash2 className="h-4 w-4" />
            Remove Last
          </Button>
        </div>
        <Button
          disabled={loading}
          onClick={onSave}
          className="btn-touch w-full sm:w-auto"
        >
          {loading ? <LoaderCircle className="animate-spin" /> : "Save Certifications"}
        </Button>
      </div>
    </div>
  );
}

export default Certifications;
