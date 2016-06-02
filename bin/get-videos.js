var request = require('request');
var _ = require('lodash');
var pg = require('pg');
pg.defaults.ssl = true;

var config = {
};

var channels = {
    'UCFKE7WVJfvaHW5q283SxchA': 'Yoga With Adriene',
    'UCa5OCJkZgtbIkaB1sA86XVA': 'Tara Stiles',
    'UCBINFWq52ShSgUFEoynfSwg': 'Pop Sugar Fitness'
};

var channelPromises = []

_.forOwn(channels, function(channelName, channelId) {
    channelPromises.push(getVideos(channelId)
        .then(function(items) {
            var promises = _.map(items, function(item) {
                item = _.merge({channelName: channelName}, item);
                return getVideoDetails(item);
            });

            return Promise.all(promises);
        })
//        .then(function(results) {
//            console.log('results!', results);
//        })
        .catch(function(err){
            console.log('uh oh', err);
        }));
});

Promise.all(channelPromises)
    .then(function(results) {
        var videos = _.flattenDeep(results);
        console.log('videos!', videos);
    });

function getVideoDetails(videoItem) {
    var url = 'https://www.googleapis.com/youtube/v3/videos';

    return new Promise(function(resolve, reject) {
        request({
            url: url,
            json: true,
            qs: {
                key: apiKey,
                part: 'contentDetails',
                id: videoItem.id
            }
        }, function(error, response, body) {
            if (error) {
                return reject(error);
            }

            return resolve(_.map(body.items, function(item) {
                return _.merge({
                    duration: item.contentDetails.duration
                }, videoItem);
            }));
        });

    });
}

function getVideos(channelId) {
    var url = 'https://www.googleapis.com/youtube/v3/search';
    return new Promise(function(resolve, reject) {
        request({
            url: url,
            json: true,
            qs: {
                key: apiKey,
                part: 'snippet',
                channelId: channelId,
                order: 'date',
                type: 'video',
                videoDefinition: 'high',
                maxResults: 10,
                q: 'yoga'
            }
        }, function(error, response, body) {
            if (error) {
                return reject(error);
            }

            return resolve(_.map(body.items, function(item) {
                return {
                    id: item.id.videoId,
                    publishedAt: item.snippet.publishedAt,
                    channelId: item.snippet.channelId,
                    title: item.snippet.title,
                    description: item.snippet.description
                };
            }));
        });

    });
}


function writeData(posts) {
    var pool = new pg.Pool(config);

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        _.forEach(posts, function(posts) {
            client.query("INSERT INTO videos(id, title, description, publishDate, channelId, ts) values($1, $2, $3, $4, $5, now())", [post.thumbnail, post.link, "yogaeverydamnday"]);
    });
});
}