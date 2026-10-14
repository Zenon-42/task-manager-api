// NOT YET COMPLETED


import express from "express";
import sqlite3 from "sqlite3";

const app = express();
const db = new sqlite3.Database("tasks.db");

function run(sql, params = []) {
    return new Promise((resolve,reject)=>{
        db.run(sql, params, function(err){
            if (err) return reject(err);
            resolve({lastID: this.lastID,changes: this.changes});
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve,reject)=>{
        db.get(sql,params,(err,row)=>{
            if(err) return reject(err);
            resolve(row);
        });
    });
}

function all(sql, params = []){
    return new Promise((resolve,reject)=>{
        db.all(sql,params,(err,rows)=>{
            if(err) return reject(err);
            resolve(rows);
        });
    });
}


// helper fuction

const sleep = (ms) => new Promise((res) => setTimeout(res,ms));

class HttpError extends Error{
    constructor(status,message){
        super(message);
        this.status = status;
    }
}

// init table

async function init(){
    await run(`CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEST NOT NULL,
        done INTEGER DEFAULT 0,
        created_at TExt DEFAULT CURRENT_TIMESTAMP)`);
}

// GET ALL


