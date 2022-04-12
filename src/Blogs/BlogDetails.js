import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import image from "../../src/image/default.png";

const BlogDetails = () => {
  let { blogId } = useParams();

  // react hook
  const [details, setDetails] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState({});
  const [errorChildren, setErrorChildren] = useState({});
  const [toast, setToast] = useState(false);
  const [modal, setModal] = useState(false);
  const [childrenCommentId, setChildrenCommentId] = useState("");

  // handle blog details api call function
  const blogDetailsAPICall = async (id) => {
    await axios
      .get(`http://localhost:5000/${id}`)
      .then((res) => setDetails(res.data.data))
      .catch((error) => console.log(error));
  };

  // api call
  useEffect(() => {
    blogDetailsAPICall(blogId);
  }, [blogId]);

  // handle form comment submit
  const handleFormCommentSubmit = async (e) => {
    e.preventDefault();
    // fom data
    let formData = new FormData(e.target);

    // object iterate
    const createFormData = Object.fromEntries(formData.entries());

    await axios
      .post(`http://localhost:5000/comment/${blogId}`, createFormData)
      .then((res) => {
        setMessage(res.data.message);
        setToast(true);
        setTimeout(() => {
          setError({});
          setToast(false);
          blogDetailsAPICall(blogId);
          document.getElementById("commentForm").reset();
        }, 1500);
      })
      .catch((error) => setError(error.response.data));
  };

  // handle form children comment submit
  const handleFormChildrenCommentSubmit = async (e) => {
    e.preventDefault();
    // fom data
    let formData = new FormData(e.target);

    // object iterate
    const createFormData = Object.fromEntries(formData.entries());

    await axios
      .post(
        `http://localhost:5000/children/comment/${blogId}/${childrenCommentId}`,
        createFormData
      )
      .then((res) => {
        setMessage(res.data.message);
        setToast(true);
        setTimeout(() => {
          setErrorChildren({});
          setToast(false);
          setModal(false);
          blogDetailsAPICall(blogId);
          document.getElementById("myForm").reset();
        }, 1500);
      })
      .catch((error) => setErrorChildren(error.response.data));
  };
  // handle modal open
  const handleCreateModalOpen = (id) => {
    setChildrenCommentId(id);
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
              <h1>Our Blog Details</h1>
              <Link className="btn btn-primary" to={"/"}>
                Go Back
              </Link>
              <hr />
            </div>
          </div>

          {Object.values(details).length === 0 ? (
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
                <div className="col">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title text-capitalize">
                        {details.title}
                      </h5>
                      <p className="card-text">{details.content}</p>
                      <p className="card-text">
                        <small className="text-muted">
                          {new Date(details.date).toDateString()}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* blog comment form */}
              <div className="row mt-4">
                <div className="col">
                  <div className="card text-dark bg-light mb-3">
                    <h4 className="card-header">Add a Comment</h4>
                    <div className="card-body">
                      <form
                        id="commentForm"
                        method="post"
                        onSubmit={handleFormCommentSubmit}
                        encType="multipart/form-data"
                      >
                        <div className="modal-body">
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                              Name
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                error?.errors?.name ? "border-danger" : ""
                              }`}
                              id="name"
                              name="name"
                              placeholder="Name"
                            />
                            <span className="text-danger">
                              {error?.errors?.name?.msg}
                            </span>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="comment" className="form-label">
                              Comment
                            </label>
                            <textarea
                              className={`form-control ${
                                error?.errors?.comment ? "border-danger" : ""
                              }`}
                              id="comment"
                              name="comment"
                              rows="4"
                              placeholder="comment"
                            ></textarea>
                            <span className="text-danger">
                              {error?.errors?.comment?.msg}
                            </span>
                          </div>
                        </div>

                        <div className="modal-footer justify-content-start">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  {/* comment show */}
                  <div className="mb-3 d-flex flex-column">
                    {details.comment.map((com) => (
                      <div key={com._id}>
                        <div className="border px-4 py-3 mb-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0">
                              <img
                                width={60}
                                height={60}
                                className="rounded-circle"
                                src={image}
                                alt=""
                              />
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h5 className="text-capitalize">{com.name}</h5>
                              <small className="text-muted">
                                <b>
                                  {new Date(details.createdAt).toDateString()}
                                </b>
                              </small>
                            </div>
                          </div>
                          <div className="mt-3 px-2">
                            <p>{com.comment}</p>
                            <Link
                              onClick={() => handleCreateModalOpen(com._id)}
                              className="btn-link"
                              to="#"
                            >
                              Reply
                            </Link>
                          </div>
                        </div>

                        {/* children comment */}
                        {com.childrenComment.map((children) => (
                          <div
                            className="border px-4 py-3 ms-5 mb-3"
                            key={children._id}
                          >
                            <div className="d-flex">
                              <div className="flex-shrink-0">
                                <img
                                  width={60}
                                  height={60}
                                  className="rounded-circle"
                                  src={image}
                                  alt=""
                                />
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h5 className="text-capitalize">
                                  {children.name}
                                </h5>
                                <small className="text-muted">
                                  <b>
                                    {new Date(details.createdAt).toDateString()}
                                  </b>
                                </small>
                              </div>
                            </div>

                            <div className="mt-3 px-2">
                              <p>{children.comment}</p>
                              {/* <Link className="btn-link" to="#">
                              Reply
                            </Link> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
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
              <h5 className="modal-title">Comment Replay</h5>
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
              onSubmit={handleFormChildrenCommentSubmit}
              encType="multipart/form-data"
            >
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errorChildren?.errors?.name ? "border-danger" : ""
                    }`}
                    id="name"
                    name="name"
                    placeholder="Name"
                  />
                  <span className="text-danger">
                    {errorChildren?.errors?.name?.msg}
                  </span>
                </div>

                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">
                    Comment
                  </label>
                  <textarea
                    className={`form-control ${
                      errorChildren?.errors?.comment ? "border-danger" : ""
                    }`}
                    id="comment"
                    name="comment"
                    rows="4"
                    placeholder="comment"
                  ></textarea>
                  <span className="text-danger">
                    {errorChildren?.errors?.comment?.msg}
                  </span>
                </div>
              </div>

              <div className="modal-footer justify-content-start">
                <button type="submit" className="btn btn-primary">
                  Submit
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

export default BlogDetails;
