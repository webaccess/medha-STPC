const strapi = require("strapi");

before(function(done) {
  strapi()
    .start({}, function(err) {
      if (err) {
        return done(err);
      }

      done(err, strapi);
    })
    .then(don => {
      done();
    })
    .catch(don => {
      done();
    });
});

after(function(done) {
  strapi().stop(done());
});
