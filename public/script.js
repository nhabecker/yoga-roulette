var MyVideo,
    MyVideoList,
    workouts,
    sortOrder = 'asc';

ReactDOM.render(
    React.createElement(
        "a",
        { className: "navbar-brand", onClick: showRandom, href: "#" },
        "Yoga Roulette"
    ),
    document.getElementById('nav-header')
);

ReactDOM.render(
    React.createElement(
        "a",
        { onClick: showRandom, href: "#" },
        "Random"
    ),
    document.getElementById('nav-random')
);

ReactDOM.render(
    React.createElement(
        "a",
        { onClick: showWhy, href: "#" },
        "What?"
    ),
    document.getElementById('nav-why')
);

ReactDOM.render(
    React.createElement(
        "a",
        { onClick: showList, href: "#" },
        "The List"
    ),
    document.getElementById('nav-list')
);

MyVideo = React.createClass({
  render: function() {
    return React.createElement(
        "div",
        { className: "video-container" },
        React.createElement(
            "iframe",
            { frameBorder: 0, width: 560, height: 315, src: this.props.workout.embedUrl, allowFullScreen: true }
        )
    );
  }
});

MyVideoList = React.createClass({
  render: function() {
    var videoNodes = this.props.data.map(function(video) {
      return React.createElement(
          "tr",
          {
            key: video.shareUrl,
            data: video,
            onClick: function() {
              showWorkout(video);
            }
          },
          React.createElement("td", {}, video.title),
          React.createElement("td", {}, video.provider),
          React.createElement("td", {}, video.minutes)
      );
    });
    return React.createElement(
        "div",
        {},
        (<div className="panel panel-heading"><h1>The Videos</h1></div>),
        React.createElement(
            "table",
            { className: 'table table-hover'},
            React.createElement(
                'thead',
                {},
                React.createElement(
                    'tr',
                    {},
                    React.createElement('th', { onClick: function() { sortByColumn(['title']);  } }, 'Workout'),
                    React.createElement('th', { onClick: function() { sortByColumn(['provider', 'title']); } }, 'Instructor'),
                    React.createElement('th', { onClick: function() { sortByColumn(['minutes', 'title']); } }, 'Minutes')
                )
            ),
            React.createElement('tbody', {}, videoNodes)
        )
    );
  }
});

function showRandom() {
  showWorkout(_.sample(workouts));
}

function showWorkout(workout) {
  ReactDOM.render(
      React.createElement(MyVideo, { workout: workout }),
      document.getElementById('video')
  );
  window.scrollTo(0,0);
}

function showWhy() {
  ReactDOM.render(
      (
        <div>
          <div className="panel panel-heading">
            <h1>What is this?</h1>
          </div>
          <div className="panel-body">
            <p>I created Yoga Roulette so I can easily find a yoga workout to do at home without having to search through the YouTube.</p>
            <p>I also created it so I can play around with React and Firebase. (Sorry it's so basic.)</p>
            <p>If you have any suggestions (video recommendations or improvements to the site), <a href="http://twitter.com/nancyhabs">tweet at me</a>!</p>
          </div>
        </div>
      ),
      document.getElementById('video')
  );
}

function showList() {
  sortOrder = 'asc';
  showSortedWorkouts(['provider', 'title']);
}

function sortByColumn(sortKeys) {
  showSortedWorkouts(sortKeys);
  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
}

function showSortedWorkouts(sortKeys) {
  ReactDOM.render(
      React.createElement(MyVideoList, { data: _.sortByOrder(workouts, sortKeys, _.fill(Array(sortKeys.length), sortOrder)) }),
      document.getElementById('video')
  );
}

$.get("data/workouts.json", function(results) {
  workouts = results.workouts;
  showRandom();
}.bind(this));
