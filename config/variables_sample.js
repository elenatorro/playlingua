module.exports = {
  environment: 'development',

  passport: {
    'facebook': {
      'FACEBOOK_APP_ID':     '',
      'FACEBOOK_APP_SECRET': '',
      'CALLBACK_URL':        ''
    },
    'google': {
      'GOOGLE_CONSUMER_KEY':    '',
      'GOOGLE_CONSUMER_SECRET': '',
      'GOOGLE_CALLBACK_URL':    ''
    },
    'twitter': {
      'TWITTER_CONSUMER_KEY':    '',
      'TWITTER_CONSUMER_SECRET': '',
      'TWITTER_CALLBACK_URL':    ''
    },
    'localStrategy': {
      usernameField:    '',
      passReqToCallback: true
    }
  },
  development: {
    'database':   'mongodb://localhost/yourdbname',
    'publicPath': 'app',
    'path':       '/app',
    'views':      '/app',
    'port':       2000
  },

  production: {
    'database':   'mongodb://heroku_...'
    'publicPath': 'public',
    'path':       '/public',
    'views':      '/public/views',

  },
  url:    '',
  secret: ''
}
