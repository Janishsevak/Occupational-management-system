import { Tabs } from "antd";
import toast from "react-hot-toast";
import {
  useFetchEditRequestsQuery,
  useFetchRequestsQuery,
  useProcessDeleteRequestMutation,
  useProcessEditRequestMutation,
} from "../../../feature/requestapi";
import Modalform from "../../Modalform";

import { useState } from "react";

const onChange = (key) => {
  console.log(key);
};
function Injuryrecord() {
  // const [data, setdata] = useState([]);
  const { data } = useFetchRequestsQuery("Ankleshwar");
  const { data: editdata = [], isLoading } =
    useFetchEditRequestsQuery("Ankleshwar");
  const [modalopen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  console.log("Deletedata", data);

  console.log("editedata", editdata);

  const [Request, { isLoading: isApproving }] =
    useProcessDeleteRequestMutation();
  const [EditRequest, { isLoadingEdit: isEditApproving }] =
    useProcessEditRequestMutation();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await dispatch(fetchRequestsAsync({ origin: "Ankleshwar" }));
  //     if (fetchRequestsAsync.fulfilled.match(res)) {
  //       console.log("delete data request", res.payload);
  //       setdata(res.payload);
  //       console.log(res.payload);
  //     } else {
  //       console.error("Failed to fetch requests:", res.error);
  //     }
  //   };

  //   fetchData();
  // }, [dispatch]);

  const handleApprove = async (id) => {
    console.log("id", id);
    console.log("type of id", typeof id);
    try {
      await Request({
        requestIds: id,
        action: "approve",
        origin: "Ankleshwar",
      }).unwrap();
      toast.success("Request approved successfully");
    } catch (error) {
      console.error("Failed to approved request:", error);
      toast.error(error || "Failed to approved request");
    }
  };

  const handleReject = async (id) => {
    try {
      await Request({
        requestIds: id,
        action: "reject",
        origin: "Ankleshwar",
      }).unwrap();
      toast.success("Request rejected successfully");
    } catch (error) {
      console.error("Failed to reject request:", error);
      toast.error(error || "Failed to reject request");
    }
  };

  const handleView = (id) => {
    const rowdata = editdata.find((row) => row.id === id);
    setSelectedRowData(rowdata);
    setIsModalOpen(true);
  };

  const handleEditdataApprove = async (id) => {
    console.log("id", id);
    console.log("type of id", typeof id);
    try {
      await EditRequest({
        requestId: id,
        action: "approve",
        origin: "Ankleshwar",
      }).unwrap();
      toast.success("Request approved successfully");
    } catch (error) {
      console.error("Failed to approved request:", error);
      toast.error(error || "Failed to approved request");
    }
  };
  const handleEditdataReject = async (id) => {
    try {
      await EditRequest({
        requestId: id,
        action: "reject",
        origin: "Ankleshwar",
      }).unwrap();
      toast.success("Request rejected successfully");
    }
    catch (error) {
      console.error("Failed to reject request:", error);
      toast.error(error || "Failed to reject request");
    }
  };

  if (isLoading || isApproving || isEditApproving) {
    return <div>Loading...</div>;
  }
 
  return (
    <div>
      <Tabs
        onChange={onChange}
        type="card"
        items={[
          {
            label: "Delete Request",
            key: "1",
            children: (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="w-full font-serif text-2xl text-center">
                  Injury data management
                </h2>
                <table className="w-[550px] mt-4 text-center">
                  <thead>
                    <tr>
                      <th className="border w-[300px] py-2">
                        Total delete Record
                      </th>
                      <th className="border w-[300px] py-2">Reason</th>
                      <th className="border w-[100px] py-2">Status</th>
                      <th className="border w-[280px] py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.length > 0 ? (
                      data.map((request) => (
                        <tr key={request.id}>
                          <td className="border py-2">
                            {request.recordId.length}
                          </td>
                          <td className="border py-2">{request.reason}</td>
                          <td className="border py-2">{request.status}</td>
                          <td className="border py-2">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleApprove(request.id)}
                                disabled={isApproving}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 hover:cursor-pointer"
                              >
                                {isApproving ? "Approving..." : "Approve"}
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600 hover:cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-2">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            
            label: "Edit Request",
            key: "2",
            children: (
              
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="w-full font-serif text-2xl text-center">
                  Injury data management
                </h2>
                {modalopen && (
                                  <Modalform
                                    key={selectedRowData?.id}
                                    mode="view"
                                    model="injuries"
                                    viewdata={selectedRowData}
                                    onClose={() => setIsModalOpen(false)}
                  
                                  />
                                )}
                <table className="w-[550px] mt-4 text-center">
                  <thead>
                    <tbody>
                      {editdata && editdata.length > 0 ? (
                        <table className="w-full border-collapse border border-gray-300">
                          <thead className="bg-gray-200 sticky top-0">
                            <tr>
                              <th className="border border-gray-300 p-2">
                                {" "}
                                Data_Id{" "}
                              </th>
                              <th className="border border-gray-300 p-2">
                                {" "}
                                Reason{" "}
                              </th>
                              <th className="border border-gray-300 p-2">
                                {" "}
                                status{" "}
                              </th>
                              <th className="border border-gray-300 p-2">
                                {" "}
                                Action{" "}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {editdata.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                <td className="border border-gray-300 p-2">
                                  {row.recordId}
                                </td>
                                <td className="border border-gray-300 p-2">
                                  {row.reason}{" "}
                                </td>
                                <td className="border border-gray-300 p-2">
                                  {row.status}{" "}
                                </td>
                                <td className="border border-gray-300 p-2">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      onClick={() => handleEditdataApprove(row.id)}
                                      disabled={isApproving}
                                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 hover:cursor-pointer"
                                    >
                                      {isApproving ? "Approving..." : "Approve"}
                                    </button>
                                    <button
                                      onClick={() => handleEditdataReject(row.id)}
                                      className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600 hover:cursor-pointer"
                                    >
                                      Reject
                                    </button>
                                    <button
                                      onClick={() => handleView(row.id)}
                                      className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-600 hover:cursor-pointer"
                                    >
                                      View
                                    </button>
                                  </div>{" "}
                                </td>
                                
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                      ) : (
                        <p className="text-center text-red-500">
                          No data available
                        </p>
                      )}
                    </tbody>
                  </thead>
                </table>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

export default Injuryrecord;
