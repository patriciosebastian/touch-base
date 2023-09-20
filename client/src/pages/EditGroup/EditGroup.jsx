import { useState, useEffect, useContext } from "react";
import { GroupsContext } from "../../context/GroupsContext";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Button from "../../components/Button/Button";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./EditGroup.css";

export default function EditContact() {
    const { getGroup, updateGroup } = useContext(GroupsContext);
    const { groupId } = useParams();
    const [group_name, setGroupName] = useState("");
    const [about_text, setAboutText] = useState("");
    const [cover_picture, setCoverPicture] = useState(null);
    const [loading, setLoading] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

  // Get latest group info 
  useEffect(() => {
    const fetchGroup = async () => {
      if (auth.currentUser) {
          await getGroup(groupId)
              .then((res) => {
                setGroupName(res.group_name);
                setAboutText(res.about_text);
              });
          console.log("Fetched group successfully (GD)");
      } else {
        console.log("User not logged in");
      }
    }
    fetchGroup();
  }, [getGroup, groupId, auth.currentUser]);

  // Update group
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateGroup(groupId, group_name, about_text, cover_picture);
    setLoading(false);
    navigate(-1);
  };

  return (
    <div>
      {loading ? <LoadingSpinner /> : (
        <>
          <h1 className="edit-group-title">Edit Group</h1>
          <form className="edit-group-form" id="edit-group-form" encType="multipart/form-data" onSubmit={handleSubmit}>
            {/* Group name */}
            <label htmlFor="group_name">Group Name</label>
            <input type="text" id="group_name" name="group_name" value={group_name || ""} onChange={(e) => setGroupName(e.target.value)} required />

            {/*About text  */}
            <label htmlFor="about_text">About</label>
            <input type="text" id="about_text" name="about_text" value={about_text || ""} onChange={(e) => setAboutText(e.target.value)} />

            {/* Group cover picture */}
            <label htmlFor="cover_picture">Select a cover photo:</label>
            <input className="edit-cover-picture" type="file" id="cover_picture" name="cover_picture"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setCoverPicture(e.target.files[0]);
                }}}
            />

            {/* Update and cancel btns */}
            <div className="group-update-and-cancel-btns">
              <Button className="update-group-btn" type="submit">Update Group</Button>
              <button className="edit-group-cancel-btn" type="button" onClick={() => {navigate(-1)}}>Cancel</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
