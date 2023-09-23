import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function LoginForm({ setSubmitted }) {

  const supabaseClient = useSupabaseClient();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    setIsLoading(true);
    event.preventDefault();
    const email = event.target.elements.email.value;
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin,
      },
    });
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setError("");
      setIsLoading(false);
    }
    console.log(error);
  }
  return (
    <form onSubmit={onSubmit} className="content-grid home-hero">
      {error && (
        <div className="danger" role="alert">
          {error}
        </div>
      )}
      <h1>Welcome back</h1>
      <div className="email-input">
        <label htmlFor="email">Email</label>
        <input placeholder="email" id="email" type="email" name="email" required/>
      </div>
      <button disabled={isLoading} type="submit" className="large-button">
        <div className="large-button-text">{isLoading ? "Logging in ...": "Login"}</div>
      </button>
    </form>
  );
}
