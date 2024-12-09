import React, { useEffect, useState } from "react";
import Search from "../Component/Search";
import AxiosInstance from "../Component/AxiosInstance";
import Pagination from "../Component/Pagination";
import { toast } from "react-toastify";
import "./system.css";

export default function System() {
  const [printer, setPrinter] = useState([]);
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
  const [selectedPrinter, setSelectedPrinter] = useState(null);

  // Fetch printers from API
  const fetchPrinters = () => {
    AxiosInstance.get(`printers/`)
      .then((res) => setPrinter(res.data.data.allPrinter))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPrinters();
  }, []);

  // Handle pagination and filtering
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
      const filtered = printer.filter((item) =>
        item.type.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
      setRenderPrinters(filtered.slice(0, dataPerPage));
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleShowDetails = (printer) => setSelectedPrinter(printer);
  const handleCloseDetails = () => setSelectedPrinter(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrinter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    AxiosInstance.post("printers/add", newPrinter)
      .then(() => {
        toast.success("Printer added successfully!");
        fetchPrinters();
      })
      .catch((err) => toast.error("Error adding printer: " + err.message));
  };

  const handleDelete = (id) => {
    AxiosInstance.delete(`printers/${id}`)
      .then(() => {
        toast.success("Printer deleted successfully!");
        fetchPrinters();
      })
      .catch((err) => toast.error("Error deleting printer: " + err.message));
  };

  const removePaperType = (index) => {
    setNewPrinter((prev) => ({
      ...prev,
      paperType: prev.paperType.filter((_, i) => i !== index),
    }));
  };

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
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {renderPrinters.length > 0 ? (
                  renderPrinters.map((printer) => (
                    <tr key={printer._id}>
                      <td>{printer._id}</td>
                      <td>{printer.type}</td>
                      <td>{printer.location}</td>
                      <td>
                        <button
                          className={`btn ${
                            Math.random() >= 0.5
                              ? "btn-danger"
                              : "btn-success"
                          }`}
                        >
                          {Math.random() >= 0.5 ? "Bận" : "Trống"}
                        </button>
                      </td>
                      <td>{printer.currentPaper}</td>
                      <td>
                        <select
                          className="form-select"
                          defaultValue={printer.status ? "Active" : "Inactive"}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="deletebutton btn btn-danger btn-sm"
                          onClick={() => handleDelete(printer._id)}
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <button
                          className="viewbutton btn-info btn-sm"
                          onClick={() => handleShowDetails(printer)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No printers found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="d-flex justify-content-center mt-3">
            <Pagination
              totalPrinters={searchValue ? filteredData.length : printer.length}
              dataPerPage={dataPerPage}
              onPageChange={handlePageChange}
            />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Printer Details */}
      {selectedPrinter && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thông tin máy in</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDetails}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Mã máy in:</strong> {selectedPrinter._id}
                </p>
                <p>
                  <strong>Loại máy in:</strong> {selectedPrinter.type}
                </p>
                <p>
                  <strong>Mô tả ngắn:</strong> {selectedPrinter.description}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseDetails}
                >
                  Thoát
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <label htmlFor="type" className="form-label">
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
                  <label htmlFor="currentPaper" className="form-label">
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
                  <label htmlFor="location" className="form-label">
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
                  <label htmlFor="status" className="form-label">
                    Trạng thái
                  </label>
                  <select
                    className="form-control"
                    id="status"
                    name="status"
                    value={newPrinter.status}
                    onChange={handleInputChange}
                  >
                    <option>Chọn trạng thái</option>
                    <option value={true}>Kích Hoạt</option>
                    <option value={false}>Vô Hiệu Hóa</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Mô tả
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={newPrinter.description}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả"
                    required
                  />
                </div>
                <label htmlFor="paperType" className="form-label">
                  Loại giấy hỗ trợ
                </label>
                <div className="container">
                  {newPrinter.paperType.map((type, index) => (
                    <div className="input-group mb-1" key={index}>
                      <input
                        type="text"
                        value={type}
                        readOnly
                        className="form-control"
                      />
                      <button
                        type="button"
                        className="removebutton btn btn-danger btn-sm"
                        onClick={() => removePaperType(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={handleFormSubmit}
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
