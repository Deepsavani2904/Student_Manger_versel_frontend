import React from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Upload,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      console.log(import.meta.env.VITE_API_URL);
      // eslint-disable-next-line no-unused-vars
      const { confirmpassword, ...restValues } = values;

      const newValues = { ...restValues };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/studentRegister`,
        newValues
      );

      if (response.data?.success) {
        message.success(response.data.message);
        form.resetFields();
        navigate("/login");
      } else {
        message.error(response.data.message);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <>
      <div className="h-screen flex justify-center items-center bg-gray-200">
        <Form
          name="signup"
          initialValue={{
            remember: true,
          }}
          form={form}
          layout="vertical"
          className="w-[550px] bg-white !p-6 !rounded-lg"
          onFinish={onFinish}
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create a New Account</h1>

            <p>
              Already have an account?
              <Link
                className="underline font-medium !text-slate-800"
                to={"/login"}
              >
                Sign In
              </Link>
            </p>
          </div>

          <Row gutter={[16]} className="mt-4">
            <Col xs={24}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    mwssage: "Name is required",
                  },
                ]}
              >
                <Input placeholder="Name" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="email"
                label="Email"
                rule={[
                  {
                    required: true,
                    message: "Email is required",
                  },

                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Password is required!",
                  },
                ]}
              >
                <Input.Password placeholder="password" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="confirmpassword"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Confirm Password is required!",
                  },

                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Password do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item className="!mt-0 sm:!mt-4">
                <Button
                  block
                  type="primary"
                  className="!bg-black"
                  htmlType="submit"
                >
                  SignUp
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};
export default Register;
