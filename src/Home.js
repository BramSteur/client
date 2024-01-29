import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const CLIENT_ID = "fc7aa402ef0f4c9aa63e38b477a17efc";
const CLIENT_SECRET = "e2a46342fbaa486ba90f404a6a783227";

function redirect() {
  console.log('hallo');
}

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccestoken] = useState("");
  const [albums, setAlbums] = useState([]);
  
  const redirect = (destinationURL) => {
    window.location.href = destinationURL;
  };
  
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
    // Check if searchInput is empty
    if (!searchInput) {
        console.log("Search input is empty. Nothing to search for.");
        return;
    }
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist' , searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })

    console.log("artist id = " + artistID);

    console.log(searchParameters);
    console.log("accesstoken: " + accessToken)
    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50' , searchParameters)
      .then(response => response.json()) 
      .then(data =>{
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
            if (event.key === "Enter") {
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
          {albums.map( (album, i) =>{
            return (
              
              <Card >
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                  <Button onClick={() => redirect('/detail')}>
                    View Tracks
                  </Button>
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
