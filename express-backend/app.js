var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// const app = require('express')()
// const mongoose = require('mongoose')
// const url = "mongodb+srv://thanh:thanh@cluster0.ntvke.mongodb.net/mydb?retryWrites=true&w=majority"
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const cors = require('cors')
app.use(cors())

const { Sequelize, DataTypes, Model } = require('sequelize');
// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize(('postgres', process.env.POSTGRES_DB || "postgres"),(process.env.POSTGRES_USER || "postgres"), (process.env.POSTGRES_PASSWORD || "rmit"), {
    host: (process.env.PSQL_HOST || "localhost"),
    port: 5432,
    dialect: 'postgres'
});

const Singer = sequelize.define('Singer', {
    // Model attributes are defined here
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    songs: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: false
    }
}, {
    tableName: 'singer',
    // freezeTableName: true, // Model tableName will be the same as the model name
    timestamps: false,
    underscored: true
});

app.listen(4001, function () {
    console.log("Hello");
    init_db()
});

const init_db = async () => {
    await Singer.sync({ force: true });
    console.log("The table for the Singer model was just (re)created!");
}

app.get('/singers', async (req, res) => {
    try {
        const users = await Singer.findAll();
        res.send(JSON.stringify(users))
    } catch (err) {
        res.send(err)
    }
})

app.get('/singers/:_id', async (req, res) => {
    try {
        const singer = await Singer.findByPk(req.params._id );
        res.send(singer)
    } catch (err) {
        res.send(err)
    }
})

// Singer.create(body).then(function (newSinger) {
//     res.send(JSON.stringify(newSinger))
// }).catch(function (err) {
//     res.send(err)
// });

app.post('/singers', async (req, res) => {
    try {
        const body = req.body
        const newSinger = await Singer.create(body)
        res.send(JSON.stringify(newSinger))
    } catch (err) {
        res.send(err)
    }
})

app.put('/singers', async(req, res) => {
    try {
        const singer = await Singer.update(req.body, {
            where: {
                id: req.body['id']
            }
        });
        res.send(singer)
    } catch (err) {
        res.send(err)
    }
})

app.delete('/singers/delete/:_id', async (req, res) => {
    try {
        const r = await Singer.destroy({
            where: {
                id: req.params._id
            }
        });
        res.send("Delete " + req.params._id + " Result " + r)
    } catch (err) {
        res.send(err)
    }
})

app.get('/singers/search/:keyword', function (req, res) {
})

module.exports = app;
