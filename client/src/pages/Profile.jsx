import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CiEdit } from "react-icons/ci";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;

    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        setFileUploadPercentage(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        setFileUploadError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
        console.log("Upload complete");
      }
    );
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(email, emailRegex.test(email));
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleInvalidInput = (message) => {
    dispatch(updateUserFailure(message));
    setUpdateSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email && !isEmailValid(formData.email)) {
      handleInvalidInput("Invalid email address");
      return;
    }

    if (formData.password && !isPasswordValid(formData.password)) {
      handleInvalidInput(
        "Password must be at least 8 characters long, have atleat one uppercase, one lowewrcase and a special character"
      );
      return;
    }

    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setUpdateSuccess(false);

        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateSuccess(false);
    }
  };
  // firebase storage rule
  // allow read;
  //     allow write: if
  //     request.resource.size < 2*1024*1024 &&
  //     request.resource.contentType.matches('image/.*')
  return (
    <div className="p3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="relative flex self-center">
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 shadow-lg hover:opacity-50 transform transition duration-200"
          />
          <label
            htmlFor="editImage"
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer"
          >
            <CiEdit />
          </label>
          <input
            type="file"
            id="editImage"
            ref={fileRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
        </div>
        <p className="text-center text-small">
          {fileUploadError ? (
            <>
              <span className="text-red-700">Error Image Upload</span>
            </>
          ) : fileUploadPercentage > 0 && fileUploadPercentage < 100 ? (
            <>
              <span className="text-slate-700">Image Uploading...</span>
            </>
          ) : fileUploadPercentage === 100 ? (
            <>
              <span className="text-green-700">
                Image Uploaded Successfully
              </span>
            </>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Updating User..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <div className="text-small text-center">
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-700 mt-5">
          {updateSuccess ? "Sucessfully Updated" : ""}
        </p>
      </div>
    </div>
  );
};

export default Profile;
