const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');


const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

const updateAccount = (id) => {
    let facture = 0;
    let paiement = 0;

    database.query("SELECT * FROM transactions WHERE id_customer = ?", id, (err, rows) => {
        if (!err) {
            rows.map(el => {
                if (el.amount > 0) {
                    facture += el.amount;
                } else {
                    paiement += el.amount;
                }
            })
            database.query('UPDATE customers SET facture = ' + facture + ', paiement = ' + paiement + ' WHERE id = ? ', id, (err, rows) => {
                if (!err) {
                    return 1;
                } else {
                    return 0;
                }
            })
        } else {
            console.log('probleme');
        }
    })
}

console.log('server running');


app.get('/api/customers', (req, res) => {
    database.query("SELECT * FROM customers WHERE id_user=?",[req.body.id] , (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

app.get('/api/customers/:name', (req, res) => {
    database.query("SELECT * FROM customers WHERE name = ?", req.params.name, (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

app.get('/api/transactions', (req, res) => {
    database.query("SELECT transactions.id, CAST(`date` AS DATE) AS date, name, designation, amount FROM transactions INNER JOIN customers ON id_customer = customers.id ORDER BY date DESC", (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
})

app.get('/api/transactions/:id', (req, res) => {
    database.query("SELECT * FROM transactions WHERE id_customer=? ORDER BY date DESC", req.params.id, (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
})

app.post('/api/register', (req, res) => {
    console.log(req.body);
    database.query('INSERT INTO users (username, email, password) VALUE (?,?,?)', [req.body.usernameRegistration, req.body.emailRegistration, req.body.passwordRegistration], (err, result) => {
        if(err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    })
})

app.post('/api/login', (req, res) => {
    database.query("SELECT * FROM users WHERE username=? AND password=?",
    [req.body.usernameLogin, req.body.passwordLogin],
    (err, result) => {
        if(err) {
            res.send({err: err});
        }
        
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            console.log(result);
            res.send({ message: "Wrong username/password combination !" });
        }
    })
})



app.post('/api/customers', (req, res) => {
    database.query("INSERT INTO customers (name, email) VALUES ('" + req.body.name + "','" + req.body.email + "')", (err, rows) => {
        if (!err) {
            res.send(req.body.name + ' créé avec succés !');
        } else {
            console.log(err);
        }
    });
})

app.post('/api/transactions', (req, res) => {
    database.query("INSERT INTO transactions (date, id_customer, designation, amount) VALUES ('" + req.body.date + "','" + req.body.customer + "','" + req.body.designation + "','" + req.body.amount + "')", (err, rows) => {
        if (!err) {
            const updateSuccess = updateAccount(req.body.customer);
            if (updateSuccess === 0) {
                res.status(201).json({
                    message: 'Transaction create but customer dont update !'
                });
            } else {
                res.status(201).json({
                    message: 'Transaction create.'
                });
            }
        } else {
            console.log(err);
        }
    });
})


app.delete('/api/customers', (req, res) => {
    database.query("DELETE FROM customers WHERE name= ?", [req.body.name], (err, rows, fields) => {
        if (!err) {
            res.send('Deleted successfully.');
        } else {
            console.log(err)
        }
    })
})

app.delete('/api/transactions', (req, res) => {
    database.query("SELECT customers.id FROM customers INNER JOIN transactions ON customers.id = transactions.id_customer AND transactions.id = ?", [req.body.id], (err, rows, fields) => {
        if (!err) {
            const idCustomer = rows[0].id;
            database.query("DELETE FROM transactions WHERE id= ?", [req.body.id], (err, rows, fields) => {
                if (!err) {
                    res.status(200).json({
                        message: 'Deleted successfully'
                    });
                    updateAccount(idCustomer);
                } else {
                    console.log(err)
                    res.status(400).json({
                        err
                    })
                }
            })
        } else {
            console.log(err)
        }
    })
})





app.listen(process.env.DB_PORT);