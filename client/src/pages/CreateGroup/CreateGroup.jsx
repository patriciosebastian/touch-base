import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GroupsContext } from '../../context/GroupsContext';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import './CreateGroup.css';

export default function CreateGroup() {
    const [group_name, setGroupName] = useState("");
    const [about_text, setAboutText] = useState("");
    const [cover_picture, setCoverPicture] = useState(null);
    const { addGroup } = useContext(GroupsContext);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        addGroup(group_name, about_text, cover_picture);
        // confirm to user.
        navigate('/app/groups');
    };

  return (
    <div>
        <Header className="create-group-header" />
        <div className="create-group-container">
            <h1>Create Group</h1>
            <form className="create-group-form" id="create-group-form" encType="multipart/form-data" onSubmit={handleSubmit}>
                <label htmlFor="group_name">Group Name</label>
                <input className="group-name-input" type="text" id="group_name" name="group_name" value={group_name} onChange={(e) => setGroupName(e.target.value)} required />

                <label htmlFor= "about_text">About (optional)</label>
                <input className="about-group-input" type="text" id="about_text" name="about_text" value={about_text} onChange={(e) => setAboutText(e.target.value)} />

                <label htmlFor="cover_picture">Group photo:</label>
                <input className="select-cover-picture" type="file" id="cover_picture" name="cover_picture" onChange={(e) => setCoverPicture(e.target.files[0])} />

                <input className="create-group-submit" type="submit" value={"Submit"} />
                <Link to={'/app/groups'}><Button className="cancel-create-group-btn">Cancel</Button></Link>
            </form>
        </div>
    </div>
  );
}
