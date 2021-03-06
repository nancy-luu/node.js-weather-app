const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000 

// Define Paths For Express Config:
const publicDirectoryPath = path.join(__dirname, '../public')
// customizing hbs path for views 
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup Handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup Static Directory To Serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    // render one of our views, express is configured to use the view engine hbs 
    res.render('index', {
        title: 'Weather',
        name: 'Nancy Pantz'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me:',
        name: 'Nancy Pantz'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'To find help - follow these links:',
        title: 'Help',
        name: 'Nancy Pantz'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address..'
        })
    }

    geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {
        // const {longitude, latitude, location} = data
        if (error) {
            return res.send({ error })
        }
    
        // second asynchronous operation that has access to final data
        // utilize the response back from geocode for lat and lon
        forecast(longitude, latitude, (error, forecastData) => {
            if (error) {
                return console.log({ error })
            }
    
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res)=> {
    res.render( 'errorpage', {
        title: '404',
        name: 'Nancy Pantz',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('errorpage', { 
        title: '404',
        name: 'Nancy Pantz',
        errorMessage: 'Page not found.'
    })
})

// start server
app.listen(port, () => {
    console.log('Server is up on port ' +  port)
})
