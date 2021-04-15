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
  let url = "/api/users/login";

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
        localStorage.setItem("tokenID", res.data.token);
        localStorage.setItem("userID", res.data._id);
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
