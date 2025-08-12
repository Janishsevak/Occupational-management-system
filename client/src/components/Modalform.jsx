import React, { use, useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import TypedInputNumber from "antd/es/input-number";
import dayjs from "dayjs";

const Modalform = (props) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [formData, setFormData] = useState({
    date: "",
    Name: "",
    Department: "",
    age: "",
    category: "",
    Designation: "",
    injury: "",
    Treatment: "",
    Refer_to: "",
    Admit: "",
    FollowUpDate: "",
    Discharge: "",
    Return_to_Duty: "",
    BillAmount: "",
  });
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onClose = () => {
    setIsModalOpen(false);
    form.resetFields();
    if (props.onClose) props.onClose();
  };

  useEffect(() => {
    if (props.data) {
      const dataWithDayjs = {
        ...props.data,
        date: props.data.date ? dayjs(props.data.date) : null,
        FollowUpDate: props.data.FollowUpDate
          ? dayjs(props.data.FollowUpDate)
          : null,
        Discharge: props.data.Discharge ? dayjs(props.data.Discharge) : null,
        Return_to_Duty: props.data.Return_to_Duty
          ? dayjs(props.data.Return_to_Duty)
          : null,
      };
      form.setFieldsValue(dataWithDayjs);
      console.log("Form data set from props:", dataWithDayjs);
    }
  }, [props.data, form]);
  const category = Form.useWatch("category", form);
  const onFinish = (values) => {
    setLoading(true);
    const formattedValues = {
      ...values,
      date: values.date ? values.date.format("YYYY-MM-DD") : null,
      FollowUp_Date: values.FollowUpDate
        ? values.FollowUpDate.format("YYYY-MM-DD")
        : null,
      Discharge: values.Discharge
        ? values.Discharge.format("YYYY-MM-DD")
        : null,
      Return_to_Duty: values.Return_to_Duty
        ? values.Return_to_Duty.format("YYYY-MM-DD")
        : null,
    };
    console.log("Form submitted with values:", formattedValues);
    setLoading(false);
    onClose();
  };
  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={onClose}
        onOk={() => form.submit()}
        title="Injury Form"
        destroyOnHidden
        style={{ top: 0 }}
        okText="Submit"
      >
        <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Form
          form={form}
          name="injury"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker style={{ width: 192 }} />
          </Form.Item>
          <Form.Item label="Name" name="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter Name" style={{ width: 192 }} />
          </Form.Item>
          <Form.Item
            label="Department"
            name="Department"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter Department" style={{ width: 192 }} />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true }]}
          >
            <Select placeholder="--Select--" style={{ width: 192 }}>
              <Select.Option value="Contract">Contract</Select.Option>
              <Select.Option value="Employee">Employee</Select.Option>
            </Select>
          </Form.Item>
          {category === "Employee" ? (
            <Form.Item
              label="Employee Code"
              name="Designation"
              rules={[{ required: true }]}
            >
              <TypedInputNumber
                placeholder="Enter Employee Code"
                style={{ width: 192 }}
              />
            </Form.Item>
          ) : category === "Contract" ? (
            <Form.Item
              label="Contract"
              name="Designation"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="--Select Contractor--"
                style={{ width: 192 }}
              >
                <Select.Option value="Poonam">Poonam</Select.Option>
                <Select.Option value="SPS">SPS</Select.Option>
                <Select.Option value="Supervisor">Supervisor</Select.Option>
                <Select.Option value="Manager">Manager</Select.Option>
              </Select>
            </Form.Item>
          ) : null}
          <Form.Item label="Age" name="age" rules={[{ required: true }]}>
            <TypedInputNumber placeholder="Enter Age" style={{ width: 192 }} />
          </Form.Item>
          <Form.Item label="Injury" name="injury" rules={[{ required: true }]}>
            <Input placeholder="Enter Injury Details" style={{ width: 192 }} />
          </Form.Item>
          <Form.Item
            label="Treatment"
            name="Treatment"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="Enter Treatment Details"
              style={{ width: 192 }}
            />
          </Form.Item>
          <Form.Item label="Refer To" name="Refer_to">
            <Input
              placeholder="Enter Treatment Details"
              style={{ width: 192 }}
            />
          </Form.Item>
          <Form.Item label="Admit" name="Admit">
            <Input
              placeholder="Enter Treatment Details"
              style={{ width: 192 }}
            />
          </Form.Item>
          <Form.Item label="Follow-up Date" name="FollowUpDate">
            <DatePicker style={{ width: 192 }} />
          </Form.Item>
          <Form.Item label="Discharge" name="Discharge">
            <DatePicker style={{ width: 192 }} />
          </Form.Item>
          <Form.Item label="Return-to-Duty" name="Return_to_Duty">
            <DatePicker style={{ width: 192 }} />
          </Form.Item>
          <Form.Item label="Bill Amount" name="BillAmount">
            <TypedInputNumber
              placeholder="Enter Bill Amount"
              style={{ width: 192 }}
            />
          </Form.Item>
        </Form>
        </div>
      </Modal>
    </>
  );
};

export default Modalform;
