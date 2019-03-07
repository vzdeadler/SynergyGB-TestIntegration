const express = require('express');
const router = express.Router();
const request = require('request');
const mysql = require('mysql');
const sha1 = require('sha1');
const properties = require('properties');

const url = 'https://jsonplaceholder.typicode.com/albums';

//GET ADMISION
router.get('/', (req, res, next) => {

  request({
    url: url,
    json: true
  }, function (error, response, body) {
      if (!error && response.statusCode === 200) {

          //Adding hash field.
          response.body.forEach(function(elem){
            elem.hash = sha1(elem.title);
          });

          //Returning a response.
          res.status(200).write(JSON.stringify(response.body, null, 4));
      }else{
          res.status(500).json({
              'error': 'Internal server error'
          });
      }
  });
    
});

//POST ADMISION
router.post('/', (req, res, next) => {

    if(!req.body.nombre || !req.body.apellido || !req.body.correo){
      res.status(400).json({
        'error': 'Bad request (missing fields)'
      });
    }
    //Getting properties from the file database.properties
    properties.parse ("database.properties", { path: true }, function (error, obj){
        if (error) return console.error (error);
      
        let db = mysql.createConnection(obj);
        console.log(obj);

        //Connecting to db..
        db.connect(function(err) {
            if (err) throw err;

            console.log("Connected into the db!");

            //Building the query..
            var sql_insert = "INSERT INTO persona (nombre, apellido, correo) VALUES ('" + req.body.nombre + "', '" + req.body.apellido + "', '" + req.body.correo + "')";
            
            //Applying the query..
            db.query(sql_insert, function (err, result) {
                if (err) {
                    res.status(500).json({error: err});
                    throw err;
                }

                console.log("Record inserted..");

                res.status(200).json({
                  'message': 'Record inserted..'
                });
              
            });

        });

    });

})

module.exports = router;