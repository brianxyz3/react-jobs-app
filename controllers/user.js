const registerUser = async (newUser) => {
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
    return console.log(`An Error Occurred, ${err}`);
  }
};

const loginUser = async (user) => {
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
    return console.log(`An Error Occurred, ${err}`);
  }
};

export { registerUser, loginUser };
