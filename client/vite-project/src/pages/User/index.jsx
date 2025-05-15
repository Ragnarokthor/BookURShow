import { Tabs } from 'antd';
import Bookings from './Bookings';

const User = () => {
  const items = [
    {
      key: '1',
      
      children: <Bookings />,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default User;