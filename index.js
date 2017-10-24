const express= require('express')
const passport =require('passport')
const googleStrategy =require('passport-google-oauth20')



const app=express()

passport.use(
	new googleStrategy({
	// options for stategy
		callbackURL:'/auth/google/redirect',
		clientID:'446286956044-pu15fdv4s6e31bpku62a0p79at34rnt9.apps.googleusercontent.com',
		clientSecret:'ACGx5ksvllE4edxiDxz1VNto'
	},(accessToken,refreshToken,profile,done)=>{
			
				// passport callback function
				return done(null, profile);
	})
)



var session = require('express-session');
app.use(session({secret: "enter custom sessions secret here"}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  // placeholder for custom user serialization
  // null is for errors
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // placeholder for custom user deserialization.
  // maybe you are getoing to get the user from mongo by id?
  // null is for errors
  done(null, user);
});


app.get('/', function (req, res) {
  var html = "<ul>\
    <li><a href='/auth/google'>google</a></li>\
    <li><a href='/logout'>logout</a></li>\
  </ul>";
  // dump the user for debugging
  if (req.isAuthenticated()) {
    html += "<p>authenticated as user:</p>"
    html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
  }
  res.send(html);
});

app.get('/auth/google',passport.authenticate('google',{
	scope:['profile']
}))

app.get('/auth/google/redirect',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//  Use this route middleware on any resource that needs to be protected.  If
//  the request is authenticated (typically via a persistent login session),
//  the request will proceed.  Otherwise, the user will be redirected to the
//  login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

app.get('/protected', ensureAuthenticated, function(req, res) {
  res.send("acess granted");
});


console.log('Server is running on port  5000')
app.listen(5000)