import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Table,
  Typography,
} from "antd";
import {
  DeleteFilled,
  EditFilled,
  FilterFilled,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router";

const { Title, Text } = Typography;
const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchStudents, setSearchStudents] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [totalStudents, setTotalStudents] = useState(null);
  const navigate = useNavigate();

  //Add and update student record
  const onCreate = async (values) => {
    try {
      let response;

      if (studentId) {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/studentRecords/updateStudent`,
          {
            studentId,
            course: values.course,
            age: values.age,
            standard: values.standard,
            division: values.division,
          },
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/studentRecords/addStudent`,
          {
            name: values.name,
            email: values.email,
            password: values.password,
            rollNumber: values.rollNumber,
            course: values.course,
            age: values.age,
            standard: values.standard,
            division: values.division,
          },
          { withCredentials: true }
        );
      }

      if (response.data.success || response.status === 201) {
        message.success(response.data.message);
        await getAllStudents();
        form.resetFields();
        setStudentId("");
        setOpen(false);
      } else {
        message.error(response.data.message || "Something went wrong!");
      }
    } catch (err) {
      message.error(err?.response?.data?.message || err.message);
    }
  };

  const getOneStudent = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/studentRecords/getStudentById/${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const newData = response.data.data;

        setOpen(true);
        form.setFieldsValue({
          ...response.data.data,
          name: newData.userId.name,
          email: newData.userId.email,
        });

        setStudentId(response.data.data._id);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  //Get All Students
  useEffect(() => {
    getAllStudents();
  }, [page, pageSize, searchStudents, sortBy]);

  const getAllStudents = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/studentRecords/getStudents?page=${page}&limit=${pageSize}&sort=${sortBy}&search=${searchStudents}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setStudents(response.data.data);
        setTotalStudents(response.data.total);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  //delete student
  const deleteStudentById = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/studentRecords/deleteStudent/${id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          message.success(response.data.message);
          await getAllStudents();
        }
      } catch (err) {
        message.error(err.message);
      }
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

      console.log(response.data);
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/login");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleOnChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleSortFunction = (order, type) => {
    setSortBy(`${type}:${order === "descend" ? "desc" : "asc"}`);
  };

  const nameFilters = Array.from(
    new Set(students.map((student) => student.name))
  )
    .filter(Boolean)
    .map((name) => ({ text: name, value: name }));

  const courseFilters = Array.from(
    new Set(students.map((student) => student.course))
  )
    .filter(Boolean)
    .map((course) => ({ text: course, value: course }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "180px",
      key: "name",
      sorter: (_, __, order) => handleSortFunction(order, "name"),
      render: (_, record) => record?.name || "-",
      filters: nameFilters,
      onFilter: (value, record) => record?.name === value,
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
    },

    {
      title: "Email",
      dataIndex: "email",
      width: "200px",
      key: "email",
      render: (_, record) => record?.email || "-",
    },

    {
      title: "RollNumber",
      dataIndex: "rollNumber",
      width: "160px",
      key: "rollNumber",
      sorter: (_, __, order) => handleSortFunction(order, "rollNumber"),
      render: (_, record) => record?.rollNumber || "-",
    },

    {
      title: "Course",
      dataIndex: "course",
      width: "200px",
      key: "course",
      render: (_, record) => record?.course || "-",
      filters: courseFilters,
      onFilter: (value, record) => record?.course === value,
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
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

    {
      title: (
        <Flex justify="center">
          <Text>Action</Text>
        </Flex>
      ),
      key: "action",
      width: "200px",
      render: (_, record) => {
        return (
          <Flex justify="center">
            <Button
              type="text"
              className="padding-1 bg-orange-300"
              onClick={() => getOneStudent(record?._id)}
            >
              <EditFilled className="!text-orange-500" role="button" />
            </Button>

            <Button
              type="text"
              className="padding-1 !text-red-500"
              onClick={() => deleteStudentById(record?._id)}
            >
              <DeleteFilled role="button" />
            </Button>
          </Flex>
        );
      },
    },
  ];

  return (
    <div className=" flex flex-col justify-center items-center pt-4 bg-gray-300">
      <div className="w-full">
        <div className="flex justify-between !items-center mb-6 mx-10 border !border-amber-900 rounded-lg !bg-gray-500 ">
          <Title level={2} className="pt-4 pl-5 !text-white">
            Student Data
          </Title>
          <Button
            type="primary"
            htmlType="submit"
            className="!bg-red-500 !font-bold mr-5"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="w-[1300px]">
        <div className="flex justify-between">
          <div>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search..."
              onChange={(e) => setSearchStudents(e.target.value)}
              className="!w-[500px] mb-5 "
              size="large"
              allowClear={true}
            />
          </div>

          <Button size="large" type="primary" onClick={() => setOpen(true)}>
            Add Student Record
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center bg-gray-300">
        <Row justify="center" className="w-[1300px]">
          <Col span={24}>
            <Table
              dataSource={students}
              columns={columns}
              pagination={{
                current: page,
                pageSize: pageSize,
                total: totalStudents,
                pageSizeOptons: [10, 25, 50, 100],
                showTotal: (total, range) =>
                  `Displaying ${range[0]}-${range[1]} of ${total}`,
                onChange: handleOnChange,
                responsive: true,
              }}
              showSorterTooltip={false}
              scroll={{
                x: 1000,
                y: null,
              }}
              rowKey={(record) => record?._id}
            />
          </Col>
        </Row>
      </div>

      <Modal
        width={600}
        open={open}
        title={studentId ? "Edit a Students Record" : "Add Student record"}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
        }}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="book"
            onFinish={(values) => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Row gutter={[16]} className="mt-4">
          <Col md={12} xs={24}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Student Name is required!" }]}
            >
              <Input placeholder="Name" disabled={studentId} />
            </Form.Item>
          </Col>

          <Col md={12} xs={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Email is required!" }]}
            >
              <Input placeholder="Email" disabled={studentId} />
            </Form.Item>
          </Col>

          {!studentId && (
            <Col xs={24} sm={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Password is required!" }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </Col>
          )}

          <Col md={12} xs={24}>
            <Form.Item
              label="Roll Number"
              name="rollNumber"
              rules={[
                {
                  required: true,
                  message: "Please enter your Roll Number!",
                },
              ]}
            >
              <InputNumber className="!w-full" placeholder="Roll Number" />
            </Form.Item>
          </Col>

          <Col md={12} xs={24}>
            <Form.Item
              name="age"
              label="Age"
              rules={[
                {
                  required: true,
                  message: "Age is required!",
                },
              ]}
            >
              <InputNumber className="!w-full" placeholder="Age" />
            </Form.Item>
          </Col>

          <Col md={12} xs={24}>
            <Form.Item
              name="course"
              label="Course"
              rules={[
                {
                  required: true,
                  message: "Course is required!",
                },
              ]}
            >
              <Input placeholder="Course" />
            </Form.Item>
          </Col>

          <Col md={12} xs={24}>
            <Form.Item
              name="standard"
              label="Standard"
              rules={[
                {
                  required: true,
                  message: "Standard is required!",
                },
              ]}
            >
              <InputNumber className="!w-full" placeholder="Standard" />
            </Form.Item>
          </Col>

          <Col md={12} xs={24}>
            <Form.Item
              name="division"
              label="Division"
              rules={[
                {
                  required: true,
                  message: "Division is required!",
                },
              ]}
            >
              <Input placeholder="Division" />
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default Dashboard;
