import { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error("Mật khẩu xác nhận không");
      return;
    }

    setLoading(true);
    try {
      const user = await authService.registerAndLogin(
        values.email,
        values.password,
        values.name
      );
      setUser(user);
      message.success("Đăng ký và đăng nhập thành công!");
      navigate("/home");
    } catch (error) {
      console.error("Register error:", error);
      message.error("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={2} className="mb-2">
            Đăng Ký
          </Title>
          <p className="text-gray-600">Tạo tài khoản mới</p>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Đăng Ký
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <span className="text-gray-600">Đã có tài khoản? </span>
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Đăng nhập ngay
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
