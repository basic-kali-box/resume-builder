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
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Certifications</h2>
      <p>Add your professional certifications and credentials</p>
      <div>
        {certificationsList.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div>
                <label className="text-xs">Certification Name</label>
                <Input
                  name="name"
                  onChange={(event) => handleChange(index, event)}
                  value={item?.name}
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>
              <div>
                <label className="text-xs">Issuing Organization</label>
                <Input
                  name="issuingOrganization"
                  onChange={(event) => handleChange(index, event)}
                  value={item?.issuingOrganization}
                  placeholder="e.g., Amazon Web Services"
                />
              </div>
              <div>
                <label className="text-xs">Issue Date</label>
                <Input
                  name="issueDate"
                  type="month"
                  onChange={(event) => handleChange(index, event)}
                  value={item?.issueDate}
                />
              </div>
              <div>
                <label className="text-xs">Expiration Date (Optional)</label>
                <Input
                  name="expirationDate"
                  type="month"
                  onChange={(event) => handleChange(index, event)}
                  value={item?.expirationDate}
                  placeholder="Leave blank if no expiration"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={AddNewCertification}
            className="text-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add More Certification
          </Button>
          <Button
            variant="outline"
            onClick={RemoveCertification}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
            disabled={certificationsList.length <= 1}
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Certifications;
