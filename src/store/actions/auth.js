import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, userId, email, name) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    tokenId: token,
    userId: userId,
    email: email,
    name: name,
  };
};

export const authFailed = (error) => {
  return {
    type: actionTypes.AUTH_FAILED,
    error: error,
  };
};

export const login = (email, password) => {
  let url = "https://tup-payroll.herokuapp.com/api/users/login";

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(url, { email, password }, config)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data._id);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("name", res.data.name);
        console.log(res.data);
        dispatch(
          authSuccess(
            res.data.token,
            res.data._id,
            res.data.email,
            res.data.name
          )
        );
      })
      .catch((error) => {
        dispatch(authFailed(error.response.data.message));
      });
  };
};

export const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  return {
    type: actionTypes.AUTH_CLEAR_TOKENS,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(clearTokens()); // or just return
    } else {
      const userId = localStorage.getItem("userId");
      const email = localStorage.getItem("email");
      const name = localStorage.getItem("name");

      dispatch(authSuccess(token, userId, email, name));
    }
  };
};
