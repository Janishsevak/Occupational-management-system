import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import TypedInputNumber from "antd/es/input-number";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { raiseRequestAsync } from "../feture/RequestSlice";

const Modalform = (props) => {
  const [injuryform] = Form.useForm();
  const [deleteForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onClose = () => {
    setIsModalOpen(false);
    injuryform.resetFields();
    deleteForm.resetFields();
    props.onClose?.();
  };
  const origin = localStorage.getItem("origin")
  

  const onFinishDelete = async (values) => {
    const result = await dispatch(raiseRequestAsync({
      origin,
      model:props.model,
      recordId:[props.length],
      reason:values.reason}));
      console.log("response data",result)
    onClose();
  };

   useEffect(() => {
    deleteForm.setFieldsValue({
      totalDelete: props.length?.length || 0
    });
  }, [props.data, deleteForm]);

  useEffect(() => {
    if (props.data && props.mode === "edit") {
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
      injuryform.setFieldsValue(dataWithDayjs);
    }
  }, [props.data, props.mode, injuryform]);

  const category = Form.useWatch("category", injuryform);

  const onFinishEdit = (values) => {
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
    console.log("Edit Form Submitted:", formattedValues);
    setLoading(false);
    onClose();
  };

 

  return (
    <Modal
      open={isModalOpen}
      onCancel={onClose}
      onOk={() => {
        if (props.mode === "edit") {
          injuryform.submit();
        } else {
          deleteForm.submit();
        }
      }}
      title={props.mode === "edit" ? "Edit Injury" : "Delete Request"}
      okText="Submit"
    >
      {props.mode === "edit" ? (
        <Form
          form={injuryform}
          name="injury"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinishEdit}
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
            <Input placeholder="Enter Treatment Details" style={{ width: 192 }} />
          </Form.Item>
          <Form.Item label="Refer To" name="Refer_to">
            <Input placeholder="Enter Treatment Details" style={{ width: 192 }} />
          </Form.Item>
          <Form.Item label="Admit" name="Admit">
            <Input placeholder="Enter Treatment Details" style={{ width: 192 }} />
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
            <TypedInputNumber placeholder="Enter Bill Amount" style={{ width: 192 }} />
          </Form.Item>
        </Form>
      ) : (
        <Form
          form={deleteForm}
          name="delete"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinishDelete}
        >
          <Form.Item
            label="Total data for delete"
            name="totalDelete"
          >
            <TypedInputNumber  style={{ width: 192 }} readOnly />
          </Form.Item>

          <Form.Item
            label="Reason for Deletion"
            name="reason"
            rules={[{ required: true, message: "Please enter a reason" }]}
          >

            <Input.TextArea
              placeholder="Enter reason for deletion"
              rows={4}
              style={{ width: 192 }}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default Modalform;
