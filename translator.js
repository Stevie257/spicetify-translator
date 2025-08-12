
(function translator() {
  
	const { CosmosAsync, ContextMenu, URI } = Spicetify;
	if (!(CosmosAsync && URI)) {
		setTimeout(translator, 300);
		return;
	}
	
 const fetchAlbum = async (uri) => {
  const res = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${uri.split(":")[2]}`);
  return res.name;
};

const fetchShow = async (uri) => {
  const res = await Spicetify.CosmosAsync.get(
    `sp://core-show/v1/shows/${uri.split(':')[2]}?responseFormat=protobufJson`,
    {
      policy: { list: { index: true } },
    }
  );
  return res.header.showMetadata.name;
};

const fetchArtist = async (uri) => {

  const res = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${uri.split(":")[2]}`);

  return res.name;
};

const fetchTrack = async (uri) => {
  const res = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks/${uri.split(':')[2]}`);
  return res.name;
};

const fetchEpisode = async (uri) => {
  const res = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/episodes/${uri.split(':')[2]}`);
  return res.name;
};

const fetchPlaylist = async (uri) => {
    const res = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${uri}/metadata`, {
    policy: { name: true },
  });
  return res.metadata.name;
};

async function getMediaName(uri) {
  const type = uri.split(':')[1];
    let name;
    switch (type) {
      case Spicetify.URI.Type.TRACK:
        name = await fetchTrack(uri);
        break;
      case Spicetify.URI.Type.ALBUM:
        name = await fetchAlbum(uri);
        break;
      case Spicetify.URI.Type.ARTIST:
        name = await fetchArtist(uri);
        break;
      case Spicetify.URI.Type.SHOW:
        name = await fetchShow(uri);
        break;
      case Spicetify.URI.Type.EPISODE:
        name = await fetchEpisode(uri);
        break;
      case Spicetify.URI.Type.PLAYLIST_V2:
        name = await fetchPlaylist(uri);
        break;
    }
    return name;
}

async function translateSongTitle([uri]) {

    open(`https://translate.google.com/?sl=auto&tl=en&text=${await getMediaName(uri)}&op=translate`);
  
}

async function translateSongContextless() {
  // const uri = Spicetify.Player.data?.item.uri;
  var query = Spicetify.Player.data.item.name;
  open(`https://translate.google.com/?sl=auto&tl=en&text=${query}&op=translate`);
}

	const shouldDisplayContextMenu = (uris) => {
		if (uris.length > 1) return false;
		const uri = uris[0];
		const uriObj = Spicetify.URI.fromString(uri);
		if (uriObj.type === Spicetify.URI.Type.TRACK) return true;
		  switch (uriObj.type) {
        case Spicetify.URI.Type.TRACK:
          return true;
        case Spicetify.URI.Type.ALBUM:
          return true;
        case Spicetify.URI.Type.ARTIST:
          return true;
        case Spicetify.URI.Type.SHOW:
          return true;
        case Spicetify.URI.Type.EPISODE:
          return true;
        case Spicetify.URI.Type.PLAYLIST:
          return false;
        case Spicetify.URI.Type.PLAYLIST_V2:
          return true;
      }
	}

const statsIcon = `<svg fill="currentColor" class="main-contextMenu-menuItemIcon" stroke="None" height="18px" width="18px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" stroke-width="0.75" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 96 960 960" xml:space="preserve">
   <path fill="currentColor" d="m475 976 181-480h82l186 480h-87l-41-126H604l-47 126h-82Zm151-196h142l-70-194h-2l-70 194Zm-466 76-55-55 204-204q-38-44-67.5-88.5T190 416h87q17 33 37.5 62.5T361 539q45-47 75-97.5T487
   336H40v-80h280v-80h80v80h280v80H567q-22 69-58.5 135.5T419 598l98 99-30 81-127-122-200 200Z" />
   </svg>`

/*
const statsIcon = `<svg fill="currentColor" class="main-contextMenu-menuItemIcon" stroke="None" height="16px" width="16px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" stroke-width="0.75" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 228.403 228.403" xml:space="preserve">
<path d="M215.428,73.112h-79.797l-12.998-56.41H12.977C5.821,16.701,0,22.523,0,29.678v112.637c0,7.155,5.821,12.977,12.977,12.977
	h79.794l12.999,56.41h109.659c7.154,0,12.975-5.821,12.975-12.977V86.088C228.403,78.933,222.583,73.112,215.428,73.112z
	 M15,140.291V31.701h95.696l25.022,108.59H15z M108.164,155.291h28.195l-21.134,30.643L108.164,155.291z M213.403,196.701H126.02
	l16.195-23.481l2.458,4.004c9.801-6.018,17.538-13.048,23.646-20.203l18.985,19.366l7.856-7.701l-20.103-20.506
	c8.455-12.449,12.418-24.163,14.078-30.381h12.897v-11h-27.322v-6.555h-11v6.555h-20.317l-4.306-18.688h74.314V196.701z
	 M154.565,155.291h0.003l-3.705-16.078l9.689,9.883c-1.989,2.39-4.18,4.765-6.588,7.089l0.611-0.887L154.565,155.291z
	 M154.44,127.148l-5.186,5.084l-3.326-14.433h31.73c-1.684,5.371-4.87,13.541-10.514,22.309L154.44,127.148z M67.831,78.495h37.074
	v7.5c0,20.442-16.631,37.074-37.074,37.074s-37.074-16.632-37.074-37.074c0-20.442,16.631-37.073,37.074-37.073
	c8.261,0,16.077,2.658,22.603,7.686l-9.155,11.883c-3.878-2.989-8.528-4.568-13.448-4.568c-12.171,0-22.074,9.902-22.074,22.073
	c0,12.172,9.902,22.074,22.074,22.074c9.539,0,17.685-6.084,20.762-14.574H67.831V78.495z"/>
</svg>`;
*/

	const context = new ContextMenu.Item(
		"Translate",
		translateSongTitle, 
		shouldDisplayContextMenu,
		statsIcon
	);
	context.register();

  
  const widget = new Spicetify.Playbar.Widget(
    "Translate",
    statsIcon,
    translateSongContextless,
    false,
    false 
  );

  widget.register();

}
)();