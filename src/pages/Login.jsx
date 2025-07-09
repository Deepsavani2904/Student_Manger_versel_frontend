import { Button, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const Login = ({ setRole }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handelLogin = async (values) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        values
      );

      if (response.data?.success) {
        message.success(response.data.message);

        form.resetFields();
        const role = response.data.data.role;
        console.log(role);
        const token = response.data.token;
        setRole(role);
        Cookies.set("userRole", role);
        Cookies.set("accessToken", token);

        const routeByRole = {
          Admin: "/dashboard",
          Student: "/studentDashboard",
        };

        navigate(routeByRole[role]);
      } else {
        message.error(response.data.message);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <>
      <div className="h-screen flex justify-center items-center bg-gray-200 ">
        <Form
          name="Login"
          initialValues={{
            remember: true,
          }}
          form={form}
          layout="vertical"
          className="w-[450px] bg-white !p-6 rounded-lg"
          onFinish={handelLogin}
        >
          <div className="text-center mb-3">
            <h1 className="text-2xl font-bold"> Welcome Back</h1>
            <p>
              Don't have an account?
              <Link
                className="underline font-medium !text-slate-800"
                to={"/signup"}
              >
                Register Now!
              </Link>
            </p>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Email is required",
              },

              {
                type: "email",
                message: "Please enter valid email address",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="password"
            />
          </Form.Item>

          <Form.Item className="!mt-10 !mb-2">
            <Button
              block
              type="primary"
              className="!bg-black"
              htmlType="submit"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;
