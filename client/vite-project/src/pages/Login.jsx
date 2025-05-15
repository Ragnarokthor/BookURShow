import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Typography,
  Card,
  message,
  Row,
  Col,
  Checkbox,
  Divider
} from "antd";
import { 
  UserOutlined, 
  LockOutlined, 
  RightOutlined,
  LoginOutlined
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { LoginUser } from "../apiCalls/users";
import "./auth.css";

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Add auth-page class on mount, remove on unmount
  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await LoginUser(values);
      if (response.success) {
        message.success("Login successful!");
        localStorage.setItem("token", response.token);
        navigate("/");
      } else {
        message.error("Invalid email or password.");
      }
    } catch (error) {
      message.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-gradient-overlay"></div>
        <div className="auth-pattern"></div>
      </div>
      
      <Card className="auth-card" bordered={false}>
        <div className="auth-logo-container">
          <div className="auth-logo">
            <span className="logo-book">Book</span>
            <span className="logo-my">URS</span>
            <span className="logo-show">how</span>
          </div>
        </div>

        <div className="auth-header">
          <Title level={2} className="auth-title">Welcome Back</Title>
          <Text className="auth-subtitle">Sign in to continue to BookURShow</Text>
        </div>

        <Divider className="auth-divider">
          <span className="divider-text">Enter Your Details</span>
        </Divider>

        <Form 
          layout="vertical" 
          onFinish={onFinish} 
          size="large" 
          className="auth-form"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: 'email', message: "Please enter a valid email" }
            ]}
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              className="auth-input"
              placeholder="Email Address"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              className="auth-input"
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Row justify="space-between" align="middle" className="form-options">
            <Col>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="remember-checkbox">Remember me</Checkbox>
              </Form.Item>
            </Col>
            <Col>
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </Col>
          </Row>

          <Form.Item className="auth-button-container">
            <Button
              type="primary"
              htmlType="submit"
              block
              className="auth-button"
              loading={loading}
              icon={<LoginOutlined />}
            >
              Sign In <RightOutlined className="button-arrow" />
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <Text className="auth-switch-text">
            Don't have an account? 
            <Link to="/register" className="auth-switch-link">Create Account</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}

export default Login;