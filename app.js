const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const csurf = require('csurf');

const app = express();
const port = process.env.PORT || 3000;
const csrfProtection = csurf({cookie: false});

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

// Express session
app.use(session({
  secret: 'fjei;awhg;hewro',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.json());
const parseForm = bodyParser.urlencoded({extended: false});
app.use(parseForm);
app.use(logger('dev'));

// a route that does not have csrf applied
// used to test request headers

app.post('/open', (req, res) => {
	res.status(200).json({
		requestHeaders: req.headers
	});
})


// once express session and body parser are used,
// you can use the csrfProtection module
app.use(csrfProtection);

app.use((req, res, next) => {
	if (req.body) {
		console.log(req.body);
	}
	next();
});

app.get('/', (req, res) => {
	res.render('index', {csrfToken: req.csrfToken()});
});

app.post('/', (req, res) => {
	res.status(200).json({
		status: "Success!",
		message: "Good CSRF token!"
	});
});

// error handler
// app.use(function (err, req, res, next) {
//   if (err.code !== 'EBADCSRFTOKEN') return next(err)

//   // handle CSRF token errors here
//   res.status(403)
//   res.send('bad csrf')
// });

app.listen(port, () => {
	console.log('Server started on port ' + port);
});