import {
  FormLayout,
  TextField,
  Button,
  Text,
  Heading,
  InlineError,
  Frame,
  Loading,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import React from "react";
import Loader from "./Loader";

function Login(props) {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    error,
    setError,
    isLoading,
    setIsLoading,
    token,
    setToken,
  } = props;
  // console.log(user.username);

  function handleForm(event) {
    event.preventDefault();
    console.log(event);
    // debugger;

    let err = {};

    if (!user.username) {
      // setError({ ...error, username: "Username Field is required" });
      err["username"] = "Username Field is required";
    }

    if (!user.password) {
      // setError({ ...error, password: "Password Field is required" });
      err["password"] = "Password Field is required";
    }

    setError({ ...err });
    // debugger;

    if (!Object.keys(err).length) {
      //  validation success
      console.log("ok");

      setIsLoading(true);

      fetch(
        `https://fbapi.sellernext.com/user/login?username=${user.username}&password=${user.password}`,
        {
          method: "GET",
          // body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
            // Accept: "application/json",
            authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsInJvbGUiOiJhcHAiLCJpYXQiOjE1MzkwNTk5NzgsImlzcyI6Imh0dHBzOlwvXC9hcHBzLmNlZGNvbW1lcmNlLmNvbSIsImF1ZCI6ImV4YW1wbGUuY29tIiwibmJmIjoxNTM5MDU5OTc4LCJ0b2tlbl9pZCI6MTUzOTA1OTk3OH0.GRSNBwvFrYe4H7FBkDISVee27fNfd1LiocugSntzxAUq_PIioj4-fDnuKYh-WHsTdIFMHIbtyt-uNI1uStVPJQ4K2oYrR_OmVe5_zW4fetHyFmoOuoulR1htZlX8pDXHeybRMYlkk95nKZZAYQDB0Lpq8gxnTCOSITTDES0Jbs9MENwZWVLfyZk6vkMhMoIAtETDXdElIdWjP6W_Q1kdzhwqatnUyzOBTdjd_pt9ZkbHHYnv6gUWiQV1bifWpMO5BYsSGR-MW3VzLqsH4QetZ-DC_AuF4W2FvdjMRpHrsCgqlDL4I4ZgHJVp-iXGfpug3sJKx_2AJ_2aT1k5sQYOMA",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (!data.success) {
            setError({ ...error, form: data.message });
            throw new Error("Invalid username or password");
          }

          localStorage.setItem("token", data.data.token);
          setToken(data.data.token);
          setUser({});
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error(error);
          setError({ ...error, generalError: error.toString() });
          // alert(error.toString());
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  return (
    <div className="login">
      <div style={{ textAlign: "center", paddingBottom: "20px" }}>
        <Text variant="heading2xl" as="h1">
          Login
        </Text>
      </div>

      <div style={{ textAlign: "center" }}>{isLoading && <Loader />}</div>

      {error.generalError && (
        <div style={{ marginTop: "4px", textAlign: "center" }}>
          <div>{error.generalError}</div>
        </div>
      )}

      {error.form && (
        <div style={{ marginTop: "4px", textAlign: "center" }}>
          <div>{error.form}</div>
        </div>
      )}
      <form onSubmit={handleForm}>
        <FormLayout>
          <TextField
            type="text"
            label="Username"
            id="username"
            value={user.username ?? ""}
            pattern={"[a-zA-Z0-9]+"}
            title="humara title"
            onChange={(value) => {
              setUser({ ...user, username: value });
            }}
            autoComplete="off"
            clearButton
            onClearButtonClick={(value) => {
              // console.log(value);
              setUser({ ...user, username: "" });
            }}
            requiredIndicator
          />
          {error.username && (
            <InlineError message={error.username} fieldID="username" />
          )}
          <TextField
            type="password"
            id="password"
            label="Password"
            autoComplete="email"
            requiredIndicator
            value={user.password ?? ""}
            onChange={(value) => {
              setUser({ ...user, password: value });
            }}
            clearButton
            onClearButtonClick={(value) => {
              // console.log(value);
              setUser({ ...user, password: "" });
            }}
          />
          {error.password && (
            <InlineError message={error.password} fieldID="username" />
          )}
          <div className="center">
            <Button submit>Login</Button>
          </div>
        </FormLayout>
      </form>
    </div>
  );
}

export default Login;
