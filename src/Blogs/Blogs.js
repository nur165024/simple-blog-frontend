import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState({});
  const [toast, setToast] = useState(false);

  // blogs api function
  const blogAPICall = async () => {
    await axios
      .get("http://localhost:5000/")
      .then((res) => setBlogs(res.data.data));
  };

  // blogs api call
  useEffect(() => {
    blogAPICall();
  }, []);

  // handle form submit blog create
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // fom data
    let formData = new FormData(e.target);

    // object iterate
    const createFormData = Object.fromEntries(formData.entries());

    await axios
      .post("http://localhost:5000/", createFormData)
      .then((res) => {
        setMessage(res.data.message);
        setToast(true);
        setTimeout(() => {
          setError({});
          setToast(false);
          setModal(false);
          blogAPICall();
          document.getElementById("myForm").reset();
        }, 1500);
      })
      .catch((error) => setError(error.response.data));
  };

  // handle modal open
  const handleCreateModalOpen = () => {
    setModal(true);
  };

  // handle modal close
  const handleCreateModalClose = () => {
    setModal(false);
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <hr />
              <h1>Our Blog List</h1>
              <button
                onClick={handleCreateModalOpen}
                className="btn btn-primary"
              >
                Blog Create
              </button>
              <hr />
            </div>
          </div>

          {blogs.length === 0 ? (
            <div className="row">
              <div className="col text-center">
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="row">
                {blogs.map((blog) => (
                  <div className="col-3" key={blog._id}>
                    <div className="card mb-4">
                      <div className="card-body">
                        <h5 className="card-title text-capitalize">
                          {blog.title}
                        </h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          Date : {new Date(blog.date).toDateString()}
                        </h6>

                        <p className="card-text">{blog.content}</p>
                        <Link to={`${blog._id}`} className="card-link">
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row">
                <div className="col">
                  <nav>
                    <ul className="pagination">
                      <li className="page-item disabled">
                        <span className="page-link">Previous</span>
                      </li>

                      <li className="page-item">
                        <Link className="page-link" to="#">
                          1
                        </Link>
                      </li>

                      <li className="page-item active">
                        <span className="page-link">2</span>
                      </li>

                      <li className="page-item">
                        <Link className="page-link" to="#">
                          3
                        </Link>
                      </li>

                      <li className="page-item">
                        <Link className="page-link" to="#">
                          Next
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <div className={`modal ${modal ? "d-block" : "d-none"}`}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Blog Create</h5>
              <button
                onClick={handleCreateModalClose}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form
              id="myForm"
              method="post"
              onSubmit={handleFormSubmit}
              encType="multipart/form-data"
            >
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      error?.errors?.title ? "border-danger" : ""
                    }`}
                    id="title"
                    name="title"
                    placeholder="title"
                  />
                  <span className="text-danger">
                    {error?.errors?.title?.msg}
                  </span>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    Content
                  </label>
                  <textarea
                    className={`form-control ${
                      error?.errors?.content ? "border-danger" : ""
                    }`}
                    id="content"
                    name="content"
                    rows="4"
                    placeholder="Content"
                  ></textarea>
                  <span className="text-danger">
                    {error?.errors?.content?.msg}
                  </span>
                </div>

                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <input
                    type="datetime-local"
                    className={`form-control ${
                      error?.errors?.date ? "border-danger" : ""
                    }`}
                    id="date"
                    name="date"
                  />
                  <span className="text-danger">
                    {error?.errors?.date?.msg}
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {toast && (
        <div
          className="toast d-block justify-content-end text-white bg-primary border-0"
          style={{ position: "fixed", top: 20, right: 0 }}
        >
          <div className="d-flex">
            <div className="toast-body">{message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default Blogs;
