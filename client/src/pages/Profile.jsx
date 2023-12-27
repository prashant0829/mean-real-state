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

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

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
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-90 disabled:opacity-80">
          Update
        </button>
        <div className="flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer">Delete</span>

          <span className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
};

export default Profile;
