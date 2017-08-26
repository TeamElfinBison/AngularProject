/* globals __dirname */
const path = require('path');
const express = require('express');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('../config');

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const configApp = (app, data) => {
    app.use(express.static(path.join(__dirname, '../../dist')));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(cookieParser());
    app.use(session({
        store: new MongoStore({ url: config.DB_CONNECTION_STRING }),
        saveUninitialized: true,
        resave: false,
        secret: config.APP_SECRET,
    }));

    const options = {};
    options.jwtFromRequest = ExtractJwt.fromHeader('token');
    options.secretOrKey = config.APP_SECRET;

    passport.use(new JwtStrategy(options, (jwtPayload, done) => {
        data
            .findById(jwtPayload._id)
            .then((user) => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch((err) => {
                return done(err, false);
            });
    }));

    passport.serializeUser((user, done) => {
        if (user) {
            return done(null, user._id);
        }

        return done(null, null);
    });

    passport.deserializeUser((id, done) => {
        data
            .findById(id)
            .then((user) => {
                if (!user) {
                    return done(null, false);
                }

                return done(null, user);
            })
            .catch((err) => {
                return done(err, false);
            });
    });
};

module.exports = configApp;
