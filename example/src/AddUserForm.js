import React from "react";
import { Form, Input, Button } from "antd";

const AddForm = ({ onSave }) => {
  const [form] = Form.useForm();

  const resetFileds = () => form.resetFields();

  const onFinish = (data) => {
    onSave(data);
    resetFileds();
  };

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ first_name: "", last_name: "", email: "" }}
      onFinish={onFinish}
    >
      <Form.Item
        label="First name"
        name="first_name"
        rules={[{ required: true, message: "Please input your first name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Last name"
        name="last_name"
        rules={[{ required: true, message: "Please input your last name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ type: "email" }]}>
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default AddForm;
