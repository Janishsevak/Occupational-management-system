import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import TypedInputNumber from "antd/es/input-number";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
  useEditraiseRequestMutation,
  useFetchEditRequestsQuery,
  useRaiseRequestMutation,
} from "../feature/requestapi";
import { useSelector } from "react-redux";
import { setSelectedData } from "../feature/localstateSlice";
import { Descriptions,Button } from "antd";

const Modalform = (props) => {
  const [injuryform] = Form.useForm();
  const [deleteForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const { data: viewdata = [] } = useFetchEditRequestsQuery("Ankleshwar");

  const selectedData = useSelector((state) => state.ui.selectedData);
  console.log("selected data for model", selectedData);
  const [reason, setReason] = useState("");
  const record =
    selectedData && selectedData.length > 0 ? selectedData[0] : null;

  const onClose = () => {
    setIsModalOpen(false);
    injuryform.resetFields();
    deleteForm.resetFields();
    props.onClose?.();
  };
  const origin = localStorage.getItem("origin");

  const [raiseRequest] = useRaiseRequestMutation();
  const [EditRequest] = useEditraiseRequestMutation();

  const onFinishDelete = async () => {
    try {
      const onlyid = selectedData.map((item) => item.id);
      console.log("id to delete", onlyid);
      const payload = {
        model: props.model,
        recordId: onlyid,
        reason: reason,
        origin: origin,
      };

      console.log("Sending delete request:", payload);

      const response = await raiseRequest(payload).unwrap();

      toast.success("Delete request raised successfully!");
      console.log("Response:", response);
      onClose();
    } catch (error) {
      console.error("Failed to raise request:", error);
      toast.error(error || "Failed to raise request");
    }
  };
  console.log("viewdata", viewdata);

  const category = Form.useWatch("category", injuryform);

  const onFinishEdit = async (values) => {
    setLoading(true);
    const formattedValues = {
      ...values,
      reason,
      date: values.date ? values.date.format("YYYY-MM-DD") : null,
      FollowUp_Date: values.FollowUp_Date
        ? values.FollowUp_Date.format("YYYY-MM-DD")
        : null,
      Discharge: values.Discharge
        ? values.Discharge.format("YYYY-MM-DD")
        : null,
      Return_to_Duty: values.Return_to_Duty
        ? values.Return_to_Duty.format("YYYY-MM-DD")
        : null,
    };

    try {
      const recordId = Number(selectedData?.[0]?.id);

      // ✅ Exclude id from the fields you send
      const { id, ...filterdata } = formattedValues;

      const payload = {
        model: props.model,
        recordId,
        changes: filterdata,
        reason: reason,
        origin: origin,
      };

      console.log("Sending edit request:", payload);

      const response = await EditRequest(payload).unwrap();

      toast.success("Edit request raised successfully!");
      console.log("Response:", response);
      onClose();
    } catch (error) {
      console.error("Failed to raise request:", error);
      toast.error(error || "Failed to raise request");
    }
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
      title={
        props.mode === "edit"
          ? "Edit Injury"
          : props.mode === "view"
          ? "View Injury"
          : "Delete Injury"
      }
      okText="Submit"
    >
      {props.mode === "edit" ? (
        <Form
          form={injuryform}
          name="injury"
          key={props.editdata?.id}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 50 }}
          style={{ maxWidth: 1200, maxHeight: "70vh", overflowY: "auto" }}
          onFinish={onFinishEdit}
          autoComplete="off"
          initialValues={{
            ...props.editdata[0],
            date: props.editdata[0]?.date
              ? dayjs(props.editdata[0].date)
              : null,
            FollowUp_Date: props.editdata[0]?.FollowUp_Date
              ? dayjs(props.editdata[0].FollowUp_Date)
              : null,
            Discharge: props.editdata[0]?.Discharge
              ? dayjs(props.editdata[0].Discharge)
              : null,
            Return_to_Duty: props.editdata[0]?.Return_to_Duty
              ? dayjs(props.editdata[0].Return_to_Duty)
              : null,
          }}
        >
          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: 192 }} />
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
          <Form.Item label="Refer To" name="Refer_To">
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
          <Form.Item label="Follow-up Date" name="FollowUp_Date">
            <DatePicker format="DD/MM/YYYY" style={{ width: 192 }} />
          </Form.Item>
          <Form.Item label="Discharge" name="Discharge">
            <DatePicker format="DD/MM/YYYY" style={{ width: 192 }} />
          </Form.Item>
          <Form.Item label="Return-to-Duty" name="Return_to_Duty">
            <DatePicker format="DD/MM/YYYY" style={{ width: 192 }} />
          </Form.Item>
          <Form.Item label="Bill Amount" name="BillAmount">
            <TypedInputNumber
              placeholder="Enter Bill Amount"
              style={{ width: 192 }}
            />
          </Form.Item>
          <Form.Item
            label="Reason for Edit"
            rules={[{ required: true, message: "Please enter a reason" }]}
          >
            <Input.TextArea
              placeholder="Enter reason for Edit"
              rows={4}
              style={{ width: 192 }}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Item>
        </Form>
      ) : props.mode === "view" ? (
        <Form
          form={injuryform}
          name="injury"
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 50 }}
          style={{ maxWidth: 1200, maxHeight: "70vh", overflowY: "auto" }}
          autoComplete="off"
          
        >
          <Descriptions
            bordered
            column={1} // one column layout, adjusts spacing
            size="middle"
          >
            <Descriptions.Item label="Date">
              {props.viewdata.changes?.date
                ? dayjs(props.viewdata.changes.date).format("DD/MM/YYYY")
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Name">
              {props.viewdata.changes?.Name || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Department">
              {props.viewdata.changes?.Department || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Category">
              {props.viewdata.changes?.category || "-"}
            </Descriptions.Item>

            {props.viewdata.changes?.category === "Employee" ? (
              <Descriptions.Item label="Employee Code">
                {props.viewdata.changes?.Designation || "-"}
              </Descriptions.Item>
            ) : props.viewdata.changes?.category === "Contract" ? (
              <Descriptions.Item label="Contract">
                {props.viewdata.changes?.Designation || "-"}
              </Descriptions.Item>
            ) : null}

            <Descriptions.Item label="Age">
              {props.viewdata.changes?.age || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Injury">
              {props.viewdata.changes?.injury || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Treatment">
              {props.viewdata.changes?.Treatment || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Refer To">
              {props.viewdata.changes?.Refer_to || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Admit">
              {props.viewdata.changes?.Admit || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Follow-up Date">
              {props.viewdata.changes?.FollowUp_Date
                ? dayjs(props.viewdata.changes.FollowUp_Date).format(
                    "DD/MM/YYYY"
                  )
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Discharge">
              {props.viewdata.changes?.Discharge
                ? dayjs(props.viewdata.changes.Discharge).format("DD/MM/YYYY")
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Return-to-Duty">
              {props.viewdata.changes?.Return_to_Duty
                ? dayjs(props.viewdata.changes.Return_to_Duty).format(
                    "DD/MM/YYYY"
                  )
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Bill Amount">
              {props.viewdata.changes?.BillAmount || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Reason for Edit">
              {props.viewdata.changes?.reason || "-"}
            </Descriptions.Item>
          </Descriptions>
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
            initialValue={selectedData.length}
          >
            <TypedInputNumber style={{ width: 192 }} readOnly />
          </Form.Item>
          {Array.isArray(selectedData) &&
            selectedData.map((item, index) => (
              <Form.Item
                key={index}
                label={`Person ${index + 1}`}
                name={`personName${index + 1}`}
                initialValue={item?.Name}
                rules={[{ required: true, message: "Please enter Record ID" }]}
              >
                <Input readOnly style={{ width: 192 }} />
              </Form.Item>
            ))}

          <Form.Item
            label="Reason for Deletion"
            name="reason"
            rules={[{ required: true, message: "Please enter a reason" }]}
          >
            <Input.TextArea
              placeholder="Enter reason for deletion"
              rows={4}
              style={{ width: 192 }}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default Modalform;
