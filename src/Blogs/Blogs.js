import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Blogs = () => {
  // react hook
  const [blogs, setBlogs] = useState([]);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState({});
  const [toast, setToast] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
  });

  // blogs api function
  const blogAPICall = async (page, limit) => {
    await axios
      .get(
        `https://simple-blog-2022.herokuapp.com/?page=${page}&limit=${limit}`
      )
      .then((res) => setBlogs(res.data));
  };

  // blogs api call
  useEffect(() => {
    blogAPICall(pagination.page, pagination.limit);
  }, [pagination]);

  // handle form submit blog create
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // fom data
    let formData = new FormData(e.target);

    // object iterate
    const createFormData = Object.fromEntries(formData.entries());

    await axios
      .post("https://simple-blog-2022.herokuapp.com/", createFormData)
      .then((res) => {
        setMessage(res.data.message);
        setToast(true);
        setTimeout(() => {
          setError({});
          setToast(false);
          setModal(false);
          blogAPICall(pagination.page, pagination.limit);
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

  // total page list
  let totalPage = [];

  // pagination
  for (let i = 1; i <= blogs.pages; i++) {
    totalPage.push(i);
  }

  console.log(totalPage);

  // handle pagination
  const handlePagination = (page) => {
    setPagination({ page: page, limit: 12 });
  };

  // Previous
  const handlePrevious = () => {
    if (pagination.page === 1) {
      setPagination({ page: 1, limit: 12 });
    } else {
      setPagination({ page: pagination.page - 1, limit: 12 });
    }
  };

  // next
  const handleNext = () => {
    if (pagination.page === blogs.pages) {
      setPagination({ page: blogs.pages, limit: 12 });
    } else {
      setPagination({ page: pagination.page + 1, limit: 12 });
    }
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

          {blogs?.data?.length === 0 ? (
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
                {blogs?.data?.map((blog) => (
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
                      {pagination.page === 1 ? (
                        <li className="page-item disabled">
                          <span className="page-link">Previous</span>
                        </li>
                      ) : (
                        <li onClick={handlePrevious} className="page-item">
                          <Link className="page-link" to="#">
                            Previous
                          </Link>
                        </li>
                      )}

                      {totalPage.map((index) => {
                        return (
                          <>
                            {pagination.page === index ? (
                              <li className="page-item active">
                                <span className="page-link">{index}</span>
                              </li>
                            ) : (
                              <li
                                onClick={() => handlePagination(index)}
                                className="page-item"
                              >
                                <Link className="page-link" to={`#`}>
                                  {index}
                                </Link>
                              </li>
                            )}
                          </>
                        );
                      })}

                      {pagination.page === blogs.pages ? (
                        <li className="page-item disabled">
                          <span className="page-link">Next</span>
                        </li>
                      ) : (
                        <li onClick={handleNext} className="page-item">
                          <Link className="page-link" to="#">
                            Next
                          </Link>
                        </li>
                      )}
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
          style={{ position: "fixed", top: 10, right: 0 }}
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
