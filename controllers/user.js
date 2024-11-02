const register = async (newUser) => {
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
  } catch (err) {
    return console.log(`An Error Occurred, ${err}`);
  }
};

const login = async (user) => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
  } catch (err) {
    return console.log(`An Error Occurred, ${err}`);
  }
};
