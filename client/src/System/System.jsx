import React, { useEffect, useState } from "react";
import Search from "../Component/Search";
import AxiosInstance from "../Component/AxiosInstance";

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
  useEffect(() => {
    AxiosInstance.get(`printers`)
      .then((res) => console.log("printer: ", res))
      .catch((err) => console.log(err));
  }, []);
  // console.log("printer: ", printer);
  const [newPrinter, setNewPrinter] = useState({
    id: "",
    campus: "",
    building: "",
    room: "",
    status: "Online", // Giá trị mặc định
  });
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (searchValue) => {
    setSearchValue(searchValue.trim());
    if (!searchValue.trim()) {
      setFilteredData([]);
    } else {
      const filtered = printer.filter((item) =>
        item.id.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleAction = (action, printerId) => {
    console.log(`Action: ${action}, Printer ID: ${printerId}`);
    // Perform action here (e.g., Update, Delete, Restart)
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Would you like to delete this printer?");
    if (confirm) {
      try {
        await AxiosInstance.delete(`printers/${id}`);
        toast.success("Deleted Successfully!");

        // Cập nhật danh sách máy in sau khi xóa thành công
        setPrinter((prevPrinter) =>
          prevPrinter.filter((printer) => printer.id !== id)
        );

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
        toast.error("An error occurred while deleting the printer!");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrinter({ ...newPrinter, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      !newPrinter.id ||
      !newPrinter.campus ||
      !newPrinter.building ||
      !newPrinter.room
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Thêm máy in mới vào danh sách
    setPrinter((prevPrinters) => [...prevPrinters, newPrinter]);

    // Xóa thông tin trong form sau khi submit
    setNewPrinter({
      id: "",
      campus: "",
      building: "",
      room: "",
      status: "Online",
    });

    // Đóng modal sau khi thêm
    const modalElement = document.getElementById("AddNewPrinter");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  };

  const renderPrinters = searchValue ? filteredData : printer;

  return (
    <>
      <div className="container my-5">
        <div className="card shadow">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Danh sách máy in</h5>
            <div className="d-flex align-items-center">
              <Search
                onSearchChange={handleSearchChange}
                searchData={printer}
              />
              <button
                className="btn btn-success ms-3"
                data-bs-toggle="modal"
                data-bs-target="#AddNewPrinter"
              >
                + New Printer
              </button>
            </div>
          </div>
          <div className="card-body">
            <table className="table table-hover text-center">
              <thead>
                <tr>
                  <th>Mã máy in</th>
                  <th>Cơ sở</th>
                  <th>Tòa</th>
                  <th>Tầng-Phòng</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {renderPrinters.length > 0 ? (
                  renderPrinters.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.campus}</td>
                      <td>{d.building}</td>
                      <td>{d.room}</td>
                      <td>{d.status}</td>
                      <td>
                        {/* <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleAction("Update", d.id)}
                        >
                          Update
                        </button> */}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(d.id)}
                        >
                          Delete
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
                    Mã máy in
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="id"
                    name="id"
                    value={newPrinter.id}
                    onChange={handleInputChange}
                    placeholder="Nhập mã máy in"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="campus" className="form-label">
                    Cơ sở
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="campus"
                    name="campus"
                    value={newPrinter.campus}
                    onChange={handleInputChange}
                    placeholder="Nhập cơ sở"
                    required
                  />
                </div>
                <div className="mb-3">
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
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="submit" className="btn btn-primary w-100">
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
