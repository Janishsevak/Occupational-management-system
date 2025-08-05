import React, { useState } from "react";
import { Button, Flex, Table } from "antd";
import useSWR from "swr";
import axios from "axios";

const columns = [
  {
    title: "Sr.No",
    dataIndex: "",
    key: "srno",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Name",
    dataIndex: "Name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Department",
    dataIndex: "Department",
    key: "department",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Designation",
    dataIndex: "Designation",
    key: "designation",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Injury",
    dataIndex: "injury",
    key: "injury",
  },
  {
    title: "Treatment",
    dataIndex: "Treatment",
    key: "treatment",
  },
  {
    title: "Refer-To",
    dataIndex: "Refer_To",
    key: "referTo",
  },
  {
    title: "Admit",
    dataIndex: "Admit",
    key: "admit",
  },
  {
    title: "Follow-up",
    dataIndex: "FollowUp_Date",
    key: "followup",
  },
  {
    title: "Discharge",
    dataIndex: "Discharge",
    key: "discharge",
  },
  {
    title: "Return to Duty",
    dataIndex: "Return_to_Duty",
    key: "returnToDuty",
  },
  {
    title: "Bill Amount",
    dataIndex: "BillAmount",
    key: "billAmount",
  },
];

function Editreport() {
  const [data1, setData1] = useState([]);
  const origin = localStorage.getItem("origin");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetcher = async (url) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-origin": origin,
      },
    });
    return res.data.entries;
  };
 
  const { data, error } = useSWR("/api/v1/injurydata/injurydata", fetcher);
    if (error) return <div>Error loading data</div>;
    if (!data) return <div>Loading...</div>;
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = newSelectedRowKeys => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Flex gap="middle" vertical>
      <Flex align="center" gap="middle">
        <Button
          type="primary"
          onClick={start}
          disabled={!hasSelected}
          loading={loading}
        >
          Reload
        </Button>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
      </Flex>
      <Table
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
      />
    </Flex>
  );
}

export default Editreport;
