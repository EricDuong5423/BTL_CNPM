import React, { useEffect, useState } from "react";
import Search from "../Component/Search";
import AxiosInstance from "../Component/AxiosInstance";
import Pagination from "../Component/Pagination";
import "./system.css";
import { toast } from "react-toastify";

export default function System() {
  const [printer, setPrinter] = useState([
    // {
    //   id: "1",
    //   campus: "1",
    //   building: "A4",
    //   room: "202",
    //   status: "Online",
    // },
    // {
    //   id: "2",
    //   campus: "2",
    //   building: "C6",
    //   room: "309",
    //   status: "Offline",
    // },
  ]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [newPrinter, setNewPrinter] = useState({
    type: "",
    location: "",
    paperType: ["A0", "A1", "A2", "A3", "A4"],
    status: "",
    currentPaper: "",
    description: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 5;
  const [renderPrinters, setRenderPrinters] = useState([]);

  // useEffect(() => {
  //   AxiosInstance.get(`printers`)
  //     .then((res) => setPrinter(res.data.data.allPrinter))
  //     .catch((err) => console.log(err));
  // }, [res.data.data.allPrinter]);

  const fetchPrinters = () => {
    AxiosInstance.get(`printers/`)
      .then((res) => setPrinter(res.data.data.allPrinter))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchPrinters();
  }, []);

  useEffect(() => {
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const dataSource = searchValue ? filteredData : printer;
    setRenderPrinters(dataSource.slice(indexOfFirstData, indexOfLastData));
  }, [currentPage, searchValue, filteredData, printer, dataPerPage]);

  const handleSearchChange = (searchValue) => {
    setSearchValue(searchValue.trim());
    if (!searchValue.trim()) {
      setFilteredData([]);
    } else {
      const filtered = printer.filter((item) => {
        return item.type.toLowerCase().includes(searchValue.toLowerCase());
      });
      setFilteredData(filtered);
      setRenderPrinters(filtered.slice(0, dataPerPage));
    }
    setCurrentPage(1);
  };

  const handleAction = (action, printerId) => {
    console.log(`Action: ${action}, Printer ID: ${printerId}`);
    // Perform action here (e.g., Update, Delete, Restart)
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Would you like to delete this printer?");
    if (confirm) {
      try {
        const res = await AxiosInstance.delete(`printers/${id}`);
        toast.success("Xóa thành công!");

        console.log(res);
        fetchPrinters();
        // setFilteredData((prevFilteredData) =>
        //   prevFilteredData.filter((printer) => printer.id !== id)
        // );
        // // Nếu có phân trang, bạn có thể thêm logic để điều chỉnh trang hiện tại
        // if (filteredData.length === 1 && currentPage !== 1) {
        //   paginate(currentPage - 1); // Chuyển đến trang trước nếu trang hiện tại rỗng
        // } else if (filteredData.length === 1 && currentPage === 1) {
        //   paginate(1); // Nếu ở trang đầu tiên và rỗng, vẫn ở lại trang 1
        // }
      } catch (error) {
        console.error(error);
        toast.error("Xóa thất bại!");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      value === "true" ? true : value === "false" ? false : value;
    setNewPrinter({ ...newPrinter, [name]: parsedValue });
  };

  const removePaperType = (index) => {
    const newPaperType = newPrinter.paperType.filter((_, i) => i !== index);
    setNewPrinter({ ...newPrinter, paperType: newPaperType });
  };

  const handleChangeStatus = (id, currentStatus) => {
    // console.log(id, "+", currentStatus);

    // Đảo ngược trạng thái hiện tại
    const newStatus = currentStatus === "Active" ? true : false;

    // Tạo body của request
    const body = { status: newStatus };

    // Gửi yêu cầu cập nhật trạng thái
    AxiosInstance.patch(`printers/${id}`, body)
      .then((response) => {
        toast.success("Cập nhật thành công!");

        console.log("Status updated successfully:", response.data);
        // Cập nhật trạng thái của máy in trong state
        const updatedPrinters = printer.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        );
        setPrinter(updatedPrinters);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        // Hiển thị thông báo lỗi nếu cần
        toast.error("Cập nhật thất bại!");
      });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const Status_selector = document.querySelector("#status");
    if (
      !newPrinter.type ||
      !newPrinter.location ||
      !newPrinter.paperType ||
      Status_selector.value === null
    ) {
      alert("Vui lòng điền đầy đủ thông tin, kiểm tra lại trạng thái");
      return;
    }

    // newPrinter.status === null ? "" : setNewPrinter({ ...newPrinter, status: false });

    if (!Number.isInteger(Number(newPrinter.currentPaper))) {
      alert("Số giấy ban đầu phải là một số nguyên!");
      return;
    }

    // console.log(newPrinter);

    try {
      const res = await AxiosInstance.post(`printers/`, newPrinter);
      if (res.status === 201) {
        console.log("Submit thành công:", res.data);
        fetchPrinters();
        setNewPrinter({
          type: "",
          location: "",
          paperType: ["A0", "A1", "A2", "A3", "A4"],
          status: true,
          currentPaper: "",
          description: "",
        });
      }
      toast.success("Thành công thêm máy in mới!");
    } catch (error) {
      console.log(res);
      toast.error("Thêm máy in thất bại!");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // const handleRandomUsing = () => {
  //   return Math.random() >= 0.5;
  // };

  return (
    <>
      <div className="container my-5">
        <div className="card" style={{ minHeight: "550px" }}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="TitleList">DANH SÁCH MÁY IN</h5>

            <div className="d-flex align-items-center">
              <Search
                onSearchChange={handleSearchChange}
                searchData={printer}
              />
              <button
                className="addbutton mx-2"
                data-bs-toggle="modal"
                data-bs-target="#AddNewPrinter"
              >
                +
              </button>
            </div>
          </div>
          <div className="card-body">
            <table className="table text-center">
              <thead>
                <tr>
                  <th>Mã máy in</th>
                  <th>Kiểu máy</th>
                  <th>Địa điểm</th>
                  <th>Hoạt động</th>
                  <th>Số giấy hiện dụng</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {renderPrinters.length > 0 ? (
                  renderPrinters.map((d) => (
                    <tr key={d._id}>
                      <td>{d._id}</td>
                      <td>{d.type}</td>
                      <td>{d.location}</td>
                      <td>
                        {d.status &&
                          (() => {
                            const random = Math.random() >= 0.5;
                            return (
                              <button
                                className={
                                  random ? "btn btn-danger" : "btn btn-success"
                                }
                              >
                                {random ? "Bận" : "Trống"}
                              </button>
                            );
                          })()}
                      </td>
                      <td>{d.currentPaper}</td>
                      <td>
                        {/*d.status ? "Active" : "Inactive"*/}
                        <div className="form">
                          <select
                            className="form-select"
                            defaultValue={d.status ? "Active" : "Inactive"} // Sử dụng "Active" hoặc "Inactive" làm giá trị mặc định
                            onChange={(e) =>
                              handleChangeStatus(d._id, e.target.value)
                            } // Gọi hàm xử lý khi thay đổi
                          >
                            <option value="Active">Kích hoạt</option>
                            <option value="Inactive">Vô hiệu hoá</option>
                          </select>
                        </div>
                      </td>

                      <td>
                        {/* <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleAction("Update", d.id)}
                        >
                          Update
                        </button> */}
                        <button
                          className="deletebutton btn btn-danger btn-sm"
                          onClick={() => handleDelete(d._id)}
                        >
                          Xóa
                        </button>

                        {/* <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleAction("Restart", d.id)}
                        >
                          Restart
                        </button> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No printers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* <div className=" align-self-center" id="pagenation">
            <nav aria-label="...">
              <ul className="pagination pagination">
                <li className="page-item active" aria-current="page">
                  <span className="page-link">1</span>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
              </ul>
            </nav>
          </div> */}
          <Pagination
            totalPrinters={searchValue ? filteredData.length : printer.length}
            dataPerPage={dataPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal for Adding New Printer */}
      <div
        className="modal fade"
        id="AddNewPrinter"
        tabIndex="-1"
        aria-labelledby="addPrinterModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: "#d9eefa" }}>
            <div className="modal-header border-0">
              <h5
                className="modal-title text-center w-100"
                id="addPrinterModalLabel"
                style={{
                  fontWeight: "bold",
                  color: "#36454F",
                }}
              >
                Thêm máy in mới
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="id" className="form-label">
                    Kiểu máy in
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="type"
                    name="type"
                    value={newPrinter.type}
                    onChange={handleInputChange}
                    placeholder="Nhập kiểu (tên) máy in"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="campus" className="form-label">
                    Số giấy ban đầu
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="currentPaper"
                    name="currentPaper"
                    value={newPrinter.currentPaper}
                    onChange={handleInputChange}
                    placeholder="Nhập số giấy"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="campus" className="form-label">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={newPrinter.location}
                    onChange={handleInputChange}
                    placeholder="CS1-B4-104"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="campus" className="form-label">
                    Trạng thái
                  </label>
                  <select
                    className="form-control"
                    id="status"
                    name="status"
                    onChange={handleInputChange}
                  >
                    <option className="option">Chọn trạng thái</option>
                    <option value={true}>Kích Hoạt</option>
                    <option value={false}>Vô Hiệu Hóa</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="campus" className="form-label">
                    Mô tả
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={newPrinter.description}
                    onChange={handleInputChange}
                    placeholder=""
                    required
                  />
                </div>
                <label htmlFor="campus" className="form-label">
                  Loại giấy hỗ trợ
                </label>
                <div className="container">
                  {newPrinter.paperType.map((d, i) => (
                    <div className="input-group mb-1" key={i}>
                      <input
                        type="text"
                        value={d}
                        readOnly
                        className="form-control"
                      />
                      <button
                        type="button"
                        className="removebutton btn btn-danger btn-sm"
                        onClick={() => removePaperType(i)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                {/* <div className="mb-3">
                  <label htmlFor="building" className="form-label">
                    Tòa
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="building"
                    name="building"
                    value={newPrinter.building}
                    onChange={handleInputChange}
                    placeholder="Nhập tòa"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="room" className="form-label">
                    Tầng - Phòng
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="room"
                    name="room"
                    value={newPrinter.room}
                    onChange={handleInputChange}
                    placeholder="Nhập tầng - phòng"
                    required
                  />
                </div> */}
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={(e) => handleFormSubmit(e)}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
