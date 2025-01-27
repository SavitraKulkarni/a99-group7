import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LikedSongs = () => {
    let navigate = useNavigate();

    const {state} = useLocation();
    const { username, email } = state;

    const [URL, setURL] = useState();
    const [songs, setSongs] = useState([]);
    const [songsLoaded, setSongsLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            await axios.get('http://localhost:3000/get-liked-songs', { params: { email: email } }).then((response) => {
                setSongs(response.data);
                setSongsLoaded(true);
            }).catch((response) =>  {
                alert("ERROR");
            })
        })();
    }, []);

    const handleProfilePage = async e => {
        e.preventDefault();
        await axios.get('http://localhost:3000/profile-page', { params: { username: username, email: email } }).then((response) => {
            navigate('/profile', { state: { username: username, email: email } });
        }).catch((response) =>  {
            alert(response.response.data.error);
        })
    }

    const handleSong = async e => {
        e.preventDefault();
        await axios.post('http://localhost:3000/add-song', { email: email, URL: URL }).then((response) => {
            window.location.reload(true);
        }).catch((response) => {
            alert(response.response.data.error);
        })
    }

    const deleteSong = async e => {
        await axios.post('http://localhost:3000/delete-song', { email: email, URL: e.target.getAttribute('url').toString() }).then((response) => {
            window.location.reload(true);
        }).catch((response) => {
            alert(response.response.data.error);
        })
    }

    const displaySongs = () => {
        if (songsLoaded == true) {
            return (songs.data.map((listValue, index) => {
                return (
                    <tr key={index}>
                        <td>{listValue.song}</td>
                        <td>{listValue.artist}</td>
                        <td>{listValue.album}</td>
                        <td><a href={listValue.url}>{listValue.url}</a></td>
                        <td><button onClick={deleteSong} url={listValue.url} >Delete</button></td>
                    </tr>
                )
            }))
        }
    }

    return (
        <div>
            <div>
                <div>
                    <button onClick={handleProfilePage}>View Profile</button>
                </div>
                <div>
                    <input type="text" onChange={e => setURL(e.target.value)} />
                    <button onClick={handleSong}>Add Song!</button>
                </div>
            </div>
            <div>
                <table>
                    <tr>
                        <td>Song</td>
                        <td>Artist</td>
                        <td>Album</td>
                        <td>Spotify URL</td>
                    </tr>
                    {displaySongs(songs)}
                </table>
            </div>
        </div>
    )
}

export default LikedSongs;