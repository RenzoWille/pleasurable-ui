import express from 'express'
import { Liquid } from 'liquidjs'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const engine = new Liquid()
app.engine('liquid', engine.express())
app.set('views', './views')

// HOME ROUTES

app.get('/', async (req, res) => {
  try {
    const apiResponse = await fetch('https://fdnd-agency.directus.app/items/fabrique_art_objects')
    const apiResponseJSON = await apiResponse.json()

    res.render('index.liquid', {
      artworkData: apiResponseJSON.data
    })
  } catch (error) {
    console.error('Fout bij ophalen van data:', error)
    res.status(500).send('Er ging iets mis bij het laden van de homepage.')
  }
})

app.get('/en', async (req, res) => {
  const response = await fetch('https://fdnd-agency.directus.app/items/fabrique_art_objects')
  const json = await response.json()

  res.render('index.liquid', { artworkData: json.data })
})

app.get('/ar', async (req, res) => {
  const response = await fetch('https://fdnd-agency.directus.app/items/fabrique_art_objects')
  const json = await response.json()

  res.render('index-ar.liquid', { artwork: json.data })
})

// DETAIL ROUTES

app.get('/object/:id/', async (req, res) => {
  const id = req.params.id
  const response = await fetch(`https://fdnd-agency.directus.app/items/fabrique_art_objects/${id}?fields=title,image,summary,objectNumber,site,displayDate,artist,materials,recordType`)
  const json = await response.json()

  res.render('details.liquid', { object: json.data })
})

app.get('/:lang/details/:id', async (req, res) => {
  const artworkURL = `https://fdnd-agency.directus.app/items/fabrique_art_objects?filter[id][_eq]=${req.params.id}&fields=*,fabrique_users_fabrique_art_objects.*`
  const artworkFetch = await fetch(artworkURL)
  const artworkJSON = await artworkFetch.json()

  const likedURL = `https://fdnd-agency.directus.app/items/fabrique_users_fabrique_art_objects?filter={"fabrique_users_id":3}`
  const likedFetch = await fetch(likedURL)
  const likedJSON = await likedFetch.json()

  res.render('details.liquid', {
    artworkData: artworkJSON.data,
    likedArtworks: likedJSON.data,
    lang: req.params.lang
  })
})

//  TICKETS PAGE
app.get('/tickets', async (req, res) => {
  const museums = [
    {
      id: 1,
      name: "National Museum of Qatar",
      // image: "/assets/nmoq.jpg",
      description: "Your ticket covers admission to the museum and all exhibitions.",
      exhibitions: [
        "Ultraleggera: A Design Journey...",
        "LATINOAMERICANO | Modern and Contemporary Art..."
      ],
      tickets: [
        { label: "Adult Non-resident of Qatar", price: 25 },
        { label: "Child (16 and under)", price: 0 },
        { label: "Student Resident of Qatar", price: 0 }
      ]
    }
  ]

  res.render('tickets.liquid', { museums })
})

// LIKE & UNLIKE

app.post('/like-artwork/:id', async (req, res) => {
  const postUrl = `https://fdnd-agency.directus.app/items/fabrique_users_fabrique_art_objects?filter={"fabrique_users_id":1,"fabrique_art_objects_id":[id][_eq]=${req.params.id}`

  await fetch(postUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify({
    //   fabrique_users_id: 3,
    //   fabrique_art_objects_id: req.params.id
    // }),
  })

  res.redirect(303, '/details/' + req.params.id)
})

app.post('/unlike-artwork/:id', async (req, res) => {
  const liked = await fetch(`https://fdnd-agency.directus.app/items/fabrique_users_fabrique_art_objects?filter={"fabrique_users_id":3,"fabrique_art_objects_id":${req.params.id}}`)
  const likedJSON = await liked.json()
  const likedID = likedJSON.data[0].id

  const deleteURL = `https://fdnd-agency.directus.app/items/fabrique_users_fabrique_art_objects/${likedID}`
  await fetch(deleteURL, { method: 'DELETE' })

  res.redirect(303, '/details/' + req.params.id)
})

// SERVER CONFIG

app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
  console.log(`✅ Server running at http://localhost:${app.get('port')}/`)
})
