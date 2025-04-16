import React, { useState } from 'react';

const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return { values, handleInputChange };
};

const SignupScreen = ({ onSignup, onBack }) => {
  const { values: userData, handleInputChange } = useForm({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
      alert("All fields are required!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(userData.email)) {
      alert("Please enter a valid email address!");
      return;
    }

    onSignup(userData); // Pass userData to the parent (App.js)
  };

  return (
    <div className="form-screen">
      <h2 className="form-title">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            placeholder="Enter your first name"
            value={userData.first_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Enter your last name"
            value={userData.last_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email. This will be your username to login."
            value={userData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password. Make it unique!"
            value={userData.password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="submit-button">
          Next: Select Role
        </button>
        <button className="back-button" onClick={onBack}>
          Go Back
        </button>
      </form>
    </div>
  );
};

export default SignupScreen;