

module.exports=function(express,pool){


    const apiRouter = express.Router();

    apiRouter.get('/', function(req, res) {
        res.json({ message: 'Dobro dosli na nas API!' });
    });


    apiRouter.route('/users').get(async function(req,res){

        try {

            let conn = await pool.getConnection();
            let rows = await conn.query('SELECT * FROM users');
            conn.release();
            res.json({ status: 'OK', users:rows });

        } catch (e){
            console.log(e);
            return res.json({"code" : 100, "status" : "Error with query"});

        }


    }).post(async function(req,res){

        const user = {
            username : req.body.username,
            password : req.body.password,
            email : req.body.email

        };

        try {

            let conn = await pool.getConnection();
            let q = await conn.query('INSERT INTO users SET ?', user);
            conn.release();
            res.json({ status: 'OK', insertId:q.insertId });

        } catch (e){
            console.log(e);
            res.json({ status: 'NOT OK' });
        }



    }).put(async function(req,res){

        const user = {
            username : req.body.username,
            password : req.body.password,
            email : req.body.email

        };

        console.log(req.body);

        try {

            let conn = await pool.getConnection();
            let q = await conn.query('UPDATE users SET ? WHERE id = ?', [user,req.body.id]);
            conn.release();
            res.json({ status: 'OK', changedRows:q.changedRows });
            console.log(q);

        } catch (e){
            res.json({ status: 'NOT OK' });
        }

    }).delete(async function(req,res){

        res.json({"code" : 101, "status" : "Body in delete request"});




    });

    apiRouter.route('/users/:id').get(async function(req,res){

        try {

            let conn = await pool.getConnection();
            let rows = await conn.query('SELECT * FROM users WHERE id=?',req.params.id);
            conn.release();
            res.json({ status: 'OK', user:rows[0]});

        } catch (e){
            console.log(e);
            return res.json({"code" : 100, "status" : "Error with query"});

        }



    }).delete(async function(req,res){

        try {

            let conn = await pool.getConnection();
            //Body u DELETE requestu nije po REST specifikaciji
            let q = await conn.query('DELETE FROM users WHERE id = ?', req.params.id);
            conn.release();
            res.json({ status: 'OK', affectedRows :q.affectedRows });

        } catch (e){
            res.json({ status: 'NOT OK' });
        }

    });



    return apiRouter;


};
