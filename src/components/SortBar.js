var React = require('react');
var SortBarItem= require('./SortBarItem');

var SortBar = React.createClass({
  viewChanged: function(view) {
    this.props.viewChanged(view)
  },
  render: function() {
    return (
      <div className="sort row">
        <div className="col-sm-12">
          <ul className="nav nav-pills">
            <SortBarItem view="latest" title="Latest Releases" currentView={this.props.currentView} viewChanged={this.props.viewChanged} />
            <SortBarItem view="alpha" title="A-Z" currentView={this.props.currentView} viewChanged={this.props.viewChanged} />
            <SortBarItem view="map" title="Where to Watch" currentView={this.props.currentView} viewChanged={this.props.viewChanged} />
          </ul>
        </div>
      </div>
    )
  }
})

module.exports = SortBar;

//<li className="active"><a href="#" onClick={() => this.viewChanged('latest')}>Latest Releases</a></li>
//<li><a href="#" onClick={() => this.viewChanged('alpha')}>A-Z</a></li>
//<li><a href="#" onClick={() => this.viewChanged('map')}>Where to Watch</a></li>
//<li className="nav-text pull-right">{this.props.movieCount} movies</li>
