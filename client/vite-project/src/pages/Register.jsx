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
  MailOutlined,
  RightOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { RegisterUser } from "../apiCalls/users";
import "./auth.css";

const { Title, Text } = Typography;

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const [termsText, setTermsText] = useState('');
  const [privacyText, setPrivacyText] = useState('');

  useEffect(() => {
    // Fetch terms and privacy policy text from files
    const loadTextFiles = async () => {
      const termsResponse = await fetch('/src/assets/termsOfService.txt');
      const privacyResponse = await fetch('/src/assets/privacyPolicy.txt');
      
      if (termsResponse.ok) {
        setTermsText(await termsResponse.text());
      }
      if (privacyResponse.ok) {
        setPrivacyText(await privacyResponse.text());
      }
    };

    loadTextFiles();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await RegisterUser(values);
      if (response.success) {
        message.success("Registration successful!");
        navigate("/login");
      } else {
        message.error(response.message || "Registration failed.");
      }
    } catch (error) {
      message.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (type) => {
    if (type === 'terms') {
      setModalContent(termsText);
    } else if (type === 'privacy') {
      setModalContent(privacyText);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent('');
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal')) {
      handleCloseModal();
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
          <Title level={2} className="auth-title">Create Account</Title>
          <Text className="auth-subtitle">Join BookURShow to book tickets and more</Text>
        </div>

        <Divider className="auth-divider">
          <span className="divider-text">Enter Your Details</span>
        </Divider>

        <Form layout="vertical" onFinish={onFinish} size="large" className="auth-form">
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}>
            <Input
              prefix={<UserOutlined className="input-icon" />}
              className="auth-input"
              placeholder="Full Name"
              autoComplete="name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: 'email', message: "Please enter a valid email" }
            ]}>
            <Input
              prefix={<MailOutlined className="input-icon" />}
              className="auth-input"
              placeholder="Email Address"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}>
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              className="auth-input"
              placeholder="Password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item 
            name="agreement" 
            valuePropName="checked"
            rules={[
              { 
                validator: (_, value) => 
                  value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms and conditions'))
              }
            ]} 
            className="terms-container">
            <Checkbox className="terms-checkbox">
              I agree to BookURShow's 
              <a href="#" onClick={() => handleLinkClick('terms')} className="terms-link"> Terms of Service</a> and 
              <a href="#" onClick={() => handleLinkClick('privacy')} className="terms-link"> Privacy Policy</a>
            </Checkbox>
          </Form.Item>

          <Form.Item className="auth-button-container">
            <Button
              type="primary"
              htmlType="submit"
              block
              className="auth-button"
              loading={loading}
              icon={<UserAddOutlined />}>
              Create Account <RightOutlined className="button-arrow" />
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <Text className="auth-switch-text">
            Already have an account? 
            <Link to="/login" className="auth-switch-link">Sign In</Link>
          </Text>
        </div>
      </Card>

      {/* Modal for displaying terms or privacy policy */}
      {showModal && (
  <div className="modal" onClick={handleOutsideClick}>
    <div className="modal-content">
      <button onClick={handleCloseModal} className="close-btn">X</button>
      <h2>{modalContent === termsText ? 'Terms of Service' : 'Privacy Policy'}</h2>
      <ul>
        {modalContent.split('\n').map((line, index) => (
          <li key={index}>{line.replace(/^[-•\s]*/, '')}</li>
        ))}
      </ul>
    </div>
  </div>
)}

    </div>
  );
}

export default Register;
