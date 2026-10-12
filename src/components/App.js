
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfile,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkill,
  updateSkill,
  deleteSkill,
  addProject,
  updateProject,
  deleteProject,
  addSocial,
  updateSocial,
  deleteSocial,
  saveStarted,
  saveSucceeded,
  saveFailed,
  loadedResume,
} from "./features/resume/resumeSlice";
import "./App.css";

const API_URL = "http://localhost:4000/api/resumes";

const steps = ["Profile", "Education", "Skills", "Projects", "Social Media"];

export default function App() {
  const dispatch = useDispatch();
  const resume = useSelector((state) => state.resume);

  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [error, setError] = useState("");

  const profile = resume.profile || {};
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const social = resume.social || [];

  const handleProfile = (e) => {
    dispatch(updateProfile({ [e.target.name]: e.target.value }));
  };

  // Load the list of resumes stored by the backend.
  const loadResumeList = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to retrieve saved resumes.");
      }

      const data = await response.json();
      setSavedResumes(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Cannot connect to the server. Start the backend server.");
    }
  };

  useEffect(() => {
    loadResumeList();
  }, []);

  // Save a new resume or update an existing resume.
  const handleSave = async () => {
    dispatch(saveStarted());
    setSaved(false);
    setError("");

    try {
      const resumeId = resume.savedResumeId || resume.id;

      const payload = {
        profile,
        education,
        skills,
        projects,
        social,
        name:
          [profile.fname, profile.lname].filter(Boolean).join(" ") ||
          "Untitled Resume",
      };

      const response = await fetch(
        resumeId ? `${API_URL}/${resumeId}` : API_URL,
        {
          method: resumeId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("The server could not save your resume.");
      }

      const result = await response.json();
      const id = result.id || result._id || resumeId;

      if (!id) {
        throw new Error("The server did not return a resume ID.");
      }

      dispatch(saveSucceeded(id));
      setSelectedResumeId(String(id));
      setSaved(true);

      await loadResumeList();
    } catch (err) {
      dispatch(saveFailed(err.message));
      setError(err.message);
      console.error("Save failed:", err);
    }
  };

  // Retrieve a saved resume from the backend.
  const handleLoadResume = async () => {
    if (!selectedResumeId) return;

    setError("");

    try {
      const response = await fetch(`${API_URL}/${selectedResumeId}`);

      if (!response.ok) {
        throw new Error("Unable to load this resume.");
      }

      const data = await response.json();
      dispatch(loadedResume(data));
      setSaved(true);
      setStep(0);
    } catch (err) {
      setError(err.message);
      console.error("Load failed:", err);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Resume Builder</h1>
          <p>Create and manage your professional resume.</p>
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save Resume
        </button>
      </header>

      <div className="load-resume">
        <select
          value={selectedResumeId}
          onChange={(e) => setSelectedResumeId(e.target.value)}
        >
          <option value="">Select a saved resume</option>
          {savedResumes.map((item) => {
            const id = item.id || item._id;
            return (
              <option key={id} value={id}>
                {item.name ||
                  [
                    item.profile?.fname,
                    item.profile?.lname,
                  ].filter(Boolean).join(" ") ||
                  "Untitled Resume"}
              </option>
            );
          })}
        </select>

        <button
          className="secondary-btn"
          onClick={handleLoadResume}
          disabled={!selectedResumeId}
        >
          Load Resume
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {saved && <p className="success-message">Resume saved or loaded successfully.</p>}

      <nav className="steps">
        {steps.map((item, index) => (
          <button
            key={item}
            className={step === index ? "step active" : "step"}
            onClick={() => setStep(index)}
          >
            <span>{index + 1}</span>
            {item}
          </button>
        ))}
      </nav>

      <main className="layout">
        <section className="form-panel">
          {step === 0 && (
            <>
              <h2>Personal Information</h2>
              <p className="subtitle">Enter your contact details.</p>

              <div className="form-grid">
                <Field label="First Name">
                  <input
                    name="fname"
                    value={profile.fname || ""}
                    onChange={handleProfile}
                    placeholder="First name"
                  />
                </Field>

                <Field label="Last Name">
                  <input
                    name="lname"
                    value={profile.lname || ""}
                    onChange={handleProfile}
                    placeholder="Last name"
                  />
                </Field>

                <Field label="Phone">
                  <input
                    name="phone"
                    value={profile.phone || ""}
                    onChange={handleProfile}
                    placeholder="Phone number"
                  />
                </Field>

                <Field label="Website">
                  <input
                    name="url"
                    value={profile.url || ""}
                    onChange={handleProfile}
                    placeholder="Portfolio URL"
                  />
                </Field>

                <Field label="Address" wide>
                  <textarea
                    name="address"
                    value={profile.address || ""}
                    onChange={handleProfile}
                    placeholder="Your address"
                    rows="3"
                  />
                </Field>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2>Education</h2>
              <p className="subtitle">Add your qualifications.</p>

              {education.map((item, index) => (
                <div className="entry" key={item.id || index}>
                  <div className="entry-heading">
                    <h3>Education {index + 1}</h3>
                    <button
                      id="delete"
                      className="delete-btn"
                      onClick={() => dispatch(deleteEducation(index))}
                    >
                      Delete
                    </button>
                  </div>

                  <Field label="Course Name">
                    <input
                      name="courseName"
                      value={item.courseName || ""}
                      onChange={(e) =>
                        dispatch(updateEducation({
                          index,
                          data: { courseName: e.target.value },
                        }))
                      }
                    />
                  </Field>

                  <Field label="Completion Year">
                    <input
                      name="completionYear"
                      value={item.completionYear || ""}
                      onChange={(e) =>
                        dispatch(updateEducation({
                          index,
                          data: { completionYear: e.target.value },
                        }))
                      }
                    />
                  </Field>

                  <Field label="College">
                    <input
                      name="college"
                      value={item.college || ""}
                      onChange={(e) =>
                        dispatch(updateEducation({
                          index,
                          data: { college: e.target.value },
                        }))
                      }
                    />
                  </Field>

                  <Field label="Percentage / CGPA">
                    <input
                      name="percentage"
                      value={item.percentage || ""}
                      onChange={(e) =>
                        dispatch(updateEducation({
                          index,
                          data: { percentage: e.target.value },
                        }))
                      }
                    />
                  </Field>
                </div>
              ))}

              <button
                id="add_education"
                className="secondary-btn"
                onClick={() => dispatch(addEducation())}
              >
                + Add Education
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Skills</h2>
              <p className="subtitle">Add your skills.</p>

              {skills.map((item, index) => (
                <div className="inline-entry" key={index}>
                  <input
                    name="skill"
                    value={typeof item === "string" ? item : item.skill || ""}
                    onChange={(e) =>
                      dispatch(updateSkill({
                        index,
                        skill: e.target.value,
                      }))
                    }
                    placeholder="Enter a skill"
                  />

                  <button
                    id="delete_skill"
                    className="delete-btn"
                    onClick={() => dispatch(deleteSkill(index))}
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                id="add_skill"
                className="secondary-btn"
                onClick={() => dispatch(addSkill())}
              >
                + Add Skill
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <h2>Projects</h2>
              <p className="subtitle">Showcase your projects.</p>

              {projects.map((item, index) => (
                <div className="entry" key={item.id || index}>
                  <div className="entry-heading">
                    <h3>Project {index + 1}</h3>
                    <button
                      id="delete"
                      className="delete-btn"
                      onClick={() => dispatch(deleteProject(index))}
                    >
                      Delete
                    </button>
                  </div>

                  <Field label="Project Name">
                    <input
                      name="projectName"
                      value={item.projectName || ""}
                      onChange={(e) =>
                        dispatch(updateProject({
                          index,
                          data: { projectName: e.target.value },
                        }))
                      }
                    />
                  </Field>

                  <Field label="Technology Stack">
                    <input
                      name="techStack"
                      value={item.techStack || ""}
                      onChange={(e) =>
                        dispatch(updateProject({
                          index,
                          data: { techStack: e.target.value },
                        }))
                      }
                    />
                  </Field>

                  <Field label="Description">
                    <textarea
                      name="description"
                      rows="3"
                      value={item.description || ""}
                      onChange={(e) =>
                        dispatch(updateProject({
                          index,
                          data: { description: e.target.value },
                        }))
                      }
                    />
                  </Field>
                </div>
              ))}

              <button
                id="add_project"
                className="secondary-btn"
                onClick={() => dispatch(addProject())}
              >
                + Add Project
              </button>
            </>
          )}

          {step === 4 && (
            <>
              <h2>Social Media</h2>
              <p className="subtitle">Add your profile links.</p>

              {social.map((item, index) => (
                <div className="inline-entry" key={index}>
                  <input
                    name="Social"
                    value={typeof item === "string" ? item : item.Social || ""}
                    onChange={(e) =>
                      dispatch(updateSocial({
                        index,
                        value: e.target.value,
                      }))
                    }
                    placeholder="LinkedIn or GitHub URL"
                  />

                  <button
                    id="delete"
                    className="delete-btn"
                    onClick={() => dispatch(deleteSocial(index))}
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                id="add_social"
                className="secondary-btn"
                onClick={() => dispatch(addSocial())}
              >
                + Add Social Link
              </button>
            </>
          )}

          <div className="navigation">
            <button
              id="back"
              className="secondary-btn"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
            >
              Back
            </button>

            {step < 4 ? (
              <button
                id="next"
                className="primary-btn"
                onClick={() => setStep((current) => Math.min(4, current + 1))}
              >
                Next
              </button>
            ) : (
              <button
                id="save_continue"
                className="primary-btn"
                onClick={handleSave}
              >
                Save & Continue
              </button>
            )}
          </div>
        </section>

        <ResumePreview
          profile={profile}
          education={education}
          skills={skills}
          projects={projects}
          social={social}
        />
      </main>
    </div>
  );
}

function Field({ label, wide, children }) {
  return (
    <label className={`field ${wide ? "wide" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function ResumePreview({ profile, education, skills, projects, social }) {
  return (
    <aside className="preview-panel">
      <div className="preview-top">
        <span className="preview-label">LIVE PREVIEW</span>
        <button className="print-btn" onClick={() => window.print()}>
          Print / PDF
        </button>
      </div>

      <article className="resume-paper">
        <div className="resume-heading">
          <h2>
            {[profile.fname, profile.lname].filter(Boolean).join(" ") ||
              "Your Name"}
          </h2>
          {profile.address && <p>{profile.address}</p>}
          {profile.phone && <p>{profile.phone}</p>}
          {profile.url && <p>{profile.url}</p>}
        </div>

        {education.length > 0 && (
          <ResumeSection title="Education">
            {education.map((item, index) => (
              <div key={index} className="preview-item">
                <strong>{item.courseName || "Course Name"}</strong>
                <p>{item.college}</p>
                <p>
                  {[item.completionYear, item.percentage]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            ))}
          </ResumeSection>
        )}

        {skills.length > 0 && (
          <ResumeSection title="Skills">
            <p>
              {skills
                .map((item) =>
                  typeof item === "string" ? item : item.skill
                )
                .filter(Boolean)
                .join(" • ")}
            </p>
          </ResumeSection>
        )}

        {projects.length > 0 && (
          <ResumeSection title="Projects">
            {projects.map((item, index) => (
              <div key={index} className="preview-item">
                <strong>{item.projectName || "Project Name"}</strong>
                <p>{item.techStack}</p>
                <p>{item.description}</p>
              </div>
            ))}
          </ResumeSection>
        )}

        {social.length > 0 && (
          <ResumeSection title="Social Media">
            {social.map((item, index) => (
              <p key={index}>
                {typeof item === "string" ? item : item.Social}
              </p>
            ))}
          </ResumeSection>
        )}
      </article>
    </aside>
  );
}

function ResumeSection({ title, children }) {
  return (
    <section className="resume-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
