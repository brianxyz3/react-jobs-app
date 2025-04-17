const getJobApplicationHistory = async (id) => {
  try {
    const res = await fetch(`/api/job-application/${id}`);
    const data = res.json();
    return data;
  } catch (err) {
    return err;
  }
};

const apiRegisterUser = async (newUser) => {
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return err.message;
  }
};

const apiLoginUser = async (user) => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return err.message;
  }
};

const apiDeleteUser = async (userId) => {
  try {
    const res = await fetch("/api/delete-user", {
      method: "Delete",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userId),
    });
    return;
  } catch (err) {
    return err.message;
  }
};

export { getJobApplicationHistory, apiRegisterUser, apiLoginUser, apiDeleteUser };
