import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import {useState, useEffect } from 'react';
 
const CLIENT_ID = "7276076c86434629923e163eb1ba9682";
const CLIENT_SECRET = "b08e0d99a79c40d2b6884715feb73978";
 
function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccestoken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // API Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccestoken(data.access_token))
  }, [])
 
  //Search
  async function search() {
    if (!searchInput) {
      console.log("Search input is empty. Nothing to search for.");
      return;
    }
 
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist' , searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })
 
    console.log("Artist ID is " + artistID);
 
    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=NL&limit=50', searchParameters)
     .then(response => response.json()) 
     .then(data => {
        console.log(data);
        setAlbums(data.items);
     });
 
  }
 console.log(albums);
  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
        <FormControl
          placeholder="Search for an artist"
          type="input"
          onKeyPress={event => {
            if (event.key == "Enter") {
              search();
            }
          }}
          onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={event => {console.log(search())}}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
        {albums.map( (album, i) => {
          console.log(album);
          return (
              <Card>
          <Card.Img src={album.images[0].url} />
          <Card.Body>
            <Card.Title>{album.name}</Card.Title>
            <Button>CLICK</Button>
          </Card.Body>
        </Card>
            )
          })}

        </Row>
      </Container>
    </div>
  );
}
 
export default App;