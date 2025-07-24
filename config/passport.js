const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('../config/prisma');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/google/callback'
}, 
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await prisma.user.findUnique({
            where: { email: profile.emails[0].value }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    picture: profile.photos[0].value,
                    provider: 'google',
                    providerId: profile.id,
                }
            });
        }
        // console.log('Google Profile:', profile);
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;
