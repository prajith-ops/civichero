// import React, { useState } from "react";
// import { Box, Typography, TextField, Button, Paper } from "@mui/material";
// import { useNavigate, Link } from "react-router-dom";

// const Signup = () => {
//   const navigate = useNavigate();

//   // form states (optional, for validation later)
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     address: "",
//     age: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSignup = (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     // ⏳ Later, replace this with actual API call
//     alert("Account created successfully! Please log in.");
    
//     // 🔀 Redirect to login
//     navigate("/login");
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(to right, #e8f5e9, #f1f8e9)", // 🌿 light green
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         p: 2,
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Decorative background */}
//       <Box
//         sx={{
//           position: "absolute",
//           inset: 0,
//           backgroundImage:
//             "url('https://www.transparenttextures.com/patterns/leaf.png')",
//           opacity: 0.07,
//           zIndex: 0,
//         }}
//       />

//       <Paper
//         sx={{
//           p: 4,
//           width: 400,
//           textAlign: "center",
//           borderRadius: 3,
//           bgcolor: "white",
//           zIndex: 1,
//         }}
//       >
//         <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "green" }}>
//           Join CivicHero
//         </Typography>

//         <form onSubmit={handleSignup}>
//           <TextField
//             fullWidth
//             label="Full Name"
//             name="fullName"
//             margin="normal"
//             value={formData.fullName}
//             onChange={handleChange}
//             required
//           />
//           <TextField
//             fullWidth
//             label="Email"
//             name="email"
//             margin="normal"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <TextField
//             fullWidth
//             label="Phone Number"
//             name="phone"
//             margin="normal"
//             value={formData.phone}
//             onChange={handleChange}
//           />
//           <TextField
//             fullWidth
//             label="Address"
//             name="address"
//             margin="normal"
//             value={formData.address}
//             onChange={handleChange}
//           />
//           <TextField
//             fullWidth
//             label="Age"
//             type="number"
//             name="age"
//             margin="normal"
//             value={formData.age}
//             onChange={handleChange}
//           />
//           <TextField
//             fullWidth
//             label="Password"
//             type="password"
//             name="password"
//             margin="normal"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//           <TextField
//             fullWidth
//             label="Confirm Password"
//             type="password"
//             name="confirmPassword"
//             margin="normal"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//           />

//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             sx={{ bgcolor: "green", mt: 2, "&:hover": { bgcolor: "darkgreen" } }}
//           >
//             CREATE ACCOUNT
//           </Button>
//         </form>

//         {/* Back to Home */}
//         <Button
//           component={Link}
//           to="/"
//           variant="outlined"
//           fullWidth
//           sx={{
//             mt: 3,
//             borderColor: "green",
//             color: "green",
//             fontWeight: "bold",
//             "&:hover": {
//               bgcolor: "green",
//               color: "white",
//               borderColor: "green",
//             },
//           }}
//         >
//           BACK TO HOME
//         </Button>
//       </Paper>
//     </Box>
//   );
// };

// export default Signup;








import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptcha = (value) => {
    setCaptchaValue(value); // save the captcha token
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!captchaValue) {
      setError("Please verify that you are not a robot.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4900/api/auth/signup",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          token: captchaValue, // ✅ send captcha token to backend
        }
      );

      setSuccess(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e8f5e9, #f1f8e9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/leaf.png')",
          opacity: 0.07,
          zIndex: 0,
        }}
      />

      <Paper
        sx={{
          p: 4,
          width: 400,
          textAlign: "center",
          borderRadius: 3,
          bgcolor: "white",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold", color: "green" }}
        >
          Join CivicHero
        </Typography>

        <form onSubmit={handleSignup}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* ✅ Google reCAPTCHA */}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <ReCAPTCHA
              sitekey="6LfiK9wrAAAAAMweLxPoGk7S-2nyIYI1ym5GN44x"
              onChange={handleCaptcha}
            />
          </Box>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="green" variant="body2" sx={{ mt: 1 }}>
              {success}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ bgcolor: "green", mt: 2, "&:hover": { bgcolor: "darkgreen" } }}
          >
            CREATE ACCOUNT
          </Button>
        </form>

        <Button
          component={Link}
          to="/"
          variant="outlined"
          fullWidth
          sx={{
            mt: 3,
            borderColor: "green",
            color: "green",
            fontWeight: "bold",
            "&:hover": { bgcolor: "green", color: "white", borderColor: "green" },
          }}
        >
          BACK TO HOME
        </Button>
      </Paper>
    </Box>
  );
};

export default Signup;
