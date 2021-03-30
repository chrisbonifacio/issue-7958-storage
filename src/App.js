import React from "react";
import "./App.css";
import Amplify, { Auth, Storage } from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const AuthStateApp = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();
  const [result, setResult] = React.useState("");

  const handleUpload = async (type = "user-pool") => {
    let id = "";
    if (type === "user-pool") id = user.username;

    if (type === "identity-pool") id = user.identityId;

    try {
      await Storage.put("words.txt", "Hello from amplify", {
        level: "protected",
        identityId: id,
      });
      setResult("Success!");
    } catch (error) {
      setResult("Failed.");
    }
  };

  React.useEffect(() => {
    return onAuthUIStateChange(async (nextAuthState, authData) => {
      if (!user) setResult("");
      const creds = await Auth.currentCredentials();
      setAuthState(nextAuthState);
      setUser({ ...authData, ...creds });
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <div>Hello, {user.username}</div>
      <AmplifySignOut />
      <button onClick={() => handleUpload("user-pool")}>
        Upload File with User Pool ID
      </button>
      <button onClick={() => handleUpload("identity-pool")}>
        Upload File with Identity Pool ID
      </button>
      <h2>Result: {result}</h2>
    </div>
  ) : (
    <AmplifyAuthenticator />
  );
};

export default AuthStateApp;
