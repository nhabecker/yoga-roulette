var request = require('request');
var _ = require('lodash');
var fs = require('fs');
var requestUri = 'https://api.instagram.com/v1/tags/yogaeverydamnday/media/recent';
var accessToken = '16168781.97584da.976aedb0dc3d4d1084d444e05657b4cd';
var popularPosts = [];

recursiveCallInstagram(requestUri + '?access_token=' + accessToken).then((pp) => {
    writeFile(processPopularPosts());
}).catch((err) => {
    console.log('err', err);
});

function recursiveCallInstagram(url) {
    return callInstagram(url).then((data) => {
        popularPosts = popularPosts.concat(data.posts);
        if (popularPosts.length < 10 && data.nextUrl) {
            return recursiveCallInstagram(data.nextUrl);
        }
    });
}

function callInstagram(url) {
    return new Promise(function(resolve, reject) {
        request({
            url: url,
            json: true
        }, function(error, response, body) {
            if (error) {
                return reject(error);
            }
            var posts = _.filter(body.data, function(post) {
                return post.likes.count > 100;
            });
            return resolve({posts: posts, nextUrl: body.pagination.next_url});
        });

    });
}

function processPopularPosts() {
    return _.map(popularPosts, function(post) {
        return {
            link: post.link,
            thumbnail: post.images.thumbnail.url
        };
    });
}

function writeFile(data) {
    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) {
            return console.log('Error:', err);
        }
        console.log('File saved');
    })
}