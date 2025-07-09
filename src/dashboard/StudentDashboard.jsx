import { Button, message, Table, Typography } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState([]);

  useEffect(() => {
    individualdata();
  }, []);

  const individualdata = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/individualRecord/studentSingleRecord`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setStudent(
          Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data]
        );
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        navigate("/login");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "180px",
      key: "name",
      render: (_, record) => record?.userId?.name || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "200px",
      key: "email",
      render: (_, record) => record?.userId?.email || "-",
    },
    {
      title: "Roll Number",
      dataIndex: "rollNumber",
      width: "160px",
      key: "rollNumber",
      render: (_, record) => record?.rollNumber || "-",
    },
    {
      title: "Course",
      dataIndex: "course",
      width: "200px",
      key: "course",
      render: (_, record) => record?.course || "-",
    },
    {
      title: "Age",
      dataIndex: "age",
      width: "250px",
      key: "age",
      render: (_, record) => record?.age || "-",
    },
    {
      title: "Standard",
      dataIndex: "standard",
      width: "250px",
      key: "standard",
      render: (_, record) => record?.standard || "-",
    },
    {
      title: "Division",
      dataIndex: "division",
      width: "200px",
      key: "division",
      render: (_, record) => record?.division || "-",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center pt-4 bg-gray-300 min-h-screen">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6 mx-10 border border-amber-900 rounded-lg bg-gray-500 px-5 py-4">
          <Title level={2} className="text-white m-0">
            Student Data
          </Title>
          <Button
            type="primary"
            className="bg-red-500 font-bold"
            onClick={logout}
          >
            Logout
          </Button>
        </div>

        <div className="flex justify-center items-center bg-gray-300 px-10">
          <Table
            dataSource={student}
            columns={columns}
            rowKey={(record) => record._id}
            pagination={false}
            scroll={{ x: 1000 }}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
