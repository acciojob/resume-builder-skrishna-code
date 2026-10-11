
import React, { useState } from "react";
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
  saveSucceeded,
} from "./features/resume/resumeSlice";
import "./App.css";

const steps = ["Profile", "Education", "Skills", "Projects", "Social Media"];

export default function App() {
  const dispatch = useDispatch();
  const resume = useSelector((state) => state.resume);

  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);

  const profile = resume.profile || {};
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const social = resume.social || [];

  const handleProfile = (e) => {
    dispatch(
      updateProfile({
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleSave = () => {
    const id = resume.id || String(Date.now());

    localStorage.setItem(
      "resume",
      JSON.stringify({ ...resume, id })
    );

    dispatch(saveSucceeded(id));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const next = () => setStep((current) => Math.min(current + 1, 4));
  const back = () => setStep((current) => Math.max(current - 1, 0));

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Resume Builder</h1>
          <p>Create a professional resume in minutes.</p>
        </div>
        <button className="save-btn" onClick={handleSave}>
          Save Resume
        </button>
      </header>

      <div className="steps">
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
      </div>

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
                    placeholder="Portfolio or website URL"
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
              <p className="subtitle">Add your academic qualifications.</p>

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
              <p className="subtitle">Highlight your technical skills.</p>

              {skills.map((skill, index) => (
                <div className="inline-entry" key={index}>
                  <input
                    name="skill"
                    value={typeof skill === "string" ? skill : skill.skill || ""}
                    onChange={(e) =>
                      dispatch(updateSkill({ index, skill: e.target.value }))
                    }
                    placeholder="e.g. React.js"
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
              <p className="subtitle">Showcase your best work.</p>

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
              <p className="subtitle">Add links to your professional profiles.</p>

              {social.map((item, index) => (
                <div className="inline-entry" key={index}>
                  <input
                    name="Social"
                    value={typeof item === "string" ? item : item.Social || ""}
                    onChange={(e) =>
                      dispatch(updateSocial({ index, value: e.target.value }))
                    }
                    placeholder="LinkedIn, GitHub, portfolio URL"
                  />
                  <button
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
              onClick={back}
              disabled={step === 0}
            >
              Back
            </button>

            {step < 4 ? (
              <button
                id="next"
                className="primary-btn"
                onClick={next}
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

          {saved && (
            <p className="success-message">Resume saved successfully!</p>
          )}
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
                .map((item) => typeof item === "string" ? item : item.skill)
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
          <ResumeSection title="Links">
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
