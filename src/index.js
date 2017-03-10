// React
var React = require('react')
var ReactDOM = require('react-dom')

// Google Maps
var ReactGMaps = require('react-gmaps')
var {Gmaps, Marker} = ReactGMaps

// Movie data
var movieData = require('./data/movies.json')
var theatres = require('./data/theatres.json')

// Components
var Header = require('./components/Header')
var MovieDetails = require('./components/MovieDetails')
var MovieList = require('./components/MovieList')
var NoCurrentMovie = require('./components/NoCurrentMovie')
var SortBar = require('./components/SortBar')

// There should really be some JSON-formatted data in movies.json, instead of an empty array.
// I started writing this command to extract the data from the learn-sql workspace
// on C9, but it's not done yet :) You must have the csvtojson command installed on your
// C9 workspace for this to work.
// npm install -g csvtojson
// sqlite3 -csv -header movies.sqlite3 'select "imdbID" as id, "title" from movies' | csvtojson --maxRowLength=0 > movies.json

// Firebase configuration
var Rebase = require('re-base')
var base = Rebase.createClass({
  apiKey: "AIzaSyBL_j6UXmE49PxnzxCp4wj9wjc6dQgZRbo",   // replace with your Firebase application's API key
  databaseURL: "https://buyflixfinal-62f93.firebaseio.com/", // replace with your Firebase application's database URL
})


var App = React.createClass({
  movieClicked: function(movie) {
    this.setState({
      currentMovie: movie
    })
  },
  movieWatched: function(movie) {
    var existingMovies = this.state.movies
    var moviesWithWatchedMovieRemoved = existingMovies.filter(function(existingMovie) {
      return existingMovie.id !== movie.id
    })
    this.setState({
      movies: moviesWithWatchedMovieRemoved,
      currentMovie: null
    })
  },
  resetMovieListClicked: function() {
    this.setState({
      movies: movieData.sort(this.movieCompareByReleased)
    })

  },
  viewChanged: function(view) {
    // View is either "latest" (movies sorted by release), "alpha" (movies
    // sorted A-Z), or "map" (the data visualized)
    // We should probably do the sorting and setting of movies in state here.
    // You should really look at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    var sortmovies = this.state.movies
    if (view==='alpha') {
      sortmovies = movieData.sort(this.movieCompareByTitle)
    } else if (view==='latest') {
      sortmovies = movieData.sort(this.movieCompareByReleased)
    }

    this.setState({
      currentView: view,
      movies: sortmovies
    })
  },
  renderMovieDetails: function() {
    if (this.state.currentMovie == null) {
      return <NoCurrentMovie resetMovieListClicked={this.resetMovieListClicked} />
    } else {
      return <MovieDetails movie={this.state.currentMovie}
                           movieWatched={this.movieWatched} />
    }
  },
  renderMainSection: function() {
    if (this.state.currentView === 'map') {
      return (
              <div className="map col-sm-12">
                <Gmaps width={'100%'}
                       height={'480px'}
                       lat={'41.9021988'}
                       lng={'-87.6285782'}
                       zoom={11}
                       loadingMessage={'Movie theaters soon...'}
                       params={{v: '3.exp', key: 'AIzaSyB3p_xQIXsFMDGLYNEiVkgW5fsVSUOd01c'}}>
                       {theatres.map(function(theatres) {
                       return <Marker
                          lat={theatres.lat}
                          lng={theatres.long}/>
                        })}
                </Gmaps>
              </div>
            )
          }
      else {
      return (
        <div>
          <MovieList movies={this.state.movies} movieClicked={this.movieClicked} />
          {this.renderMovieDetails()}
        </div>
      )
    }
  },
  movieCompareByTitle: function(movieA, movieB) {
    if (movieA.title < movieB.title) {
      return -1
    } else if (movieA.title > movieB.title) {
      return 1
    } else {
      return 0
    }
  },
  movieCompareByReleased: function(movieA, movieB) {
    if (movieA.released > movieB.released) {
      return -1
    } else if (movieA.released < movieB.released) {
      return 1
    } else {
      return 0
    }
  },
  getInitialState: function() {
    return {
      movies: movieData.sort(this.movieCompareByReleased),
      currentMovie: null,
      currentView: 'latest'
    }
  },
  componentDidMount: function() {
    // We'll need to enter our Firebase configuration at the top of this file and
    // un-comment this to make the Firebase database work
    base.syncState('/movies', { context: this, state: 'movies', asArray: true })
  },
  render: function() {
    return (
      <div>
        <Header currentUser={this.state.currentUser} />
        <SortBar movieCount={this.state.movies.length} currentView={this.state.currentView} viewChanged={this.viewChanged} />
        <div className="main row">
          {this.renderMainSection()}
        </div>
      </div>
    )
  }
})

ReactDOM.render(<App />, document.getElementById("app"))
