import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function Register() {
  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required().label("Email"),
    password: Yup.string().required().label("Password"),
    confirmPassword: Yup.string()
      .required()
      .label("Confirm password")
      .oneOf([Yup.ref("password"), null], "Password doesn't match"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      validationSchema={RegisterSchema}
      onSubmit={(values) => {
        alert(values.email, values.password);
      }}
    >
      {() => (
        <Form>
          <h1>Register Screen</h1>
          <div>
            <label>Email address</label>
            <Field type="email" name="email" />
            <ErrorMessage
              name="email"
              component="div"
              className="error-message"
            />
          </div>

          <div>
            <label>Password</label>
            <Field type="password" name="password" />
            <ErrorMessage
              name="password"
              component="div"
              className="error-message"
            />
          </div>

          <div>
            <label>Confirm Password</label>
            <Field type="password" name="confirmPassword" />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="error-message"
            />
          </div>

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}
