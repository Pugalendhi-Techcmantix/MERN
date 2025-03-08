import React, { useEffect, useState } from 'react';
import {
  DownOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  UserSwitchOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Layout,
  Menu,
  message,
  Space,
  Typography,
} from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const [userName, setUserName] = useState('');
  // Fetch user name from localStorage on mount
  useEffect(() => {
    setSelectedKey(location.pathname);
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || 'Guest'); // Get name or fallback
    }
  }, [location.pathname]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login'); // Redirect to login page
    message.success('Logout successful!');
  };
  const items = [
    {
      label: 'Profile',
      key: '0',
      icon:<UserOutlined />
    },
    {
      label: 'Logout',
      key: '1',
      icon:<LogoutOutlined  />,
      onClick: () => handleLogout()
    },
  ];

  return (
    <Layout className="min-h-screen flex">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="bg-gray-900 text-white min-h-screen"
      >
        <div className="h-16 flex items-center justify-center text-xl font-bold text-white">
          Logo
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]} // Active key
          className="bg-gray-900"
          onClick={({ key }) => {
            setSelectedKey(key);
            navigate(key);
          }}
          items={[
            {
              key: '/',
              icon: <HomeOutlined />,
              label: 'Dashboard',
            },
            {
              key: '/customers',
              icon: <UserSwitchOutlined />,
              label: 'Customers',
            },
            {
              key: '/sample',
              icon: <VideoCameraOutlined />,
              label: 'Sample',
            },
          ]}
        />
      </Sider>

      <Layout className="flex-1">
        <Header className="flex items-center justify-between bg-white shadow p-4">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-xl"
          />
          {/* Display logged-in user name */}
          <Text strong className="text-success">
            E-Commerce MERN
          </Text>
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
          >
            <Button  icon={<UserOutlined />}>
              <Space>
                {userName}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Header>

        <Content className="m-6 p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
