import React, { use, useEffect, useState } from "react";
import { Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequestsAsync } from "../../../feture/RequestSlice";

const onChange = (key) => {
  console.log(key);
};
function Injuryrecord() {
  const dispatch = useDispatch();
  const { deleteRequests, loading, error } = useSelector(
  (state) => state.request
);
  console.log(deleteRequests);
  const [data, setdata] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await dispatch(fetchRequestsAsync({ origin: "Ankleshwar" }));
      if (fetchRequestsAsync.fulfilled.match(res)) {
        setdata(res.payload);
        console.log(res.payload);
      } else {
        console.error("Failed to fetch requests:", res.error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div>
      <Tabs
        onChange={onChange}
        type="card"
        items={Array.from({ length: 2 }).map((_, i) => {
          const id = String(i + 1);
          const label = ["Edit Request", "Change Request"];
          return {
            label: label[i],
            key: id,
            children: (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className=" w-[20%] font-serif text-2xl mx-auto">
                  Injury data management{" "}
                </h2>
                <table className="w-full mt-4">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">ID</th>
                      <th className="border px-4 py-2">RecordID</th>
                      <th className="border px-4 py-2">Reason</th>
                      <th className="border px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deleteRequests?.map((request) => (
                      <tr key={request.id}>
                        <td className="border px-4 py-2">{request.id}</td>
                        <td className="border px-4 py-2">{Array.from[request.recordId]}</td>
                        <td className="border px-4 py-2">{request.reason}</td>
                        <td className="border px-4 py-2">{request.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          };
        })}
      />
    </div>
  );
}

export default Injuryrecord;
