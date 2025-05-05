import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValueRegister = {
  username: "",
  email: "",
  password: "",
  picture: "",
};

const initialValueLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    // this allows me to send form info with image
    const formData = new FormData();
    for (let value in values) {
        formData.append(value, values[value]);
    }

    formData.append('picturePath', values.picture.name);

    const savedUserResponse = await fetch(
        "http://localhost:3001/auth/register", 
        {
            method: "POST",
            body: formData
        }
    );

    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
        setPageType("login");
    }
  }


  const login = async (values, onSubmitProps) => {
    
    const loggedInResponse = await fetch(
        "http://localhost:3001/auth/login", 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
      });

      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();

      //console.log(loggedIn.currentUser)
    
    if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.currentUser,
            token: loggedIn.token,
          })
        );
        navigate("/home");
      }

  }

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) {
        await login(values, onSubmitProps);
    }

    if (isRegister) {
        await register(values, onSubmitProps);
    }

  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValueLogin : initialValueRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        // formik takes care of the passing of the handle
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }} // if mobile, then the input takes up the entire width
          >
            {isRegister && (
              <>
                <TextField
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)} // if it's been touched or there is an error, this will display that error
                  helperText={touched.username && errors.username} // this displays the helper text
                  sx={{ gridColumn: "span 4" }}
                />

                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  padding="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png" // may or may not work
                    multiple={false}
                    onDrop={
                      (acceptedFiles) =>
                        setFieldValue("picture", acceptedFiles[0]) // because of dropzone, i need to set the field values manually
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add picture</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              label="Password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)} 
              sx={{ gridColumn: "span 4" }}
            />

          </Box>

          {/* form buttons */}
            <Box>
                <Button
                    fullWidth
                    type="submit"
                    sx={{ m: "2rem 0", p: "1rem", backgroundColor: palette.primary.main, color: palette.background.alt, "&:hover": { color: palette.primary.dark } }}
                >
                    {isLogin ? "Login" : "Register"}

                </Button>
                <Typography
                    onClick={() => {
                        setPageType(isLogin ? "register" : "login");
                        resetForm();

                    }}
                    
                    sx={{ textDecoration: "underline", color: palette.primary.main, 
                        "&:hover": { cursor: "pointer", color: palette.primary.dark} }}
                >
                    {isLogin ? "Don't have an account? Sign up here!" : "Already have an account? Login here!"}
                </Typography>

            </Box>

        </form>
      )}
    </Formik>
  );
};

export default Form;
