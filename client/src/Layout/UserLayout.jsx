import React, { useEffect, useState } from 'react';
import {
  Layout,
  Menu,
  Drawer,
  Button,
  Typography,
  Dropdown,
  Avatar,
  message,
} from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const [userName, setUserName] = useState('');
  const [open, setOpen] = useState(false);

  // Fetch user name from localStorage on mount
  useEffect(() => {
    setSelectedKey(location.pathname);
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || 'Guest'); // Get name or fallback
    }
  }, [location.pathname]);
  // Navigation Items
  const items = [
    { key: '/user', label: 'Products' },
    { key: '/user/category', label: 'Category' },
    { key: '/favorite', label: 'Favorite' },
  ];
  // User Dropdown Menu (Updated)
  const userMenu = {
    items: [
      { key: '1', label: 'Profile' },
      { key: '2', label: 'Settings' },
      { key: '3', label: 'Logout', onClick: () => handleLogout() },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login'); // Redirect to login page
    message.success('Logout successful!');
  };
  return (
    <Layout className="min-h-screen flex flex-col">
      {/* Header */}
      <Header className="sticky top-0 z-10 w-full flex items-center rounded-b-xl justify-between bg-[#283276] px-4 md:px-8 shadow-md">
        {/* Logo */}
        <Text strong className="text-white font-bold text-lg">
          E-Commerce MERN
        </Text>

        {/* Desktop Menu */}
        <div className="flex space-x-4 rounded-lg ">
          {items.map((item) => {
            const isActive = location.pathname === item.key;
            return (
              <Link
                key={item.key}
                to={item.key}
                className={`px-4 hidden md:flex rounded-md font-semibold transition text-decoration-none ${
                  isActive ? 'bg-red-400 text-white' : 'text-white'
                } hover:bg-teal-500`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        {/* Right Section: User Profile & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* User Profile (Fixed) */}
          <Dropdown menu={userMenu} trigger={['click']}>
            <div className="flex items-center cursor-pointer">
              <Avatar icon={<UserOutlined />} className="mr-2" />
              <Text
                strong
                className="hidden md:inline font-semibold text-lg text-white"
              >
                {userName}
              </Text>
            </div>
          </Dropdown>

          {/* Mobile Menu Button */}
          <Button
            type="text"
            className="text-white md:hidden"
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
          />
        </div>
      </Header>

      {/* Mobile Drawer Menu */}
      <Drawer
        width={250}
        title="Menus"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        className="md:hidden"
      >
        <Menu
          mode="vertical"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            setSelectedKey(key);
            navigate(key);
            setOpen(false);
          }}
          items={items}
        />
      </Drawer>

      {/* Main Content */}
      <Content className="flex-1 px-6 xl:px-40  py-6">
        <Outlet />
      </Content>

      {/* Footer */}
      <Footer className="text-center text-white font-semibold py-4 bg-[#283276] rounded-t-xl">
        E-Commerce MERN ©{new Date().getFullYear()} Created by Pugalendhi
      </Footer>
    </Layout>
  );
};

export default UserLayout;
