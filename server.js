// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// GET routes



// Home route
app.get('/', async (req, res) => {
  try {
    const apiResponse = await fetch('https://fdnd-agency.directus.app/items/fabrique_art_objects');
    const apiResponseJSON = await apiResponse.json();

    res.render('index.liquid', {
      artworkData: apiResponseJSON.data
    });
  } catch (error) {
    console.error('Fout bij ophalen van data:', error);
    res.status(500).send('Er ging iets mis bij het laden van de homepage.');
  }
});



app.get('/en', async function (request, response) {

  const artworkURL = 'https://fdnd-agency.directus.app/items/fabrique_art_objects'
  const artworkFetch = await fetch(artworkURL)

  const artworkJSON = await artworkFetch.json()

  response.render('index.liquid', { artworkData: artworkJSON.data })

})

// Route voor de homepagina in het arabisch
app.get('/ar', async function (request, response) {
  const apiResponse = await fetch('https://fdnd-agency.directus.app/items/fabrique_art_objects')
  const apiResponseJSON = await apiResponse.json();

  response.render("index-ar.liquid", {
      artwork: apiResponseJSON.data,
   })
})

// Detail-page
app.get('/details/:id', async function (request, response) {
  const artworkId = request.params.id;
  const apiResponse = await fetch(`https://fdnd-agency.directus.app/items/fabrique_art_objects/${artworkId}?fields=title,image,summary,objectNumber,site,displayDate,artist,materials,recordType`
);

  const apiResponseJSON = await apiResponse.json();

  response.render('details.liquid', {object: apiResponseJSON.data});
})

app.get('/:lang/acquisition', async function (request, response) {
    const apiResponse = await fetch('https://fdnd-agency.directus.app/items/fabrique_art_objects')
    const apiResponseJSON = await apiResponse.json()
    const messageResponse = await fetch("https://fdnd-agency.directus.app/items/fabrique_messages/?filter={%22for%22:%20{%22_contains%22:%20%22Karima_%22}}")
    const messageResponseJSON = await messageResponse.json(); // Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
    const langId = request.params.lang; //parameter voor de language switch
    
    response.render("acquisition.liquid", { 
      artworkData: apiResponseJSON.data, 
      messages: messageResponseJSON.data,
      id: 'karima-form',
      lang: langId
    })
  })

  app.get('/:lang/succes', async function (request, response) {
    const apiResponse = await fetch('https://fdnd-agency.directus.app/items/fabrique_art_objects')
    const apiResponseJSON = await apiResponse.json()
    const langId = request.params.lang; 

    response.render("succes.liquid", { 
      artworkData: apiResponseJSON.data,
      lang: langId
     })
  })

  
app.get('/tickets', async (req, res) => {
  // Mock data for now; replace with API calls as needed
  const museums = [
    {
      id: 1,
      name: "National Museum of Qatar",
      image: "/assets/nmoq.jpg",
      description: "Your ticket covers admission to the museum and all exhibitions.",
      exhibitions: [
        "Ultraleggera: A Design Journey...",
        "LATINOAMERICANO | Modern and Contemporary Art..."
      ],
      tickets: [
        { label: "Adult Non-resident of Qatar", price: 25 },
        { label: "Child (16 and under)",      price:  0 },
        { label: "Student Resident of Qatar",  price:  0 }
      ]
    }

  ]

  res.render('tickets.liquid', { museums })
})


//Route naar admin
app.get('/admin', async function (request, response){

  // Haal gelikete artworks op van gebruiker met id 5 //verander id terug naar 3
  const likedArtworksURL = `https://fdnd-agency.directus.app/items/fabrique_users_fabrique_art_objects?filter={"fabrique_users_id":5}&fields=id,fabrique_art_objects_id.id,fabrique_art_objects_id.title,fabrique_art_objects_id.artist,fabrique_art_objects_id.image`
  const likedArtworksFetch = await fetch(likedArtworksURL)
  app.get('/admin', async function (request, response){
    
  response.render('admin.liquid', {
    likedArtworks: likedArtworksJSON.data
    })
  })
});

// POST for like

app.post('/like-artwork/:id', async function (request, response) {
  // console.log("we hebben een post " + request.params.id)

  // Hier wil je een fetch naar Directus waarmee je een like oplsaat die hoort bij een artwork
  const postLikeUrl = `https://fdnd-agency.directus.app/items/fabrique_users_fabrique_art_objects?filter={"fabrique_users_id":1,"fabrique_art_objects_id":[id][_eq]=${request.params.id}`
//   console.log("postLikeUrl " + postLikeUrl)

  // Post naar database
  await fetch(postLikeUrl,{
    method: 'POST',
    body: JSON.stringify({
      "fabrique_users_id": 5,
      "fabrique_art_objects_id": request.params.id

    }),
    headers: {
      'Content-Type': 'application/json',
    },

  })

  response.redirect(303, '/details/'+request.params.id)
})

// DELETE for like

app.post('/unlike-artwork/:id', async function (request, response) {
  const likedArtobject = await fetch(`https://fdnd-agency.directus.app/items/fabrique_users_fabrique_art_objects?filter={"fabrique_users_id":3,"fabrique_art_objects_id":${request.params.id}}`)
  const likedArtobjectResponseJSON = await likedArtobject.json()
  const likedArtobjectID = likedArtobjectResponseJSON.data[0].id
  console.log(likedArtobjectID)

  const deleteUrl = `https://fdnd-agency.directus.app/items/fabrique_users_fabrique_art_objects/${likedArtobjectID}`;

  const data = await fetch(deleteUrl);
  const result = await data.json();

  console.log("Hier is een like verwijderd met id nummer " + request.params.id)

  await fetch(deleteUrl, {
    method: 'DELETE',
  });

  // Redirect terug naar de detailpagina
  response.redirect(303, '/details/' + request.params.id);
});

//POST routes
let forms = [] //array voor het opslaan van formulieren

app.post('/acquisition', async function (request, response) {

    await fetch("https://fdnd-agency.directus.app/items/fabrique_messages", {
      method: "POST",
      body: JSON.stringify({ //gegevens die  naar de server wordt gestuurd, omzetten in een JSON-string.
        for: "Karima_" + request.body.name,  // De naam van de gebruiker, toegevoegd aan een vaste string "Karima_" voor het alleen weergeven van mijn posts.
        from: request.body.email,  // E-mail van de gebruiker
        text: request.body.description,  // De beschrijving die door de gebruiker is ingevoerd in het formulier
      }),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }, //request met post, met headers geef je aan wat er is meegegeven, je geeft informatie over wat je in de request heb meegegeven.
    });

    response.redirect(303, '/en/succesfull') //Na het versturen van de gegevens naar de API wordt de gebruiker doorgestuurd naar de pagina /succesfull

  })

  app.post('/ar/acquisition', async function (request, response) {

    await fetch("https://fdnd-agency.directus.app/items/fabrique_messages", {
      method: "POST",
      body: JSON.stringify({
        for: "Karima_" + request.body.name,
        from: request.body.email,
        text: request.body.description,
      }),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    });

    response.redirect(303, '/ar/succesfull')
  })


// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}/\n\nSucces deze sprint. En maak mooie dingen! 🙂`)
})
