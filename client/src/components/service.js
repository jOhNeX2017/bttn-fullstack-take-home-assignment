import React from "react";

// Function to Handle GET API call
export const getAPICall = (url) => {
  return fetch(url, { mode: "cors" })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        console.log("GET API Data", data);
        return data;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log("GET API Call Error", err);
      return false;
    });
};

// Function to Handle POST API call
export const postAPICall = (url, body) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        console.log("POST Call Data", data);
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log("POST API Call Error", err);
      return false;
    });
};

// Function to Handle Delete API call
export const deleteAPICall = (url) => {
  const requestOptions = {
    method: "DELETE",
  };
  return fetch(url, requestOptions)
    .then((response) => {
      return true
    })
    .catch((err) => {
      console.log("DELETE API Call Error", err);
      return false;
    });
};
