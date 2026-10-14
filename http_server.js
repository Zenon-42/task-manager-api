import http from 'http';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./tasks.db',(err)=>{
    console.log('Database connected');
});
db.run(
    `CREATE TABLE IF NOT EXISTS TASKS(
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        TITLE VARCHAR(50) NOT NULL,
        DESCRIPTION VARCHAR(255),
        STATUS VARCHAR(20) DEFAULT 'pending'
    )`,(err)=>{
        if(err) { console.log('Table creation failed',err.message);
            return;
        }
        console.log('Table created');

    });

const getTasks = () => {
    return new Promise((resolve,reject)=>{
        db.all('SELECT * FROM TASKS',[],(err,rows)=>{
            if(err) return reject(err);
            else resolve(rows);
        });
    });
};

const getTaskByID = (id) => {
    return new Promise((resolve,reject)=>{
        db.get('SELECT * FROM TASKS WHERE ID = ?', [id], (err,rows)=>{
            if(err) return reject(err);
            else resolve(rows);
        });
    });
};

const postTasks = (title,description,status) =>{
    return new Promise((resolve,reject)=>{
        db.run('INSERT INTO TASKS(TITLE,DESCRIPTION,STATUS) VALUES(?,?,?)',[title,description ?? null,status ?? 'pending'],function(err){
            if(err) return reject(err);
            else resolve(this.lastID);
        });
    });
};

const putTasks = (id,title,description,status) =>{
    return new Promise((resolve,reject) =>{
        db.run('UPDATE TASKS SET TITLE = ?, DESCRIPTION = ?, STATUS = ? WHERE ID = ?',[title,description ?? null,status ?? 'pending',id],
            function(err){
            if(err) return reject(err);
            else resolve(this.changes);
        });
    });
};

const deleteTasks = (id) =>{
    return new Promise((resolve,reject)=>{
        db.run(
            `DELETE FROM TASKS WHERE ID = ?`,[id],
            function(err){
                if(err){
                    return reject(err);
                }
                resolve(this.changes);
            }
        );
    });
}

const server = http.createServer(async(req,res)=>{
    const sendJson = (StatusCode,data) => {
        res.writeHead(StatusCode,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    };
    if(req.method === 'GET' && req.url === '/tasks'){
        try{
            const data = await getTasks();
            sendJson(200,data);
        }
        catch(err){
            sendJson(500,{error:err.message});
        }
    }

    // get task by id
        if(req.method === 'GET' && req.url.startsWith('/tasks/')){
        try{
            const id = Number(req.url.split('/')[2]);
            const data = await getTaskByID(id);
            if(!data){
                return sendJson(400,{error:'Task ID is required'});
            }
            
            sendJson(200,data);
        }
        catch(err){
            sendJson(500,{error:err.message});
        }
    }


    if(req.method === 'PUT' && req.url.startsWith('/tasks/')){
        let body ='';
        req.on('data',(chunks) =>{
            body += chunks;
        });
        req.on('end',()=>{
            try{
                const id = req.url.split('/')[2];
                const {title,description,status} = JSON.parse(body);
                putTasks(id,title,description,status).then((changes)=>{
                    if(changes === 0){
                        return sendJson(404,{error:'Task not found'});
                    }
                    sendJson(200,{message:'Task updated successfully'});
                    }).catch((err)=>{
                        sendJson(500,{error:err.message});
                    });
            } catch(err){
                sendJson(500,{error:err.message});
            }
        });
    }
    if(req.method === 'POST' && req.url === '/tasks'){
        let body = '';
        req.on('data',(chunks)=>{
            body += chunks;
        });
        req.on('end',()=>{
            try{
                const {title,description,status} = JSON.parse(body);
                postTasks(title,description,status).then((id)=>{
                    sendJson(201,{id});
                }).catch((err)=>{
                    sendJson(500,{error:err.message});
                });
            } catch(err){
                sendJson(500,{error:err.message});
            }
        });
    }

    if(req.method === 'DELETE' && req.url.startsWith('/tasks/')){
        const id = req.url.split('/')[2];
        deleteTasks(id).then((changes)=>{
            if(changes === 0){
                return sendJson(404,{error:'Task not found'});
            }
            sendJson(200,{message:'Task deleted successfully'});
        }).catch((err)=>{
            sendJson(500,{error:err.message});
        });
    }



});

server.listen(3000,()=>{
    console.log('Server listening on port 3000');
});