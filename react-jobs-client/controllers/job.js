const addJobSubmit = async (newJob) => {
  try {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newJob),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return console.log(`An error occurred, ${err}`);
  }
};

const updateJobSubmit = async (job, id) => {
  try {
    const res = await fetch(`/api/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return console.log(`An error occurred, ${err}`);
  }
};

const jobApply = async (jobId, user) => {
  try {
    const res = await fetch(`/api/job-apply/${jobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await res.json();
        console.log(res);

    return data;
  } catch (err) {
    return console.log(`An error occurred, ${err}`);
  }
};

const deleteJob = async (id) => {
  try {
    const res = await fetch(`/api/jobs/${id}`, {
      method: "DELETE",
    });
    return;
  } catch (err) {
    return console.log(`An error occurred, ${err}`);
  }
};

export { addJobSubmit, updateJobSubmit, deleteJob, jobApply };
