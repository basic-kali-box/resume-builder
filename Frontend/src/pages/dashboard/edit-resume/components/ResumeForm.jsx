import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import PersonalDetails from "./form-components/PersonalDetails";
import Summary from "./form-components/Summary";
import Experience from "./form-components/Experience";
import Education from "./form-components/Education";
import Skills from "./form-components/Skills";
import Project from "./form-components/Project";
import Certifications from "./form-components/Certifications";


import { ArrowLeft, ArrowRight, HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeColor from "./ThemeColor";

function ResumeForm() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enanbledNext, setEnabledNext] = useState(true);
  const [enanbledPrev, setEnabledPrev] = useState(true);
  const resumeInfo = useSelector((state) => state.editResume.resumeData);

  useEffect(() => {
    if (currentIndex === 0) {
      setEnabledPrev(false);
    } else if (currentIndex == 1) {
      setEnabledPrev(true);
    } else if (currentIndex === 6) {
      setEnabledNext(false);
    }
  }, [currentIndex]);

  // To Add Dummy Data
  // useEffect(() => {
  //   dispatch(addResumeData(data));
  // }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
        <div className="flex gap-2 items-center">
          <Link to="/dashboard">
            <Button className="btn-touch">
              <HomeIcon />
            </Button>
          </Link>
          <ThemeColor resumeInfo={resumeInfo}/>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {currentIndex > 0 && (
            <Button
              size="sm"
              className="text-sm gap-2 btn-touch flex-1 sm:flex-none"
              disabled={!enanbledPrev}
              onClick={() => {
                if (currentIndex === 0) return;
                setCurrentIndex(currentIndex - 1);
              }}
            >
              <ArrowLeft /> <span className="hidden sm:inline">Prev</span>
            </Button>
          )}
          {currentIndex < 6 && (
            <Button
              size="sm"
              className="gap-2 btn-touch flex-1 sm:flex-none"
              disabled={!enanbledNext}
              onClick={() => {
                if (currentIndex >= 6) return;
                setCurrentIndex(currentIndex + 1);
              }}
            >
              <span className="hidden sm:inline">Next</span> <ArrowRight className="text-sm" />
            </Button>
          )}
        </div>
      </div>
      {currentIndex === 0 && (
        <PersonalDetails
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
        />
      )}
      {currentIndex === 1 && (
        <Education
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enabledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 2 && (
        <Summary
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enanbledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 3 && (
        <Experience
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enanbledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 4 && (
        <Project
          resumeInfo={resumeInfo}
          setEnabledNext={setEnabledNext}
          setEnabledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 5 && (
        <Skills
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enanbledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 6 && (
        <Certifications
          resumeInfo={resumeInfo}
          enabledNext={setEnabledNext}
          enabledPrev={setEnabledPrev}
        />
      )}
    </div>
  );
}

export default ResumeForm;
