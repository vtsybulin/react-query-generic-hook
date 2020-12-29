import React from 'react';
import PropTypes from 'prop-types';
import { List, Avatar, Empty, Button, Space, Row, Col } from "antd";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import AddUserForm from './AddUserForm';

const { Item } = List;

const UsersList = ({ data, onCreate, onDelete }) => {
  const renderItem = ({ first_name, last_name, email, avatar, id }) => (
    <Item
      actions={[
        <Button
          onClick={() => onDelete(id)}
          icon={<DeleteOutlined />}
          shape="circle"
        />
      ]}
    >
      <Item.Meta
        title={`${first_name} ${last_name}`}
        description={email}
        avatar={<Avatar icon={<UserOutlined />} src={avatar} />}
      />
    </Item>
  );

return   (
  <Space direction="vertical" size="large" style={{ width: "100%" }}>
    {!!data.length ? (
      <Row gutter={32}>
        <Col flex={1}>
          <List
            header="Users list"
            itemLayout="horizontal"
            bordered
            rowKey="id"
            dataSource={data}
            renderItem={renderItem}
          />
        </Col>
        <Col span={8}>
          <AddUserForm onSave={onCreate} />
        </Col>
      </Row>
    ) : (
      <Empty />
    )}
  </Space>
);}

UsersList.propTypes = {
  data: PropTypes.array,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

UsersList.defaultProps = {
  data: []
};

export default UsersList;

